import Image from "next/image";
import type { ReactNode } from "react";



export default function BookingBenefits({
  benefitCards,
  title,
  description,
  highlightedTitle,
  afterTitle,
  className = '',
}: {
    benefitCards: {
      title: string;
      description: string;
      Icon?: ReactNode;
      path?: string;
    }[];
    title?: ReactNode;
    description?: ReactNode;
    highlightedTitle?: ReactNode;
    afterTitle?: ReactNode;
    className?: string;
  }) {
  return (
    <section className={`bg-[#EEEFF5] mt-2 rounded-[12px] py-12 mx-2 md:mx-0 sm:py-36 ${className}`}>
      <div className="mx-auto w-full max-w-[1160px] rounded-[18px]  px-4 sm:px-8 lg:px-12">
        <h2 className="mx-auto max-w-[980px] text-center text-2xl font-normal leading-[1.1] tracking-[-0.02em] text-[#040b1a] sm:text-[42px]">
          {title}
          {
            highlightedTitle && (
              <span className="relative inline-block px-2">
                <svg width="347" height="51" viewBox="0 0 347 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0  w-full ">
                  <path fillRule="evenodd" clipRule="evenodd" d="M241.138 0.978819C228.953 0.735234 218.702 0.475729 213.41 0.245382C202.958 -0.209655 178.162 -0.0141811 158.306 0.685607C143.042 1.22159 118.026 2.56139 95.3155 3.93986C88.965 3.84422 82.5326 3.7245 76.1938 3.58092C19.5661 2.29856 12.3026 2.4903 9.43711 5.34317C6.46862 8.30024 6.45738 8.55187 9.29061 8.64255C10.0679 8.66739 10.8652 8.84637 11.5472 9.12016C10.2826 9.52732 9.55077 10.0137 8.99638 10.6C8.8728 10.7308 8.75452 10.8565 8.64152 10.9772C4.27631 10.1716 3.64641 10.6258 4.35094 13.8739C4.50881 14.6015 4.49525 15.4394 4.34025 16.2971C3.91561 16.5881 3.79645 17.1057 3.88816 17.9143C3.46375 19.0339 2.82481 20.0889 2.04046 20.8698C-0.884596 23.7821 -0.80324 24.0306 3.18727 24.3741L3.37589 24.3901C3.01817 25.1264 2.56839 25.8044 2.04675 26.3562C-0.79376 29.3607 -0.705349 29.6065 3.29321 29.8221C5.66024 29.9496 8.19109 29.9606 8.91723 29.8467C9.51946 29.752 11.5717 31.1819 13.816 33.2034C12.0944 33.4611 12.676 33.8604 15.1261 34.8286C15.3907 34.9333 15.6501 35.045 15.9034 35.1629C17.0932 36.2259 18.3533 37.0935 19.6832 37.7656C21.0618 39.1972 21.309 40.4988 19.5673 40.5634C14.4801 40.7521 20.7618 44.3247 32.6023 47.9768C45.4855 51.9505 46.2053 51.9534 109.01 48.3009C122.39 47.5228 136.148 46.6216 148.638 45.7232C155.654 46.0162 164.143 46.2642 172.824 46.4301C179.415 46.764 186.1 47.0531 192.317 47.2632C228.975 48.5069 320.579 49.0893 308.375 48.0012C297.991 47.0753 303.396 45.1528 319.817 43.9311C328.283 43.3013 335.525 41.8743 335.913 40.7602C336.3 39.646 338.87 38.8066 341.624 38.8947C345.352 39.014 346.66 38.0791 346.741 35.2362C346.772 34.1519 346.557 33.2935 345.997 32.5849C346.708 31.9815 347 31.0493 347 29.6913C347 27.1208 345.655 25.8617 341.627 24.9466C343.392 24.893 343.788 24.6939 343.018 24.1797C343.576 23.7163 343.5 22.7959 343.061 21.2113C342.912 20.6722 342.854 20.064 342.877 19.4262C343.499 19.2923 343.495 19.0826 342.93 18.7388C343.131 17.0646 343.838 15.2882 344.881 14.0729C347.547 10.9677 347.453 10.7252 343.553 10.6541C341.416 10.6153 339.146 10.6813 338.262 10.8024C337.66 10.0964 336.02 9.10575 333.549 7.95565C332.974 7.47169 332.381 6.94568 331.792 6.39291C328.456 3.26392 324.615 1.74456 320.277 1.8374C319.308 1.85816 318.053 1.87227 316.551 1.88026C307.603 -0.356728 296.777 -0.163586 245.179 0.893153C243.835 0.920678 242.487 0.949253 241.138 0.978819ZM29.5515 13.5411C29.3371 13.5828 29.1247 13.6247 28.9144 13.667C28.3969 13.5513 27.8824 13.4304 27.3731 13.3044C28.1034 13.3773 28.8309 13.4564 29.5515 13.5411ZM15.9362 8.26601C17.0929 8.12448 18.4446 7.9977 20.0319 7.88322C17.1078 7.70559 15.8504 7.78648 15.9362 8.26601Z" fill="#BAD9FF" />
                </svg>
                <span className="relative z-10 ">
                  {highlightedTitle}
                </span>{' '}
              </span>
            )
          }
          
          {afterTitle}

        </h2>
        {description && (
          <p className="mx-auto mt-2 max-w-[620px] text-center text-sm leading-[1.45] text-[#5c6c88] sm:text-lg">
            {description}
          </p>
        )}

        <div className={`mt-10 grid overflow-hidden rounded-[18px] border border-[#d9e3f1] bg-white ${benefitCards.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {benefitCards.map(({ title, description, Icon, path }) => (
            <article
              key={title}
              className="consultant-card-gradient min-h-[280px] group relative isolate border-b border-[#d9e3f1] p-7 md:border-b-0 md:border-r last:border-r-0"
            >
              {/* gradient background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent from-[75%] to-[#0095FF]/20   -opacity group-hover:opacity-100" />
              <div className="relative z-10">
                {Icon ? (
                  Icon
                ) : path ? (
                  <Image src={path} alt={title} width={50} height={50} />
                ) : null}
                <h3 className="mt-12 text-lg font-semibold leading-[1.2] text-[#04256f] sm:text-xl">{title}</h3>
                <p className="mt-4 text-xs leading-[1.45] text-[#5c6c88] sm:text-sm">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
