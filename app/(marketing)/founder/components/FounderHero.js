'use client';
import Image from 'next/image';
import { useState } from 'react';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export function FounderHero() {
  const [svgLoaded, setSvgLoaded] = useState(false);
  // adjust svg path if different; this assumes an SVG placed under public/founder/images
  const svgPath = `${staticUrl}/founder/images/Bek-founder.png`;

  return (
    <section className=" xs:p-4 sm:!p-20 bg-white">
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center text-center sm:max-w-[1060px] xs:space-y-5 sm:space-y-4">
          <h1 className="text-4xl sm:!text-[64px] font-semibold text-blue-strong leading-110">
            &quot;A steward and a captain to something
            special that belongs to all of us.&quot;
          </h1>
          <p className="text-2xl xs:max-w-56 sm:!max-w-max font-semibold text-text-gray">
            Bek Sunuu, CEO & Founder of Orisuun
          </p>
        </div>

        <div className="flex flex-col xs:items-start sm:!items-center">
          <div
            className="
                      relative
                      w-[320px] h-[320px]
                      
                      md:w-[600px] md:h-[600px]
                    "
            
          >
            {/* Founder image */}
            <Image
              src={svgPath}
              alt="Bek Sunuu placeholder"
              width={599}
              height={599}
              priority
              className={`
                w-[320px] h-[320px]
                md:w-[600px] md:h-[600px]
                transition-opacity duration-300
              `}
            />

            {/* Signature image */}
            <Image
              src={`${staticUrl}/founder/images/Bek-sign.png`}
              alt="Bek Sign"
              width={200}
              height={60}
              className={`
                absolute
                -right-[30px] top-1/3
                md:-right-[75px] md:top-1/3
                w-[120px] h-[36px]
                md:w-[230px] md:h-[60px]
                z-50
                transition-opacity duration-300
              `}
            />
          </div>

          <h2 className="xs:text-2xl sm:!text-[40px] xs:max-w-56 sm:!max-w-sm !leading-110 font-semibold text-blue-strong sm:text-center mt-16">
            Meet Bek Sunuu Founder of Orisuun
          </h2>
        </div>
      </div>
    </section>
  );
}


// 'use client';
// import Image from 'next/image';
// import BekFounder from '@/public/founder/images/Bek-founder.svg'

// export function FounderHero() {
//   return (
//     <section className=" xs:p-4 sm:!p-20 bg-white">
//       <div className="flex flex-col items-center gap-10">
//         <div className="flex flex-col items-center text-center sm:max-w-[1060px] xs:space-y-5 sm:space-y-4">
//           <h1 className="text-4xl sm:!text-[64px] font-semibold text-blue-strong leading-110">
//             &quot;A steward and a captain to something
//             special that belongs to all of us.&quot;
//           </h1>
//           <p className="text-2xl xs:max-w-56 sm:!max-w-max font-semibold text-text-gray">
//             Bek Sunuu, CEO & Founder of Orisuun
//           </p>
//         </div>
//         <div className="flex flex-col xs:items-start sm:!items-center">
//           <Image
//             src={BekFounder.src}
//             alt='Bek Sunuu'
//             width={700}
//             height={700}
//             className='xs:w-full sm:!w-auto h-auto'
//           />
//           <h2 className="xs:text-2xl sm:!text-[40px] xs:max-w-56 sm:!max-w-sm !leading-110 font-semibold text-blue-strong sm:text-center mt-16">
//             Meet Bek Sunuu Founder of Orisuun
//           </h2>
//         </div>
//       </div>
//     </section>
//   );
// }
