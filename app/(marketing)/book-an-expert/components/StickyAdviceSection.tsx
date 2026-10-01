import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const advicePoints = [
  "No long-term contracts. Even if you're just at the idea stage.",
  "Direct, actionable steps. Even if you've never talked to an investor before.",
  "Affordable 30-minute sessions. Even if you're bootstrapping every dollar.",
];

export default function StickyAdviceSection() {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <section className="mt-2 w-full ">
      <div className="relative min-h-[1200px]  rounded-[8px] bg-[#D7E7FB]">
        <div className="sticky top-0 h-screen overflow-hidden rounded-[8px]">
          <Image
            src={`${staticUrl}/booking/investor/Hero_BG_Temp (7) copy.svg`}
            alt="Business owners discussing strategy with an advisor"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="absolute h-[1120px] left-0 top-0 z-10  max-ful-w-[530px] md:ml-10 ml-4 border border-[#D3E3F7] mt-8 ">
          <div className="sticky top-24  max-w-[440px] border border-white/80 bg-[#edf6ff]/95 px-2 py-8 shadow-[0_18px_55px_rgba(0,28,55,0.12)] backdrop-blur-sm sm:px-4 lg:px-6">
            <h2 className="text-2xl font-normal leading-[1.08] text-[#020b21] sm:text-[32px]">
              Expert Advice That Fits Your Stage.
            </h2>

            <div className="mt-6 space-y-4">
              {advicePoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 text-[#4f5d73]"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M8.33333 0C3.73333 0 0 3.73334 0 8.33331C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6666 12.9333 16.6666 8.33331C16.6666 3.73334 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91671C3.00618 8.83951 2.94498 8.74791 2.90323 8.64711C2.86147 8.54631 2.83998 8.43831 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01122C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66452 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98878 7.56156C4.08959 7.60332 4.18118 7.66452 4.25833 7.74167L6.66667 10.1417L12.4 4.40834C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2078 4.16498 13.4192 4.25252 13.575 4.40834C13.7308 4.56415 13.8183 4.77548 13.8183 4.99584C13.8183 5.21619 13.7308 5.42752 13.575 5.58334L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z"
                      fill="#002A4B"
                    />
                  </svg>

                  <p className="text-xs leading-[1.35] sm:text-sm">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="mt-16 inline-flex h-[48px] items-center gap-3 rounded-[6px] bg-[#003153] px-6 text-base font-medium text-white transition hover:bg-[#06446f]"
            >
              Join the community
              <ArrowRight aria-hidden="true" size={22} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
