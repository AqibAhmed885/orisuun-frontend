'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import UserVerified from '@/public/chat/user-verified.svg';
import LocationPin from '@/public/chat/location-pin.svg';
import NoConvoIcon from '@/public/chat/NoConvoIcon.svg';
import FileCard from './file-card';
import { chatApi } from '../../../../../api/dashboard/chats';
import { Loader } from '@/app/(dashboard)/(users)/(main)/chats/components/loader';
import {
    checkOnlineStatus,
    processTimeZoneInfo,
    showTimeStatus,
} from '@/utils/helper';
import EmojiPicker from '../../../../../../components/ui/emoji-picker';
import { apiEndpoint, renderLocation } from '@/utils/utils';
import OnlineGreenIcon from '@/icons/chats/OnlineGreenIcon';
import {
    AttachFileIcon,
    PhotoIcon,
    SendMessageIcon,
} from '@/icons/chats/textarea-icons';
import momentTimezone from 'moment-timezone';
import Linkify from 'react-linkify';
import ClockIcon from '@/public/chat/time-clock.svg';
import { isEmpty } from 'lodash';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { toast } from 'react-toastify';
import GroupImage from './GroupImage';
import AssociateDetailsModel from './AssociateDetailsModel'

interface GroupChatInterfaceProps {
    selectedGroup: any;
    isMobile: boolean;
    loader: boolean;
    setIsGroupSelected: (value: boolean) => void;
    messages: any[];
    newMessage: string;
    handleMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    file: File | null;
    loaderImage: boolean;
    handleRemoveAttachment: () => void;
    handleAttachmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSendGroupMessage: () => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
    handleGroupProfileOpenForMobile: () => void;
    fileUploadingProgress: number;
    handleEmojiSelector: (emojiCode: string) => void;
    scrollToBottom: () => void;
    groupMembers: any[];
    senderId: { Id: string };
    handleManageChat: () => void;
    setSelectedGroup: (group: any) => void;
    setMessages: (messages: any[]) => void;
    setShowGroupProfile: (value: boolean) => void;
    refreshGroupData: (groupId: string) => Promise<void>;
    fetchchats: () => Promise<void>;
}

