export default function FeaturesSection() {
  const featureCards = [
    {
      icon: (
        <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M20.0078 26.25V23.75C20.0078 22.4239 19.481 21.1521 18.5433 20.2145C17.6057 19.2768 16.3339 18.75 15.0078 18.75H7.50781C6.18173 18.75 4.90996 19.2768 3.97228 20.2145C3.0346 21.1521 2.50781 22.4239 2.50781 23.75V26.25' fill='#EBC52A' />
          <path d='M11.2578 13.75C14.0192 13.75 16.2578 11.5114 16.2578 8.75C16.2578 5.98858 14.0192 3.75 11.2578 3.75C8.49639 3.75 6.25781 5.98858 6.25781 8.75C6.25781 11.5114 8.49639 13.75 11.2578 13.75Z' fill='#EBC52A' />
          <path d='M27.4922 26.2496V23.7496C27.4914 22.6418 27.1226 21.5656 26.4439 20.69C25.7652 19.8144 24.8148 19.1891 23.7422 18.9121' stroke='#EBC52A' strokeWidth='2.59375' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M19.9922 3.91211C21.0677 4.18749 22.021 4.81299 22.7017 5.69C23.3825 6.56701 23.752 7.64565 23.752 8.75586C23.752 9.86607 23.3825 10.9447 22.7017 11.8217C22.021 12.6987 21.0677 13.3242 19.9922 13.5996' stroke='#EBC52A' strokeWidth='2.59375' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      ),
      bg: 'bg-gradient-radial from-[#EBC52A66] to-transparent',
      border: 'border-[#EBC52A66]',
      title: 'Real platform, real members',
      desc: 'Orisuun connects small businesses with customers, capital, expertise, and visibility',
    },
    {
      icon: (
        <svg width='20' height='30' viewBox='0 0 20 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M9.81503 27.1734C7.89595 27.1734 6.20809 26.9017 4.75144 26.3584C3.30636 25.815 2.16763 25.0231 1.33526 23.9827C0.514451 22.9306 0.0693642 21.6416 0 20.1156L0.017341 20.0462L5.49711 20.0289L5.51445 20.0983C5.63006 20.6532 5.86705 21.1272 6.22543 21.5202C6.58382 21.9017 7.06936 22.1908 7.68208 22.3873C8.30636 22.5723 9.0578 22.6647 9.93642 22.6647C10.8382 22.6647 11.5954 22.5838 12.2081 22.422C12.8324 22.2486 13.3006 21.9942 13.6127 21.659C13.9364 21.3237 14.0983 20.9017 14.0983 20.3931V20.3584C14.0983 19.6532 13.8035 19.1214 13.2139 18.763C12.6243 18.3931 11.6012 18.052 10.1445 17.7399L7.43931 17.1676C5.87861 16.8324 4.56069 16.3642 3.48555 15.763C2.42197 15.1618 1.61272 14.3988 1.0578 13.474C0.514451 12.5491 0.242775 11.4393 0.242775 10.1445V10.1272C0.242775 8.61272 0.653179 7.31792 1.47399 6.24277C2.2948 5.15607 3.41618 4.3237 4.83815 3.74566C6.27168 3.16763 7.91908 2.87861 9.78035 2.87861C11.7572 2.87861 13.4566 3.17341 14.8786 3.76301C16.3006 4.3526 17.4104 5.19653 18.2081 6.2948C19.0058 7.3815 19.4451 8.6763 19.526 10.1792L19.5087 10.2832H14.0636L14.0462 10.2312C13.9538 9.59538 13.7225 9.06936 13.3526 8.65318C12.9942 8.23699 12.5145 7.92486 11.9133 7.71676C11.3237 7.49711 10.6358 7.38728 9.84971 7.38728C9.01734 7.38728 8.31792 7.47977 7.75144 7.66474C7.19653 7.83815 6.77457 8.09249 6.48555 8.42775C6.19653 8.76301 6.05202 9.16763 6.05202 9.64162V9.6763C6.05202 10.104 6.18497 10.4798 6.45087 10.8035C6.71676 11.1156 7.12717 11.3873 7.68208 11.6185C8.23699 11.8382 8.94798 12.0462 9.81503 12.2428L12.5549 12.815C15.0173 13.3353 16.8555 14.1272 18.0694 15.1908C19.2948 16.2543 19.9075 17.7572 19.9075 19.6994V19.7341C19.9075 21.3064 19.4855 22.6474 18.6416 23.7572C17.7977 24.8671 16.6185 25.7168 15.104 26.3064C13.5896 26.8844 11.8266 27.1734 9.81503 27.1734ZM9.05202 30V0H10.9075V30H9.05202Z' fill='#2357C6' />
        </svg>
      ),
      bg: 'bg-gradient-radial from-[#2357C626] to-[#2357C600]',
      border: 'border-[#2357C666]',
      title: 'Structured weekly funding',
      desc: 'One active member is selected every week through a defined entry system tied to platform activity',
    },
    {
      icon: (
        <svg width='26' height='30' viewBox='0 0 26 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g clipPath='url(#clip0_169_2490)'>
            <path d='M12.7274 0C7.40274 0 1.86437 1.29663 1.86437 1.29663L1.85985 1.30151C0.779278 1.5352 0.00116183 2.55949 0 3.75005V11.2501C0 24.2478 11.5953 29.6803 11.5953 29.6803C11.941 29.89 12.3309 30.0004 12.7274 30.0004C13.1224 29.9995 13.5106 29.8892 13.8551 29.6803H13.8596C13.8596 29.6803 25.4549 24.2478 25.4549 11.2501V3.75005C25.4554 2.55614 24.6745 1.52864 23.5905 1.29663C23.5905 1.29663 18.0521 0 12.7274 0ZM12.7274 8.07716C14.6447 8.07716 16.1986 9.62673 16.1986 11.5387C16.1986 13.0433 15.2301 14.3119 13.8845 14.7885V18.4617C13.8845 19.0986 13.3661 19.6158 12.7274 19.6158C12.0888 19.6158 11.5704 19.0986 11.5704 18.4617V14.7885C10.2248 14.3119 9.25632 13.0433 9.25632 11.5387C9.25632 9.62673 10.8102 8.07716 12.7274 8.07716Z' fill='#7443FF' />
          </g>
          <defs>
            <clipPath id='clip0_169_2490'>
              <rect width='25.4549' height='30.0004' fill='white' />
            </clipPath>
          </defs>
        </svg>
      ),
      bg: 'bg-gradient-radial from-[#7443FF66] to-[#7443FF00]',
      border: 'border-[#7443FF66]',
      title: 'Direct, secure payouts',
      desc: 'Funds are sent directly to verified bank accounts or digital wallets',
    },
    {
      icon: (
        <svg width='34' height='34' viewBox='0 0 34 34' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <mask id='mask0_219_4015' maskUnits='userSpaceOnUse' x='2' y='2' width='29' height='29'>
            <path d='M27.0156 4.15625H6.23438C5.68322 4.15625 5.15464 4.37519 4.76492 4.76492C4.37519 5.15464 4.15625 5.68322 4.15625 6.23438V27.0156C4.15625 27.5668 4.37519 28.0954 4.76492 28.4851C5.15464 28.8748 5.68322 29.0938 6.23438 29.0938H27.0156C27.5668 29.0938 28.0954 28.8748 28.4851 28.4851C28.8748 28.0954 29.0938 27.5668 29.0938 27.0156V6.23438C29.0938 5.68322 28.8748 5.15464 28.4851 4.76492C28.0954 4.37519 27.5668 4.15625 27.0156 4.15625Z' fill='white' stroke='white' strokeWidth='2.77083' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M14.5521 21.474L18.0156 24.2448L23.5573 17.3177M9.70312 10.3906H23.5573M9.70312 15.9323H15.2448' stroke='black' strokeWidth='2.77083' strokeLinecap='round' strokeLinejoin='round' />
          </mask>
          <g mask='url(#mask0_219_4015)'>
            <path d='M0 0H33.25V33.25H0V0Z' fill='#4ECF17' />
          </g>
        </svg>
      ),
      bg: 'bg-gradient-radial from-[#4ECF1766] to-[#4ECF1700]',
      border: 'border-[#4ECF1766]',
      title: 'All out in the open',
      desc: 'Orisuun makes sure all transactions – from selection to payment – are open and visible for everyone to see',
    },
  ];

  return (
    <section className='relative w-full py-14 md:py-24 bg-white'>
      <div className='pointer-events-none absolute inset-x-0 -top-8 h-16 bg-gradient-to-b from-white/95 via-white/50 to-transparent blur-lg' />
      <div className='max-w-[1440px] mx-auto px-4 sm:px-6 space-y-10 md:space-y-16'>
        <div className='flex flex-col items-center'>
          <h2 className='text-[34px] leading-[1.1] md:text-[56px] font-semibold text-center mt-2 md:mt-3 mb-3 md:mb-4 max-w-2xl'>
            Structured, Transparent, and Consistent
          </h2>
          <p className='text-[#5B657B] text-base sm:text-lg p-4 md:text-xl tracking-wide leading-relaxed max-w-2xl text-center hidden md:block'>
            Orisuun is a platform where small businesses connect with customers, capital, and expertise to grow. The weekly $1,000 fund is built into the platform and rewards real activity—like engaging with customers, networking, and building your business.
          </p>
          <p className='text-[#5B657B] text-base sm:text-lg p-4 md:text-xl tracking-wide leading-relaxed max-w-2xl text-center block md:hidden'>
            Orisuun is a platform where small businesses connect with customers, capital, and expertise to grow. The weekly $1,000 fund is built into the platform and rewards real business-building activity.
          </p>
          
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {featureCards.map((f) => (
            <div key={f.title} className='flex md:flex-col items-start gap-4 p-4 md:p-5 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow'>
              <div className={`w-16 h-16 flex-shrink-0 rounded-2xl border ${f.bg} ${f.border} flex items-center justify-center`}>{f.icon}</div>
              <div>
                <h3 className='text-lg md:text-xl font-semibold text-[#001E5F] mb-2'>{f.title}</h3>
                <p className='text-[#5B657B] text-sm md:text-[15px] leading-relaxed'>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
