import Image from 'next/image';
import { Check } from 'lucide-react';
import { teamGroupWaySectionData } from '@/data/teamFormLandingData';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function TeamGroupWaySection() {
  const s = teamGroupWaySectionData;
  const highlightBackground = `url("${staticUrl}/team-form/Union.svg")`;

  return (
    <section className="bg-white max-w-[1080px] mx-auto">
      <div className=" rounded-[14px]  ">
        <h2
          className="text-center text-2xl md:text-[42px]  tracking-wide text-[#071A33]"
        >
          {s.titlePrefix}{' '}
          <span
            className="inline-block px-0 py-0 md:bg-[image:var(--team-highlight-bg)] bg-center md:bg-no-repeat md:px-1 md:py-1"
            style={{ '--team-highlight-bg': highlightBackground } as React.CSSProperties}
          >
            {s.titleHighlight}
          </span>
        </h2>

        <p
          className="mx-auto mt-2 max-w-[580px] text-center text-sm md:text-[18px] font-normal tracking-wide text-[#5D6D83]"
        >
          {s.subtitle}
        </p>

        <div className="mt-10 grid  gap-8  md:grid-cols-[45%_55%] py-10 px-4 lg:gap-10">
          <div className="order-2 relative aspect-[390/320] overflow-hidden   md:order-1">
            <Image
              src={s.image}
              alt={s.imageAlt}
              fill
              className="object-cover md:rounded-none rounded-l-[16px]"
              sizes="(min-width: 1024px) 44vw, 100vw" />
          </div>

          <div className="order-1 lg:order-2 ">
            <h3
              className="text-2xl md:text-[36px] leading-[1.2] tracking-wide text-[#061A35]"
              
            >
              {s.contentTitle}
            </h3>

            <p
              className="mt-2 text-[18px] font-normal tracking-wide text-[#5C6D83]"
            >
              {s.contentDescription}
            </p>

            <ul className="mt-2 pb-4 space-y-3 border-b border-[#EAEFF6] pt-4">
              {s.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[2px] flex-shrink-0">
                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#447DFC" />
                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#337DD4" />
                  </svg>

                  <span
                    className="text-[16px] font-normal tracking-wide text-[#5A6B82]"
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
