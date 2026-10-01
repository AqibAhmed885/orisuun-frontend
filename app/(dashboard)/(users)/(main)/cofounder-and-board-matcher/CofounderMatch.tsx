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
  rejectMatchedRequest,
  getComplementaryCoFounderJobs,
  getComplementaryBoardMemberJobs,
} from '../../../../api/dashboard/coFounder';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import Shimmer from '@/components/ui/shimmer'; // Add import
import EmptyIcon from '@/icons/community/empty';
import { getOpportunityVisitors } from '@/app/api/dashboard/businessDevelopment';
import axios from 'axios';
import { getRecommendedUsersForOpportunity } from '@/server-actions/businessDevelopment';
import { ChevronRight } from 'lucide-react';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { TypeIcons } from '@/utils/helper';

const CofounderMatch = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<'cofounder' | 'bod'>('cofounder');
  const [coFounders, setCoFounders] = useState<any[]>([]);
  const [selectCoFounder, setSelectCoFounder] = useState(null);
  const [coFounderMatches, setCoFounderMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [complementaryPosts, setComplementaryPosts] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const [selectedOpportunityUserId, setSelectedOpportunityUserId] = useState<number | null>(null);
  const [opportunityMatch, setOpportunityMatch] = useState<any[]>([]);
  const [interestedLoading, setInterestedLoading] = useState(false);
  const isMobile = useMobileMediaQuery();


  // fetch complementary posts (calls different endpoints depending on selected type)
  const fetchComplementaryAndSuggested = React.useCallback(async (opportunityId?: number, ownerId?: number) => {
    if (!opportunityId) {
      setComplementaryPosts([]);
      setSuggestedUsers([]);
      return;
    }
    setMatchesLoading(true);
    try {
      const compPromise =
        selected === 'cofounder'
          ? getComplementaryCoFounderJobs(opportunityId)
          : getComplementaryBoardMemberJobs(opportunityId);

      const recommendedPromise = getRecommendedUsersForOpportunity(opportunityId);

      const [compRes, sugRes] = await Promise.all([compPromise, recommendedPromise]);

      setComplementaryPosts(compRes);
      setSuggestedUsers(sugRes?.data);
    } catch (err) {
      console.error('fetchComplementaryAndSuggested error', err);
    } finally {
      setMatchesLoading(false);
    }
  }, [selected]);

  // suggested users
  useEffect(() => {
    const fetchCoFounders = async () => {
      try {
        setLoading(true); // Set loading
        const userData = JSON.parse(localStorage.getItem('userData'));
        const result = await getBusinessMemberOpportunities(
          selected === 'cofounder' ? 2 : 1002,
          userData.Id
        );

        setCoFounders(result);
        setSelectCoFounder(result[0]?.Id);
        setSelectedOpportunity(result[0]?.Id ?? null);
      } catch (error) {
        setCoFounders([]);
        setSelectCoFounder(null);
      } finally {
        setLoading(false); // Reset loading
      }
    };
    fetchCoFounders();
  }, [selected]);


  const handleDelete = async (id) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
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
            selected === 'cofounder' ? 2 : 1002,
            userData.Id
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
        setMatchesLoading(true); // Set loading
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (selectCoFounder) {
          const matches = await getMatchedList(selectCoFounder, userData?.Id);
          setCoFounderMatches(matches);
        }
      } catch (error) {
        setCoFounderMatches([]);
      } finally {
        setMatchesLoading(false); // Reset loading
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
        if (selectCoFounder) {
          const matches = await getMatchedList(selectCoFounder, userData?.Id);
          setCoFounderMatches(matches);
        }
      }
    } catch (error) {
      setCoFounderMatches([]);
      toast.error(error?.response?.data?.Message || 'Something went wrong');
    }
  };

  /** 🔹 Fetch visitors */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const opportunityId = selectCoFounder ?? selectedOpportunity;
      if (!opportunityId) {
        if (mounted) setOpportunityMatch([]);
        return;
      }

      try {
        setInterestedLoading(true);
        const res = await getOpportunityVisitors(String(opportunityId));
        const recentVisitors =
          res?.Result?.RecentVisitors ??
          res?.result?.RecentVisitors ??
          res?.RecentVisitors ??
          res?.data?.Result?.RecentVisitors ??
          res?.data?.RecentVisitors ??
          res?.Result ??
          res?.data ??
          [];

        const visitorsArray = Array.isArray(recentVisitors) ? recentVisitors : [];
        if (mounted) setOpportunityMatch(visitorsArray);
      } catch (error) {
        console.error('getOpportunityVisitors error:', error);
        if (mounted) setOpportunityMatch([]);
        toast.error(error?.response?.data?.Message || 'Failed to fetch interested users');
      } finally {
        if (mounted) setInterestedLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectCoFounder, selectedOpportunity]);


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
              <p className="px-4 py-3">Co-Founder Posts</p>
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
              <p className="px-4 py-3">Board of Directors Posts</p>
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
          <Link href={'/cofounder-and-board-matcher/create-new'}>
            <Button title="Create New"></Button>
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-6 h-full">
          <div className="col-span-12 md:col-span-4 border shadow-md bg-white px-2 md:px-4 rounded-t-lg overflow-y-auto">
            <p className="py-4 pe-3 mb-2 text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold md:block hidden sticky bg-white top-0">
              {selected === 'cofounder'
                ? 'Co-Founder Posts'
                : 'Board of Directors Posts'}
            </p>
            <div className="space-y-4">
              {loading ? ( // Show shimmer cards while loading
                Array.from({ length: 6 }).map((_, index) => ( // Show 3 shimmer cards
                  <div key={index} className="rounded-md p-4 space-y-6 border border-grey-600">
                    <Shimmer className="h-6 w-3/4 mb-5" />
                    <Shimmer className="h-4 w-full" />
                    <Shimmer className="h-4 w-5/6" />
                  </div>
                ))
              ) : coFounders?.length > 0 ? coFounders?.map((data, index) => (
                <div
                  key={index}
                  className={cn(
                    'rounded-md p-4 space-y-6',
                    selectCoFounder === data?.Id
                      ? 'border-[#A0BCF9] border-2'
                      : 'border-grey-600 border',
                    { 'border-none': isMobile }
                  )}
                  onClick={() => {
                    setSelectCoFounder(data?.Id);
                    setSelectedOpportunity(data?.Id);
                    setSelectedOpportunityUserId(data?.UserId ?? data?.CreatedBy ?? null);
                    fetchComplementaryAndSuggested(data?.Id, data?.UserId ?? data?.CreatedBy ?? null);
                  }}

                >
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <h5
                      className="text-h5 2xl:text-scaled-h5 text-olblue-900 font-semibold"
                    >
                      {selected == "cofounder" ? data?.RoleSought : data?.PostTitle}
                    </h5>
                    <div className="flex items-center gap-0.5">
                      <button className="w-8 h-8 rounded-full flex items-center justify-center border border-omblue-100 text-omblue-600">
                        <EditIcon className="w-4 h-4" onClick={() => router.push(`/cofounder-and-board-matcher/update/${data?.Id}`)} />
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
                    <div className="text-blue-400 text-h9 2xl:text-scaled-h9 font-medium">
                      <div className='text-editor'
                        dangerouslySetInnerHTML={{ __html: data?.RoleDescription }}
                      />
                    </div>
                  </div>}
                  <div className="space-y-3">
                    <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                      Preferred Experience
                    </p>
                    <div className="text-blue-400 text-h9 2xl:text-scaled-h9 font-medium">
                      <div className='text-editor'
                        dangerouslySetInnerHTML={{ __html: data?.PreferredExperienceDescription }}
                      />
                    </div>
                  </div>
                </div>
              )) :
                <div className='flex flex-col gap-5 items-center min-h-[60vh] w-fullborder-grey-600 p-10 justify-center text-center'>
                  <EmptyIcon />
                  {selected === 'cofounder' ? 'Your Co-Founder posts will appear here' : 'Your Board Member posts will appear here '}
                </div>
              }
            </div>
          </div>

          <div className="col-span-8 md:flex hidden flex-col border shadow-md bg-white px-2 md:px-4 rounded-t-lg overflow-hidden">
            <h6 className="py-4 pe-3 mb-2 text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold px-2 sticky top-0 bg-white z-10">
              {selected === 'cofounder' ? 'Co-Founder' : 'Board of Directors'} Matches
            </h6>

            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="grid grid-cols-5 bg-[#F2F6FF] text-[#0A193A] rounded-lg p-3">
                <div className="col-span-2 text-start text-h8 2xl:text-scaled-h8 font-semibold">Profile</div>
                <div className="col-span-2 text-start text-h8 2xl:text-scaled-h8 font-semibold">Status</div>
                <div className="text-start text-h8 2xl:text-scaled-h8 font-semibold">Actions</div>
              </div>

              <div className="flex-grow overflow-y-auto">
                {matchesLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-5 border-b border-grey-600 p-3">
                      <div className="col-span-2">
                        <Shimmer className="h-12 w-12 rounded-full mb-2" />
                        <Shimmer className="h-4 w-3/4 mb-1" />
                        <Shimmer className="h-3 w-1/2" />
                      </div>
                      <div className="col-span-2">
                        <Shimmer className="h-4 w-1/2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Shimmer className="h-8 w-8 rounded-full" />
                        <Shimmer className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    { /* Section 1 — Users who have shown interest */}
                    {(opportunityMatch?.length || 0) > 0 && (
                      <>
                        <div className="text-sm font-semibold text-blue-600 pt-3 pb-2">Users who have shown interest</div>
                        {opportunityMatch.map((m, idx) => (
                          <div key={idx} className="grid grid-cols-5 border-b border-grey-600 p-3 items-center">
                            <div className="col-span-2">
                              <ProfileCard
                                variant="sm"
                                name={m?.VisitorCompanyName || m?.Name}
                                company={m?.ProfileType}
                                icon={TypeIcons[m?.ProfileType]}
                                isImage={false}
                                image={m?.
                                  VisitorProfilePicture || BASE_URL}
                              />
                            </div>

                            <div className={cn('col-span-2 text-h10 2xl:text-scaled-h10 font-medium flex items-center', m?.IsBDCreatedUserProfileMatched ? 'text-green-500' : 'text-blue-500')}>
                              <div className="relative ml-2 group">
                                {m?.IsBDCreatedUserProfileMatched ? 'Mutually Matched' : 'Interested'}
                                <div className="hidden group-hover:block absolute left-0 -top-14 w-56 p-2 text-xs bg-black-200 text-white rounded z-20">
                                  {m?.IsBDCreatedUserProfileMatched ? 'Mutually Matched: you both confirmed' : 'user clicked match on this post'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {!m?.HasChatted && (
                                <button className="border border-blue-100 p-2 rounded-full" onClick={() => {/* open chat */ }}>
                                  <Image src={message} alt="message" width={16} height={16} className="w-4 h-4" />
                                </button>
                              )}
                              {/* {!m?.IsBDCreatedUserProfileMatched && (
                                <button className="border border-omblue-100 p-2 rounded-full" >
                                  Mutual Match
                                </button>
                              )} */}
                              <button
                                className="border border-omblue-100 p-2 rounded-full"
                                onClick={() => {
                                  router.push(`/profile/${add2040ToProfileDetailsId( m?.profileId)}`);
                                }}
                                title="Profile Details"
                              >
                                <ChevronRight className="w-4 h-4 text-omblue-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    { /* Section 2 — Complementary Posts */}
                    {(complementaryPosts?.length || 0) > 0 && (
                      <>
                        <div className="text-sm font-semibold text-blue-600 pt-6 pb-2">Complementary Posts</div>
                        {complementaryPosts.map((post, i) => (
                          <div key={i} className="grid grid-cols-5 border-b border-grey-600 p-3 items-center">
                            <div className="col-span-2">
                              <div className="text-h10 font-semibold">{post?.PostTitle || post?.Title}</div>
                              {post?.Subtitle && <div className="text-sm text-gray-500">{post?.Subtitle}</div>}
                            </div>
                            <div className="col-span-2 text-green-600 font-medium">Active</div>
                            <div className="flex items-center gap-2">
                              {/* <button className="border border-blue-100 p-2 rounded-full" onClick={() => {}}>
                                Match
                              </button> */}
                              <button
                                className="border border-omblue-100 p-2 rounded-full"
                                onClick={() => {
                                  router.push(`/cofounder-and-board-matcher/${post?.Id}`);
                                }}
                                title="View Post"
                              >
                                <ChevronRight className="w-4 h-4 text-omblue-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    { /* Section 3 — Suggested Users */}
                    {(suggestedUsers?.length || 0) > 0 && (
                      <>
                        <div className="text-sm font-semibold text-blue-600 pt-6 pb-2">Suggested Users</div>
                        {suggestedUsers.map((u, i) => (
                          <div key={i} className="grid grid-cols-5 border-b border-grey-600 p-3 items-center">
                            <div className="col-span-2">
                              <ProfileCard
                                variant="sm"
                                name={u?.User?.CompanyName}
                                company={u?.ProfileType}
                                icon={TypeIcons[u?.ProfileType]}
                                isImage={false}
                                image={u?.User?.ProfilePicture || BASE_URL}
                              />
                            </div>
                            <div className="col-span-2 text-h10 2xl:text-scaled-h10 font-medium text-gray-700">
                              {u?.Score ? ` ${u?.Score} %` : 'No match score available'}
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="border border-omblue-100 p-2 rounded-full" onClick={() => {/* view profile */ }}>
                                <Image src={message} alt="message" width={16} height={16} className="w-4 h-4" />
                              </button>
                              <button
                                className="border border-omblue-100 p-2 rounded-full"
                                onClick={() => {
                                  router.push(`/profile/${add2040ToProfileDetailsId(u?.User?.Id)}`);
                                }}
                                title="Profile Details"
                              >
                                <ChevronRight className="w-4 h-4 text-omblue-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}

                { /* Improved empty / loading / no-match UX */}
                {!matchesLoading && (opportunityMatch?.length || 0) === 0 && (complementaryPosts?.length || 0) === 0 && (suggestedUsers?.length || 0) === 0 && (
                  <div className='flex flex-col gap-5 items-center min-h-[60vh] w-fullborder-grey-600 p-10 justify-center text-center'>
                    <EmptyIcon />
                    Your matches will appear here
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CofounderMatch;