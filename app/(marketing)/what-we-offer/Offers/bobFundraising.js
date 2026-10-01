import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const PortalIcon = staticUrl + "/home/images/swiper/fund-raising.svg";
const Blurs = staticUrl + "/what we offer/platformBlur.svg";

export const BobFundraising = () => {
  return (
    <section className="flex flex-col w-full">
      <div className="w-full flex justify-center mb-[116px] small-500:mb-[40px]">
        <h2 className="text-blue-strong md:text-[40px] font-semibold leading-110 text-center text-[24px] ">
          Platform Functionality
        </h2>
      </div>
      <div className="w-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
        <div className="relative">
          <div className="relative z-10 md:w-full small-500:h-full">
            <Image alt="platform" src={PortalIcon} width={733} height={500}/>
          </div>
          <div className="absolute z-0 lg:w-[607.8px] lg:h-[373px] xl:top-[-20px] xl:left-[60px] lg:top-[-100px] lg:left-[0px] top-[-40px] left-[60px] small-500:top-[-20px] small-500:left-[0px] blur-xl md:w-full small-500:w-[300px] small-500:h-[350px]">
            <Image src={Blurs} alt="blurimage" width={733} height={500}/>
          </div>
        </div>
        <div className="w-full flex flex-col gap-6 items-start lg:w-[480px] small-500:pt-0 small-500:mb-10 ">
          <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
            Fundraising For Black-Owned Businesses
          </h2>
          <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
            For Black-Owned Businesses
            <br />
            Looking for funding options that actually gets results? Our platform
            puts your campaign in front of an audience that’s passionate about
            supporting Black-owned businesses. It’s exposure that helps you
            connect with people who are ready to back your vision.
          </p>
          <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
            Even better, we offer a sponsorship matching option, so your
            supporters’ contributions can be matched, giving you more capital
            and more opportunities to scale. No more waiting for approval or
            dealing with red tape – just the funding you need to grow.
          </p>
          <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
            Key and Exclusive Benefits of fundraising with Orisuun:
            <br />{' '}
            <ol className="list-decimal list-inside">
              <li>
                Sponsorship Matching – With our sponsorship matching option,
                every dollar raised can be doubled, tripled, or more –
                maximizing your funding potential.{' '}
              </li>
              <li>
                Reward System – Offer rewards to your backers to keep them
                engaged and incentivize higher contributions.
              </li>{' '}
              <li>
                Campaigns are accessible to the public – In addition to
                Orisuun’s membership, your campaign is made available to the
                public, giving you access to a wider audience and more
                opportunities to get funded.
              </li>{' '}
              <li>
                No Target Requirement – Unlike other platforms, you don’t need
                to hit your target to get the funds. If you raise even a small
                amount, it’s yours to keep.
              </li>
              <li>
                {' '}
                Lowest Fees – We keep our costs the lowest (just 1%) of any
                crowdfunding platform anywhere.
              </li>
            </ol>
          </p>
          <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
            Launch your campaign today and get the support you need to take your
            business to the next level.
          </p>
          <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
            For Sponsors
            <br />
            Supporting Black-owned businesses is more than just a good cause –
            it’s a smart investment in the future. By partnering with our
            crowdfunding platform and matching donations, you can double or
            triple the impact of every contribution and help elevate businesses
            that need your support. Our matching donation program is designed to
            make your support go further. Your contributions not only provide
            crucial funding for entrepreneurs but also inspire others to get
            involved. Whether you’re a corporation, individual, or organization,
            your matched donation creates a ripple effect that can empower a
            business for years to come. Join us today – and make a measurable
            difference in the growth and success of Black-owned businesses.
          </p>
          <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
            Our matching donation program is designed to make your support go
            further. Your contributions not only provide crucial funding for
            entrepreneurs but also inspire others to get involved. Whether
            you’re a corporation, individual, or organization, your matched
            donation creates a ripple effect that can empower a business for
            years to come.
            <br />
            <br />
            Join us today – and make a measurable difference in the growth and
            success of Black-owned businesses.
          </p>
        </div>
      </div>
    </section>
  );
};
