import Image from 'next/image';

import {
  universalCommunityChatMomentumCards,
  universalCommunityChatMomentumSection,
} from '@/data/marketing/universalAndCommunityChat';

export default function MomentumSection() {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <section aria-labelledby="momentum-section-title">
      <div className="mt-16 text-center md:mt-20">
        <h3
          id="momentum-section-title"
          className="text-center text-[42px] font-medium leading-[100%] tracking-[0.02em] text-[#0B1220]"
        >
          {universalCommunityChatMomentumSection.titleStart}{' '}
          <span className="relative inline-flex items-center justify-center px-2 leading-none md:px-3">
            <Image
              src={`${staticUrl}/discount-portal-landing/Union.png`}
              alt=""
              fill
              className="object-contain"
              sizes="180px"
            />
            <span className="relative z-10">
              {universalCommunityChatMomentumSection.titleHighlight}
            </span>
          </span>
        </h3>

        <p className="mx-auto mt-4 max-w-[740px] text-center text-[16px] font-normal leading-[150%] tracking-[-0.003em] text-[#516176]">
          {universalCommunityChatMomentumSection.description}
        </p>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[335px] flex-col items-stretch gap-3 md:mt-10 md:h-[330px] md:max-w-[1120px] md:flex-row md:gap-5">
        {universalCommunityChatMomentumCards.map((card) => (
          <article
            key={card.title}
            tabIndex={0}
            className="group relative w-full overflow-hidden rounded-[10.92px] bg-transparent outline-none transition-[flex-grow,flex-basis,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-[#2382C6] focus-visible:ring-offset-2 md:h-full md:min-w-0 md:flex-1 md:basis-0 md:hover:flex-[1.65] md:focus:flex-[1.65]"
          >
            <Image
              src={card.image}
              alt={card.imageAlt}
              fill
              sizes="(min-width: 768px) 50vw, 335px"
              className={`${card.mobileImage ? 'hidden md:block' : 'block'} object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:scale-105 md:group-focus:scale-105`}
            />

            {card.mobileImage ? (
              <Image
                src={card.mobileImage}
                alt={card.imageAlt}
                width={603}
                height={405}
                sizes="335px"
                className="block h-auto w-full md:hidden"
              />
            ) : null}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden px-6 pb-6 pt-28 text-left md:block">
              {/* Smooth overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1625] via-[#0D1625]/90 to-transparent opacity-90 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus:opacity-100" />


              <div className="relative z-10 translate-y-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]  group-hover:translate-y-0 group-focus:translate-y-0">
                <h4
                  className="translate-y-2 text-[26.1px] pb-4 hover:pb-0 font-medium leading-none  text-[#E6EEFF] transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:text-white group-focus:translate-y-0 group-focus:text-white"
                >
                  {card.title}
                </h4>

                <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus:grid-rows-[1fr] group-focus:opacity-100">
                  <div className="min-h-0 overflow-hidden">
                    <p className="mt-2 translate-y-3 text-lg tracking-wide text-[#E5EAF3] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus:translate-y-0">
                      {card.description}
                    </p>
                  </div>
                </div>

                
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
