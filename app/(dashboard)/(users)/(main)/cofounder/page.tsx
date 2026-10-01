'use client';
import Button from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import ProfileCard from '@/components/cards/profile-card';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import message from '@/public/images/vector/message.svg';
import transfer from '@/public/images/vector/exhange.svg';
import cross from '@/public/images/vector/cross.svg';
import Hamburger from '@/icons/sidebar/hamburger';
import { Select } from '@headlessui/react';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import EditIcon from '@/icons/edit-icon';
import Trash from '@/icons/trash';
import Link from 'next/link';
import Consultant from '@/icons/consultant';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import {
  getBusinessMemberOpportunities,
  deleteBusinessMemberOpportunity,
  getMatchedList,
  rejectMatchedRequest
} from '../../../../api/dashboard/coFounder';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

const CofounderMatch = () => {
  const router = useRouter();
  const [selected, setSelected] = useState('cofounder');
  const [coFounders, setCoFounders] = useState([]);
  const [selectCoFounder, setSelectCoFounder] = useState(null);
  const [coFounderMatches, setCoFounderMatches] = useState([]);
  const isMobile = useMobileMediaQuery();

  useEffect(() => {
    const fetchCoFounders = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const teamData = JSON.parse(localStorage.getItem('teamData'));
        const result = await getBusinessMemberOpportunities(
          selected === 'cofounder' && 2,
          (teamData && teamData?.isActive) ? teamData?.teamId : userData.Id
        );
        setCoFounders(result);
        setSelectCoFounder(result[0]?.Id);
      } catch (error) {
        setCoFounders([]);
        setSelectCoFounder(null);
      }
    };
    fetchCoFounders();
  }, [selected]);

  const handleDelete = async (id) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const teamData = JSON.parse(localStorage.getItem('teamData'));
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this item? This action cannot be undone.",
        icon: "warning",
        dangerMode: true,
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "swal-button--cancel",
            closeModal: true,
          },
          confirm: {
            text: "Confirm",
            value: true,
            visible: true,
            className: "swal-button--confirm",
            closeModal: false,
          }
        },
      });

      if (willDelete) {
        const response = await deleteBusinessMemberOpportunity(id, userData?.Id);
        if (response.status === 200) {
          toast.success("BusinessMember deleted successfully");
          swal("Deleted!", "Your item has been deleted!", "success");
          const result = await getBusinessMemberOpportunities(
            selected === 'cofounder' && 2,
            (teamData && teamData?.isActive) ? teamData?.teamId : userData.Id
          );
          setCoFounders(result);
          setSelectCoFounder(result[0]?.Id);
        } else {
          toast.error(response.data?.Message || 'Your opportunity was not deleted');
          swal("Failed!", "Your opportunity was not deleted.", "error");
        }
      } else {
        swal("Cancelled", "Your item is safe.", "info");
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Your opportunity was not deleted');
      swal("Failed!", "Your opportunity was not deleted", "error");
    }
  };

  useEffect(() => {
    const fetchCoFounderMatches = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const teamData = JSON.parse(localStorage.getItem('teamData'));
        if (selectCoFounder) {
          const matches = await getMatchedList(selectCoFounder, (teamData && teamData?.isActive) ? teamData?.teamId : userData?.Id);
          setCoFounderMatches(matches);
        }
      } catch (error) {
        setCoFounderMatches([]);
      }
    };
    fetchCoFounderMatches();
  }, [selectCoFounder]);

  const handleReject = async (id) => {
    try {
      const response = await rejectMatchedRequest(id);
      if (response.status === 200) {
        toast.success("Rejection completed");
        const userData = JSON.parse(localStorage.getItem('userData'));
        const teamData = JSON.parse(localStorage.getItem('teamData'));
        if (selectCoFounder) {
          const matches = await getMatchedList(selectCoFounder, (teamData && teamData?.isActive) ? teamData?.teamId : userData?.Id);
          setCoFounderMatches(matches);
        }
      }
    } catch (error) {
      setCoFounderMatches([]);
      toast.error(error?.response?.data?.Message || 'Something went wrong');
    }
  };

  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));

  return (
    <div className="px-4 md:px-6 h-screen">
      <div className="md:hidden flex items-center justify-between py-4">
        <Hamburger className="hamburger-top-icon" />
        <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
          Co Founder And Board Matcher
        </p>
        <Image
          src={
            currentUser?.ProfilePicture || BASE_URL
          }
          alt="user"
          width={32}
          height={32}
          className="rounded-full h-8 w-8 me-2"
        />
      </div>
      <div className="pt-6 h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="hidden md:flex items-center gap-6 text-h7 2xl:text-scaled-h7">
            <button
              onClick={() => setSelected('cofounder')}
              className={cn(
                'cursor-pointer border-b-2',
                selected === 'cofounder'
                  ? 'border-omblue-600 text-omblue-600 font-semibold'
                  : 'text-[#797B82] border-transparent font-medium'
              )}
            >
              <p className="px-4 py-3">Find Co-Founder</p>
            </button>
            <button
              onClick={() => setSelected('bod')}
              className={cn(
                'cursor-pointer border-b-2',
                selected === 'cofounder'
                  ? 'text-[#797B82] border-transparent font-medium'
                  : 'border-omblue-600 text-omblue-600 font-semibold'
              )}
            >
              <p className="px-4 py-3">Become Co-Founder</p>
            </button>
          </div>
          <Select
            className={
              'text-omblue-600 md:hidden flex-1 w-full focus-visible:outline-none'
            }
          >
            <option className="text-h9 2xl:text-scaled-h9 font-semibold">
              Co-Founder Posts
            </option>
            <option className="text-h9 2xl:text-scaled-h9 font-semibold">
              Board of Directors Posts
            </option>
          </Select>
          <Link href={'/cofounder/create-new'}>
            <Button title="Create New"></Button>
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-6 h-full">
          <div className="col-span-12 md:col-span-4 border shadow-md bg-white px-2 md:px-4 rounded-t-lg overflow-y-auto">
            <p className="py-4 pe-3 mb-2 text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold md:block hidden bg-white sticky top-0">
              {selected === 'cofounder'
                ? 'Find Co-Founder Posts'
                : 'Become Co-Founder Posts'}
            </p>
            <div className="space-y-4">
              {coFounders?.length > 0 ? coFounders?.map((data, index) => (
                <div
                  key={index}
                  className={cn(
                    'rounded-md p-4 space-y-6',
                    selectCoFounder === data?.Id
                      ? 'border-[#A0BCF9] border-2'
                      : 'border-grey-600 border',
                    { 'border-none': isMobile }
                  )}
                  onClick={() => setSelectCoFounder(data?.Id)}
                >
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <h5
                      className="text-h5 2xl:text-scaled-h5 text-olblue-900 font-semibold"
                    >
                      {selected == "cofounder" ? data?.RoleSought : data?.PostTitle}
                    </h5>
                    <div className="flex items-center gap-0.5">
                      <button className="w-8 h-8 rounded-full flex items-center justify-center border border-omblue-100 text-omblue-600">
                        <EditIcon className="w-4 h-4" onClick={() => router.push(`/cofounder/update/${data?.Id}`)} />
                      </button>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center border border-danger-100 text-danger-600">
                        <Trash className="w-4 h-4" onClick={() => handleDelete(data?.Id)} />
                      </button>
                    </div>
                  </div>
                  {selected == "cofounder" && <div className="space-y-3">
                    <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                      Role Description
                    </p>
                    <p className="text-blue-400 text-h9 2xl:text-scaled-h9 font-medium">
                      <div className='text-editor'
                        dangerouslySetInnerHTML={{ __html: data?.RoleDescription }}
                      />
                    </p>
                  </div>}
                  <div className="space-y-3">
                    <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                      Preferred Experience
                    </p>
                    <p className="text-blue-400 text-h9 2xl:text-scaled-h9 font-medium">
                      <div className='text-editor'
                        dangerouslySetInnerHTML={{ __html: data?.PreferredExperienceDescription }}
                      />
                    </p>
                  </div>
                </div>
              )) :
                <div className='inline-flex w-full border-b border-grey-600 p-10 mt-[44px] justify-center text-center'>
                  No {selected === 'cofounder' ? 'Co-Founder Found' : 'Co-Founder yet'}
                </div>
              }
            </div>
          </div>

          <div className="col-span-8 md:flex hidden flex-col border shadow-md bg-white px-2 md:px-4 rounded-t-lg overflow-hidden">
            <h6 className="py-4 pe-3 mb-2 text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold px-2 sticky top-0">
              {selected === 'cofounder' ? 'Co-Founder' : 'Co-Founder'} Matches
            </h6>
            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="grid grid-cols-5 bg-[#F2F6FF] text-[#0A193A] rounded-lg p-3">
                <div className="col-span-2 text-start text-h8 2xl:text-scaled-h8 font-semibold">
                  Profile
                </div>
                <div className="col-span-2 text-start text-h8 2xl:text-scaled-h8 font-semibold">
                  Status
                </div>
                <div className="text-start text-h8 2xl:text-scaled-h8 font-semibold">
                  Actions
                </div>
              </div>

              <div className="flex-grow overflow-y-auto">
                {coFounderMatches?.length > 0 ? coFounderMatches.map((data, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 border-b border-grey-600 p-3"
                  >
                    <div className="col-span-2">
                      <ProfileCard
                        variant="sm"
                        name={data?.CompanyName}
                        company={data?.Tagline}
                        icon={
                          <Consultant className="text-omblue-600 w-4 h-4" />
                        }
                        isImage={false}
                        image={`${data?.ProfilePicture ? data?.ProfilePicture : BASE_URL}`}
                      />
                    </div>
                    <div
                      className={cn(
                        'col-span-2 text-h10 2xl:text-scaled-h10 font-medium flex items-center',
                        index === 2 ? 'text-blue-500' : 'text-green-500'
                      )}
                    >
                      {data?.IsBDCreatedUserProfileMatched ? 'Mutually Matched' : 'Matched'}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="border border-blue-100 p-2 rounded-full">
                        <Image
                          src={index === 2 ? transfer : message}
                          alt="message"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                      </button>
                      <button className="border border-danger-100 p-2 rounded-full" onClick={() => handleReject(data?.MatchedId)}>
                        <Image
                          src={cross}
                          alt="message"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>
                )) :
                  <div className='className="flex border-b border-grey-600 p-10 justify-center text-center'>
                    No {selected === 'cofounder' ? 'Co-Founder' : 'Co-Founder'} Matches Found For This Post
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CofounderMatch;