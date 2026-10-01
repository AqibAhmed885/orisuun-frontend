'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import UserVerified from '@/public/chat/user-verified.svg';
import LocationPin from '@/public/chat/location-pin.svg';
import NoConvoIcon from '@/public/chat/NoConvoIcon.svg';
import FileCard from './file-card';
import { Loader } from '@/app/(dashboard)/(users)/(main)/chats/components/loader';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import {
  checkOnlineStatus,
  processTimeZoneInfo,
  showTimeStatus,
} from '@/utils/helper';
import EmojiPicker from '../../../../../../components/ui/emoji-picker';
import { renderLocation } from '@/utils/utils';
import OnlineGreenIcon from '@/icons/chats/OnlineGreenIcon';
import {
  AttachFileIcon,
  PhotoIcon,
  SendMessageIcon,
} from '@/icons/chats/textarea-icons';
import momentTimezone from 'moment-timezone';
import { getCode } from 'country-list';
import Linkify from 'react-linkify';
import ClockIcon from '@/public/chat/time-clock.svg';
import { isEmpty } from 'lodash';
import OfflineIcon from '@/icons/chats/OfflineIcon';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import AssociateDetailsModel from './AssociateDetailsModel';

interface ChatInterfaceProps {
  selectedChat: any;
  isMobile: boolean;
  loader: boolean;
  setIsChatSelected: (value: boolean) => void;
  messages: any[];
  newMessage: string;
  handleMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  file: File | null;
  loaderImage: boolean;
  handleRemoveAttachment: () => void;
  handleAttachmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleChatProfileOpenForMobile: () => void;
  fileUploadingProgress: number;
  handleEmojiSelector: (emojiCode: string) => void;
  scrollToBottom: () => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  selectedChat,
  isMobile,
  loader,
  setIsChatSelected,
  messages,
  newMessage,
  handleMessageChange,
  file,
  loaderImage,
  handleRemoveAttachment,
  handleAttachmentChange,
  handleSendMessage,
  handleKeyPress,
  handleChatProfileOpenForMobile,
  fileUploadingProgress,
  handleEmojiSelector,
  scrollToBottom,
  isLoading,
}) => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [timeZoneInfo, setTimeZoneInfo] = useState('');



  const scrollToBottomSmooth = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };


  useEffect(() => {
    if (selectedChat && messages?.length > 0) {
      scrollToBottomSmooth();
    }
  }, [selectedChat, messages]);
  useEffect(() => {
    const handleBackButton = () => {
      setIsChatSelected(false);
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const [textareaRows, setTextareaRows] = useState(1);
  const [textareaHeight, setTextAreaHeight] = useState(20);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false)
  const [clickedMessage, setClickedMessage] = useState({})
  const maxRows = 3;

  useEffect(() => {
    const parentDiv = document.querySelector(
      '.chatInterface'
    ) as HTMLDivElement;

    if (parentDiv) {
      const newHeight = Math.min(maxRows, textareaRows) * 24 + 22;
      setTextAreaHeight(newHeight);
    }
  }, [textareaRows]);

  const dynamicHeight =
    textareaHeight >= 94
      ? 'max-h-[calc(100vh-110px)] lg:max-h-[calc(100vh-130px)]'
      : textareaHeight >= 110
        ? 'max-h-[calc(100vh-166px)] 2k:max-h-[calc(100vh-245px)]'
        : 'max-h-[calc(100vh-70px)] lg:max-h-[calc(100vh-97px)]';

  function getTimeZonesForCountry(country) {
    if (!country) return;
    const countryCode = getCode('America');
    if (!countryCode) {
      return `No ISO code found for ${country}`;
    }

    const timeZones = momentTimezone.tz.zonesForCountry(countryCode);

    if (!timeZones || timeZones.length === 0) {
      return `No time zone found for ${country}`;
    }
    return timeZones;
  }

  useEffect(() => {
    getTimeZonesForCountry(selectedChat?.CountryOfOrigin);
  }, [selectedChat?.CountryOfOrigin]);

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


  //formate date,time,min,sec,justnow
  const formatMessageDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return "Just now";
    }
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };
  useEffect(() => {
    if (selectedChat) {
    }
  }, [selectedChat]);

  useEffect(() => {
    if (messages?.length) {
    }
  }, [messages]);

  function handleClickMessage(message) {
    if (message != null && message?.AssociateId != null && message?.AssociateId != 0) {
      setClickedMessage(message?.AssociateDetails)
      setIsAssociateModalOpen(true)
    }
  }

  return (
    <div
      className={`relative ${selectedChat ? 'lg:!min-w-[526px] xs:w-full' : 'w-full'
        } md:block flex flex-col ${isMobile && selectedChat ? 'block' : 'hidden'
        }`}
    >
      {isAssociateModalOpen && <AssociateDetailsModel selectedPerson={clickedMessage} setIsAssociateModalOpen={setIsAssociateModalOpen} />}

      {selectedChat ? (
        <div
          className={`flex flex-col lg:gap-6 bg-white lg:!bg-transparent h-full max-h-full min-h-0
        ${loader && 'justify-end'}`}
        >
          <div
            className={`flex flex-col flex-grow overflow-auto relative rounded-md lg:shadow-lg bg-[#FFFFFF] xs:pb-0 lg:pb-4 p-4 ${dynamicHeight} ${file
              ? 'max-h-[calc(100vh-167px)] 3xl:max-h-[calc(100vh-255px)] 4xl:max-h-[calc(100vh-260px)] 2k:max-h-[calc(100vh-168px)]'
              : 'max-h-[calc(100vh-110px)]'
              }`}
          >
            <>
              <div className="border-b pb-5 mb-3 gap-5 flex items-center">
                <div
                  onClick={() => setIsChatSelected(false)}
                  className="block md:hidden"
                >
                </div>
                <div className="relative min-w-[50px]">
                  <Image
                    src={
                      selectedChat?.ReceiverProfileImage ||
                      selectedChat?.ProfilePicture || BASE_URL
                    }
                    alt="Profile"
                    className="min-w-[70px] max-h-[70px] h-full rounded-full object-cover"
                    width={50}
                    height={50}
                  />
                  {checkOnlineStatus(selectedChat?.LastActive) === 'online' ? (
                    <OnlineGreenIcon className=" absolute bottom-0 right-0 w-10 h-10" />
                  ) : (
                    <OfflineIcon className=" absolute bottom-0 right-0 w-10 h-10" />
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex gap-2 items-center mt-3">
                    <h3
                      className="text-sm sm:text-base font-semibold cursor-pointer leading-[130%]"
                      onClick={() => {
                        isMobile
                          ? handleChatProfileOpenForMobile()
                          : (selectedChat?.ReceiverProfileId ||
                            selectedChat?.UserProfileId) &&
                          router.push(
                            `/profile/${add2040ToProfileDetailsId(
                              selectedChat?.ReceiverProfileId ||
                              selectedChat?.UserProfileId
                            )}`
                          );
                      }}
                    >
                      {selectedChat?.FullName?.split(' (')[0] || // This will remove anything in parentheses
                        selectedChat?.FirstName + ' ' + selectedChat?.LastName}
                    </h3>
                    <span className="flex gap-2 items-center text-sm text-green-500 ">
                      {selectedChat?.isVerified ? (
                        <>
                          <Image
                            alt="verified"
                            src={UserVerified.src}
                            width={20}
                            height={20}
                          />
                          Verified
                        </>
                      ) : (
                        <></>
                      )}
                    </span>
                  </div>
                  <span className="items-center gap-x-3 ">
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
                      <p className="text-sm text-blue-300 flex items-start gap-1 pt-2">
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
              <div className={`overflow-y-auto relative h-full scrollbar-custom`}>
                {loader ? (
                  <>
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="animate-pulse p-2.5 flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-2/3" />
                        </div>
                        {/* <div className="flex flex-col items-end gap-2">
                          <div className="h-3 bg-gray-200 rounded w-12" />
                          <div className="h-4 w-4 bg-gray-200 rounded-full" />
                        </div> */}
                      </div>
                    ))}
                  </>
                ) : (
                  messages?.filter(message =>
                    message.Sender_UserId === selectedChat.UserId ||
                    message.Receiver_UserId === selectedChat.UserId
                  ).map((message, index) => (
                    <div key={index} className={`flex items-start mb-4 gap-4`}>
                      <div className="relative min-w-[40px] cursor-pointer" onClick={() => { handleClickMessage(message) }}>
                        {(message.Sender_UserId === selectedChat.UserId && message?.AssociateId != null && message?.AssociateId != 0) ?
                          (<div>
                            <Image
                              src={
                                message?.AssociateDetails?.ProfilePicture || BASE_URL
                              }
                              alt="Profile"
                              className="h-9 w-9  rounded-full object-cover"
                              width={40}
                              height={40}
                            />
                          </div>)
                          : (<Image
                            src={
                              message.SenderProfileImage || BASE_URL
                            }
                            alt="Profile"
                            className="h-9 w-9  rounded-full object-cover"
                            width={40}
                            height={40}
                          />)}
                        {message.Sender_UserId === selectedChat.UserId ? (
                          checkOnlineStatus(selectedChat?.LastActive) === 'online' ? (
                            <OnlineGreenIcon className=" absolute bottom-0 right-0" />
                          ) : (
                            <OfflineIcon className=" absolute bottom-0 right-0" />
                          )
                        ) : (
                          <OnlineGreenIcon className=" absolute bottom-0 right-0" />
                        )}
                      </div>
                      <div
                        className={`flex items-center flex-col !bg-transparent justify-between rounded-lg text-left min-w-[200px] max-w-full`}
                      >
                        <div className="w-full text-start flex flex-col gap-2">
                          {!!message.Message && (
                            <>
                              <div className="flex gap-2.5">
                                <p className="text-sm font-semibold leading-[130%] cursor-pointer" onClick={() => { handleClickMessage(message) }}>
                                  {(message.Sender_UserId === selectedChat.UserId && message?.AssociateId != null && message?.AssociateId != 0) ? message?.AssociateDetails?.Name + " (" + selectedChat.FullName + ")"
                                    : message.Sender_UserId === selectedChat.UserId
                                      ? selectedChat.FullName
                                      : 'You'}
                                </p>
                                <p className="text-xs text-gray-400 chat-time">
                                  {showTimeStatus(message.CreatedDate)}
                                </p>
                              </div>
                              <Linkify
                                componentDecorator={(href, text, key) => (
                                  <a
                                    key={key}
                                    href={href}
                                    className="text-blue-500 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {text}
                                  </a>
                                )}
                              >
                                <p
                                  className={`break-words text-blue-300 font-medium ${/^[\p{Emoji}]+$/u.test(message.Message)
                                    ? 'text-8xl'
                                    : 'text-sm'
                                    }`}
                                >
                                  {message.Message}
                                </p>
                              </Linkify>
                            </>
                          )}
                          {message.ChatDocument &&
                            message.ChatDocument.Document && (
                              <>
                                <FileCard
                                  isSent={true}
                                  fileName={message.ChatDocument.FileName}
                                  fileSize={message.ChatDocument?.size}
                                  fileType={
                                    message.ChatDocument?.FileName
                                      ? message.ChatDocument.FileName.endsWith(
                                        '.pdf'
                                      )
                                        ? 'pdf'
                                        : message.ChatDocument.FileName.match(
                                          /\.(jpg|jpeg|png|gif)$/i
                                        )
                                          ? 'image'
                                          : message.ChatDocument.FileName.endsWith(
                                            '.mp3'
                                          )
                                            ? 'audio'
                                            : message.ChatDocument.FileName.endsWith(
                                              '.mp4'
                                            )
                                              ? 'video'
                                              : message.ChatDocument.FileName.endsWith(
                                                '.doc'
                                              ) ||
                                                message.ChatDocument.FileName.endsWith(
                                                  '.docx'
                                                )
                                                ? 'document'
                                                : message.ChatDocument.FileName.endsWith(
                                                  '.zip'
                                                )
                                                  ? 'zip'
                                                  : message.ChatDocument.FileName.endsWith(
                                                    '.csv'
                                                  )
                                                    ? 'csv'
                                                    : message.ChatDocument.FileName.endsWith(
                                                      '.email'
                                                    )
                                                      ? 'email'
                                                      : message.ChatDocument.FileName.endsWith(
                                                        '.gif'
                                                      )
                                                        ? 'gif'
                                                        : message.ChatDocument.FileName.endsWith(
                                                          '.heic'
                                                        )
                                                          ? 'heic'
                                                          : message.ChatDocument.FileName.endsWith(
                                                            '.xls'
                                                          ) ||
                                                            message.ChatDocument.FileName.endsWith(
                                                              '.xlsx'
                                                            )
                                                            ? 'excel'
                                                            : message.ChatDocument.FileName.endsWith(
                                                              '.ics'
                                                            )
                                                              ? 'ics'
                                                              : message.ChatDocument.FileName.endsWith(
                                                                '.webp'
                                                              )
                                                                ? 'webp'
                                                                : message.ChatDocument.FileName.endsWith(
                                                                  '.ppt'
                                                                ) ||
                                                                  message.ChatDocument.FileName.endsWith(
                                                                    '.pptx'
                                                                  )
                                                                  ? 'powerpoint'
                                                                  : message.ChatDocument.FileName.endsWith(
                                                                    '.fig'
                                                                  )
                                                                    ? 'figma'
                                                                    : message.ChatDocument.FileName.endsWith(
                                                                      '.webm'
                                                                    )
                                                                      ? 'webm'
                                                                      : message.ChatDocument.FileName.endsWith(
                                                                        '.html'
                                                                      )
                                                                        ? 'html'
                                                                        : 'other'
                                      : 'other'
                                  }
                                  fileUrl={message.ChatDocument.Document}
                                />
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          </div>

          <div
            className={`flex flex-col sticky bottom-0 chatInterface bg-[#FFFFFF] rounded-md lg:shadow-xl p-4 border-t gap-3 ${file
              ? 'min-h-[144px]'
              : 'min-h-[calc(72px+var(--textareaHeight,0px))]'
              }`}

            onKeyDown={handleKeyPress}

          >
            {file && (
              <FileCard
                isSent={false}
                isUploading={loaderImage}
                fileName={file.name}
                fileSize={
                  file.size
                    ? `${(file.size / 1024).toFixed(2)} KB`
                    : 'Unknown size'
                }
                fileType={
                  file?.name
                    ? file.name.endsWith('.pdf')
                      ? 'pdf'
                      : file.name.match(/\.(jpg|jpeg|png|gif)$/i)
                        ? 'image'
                        : file.name.endsWith('.mp3')
                          ? 'audio'
                          : file.name.endsWith('.webp')
                            ? 'webp'
                            : file.name.endsWith('.webm')
                              ? 'webm'
                              : file.name.endsWith('.mp4')
                                ? 'video'
                                : file.name.endsWith('.zip')
                                  ? 'zip'
                                  : file.name.endsWith('.heic')
                                    ? 'heic'
                                    : file.name.endsWith('.csv')
                                      ? 'csv'
                                      : file.name.endsWith('.doc') ||
                                        file.name.endsWith('.docx')
                                        ? 'document'
                                        : file.name.endsWith('.xls') ||
                                          file.name.endsWith('.xlsx')
                                          ? 'excel'
                                          : file.name.endsWith('.ppt') ||
                                            file.name.endsWith('.pptx')
                                            ? 'powerpoint'
                                            : file.name.endsWith('.ics')
                                              ? 'ics'
                                              : 'other'
                    : 'other'
                }
                fileUrl={URL.createObjectURL(file)}
                fileUploadingProgress={fileUploadingProgress}
                handleRemoveAttachment={handleRemoveAttachment}
              />
            )}

            <div className="flex items-center gap-3">
              <div className="flex w-10 h-10 relative">
                <input
                  type="file"
                  onChange={handleAttachmentChange}
                  className=" w-0 absolute top-0 left-0 opacity-0"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="p-2 text-blue-500 cursor-pointer"
                >
                  <AttachFileIcon className="cursor-pointer 3xl:min-h-full 3xl:w-auto" />
                </label>
              </div>
              <div className="w-full flex flex-col gap-2 justify-start items-start">
                <textarea
                  placeholder="Type your message"
                  className={`flex-1 w-full bg-transparent text-gray-700 outline-none text-sm font-medium resize-none ${/^[\p{Emoji}]+$/u.test(newMessage) ? '!text-2xl' : 'text-sm'
                    }`}
                  rows={1}
                  value={newMessage}
                  onChange={handleMessageChange}
                />
              </div>
              <div className="flex gap-5 items-center divide-x">
                <div className="flex gap-5 items-center">
                  <EmojiPicker handleEmojiSelector={handleEmojiSelector} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAttachmentChange}
                    className="w-0 absolute top-0 left-0 opacity-0"
                    id="photoInput"
                  />
                  <label
                    htmlFor="photoInput"
                    className="text-blue-500 cursor-pointer"
                  >
                    <PhotoIcon className="cursor-pointer 3xl:min-h-full 3xl:w-auto" />
                  </label>
                </div>
                <span className="pl-5">
                  <button
                    className="p-2 w-10 h-10 bg-[#2357C6] text-white rounded"
                    onClick={handleSendMessage}
                  >
                    <SendMessageIcon className=" 3xl:min-h-full 3xl:w-auto" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full gap-5 bg-white rounded-md shadow-[0_0_15px_3px_rgb(0,0,0,0.1)] items-center justify-center">
          <Image
            src={NoConvoIcon.src}
            height={300}
            width={300}
            alt="Select a chat to start a conversation"
          />
          <h2 className="text-2xl font-semibold text-blue-500 leading-none">
            Start a conversation
          </h2>
        </div>
      )}
    </div>
  );
};
