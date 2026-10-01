import Image from 'next/image';

import {
  discountPortalGetInHeader,
  discountPortalGetInSteps,
} from '@/data/marketing/discount';

export default function HowToGetInSection() {
  return (
    <section className="bg-[#F8FAFC] px-5 pb-20 pt-2 md:px-8 md:pb-28 lg:px-10">
      <div className="mx-auto max-w-[1200px] px-0 md:px-4">
        <div className="relative flex md:aspect-[1200/240] aspect-[3/2] items-center justify-center overflow-hidden rounded-[8px] bg-[#061A3A] px-5 py-9 text-center text-white md:min-h-[190px] md:py-0">
          <Image
            src={discountPortalGetInHeader.leftDecoration}
            alt=""
            width={310}
            height={248}
            className="absolute bottom-0 left-0 w-[150px] opacity-70 md:w-[310px]"
          />
          <Image
            src={discountPortalGetInHeader.rightDecoration}
            alt=""
            width={236}
            height={248}
            className="absolute right-0 top-0 w-[118px] opacity-70 md:w-[236px]"
          />

          <div className="relative z-10 mx-auto max-w-[360px]">
            <h2
              className="text-center text-[32px] font-medium leading-[110%] md:text-[42px]"
              
            >
              {discountPortalGetInHeader.title}
              <br />
              {discountPortalGetInHeader.subtitle}
            </h2>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-white/90">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.1935 10.5968C21.1935 13.4072 20.0771 16.1025 18.0898 18.0898C16.1025 20.0771 13.4072 21.1935 10.5968 21.1935C7.78633 21.1935 5.091 20.0771 3.10372 18.0898C1.11644 16.1025 0 13.4072 0 10.5968C0 7.78633 1.11644 5.091 3.10372 3.10372C5.091 1.11644 7.78633 0 10.5968 0C13.4072 0 16.1025 1.11644 18.0898 3.10372C20.0771 5.091 21.1935 7.78633 21.1935 10.5968ZM10.5968 4.63609C10.5968 4.46044 10.527 4.29198 10.4028 4.16777C10.2786 4.04357 10.1101 3.97379 9.93448 3.97379C9.75882 3.97379 9.59037 4.04357 9.46616 4.16777C9.34196 4.29198 9.27218 4.46044 9.27218 4.63609V11.9214C9.27221 12.0381 9.30311 12.1528 9.36173 12.2537C9.42035 12.3547 9.50461 12.4383 9.60598 12.4962L14.2421 15.1454C14.3942 15.2277 14.5725 15.2471 14.7388 15.1996C14.9051 15.1522 15.0462 15.0415 15.132 14.8914C15.2178 14.7412 15.2415 14.5635 15.1979 14.3961C15.1544 14.2287 15.0471 14.085 14.8991 13.9957L10.5968 11.5372V4.63609Z" fill="white" />
              </svg>

              <span>{discountPortalGetInHeader.timeLabel}</span>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-4">
          {discountPortalGetInSteps.map((step) => (
            <article key={step.title}>
              <div className="relative aspect-[1.85/1] overflow-hidden rounded-[8px] bg-[#DADBE354]">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="mt-5 text-lg font-[550] tracking-wide text-[#062A66]">
                {step.title}
              </h3>
              <p className="mt-3 text-base font-medium tracking-wide text-[#667085]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
