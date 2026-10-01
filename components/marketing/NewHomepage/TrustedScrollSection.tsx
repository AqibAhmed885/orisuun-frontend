'use client';

import Image from 'next/image';
import { Testimonial, testimonials } from '@/data/marketing/testimonials';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import PartnersIcon from '@/icons/profile-types/PartnersIcon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';

const rows = [
  testimonials.slice(0, 8),
  testimonials.slice(8, 18),
  testimonials.slice(18, 30),
];

const profileIconConfig: Record<number, { id: string; viewBox: string }> = {
  1: { id: 'testimonial-business-icon', viewBox: '0 0 16 12' },
  2: { id: 'testimonial-consultant-icon', viewBox: '0 0 25 24' },
  3: { id: 'testimonial-expert-icon', viewBox: '0 0 25 24' },
  4: { id: 'testimonial-advocate-icon', viewBox: '0 0 20 20' },
  5: { id: 'testimonial-partner-icon', viewBox: '0 0 37 37' },
  6: { id: 'testimonial-professional-icon', viewBox: '0 0 25 24' },
  7: { id: 'testimonial-investor-icon', viewBox: '0 0 25 24' },
  8: { id: 'testimonial-mentor-icon', viewBox: '0 0 25 24' },
  9: { id: 'testimonial-mentor-icon', viewBox: '0 0 25 24' },
};

function TestimonialProfileIcon({ memberType }: { memberType: number }) {
  const icon = profileIconConfig[memberType] ?? profileIconConfig[6];

  return (
    <svg
      aria-hidden="true"
      viewBox={icon.viewBox}
      className="h-3 w-3 fill-[#2357C6] text-[#2357C6]"
    >
      <use href={`#${icon.id}`} width="100%" height="100%" />
    </svg>
  );
}

