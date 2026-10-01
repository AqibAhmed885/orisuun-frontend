import TopVoiceHoverCard, { TopVoiceProfile } from './TopVoiceHoverCard';

const topVoices: TopVoiceProfile[] = [
  {
    name: 'Gbbadebo Marcus',
    image: '/homepage-new/team/marcus.svg',
    summary:
      'Venture advisor supporting founders, operators, and investment teams across early-stage growth, partnerships, and market expansion.',
    gridClass: 'lg:col-start-1 lg:row-start-1',
  },
  {
    name: 'Rhasaan Jonnu',
    image: '/homepage-new/team/onno.svg',
    summary:
      'Founder and ecosystem builder connecting Black-owned businesses with investors, advisors, professionals, and strategic growth partners.',
    gridClass: 'lg:col-start-3 lg:row-start-1',
  },
  {
    name: 'Anthony Adewuyi',
    image: '/homepage-new/team/anthony.svg',
    summary:
      '15+ years advising founders and growth teams across Deloitte, Shopify, Stripe, and high-growth consumer brands.',
    gridClass: 'lg:col-start-2 lg:row-start-2',
  },
  {
    name: 'Rachael Dasilva',
    image: '/homepage-new/team/rachael.svg',
    summary:
      'Growth mentor supporting founders, nonprofits, and operators -- Ex Google, Meta, and HubSpot.',
    gridClass: 'lg:col-start-3 lg:row-start-2',
  },
  {
    name: 'Cynthia Maddu',
    image: '/homepage-new/team/maddu.svg',
    summary:
      'Research and strategy advisor helping founders understand markets, refine opportunities, and make stronger business decisions.',
    gridClass: 'lg:col-start-1 lg:row-start-3',
  },
  {
    name: 'Daiki Mensah',
    image: '/homepage-new/team/mensah.svg',
    summary:
      'Technology advisor helping founders turn ideas into scalable products, digital systems, and investor-ready growth infrastructure.',
    gridClass: 'lg:col-start-2 lg:row-start-3',
  },
];

export default function TopVoicesSection() {

  return (
    <section
      className="overflow-hidden bg-[#BAD9FF] px-4 py-8 sm:px-6 sm:py-10 lg:px-9 lg:py-8"
    >
      <div className="mx-auto max-w-[1280px]">
        <h2 className="top-voices-heading mx-auto mb-12 max-w-[620px] text-center text-2xl font-medium leading-[1.07] tracking-normal text-[#07142d]  lg:mb-16 md:text-[42px]">
          Meet some of the {' '}
          <span className="relative mx-1.5 inline-block text-white">
            <svg
              width="210"
              height="54"
              viewBox="0 0 210 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute md:-bottom-2 left-1/2 -z-0 -translate-x-1/2 size-[120%]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M145.933 1.0364C138.559 0.778483 132.355 0.503713 129.153 0.259816C122.828 -0.221988 107.822 -0.0150153 95.8048 0.725937C86.5669 1.29344 71.4277 2.71206 57.6837 4.17161C53.8405 4.07035 49.9477 3.94358 46.1115 3.79157C11.8412 2.43377 7.4454 2.63679 5.71122 5.65747C3.91473 8.78849 3.90792 9.05492 5.62256 9.15094C6.09296 9.17724 6.57551 9.36674 6.98821 9.65664C6.22292 10.0877 5.78 10.6027 5.4445 11.2236C5.36971 11.3621 5.29812 11.4951 5.22974 11.6229C2.58797 10.77 2.20676 11.2509 2.63314 14.6901C2.72867 15.4605 2.72047 16.3476 2.62667 17.2557C2.36968 17.5639 2.29756 18.1119 2.35307 18.9681C2.09622 20.1536 1.70954 21.2706 1.23486 22.0974C-0.535346 25.181 -0.486111 25.4441 1.9289 25.8079L2.04304 25.8248C1.82656 26.6044 1.55436 27.3223 1.23867 27.9065C-0.480373 31.0878 -0.426868 31.348 1.99301 31.5764C3.42551 31.7113 4.95714 31.723 5.39659 31.6024C5.76106 31.5021 7.00302 33.0162 8.36126 35.1566C7.31938 35.4294 7.67137 35.8521 9.1541 36.8774C9.31428 36.9882 9.47126 37.1065 9.62451 37.2313C10.3446 38.3568 11.1072 39.2755 11.912 39.9872C12.7464 41.5029 12.8959 42.8811 11.8419 42.9495C8.76315 43.1493 12.5648 46.932 19.7305 50.799C27.5273 55.0064 27.9629 55.0095 65.9716 51.1421C74.069 50.3183 82.395 49.364 89.9541 48.4128C94.1999 48.723 99.3375 48.9856 104.591 49.1613C108.58 49.5148 112.625 49.8209 116.388 50.0434C138.573 51.3602 194.011 51.9769 186.624 50.8248C180.34 49.8445 183.611 47.8089 193.549 46.5153C198.673 45.8484 203.056 44.3375 203.29 43.1578C203.524 41.9781 205.08 41.0893 206.746 41.1826C209.003 41.309 209.794 40.319 209.843 37.3089C209.862 36.1609 209.732 35.2519 209.393 34.5016C209.823 33.8628 210 32.8757 210 31.4378C210 28.7162 209.186 27.3829 206.748 26.4141C207.816 26.3573 208.056 26.1465 207.59 25.602C207.928 25.1114 207.882 24.1368 207.616 22.459C207.526 21.8882 207.491 21.2443 207.505 20.569C207.881 20.4271 207.879 20.2051 207.537 19.8411C207.659 18.0684 208.086 16.1875 208.718 14.9007C210.331 11.6129 210.274 11.3561 207.914 11.2808C206.621 11.2397 205.247 11.3096 204.712 11.4379C204.348 10.6903 203.355 9.64139 201.86 8.42363C201.512 7.9112 201.153 7.35425 200.796 6.76896C198.777 3.45591 196.453 1.84718 193.828 1.94548C193.241 1.96746 192.482 1.98241 191.573 1.99087C186.158 -0.377712 179.606 -0.173209 148.379 0.945691C147.566 0.974835 146.75 1.00509 145.933 1.0364Z"
                fill="#00091E"
              />
            </svg>

            <span className="relative z-10 inline-block -rotate-2 px-2">
              top voices
            </span>
          </span>{' '}
          shaping the Orisuun ecosystem.
        </h2>

        <div
          className="
            -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4
            [scrollbar-width:none]
            sm:-mx-6 sm:px-6
            lg:mx-0 lg:grid lg:grid-cols-3 lg:grid-rows-3 lg:gap-x-4 lg:gap-y-3 lg:overflow-visible lg:px-0 lg:pb-0
            [&::-webkit-scrollbar]:hidden
          "
        >
          {topVoices.map((voice) => (
            <div
              key={voice.name}
              className={`
                top-voice-card-shell
                min-w-[82vw] max-w-[460px] snap-center
                sm:min-w-[62vw]
                md:min-w-[48vw]
                lg:min-w-0 lg:max-w-none
                ${voice.gridClass ?? ''}
              `}
            >
              <TopVoiceHoverCard profile={{ ...voice, gridClass: undefined }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
