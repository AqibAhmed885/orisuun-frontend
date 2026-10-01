'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import OnlineGreenIcon from '@/icons/chats/OnlineGreenIcon';
import UserVerified from '@/public/chat/user-verified.svg';
import LocationPin from '@/public/chat/location-pin.svg';
import { IAssets } from '../../../../../../data/dashboard/chats';
import moment from 'moment';
import PdfIcon from '@/icons/chats/pdf-icon';
import VideoIcon from '@/icons/chats/video-icon';
import DocIcon from '@/icons/chats/doc';
import MiscellaneousIcon from '@/public/chat/files-icon';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { useRouter } from 'next/navigation';
import { checkOnlineStatus, processTimeZoneInfo } from '@/utils/helper';
import { formatFileName, formatFileSize, renderLocation } from '@/utils/utils';
import AdobeIcon from '@/icons/chats/adobe-icon';
import CsvIcon from '@/icons/chats/csv-icon';
import EmailIcon from '@/icons/chats/email-icon';
import ExcelIcon from '@/icons/chats/excel-icon';
import FigmaIcon from '@/icons/chats/figma';
import GifIcon from '@/icons/chats/gif-icon';
import HeicIcon from '@/icons/chats/heic-icon';
import HtmlIcon from '@/icons/chats/html-icon';
import IcsIcon from '@/icons/chats/ics-icon';
import PowerPointIcon from '@/icons/chats/powerpoint';
import ClockIcon from '@/public/chat/time-clock.svg';
import ZipIcon from '@/icons/chats/zip-icon';
import { isEmpty } from 'lodash';
import OfflineIcon from '@/icons/chats/OfflineIcon';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import MP3Icon from '@/icons/chats/MP3Icon';
import MP4Icon from '@/icons/chats/MP4Icon';
import Favicon from './Favicon';
interface ChatProfileProps {
  loader: boolean;
  isMobile: boolean;
  selectedChat: any;
  setIsChatSelected: (value: boolean) => void;
  handleChatProfileOpenForMobile: () => void;
  assets: IAssets;
}

const renderFileIcon = (fileName: string | null | undefined) => {
  if (!fileName) {
    return <MiscellaneousIcon />;
  }

  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  switch (fileExtension) {
    case 'pdf':
      return <PdfIcon />;
    case 'mp3':
      return <MP3Icon className="w-7 h-7" />;
    case 'mp4':
      return <MP4Icon className='w-7 h-7' />
    case 'webm':
      return <VideoIcon className="w-7 h-7" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return <GifIcon />;
    case 'docx':
    case 'docm':
    case 'dotx':
    case 'txt':
      return <DocIcon />;
    case 'xls':
    case 'xlsx':
      return <ExcelIcon />;
    case 'csv':
      return <CsvIcon />;
    case 'ppt':
    case 'pptx':
      return <PowerPointIcon />;
    case 'ai':
    case 'psd':
    case 'indd':
      return <AdobeIcon />;
    case 'zip':
    case 'rar':
      return <ZipIcon />;
    case 'ics':
      return <IcsIcon />;
    case 'heic':
      return <HeicIcon />;
    case 'html':
    case 'htm':
      return <HtmlIcon />;
    case 'fig':
    case 'figma':
      return <FigmaIcon />;
    case 'eml':
      return <EmailIcon />;
    default:
      return <MiscellaneousIcon />;
  }
};

