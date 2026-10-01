'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import { contentData } from '../../../../data/marketing/founder';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const WhyOrisuun = () => {
  const [mainVideo, setMainVideo] = useState(
    'https://fast.wistia.net/embed/iframe/SxKXvNxFGgY?autoplay=1'
  );
  const [title, setTitle] = useState('What, who, how and why of Orisuun');
  const [selectedContent, setSelectedContent] = useState(contentData[0]);

  const handleVideoChange = (content) => {
    const autoplayLink = content.link.includes('?')
      ? `${content.link}&autoplay=1`
      : `${content.link}?autoplay=1`;

    setSelectedContent({
      ...content,
      link: autoplayLink,
    });

    setTimeout(() => {
      const mainPlayer = document.getElementById('mainPlayer');
      if (mainPlayer) {
        mainPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <section className="sm:!p-20 bg-white">
      <div className="max-w-full">
        <div className="grid grid-cols-1 xs:p-4 sm:p-0 lg:grid-cols-2 gap-10">
          <div className="aspect-video col-span-2 rounded-xl overflow-hidden">
            <iframe
              id="mainPlayer"
              className="w-full h-full"
              src={selectedContent.link}
              title="Wistia video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 col-span-2 xs:gap-4 sm:!gap-3">
            {selectedContent.id !== 'intro' && (
              <>
                <h2 className="xs:text-2xl sm:!text-[40px] font-semibold md:col-span-1 md:max-w-md leading-110 text-blue-strong">
                  {selectedContent.title}
                </h2>
                <p className="sm:!text-xl leading-150 text-gray-600 md:col-span-1">
                  {selectedContent.description}
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 col-span-2 xs:gap-4 sm:!gap-3 xs:pt-12 sm:!pt-30">
            <h2 className="xs:text-2xl sm:!text-[40px] font-semibold md:col-span-1 md:max-w-md leading-110 text-blue-strong">
              Select a video below
            </h2>
            <p className="sm:!text-xl leading-150 text-gray-600 md:col-span-1">
              Learn more about Bek’s Vision for Orisuun
            </p>
          </div>
        </div>


        <div className="grid xs:grid-cols-1 lg:!grid-cols-2 gap-y-8 xs:pt-12 sm:!pt-30">
          <div className="col-span-1 xs:space-y-8 xs:p-4 sm:p-0 sm:!space-y-10 md:pt-4">
            {contentData
              ?.filter((content) => content.id !== selectedContent.id)
              ?.map((content, index) => (
                <>
                  {
                    content.title !== "Bek sit down 1080" && <div
                      key={index}
                      className="flex xs:gap-5 sm:!gap-8 flex-col-reverse sm:!flex-row max-w-xl cursor-pointer"
                      onClick={() => handleVideoChange(content)}
                    >
                      <div className=" sm:!max-w-[251px] space-y-4">
                        <h3 className="text-lg font-semibold text-blue-strong leading-[130%] tracking-wide">
                          {content.title}
                        </h3>
                        <p className="text-sm text-blue-300">
                          {content.description}
                        </p>
                      </div>
                      <div className="aspect-video max-w-full flex-1 rounded-xl overflow-hidden sm:!min-w-[296px]">
                        <iframe
                          className="w-full h-full rounded-md pointer-events-none"
                          src={content.link}
                          title="Thumbnail"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  }
                </>

              ))}
          </div>
          <div className="col-span-1 relative">
            <Image
              alt="Letter from Ceo"
              src={`${staticUrl}/founder/images/Letter.png`}
              width={621}
              height={755}
              className="-mt-1 hidden sm:block"
            />
            <Image
              alt="Letter from Ceo"
              src={`${staticUrl}/founder/images/Letter-smaller.png`}
              width={621}
              height={755}
              className="-ml-[3px] sm:hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyOrisuun;