function TestimonialProfileIconDefinitions() {
  const iconClassName = 'fill-[#2357C6] text-[#2357C6]';

  return (
    <div aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <BlackOwnedBusinessIcon id="testimonial-business-icon" className={iconClassName} />
      <ConsultantIcon id="testimonial-consultant-icon" className={iconClassName} />
      <ExpertsIcon id="testimonial-expert-icon" className={iconClassName} />
      <AdvocatesIcon id="testimonial-advocate-icon" className={iconClassName} />
      <PartnersIcon id="testimonial-partner-icon" className={iconClassName} />
      <ProfessionalsIcon id="testimonial-professional-icon" className={iconClassName} />
      <InvestorsIcon id="testimonial-investor-icon" className={iconClassName} />
      <MentorsIcon id="testimonial-mentor-icon" className={iconClassName} />
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="flex h-[215px] w-[310px] shrink-0 flex-col justify-between rounded-[13px] border border-[#D2D7E5] bg-[#E8E9EC75] px-6 py-5 text-[#0F1125] sm:w-[380px] lg:w-[380px]">
      <p className="text-[16px] leading-[1.2]">{item.text}</p>

      <div className="mt-4 border-t border-[#E8E9EC75] pt-4">
        <div className="flex items-center gap-4">
          <Image
            src={item.avatar}
            alt={item.name}
            width={48}
            height={48}
            className="size-12 rounded-full object-cover sm:size-12"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-medium leading-tight">{item.name}</h3>

              {item.memberType !== undefined && (
                <span className="flex items-center gap-1 rounded-full border border-[#D1E9FF] bg-[#F5FAFF] px-2.5 py-0.5 text-[7px] font-medium text-[#2357C6]">
                  <TestimonialProfileIcon memberType={item.memberType} />
                </span>
              )}
            </div>

            <p className="mt-1 text-[13px] leading-tight text-[#6c717c]">
              {item.role}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function TrustedScrollSection() {


  return (
    <section

      className="overflow-hidden bg-white py-12 sm:py-16 lg:py-20"
    >
      <TestimonialProfileIconDefinitions />
      <div className="mx-auto mb-12 max-w-[980px] px-4 text-center">
        <h2 className="text-[36px] font-medium leading-[1.08] tracking-normal text-[#07142d] md:text-[36px]">
          Loved and trusted by{' '}
          <span className="relative mx-2 inline-block">
            <svg width="325" height="40" viewBox="0 0 325 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-1/2 top-0 -z-0 -translate-x-1/2 ">
              <path fillRule="evenodd" clipRule="evenodd" d="M225.631 0.767701C214.23 0.576654 204.638 0.373121 199.687 0.192457C189.907 -0.164436 166.705 -0.0111225 148.126 0.537731C133.843 0.958107 110.436 2.00893 89.1861 3.09008C83.2439 3.01507 77.2252 2.92117 71.294 2.80857C18.3079 1.80279 11.5115 1.95318 8.83024 4.19072C6.05264 6.50999 6.04212 6.70735 8.69316 6.77847C9.42046 6.79796 10.1665 6.93833 10.8046 7.15307C9.62139 7.47241 8.93659 7.85386 8.41785 8.31375C8.30222 8.41634 8.19154 8.51491 8.08581 8.60959C4.00132 7.97776 3.41192 8.33397 4.07115 10.8815C4.21886 11.4522 4.20617 12.1094 4.06114 12.782C3.66381 13.0103 3.55231 13.4162 3.63813 14.0504C3.241 14.9286 2.64315 15.756 1.90925 16.3685C-0.827711 18.6526 -0.751586 18.8475 2.98231 19.1169L3.15879 19.1295C2.82408 19.707 2.40323 20.2387 1.91513 20.6715C-0.742716 23.028 -0.65999 23.2208 3.08143 23.3899C5.29625 23.4899 7.66435 23.4985 8.34379 23.4092C8.90729 23.3349 10.8275 24.4564 12.9275 26.0419C11.3166 26.244 11.8609 26.5571 14.1534 27.3166C14.401 27.3986 14.6437 27.4863 14.8807 27.5787C15.9939 28.4125 17.173 29.0929 18.4174 29.6201C19.7074 30.7429 19.9387 31.7638 18.309 31.8144C13.5489 31.9624 19.4266 34.7645 30.5058 37.6289C42.5605 40.7455 43.234 40.7478 102 37.8831C114.52 37.2728 127.393 36.566 139.08 35.8614C145.645 36.0911 153.588 36.2856 161.71 36.4158C167.878 36.6776 174.132 36.9044 179.949 37.0692C214.251 38.0446 299.964 38.5014 288.544 37.648C278.828 36.9218 283.885 35.414 299.251 34.4558C307.172 33.9618 313.949 32.8426 314.311 31.9688C314.673 31.0949 317.078 30.4365 319.655 30.5056C323.143 30.5992 324.367 29.866 324.443 27.6362C324.472 26.7858 324.271 26.1125 323.747 25.5568C324.412 25.0835 324.685 24.3524 324.685 23.2873C324.685 21.2712 323.427 20.2837 319.658 19.566C321.309 19.5239 321.68 19.3678 320.959 18.9644C321.482 18.6011 321.41 17.8791 321 16.6363C320.861 16.2135 320.806 15.7365 320.827 15.2363C321.409 15.1312 321.406 14.9667 320.878 14.6971C321.065 13.384 321.727 11.9907 322.703 11.0376C325.198 8.60213 325.109 8.41195 321.46 8.35615C319.46 8.32569 317.336 8.37747 316.509 8.47251C315.946 7.91876 314.411 7.14177 312.099 6.23973C311.562 5.86015 311.007 5.44759 310.456 5.01404C307.334 2.55994 303.74 1.36828 299.681 1.4411C298.774 1.45738 297.6 1.46845 296.195 1.47472C287.822 -0.279786 277.692 -0.128303 229.412 0.700512C228.155 0.7221 226.894 0.744512 225.631 0.767701ZM27.6511 10.6205C27.4505 10.6532 27.2517 10.686 27.055 10.7192C26.5707 10.6285 26.0893 10.5336 25.6128 10.4348C26.2962 10.492 26.9768 10.554 27.6511 10.6205ZM14.9114 6.48314C15.9937 6.37214 17.2584 6.2727 18.7437 6.18292C16.0077 6.0436 14.8311 6.10704 14.9114 6.48314Z" fill="#F7C3B3" />
            </svg>


            <span className="relative z-10 inline-block -rotate-2 px-1">
              1000 others like you
            </span>
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className=" flex w-max will-change-transform"
          >
            <div
              className={`trusted-marquee-track flex w-max will-change-transform ${
                rowIndex === 1 ? 'trusted-marquee-right' : 'trusted-marquee-left'
              }`}
            >
              {[0, 1].map((copyIndex) => (
                <div
                  key={copyIndex}
                  aria-hidden={copyIndex === 1}
                  className="flex w-max gap-4 pr-4"
                >
                  {row.map((item) => (
                    <TestimonialCard
                      key={`${rowIndex}-${copyIndex}-${item.name}`}
                      item={item}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .trusted-marquee-track {
          animation-duration: 60s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .trusted-marquee-left {
          animation-name: trusted-marquee-left;
        }

        .trusted-marquee-right {
          animation-name: trusted-marquee-right;
        }

        @keyframes trusted-marquee-left {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes trusted-marquee-right {
          from {
            transform: translate3d(-50%, 0, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }

        @media (min-width: 1024px) and (prefers-reduced-motion: reduce) {
          .trusted-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
