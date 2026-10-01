import Image from 'next/image';
import { Button } from '../../../../components/marketing';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Idea = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mt-[120px] md:mt-[150px] bg-[#f8f8f8] lg:px-[80px] px-4">
      <div
        className={`mx-auto flex gap-2 md:gap-10 xl:gap-40 flex-col sm:flex-row justify-between transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="lg:pt-[100px] pt-[40px]">
          <h2 className="text-blue-strong sm:text-[40px] text-[24px] leading-[28.8px] font-semibold md:leading-[110%] mb-6">
            Do you have an idea for us?
          </h2>
          <p className="text-[#5b657b] text-xl font-medium leading-[150%] w-full sm:max-w-[335px] mb-[60px]">
            Take our two-minute survey and give us some valuable feedback!
          </p>
          <div className="flex gap-6 justify-between md:justify-start w-full">
            <Button className="bg-[#2357C6] font-bold sm:leading-6 w-[60%] text-[16px] md:text-[16px] hover:bg-[#1e4ba8] transition-colors duration-300">
              <Link href="/feedback">Take our survey</Link>
            </Button>
            <Button
              variant="outlined"
              className="text-[#8E95A4] font-medium sm:leading-6 w-[40%] text-[16px] md:text-[16px] p-0 !border-none hover:text-[#6b7280] transition-colors duration-300"
            >
              <a href="mailto:hello@orisuun.com">Send an email</a>
            </Button>
          </div>
        </div>
        <div className="py-12 relative">
          {!imageLoaded && (
            <div className="w-full h-[504px] bg-gray-200 animate-pulse rounded-[12px]" />
          )}
          <Image
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/how-svgs/idea.png`}
            width={624}
            height={504}
            alt="idea-illustration"
            className={`rounded-[12px] transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            priority={true}
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 624px"
          />
        </div>
      </div>
    </section>
  );
};

export default Idea;
