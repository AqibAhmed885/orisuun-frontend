import Link from 'next/link';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function HeroSection() {
  return (
    <section
      className='relative w-full overflow-hidden min-h-[640px] md:min-h-[760px] bg-white rounded-b-[60px] -mb-px flex items-center pt-20 md:pt-24 pb-14 md:pb-20'
      style={{
        backgroundImage: `url(${staticUrl}/landing/weekly-giveaway/bg-hero.svg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-white  to-transparent'
      />
      <div className='max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center justify-center w-full'>
        <h1 className='inline-block px-4 py-2 rounded-full text-xs sm:text-sm xl:text-base tracking-wide mb-5 md:mb-6'>
          <span className='font-semibold'>$1,000</span> paid directly to winners every week
        </h1>
        <h2 className='text-[34px] leading-[1.1] sm:text-[40px] md:text-5xl xl:text-7xl font-semibold text-center mb-5 md:mb-6 max-w-4xl'>
          We fund one startup every week
        </h2>
        <p className='text-[#5B657B] text-base sm:text-lg md:text-xl leading-7 md:leading-[30px] max-w-lg px-2 sm:px-6 font-medium text-center mb-8 md:mb-10'>
          Join the largest global startup network. Stay active, earn entries, and get paid to grow.
        </p>
        <div className='flex flex-col items-center gap-4'>
          <Link
            href='/free/signup'
            className='text-white flex px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-medium text-sm sm:text-base tracking-wide transition-colors shadow-lg items-center gap-3 hover:brightness-95'
            style={{ background: 'linear-gradient(90deg, #2357C6 0%, #5F8EF2 50%, #2357C6 100%)' }}
          >
            Become a Member
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M4.17188 10H15.8385' stroke='#FBFBFD' strokeWidth='1.66667' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M10 4.16602L15.8333 9.99935L10 15.8327' stroke='#FBFBFD' strokeWidth='1.66667' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </Link>
          <p className='text-xs sm:text-sm text-[#5B657B] mt-1 sm:mt-2 font-medium'>
            It &apos; s Free!
          </p>
        </div>
      </div>
    </section>
  );
}
