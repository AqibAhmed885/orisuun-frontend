import React from 'react';
import Image from 'next/image';
import { LinkedBlackIcon } from '@/icons/socials/linkedin-square-black';
import Bluesky from '@/icons/socials/bluesky';
import ThreadSquare from '@/icons/socials/thread-square';
import MiniLogoLight from '@/icons/mini-logo-light';
import BlueSkyBlackSquare from '@/icons/socials/bluesky-square-black';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const ArticleAuthor = ({ blog }) => {

  // parse and normalize social links
  let socialLinks: Record<string, string> = {};
  try {
    const raw = blog?.SocialLinks || '{}';
    socialLinks = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    console.warn('Invalid SocialLinks JSON', e);
    socialLinks = {};
  }

  const renderSocialIcon = (platform: string) => {
    const key = platform.toLowerCase();
    if (key.includes('linkedin')) return <LinkedBlackIcon />;
    if (key.includes('bluesky')) return <Bluesky />;
    if (key.includes('thread') || key.includes('threads')) return <ThreadSquare />;
    if (key.includes('youtube')) {
      return (
        // simple inline SVG icon for youtube (fallback)
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.7-.9-1.5-.9-1.9-1-2.6-.2-6.5-.2-6.5-.2h-.1s-3.8 0-6.5.2c-.4 0-1.2.1-1.9 1C1.7 4.6 1.5 6.2 1.5 6.2S1 8.3 1 10.4v1.1c0 2.1.5 4.2.5 4.2s.2 1.6.8 2.3c.7.9 1.6.9 2 1 1.5.1 6.4.2 6.4.2s3.8 0 6.5-.2c.4 0 1.2-.1 1.9-1 .6-.7.8-2.3.8-2.3s.5-2.1.5-4.2v-1.1c0-2.1-.5-4.2-.5-4.2zM9.8 15.6v-7l6.2 3.5-6.2 3.5z" />
        </svg>
      );
    }
    // fallback generic icon
    return <MiniLogoLight />;
  };

  const socialEntries = Object.entries(socialLinks).filter(([, url]) => typeof url === 'string' && url.trim() !== '');

  return (
    <div className="bg-gray-100-custom mobile:p-4 p-10 rounded-xl xl:mx-56  mx-5 relative mobile:space-y-5 space-y-10 tracking-wide">
      <div className="flex justify-between items-center">
        <span className="flex mobile:flex-wrap mobile:justify-between mobile:items-start mobile:gap-4 gap-10 lg:items-center">
          <Image
            src={blog?.AuthorPicture || `${staticUrl}/blog/writer.png`}
            alt="writer"
            width={1000}
            height={1000}
            className="rounded-full object-cover aspect-square w-[60px] h-[60px] mobile:w-[20px] mobile:h-[20px]"
          />

          {/* dynamic social icons (mobile block) */}
          <div className="mobile:flex sm:!hidden items-center gap-2">
            {socialEntries.map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex">
                {renderSocialIcon(platform)}
              </a>
            ))}
          </div>

          <div className="flex flex-col mobile:gap-1 gap-2">
            <span className="mobile:text-lg text-2xl !leading-150 font-semibold text-blue-strong ">
              {blog?.AuthorName}
            </span>
            <span className="text-sm text-[#6E6E6E] font-medium leading-[130%]">
              {blog?.AuthorTitle}
            </span>
          </div>
        </span>

        {/* right-side social icons (desktop) */}
        <div className="hidden sm:!flex items-center gap-2">
          <MiniLogoLight />
          {socialEntries.map(([platform, url]) => (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex">
              {renderSocialIcon(platform)}
            </a>
          ))}
        </div>
      </div>

      <div className="">
        <p className="text-blue-300 font-medium lg:text-xl !leading-150 flex flex-col gap-7">
          {blog?.AuthorBio}
        </p>
      </div>
      <Image
        src={`${staticUrl}/about/icons/bottom-circle.svg`}
        alt="bottom ring"
        width={135}
        height={110}
        className="absolute right-0 bottom-0 mobile:hidden"
      />
    </div>
  );
};

export default ArticleAuthor;
