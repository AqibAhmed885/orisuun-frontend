'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { audioFiles } from '../../../../../data/marketing/audioFiles';
import QuarterRing from '../../../../../public/about/images/star-half.png';
import QuarterStar from '../../../../../public/about/images/ring-half.png';
import RingX2 from '../../../../../public/about/images/ring-x2.png';
const icons = [
  {
    id: 1,
    ring: QuarterRing,
  },
  {
    id: 2,
    star: QuarterStar,
  },
];

export const AboutHero = () => {
  const audioRef = useRef(null);

  const playRandomAudio = () => {
    if (audioRef.current) {
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      audioRef.current.src = audioFiles[randomIndex];
      audioRef.current.play();
    }
  };
  return (
    <section className="pt-[44px] md:pt-[100px] md:pb-[80px] px-4 md:px-20 ">
      <div className="max-w-[467px] mx-auto ">
        <h1 className="text-[36px] leading-[43.2px] mx-auto md:text-[64px] md:text-center md:max-w-[426px] md:mx-auto md:leading-[70.64px] text-blue-strong font-semibold text-wrap-balance w-fit">
          We are mission-driven
        </h1>
        <p className="text-blu-ray-300 md:text-[20px] md:leading-[30px] text-base font-medium text-center pt-6 md:pt-[40px]">
          We take our mission seriously! Our platform is designed to maximize
          access to capital and scaling resources.
        </p>
        <p className="text-blu-ray-300 md:text-[20px] md:leading-[30px] text-base font-medium text-center pt-[20px]">
          It&apos;s designed to get Black-owned businesses in front of a large
          number of investors, supporters, and patrons.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-[80px]">
        <div className="relative bg-[#68A9DC] lg:h-[360px] rounded-xl z-50">
          {icons.map((icon, i) => (
            <div key={i}>
              {i === 0 ? (
                <>
                  <div className="absolute bottom-[25px] md:w-[300px] md:h-[250px] w-[200px] h-[150px] md:rotate-0 -rotate-90 -left-6 md:top-0 md:bottom-0 md:left-0">
                    <Image
                      alt="ring"
                      src={icon.ring}
                      className={`w-full h-full rounded-xl`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute md:bottom-0 md:block md:w-[200px] md:h-[150px] hidden">
                    <Image
                      alt="star"
                      src={icon.star}
                      className="w-full h-full"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
          <div className="h-full w-full md:px-[112px] md:py-20 flex flex-col gap-8 items-center justify-center md:justify-start text-center whitespace-nowrap">
            <p className="text-white text-base xl:text-[24px] leading-[18px] md:leading-[36px] font-semibold mt-5 lg:mt-0 z-[3]">
              Make sure you&apos;re saying it right
            </p>
            <div className="flex flex-col items-center gap-5 xl:gap-6 mx-[44px] mb-5 lg:mx-0 lg:mb-0">
              <button
                className="w-[40px] h-[40px] xl:w-[52px] xl:h-[52px] cursor-pointer flex justify-center items-center"
                onClick={playRandomAudio}
                aria-label="Play pronunciation audio"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_STATIC_URL}/about/icons/speaker.svg`}
                  alt="speaker"
                  width={52}
                  height={52}
                />
              </button>
              <p className="text-white text-[20px] xl:text-[40px] leading-[20px] xl:leading-[44px] font-semibold z-[3]">
                Orisuun [oh-r•eye-sun]
              </p>
              <audio ref={audioRef} src="/audio/voice1.mp3" />
            </div>
          </div>
        </div>
        <div className="relative bg-[#68A9DC] lg:h-[360px] rounded-xl z-50">
          {
            <div className="absolute bottom-0 right-0 w-[150px] h-[105px]">
              <Image
                alt="star"
                src={RingX2}
                className={`w-full h-full rounded-xl`}
              />
            </div>
          }
          <div className="flex flex-col py-5 px-4 gap-[20px] md:gap-6 justify-center text-start xl:py-20 xl:px-[84px] md:py-10 md:px-10">
            <p className="text-white text-[20px] leading-150 font-semibold">
              What&apos;s an Orisuun
            </p>
            <div className="flex flex-col gap-5">
              <p className="text-white text-base lg:text-[20px] leading-[24px] md:leading-[30px] font-medium z-[3]">
                Orisuun is about the spark that comes from meaningful
                connections, where your light and another&apos;s create a
                bigger, brighter spark that attracts more sparks.
              </p>
              <p className="text-white text-[16px] md:text-[20px] leading-150 font-medium z-[3]">
                Take your spark and shine your light on the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
