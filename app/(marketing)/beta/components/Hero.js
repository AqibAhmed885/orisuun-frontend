import Image from 'next/image';
import Link from 'next/link';
const { Button } = require('../../../../components/marketing');

const Hero = () => {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <section className="xl:pl-[80px] max-h-[656px] 2xl:mx-auto 2xl:container ">
      <div className="flex flex-col lg:flex-row lg:justify-between  md:px-0 lg:px-8">
        <div className="mt-[43px] lg:mt-[183px] lg:max-w-[418px] max-w-[287px] md:max-w-[500px]  md:text-center mx-auto ">
          <h2 className="text-blue-strong text-[35.924px] md:text-[48px] font-semibold leading-[120%] md:leading-[110%] w-full text-center md:text-center lg:text-left ">
            We have launched in BETA
          </h2>
          <p className="text-[#5b657b] text-[15.97px] leading-[23.95px] text-center md:text-xl font-medium md:leading-[150%] mt-6 max-w-[476px] lg:max-w-[366px] w-full md:text-center lg:text-left">
            This year, we will be rolling out new features as well as expanding
            upon existing ones on a quarterly basis.
          </p>
          <Link href="/signup">
            <div className="flex justify-center lg:justify-start">
              <Button className="bg-[#2357C6] rounded-[88px] mt-[13.64px] md:mt-10">
                Join Orisuun
              </Button>
            </div>
          </Link>
        </div>
        <div className="w-full  md:max-h-[656px] md:mt-[39.87px] xl:mt-0 relative">
          <div className="h-full  ">
            <Image
              src={`${staticUrl}/beta/images/beta_mainNew.svg`}
              alt="hero-image"
              className="hidden md:block w-full h-full object-contain relative z-10"
              width={764}
              height={656}
            />
            <Image
              src={`${staticUrl}/home/images/blurs.svg`}
              width={1152}
              height={768}
              className="absolute top-1/2 -translate-y-1/2 -left-1/2 translate-x-1/2 object-cover h-full z-0  xl:max-w-full xl:max-h-full  2xl:right-0   "
              loading="eager"
              alt="blur"
              style={{ objectFit: 'cover' }}
            />
            <div className="max-w-full md:hidden">
              <Image
                src={`${staticUrl}/beta/images/home-image-mobile.png`}
                alt="hero-image"
                width={320}
                height={385}
                className="w-full h-full object-contain md:hidden "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
