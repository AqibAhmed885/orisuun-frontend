export const AllWelcome = () => {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <section id="all-welcome" className="px-4 md:px-12 md:py-[150px]">
      <div
        className="bg-[#2C57A4] bg-[image:var(--star2-mobile)] md:bg-[image:var(--star2-desktop)] bg-no-repeat bg-left-top md:h-[332px] rounded-[12px]"
        style={{
          "--star2-mobile": `url(${staticUrl}/about/images/star2-md.svg)`,
          "--star2-desktop": `url(${staticUrl}/about/images/star2.svg)`,
        }}
      >
        <div
          className="bg-[image:var(--star1-mobile)] md:bg-[image:var(--star1-desktop)] bg-no-repeat bg-right-bottom h-full w-full rounded-xl flex flex-col gap-[40px] justify-center items-center text-center md:px-0 md:py-0 px-4 py-10"
          style={{
            "--star1-mobile": `url(${staticUrl}/about/images/star1-md.svg)`,
            "--star1-desktop": `url(${staticUrl}/about/images/star1.svg)`,
          }}
        >
          <h5 className="max-w-[572px] text-white text-[24px] md:text-[40px] leading-[29px] md:leading-[44px] font-semibold">
            We do not discriminate against any person or any group.
          </h5>
          <h5 className="max-w-[572px] text-white text-[24px] md:text-[40px] leading-[29px] md:leading-[44px] font-semibold">
            All are enthusiastically welcome!
          </h5>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[31px] mt-10 mb-[120px] md:mb-0 ">
        <div className="space-y-3">
          <p className="text-blue-strong text-xl md:text-[24px] md:leading-[36px] font-semibold text-center md:text-left">
            We facilitate opportunity
          </p>
          <p className="text-[#3B4761] md:text-[20px] md:leading-[30px] md:text-left text-center  md:max-w-[407px] font-medium">
            Black-owned businesses globally struggle more than other groups due
            to limited access to capital, experience, mentorship, visibility,
            and education.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-blue-strong text-xl md:text-[24px] md:leading-[36px] font-semibold text-center md:text-left">
            Restoring Black Wealth
          </p>
          <p className="text-[#3B4761] md:text-[20px] md:leading-[30px] md:text-left text-center  md:max-w-[407px] font-medium">
            Centuries of deliberate prevention, theft, and destruction of Black
            wealth and means have left Black peoples around the world in a
            vulnerable position.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-blue-strong text-xl md:text-[24px] md:leading-[36px] font-semibold text-center md:text-left">
            Support us - and we will support you
          </p>
          <p className="text-[#3B4761] md:text-[20px] md:leading-[30px] md:text-left text-center  md:max-w-[407px] font-medium">
            Black-owned businesses are essential for growing a global Black
            middle class, which in turn empowers our leaders with greater
            authority.
          </p>
        </div>
      </div>
    </section>
  );
};
