'use client';

import { useEffect, useState } from 'react';
import { Button } from '@headlessui/react';
import Loader from '@/components/ui/loader';
import swal from 'sweetalert';
import Tooltip from '@/components/ui/tooltip';
import { CampaignManagementService } from '@/app/api/dashboard/fundraising';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';

const ViewCampaigns = () => {
  const [loader, setLoader] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  // const getLabelFromValue = (value) => {
  //   const amountMap = {
  //     '5K': '$5K',
  //     '10K': '$10K',
  //     '15K': '$15K'
  //   };

  //   const durationMap = {
  //     'SixMonths': 'Six Months',
  //     'OneYear': 'One Year',
  //     'TwoYears': 'Two Years'
  //   };

  //   return amountMap[value] || durationMap[value] || value;
  // };
  const fetchCampaigns = async () => {
    try {
      const response = await CampaignManagementService.getAllCampaigns(currentUser?.Token, currentUser?.Id);
      if (response.status === 200) {
        setCampaigns(response.data.Result);
        setLoader(false);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (campaignId, type = 'soft') => {
    try {
      const willDelete = await swal({
        title: 'Are you sure?',
        text: type === 'soft'
          ? 'This will mark the campaign as deleted. Are you sure?'
          : 'This will permanently delete the campaign. This action cannot be undone!',
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
            text: type === 'soft' ? 'Delete' : 'Delete Permanently',
            value: true,
            visible: true,
            className: 'swal-button--confirm',
            closeModal: false,
          },
        },
      });

      if (willDelete) {
        await CampaignManagementService.deleteCampaign(campaignId, currentUser?.Token);
        fetchCampaigns();
        swal('Deleted!', `Campaign has been ${type === 'soft' ? 'moved to trash' : 'permanently deleted'}!`, 'success');
      } else {
        swal('Cancelled', 'Your campaign is safe.', 'info');
      }
    } catch (err) {
      swal('Failed!', 'Failed to delete campaign.', 'error');
    }
  };

  const handleRestore = async (campaignId) => {
    try {
      const willRestore = await swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to restore this campaign?',
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
        await CampaignManagementService.RestoreCampaign(campaignId, currentUser?.Token);
        fetchCampaigns();
        swal('Restored!', 'Campaign has been restored!', 'success');
      } else {
        swal('Cancelled', 'Your Campaign remains in trash.', 'info');
      }
    } catch (err) {
      swal('Failed!', 'Failed to restore event.', 'error');
    }
  };

  const handleToggleStatus = async (campaignId) => {
    try {
      const res = await CampaignManagementService.toggleCampaignStatus(campaignId, currentUser?.Token);
      if (res.status === 200) {
        setCampaigns(campaigns.map(campaign =>
          campaign.Id === campaignId
            ? { ...campaign, Status: campaign.Status === 1 ? 0 : 1 }
            : campaign
        ));
        swal('Success!', 'Campaign status updated!', 'success');
      } else {
        swal('Failed!', 'Failed to update campaign status.', 'error');
      }
    } catch (error) {
      swal('Failed!', 'Failed to update campaign status due to an error.', 'error');
    }
  };


  return loader ? (
    <Loader />
  ) : (
    <div className="p-6 tracking-wide">
      <div className="bg-white rounded-lg shadow-md py-5">
        <div className="flex justify-between items-center mb-4 pe-5">
          <h2 className="text-xl font-semibold text-[#0B1636] flex items-center gap-3">
            <div className="h-12 w-[8px] rounded-r-lg bg-[#0B1636]"></div>
            <span>Campaigns</span>
          </h2>
        </div>

        <div className="">
          {campaigns.length > 0 ? (
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 text-gray-600">
                    S.No.
                  </th>
                  <th className="py-3 text-gray-600">
                    Member Name
                  </th>
                  <th className="py-3 text-gray-600">
                    Purpose
                  </th>
                  <th className="py-3 text-gray-600">
                    Amount
                  </th>
                  <th className="px-2 py-3 text-gray-600">
                    Expiration Date
                  </th>
                  <th className="py-3 text-gray-600">
                    Created Date
                  </th>
                  <th className="px-2 py-3 text-gray-600">
                    Status
                  </th>
                  <th className="py-3 text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, index) => (
                  <tr key={index}>
                    <td className="px-2 py-3 text-center text-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-2 py-3 text-center text-gray-800 cursor-pointer hover:underline"
                      onClick={() => {
                        if (!campaign.MemberName) return;
                        const url = `/profile/${add2040ToProfileDetailsId(Number(campaign.UserProfileId))}`;
                        window.open(url, '_blank');
                      }}>
                      {campaign.MemberName || "N/A"}
                    </td>
                    <td className="px-2 py-3 text-center text-gray-800">
                      {campaign.FundPurpose}
                    </td>
                    <td className="px-2 py-3 text-center text-gray-800">
                      {'$' + campaign.Goal}
                    </td>
                    <td className="px-2 py-3 text-center text-gray-800">
                      {new Date(campaign.Duration).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-3 text-center text-gray-800">
                      {new Date(campaign.CreatedDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-3 text-center text-gray-800">
                      {campaign.Status == 1 ? (
                        <span className="text-green-500">Active</span>
                      ) : (
                        <span className="text-yellow-500">Paused</span>
                      )}
                    </td>
                    <td className="px-2 py-3 text-center text-gray-800">
                      <div className="flex gap-3 items-center justify-center">
                        {
                          campaign.IsDeleted &&
                          (
                            <>
                              <Tooltip content={'Restore'}>
                                <Button
                                  className={`p-3 text-white w-[40px] h-[40px] rounded-full`}
                                  onClick={() => handleRestore(campaign.Id)}
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
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                  >
                                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                    <path d="M21 3v5h-5"></path>
                                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                    <path d="M8 16H3v5"></path>
                                  </svg>
                                </Button>
                              </Tooltip>
                              <Tooltip content={campaign.IsDeleted ? 'Delete Permanent' : 'Soft Delete'}>
                                <Button
                                  className="bg-red-100 p-3 text-white w-[40px] h-[40px] rounded-full"
                                  onClick={() => handleDelete(campaign.Id, campaign.IsDeleted ? 'permanent' : 'soft')}
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
                            </>
                          )
                        }
                        {!campaign.IsDeleted && (
                          <>
                            <Tooltip content={campaign.Status === 1 ? 'Pause Campaign' : 'Activate Campaign'}>
                              <Button
                                className="p-3 w-[40px] h-[40px] rounded-full"
                                onClick={() => handleToggleStatus(campaign.Id)}
                              >
                                {campaign.Status === 1 ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="6" y="4" width="4" height="16"></rect>
                                    <rect x="14" y="4" width="4" height="16"></rect>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                  </svg>
                                )}
                              </Button>
                            </Tooltip>


                            <Tooltip content="Deactivate campaign">
                              <Button
                                className="bg-red-100 p-3 text-white w-[40px] h-[40px] rounded-full"
                                onClick={() => handleDelete(campaign.Id)}
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No campaigns available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCampaigns;