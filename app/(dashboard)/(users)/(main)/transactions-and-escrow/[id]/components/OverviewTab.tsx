import ProfileCard from '@/components/cards/profile-card';
import ContractOverview from '@/components/contract/contract-overview';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { TypeIcons } from '@/utils/helper';
import { cn } from '@/utils/utils';
import React from 'react';

const OverViewTab = ({ contractDetails }) => {
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-8 md:border-e border-[#D2D4DA]">
        <ContractOverview admin={true} data={contractDetails} />
      </div>
      <div className={cn('col-span-12 md:col-span-4')}>
        <>
          <h6 className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500 mb-4">
            Member Details
          </h6>
          {contractDetails?.team?.length > 0 ? (
            contractDetails?.team?.map((team, index) => (
              <div className="my-4" key={index}>
                <ProfileCard
                  image={
                    team?.ProfilePicture ||
                    BASE_URL
                  }
                  name={team.Name}
                  company={team.UserProfileType}
                  icon={TypeIcons[team.UserProfileType]}
                  isImage={false}
                  key={index}
                  profileId={team.UserProfileId}
                />
              </div>
            ))
          ) : (
            <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 my-4">
              No team members found.
            </p>
          )}
          {contractDetails?.escrowContract?.ContractCreatorId !==
            currentUser.Id && (
              <>
                <h6 className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500 mb-4 mt-8">
                  Client Details
                </h6>
                {!!contractDetails?.ClientDetails ? (
                  <div className="my-2">
                    <ProfileCard
                      image={
                        contractDetails?.ClientDetails?.ProfilePicture ||
                        BASE_URL
                      }
                      name={contractDetails?.ClientDetails.Name}
                      company={contractDetails?.ClientDetails.UserProfileType}
                      icon={
                        TypeIcons[contractDetails?.ClientDetails.UserProfileType]
                      }
                      isImage={false}
                      profileId={contractDetails?.ClientDetails.UserProfileId}
                    />
                  </div>
                ) : (
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 my-4">
                    No Client found.
                  </p>
                )}
              </>
            )}
        </>
      </div>
    </div>
  );
};

export default OverViewTab;
