import Image from 'next/image';
import BlueSky from '../../../../public/socials/BlueSky_blue.svg';
import { useState, useEffect } from 'react';

const TellUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({ left: false, right: false });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = (imageType) => {
    setImagesLoaded(prev => ({ ...prev, [imageType]: true }));
  };

  return (
    <section className="my-[120px] lg:mt-[150px] lg:px-[80px] px-4 mx-auto gap-2 pb-[200px] small-500:py-10">
      <div
        className="bg-[#F2F7FC] relative small-500:px-4 bg-cover bg-center md:min-h-[410px] md:max-h-[410px] rounded-[12px] md:rounded-[20px] sm:py-[80px] py-[72px] overflow-clip px-4 md:px-0"
      >
        <div>
          {!imagesLoaded.left && (
            <div className="absolute top-[-4px] left-[0px] md:left-[1px] md:top-[2px] max-w-[87px] md:max-w-[210px] w-[87px] md:w-[210px] h-[87px] md:h-[210px] bg-gray-300 animate-pulse rounded" />
          )}
          <Image
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/how-svgs/left-clip.svg`}
            alt="bottom"
            width={300}
            height={300}
            className={`absolute top-[-4px] left-[0px] md:left-[1px] md:top-[2px] max-w-[87px] md:max-w-[210px] transition-opacity duration-500 ${
              imagesLoaded.left ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad('left')}
            priority={false}
            loading="lazy"
          />
        </div>
        <div>
          {!imagesLoaded.right && (
            <div className="absolute right-[-1px] bottom-[0px] md:right-[1px] md:bottom-[2px] max-w-[65px] md:max-w-[210px] w-[65px] md:w-[210px] h-[65px] md:h-[210px] bg-gray-300 animate-pulse rounded" />
          )}
          <Image
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/how-svgs/right-clip.svg`}
            alt="top"
            width={300}
            height={300}
            className={`absolute right-[-1px] bottom-[0px] md:right-[1px] md:bottom-[2px] max-w-[65px] md:max-w-[210px] transition-opacity duration-500 ${
              imagesLoaded.right ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad('right')}
            priority={false}
            loading="lazy"
          />
        </div>

        <h2
          className={`text-blue-strong sm:text-[40px] text-[24px] small-500:max-w-[256px] font-semibold md:leading-[110%] leading-[31.2px] text-center mx-auto mb-6 md:mt-0 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Tell the world about Orisuun
        </h2>
        <p
          className={`sm:text-xl text-[16px] font-medium leading-[150%] text-[#5B657B] mx-auto sm:mb-[90px] mb-8 max-w-[453px] text-center transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Word of mouth is the best promotion. Tell everyone you know about
          Orisuun and what we're doing.
        </p>

        <MediaLinks isVisible={isVisible} />
      </div>
    </section>
  );
};

export default TellUs;

export const MediaLinks = ({ isVisible }) => {
  const [loadedIcons, setLoadedIcons] = useState({});
  
  const socialMediaLinks = {
    facebook:
      'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Forisuun.com',
    blueSky:
      'http://bluesky.com',
    linkedin:
      'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Forisuun.com',
    pinterest:
      'https://pinterest.com/pin/create/button/?url=https%3A%2F%2Forisuun.com&media=&description=',
    reddit:
      'https://reddit.com/submit?url=https%3A%2F%2Forisuun.com&title=Check%20out%20Orisuun!',
    tiktok: 'https://www.tiktok.com/realorisuun/',
    youtube: 'https://www.youtube.com/@orisuun',
    instagram: 'https://www.instagram.com/orisuun/',
  };

  const handleSocialClick = (platform) => {
    window.open(socialMediaLinks[platform], '_blank', 'noopener,noreferrer');
  };

  const handleIconLoad = (iconName) => {
    setLoadedIcons(prev => ({ ...prev, [iconName]: true }));
  };

  const socialIcons = [
    { name: 'instagram', src: `${process.env.NEXT_PUBLIC_STATIC_URL}/socials/instagram-social.svg`, alt: 'instagram-social' },
    { name: 'facebook', src: `${process.env.NEXT_PUBLIC_STATIC_URL}/socials/facebook-social.svg`, alt: 'facebook-social' },
    { name: 'blueSky', src: `${process.env.NEXT_PUBLIC_STATIC_URL}//socials/BlueSky_blue.svg`, alt: 'bluesky-social' },
    { name: 'linkedin', src: `${process.env.NEXT_PUBLIC_STATIC_URL}/socials/linkedin-social.svg`, alt: 'linkedin-social' },
    { name: 'pinterest', src: `${process.env.NEXT_PUBLIC_STATIC_URL}/socials/pinterest.svg`, alt: 'pinterest' },
    { name: 'reddit', src: `${process.env.NEXT_PUBLIC_STATIC_URL}/socials/reddit.svg`, alt: 'reddit' },
    { name: 'tiktok', src: `${process.env.NEXT_PUBLIC_STATIC_URL}/socials/tiktok-circle.svg`, alt: 'tiktok-circle' },
    { name: 'youtube', src: `${process.env.NEXT_PUBLIC_STATIC_URL}/socials/youtube-social.svg`, alt: 'youtube-social' },
  ];

  return (
    <div
      className={`flex mx-auto gap-5 flex-wrap md:gap-10 justify-center transition-all duration-1000 delay-400 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {socialIcons.map((icon, index) => (
        <button
          key={icon.name}
          onClick={() => handleSocialClick(icon.name)}
          aria-label={`Share on ${icon.name}`}
          className="transition-all duration-300 hover:scale-110 hover:opacity-80"
        >
          <div className="relative">
            {!loadedIcons[icon.name] && (
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded" />
            )}
            <Image
              src={icon.src}
              alt={icon.alt}
              width={32}
              height={32}
              className={`transition-opacity duration-300 ${
                loadedIcons[icon.name] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleIconLoad(icon.name)}
              priority={index < 3} // Prioritize first 3 icons
              loading={index < 3 ? "eager" : "lazy"}
            />
          </div>
        </button>
      ))}
    </div>
  );
};

