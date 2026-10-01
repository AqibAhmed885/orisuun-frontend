import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const PartnersIcon = staticUrl + "/what we offer/partner.svg";
import { FeaturesButton } from '../Button1';
import { partner } from '../../../../../data/marketing/what-we-offer';

export const ThePartners = () => {
  return (
    <div className="w-full h-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
      <div className="flex lg:order-1 md:order-2 small-500:order-2 pb-[55.72px] small-500:pb-0">
        <Image alt="partner" src={PartnersIcon} width={733} height={500}/>
      </div>
      <div className="h-full flex lg:w-[594px] lg:order-2 md:order-1 small-500:order-1 lg:pt-[60px] lg:pb-[192px]">
        <div className="w-full flex flex-col items-start gap-8">
          <div className="w-full flex flex-col items-start gap-6">
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
                ]}
              />
              <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
                The Partners
              </h2>
            </div>
            <p className="text-blu-ray-300 md:text-[20px] font-medium leading-150 text-[16px]">
              Large, multinational corporations.
            </p>
          </div>
          <div className="w-full flex flex-col items-start gap-6">
            <h2 className="text-blue-strong md:text-[20px] font-semibold leading-[26px] text-[16px]">
              Role on Orisuun
            </h2>
            <div className="w-full flex flex-col items-start gap-5">
              {partner.map((text) => (
                <div key={text.id} className={`flex gap-5 w-full`}>
                  <div className="border-l border-blu-ray-300"></div>
                  <div
                    className="md:text-[20px] font-medium text-blu-ray-300 leading-150 text-[16px]"
                    dangerouslySetInnerHTML={{ __html: text?.parag }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
