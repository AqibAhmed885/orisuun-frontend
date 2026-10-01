import { OnboardingCard } from './OnboardingCard';

const Onboarding = () => {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <section className="mb-[120px] lg:mb-[200px]">
      <div
        className="xl:bg-[image:var(--onboarding-bg)] xl:relative xl:w-full bg-[#F8F8F8] flex flex-col"
        style={{
          '--onboarding-bg': `url(${staticUrl}/beta/images/onboarding.svg)`,
        }}
      >
        <div className="max-h-[44px] w-full flex justify-center items-center my-10 lg:mt-[100px] lg:mb-[60px]">
          <h2 className="max-w-[288px] lg:max-w-[610px] text-blue-strong text-[24px] lg:text-[40px] font-semibold leading-[28.8px] text-center lg:leading-110">
            Onboarding during our BETA phase
          </h2>
        </div>
        <div className="xl:max-h-[322px] xl:justify-items-center grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-[30px] xl:ml-[80px] xl:mr-[81px] mx-auto px-4">
          <OnboardingCard />
        </div>
        <div className="flex justify-center items-center my-10 lg:mt-[68px] lg:mb-[74px] xl:ml-[80px] xl:mr-[81px] mx-auto px-4">
          <div className="max-w-[182px] max-h-[44px] text-center">
            <a
              href="#join"
              className="inline-block bg-blue-600 w-full h-full text-white px-5 py-[10px] hover:bg-blue-700 rounded-full text-[16px] font-bold leading-150 whitespace-nowrap"
            >
              Join the community
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Onboarding;
