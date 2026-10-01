import Image, { StaticImageData } from 'next/image';
import React from 'react';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const perk = staticUrl + "/userTypes/images/perks.png";

type Props = {
  leftTitle?: string;
  leftParagraphs?: string[];
  leftCtaText?: string;
  leftCtaHref?: string;
  leftImage?: string | StaticImageData;
  rightTitle?: string;
  perks?: string[];
};

const TwoCardPromo: React.FC<Props> = ({
  leftTitle = 'Join Now. Grow Faster.',
  leftParagraphs = [
    'Join now and claim your status as a featured business. With homepage and category spotlights, we’re featuring businesses who join today.',
    'Visibility is power, and we’re rewarding active members with special shoutouts in our newsletters and partner channels.',
  ],
  leftCtaText = 'Claim your featured status!',
  leftCtaHref = '#',
  leftImage = `${staticUrl}/marketing/rocket.png`,
  rightTitle = 'The Perks',
  perks = [
    'Premium placement where people search and scroll',
    'Lifetime special recognition and privileges, including early access and a price freeze',
    'Direct shoutouts on our homepage and in our marketing materials',
  ],
}) => {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left card */}
          <div className="bg-[#F7F7F7] md:w-3/5 rounded-3xl shadow-sm p-8 flex flex-col justify-between overflow-hidden relative">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex flex-col md:w-2/3">
                <h3 className="text-3xl font-medium text-blue-strong mb-3">{leftTitle}</h3>
                <div className="space-y-3 text-xl text-gray-600">
                  {leftParagraphs.map((p, i) => (
                    <p key={i} className="text-xl md:mt-8 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="mt-10">
                  <a
                    href={leftCtaHref}
                    className="inline-block bg-[#2357C6] text-white px-5 py-2 rounded-full text-base font-semibold shadow hover:bg-[#1e4bb2] transition"
                  >
                    {leftCtaText}
                  </a>
                </div>
              </div>

              {/* Image (on large screens shown to the right of text) */}
              <div className="flex items-center justify-center w-[460px] -mx-12 h-96 relative">
                {/* next/image accepts string | StaticImageData */}
                <Image src={leftImage as string | StaticImageData} alt="Illustration" fill className="object-contain w-80 h-80" />
              </div>
            </div>
          </div>

          {/* Right card */}
          <div className="bg-[#F2F7FC] rounded-3xl md:w-2/5 shadow-sm  p-8 flex flex-col justify-start">
            <Image src={perk} alt="Perks Decorative" width={400} height={400} className="mb-4 w-full h-auto" />
            <h4 className="text-2xl font-medium text-blue-strong mb-4">{rightTitle}</h4>
            <ul className="space-y-3 text-gray-700 list-none pl-0">
              {perks.map((perkItem, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className='w-1 h-1 mt-2.5 bg-omblue-700 rounded-full'/>
                  <span className="text-xl leading-relaxed">{perkItem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoCardPromo;