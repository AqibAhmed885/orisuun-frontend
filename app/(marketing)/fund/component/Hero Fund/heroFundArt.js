import Image from 'next/image';
import HeroArtSvg from './HeroArtSvg';
import { SearchBox } from './Hero Search/searchBox';


const HeroArt = `${process.env.NEXT_PUBLIC_STATIC_URL}/fund/orisuun star.jpeg`;

export const HeroFundArt = () => {
  return (
    <div className="relative lg:h-[714px] w-full md:h-[514px]">
      <div className="md:h-full  h-[400px] small-500:mb-[150px] relative">
        <Image
          src={HeroArt}
          alt="hero-art"
          fill
          style={{ objectFit: 'contain' }}
          className="z-[2] w-full h-full"
          priority={true}
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 714px"
        />
      </div>

      <div className="w-[200px] z-[3] absolute 2k:top-[140px] 2k:left-[178px] 3xl:left-[120px] 3xl:top-[160px] xl:left-[80px] top-[120px] lg:left-0 md:left-[45px] small-500:hidden">
        <div className="relative">
          <HeroArtSvg />
        </div>
      </div>
      {/* <div
        className="bg-white w-fit z-[3] absolute flex flex-col items-center 2k:right-[180px] md:w-[233px] 3xl:right-[100px] xl:right-[80px] lg:right-[0px] lg:-bottom-2 md:right-[100px] md:-bottom-[20px] -bottom-[150px] right-0"
        style={{
          borderRadius: '9.168px',
          border: '1px solid #2357C6',
          boxShadow:
            '0px 1.809px 3.618px -0.905px rgba(16, 24, 40, 0.10), 0px 0.905px 1.809px -0.905px rgba(16, 24, 40, 0.06)',
        }}
      >
        <div className="md:w-[159px] small-500:w-[200px] mt-[18px] mb-[16.95px]">
          <h2 className=" text-blue-strong text-[14px] small-500:text-[20px] font-semibold leading-[20px] text-center">
            Contributors who are making it possible
          </h2>
        </div>

        <div className="w-full h-full">
          <SearchBox />
        </div>
      </div> */}
    </div>
  );
};
