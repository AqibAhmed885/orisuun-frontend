import Image from 'next/image';

const Beta = () => {
  return (
    <section className="mt-[100px] xl:px-[80px] mb-[148px]">
      <h2 className="text-blue-strong text-[24px] leading-[28.8px] md:text-[40px] font-semibold md:leading-[110%] mt-[142px] text-center mb-8 md:mb-[60px] px-4">
        Be the first - join us in our beta launch
      </h2>
      <div className="flex justify-center px-4 md:px-0">
        <div className="flex gap-8 flex-col md:flex-row mx-auto">
          <div className="bg-[#f8f8f8] px-5 md:pl-10 md:pr-[38px] border w-full max-w-[624px] rounded-[12px] border-[#D8D8D9] pb-6 md:pb-9">
            <div className="flex flex-col-reverse md:flex-row md:justify-between">
              <h4 className="text-[20px] leading-[26px] md:text-[24px] text-blue-strong font-semibold md:leading-[150%] pt-5 md:pt-9">
                Why do I need to join now?
              </h4>
              <Image
                src="home/icons/rocket.svg"
                alt="rocket"
                width={32}
                height={32}
                loading="lazy"
                className="pt-[28px] md:pt-[38px]"
              />
            </div>
            <div className="flex  mt-8">
              <p className="text-[#4A4A4A] md:text-[#6e6e6e] text-base md:text-xl font-medium md:leading-[150%] md:max-w-[458px] border-l-[1px] border-[#6E6E6E] pl-3 md:pl-5">
                Members get exposure, access to exclusive savings, connections,
                and opportunities to scale and expand.
              </p>
            </div>
            <div className="flex  mt-6">
              <p className="text-[#4A4A4A] md:text-[#6e6e6e] text-base md:text-xl font-medium md:leading-[150%] md:max-w-[458px] border-l-[1px] border-[#6E6E6E] pl-3 md:pl-5 ">
                We&apos;re offering rewards to our early-adopting{' '}
                <span className="font-semibold custom-underline text-gradient">
                  Pioneers
                </span>{' '}
                and{' '}
                <span className="font-semibold custom-underline text-gradient">
                  Trailblazers
                </span>{' '}
                , including early access to new features, profile promotion, and
                free verifications.
              </p>
            </div>
          </div>

          <div className="bg-[#f8f8f8] px-5 md:pl-10 md:pr-[38px] border w-full max-w-[624px] rounded-[12px] border-[#D8D8D9] pb-6 md:pb-9">
            <div className="flex flex-col-reverse md:flex-row md:justify-between">
              <h4 className="text-[20px] leading-[26px] md:text-[24px] text-blue-strong font-semibold md:leading-[150%] pt-5 md:pt-9">
                Watch us grow every day!
              </h4>
              <Image
                src="home/icons/badge.svg"
                alt="rocket"
                width={32}
                height={32}
                loading="lazy"
                className="pt-[38px]"
              />
            </div>
            <div className="flex  mt-8">
              <p className="text-[#4A4A4A] md:text-[#6e6e6e] text-base md:text-xl font-medium md:leading-[150%] md:max-w-[458px] border-l-[1px] border-[#6E6E6E] pl-3 md:pl-5">
                This year we will be rolling out new features as well as
                expanding upon existing ones on a quarterly basis.
              </p>
            </div>
            <div className="flex  mt-6">
              <p className="text-[#4A4A4A] md:text-[#6e6e6e] text-base md:text-xl font-medium md:leading-[150%] md:max-w-[458px] border-l-[1px] border-[#6E6E6E] pl-3 md:pl-5">
                Every day we have new members joining the club.
              </p>
            </div>
            <div className="flex gap-3 md:gap-5 mt-6">
              <p className="text-[#4A4A4A] md:text-[#6e6e6e] text-base md:text-xl font-medium md:leading-[150%] md:max-w-[458px] border-l-[1px] border-[#6E6E6E] pl-3 md:pl-5">
                Each day this site will be better than the day before.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beta;
