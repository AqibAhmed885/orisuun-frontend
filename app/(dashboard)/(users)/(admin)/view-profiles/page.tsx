'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getProfileTypes,
  getAllProfileDetails,
  deleteProfile,
  permanentDeleteProfile,
  verifyUser, restoreProfile
} from '../../../../api/dashboard/viewProfile';
import { Button } from '@headlessui/react';
import Loader from '@/components/ui/loader';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';
import Tooltip from '@/components/ui/tooltip';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import Tick from '@/icons/tick';
import { statusOptions } from '../../../../../data/dashboard/viewProfile'
import { useEffect, useMemo, useState } from 'react';
// Define the zod schema
const formSchema = z.object({
  PurposeOfFunds: z
    .string({ required_error: 'Purpose of funds is required' })
    .min(1, 'Purpose of funds is required'),
  Amount: z
    .string({ required_error: 'Amount is required' })
    .min(1, 'Amount is required'),
  CampaignLength: z
    .string({ required_error: 'Campaign length is required' })
    .min(1, 'Campaign length is required'),
  CampaignDescription: z
    .string({ required_error: 'Campaign description is required' })
    .min(1, 'Campaign description is required'),
});

const ViewProfiles = () => {
  const {
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [showForm, setShowForm] = useState(false);
  const [loader, setLoader] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [profileTypes, setProfileTypes] = useState([]);
  const [selectedProfileType, setSelectedProfileType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all'); // New state for status filter
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const router = useRouter();



  // Fetch profile types
  const fetchProfileTypes = async () => {
    try {
      const response = await getProfileTypes(currentUser?.Token);
      if (response.status === 200) {
        setProfileTypes(response.data.Result);
      }
    } catch (error) {
      // Handle error
    }
  };

  // Filter profiles by selected type and status
  const filteredProfiles = useMemo(() => {
    let result = [...profiles];

    // Filter by profile type
    if (selectedProfileType) {
      result = result.filter(profile =>
        profile.UserProfileType === selectedProfileType
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      switch (selectedStatus) {
        case 'active':
          result = result.filter(profile => !profile.IsDeleted);
          break;
        case 'deleted':
          result = result.filter(profile => profile.IsDeleted);
          break;
        case 'verified':
          result = result.filter(profile => profile.Verified && !profile.IsDeleted);
          break;
        case 'unverified':
          result = result.filter(profile => !profile.Verified && !profile.IsDeleted);
          break;
        default:
          break;
      }
    }

    return result;
  }, [profiles, selectedProfileType, selectedStatus]);

  // Handle profile type change
  const handleProfileTypeChange = (e) => {
    setSelectedProfileType(e.target.value);
  };

  // Handle status change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };


  const handleDelete = async (data) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));

      // Show confirmation dialog
      const willDelete = await swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete this item?',
        icon: 'warning',
        dangerMode: true,
        buttons: {
          cancel: {
            text: 'Cancel',
            value: null,
            visible: true,
            className: 'swal-button--cancel',
            closeModal: true,
          },
          confirm: {
            text: 'Confirm',
            value: true,
            visible: true,
            className: 'swal-button--confirm',
            closeModal: false,
          },
        },
      });

      if (willDelete) {
        const res = await deleteProfile(data, currentUser?.Token);
        if (res.status === 200) {
          const updatedProfiles = profiles.map(profile =>
            profile.Id === data.Id ? { ...profile, IsDeleted: true } : profile
          );
          setProfiles(updatedProfiles);
          swal('Deleted!', 'Your item has been moved to trash!', 'success');
        } else {
          swal('Failed!', 'Failed to delete the item.', 'error');
        }
      } else {
        swal('Cancelled', 'Your item is safe.', 'info');
      }
    } catch (error) {
      swal('Failed!', 'Failed to delete the item due to an error.', 'error');
    }
  };




  const handleRestore = async (data) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));

      // Show confirmation dialog
      const willRestore = await swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to restore this item?',
        icon: 'warning',
        dangerMode: true,
        buttons: {
          cancel: {
            text: 'Cancel',
            value: null,
            visible: true,
            className: 'swal-button--cancel',
            closeModal: true,
          },
          confirm: {
            text: 'Confirm',
            value: true,
            visible: true,
            className: 'swal-button--confirm',
            closeModal: false,
          },
        },
      });

      if (willRestore) {
        const res = await restoreProfile(data?.Id, data?.UserId, currentUser?.Token);

        if (res.status === 200) {
          const updatedProfiles = profiles.map(profile =>
            profile.Id === data.Id ? { ...profile, IsDeleted: false } : profile
          );
          setProfiles(updatedProfiles);
          swal('Restored!', 'Your item has been restored!', 'success');
        } else {
          swal('Failed!', 'Failed to restore the item.', 'error');
        }
      } else {
        swal('Cancelled', 'Your item remains in trash.', 'info');
      }
    } catch (error) {
      swal('Failed!', 'Failed to restore the item due to an error.', 'error');
    }
  };

  const handlePermanentDelete = async (data) => {
    try {
      // Show confirmation dialog
      const willDelete = await swal({
        title: 'Are you sure?',
        text: 'This will permanently delete the item. This action cannot be undone!',
        icon: 'warning',
        dangerMode: true,
        buttons: {
          cancel: {
            text: 'Cancel',
            value: null,
            visible: true,
            className: 'swal-button--cancel',
            closeModal: true,
          },
          confirm: {
            text: 'Delete Permanently',
            value: true,
            visible: true,
            className: 'swal-button--confirm',
            closeModal: false,
          },
        },
      });

      if (willDelete) {
        const res = await permanentDeleteProfile(data, currentUser?.Token);

        if (res.status === 200) {
          const filterData = profiles.filter(
            (profile) => profile.Id !== data.Id
          );
          setProfiles(filterData);
          swal('Deleted!', 'Your item has been permanently deleted!', 'success');
        } else {
          swal('Failed!', 'Failed to delete the item.', 'error');
        }
      } else {
        swal('Cancelled', 'Your item is safe.', 'info');
      }
    } catch (error) {
      swal('Failed!', 'Failed to delete the item due to an error.', 'error');
    }
  };

  const handleVerifyUser = async (data, state) => {
    try {
      if (!data?.UserId) return;
      const res = await verifyUser(data?.UserId, currentUser?.Token);

      if (res.status === 201) {
        if (state) {
          swal('Unverified!', 'User unverified successfully!', 'success');
        } else {
          swal('Verified!', 'User verified successfully!', 'success');
        }
        fetchCampaigns();
      } else {
        swal('Failed!', 'User verification failed.', 'error');
      }
    } catch (error) {
      swal('Failed!', 'User verification failed.', 'error');
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await getAllProfileDetails(currentUser?.Token);
      if (response.status === 200) {
        setProfiles(response.data.Result);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchProfileTypes();
    fetchCampaigns();
  }, []);

  return loader ? (
    <Loader />
  ) : (
    <div className="p-6 tracking-wide">
      {!showForm && (
        <div className="bg-white rounded-lg shadow-md py-5">
          <div className="flex justify-between items-center mb-4 pe-5">
            <h2 className="text-xl font-semibold text-[#0B1636] flex items-center gap-3">
              <div className="h-12 w-[8px] rounded-r-lg bg-[#0B1636]"></div>
              <span>Profiles</span>
            </h2>

            {/* Filters */}
            <div className="flex items-center gap-4">
              {/* Profile Type Filter */}
              <select
                value={selectedProfileType}
                onChange={handleProfileTypeChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Profile Types</option>
                {profileTypes.map((type) => (
                  <option key={type.Id} value={type.UserProfileName}>
                    {type.UserProfileName}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto px-5">
            {filteredProfiles.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200">
                  <tr>
                  <th className="px-2 py-3 me-5 text-left text-sm font-semibold text-gray-600">
                      S.No.
                    </th>
                    <th className="px-2 py-3 me-5 text-left text-sm font-semibold text-gray-600">
                      Name
                    </th>
                    <th className="px-2 py-3 me-5 text-left text-sm font-semibold text-gray-600">
                      Account Type
                    </th>
                    <th className="px-2 py-3 me-5 text-left text-sm font-semibold text-gray-600">
                      Active Status
                    </th>
                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-2 py-3 ps-14 text-left text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile, index) => (
                    <tr key={index}>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        {index+1}.
                      </td>
                      <td
                        className="px-2 py-3 text-sm text-gray-800 border-t cursor-pointer hover:text-blue-600 hover:underline"
                        onClick={() => {
                          const url = `/profile/${add2040ToProfileDetailsId(Number(profile.Id))}`;
                          window.open(url, '_blank');
                        }}
                      >
                        {profile.CompanyName}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        {profile.UserProfileType}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        {profile.ActiveStatus}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        {profile.IsDeleted ? (
                          <span className="text-red-500">Deleted</span>
                        ) : profile.Verified ? (
                          <span className="text-green-500">Verified</span>
                        ) : (
                          <span className="text-yellow-500">Unverified</span>
                        )}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        <div className="flex items-center justify-center gap-3">
                          {!profile.IsDeleted ? (
                            <>
                              <Tooltip content={'Edit'}>
                                <Button
                                  className="bg-omblue-50 p-3 text-white w-[40px] h-[40px] rounded-full"
                                  onClick={() => {
                                    const data = {
                                      ...profile,
                                      Id: profile.UserId,
                                      UserProfileDetailsId: profile.Id,
                                      UserName: currentUser.UserName,
                                    };
                                    localStorage.setItem(
                                      'editProfile',
                                      JSON.stringify(data)
                                    );
                                    router.push(
                                      `/profile/edit-profile/${add2040ToProfileDetailsId(
                                        Number(profile.Id)
                                      )}`
                                    );
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    version="1.1"
                                    width="16"
                                    height="16"
                                    x="0"
                                    y="0"
                                    viewBox="0 0 24 24"
                                  >
                                    <g>
                                      <path
                                        d="m14.46 3.26.88-.88c1.04-1.04 2.85-1.04 3.89 0l.71.71a2.732 2.732 0 0 1 0 3.88l-.88.88-4.6-4.6zM13.4 4.32l-9.11 9.11c-.29.29-.47.67-.5 1.08l-.27 2.93c-.03.37.1.73.36 1 .24.24.55.37.88.37h.11l2.93-.27c.41-.04.79-.22 1.08-.51l9.11-9.11-4.6-4.6zM22.75 22c0-.41-.34-.75-.75-.75H2c-.41 0-.75.34-.75.75s.34.75.75.75h20c.41 0 .75-.34.75-.75z"
                                        fill="#2357c6"
                                        opacity="1"
                                        data-original="#2357c6"
                                      ></path>
                                    </g>
                                  </svg>
                                </Button>
                              </Tooltip>
                              <Tooltip content={'Delete'}>
                                <Button
                                  className="bg-red-100 p-3 text-white w-[40px] h-[40px] rounded-full"
                                  onClick={() => handleDelete(profile)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    version="1.1"
                                    width="16"
                                    height="16"
                                    x="0"
                                    y="0"
                                    viewBox="0 0 24 24"
                                  >
                                    <g>
                                      <path
                                        d="m21 5H3a1 1 0 0 0 0 2h2v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h2a1 1 0 0 0 0-2zM11 16a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm4 0a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zM10 4h4a1 1 0 0 0 0-2h-4a1 1 0 0 0 0 2z"
                                        fill="#ef4444"
                                        opacity="1"
                                        data-original="#ef4444"
                                      ></path>
                                    </g>
                                  </svg>
                                </Button>
                              </Tooltip>
                              <Tooltip content={profile.Verified ? 'Unverify' : 'Verify'}>
                                <Button
                                  className={`p-3 text-white w-[40px] h-[40px] rounded-full ${profile.Verified ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                  onClick={() => handleVerifyUser(profile, profile.Verified)}
                                >
                                  <Tick />
                                </Button>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip content={'Restore'}>
                                <Button
                                  className="bg-blue-100 p-3 text-white w-[40px] h-[40px] rounded-full"
                                  onClick={() => handleRestore(profile)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#2357c6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                    <path d="M21 3v5h-5"></path>
                                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                    <path d="M8 16H3v5"></path>
                                  </svg>
                                </Button>
                              </Tooltip>
                              <Tooltip content={'Delete Permanently'}>
                                <Button
                                  className="bg-red-500 p-3 text-white w-[40px] h-[40px] rounded-full"
                                  onClick={() => handlePermanentDelete(profile)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    version="1.1"
                                    width="16"
                                    height="16"
                                    x="0"
                                    y="0"
                                    viewBox="0 0 24 24"
                                  >
                                    <g>
                                      <path
                                        d="m21 5H3a1 1 0 0 0 0 2h2v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h2a1 1 0 0 0 0-2zM11 16a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm4 0a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zM10 4h4a1 1 0 0 0 0-2h-4a1 1 0 0 0 0 2z"
                                        fill="#ffffff"
                                        opacity="1"
                                        data-original="#ffffff"
                                      ></path>
                                    </g>
                                  </svg>
                                </Button>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No profiles available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfiles;

