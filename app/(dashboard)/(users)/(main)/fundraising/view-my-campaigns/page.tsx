'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/ui/loader';
import Eye from '@/icons/eye';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { IMyCampaignList, MyCampaignsService } from '@/app/api/dashboard/fundraising';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const FundRaising = () => {
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [campaigns, setCampaigns] = useState<IMyCampaignList[]>([]);
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await MyCampaignsService.getMyCampaigns(currentUser?.Id);
        if (response.status === 200) {
          setCampaigns(response.data.Result as IMyCampaignList[]);
          setLoader(false);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setLoader(false);
      }
    };

    fetchCampaigns();
  }, []);

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

        <div className="overflow-x-auto px-5">
          {campaigns.length > 0 ? (
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                    Purpose Of Fund
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                    Raised
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                    Duration
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                    Description
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length > 0 ? (
                  campaigns?.map((campaign, index) => (
                    <tr key={index}>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        {capitalizeFirstLetter(campaign?.Purpose)}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        ${campaign.Goal?.toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        ${campaign?.CampaignCurrentFund?.toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        {moment(campaign?.Duration)
                          .fromNow()
                          .replaceAll('in ', '')}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        {campaign?.Summary}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t cursor-pointer">
                        <Eye
                          className="w-6 h-6"
                          onClick={() =>
                            router.push(`/fundraising/${campaign?.Id}`)
                          }
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <>No campaigns</>
                )}
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

export default FundRaising;
