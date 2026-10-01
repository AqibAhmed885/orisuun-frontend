import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const ManagementIcon = staticUrl + "/what we offer/management.png";
import { FeaturesButton } from '../Button1';
import { managementRole, managementAbilities } from '../../../../../data/marketing/what-we-offer';
export const TheManagement = () => {
  return (
    <div className="w-full h-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
      <div className="h-full xl:pt-[60px] pt-0">
        <div className="flex flex-col items-start gap-8 lg:w-[594px]">
          <div className="w-full flex flex-col items-start gap-6 small-500:gap-3">
            <div className="flex flex-col items-start gap-4 w-full">
              <FeaturesButton
                buttons={[
                  {
                    id: 1,
                    text: 'Can be verified',
                  },
                  {
                    id: 2,
                    text: 'Access to Team Forming',
                  },
                  {
                    id: 3,
                    text: 'Have option to charge',
                  },
                ]}
              />
              <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px] ">
                The Strategy Consultants
              </h2>
            </div>
            <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px] ">
              Those accomplished and practicing Strategy Consultants currently or recently employed at a national-level management consulting firm. Students at select graduate-level business schools also qualify.
            </p>
          </div>
          <div className="w-full flex flex-col items-start gap-6">
            <h2 className="text-blue-strong md:text-[20px] font-semibold leading-[26px] text-[16px]">
              Role on Orisuun
            </h2>
            <div className="w-full flex flex-col items-start gap-5">
              {managementRole.map((text) => (
                <div key={text.id} className={`flex gap-5 w-full`}>
                  <div className="border-l border-blu-ray-300"></div>
                  <p className="md:text-[20px] font-medium text-blu-ray-300 leading-150 text-[16px]">
                    {text.parag}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex flex-col items-start gap-6">
            <h2 className="text-blue-strong md:text-[20px] font-semibold leading-[26px] text-[16px]">
              Permissions And Abilities
            </h2>
            <div className="w-full flex flex-col items-start gap-5">
              {managementAbilities.map((text) => (
                <div key={text.id} className={`flex gap-5 w-full`}>
                  <div className="border-l border-blu-ray-300"></div>
                  <p className="md:text-[20px] font-medium text-blu-ray-300 leading-150 text-[16px]">
                    {text.parag}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-3 py-2 bg-[#F8F8F8] rounded-[5px]">
            <p className="text-[#5C5C5C] text-[14px] font-medium leading-[18.2px] ">
              * These graduate-level business schools: Harvard, Stanford,
              University of Chicago, Columbia, Wharton, Oxford (plus other
              schools to be qualified in 2025).
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Image alt="management" src={ManagementIcon} width={733} height={500}/>
      </div>
    </div>
  );
};
