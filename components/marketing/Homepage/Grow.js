import Image from 'next/image';
const Grow = () => {
  return (
    <section className=" xl:pl-[80px] mt-[100px] bg-white md:bg-[#F8F8F8] rounded-[25px]">
      <div className=" flex md:pt-20 lg:flex-row flex-col justify-center">
        <div className="pb-[110px] text-center lg:text-start max-w-[730px]">
          <h2 className="text-blue-strong text-[24px] leading-[28.8px] md:text-[40px] font-semibold md:leading-[110%] mx-auto lg:mx-0 max-w-[483px] px-5 md:px-0 mb-[60px] ">
            A place where you can build and grow a business
          </h2>
          <div className="grid grids-cols-1 md:grid-cols-2 gap-[52px]">
            <div className="max-w-[332px] 2xl:max-w-full mx-auto lg:mx-0">
              <Image
                src={`${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/chart-bar-trend-up.svg`}
                alt="chart-bar-trend-up"
                width={24}
                height={24}
                loading="lazy"
                className="mb-4 mx-auto lg:mx-0 w-[48px] h-[48px] md:w-[24px] md:h-[24px]"
              />
              <p className="text-[#4A4A4A] text-xl font-medium leading-[150%]">
                We take the friction out of the tasks that allow you to scale a
                business
              </p>
            </div>
            <div className="max-w-[326px] 2xl:max-w-full mx-auto lg:mx-0">
              <Image
                src={`${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/briefcase.svg`}
                alt="briefcase"
                width={24}
                height={24}
                loading="lazy"
                className="mb-4 mx-auto lg:mx-0 w-[48px] h-[48px] md:w-[24px] md:h-[24px]"
              />
              <p className="text-[#4A4A4A] text-xl font-medium leading-[150%]">
                Everyone is here to do business!
              </p>
            </div>
            <div className=" max-w-[352px] 2xl:max-w-full mx-auto lg:mx-0">
              <Image
                src={`${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/nodes.svg`}
                alt="nodes"
                width={24}
                height={24}
                 loading="lazy"
                className="mb-4 mx-auto lg:mx-0 w-[48px] h-[48px] md:w-[24px] md:h-[24px]"
              />
              <p className="text-[#4A4A4A] text-xl font-medium leading-[150%]">
                Orisuun&apos;s a global network of highly-motivated individuals,
                with a common goal of growing the global Black economy
              </p>
            </div>
            <div className="max-w-[326px] max-h-[90px] mx-auto lg:mx-0">
              <Image
                src={`${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/zoom.svg`}
                alt="zoom"
                width={24}
                height={24}
                loading="lazy"
                className="mb-4 mx-auto lg:mx-0 w-[48px] h-[48px] md:w-[24px] md:h-[24px]"
              />
              <p className="text-[#4A4A4A] text-xl font-medium leading-[150%]">
                Everything you need is just a search away
              </p>
            </div>
          </div>
        </div>
        <div className="">
          <Image
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/grow-image.svg`}
            alt="Grow Image"
            width={541}
            height={460}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default Grow;
