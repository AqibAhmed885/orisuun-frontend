import Link from 'next/link';
import { PartnerCell } from './PartnerCell';


export default function PartnersGrid() {
  const partners = [
    { name: 'Goldman Sachs', slug: 'goldman-sachs' },
    { name: 'Skadden', slug: 'skadden' },
    { name: 'Oliver Wyman', slug: 'oliver-wyman' },
    { name: 'Clifford Chance', slug: 'clifford-chance' },
    { name: 'Morgan Stanley', slug: 'morgan-stanley' },
    { name: 'Bain & Company', slug: 'bain-company' },
    { name: 'BCG', slug: 'bcg' },
    { name: 'Osler', slug: 'osler' },
    { name: 'Lazard', slug: 'lazard' },
    { name: 'Scotiabank', slug: 'scotiabank' },
    { name: 'McKinsey & Company', slug: 'mckinsey' },
    { name: 'Evercore', slug: 'evercore' },
  ];

  return (
      <section className="mx-auto  rounded-[10px] bg-[#E8EBF894] ">
      <div className="grid grid-cols-4 gap-4 p-0.5 h-full">
        <div className="col-span-4 md:col-span-1 flex flex-col justify-between rounded-xl bg-[#F3F6FA] p-5">
                  <h3 className="md:text-2xl text-lg  text-[#5D5D69]">
            <span className="text-[#000511]">Trusted by founders, mentors, investors, professionals and experts </span>
            from leading firms and top global businesses.
                  </h3>
          <Link href="/pricing" prefetch={false} className="mt-6  flex  items-center gap-2 text-lg font-medium text-[#0F1724]">Start Free Trial
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.3013 8.70161C14.33 8.63819 14.3449 8.56936 14.3449 8.49973C14.3449 8.4301 14.33 8.36127 14.3013 8.29786C14.276 8.23265 14.2381 8.17307 14.1897 8.12255L8.87719 2.81004C8.77715 2.71001 8.64147 2.65381 8.5 2.65381C8.35853 2.65381 8.22285 2.71001 8.12281 2.81004C8.02278 2.91008 7.96658 3.04576 7.96658 3.18723C7.96658 3.32871 8.02278 3.46438 8.12281 3.56442L12.5322 7.96848H3.1875C3.0466 7.96848 2.91148 8.02445 2.81185 8.12408C2.71222 8.22371 2.65625 8.35884 2.65625 8.49973C2.65625 8.64063 2.71222 8.77575 2.81185 8.87538C2.91148 8.97501 3.0466 9.03098 3.1875 9.03098H12.5322L8.12281 13.435C8.07302 13.4844 8.0335 13.5432 8.00653 13.6079C7.97956 13.6727 7.96567 13.7421 7.96567 13.8122C7.96567 13.8824 7.97956 13.9518 8.00653 14.0165C8.0335 14.0813 8.07302 14.14 8.12281 14.1894C8.1722 14.2392 8.23096 14.2787 8.29569 14.3057C8.36043 14.3327 8.42987 14.3466 8.5 14.3466C8.57013 14.3466 8.63957 14.3327 8.70431 14.3057C8.76904 14.2787 8.8278 14.2392 8.87719 14.1894L14.1897 8.87692C14.2381 8.8264 14.276 8.76682 14.3013 8.70161Z" fill="#50505B" />
            </svg>
          </Link>
        </div>

        <div className="col-span-4 md:col-span-3">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-0.5 h-full">
            {partners.map((p) => (
              <PartnerCell key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
