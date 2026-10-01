'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Youtube from '@/icons/socials/youtube';
import X from '@/icons/socials/x';
import Facebook from '@/icons/socials/facebook';
import Instagram from '@/icons/socials/instagram';
import Linkedin from '@/icons/socials/linkedin';
import { PlayButton } from '@/public/icons/audio-icons';
import GalleryImage from '@/public/fundraising/image2.png';
import Images from '@/public/fundraising/image.png';
import Calendar from '@/icons/cofounder/calendar';
import PlayControl from '@/public/icons/PlayControls';
import Location from '@/icons/location';
import Globe from '@/icons/globe';
import EquipmentIcon from '@/public/icons/fundraising/equipment-icon';
import LocationPin from '@/icons/location-pin';
import { useCampaignDetails } from './context/campaign-context';
import moment from 'moment';
import BlueSky from '@/icons/socials/bluesky';

export default function GallerySlideshow() {
  const { campaignInfo, userInfo } = useCampaignDetails();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="w-full pt-7 flex flex-col space-y-6 lg:!space-y-0 lg:!gap-2.5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5">
        <div className="flex gap-4 justify-between xs:w-full lg:!w-max">
          <div className="flex items-center gap-2">
            <Calendar className="text-nav-blue" />
            <span className="text-xs lg:!text-sm font-medium text-black-500-custom">
              Start Date:{' '}
              {moment(campaignInfo.CreatedDate).format('DD MMM, YYYY')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-nav-blue" />
            <span className="text-xs lg:!text-sm font-medium text-black-500-custom">
              End Date: {moment(campaignInfo.Duration).format('DD MMM, YYYY')}
            </span>
          </div>
        </div>
        <div className="hidden lg:!flex gap-[14px]">
          {campaignInfo.YoutubeLink && (
            <a
              href={campaignInfo.YoutubeLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="w-6 h-6 cursor-pointer hover:text-blue-600 transition-colors" />
            </a>
          )}
          {campaignInfo.FacebookLink && (
            <a
              href={campaignInfo.FacebookLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-6 h-6 cursor-pointer hover:text-blue-600 transition-colors" />
            </a>
          )}
          {campaignInfo.InstagramLink && (
            <a
              href={campaignInfo.InstagramLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-6 h-6 cursor-pointer hover:text-blue-600 transition-colors" />
            </a>
          )}
          {campaignInfo.LinkedInLInk && (
            <a
              href={campaignInfo.LinkedInLInk}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-6 h-6 cursor-pointer hover:text-blue-600 transition-colors" />
            </a>
          )}
          {campaignInfo.BlueSkyLink && (
            <a
              href={campaignInfo.BlueSkyLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BlueSky className="w-6 h-6 cursor-pointer hover:text-blue-600 transition-colors" />
            </a>
          )}
        </div>
      </div>

      <div className="flex xs:flex-col-reverse lg:!flex-row gap-4 xs:!mt-4 lg:!mt-0">
        <div className="flex lg:flex-col gap-3 lg:!gap-2 max-h-full mobile:max-w-[calc(100vw-32px)] sm:max-h-[310px] 3xl:max-h-[400px] overflow-auto">
          {campaignInfo?.Pictures?.map((image, index) => (
            <div
              key={index}
              className={`relative mobile:min-w-[60px] min-h-[60px] lg:!min-w-14 lg:!min-h-14 cursor-pointer transition-opacity ${
                currentIndex === index ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover rounded"
              />
            </div>
          ))}
          {campaignInfo.Video ? (
            <div
              className={`relative mobile:min-w-[60px] min-h-[60px] max-w-[60px] lg:!min-w-14 lg:!min-h-14 cursor-pointer transition-opacity ${
                currentIndex === campaignInfo.Pictures.length
                  ? 'opacity-100'
                  : 'opacity-50'
              }`}
              onClick={() => setCurrentIndex(campaignInfo.Pictures.length)}
            >
              <video
                src={campaignInfo.Video}
                className="object-cover rounded aspect-square"
              />
            </div>
          ) : null}
        </div>

        <div className="relative flex-1">
          {currentIndex < campaignInfo.Pictures.length ? (
            <>
              <Image
                src={campaignInfo.Pictures[currentIndex]}
                alt="Main gallery image"
                height={600}
                width={643}
                className="object-cover max-h-[310px] xs:h-[310px] lg:!h-full 3xl:max-h-[400px]  w-full rounded"
              />
            </>
          ) : (
            <>
              <video
                src={campaignInfo.Video}
                height={600}
                width={643}
                autoPlay
                controls
                className="object-cover max-h-[310px] xs:h-[310px] lg:!h-full 3xl:max-h-[400px]  w-full rounded"
              />
              {/* <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="absolute bottom-2 right-2 m-auto w-16 h-16 rounded-full transition-all duration-300 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-10"
              >
                <PlayControl />
              </button> */}
            </>
          )}
        </div>
      </div>

      <div className="flex lg:!hidden gap-[14px]">
        {campaignInfo.YoutubeLink && (
          <a
            href={campaignInfo.YoutubeLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube className="w-10 h-10 cursor-pointer hover:text-blue-600 transition-colors" />
          </a>
        )}
        {campaignInfo.FacebookLink && (
          <a
            href={campaignInfo.FacebookLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className="w-10 h-10 cursor-pointer hover:text-blue-600 transition-colors" />
          </a>
        )}
        {campaignInfo.InstagramLink && (
          <a
            href={campaignInfo.InstagramLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="w-10 h-10 cursor-pointer hover:text-blue-600 transition-colors" />
          </a>
        )}
        {campaignInfo.LinkedInLInk && (
          <a
            href={campaignInfo.LinkedInLInk}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-10 h-10 cursor-pointer hover:text-blue-600 transition-colors" />
          </a>
        )}
        {campaignInfo.BlueSkyLink && (
          <a
            href={campaignInfo.BlueSkyLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <X className="w-10 h-10 cursor-pointer hover:text-blue-600 transition-colors" />
          </a>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <LocationPin className="w-5 h-5 text-nav-blue" />
          <span>{userInfo.location || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {userInfo.website ? (
            <a
              href={userInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointe"
            >
              <span>{userInfo.website}</span>
            </a>
          ) : (
            'Unknown'
          )}
        </div>
        <div className="flex items-center gap-2">
          <EquipmentIcon className="w-5 h-5" />
          <span>Fundraising for {campaignInfo.Purpose}</span>
        </div>
      </div>
    </div>
  );
}
