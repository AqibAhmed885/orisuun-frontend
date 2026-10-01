import Image from 'next/image';
import { teamCollabSectionData } from '@/data/teamFormLandingData';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function TeamCollabSection() {
  const s = teamCollabSectionData;
  const highlightBackground = `url("${staticUrl}/team-form/Union.svg")`;

  return (
    <section className="bg-white px-0  sm:px-6 lg:px-8 ">
      <div className=" rounded-[14px] py-6 sm:p-8 lg:p-12">
        <h2 className="text-center text-2xl md:text-[42px]   text-[#001E5F]"
            >
          {s.titlePrefix}{' '}
          <span
            className="inline-block px-0 py-0 md:bg-[image:var(--team-highlight-bg)] md:bg-[length:100%_100%] md:bg-center md:bg-no-repeat md:px-1 md:py-1"
            style={{ '--team-highlight-bg': highlightBackground } as React.CSSProperties}
          >
            {s.titleHighlight}
          </span>
        </h2>

        <p className="mx-auto mt-4 md:max-w-[640px] max-w-[400px] text-center text-base md:text-lg font-normal  tracking-wide text-[#5B657B]"
           >
          {s.subtitle}
        </p>

        <div className="mt-8 rounded-[12px]  sm:p-3 lg:p-4">
          <div className="relative aspect-[16/7] overflow-hidden rounded-[10px] lg:aspect-[1010/450]">
            <Image src={s.mainImage} alt="Collaboration dashboard" fill className="object-contain" />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3  lg:mt-5 ">
            {s.features.map((item) => (
              <div key={item.title} className=" p-6">
                <Image src={item.icon} alt="" width={32} height={32} className="" />
                <div className='pt-16'>
                  <h3
                    className="text-[20px] font-semibold tracking-wide text-[#001E5F]"
                  >
                    {item.title}
                  </h3>
                  <p
                    className=" text-[16px] font-normal tracking-wide pt-2 text-[#5B657B]">
                    {item.description}
                  </p>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
