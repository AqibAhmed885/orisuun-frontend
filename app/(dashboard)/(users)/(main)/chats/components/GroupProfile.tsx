'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { IAssets } from '@/data/dashboard/chats';
import moment from 'moment';
import { chatApi } from '../../../../../api/dashboard/chats';
import { toast } from 'react-toastify';
import PdfIcon from '@/icons/chats/pdf-icon';
import VideoIcon from '@/icons/chats/video-icon';
import DocIcon from '@/icons/chats/doc';
import MiscellaneousIcon from '@/public/chat/files-icon';
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
import ZipIcon from '@/icons/chats/zip-icon';
import MP3Icon from '@/icons/chats/MP3Icon';
import MP4Icon from '@/icons/chats/MP3Icon';
import Favicon from './Favicon';
interface GroupProfileProps {
    loader: boolean;
    isMobile: boolean;
    selectedGroup: any;
    setIsGroupSelected: (value: boolean) => void;
    handleGroupProfileOpenForMobile: () => void;
    assets: IAssets;
    groupMembers: any[];
    refreshGroupData: (groupId: string) => Promise<void>;

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
            return <MP3Icon className='w-7 h-7' />
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

const formatFileName = (fileName: string) => {
    if (!fileName) return 'Unknown File';
    return fileName.length > 20
        ? `${fileName.substring(0, 15)}...${fileName.split('.').pop()}`
        : fileName;
};

const formatFileSize = (size: string | number) => {
    if (!size) return 'Unknown size';
    const numSize = typeof size === 'string' ? parseInt(size) : size;
    if (numSize < 1024) return `${numSize} B`;
    if (numSize < 1024 * 1024) return `${(numSize / 1024).toFixed(2)} KB`;
    return `${(numSize / (1024 * 1024)).toFixed(2)} MB`;
};

const GroupProfile: React.FC<GroupProfileProps> = ({
    isMobile,
    selectedGroup,
    setIsGroupSelected,
    loader,
    handleGroupProfileOpenForMobile,
    assets,
    groupMembers,
    refreshGroupData
}) => {
    const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
    const [memberSearchQuery, setMemberSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [isAddingMembers, setIsAddingMembers] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [viewAllImages, setViewAllImages] = useState(false);
    const [viewAllFiles, setViewAllFiles] = useState(false);
    const [viewAllLinks, setViewAllLinks] = useState(false);

    const handleDownload = (url: string, filename: string) => {
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

    // Extract group documents (images and files) from messages
    const groupDocuments = selectedGroup?.GroupMessage?.flatMap(message =>
        message.ChatDocument ? [message.ChatDocument] : []
    ) || [];

    const groupImages = groupDocuments.filter(doc =>
        doc.FileName?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    );

    const groupFiles = groupDocuments.filter(doc =>
        !doc.FileName?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    );

    const handleAddPeopleClick = () => {
        setShowAddPeopleModal(true);
        setMemberSearchQuery('');
        setSearchResults([]);
        setSelectedUsers([]);
    };

    const handleMemberSearch = async (query: string) => {
        setMemberSearchQuery(query);
        if (query.trim()) {
            try {
                const result = await chatApi.searchUserByNameList(query);
                // Filter out users who are already group members or already selected
                const filteredResults = result.filter(user =>
                    !groupMembers.some(member => member.UserId === user.UserId) &&
                    !selectedUsers.some(u => u.UserId === user.UserId)
                );
                setSearchResults(filteredResults);
            } catch (error) {
                console.error('Error searching users:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const toggleUserSelection = (user: any) => {
        setSelectedUsers(prev => {
            if (prev.some(u => u.UserId === user.UserId)) {
                return prev.filter(u => u.UserId !== user.UserId);
            } else {
                return [...prev, {
                    UserId: user.UserId,
                    FullName: user.FullName,
                    ProfileImage: user.ProfilePicture
                }];
            }
        });
        setMemberSearchQuery('');
        setSearchResults([]);
    };

    const removeSelectedUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(user => user.UserId !== userId));
    };

    const handleAddMembers = async () => {
        if (selectedUsers.length === 0) return;

        setIsAddingMembers(true);
        try {
            const payload = {
                GroupId: selectedGroup.GroupMember[0].GroupId,
                Name: selectedGroup.Name,
                CreatedBy: selectedGroup.CreatedBy,
                UserIds: selectedUsers.map(user => user.UserId)
            };

            await chatApi.addUserIntoGroup(payload);
            toast.success(`${selectedUsers.length} member(s) added to the group!`);

            // Reset the form
            setSelectedUsers([]);
            setShowAddPeopleModal(false);

            //fetch updated group members
            await refreshGroupData(selectedGroup.Id);


        } catch (error) {
            console.error('Error adding members:', error);
            toast.error('Failed to add members to the group');
        } finally {
            setIsAddingMembers(false);
        }
    };

    const handleDeleteClick = (member: any) => {
        setUserToDelete(member);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteMember = async () => {
        if (!userToDelete) return;

        try {
            await chatApi.removeUserFromGroup(
                selectedGroup.GroupMember[0].GroupId,
                userToDelete.UserId || userToDelete.User?.Id
            );

            // Update the local state with proper typing
            toast.success(`${userToDelete.User?.FirstName || userToDelete.FullName} has been removed from the group ${selectedGroup?.Name}`);
            setShowDeleteConfirmation(false);
            await refreshGroupData(selectedGroup.Id);
            setUserToDelete(null);
        } catch (error) {
            console.error('Error removing user from group:', error);
            toast.error('Failed to remove user from group');
        }
    };
    const cancelDeleteMember = () => {
        setShowDeleteConfirmation(false);
        setUserToDelete(null);
    };


    return (
        <div
            className={`relative w-full rounded-md p-4 lg:shadow-lg md:w-80 lg:min-w-80 bg-white flex-col ${isMobile && !selectedGroup ? 'hidden' : selectedGroup ? 'flex' : 'hidden'
                }`}
        >
            <div className="flex flex-col gap-2.5 p-4 items-center justify-between border-b">
                <div className="relative min-w-[50px]">
                    <Image
                        src={selectedGroup?.GroupImage || BASE_URL}
                        alt="Group"
                        className="w-[50px] h-[50px] rounded-full object-cover"
                        width={50}
                        height={50}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full items-center">
                    <h3 className="text-sm sm:text-[.974rem] font-semibold cursor-pointer leading-[130%]">
                        {selectedGroup?.Name ?? 'N/A'}
                    </h3>
                    <span className="text-sm text-blue-300">
                        {groupMembers.length} members
                    </span>
                </div>
            </div>

            <div className="flex-1 space-y-5 divide-y max-h-full">
                {/* Members Section */}
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h3 className="font-semibold mb-3">Members in chat</h3>
                        <h3
                            className="font-semibold text-[#2357C6] mb-3 cursor-pointer"
                            onClick={handleAddPeopleClick}
                        >
                            Add People
                        </h3>
                    </div>

                    <div className="max-h-48 overflow-y-auto">
                        {groupMembers.map((member) => (
                            <div key={member.UserId || member.Id} className="flex items-center justify-between gap-3 mb-2 group">
                                <div className="flex items-center gap-3 flex-1">
                                    <Image
                                        src={member.User.ProfileImage || member.ProfilePicture || BASE_URL}
                                        alt={member.User?.FirstName + ' ' + member.User?.LastName || member.FullName}
                                        width={40}
                                        height={40}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />


                                    <span className='text-4'>{member.User?.FirstName + ' ' + member.User?.LastName || member.FullName}</span>
                                    {member.User.IsVerified && (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.87418 13.5769L3.68445 11.5718L1.42548 11.0769L1.646 8.75126L0.115234 7L1.646 5.24873L1.42548 2.9231L3.68445 2.42823L4.87418 0.423096L6.99982 1.32566L9.12545 0.423096L10.3152 2.42823L12.5742 2.9231L12.3536 5.24873L13.8844 7L12.3536 8.75126L12.5742 11.0769L10.3152 11.5718L9.12545 13.5769L6.99982 12.6743L4.87418 13.5769ZM6.29982 9.13586L9.8357 5.6L9.13315 4.87693L6.29982 7.71026L4.86648 6.29745L4.16393 7L6.29982 9.13586Z" fill="#1A9E78" />
                                    </svg>
                                    )}
                                    {
                                        member.IsAdmin && (
                                            <span className="text-[14px] text-blue-300  py-1 ">
                                                (You)
                                            </span>
                                        )
                                    }
                                </div>

                                {
                                    !member.IsAdmin && (<button
                                        onClick={() => handleDeleteClick(member)}
                                        className="text-gray-400 hover:text-red-500"
                                    >

                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L6.99995 6.99995" stroke="#E31D1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M1 7L6.99995 1.00005" stroke="#E31D1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>)
                                }

                            </div>
                        ))}
                    </div>
                </div>

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
                            } ${groupImages?.length === 0 && '!grid-cols-1'
                            } md:grid md:grid-cols-4 gap-1.5`}
                    >
                        {groupImages?.length ? (
                            (viewAllImages
                                ? groupImages
                                : groupImages.slice(0, 8)
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
                                        className="h-[70px] min-w-[70px] md:!min-w-[50px] shadow-sm border border-black-50 md:!h-[50px] flex justify-center items-center rounded object-cover"
                                        width={50}
                                        height={50}
                                    />
                                </button>
                            ))
                        ) : (
                            <span>Group images will appear here</span>
                        )}
                    </div>
                </div>

                {/* Files Section */}
                {/* Files Section */}
                <div className="pt-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Files</h3>
                        <button
                            onClick={() => setViewAllFiles(!viewAllFiles)}
                            className="h-[48] text-xs text-nav-blue font-semibold"
                        >
                            {viewAllFiles ? 'Show Less' : 'View All'}
                        </button>
                    </div>

                    {/* Scrollable container when expanded */}
                    <div
                        className={`overflow-y-auto transition-all duration-300 ${viewAllFiles ? 'max-h-48' : ''
                            }`}
                    >
                        {groupFiles?.length ? (
                            (viewAllFiles ? groupFiles : groupFiles.slice(0, 3))?.map(
                                (file, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleDownload(file.Document, file.FileName || 'download')
                                        }
                                        className="focus:outline-none w-full text-left"
                                    >
                                        <div className="flex items-center gap-3 cursor-pointer py-2">
                                            <div className="w-7 h-7 3xl:h-full 3xl:w-auto rounded bg-muted flex items-center justify-center">
                                                <span className="w-7 h-7 3xl:h-full 3xl:w-auto">
                                                    {renderFileIcon(file.FileName)}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-left truncate">
                                                    {formatFileName(file.FileName)}
                                                </p>
                                                <div className="text-xs text-blue-300 flex gap-20">
                                                    <p>{formatFileSize(file.size)}</p>
                                                    <p>{moment(file.CreatedDate).format('DD MMM YYYY')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                )
                            )
                        ) : (
                            <span>Group files will appear here</span>
                        )}
                    </div>
                </div>


                {/* Links Section */}
                <div className="pt-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Links</h3>
                        <button
                            onClick={() => setViewAllLinks(!viewAllLinks)}
                            className="h-auto text-xs text-nav-blue font-semibold"
                        >
                            {viewAllLinks ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                    <div className={`${viewAllLinks ? 'max-h-28' : 'max-h-28'} overflow-y-auto`}>
                        {assets?.Links?.length ? (
                            (viewAllLinks ? assets.Links : assets.Links.slice(0, 3)).map((link, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 cursor-pointer"
                                    onClick={() => {
                                        // Add https:// if missing
                                        let url = link.Title;
                                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                                            url = 'https://' + url;
                                        }
                                        window.open(url, '_blank', 'noopener,noreferrer');
                                    }}
                                >
                                    <div className="w-10 h-10 rounded flex items-center justify-center">
                                        <Favicon url={link.Title} className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium max-w-36 truncate">
                                            {link.Title?.length ? link.Title.replace(/^(https?:\/\/)?(www\.)?/, '')   // remove protocol and www
                                                .replace(/([\/?#].*)?$/, '')              // remove everything after first /, ?, or #
                                                .replace(/\.[a-z]{2,}$/, '')              // remove .com, .in, .net, etc.
                                                : 'No title'}
                                        </p>
                                        <p className="text-xs text-blue-300 flex items-center justify-between">
                                            <span>{link.Platform ?? 'Unknown'}</span>
                                            {moment(link.CreatedDate).format('DD MMM YY')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <span>Group links will appear here</span>
                        )}
                    </div>
                </div>

            </div>

            {/* Add People Modal */}
            {showAddPeopleModal && (
                <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-blue-strong">Add People to Group</h3>
                            <button
                                onClick={() => setShowAddPeopleModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="mb-4">
                                <label className="block mb-1 text-z-black text-sm font-semibold">
                                    Search Members
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={memberSearchQuery}
                                        onChange={(e) => handleMemberSearch(e.target.value)}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                                        placeholder="Search users to add"
                                    />
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="max-h-40 overflow-y-auto border rounded mb-4">
                                        {searchResults.map(user => (
                                            <div
                                                key={user.UserId}
                                                className={`p-3 cursor-pointer flex items-center justify-between ${selectedUsers.some(u => u.UserId === user.UserId)
                                                    ? 'bg-blue-50'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                                onClick={() => toggleUserSelection(user)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={user.ProfilePicture || BASE_URL}
                                                        alt={user.FullName}
                                                        width={40}
                                                        height={40}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <span>{user.FullName}</span>
                                                </div>
                                                {selectedUsers.some(u => u.UserId === user.UserId) && (
                                                    <span className="text-blue-500">✓</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedUsers.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium mb-2 text-gray-700">
                                        Selected Members ({selectedUsers.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map(user => (
                                            <div
                                                key={user.UserId}
                                                className="bg-blue-50 px-1 py-1 rounded-full text-sm flex items-center"
                                            >
                                                <Image
                                                    src={user.ProfileImage || BASE_URL}
                                                    alt={user.FullName}
                                                    width={24}
                                                    height={24}
                                                    className="w-5 h-5 rounded-full object-cover mr-2"
                                                />
                                                {user.FullName}
                                                <button
                                                    onClick={() => removeSelectedUser(user.UserId)}
                                                    className="ml-2 w-5 rounded-2xl bg-black-400 hover:bg-black-200 text-md text-white hover:text-white"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                onClick={() => setShowAddPeopleModal(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                                disabled={isAddingMembers}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMembers}
                                disabled={selectedUsers.length === 0 || isAddingMembers}
                                className={`px-4 py-2 rounded text-white ${selectedUsers.length === 0 || isAddingMembers
                                    ? 'bg-[#3d5996fd] cursor-not-allowed'
                                    : 'bg-[#193E8D] hover:bg-[#2f5097fd]'
                                    } transition-colors`}
                            >
                                {isAddingMembers ? 'Adding...' : 'Add Members'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && userToDelete && (
                <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3">
                                {/* <Image
                                    src={userToDelete.ProfileImage || userToDelete.ProfilePicture || BASE_URL}
                                    alt={userToDelete.User?.FirstName + ' ' + userToDelete.User?.LastName || userToDelete.FullName}
                                    width={50}
                                    height={50}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <h3 className="text-lg font-semibold">
                                    {userToDelete.User?.FirstName + ' ' + userToDelete.User?.LastName || userToDelete.FullName}
                                </h3> */}
                            </div>
                            <p className="text-center text-gray-600">
                                Are you sure you want to remove this user from the group?
                            </p>
                            <div className="flex gap-3 w-full justify-center mt-4">
                                <button
                                    onClick={cancelDeleteMember}
                                    className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteMember}
                                    className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors"
                                >
                                    Yes, Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupProfile;
