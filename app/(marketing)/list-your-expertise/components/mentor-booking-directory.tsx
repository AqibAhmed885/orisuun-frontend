import Image from "next/image";
import { ReactNode } from "react";
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

type DirectoryCard = {
  name: string;
  imageSrc: string;
};

type MentorBookingDirectoryProps = {
  title?: ReactNode;
  hideDescription?: boolean;
};

const directoryCards: DirectoryCard[] = [
  {
    imageSrc: `${staticUrl}/booking/mentor/11.svg`,
    name: "Jane Doe",
  },
  {
    imageSrc: `${staticUrl}/booking/mentor/12.svg`,
    name: "John Smith",
  },
  {
    imageSrc: `${staticUrl}/booking/mentor/13.svg`,
    name: "Jane Doe",
  },
  {
    imageSrc: `${staticUrl}/booking/mentor/14.svg`,
    name: "John Smith",
  },
  {
    imageSrc: `${staticUrl}/booking/mentor/15.svg`,
    name: "Jane Doe",
  },
];

export default function MentorBookingDirectory({
  title,
  hideDescription = false,
}: MentorBookingDirectoryProps) {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1260px] px-0 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-[980px] px-4 text-center">
          <h2 className="text-[40px] font-normal leading-[1.05] tracking-[-0.02em] text-[#020817] sm:text-6xl">
            {title ?? (
              <>
                Join a Directory of
                <br />
                <span className="relative inline-block px-3 py-1">
                  <svg
                width="329"
                height="49"
                viewBox="0 0 329 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-0 top-1/2 z-0 size-[100%] -translate-y-1/2"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M228.629 0.940434C217.076 0.706401 207.357 0.457073 202.34 0.235759C192.43 -0.201434 168.92 -0.013625 150.094 0.658721C135.621 1.17368 111.903 2.46094 90.3712 3.78535C84.3501 3.69347 78.2514 3.57844 72.2414 3.4405C18.5512 2.20842 11.6645 2.39264 8.94758 5.13363C6.13307 7.97474 6.12241 8.2165 8.80867 8.30363C9.54564 8.3275 10.3016 8.49945 10.9482 8.7625C9.74925 9.1537 9.05534 9.62098 8.52971 10.1843C8.41254 10.31 8.30039 10.4308 8.19326 10.5467C4.05449 9.77276 3.45726 10.2091 4.12525 13.3299C4.27492 14.0289 4.26206 14.834 4.11511 15.658C3.7125 15.9376 3.59951 16.4349 3.68647 17.2118C3.28407 18.2875 2.67828 19.3011 1.93462 20.0514C-0.838709 22.8494 -0.761574 23.0882 3.02194 23.4182L3.20077 23.4336C2.8616 24.1411 2.43516 24.7925 1.94058 25.3226C-0.752585 28.2093 -0.66876 28.4454 3.12238 28.6526C5.36663 28.7751 7.76619 28.7857 8.45466 28.6762C9.02565 28.5853 10.9714 29.9591 13.0993 31.9013C11.467 32.1489 12.0185 32.5325 14.3414 33.4628C14.5924 33.5633 14.8383 33.6707 15.0784 33.784C16.2065 34.8053 17.4012 35.6389 18.6622 36.2846C19.9693 37.66 20.2036 38.9106 18.5523 38.9727C13.7289 39.154 19.6848 42.5865 30.9112 46.0953C43.1261 49.9132 43.8085 49.9161 103.355 46.4067C116.041 45.6592 129.085 44.7933 140.928 43.9302C147.58 44.2117 155.629 44.4499 163.859 44.6093C170.109 44.9301 176.446 45.2078 182.341 45.4097C217.098 46.6046 303.95 47.1643 292.378 46.1188C282.533 45.2293 287.658 43.3821 303.227 42.2083C311.254 41.6032 318.121 40.2322 318.488 39.1617C318.855 38.0912 321.291 37.2848 323.903 37.3694C327.437 37.4841 328.677 36.5858 328.754 33.8544C328.784 32.8126 328.58 31.9878 328.049 31.307C328.723 30.7273 329 29.8317 329 28.5269C329 26.0573 327.725 24.8475 323.906 23.9683C325.579 23.9168 325.954 23.7256 325.224 23.2314C325.754 22.7863 325.681 21.9019 325.266 20.3795C325.124 19.8615 325.069 19.2772 325.091 18.6644C325.68 18.5357 325.677 18.3342 325.141 18.004C325.332 16.3954 326.002 14.6886 326.991 13.521C329.519 10.5376 329.43 10.3046 325.732 10.2363C323.706 10.199 321.553 10.2624 320.715 10.3788C320.145 9.70048 318.589 8.74867 316.247 7.64367C315.702 7.17868 315.14 6.6733 314.581 6.1422C311.418 3.13592 307.776 1.67615 303.664 1.76535C302.745 1.78529 301.555 1.79885 300.131 1.80653C291.647 -0.342738 281.382 -0.157171 232.461 0.858127C231.186 0.884573 229.909 0.912027 228.629 0.940434ZM28.0186 13.0101C27.8153 13.0501 27.6139 13.0904 27.4145 13.131C26.9238 13.0199 26.436 12.9037 25.9532 12.7827C26.6456 12.8527 27.3353 12.9287 28.0186 13.0101ZM15.1095 7.94185C16.2063 7.80587 17.4878 7.68406 18.9928 7.57408C16.2204 7.40341 15.0282 7.48113 15.1095 7.94185Z"
                  fill="#BAD9FF"
                />
              </svg>

              <span className="relative z-10">Elite Operators</span>
            </span>
              </>
            )}
          </h2>

          {!hideDescription && (
            <p className="mx-auto mt-6 max-w-[720px] text-xl leading-[1.35] text-[#4D5F80] sm:text-[24px] lg:max-w-[620px] lg:text-[22px]">
              Your profile will sit alongside former founders, executives, and
              industry pioneers who are dedicated to the Black business ecosystem.
            </p>
          )}
        </div>

        <div className="mt-20 overflow-visible md:mt-12">
          <div className="flex snap-x snap-mandatory gap-7 overflow-x-auto scroll-smooth px-10 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-5 md:gap-2 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
            {directoryCards.map((card, index) => (
              <div
                key={`${card.imageSrc}-${index}`}
                className="relative h-[490px] w-[min(78vw,424px)] shrink-0 snap-start md:h-[320px] md:w-[250px] md:shrink"
              >
                <Image
                  src={card.imageSrc}
                  alt={card.name}
                  fill
                  sizes="(max-width: 768px) 78vw, 20vw"
                  className="rounded-lg object-contain object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}