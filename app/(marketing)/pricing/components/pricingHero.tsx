
const pricingbg = `${process.env.NEXT_PUBLIC_STATIC_URL}/assets/img/bg-gradient-pric.webp`;

export const PricingHero = () => {
return (
    <>
      <section
              className="relative left-0 right-0 top-0 h-[740px] pt-16 sm:h-[500px] lg:h-[660px]"
              style={{
                backgroundImage: `url(${pricingbg})`,
                backgroundSize: 'cover',
              }}
            >
              <main className="flex h-full w-full md:mx-12 max-w-3xl flex-col px-4  xl:p-0">
                <h1 className="pt-[55px] text-[40px] font-semibold leading-normal text-blue-strong md:pt-[120px] text-left md:text-[80px] md:leading-[110%]">
                    Real Access, Real Collabs, Real Value!
                </h1>
                <p className="mx-auto mt-4  text-sm text-blue-strong/80 leading-9 md:mt-6 md:text-[26px]">
                    Get product updates, new member opportunities, partner discounts, and funding announcements delivered to your inbox.
                </p>
      
                <button className="mt-6 flex items-center justify-center gap-2 w-60 rounded-lg bg-blue-strong py-3 px-4 text-sm bg-gradient-to-tr from-[#16357A] to-[#69B3E7] text-white transition-all duration-300 hover:bg-gradient-to-tl  md:mt-8 md:py-4 md:px-8 md:text-lg">
                    Become a Member
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.43359 10.625H16.8294" stroke="#FBFBFD" stroke-width="1.77083" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10.625 4.42969L16.8229 10.6276L10.625 16.8255" stroke="#FBFBFD" stroke-width="1.77083" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>


                </button>
                <div className="md:absolute -bottom-[20%] mt-12 md:mt-0 right-12 flex justify-center pb-6 md:pb-12">
                    <div className="group relative w-[540px] h-[415px] overflow-hidden rounded-[33px] bg-gradient-to-br from-[#16357A]  to-[#69B3E7] p-6 text-white shadow-[0_18px_34px_rgba(13,38,82,.28)]  ease-out hover:shadow-[0_30px_55px_rgba(13,38,82,.4)] sm:p-8">
                        <div className="absolute -bottom-[50%] -right-[40%] h-[420px] w-[420px] rounded-full bg-[#9cd0ee]/55 transition-transform  " />
                        <div className="relative z-10">
                            <span className="inline-flex rounded-full bg-white/90 px-4 py-2 text-xs font-medium tracking-wide text-blue-strong sm:text-sm">
                                Annual membership
                            </span>
                            <div className="mt-5 text-[116px] font- leading-[.9] tracking-[0.03em] text-[#e5f0fb] sm:text-[160px]">
                                $49
                            </div>
                            <div className=" text-[32px] tracking-wide">/ year</div>
                            <p className="mt-3 border-b border-white/45 pb-1 text-xl font-medium">
                                That&apos;s just $4/month
                            </p>
                            <p className="mt-3 border-b border-white/45 py-1 text-xl font-medium">
                                Instant access and savings
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            
            
            </section>
    </>
  );
};