const ChatProfile: React.FC<ChatProfileProps> = ({
  isMobile,
  selectedChat,
  setIsChatSelected,
  loader,
  handleChatProfileOpenForMobile,
  assets,
}) => {
  const [viewAllImages, setViewAllImages] = useState(false);
  const [viewAllLinks, setViewAllLinks] = useState(false);
  const [viewAllFiles, setViewAllFiles] = useState(false);
  const [timeZoneInfo, setTimeZoneInfo] = useState('');

  const router = useRouter();

  useEffect(() => {
    const userTimezone = selectedChat?.TimeZone;
    if (isEmpty(userTimezone)) {
      setTimeZoneInfo('');
      return;
    }
    try {
      const timeZoneInfo = processTimeZoneInfo(userTimezone);
      setTimeZoneInfo(timeZoneInfo);
    } catch (error) {
      console.error('Error processing timezone:', error);
      setTimeZoneInfo('');
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleBackButton = () => {
      handleChatProfileOpenForMobile();
    };
    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const handleDownload = (url, filename) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        console.error('Error while downloading the file:', err);
      });
  };

  // if (loader) {
  //   return <ChatProfileShimmer />;
  // }

  return (
    <div
      className={`relative w-full rounded-md p-4 shadow-lg md:w-80 lg:min-w-80 bg-white flex-col ${isMobile && !selectedChat ? 'hidden' : selectedChat ? 'flex' : 'hidden'
        }`}
    >
      <div className="block md:hidden absolute">
      </div>
      <div
        className="flex flex-col gap-2.5 p-4 items-center justify-between border-b"
        onClick={() =>
          (selectedChat?.ReceiverProfileId || selectedChat?.UserProfileId) &&
          router.push(
            `/profile/${add2040ToProfileDetailsId(
              selectedChat?.ReceiverProfileId || selectedChat?.UserProfileId
            )}`
          )
        }
      >
        <div className="relative min-w-[50px]">
          <Image
            src={
              selectedChat?.ReceiverProfileImage ||
              selectedChat?.ProfilePicture || BASE_URL
            }
            alt="Profile"
            className="w-[50px] h-[50px] 3xl:min-w-10 3xl:h-10 rounded-full object-cover"
            width={50}
            height={50}
          />
          {checkOnlineStatus(selectedChat?.LastActive) === 'online' ? (
            <OnlineGreenIcon className=" absolute bottom-0 right-0 w-10 h-10" />
          ) : (
            <OfflineIcon className=" absolute bottom-0 right-0 w-10 h-10" />
          )}
        </div>
        <div className="flex flex-col gap-2 w-full items-center">
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <h3 className="text-sm sm:text-base font-semibold cursor-pointer leading-[130%]">
              {selectedChat?.FullName ?? 'N/A'}
            </h3>
            {selectedChat?.isVerified ? (
              <>
                <Image
                  alt="verified"
                  src={UserVerified.src}
                  width={20}
                  height={20}
                />
              </>
            ) : (
              <></>
            )}
          </div>
          <span className="flex flex-col items-center gap-2">
            <p className="text-sm text-blue-300 flex items-center gap-1">
              <Image
                alt="location"
                src={LocationPin.src}
                width={20}
                height={20}
                className="h-5"
              />
              {renderLocation(
                selectedChat?.CountryOfOrigin as string,
                selectedChat?.City as string
              )}
            </p>
            {timeZoneInfo && (
              <p className="text-sm text-blue-300 flex items-start gap-1">
                <Image
                  alt="time-zone"
                  src={ClockIcon.src}
                  width={18}
                  height={18}
                  className="h-[18px]"
                />
                {timeZoneInfo}
              </p>
            )}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-5 divide-y max-h-full">
        {/* Images Section */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Images</h3>
            <button
              onClick={() => setViewAllImages(!viewAllImages)}
              className="h-auto text-xs text-nav-blue font-semibold"
            >
              {viewAllImages ? 'Show Less' : 'View All'}
            </button>
          </div>
          <div
            className={`flex ${viewAllImages && 'flex-wrap'
              } overflow-y-auto max-w-full ${viewAllImages ? 'max-h-48' : 'max-h-28'
              } ${assets?.Images?.length === 0 && '!grid-cols-1'
              } md:grid md:grid-cols-4 gap-1.5`}
          >
            {assets?.Images?.length ? (
              (viewAllImages
                ? assets?.Images
                : assets?.Images.slice(0, 8)
              )?.map((image, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleDownload(
                      image.Document,
                      image.FileName || 'download.jpg'
                    )
                  }
                  className="focus:outline-none"
                >
                  <Image
                    src={image.Document}
                    alt={image.FileName}
                    className="w-28 h-12 shadow-sm border border-black-50  flex justify-center items-center rounded object-cover"
                    width={40}
                    height={40}
                  />
                </button>
              ))
            ) : (
              <span>Chat images will appear here</span>
            )}
          </div>
        </div>

        {/* Files Section */}
        <div className={`pt-5`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Files</h3>
            <button
              onClick={() => setViewAllFiles(!viewAllFiles)}
              className="h-auto text-xs text-nav-blue font-semibold"
            >
              {viewAllFiles ? 'Show Less' : 'View All'}
            </button>
          </div>
          <div
            className={` ${viewAllFiles ? 'max-h-48' : 'max-h-36'
              } overflow-y-auto`}
          >
            {assets?.Files?.length ? (
              (viewAllFiles ? assets?.Files : assets?.Files.slice(0, 3))?.map(
                (file, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleDownload(file.Document, file.FileName || 'download')
                    }
                    className="focus:outline-none"
                  >
                    <div
                      key={index}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-7 h-7 3xl:h-full 3xl:w-auto rounded bg-muted flex items-center justify-center">
                        <span className="w-7 h-7 3xl:h-full 3xl:w-auto">
                          {renderFileIcon(file.FileName)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-left truncate">
                          {formatFileName(file.FileName)}
                        </p>
                        <p className="text-xs text-blue-300 flex items-center justify-between">
                          <span>{formatFileSize(file.size)} </span>
                          {moment(file.CreatedDate)
                            .format('DD MMM YY')
                            .toString()}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              )
            ) : (
              <span>Chat files will appear here</span>
            )}
          </div>
        </div>

        {/* Links Section */}
        <div className={`pt-5`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Links</h3>
            <button
              onClick={() => setViewAllLinks(!viewAllLinks)}
              className="h-auto text-xs text-nav-blue font-semibold"
            >
              {viewAllLinks ? 'Show Less' : 'View All'}
            </button>
          </div>
          <div
            className={` ${viewAllLinks ? 'max-h-48' : 'max-h-36'
              } overflow-y-auto`}
          >
            {assets?.Links?.length ? (
              (viewAllLinks ? assets?.Links : assets.Links.slice(0, 3))?.map(
                (link, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => window.open(link.Link, '_blank')}
                  >
                    <div className="w-10 h-10 rounded  flex items-center justify-center">
                      <span className="w-6 h-6">
                        <Favicon url={link.Link} className="w-5 h-5" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      {link.Link?.length
                        ? link.Link
                          .replace(/^(https?:\/\/)?(www\.)?/, '')   // remove protocol and www
                          .replace(/([\/?#].*)?$/, '')              // remove everything after first /, ?, or #
                          .replace(/\.[a-z]{2,}$/, '')              // remove .com, .in, .net, etc.
                        : 'No title'}
                      <p className="text-xs text-blue-300 flex items-center justify-between">
                        <span>{link.Platform ? link.Platform : 'Unknown'}</span>
                        {moment(link.CreatedDate)
                          .format('DD MMM YY')
                          .toString()}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <span>Chat links will appear here</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatProfileShimmer = () => (
  <div className="relative w-full rounded-md p-4 shadow-lg md:w-80 lg:min-w-80 bg-white flex-col animate-pulse">
    {/* Profile section */}
    <div className="flex flex-col gap-2.5 p-4 items-center justify-between border-b">
      <div className="relative min-w-[50px]">
        <div className="w-[50px] h-[50px] rounded-full bg-gray-200" />
        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gray-300" />
      </div>
      <div className="flex flex-col gap-2 w-full items-center">
        <div className="flex flex-wrap gap-2 justify-center items-center">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
        </div>
        <span className="flex flex-col items-center gap-2">
          <div className="h-3 w-32 bg-gray-100 rounded" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </span>
      </div>
    </div>
    {/* Images section */}
    <div className="pt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-14 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-1.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-20 h-12 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
    {/* Files section */}
    <div className="pt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-3 w-14 bg-gray-100 rounded" />
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gray-200 rounded" />
            <div className="flex-1">
              <div className="h-3 w-28 bg-gray-100 rounded mb-1" />
              <div className="h-2 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Links section */}
    <div className="pt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-14 bg-gray-200 rounded" />
        <div className="h-3 w-14 bg-gray-100 rounded" />
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded" />
            <div className="flex-1">
              <div className="h-3 w-32 bg-gray-100 rounded mb-1" />
              <div className="h-2 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ChatProfile;