export const GroupChatInterface: React.FC<GroupChatInterfaceProps> = ({
    selectedGroup,
    isMobile,
    loader,
    setIsGroupSelected,
    messages,
    newMessage,
    handleMessageChange,
    file,
    loaderImage,
    handleRemoveAttachment,
    handleAttachmentChange,
    handleSendGroupMessage,
    handleKeyPress,
    handleGroupProfileOpenForMobile,
    fileUploadingProgress,
    handleEmojiSelector,
    scrollToBottom,
    groupMembers,
    senderId,
    handleManageChat,
    setSelectedGroup,
    setMessages,
    setShowGroupProfile,
    refreshGroupData,
    fetchchats
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleBackButton = () => {
            setIsGroupSelected(false);
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
        const parentDiv = document.querySelector('.groupChatInterface') as HTMLDivElement;
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
    const handleDeleteChat = async () => {
        try {
            await chatApi.deleteGroupChat(selectedGroup.Id);
            await refreshGroupData(selectedGroup.Id);
            fetchchats();
            toast.success(`Group Name: ${selectedGroup.Name} deleted successfully`);
            setIsGroupSelected(false);
            setShowGroupProfile(false)
            setSelectedGroup(null); // Reset selected group
            setShowGroupProfile(false); // Hide group profile
            setMessages([]);
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };
    const handleClearHistory = async () => {
        try {
            await chatApi.clearGroupChatHistory(selectedGroup.Id);
            await refreshGroupData(selectedGroup.Id);
            await fetchchats();
            setMessages([]);
            setShowGroupProfile(false);
            toast.success('Chat history cleared successfully');
        } catch (error) {
            console.error('Error clearing chat history:', error);
            toast.error('No chat history is available');
        }
    };
    const handleExitGroup = async () => {
        try {
            await chatApi.removeUserFromGroup(selectedGroup.Id, senderId.Id);
            refreshGroupData(selectedGroup.Id);
            setIsGroupSelected(false);
            setSelectedGroup(null); // Reset selected group
            setShowGroupProfile(false); // Hide group profile
            setMessages([]); // Clear messages
            toast.success('You have left the group successfully');
        } catch (error) {
            console.error('Error leaving group:', error);
            toast.error('Failed to leave the group');
        }
    };

    // Inside the GroupChatInterface component, add:
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Add this useEffect hook to scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom2();
    }, [messages]);

    // Modify the scrollToBottom function to use the ref
    const scrollToBottom2 = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    function handleClickMessage(message) {
        if (message != null && message?.AssociateId != null && message?.AssociateId != 0) {
            setClickedMessage(message?.AssociateDetails)
            setIsAssociateModalOpen(true)
        }
    }

    return (
        <div
            className={`relative ${selectedGroup ? 'lg:!min-w-[526px] xs:w-full' : 'w-full'} 
      md:block flex flex-col ${isMobile && selectedGroup ? 'block' : 'hidden'}`}
        >
            {isAssociateModalOpen && <AssociateDetailsModel selectedPerson={clickedMessage} setIsAssociateModalOpen={setIsAssociateModalOpen} />}

            {selectedGroup ? (
                <div
                    className={`flex flex-col lg:gap-6 bg-white lg:!bg-transparent h-full max-h-full min-h-0
          ${loader && 'justify-end'}`}
                >
                    <div
                        className={`flex flex-col flex-grow overflow-auto relative rounded-md lg:shadow-xl bg-[#FFFFFF] xs:pb-0 lg:pb-4 p-4 ${dynamicHeight} ${file
                            ? 'max-h-[calc(100vh-167px)] 3xl:max-h-[calc(100vh-255px)] 4xl:max-h-[calc(100vh-260px)] 2k:max-h-[calc(100vh-168px)]'
                            : 'max-h-[calc(100vh-110px)]'
                            }`}
                    >
                        <>
                            <div className="border-b pb-5 mb-3 gap-3 flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <div onClick={() => setIsGroupSelected(false)} className="block md:hidden">
                                        {/* Back button */}
                                    </div>
                                    <div className="relative min-w-[50px]">
                                        <GroupImage
                                            members={selectedGroup.GroupMember.map(member => ({
                                                Id: member.User.Id,
                                                ProfileImage: member.User.ProfileImage
                                            }))}
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <div className="flex gap-2 items-center">
                                            <h3 className="text-sm sm:text-base font-semibold leading-[130%]">
                                                {selectedGroup?.GroupName || selectedGroup?.Name}
                                            </h3>
                                        </div>
                                        <span className="text-sm text-blue-300">
                                            {groupMembers.length} people
                                        </span>
                                    </div>
                                </div>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        <svg width="6" height="24" viewBox="0 0 6 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.625 20.75C5.625 21.4462 5.34844 22.1139 4.85616 22.6062C4.36387 23.0984 3.69619 23.375 3 23.375C2.30381 23.375 1.63613 23.0984 1.14384 22.6062C0.651561 22.1139 0.375 21.4462 0.375 20.75C0.375 20.0538 0.651561 19.3861 1.14384 18.8938C1.63613 18.4016 2.30381 18.125 3 18.125C3.69619 18.125 4.36387 18.4016 4.85616 18.8938C5.34844 19.3861 5.625 20.0538 5.625 20.75ZM5.625 12C5.625 12.6962 5.34844 13.3639 4.85616 13.8562C4.36387 14.3484 3.69619 14.625 3 14.625C2.30381 14.625 1.63613 14.3484 1.14384 13.8562C0.651561 13.3639 0.375 12.6962 0.375 12C0.375 11.3038 0.651561 10.6361 1.14384 10.1438C1.63613 9.65156 2.30381 9.375 3 9.375C3.69619 9.375 4.36387 9.65156 4.85616 10.1438C5.34844 10.6361 5.625 11.3038 5.625 12ZM5.625 3.25C5.625 3.94619 5.34844 4.61387 4.85616 5.10616C4.36387 5.59844 3.69619 5.875 3 5.875C2.30381 5.875 1.63613 5.59844 1.14384 5.10616C0.651561 4.61387 0.375 3.94619 0.375 3.25C0.375 2.55381 0.651561 1.88613 1.14384 1.39384C1.63613 0.901562 2.30381 0.625 3 0.625C3.69619 0.625 4.36387 0.901562 4.85616 1.39384C5.34844 1.88613 5.625 2.55381 5.625 3.25Z" fill="#0A193A" />
                                        </svg>

                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-[10px] shadow-[0_-4px_6px_-1px_#2357C633,0_4px_6px_-1px_#2357C633] z-50">
                                            <div className="py-4 p-4">



                                                {selectedGroup.GroupMember.find(member =>
                                                    member.UserId === senderId.Id && member.IsAdmin
                                                ) && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    handleManageChat();
                                                                    setShowDropdown(false);
                                                                }}
                                                                className="w-full font-medium text-left px-4 py-2 text-4 hover:bg-gray-100 flex items-center gap-2"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M15.2502 9.00008C15.2502 8.80841 15.2419 8.62508 15.2252 8.43341L16.7752 7.25841C17.1085 7.00841 17.2002 6.54175 16.9919 6.17508L15.4335 3.48341C15.2252 3.11675 14.7752 2.96675 14.3919 3.13341L12.6002 3.89175C12.2919 3.67508 11.9669 3.48341 11.6252 3.32508L11.3835 1.40008C11.3335 0.983415 10.9752 0.666748 10.5585 0.666748H7.45021C7.02521 0.666748 6.66688 0.983415 6.61688 1.40008L6.37521 3.32508C6.03354 3.48341 5.70854 3.67508 5.40021 3.89175L3.60854 3.13341C3.22521 2.96675 2.77521 3.11675 2.56688 3.48341L1.00854 6.18341C0.800209 6.55008 0.891876 7.00841 1.22521 7.26675L2.77521 8.44175C2.75854 8.62508 2.75021 8.80841 2.75021 9.00008C2.75021 9.19175 2.75854 9.37508 2.77521 9.56675L1.22521 10.7417C0.891876 10.9917 0.800209 11.4584 1.00854 11.8251L2.56688 14.5167C2.77521 14.8834 3.22521 15.0334 3.60854 14.8667L5.40021 14.1084C5.70854 14.3251 6.03354 14.5167 6.37521 14.6751L6.61688 16.6001C6.66688 17.0167 7.02521 17.3334 7.44188 17.3334H10.5502C10.9669 17.3334 11.3252 17.0167 11.3752 16.6001L11.6169 14.6751C11.9585 14.5167 12.2835 14.3251 12.5919 14.1084L14.3835 14.8667C14.7669 15.0334 15.2169 14.8834 15.4252 14.5167L16.9835 11.8251C17.1919 11.4584 17.1002 11.0001 16.7669 10.7417L15.2169 9.56675C15.2419 9.37508 15.2502 9.19175 15.2502 9.00008ZM9.03354 11.9167C7.42521 11.9167 6.11688 10.6084 6.11688 9.00008C6.11688 7.39175 7.42521 6.08341 9.03354 6.08341C10.6419 6.08341 11.9502 7.39175 11.9502 9.00008C11.9502 10.6084 10.6419 11.9167 9.03354 11.9167Z" fill="#5B657B" />
                                                                </svg>
                                                                Manage chat
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    handleClearHistory();
                                                                    setShowDropdown(false);
                                                                }}
                                                                className="border-b font-medium w-full text-left px-4 py-2 text-text hover:bg-gray-100 flex items-center gap-2"
                                                            >
                                                                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M11.3333 9.16659H10.5V2.49992C10.5 1.58325 9.75 0.833252 8.83333 0.833252H7.16667C6.25 0.833252 5.5 1.58325 5.5 2.49992V9.16659H4.66667C2.36667 9.16659 0.5 11.0333 0.5 13.3333V19.1666H15.5V13.3333C15.5 11.0333 13.6333 9.16659 11.3333 9.16659ZM13.8333 17.4999H12.1667V14.9999C12.1667 14.5416 11.7917 14.1666 11.3333 14.1666C10.875 14.1666 10.5 14.5416 10.5 14.9999V17.4999H8.83333V14.9999C8.83333 14.5416 8.45833 14.1666 8 14.1666C7.54167 14.1666 7.16667 14.5416 7.16667 14.9999V17.4999H5.5V14.9999C5.5 14.5416 5.125 14.1666 4.66667 14.1666C4.20833 14.1666 3.83333 14.5416 3.83333 14.9999V17.4999H2.16667V13.3333C2.16667 11.9583 3.29167 10.8333 4.66667 10.8333H11.3333C12.7083 10.8333 13.8333 11.9583 13.8333 13.3333V17.4999Z" fill="#5B657B" />
                                                                </svg>

                                                                Clear history
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleDeleteChat();
                                                                    setShowDropdown(false);
                                                                }}
                                                                className="w-full font-medium text-left px-4 py-2 text-4 text-red-500 hover:bg-gray-100 flex items-center gap-2"
                                                            >
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g clip-path="url(#clip0_2280_11607)">
                                                                        <path d="M5.00033 15.8333C5.00033 16.75 5.75033 17.5 6.66699 17.5H13.3337C14.2503 17.5 15.0003 16.75 15.0003 15.8333V7.5C15.0003 6.58333 14.2503 5.83333 13.3337 5.83333H6.66699C5.75033 5.83333 5.00033 6.58333 5.00033 7.5V15.8333ZM15.0003 3.33333H12.917L12.3253 2.74167C12.1753 2.59167 11.9587 2.5 11.742 2.5H8.25866C8.04199 2.5 7.82533 2.59167 7.67533 2.74167L7.08366 3.33333H5.00033C4.54199 3.33333 4.16699 3.70833 4.16699 4.16667C4.16699 4.625 4.54199 5 5.00033 5H15.0003C15.4587 5 15.8337 4.625 15.8337 4.16667C15.8337 3.70833 15.4587 3.33333 15.0003 3.33333Z" fill="#E31D1C" />
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0_2280_11607">
                                                                            <rect width="20" height="20" fill="white" />
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                                Delete chat
                                                            </button>
                                                        </>
                                                    )}
                                                {!selectedGroup.GroupMember.find(member =>
                                                    member.UserId === senderId.Id && member.IsAdmin
                                                ) && (
                                                        <button
                                                            onClick={() => { handleExitGroup(); setShowDropdown(false); setIsGroupSelected(false); }}
                                                            className="w-full font-medium text-left px-4 py-2 text-4 text-red-500 hover:bg-gray-100 flex items-center gap-2"
                                                        ><svg
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"

                                                        >
                                                                <path
                                                                    d="M11 16L7 12M7 12L11 8M7 12L21 12M16 16V17C16 18.6569 14.6569 20 13 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H13C14.6569 4 16 5.34315 16 7V8"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                            Exit Group
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    )}
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
                                ) : messages?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <p className="text-gray-500 text-lg">No available history</p>
                                    </div>
                                ) : (
                                    messages
                                        ?.filter((message) => message.GroupId === selectedGroup.Id)
                                        .map((message, index) => (
                                            <div key={index} className={`flex items-start mb-4 gap-4`}>
                                                <div className="relative min-w-[40px] cursor-pointer" onClick={() => { handleClickMessage(message) }}>
                                                    {(message.Sender_UserId != senderId.Id && message?.AssociateId != null && message?.AssociateId != 0) ?
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
                                                                message.ProfileImage || BASE_URL
                                                            }
                                                            alt="Profile"
                                                            className="h-9 w-9 rounded-full object-cover"
                                                            width={40}
                                                            height={40}
                                                        />)}
                                                </div>
                                                <div className={`flex items-center flex-col !bg-transparent justify-between rounded-lg text-left min-w-[200px] max-w-full`}>
                                                    <div className="w-full text-start flex flex-col gap-2">
                                                        {(!!message.Message || message.GroupChatDocument) && (
                                                            <>
                                                                <div className="flex gap-2.5 ">
                                                                    <p className="text-sm font-semibold leading-[130%] cursor-pointer" onClick={() => { handleClickMessage(message) }}>
                                                                        {message.SenderId === senderId.Id ? 'You' : (message.Sender_UserId != senderId.Id && message?.AssociateId != null && message?.AssociateId != 0) ? message?.AssociateDetails.Name + " (" + message.SenderName + ")" : message.SenderName}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 chat-time">

                                                                        {showTimeStatus(new Date(message.CreatedDate))}
                                                                    </p>
                                                                </div>
                                                                {message.Message && (
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
                                                                )}
                                                                {message.GroupChatDocument && (
                                                                    <FileCard
                                                                        isSent={true}
                                                                        fileName={message.GroupChatDocument.fileName || message.GroupChatDocument.FileName}
                                                                        fileSize={message.GroupChatDocument.size}
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
                                                                        fileUrl={message.GroupChatDocument.document || message.GroupChatDocument.Document}
                                                                    />
                                                                )}
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
                        className={`flex flex-col sticky bottom-0 groupChatInterface bg-[#FFFFFF] rounded-md lg:shadow-xl p-4 border-t gap-3 ${file ? 'min-h-[144px]' : 'min-h-[calc(72px+var(--textareaHeight,0px))]'
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
                                    id="groupFileInput"
                                />
                                <label
                                    htmlFor="groupFileInput"
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
                                        id="groupPhotoInput"
                                    />
                                    <label
                                        htmlFor="groupPhotoInput"
                                        className="text-blue-500 cursor-pointer"
                                    >
                                        <PhotoIcon className="cursor-pointer 3xl:min-h-full 3xl:w-auto" />
                                    </label>
                                </div>
                                <span className="pl-5">
                                    <button
                                        className="p-2 w-10 h-10 bg-[#2357C6] text-white rounded"
                                        onClick={handleSendGroupMessage}
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
                        alt="Select a group to start a conversation"
                    />
                    <h2 className="text-2xl font-semibold text-blue-500 leading-none">
                        Start a group conversation
                    </h2>
                </div>
            )}
        </div>
    );
};