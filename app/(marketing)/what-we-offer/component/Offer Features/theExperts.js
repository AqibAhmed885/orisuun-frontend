import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const ExpertIcon = staticUrl + "/what we offer/expert.svg";
import { FeaturesButton } from '../Button1';
import { expert } from '../../../../../data/marketing/what-we-offer';

export const TheExperts = () => {
  return (
    <div className="w-full h-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
      <div className="h-full">
        <div className="flex flex-col items-start gap-8 lg:w-[594px]">
          <div className="flex flex-col items-start gap-6 w-full">
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
              <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
                The Experts
              </h2>
            </div>
            <p className="text-[#6E6E6E] md:text-[20px] font-medium leading-150 text-[16px]">
              Those recognized and credentialed individuals (or small
              organizations) who can confidently claim to be among the top of
              their field.
            </p>
          </div>
          <div className="flex flex-col items-start gap-6 w-full">
            <h2 className="text-blue-strong text-[20px] font-semibold leading-[26px] small-500:text-[16px]">
              Role on Orisuun
            </h2>
            <div className="w-full flex flex-col items-start gap-5">
              {expert.map((text) => (
                <div key={text.id} className={`flex gap-5 w-full`}>
                  <div className="border-l border-blu-ray-300"></div>
                  <p className="text-[20px] font-medium text-[#6E6E6E] leading-150 small-500:text-[16px]">
                    {text.parag}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Image alt="expert" src={ExpertIcon} width={733} height={500}/>
      </div>
    </div>
  );
};
