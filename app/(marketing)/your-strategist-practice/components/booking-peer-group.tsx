import Image from 'next/image';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const partnerLogos = [
  { name: 'Scotiabank', slug: 'scotiabank' },
  { name: 'McKinsey & Company', slug: 'mckinsey' },
  { name: 'Evercore', slug: 'evercore' },
  { name: 'BCG', slug: 'bcg' },
  { name: 'Goldman Sachs', slug: 'goldman-sachs' },
  { name: 'Skadden', slug: 'skadden' },
  { name: 'Oliver Wyman', slug: 'oliver-wyman' },
  { name: 'Clifford Chance', slug: 'clifford-chance' },
];

function PartnerLogoCard({
  partner,
}: {
  partner: {
    name: string;
    slug: string;
  };
}) {
  return (
    <div className="flex sm:h-[66px] h-[45px] w-[150px] shrink-0 items-center justify-center md:rounded-2xl rounded-lg bg-[#FFFFFF33] px-4">
      <Image
        src={`${staticUrl}/homepage-new/partners/${partner.slug}.svg`}
        alt={partner.name}
        width={170}
        height={52}
        className="sm:h-9 h-4 w-auto object-contain opacity-80"
      />
    </div>
  );
}

export default function BookingPeerGroup() {
  const marqueeLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <section className="bg-white py-12 sm:py-16 px-2">
      <div className="mx-auto w-full max-w-[1260px] overflow-hidden md:rounded-[35px] rounded-[15px] bg-[#0A1734] px-4 pb-8 pt-12 sm:px-8 sm:pt-16 lg:px-12 md:min-h-[400px]">
        <div className="mx-auto max-w-[900px] md:text-center">
          <h2 className="text-2xl font-normal leading-[1.05] tracking-[-0.02em] text-white sm:text-[42px]">
            Join a Peer Group of
            <br className="hidden sm:block"/>
            Top-Tier Operators
          </h2>

          <p className="mx-auto mt-5 max-w-[460px] text-sm leading-[1.45] text-[#c8d5ea] sm:text-base">
            Join investors from Goldman Sachs, General Catalyst, Seedcamp, and many more who are already mentoring the
            next wave of owners.
          </p>
        </div>

        <div className="relative mt-14 overflow-hidden">
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#0A1734] to-transparent" />

          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#0A1734] to-transparent" />

          <div className="flex w-max animate-partner-marquee gap-3">
            {marqueeLogos.map((partner, index) => (
              <PartnerLogoCard key={`${partner.slug}-${index}`} partner={partner} />
            ))}
          </div>
          <div className="flex w-max mt-3 animate-partner-marquee gap-3">
            {marqueeLogos.map((partner, index) => (
              <PartnerLogoCard key={`${partner.slug}-${index}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
