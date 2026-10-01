import Image from 'next/image';

export const Field = () => {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px] px-4 md:px-12 bg-[#F8F8F8] md:bg-[image:var(--spike9)] bg-no-repeat bg-left-bottom md:py-16 py-10 "
      style={{
        '--spike9': `url(${staticUrl}/about/images/spike9.svg)`,
      }}
    >
      <h4 className="text-blue-strong text-[24px] md:text-[40px] leading-[29px] md:leading-[44px] font-semibold md:max-w-[376px] max-w-[276px]">
        We&apos;re professionals <br /> in this field
      </h4>
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-[32px]">
        <div className="border border-gray-300-custom bg-white p-[26px] rounded-[12px] space-y-[23px]">
          <Image
            src={`${staticUrl}/about/icons/ownership.svg`}
            alt="ownership"
            width={32}
            height={32}
          />
          <p className="text-[#3B4761] md:text-[20px] md:leading-[30px] text-base font-medium">
            Orisuun&apos;s ownership and contributors have worked on some of the
            most high-profile cases in the global business world.
          </p>
        </div>
        <div className="border border-gray-300-custom bg-white p-[26px] rounded-[12px] space-y-[23px]">
          <Image src={`${staticUrl}/about/icons/job.svg`} alt="job" width={32} height={32} />
          <p className="text-[#3B4761] md:text-[20px] md:leading-[30px] text-base font-medium">
            We have run businesses, we have launched products, and we have
            raised capital.
          </p>
        </div>
        <div className="border border-gray-300-custom bg-white p-[26px] rounded-[12px] space-y-[23px]">
          <Image
            src={`${staticUrl}/about/icons/world.svg`}
            alt="world"
            width={32}
            height={32}
          />
          <p className="text-[#3B4761] md:text-[20px] md:leading-[30px] text-base font-medium">
            Our team has extensive experience living and working in Europe,
            Asia, Africa, North America, and South America.
          </p>
        </div>
        <div className="border border-gray-300-custom bg-white p-[26px] rounded-[12px] space-y-[23px]">
          <Image
            src={`${staticUrl}/about/icons/team.svg`}
            alt="team"
            width={32}
            height={32}
          />
          <p className="text-[#3B4761] md:text-[20px] md:leading-[30px] text-base font-medium">
            We are part of the same community as you, sharing your experiences
            and dedication to Black-owned businesses.
          </p>
        </div>
      </div>
    </section>
  );
};
