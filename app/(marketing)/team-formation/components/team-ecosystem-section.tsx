import Image from 'next/image';
import { teamFormLandingData } from '@/data/teamFormLandingData';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function TeamEcosystemSection() {
  return (
    <section className="bg-[#B8C1CC] p-2">
      <div className="mx-auto rounded-[14px] border border-[#E6ECF4] bg-white px-4 py-6 sm:p-8 lg:p-[60px]">
        <h2 className="text-center text-2xl md:text-[42px] font-medium leading-[120%] text-[#001E5F]">
          {teamFormLandingData.headingPrefix}{' '}
          <span
            className="inline-block bg-center bg-no-repeat px-1 py-1"
            style={{
              backgroundImage: `url('${staticUrl}/team-form/Union.svg')`,
              backgroundSize: '100% 100%',
            }}
          >
            {teamFormLandingData.headingHighlight}
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-[640px] text-center text-sm md:text-[18px] font-normal leading-[150%] tracking-wide text-[#5B657B]">
          {teamFormLandingData.headingDescription}
        </p>

        <div className="mt-12 space-y-12 lg:mt-16 lg:space-y-16 bg-gradient-to-br to-[200px]  md:bg-gradient-to-bl from-[#2382C680] md:to-[20%] to-transparent rounded-[15px] md:rounded-[40px] md:p-8 p-2">
          {teamFormLandingData.blocks.map((block, index) => {
            const isReversed = index % 2 === 1;

            return (
              <article
                key={`${block.title}-${index}`}
                className={`grid items-stretch gap-2 rounded-[12px] ${isReversed ? 'lg:grid-cols-[1fr_550px]' : 'lg:grid-cols-[550px_1fr]'}  lg:gap-14`}
              >
                <div
                  className={[
                    'order-1 flex min-w-0 flex-col',
                    'lg:min-h-[450px] lg:justify-between md:py-12 py-4',
                    isReversed
                      ? 'lg:order-2 '
                      : 'lg:order-1 ',
                  ].join(' ')}
                >
                  <div>
                    <h3 className="md:max-w-[500px] text-[24px] leading-[120%] tracking-wide text-[#001E5F] sm:text-[26px] lg:text-[32px]">
                      {block.title}
                    </h3>

                    <p className="mt-5 max-w-[600px] text-[17px]  leading-[150%] tracking-wide text-[#5B657B] sm:text-base">
                      {block.description}
                    </p>
                  </div>

                  {block.cta ? (
                    <button
                      type="button"
                      className="mt-8 hidden w-fit items-center gap-4 text-left text-base  leading-none text-[#003153] transition hover:text-[#00527D] md:inline-flex lg:mt-auto lg:pt-12"
                    >
                      {block.cta}
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.3013 8.7021C14.33 8.63868 14.3449 8.56985 14.3449 8.50022C14.3449 8.43059 14.33 8.36176 14.3013 8.29835C14.276 8.23313 14.2381 8.17356 14.1897 8.12303L8.87719 2.81053C8.77715 2.7105 8.64147 2.6543 8.5 2.6543C8.35853 2.6543 8.22285 2.7105 8.12281 2.81053C8.02278 2.91057 7.96658 3.04625 7.96658 3.18772C7.96658 3.32919 8.02278 3.46487 8.12281 3.56491L12.5322 7.96897H3.1875C3.0466 7.96897 2.91148 8.02494 2.81185 8.12457C2.71222 8.2242 2.65625 8.35932 2.65625 8.50022C2.65625 8.64112 2.71222 8.77624 2.81185 8.87587C2.91148 8.9755 3.0466 9.03147 3.1875 9.03147H12.5322L8.12281 13.4355C8.07302 13.4849 8.0335 13.5437 8.00653 13.6084C7.97956 13.6732 7.96567 13.7426 7.96567 13.8127C7.96567 13.8829 7.97956 13.9523 8.00653 14.017C8.0335 14.0818 8.07302 14.1405 8.12281 14.1899C8.1722 14.2397 8.23096 14.2792 8.29569 14.3062C8.36043 14.3332 8.42987 14.3471 8.5 14.3471C8.57013 14.3471 8.63957 14.3332 8.70431 14.3062C8.76904 14.2792 8.8278 14.2397 8.87719 14.1899L14.1897 8.87741C14.2381 8.82688 14.276 8.76731 14.3013 8.7021Z" fill="#003153" />
                      </svg>

                    </button>
                  ) : null}
                </div>

                <div
                  className={[
                    'order-2 min-w-0',
                    isReversed ? 'lg:order-1' : 'lg:order-2',
                  ].join(' ')}
                >
                  <div className="relative aspect-[550/450] overflow-hidden rounded-[14px]">
                    <Image
                      src={`${staticUrl}/team-form/background.svg`}
                      alt=""
                      fill
                      aria-hidden="true"
                      className="object-contain"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />

                    <div className="absolute inset-4 sm:inset-6 lg:inset-12">
                      <Image
                        src={block.image}
                        alt={block.imageAlt}
                        fill
                        className="object-contain"
                        sizes="(min-width: 1024px) 45vw, 90vw"
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
