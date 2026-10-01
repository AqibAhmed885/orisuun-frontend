'use client';

import Chip from '@/components/ui/chip';
import { RootState } from '@/data/store';
import AccountTree from '@/icons/account-tree';
import Briefcase from '@/icons/briefcase';
import CalenderClock from '@/icons/calender-clock';
import CellPhone from '@/icons/cofounder/cell-phone';
import PersonProfile from '@/icons/cofounder/person-profile';
import Favourite from '@/icons/favourite';
import Globe from '@/icons/globe';
import Handyman from '@/icons/handyman';
import Location from '@/icons/location';
import MessageWriting from '@/icons/message-writing';
import Hamburger from '@/icons/sidebar/hamburger';
import Tick from '@/icons/tick';
import { getBusinessOppurtuniyDetailsById } from '@/server-actions/businessDevelopment';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../../../../../public/defaultProfile/defaultProfile'
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
const BusinessDevelopmentDetails = () => {
  const params = useParams();
  const id = Number(params.id);

  const [businessOpportunityDetails, SetBusinessOpportunity] = useState<
    any | null
  >(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const teamData = useSelector((state: RootState) => state.user.teamData);
  const searchParams = useSearchParams();
  const isNew = searchParams.get('isnew') === 'true';
  const businessId = Number(params.businessId);

  const fetchBusinessOppotunityDetails = useCallback(async () => {
    try {
      if (currentUser?.UserId) {
        const data = {
          UserId: currentUser?.UserId,
          BDId: id,
          isTeam: (teamData && teamData?.isActive) ? true : false,
          teamId: (teamData && teamData?.isActive) ? teamData?.teamId : null
        };
        const response = await getBusinessOppurtuniyDetailsById(data);
        SetBusinessOpportunity(response.data);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  }, [businessId, currentUser]);


  useEffect(() => {
    fetchBusinessOppotunityDetails();
  }, [fetchBusinessOppotunityDetails, currentUser]);

  const setFavourite = async (BdId, isFavourite) => {
    const payload = {
      FavBdPostId: BdId,
      UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.UserId,
    };
    const payloadProfile = {
      [!isFavourite ? 'BDOpportunityId' : 'FavBdPostId']: BdId,
      UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.UserId,
    };

    try {
      const response = await axios.post(
        isFavourite ? `${apiEndpoint}/Favourite/UnFavouriteBdPost` : `${apiEndpoint}/Profile/SetFavouritePost`,
        { ...payloadProfile },
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        fetchBusinessOppotunityDetails();
      }
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };

  return (
    <div className="px-6">
      <div className="md:hidden flex items-center justify-between py-4">
        <Hamburger className="hamburger-top-icon" />
        <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
          Business Development
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
      <div className="py-8 flex flex-col md:h-screen">
        {isNew && (
          <div className="flex items-center gap-2">
            <Tick className="bg-omblue-500 p-1 rounded-full text-white w-5 h-5" />
            <p className="text-omblue-700 font-medium text-h7 2xl:text-scaled-h7">
              Your new business development post was published
            </p>
          </div>
        )}

        <div className="my-8 flex-grow">
          <div className="p-6 border border-grey-600 rounded-md">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex-grow">
                <h5 className="text-olblue-900 font-bold text-h5 2xl:text-scaled-h5">
                  {businessOpportunityDetails?.StrategyName}
                </h5>
                <div className="flex flex-wrap gap-1 py-4">
                  {businessOpportunityDetails?.TacticsName.split(',').map(
                    (opportunity: any, index: any) => (
                      <Chip key={index} text={opportunity} />
                    )
                  )}
                </div>
              </div>
              <button
                className="flex items-center gap-2 border text-omblue-600 border-omblue-600 p-3 rounded-md"
                onClick={() => { }}
              >
                {businessOpportunityDetails?.IsBDMatched ? (
                  <>
                    <MessageWriting className="w-4 h-4" /> Match
                  </>
                ) : (
                  <>
                    <MessageWriting className="w-4 h-4" /> Matched
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 my-4">
              <div className="col-span-1 flex-col justify-around">
                <div className="pe-6 h-full border-r border-grey-600 ">
                  <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500 mb-4">
                    Opportunity Description
                  </p>
                  <p className="text-blue-400 text-h10 2xl:text-scaled-h10 font-medium mb-4">
                    {businessOpportunityDetails?.Description}
                  </p>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Image
                        src={BASE_URL}
                        alt="profile"
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-h8 2xl:text-scaled-h8 font-bold text-black-500">
                          {businessOpportunityDetails?.CompanyName}
                        </p>
                        <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-300">
                          {businessOpportunityDetails?.TagName}
                        </p>
                      </div>
                    </div>
                    <div className="space-x-1 flex items-center">
                      <button className="bg-green-50 border border-omblue-400 p-2 rounded-full"
                        onClick={() => { setFavourite(businessOpportunityDetails?.IsFavProfile ? businessOpportunityDetails.FavPostId : businessOpportunityDetails?.BDId, businessOpportunityDetails?.IsFavProfile) }}
                      >
                        <Favourite fill={businessOpportunityDetails?.IsFavProfile ? '#2357C6' : '#ffffff'} />
                      </button>
                      <button onClick={() => window.open(businessOpportunityDetails?.BusinessWebsite, '_blank')} className="bg-white border border-omblue-100 text-omblue-400 p-2 rounded-full hidden md:block">
                        <Globe />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-h10 2xl:text-scaled-h10 text-blue-400 font-medium">
                  Expiry: {businessOpportunityDetails?.ExpiryDate}
                </p>
              </div>

              <div className="space-y-4 col-span-1">
                <div className="mb-2 space-y-4">
                  <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                    Opportunity Basics
                  </p>
                  <div className="flex items-center gap-2">
                    <Location className="w-4 h-4 text-omblue-600" />
                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                      {businessOpportunityDetails?.RegionName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Handyman className="w-4 h-4 text-omblue-600" />
                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                      {businessOpportunityDetails?.IndustryType}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalenderClock className="w-4 h-4 text-omblue-600" />
                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                      {businessOpportunityDetails?.timeLine}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AccountTree className="w-4 h-4 text-omblue-600" />
                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                      {businessOpportunityDetails?.OpportunityStructure}
                    </p>
                  </div>
                  {/* ))} */}
                </div>
                <div className="mb-2 space-y-4">
                  <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                    Business Development Representative
                  </p>
                  <div className="flex items-center gap-2">
                    <PersonProfile className="w-4 h-4 text-omblue-600" />
                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                      {businessOpportunityDetails?.RepresentativeName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-omblue-600" />
                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                      {businessOpportunityDetails?.Name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <CellPhone className="w-4 h-4 text-omblue-600" />
                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                      {businessOpportunityDetails?.PhoneNumber ||
                        'Not Provided'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Location className="w-4 h-4 text-omblue-600" />
                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                      {businessOpportunityDetails?.Email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button className="border text-omblue-600 border-omblue-600 p-3 rounded-md">
            Back to BD
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDevelopmentDetails;
