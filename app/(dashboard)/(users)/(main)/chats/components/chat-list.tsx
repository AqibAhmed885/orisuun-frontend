'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatsIcon from '@/icons/sidebar/chats-icon';
import ChatStartIcon from '../../../../../../public/chat/start-covo.svg';
import UserVerified from '../../../../../../public/chat/verified.svg';
import { Chat, User } from '../../../../../../data/dashboard/chats';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import InvestorIcon from '@/icons/profile-types/investor-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import OnlineGreenIcon from '@/icons/chats/OnlineGreenIcon';
import SearchIcon from '@/icons/chats/search';
import { checkOnlineStatus, showTimeStatus } from '@/utils/helper';
import OfflineIcon from '@/icons/chats/OfflineIcon';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import axios from 'axios';
import { chatApi } from '../../../../../api/dashboard/chats';
import groupImg from './createGroup.png'
import { toast } from 'react-toastify';
import GroupImage from './GroupImage';
import { ChatNavigation } from '../../communities/components/chat-navigation';


interface ChatListProps {
  isMobile: boolean;
  selectedChat: Chat | null;
  chats: Chat[];
  searchQuery: string;
  userList: User[];
  setSearchQuery: (query: string) => void; // Add this
  setUserList: (users: User[]) => void; // Add this
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChatSelect: (chat: Chat | User) => void;
  currentUserId: string;
  groups: any[];
  MarkAsRead: (chatId: string) => void;
  fetchChats: () => void;
  onCommunitySelect?: (community: any) => void;
  onUniversalChatSelect?: (universalChat: any) => void;
  selectedView: 'chats' | 'community' | 'universal';
  setSelectedView: (view: 'chats' | 'community' | 'universal') => void;
  // Add loading state prop
  isLoading: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({
  isMobile,
  selectedChat,
  chats,
  searchQuery,
  userList,
  handleSearch,
  handleChatSelect,
  currentUserId,
  groups,
  fetchChats,
  setSearchQuery,
  setUserList,
  isLoading,
}) => {
  const router = useRouter();
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const [showComposeModal, setShowComposeModal] = useState(false);

  // Add loading state at the top of your component

  const params = useSearchParams();
  const chatId = params.get("id");

  const ChatShimmer = () => (
    <div className="animate-pulse p-2.5 flex items-start gap-3">
      <div className="w-12 h-12 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-3 bg-gray-200 rounded w-12" />
        <div className="h-4 w-4 bg-gray-200 rounded-full" />
      </div>
    </div>
  );

  // const getLastMessageTime = (groupId: string, messages: any[]) => {
  //   const groupMessages = messages.filter(msg => msg.GroupId === groupId);
  //   if (groupMessages.length === 0) return null;

  //   // Sort messages by date (newest first)
  //   const sortedMessages = [...groupMessages].sort((a, b) =>
  //     new Date(b.CreatedDate || b.MessageDate).getTime() -
  //     new Date(a.CreatedDate || a.MessageDate).getTime()
  //   );

  //   return sortedMessages[0].CreatedDate || sortedMessages[0].MessageDate;
  // };

  // const handleUniversalSend = (msg: any) => {
  //   // For demo, just log the message and clear reply state
  //   setReplyingToMessage(null);
  // }
  // const handleComposeSearch = async (query: string) => {
  //   setComposeSearchQuery(query);
  //   if (query.trim()) {
  //     try {
  //       const result = await chatApi.searchUserByNameList(query);
  //       const transformedResults = result.map(user => ({
  //         Id: user.UserId,
  //         FullName: user.FullName,
  //         ProfilePicture: user.ProfilePicture,
  //         UserProfileType: user.UserProfileTypeId,
  //         isVerified: false,
  //         LastActive: user.LastActive
  //       }));
  //       setComposeSearchResults(transformedResults);
  //     } catch (error) {
  //       console.error('Error searching users:', error);
  //       setComposeSearchResults([]);
  //     }
  //   } else {
  //     setComposeSearchResults([]);
  //   }
  // };

  // const handleCommunitySelect = (community: any) => {
  //   if (onCommunitySelect) {
  //     onCommunitySelect(community);
  //   }
  // };

  // const handleBackFromCommunity = () => {
  //   setSelectedCommunity(null);
  // };
  const mergedChats = [
    ...groups.map((group) => {
      const lastMsg = group.GroupMessage?.[group.GroupMessage.length - 1];
      const lastGroupMsgTime = lastMsg?.CreatedDate || lastMsg?.MessageDate || 0;

      return {
        ...group,
        type: 'group',
        latestDate: new Date(lastGroupMsgTime).getTime(),
      };
    }),

    ...chats.map((chat) => ({

      ...chat,
      type: 'chat',
      latestDate: new Date(chat.CreatedDate).getTime(),

    })),
  ].sort((a, b) => b.latestDate - a.latestDate);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    setIsCreatingGroup(true);
    try {
      const requestData = {
        Name: groupName.trim(),
        CreatedBy: currentUserId,
        UserIds: [
          currentUserId, // Include current user as first member
          ...selectedUsers.map(user => user.Id) // Add other selected users
        ]
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Chat/CreateGroupChat`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'XApiKey': process.env.NEXT_PUBLIC_API_KEY
          }
        }
      );

      if (response.data.Message === "Group Created Successfully") {
        toast.success(`Group "${groupName}" created successfully!`);
      }
      else if (response.data.Message === "Group already exists.") {
        toast.error(`Group "${groupName}" already exists try different name.`);
      }
      else if (response.data.Message === "Data found") {
        toast.error(`Group "${groupName}" already exists.`);
      }
      else {
        // Default success case if none of the above
        toast.success(`Group "${groupName}" created successfully!`);
      }

      // Reset form and close modal
      fetchChats();

      setGroupName('');
      setSelectedUsers([]);
      setMemberSearchQuery('');
      setSearchResults([]);
      setShowGroupModal(false);
      setShowComposeModal(false);

    } catch (error) {
      console.error('Error creating group:', error);

      if (error.response) {
        console.error('API Error Response:', error.response.data);

        const apiMessage = error.response.data?.Message;
        if (apiMessage === "Group name already exists in the system.") {
          toast.error(`Group name "${groupName}" already exists. Please try a different name.`);
        } else {
          toast.error("Failed to create group. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsCreatingGroup(false);
    }
  };
  const handleMemberSearch = async (query) => {
    setMemberSearchQuery(query);
    if (query.trim()) {
      try {
        const result = await chatApi.searchUserByNameList(query);
        // Transform the API response to match your expected user structure
        const transformedResults = result.map(user => ({
          Id: user.UserId,
          FullName: user.FullName,
          ProfilePicture: user.ProfilePicture,
          UserProfileType: user.UserProfileTypeId,
          // Add any other required properties
          isVerified: false, // or based on your actual data
          LastActive: user.LastActive
        }));

        setSearchResults(transformedResults.filter(user =>
          user.Id !== currentUserId &&
          !selectedUsers.some(u => u.Id === user.Id)
        ));
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev => {
      if (prev.some(u => u.Id === user.Id)) {
        return prev.filter(u => u.Id !== user.Id);
      } else {
        return [...prev, user];
      }
    });
    setMemberSearchQuery('');
    setSearchResults([]);
  };

  const removeSelectedUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user.Id !== userId));
  };

  const renderProfileTypeIcon = (userProfileType: Number) => {
    switch (userProfileType) {
      case 1:
        return (
          <>
            <BlackOwnedBusinessIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
            Business Member{' '}
          </>
        );
      case 2:
        return (
          <>
            <ConsultantIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
            Consultant
          </>
        );
      case 3:
        return (
          <>
            <ExpertsIcon className="fill-[#2357C6] text-[#2357C6] w-4" /> Expert
          </>
        );
      case 4:
        return (
          <>
            <AdvocatesIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
            Advocate
          </>
        );
      case 6:
        return (
          <>
            <ProfessionalsIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
            Professional
          </>
        );
      case 7:
        return (
          <>
            <InvestorIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
            Investor
          </>
        );
      case 8:
        return (
          <>
            <MentorsIcon className="fill-[#2357C6] text-[#2357C6] w-4" /> Mentor
          </>
        );
      default:
        return (
          <>
            <ProfessionalsIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
            Professional{' '}
          </>
        );
    }
  };

  return (
    <div className={`bg-white shadow-xl rounded-md overflow-hidden h-full
      w-full md:w-[40%] lg:w-[30rem] 2k:max-w-[550px] min-w-[360px]
      ${isMobile && selectedChat ? 'hidden' : ''}
    `}
    >
      <ChatNavigation
        selectedView="chats"
        chatsCount={1}
        onNewChat={() => {
          setShowComposeModal(true);
          setSearchQuery('');
          setUserList([]);
        }}
      />

      {/* Main Content - Conditional Rendering */}
      {(
        <>
          <div className="p-4 relative">
            <div className="absolute  top-1/2 transform -translate-y-1/2">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search messages and find members"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full md:!py-2 md:!pr-2 leading-5 xs:py-3 xs:pr-4 xs:!pl-12 border rounded text-sm placeholder:text-black-100 placeholder:font-normal border-black-100 bg-white outline-none placeholder-gray-500"
            />
          </div>

          <div
            className={`overflow-y-auto ${searchQuery.trim() ? 'h-[calc(40%-33px)]' : 'h-full'
              }`}
          >
            <ul className="divide-y xs:max-h-[calc(100vh-205px)] overflow-auto">
              {isLoading ? (
                // ✅ Only shimmer when loading
                <>
                  <ChatShimmer />
                  <ChatShimmer />
                  <ChatShimmer />
                  <ChatShimmer />
                  <ChatShimmer />
                  <ChatShimmer />
                  <ChatShimmer />
                  <ChatShimmer />
                  <ChatShimmer />
                </>
              ) : (
                // ✅ Only chats after loading
                mergedChats.map((item) =>
                  item.type === "group" ? (
                    <li
                      key={item.Id}
                      className={`flex items-start gap-1 p-2.5 cursor-pointer relative hover:bg-gray-50 ${!isMobile && (selectedChat?.Id === item.Id || chatId === item.Id)
                          ? "bg-olblue-50"
                          : ""
                        }`}
                      onClick={() => handleChatSelect(item)}
                    >
                      <div className="relative mr-2">
                        <GroupImage
                          members={item.GroupMember.map((member) => ({
                            Id: member.User.Id,
                            ProfileImage: member.User.ProfileImage,
                          }))}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="leading-[130%] text-[.94rem] font-semibold ellipsis capitalize">
                          {item.Name.charAt(0).toUpperCase() + item.Name.slice(1)}
                        </h3>
                        <p className="text-xs text-blue-300">
                          {item.GroupMember?.length || 0}{" "}
                          {item.GroupMember?.length === 1 ? "person" : "people"}
                        </p>
                        {item.GroupMessage?.length > 0 && (
                          <p className="text-xs text-gray-500 w-[160px] ipad:w-[130px] leading-[140%] text-ellipsis overflow-hidden whitespace-nowrap">
                            {`${item.GroupMessage[item.GroupMessage.length - 1].Sender.FirstName} ${item.GroupMessage[item.GroupMessage.length - 1].Sender.LastName
                              }: ${item.GroupMessage[item.GroupMessage.length - 1].Message
                              }`}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-center justify-center gap-2 w-full max-w-14 min-w-14">
                        <span className="text-xs text-gray-400 text-end">
                          {item.latestMessageDate
                            ? showTimeStatus(item.latestMessageDate)
                            : ""}
                        </span>
                        {item.UnreadMessagesCount > 0 && (
                          <span className="text-[10px] text-white bg-nav-blue rounded-full w-4 h-4 flex items-center font-semibold justify-center">
                            {item.UnreadMessagesCount}
                          </span>
                        )}
                      </div>
                    </li>
                  ) : (
                    <li
                      key={item.Id}
                      className={`flex items-start gap-1 p-2.5 cursor-pointer relative hover:bg-gray-50 ${!isMobile && selectedChat?.HubId === item?.HubId
                          ? "bg-olblue-50"
                          : ""
                        }`}
                      onClick={() => handleChatSelect(item)}
                    >
                      <div className="relative mr-2">
                        <Image
                          src={item.ReceiverProfileImage || BASE_URL}
                          alt="Profile"
                          className="w-[3rem] h-[3rem] rounded-full object-cover min-w-[3rem]"
                          width={50}
                          height={50}
                        />
                        {checkOnlineStatus(item?.LastActive) === "online" ? (
                          <OnlineGreenIcon className="absolute bottom-0 right-0 w-10 h-10" />
                        ) : (
                          <OfflineIcon className="absolute bottom-0 right-0 w-10 h-10" />
                        )}
                      </div>

                      <div className="flex-1">
                        <span className="flex gap-2 items-center !max-w-32">
                          <h3 className="leading-[130%] font-semibold ellipsis">
                            {item.FullName}
                          </h3>
                          {item.isVerified ? (
                            <Image
                              alt="verified"
                              src={UserVerified.src}
                              height={20}
                              width={20}
                            />
                          ): null}
                        </span>
                        <span className="text-sm text-blue-300 leading-[140%] flex items-center gap-2">
                          {renderProfileTypeIcon(Number(item.UserProfileType))}
                        </span>
                        <p className="text-xs text-blue-300 w-[160px] ipad:w-[130px] leading-[140%] text-ellipsis overflow-hidden whitespace-nowrap">
                          {item.FullName}: {item.Message}
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-2 w-full max-w-14 min-w-14">
                        <span className="text-xs text-gray-400 text-end">
                          {showTimeStatus(item.CreatedDate)}
                        </span>
                        {item.UnReadCount > 0 && selectedChat?.HubId !== item?.HubId && (
                          <span className="text-[10px] text-white bg-nav-blue rounded-full w-4 h-4 flex items-center font-semibold justify-center">
                            {item.UnReadCount}
                          </span>
                        )}
                      </div>
                    </li>
                  )
                )
              )}
            </ul>

          </div>


          {/* Group Creation Modal */}
          {
            showGroupModal && (
              <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col ">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-blue-strong">Create New Group</h3>
                    <button
                      onClick={() => {
                        setShowGroupModal(false);
                        setGroupName('');
                        setSelectedUsers([]);
                        setMemberSearchQuery('');
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >

                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="mb-4">
                      <label className="block mb-1 text-z-black text-sm font-semibold">
                        Group Name
                      </label>
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter group name"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1 text-z-black text-sm font-semibold">
                        Add Members
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={memberSearchQuery}
                          onChange={(e) => handleMemberSearch(e.target.value)}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                          placeholder="Search users"
                        />
                      </div>

                      {searchResults.length > 0 && (
                        <div className="max-h-40 overflow-y-auto border rounded mb-4">
                          {searchResults.map(user => (
                            <div
                              key={user.Id}
                              className={`p-3 cursor-pointer flex items-center justify-between ${selectedUsers.some(u => u.Id === user.Id)
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
                              {selectedUsers.some(u => u.Id === user.Id) && (
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
                              key={user.Id}
                              className="bg-blue-50 px-1 py-1 rounded-full text-sm flex items-center"
                            >
                              <Image
                                src={user.ProfilePicture || BASE_URL}
                                alt={user.FullName}
                                width={24}
                                height={24}
                                className="w-5 h-5 rounded-full object-cover mr-2"
                              />
                              {user.FullName}
                              <button
                                onClick={() => removeSelectedUser(user.Id)}
                                className="ml-2  w-5 rounded-2xl bg-black-400 hover:bg-black-200  text-md text-white hover:text-white"
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
                      onClick={() => {
                        setShowGroupModal(false);
                        setGroupName('');
                        setSelectedUsers([]);
                        setShowComposeModal(true); // Show compose modal when closing group modal
                      }}
                      className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                      disabled={isCreatingGroup}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateGroup}
                      disabled={!groupName.trim() || selectedUsers.length === 0 || isCreatingGroup}
                      className={`px-4 py-2 rounded text-white ${!groupName.trim() || selectedUsers.length === 0 || isCreatingGroup
                        ? 'bg-[#3d5996fd] cursor-not-allowed'
                        : 'bg-[#193E8D] hover:bg-[#2f5097fd]'
                        } transition-colors`}
                    >
                      {isCreatingGroup ? 'Creating...' : 'Create Group'}
                    </button>
                  </div>
                </div>
              </div>
            )
          }



          {
            !!searchQuery.trim() && !showComposeModal ? (
              <div className={`overflow-y-auto h-[calc(60%-33px)]`}>
                <h2 className="py-2 px-4 text-[#192e8d] items-center text-sm font-semibold z-50 flex gap-2">
                  <ChatsIcon />
                  Users Directory
                </h2>
                <ul>
                  {userList.length > 0 ? (
                    userList?.map((user) => (
                      <li
                        key={user.Id}
                        className={`flex items-center space-x-2 md:space-x-3 p-2.5 cursor-pointer relative hover:bg-gray-50`}
                        onClick={() => handleChatSelect(user)}
                      >
                        <div className={`h-10 w-2 rounded-r-lg absolute left-0`}></div>
                        <Image
                          src={user.ProfilePicture || BASE_URL}
                          alt="Profile"
                          className="min-w-[50px] h-[50px] rounded-full object-cover"
                          width={50}
                          height={50}
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium ">{user.FullName}</h3>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-lg align-middle text-gray-600 whitespace-nowrap">
                      No chat found
                    </p>
                  )}
                </ul>
              </div>
            ) : chats.length > 0 ? (
              <h2 className="py-2 px-4 leading-[140%] text-blue-300">Inbox</h2>
            ) : (
              <h2 className="px-4 flex flex-col gap-3 text-2xl font-semibold leading-6 -mt-4 text-blue-500">
                <Image
                  src={ChatStartIcon.src}
                  alt="Start a Conversation"
                  height={300}
                  width={300}
                  className="w-full"
                />
              </h2>
            )
          }

          {
            showComposeModal && (
              <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-blue-strong">New Message</h3>
                    <button
                      onClick={() => {
                        setShowComposeModal(false);
                        setUserList([]);
                        setSearchQuery('');
                      }}
                      className="w-5 h-5 flex items-center justify-center text-gray-700 text-2xl rounded-full bg-gray-300 hover:bg-gray-400"
                    >
                      <span>×</span>
                    </button>

                  </div>

                  <div className=" relative">
                    <div className="absolute top-1/2 transform -translate-y-1/2">
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="Search members"
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full leading-5 xs:py-3 xs:pr-4 xs:!pl-12 border rounded text-sm placeholder:text-black-100 placeholder:font-normal border-black-100 bg-white outline-none placeholder-gray-500"
                    />

                  </div>
                  <button
                    onClick={() => {
                      setShowGroupModal(true);
                      setShowComposeModal(false); // Hide compose modal when opening group modal
                    }}
                    className="mt-3 px-4 rounded-full text-[#192e8d] font-semibold bg-white sticky transition-colors flex items-center gap-2"
                    aria-label="Create group chat"
                  >
                    <Image src={groupImg} alt="Group Icon" width={25} height={25} />
                    Create Group
                  </button>

                  <div className="overflow-y-auto h-[calc(100%-60px)]">
                    {searchQuery.trim() && (
                      <>
                        <h2 className="py-2 px-4 text-[#192e8d] items-center text-sm font-semibold z-50 flex gap-2">
                          <ChatsIcon />
                          Users Directory
                        </h2>
                        <ul>
                          {userList.length > 0 ? (
                            userList?.map((user) => (
                              <li
                                key={user.Id}
                                className={`flex items-center space-x-2 md:space-x-3 p-2.5 cursor-pointer relative hover:bg-gray-50`}
                                onClick={() => {
                                  handleChatSelect(user);
                                  setShowComposeModal(false);
                                  setSearchQuery('');
                                  setUserList([]);
                                }}
                              >
                                <div className={`h-10 w-2 rounded-r-lg absolute left-0`}></div>
                                <Image
                                  src={user.ProfilePicture || BASE_URL}
                                  alt="Profile"
                                  className="min-w-[50px] h-[50px] rounded-full object-cover"
                                  width={50}
                                  height={50}
                                />
                                <div className="flex-1">
                                  <h3 className="text-sm font-medium ">{user.FullName}</h3>
                                </div>
                              </li>
                            ))
                          ) : (
                            <p className="text-center text-lg align-middle text-gray-600 whitespace-nowrap">
                              No users found
                            </p>
                          )}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          }

        </>
      )}

    </div >
  );
};