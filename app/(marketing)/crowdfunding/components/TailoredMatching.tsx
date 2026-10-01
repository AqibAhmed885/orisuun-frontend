import Image from 'next/image';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function TailoredMatching() {
  return (
    <section className="bg-white px-5 py-16 md:px-8 md:py-24 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-2xl font-medium leading-[1.02] tracking-normal text-[#0B1220] md:text-[42px]">
            Tailored,{' '}
            <span className="relative inline-flex items-center justify-center px-2 py-1 md:px-">
              <svg width="551" height="54" viewBox="0 0 551 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 top-0 z-0 w-full h-full">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M382.901 1.0364C363.553 0.778483 347.275 0.503713 338.873 0.259816C322.277 -0.221988 282.903 -0.0150154 251.373 0.725937C227.135 1.29344 187.413 2.71206 151.351 4.17161C141.267 4.07035 131.053 3.94358 120.988 3.79157C31.069 2.43377 19.5353 2.63679 14.9852 5.65747C10.2715 8.78849 10.2536 9.05492 14.7525 9.15094C15.9868 9.17724 17.2529 9.36674 18.3357 9.65664C16.3278 10.0877 15.1656 10.6027 14.2853 11.2236C14.0891 11.3621 13.9013 11.4951 13.7218 11.6229C6.79034 10.77 5.79012 11.2509 6.90885 14.6901C7.15951 15.4605 7.13798 16.3476 6.89187 17.2557C6.21759 17.5639 6.02836 18.1119 6.174 18.9681C5.50007 20.1536 4.4855 21.2706 3.24004 22.0974C-1.40465 25.181 -1.27546 25.4441 5.06105 25.8079L5.36056 25.8248C4.79253 26.6044 4.07834 27.3223 3.25002 27.9065C-1.26041 31.0878 -1.12002 31.348 5.22927 31.5764C8.98788 31.7113 13.0066 31.723 14.1596 31.6024C15.1159 31.5021 18.3746 33.0162 21.9384 35.1566C19.2047 35.4294 20.1282 35.8521 24.0186 36.8774C24.4389 36.9881 24.8508 37.1065 25.2529 37.2313C27.1422 38.3568 29.1431 39.2755 31.2549 39.9872C33.444 41.5029 33.8365 42.8811 31.0709 42.9495C22.9928 43.1493 32.9675 46.932 51.7691 50.799C72.2263 55.0064 73.3692 55.0095 173.097 51.1421C194.343 50.3183 216.189 49.364 236.022 48.4128C247.163 48.723 260.643 48.9856 274.426 49.1613C284.893 49.5148 295.507 49.8209 305.379 50.0434C363.589 51.3602 509.047 51.9769 489.667 50.8248C473.179 49.8445 481.761 47.8089 507.837 46.5153C521.279 45.8484 532.78 44.3375 533.394 43.1578C534.009 41.9781 538.09 41.0893 542.463 41.1826C548.383 41.309 550.459 40.319 550.588 37.3089C550.638 36.1609 550.296 35.2519 549.407 34.5016C550.537 33.8628 551 32.8757 551 31.4378C551 28.7162 548.864 27.3829 542.469 26.4141C545.271 26.3573 545.899 26.1465 544.677 25.602C545.563 25.1114 545.442 24.1368 544.746 22.459C544.509 21.8882 544.417 21.2443 544.452 20.569C545.44 20.4271 545.434 20.2051 544.538 19.8411C544.857 18.0684 545.979 16.1875 547.636 14.9007C551.869 11.6129 551.719 11.3561 545.526 11.2808C542.133 11.2397 538.528 11.3096 537.125 11.4379C536.169 10.6903 533.565 9.64139 529.641 8.42363C528.729 7.9112 527.787 7.35425 526.851 6.76896C521.553 3.45591 515.456 1.84718 508.567 1.94548C507.028 1.96746 505.036 1.98241 502.65 1.99087C488.442 -0.377711 471.251 -0.173209 389.319 0.945691C387.185 0.974835 385.045 1.00509 382.901 1.0364ZM46.9247 14.3377C46.5842 14.3818 46.2469 14.4261 45.9131 14.4709C45.0913 14.3485 44.2743 14.2204 43.4656 14.087C44.6253 14.1642 45.7804 14.2479 46.9247 14.3377ZM25.305 8.75224C27.1418 8.60239 29.2881 8.46815 31.8085 8.34694C27.1654 8.15886 25.1688 8.2445 25.305 8.75224Z" fill="#BAD9FF" />
              </svg>


                          <span className="relative z-10">Crowdfunding Infrastructure </span>
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[580px] text-sm tracking-wider text-[#65728A] leading-loose md:text-base">
            Launch campaigns exclusive to your business identity, tap into global backing, and access strategic matching capital all in one secure place.
          </p>
        </div>

        <div className="mt-12 overflow-hidden bg-[#FBFCFE]  md:mt-16 lg:grid lg:min-h-[540px] lg:grid-cols-[1fr_1fr]">
            <div className="h-full w-full relative ">
              <Image
              src={`${staticUrl}/businessDevelopment/crowdfunding.svg`}
                alt="Crowdfunding infrastructure and matching dashboard"
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-contain object-left-top rounded-t-[28px]"
              />
            </div>

          <div className="flex flex-col px-6 py-5 md:px-10 lg:px-12 lg:py-4">
            <h3 className="max-w-[560px] text-[28px] font-medium leading-[1.08] tracking-wide text-[#07142D] md:text-[32px]">
              Maximum Exposure, Seamless Contributions
            </h3>
            <p className="mt-4 max-w-[610px] text-base tracking-wide leading-[1.42] text-[#65728A] md:text-lg">
              We make it easy for your network to back your growth. While your campaign lives within our dedicated in-platform Crowdfunding section, it simultaneously syncs directly to your public business profile. This means absolutely anyone—inside or outside the platform—can discover your goals, view your traction, and securely contribute to your campaign in just a few clicks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
