'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { generateUploadFileSasTokenDataForChat } from '@/server-actions/verification';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import Hamburger from '@/icons/sidebar/hamburger';
import moment from 'moment';
import { ChatList } from './components/chat-list';
import { ChatInterface } from './components/chat-interface';
import ChatProfile from './components/chat-profile';
import { IAssets } from '@/data/dashboard/chats';
import { chatApi } from '../../../../api/dashboard/chats';
import GroupProfile from './components/GroupProfile';
import { GroupChatInterface } from './components/GroupChatInterface';
import { signalRService } from './components/signalRService';
const defaultAssets = { Links: [], Images: [], Files: [] };

const Chats = () => {

  const { profileData } = useSelector((state: RootState) => state.user);
  const [sasToken, setSasToken] = useState('');
  const [chats, setChats] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null);
  const [userList, setUserList] = useState([]);
  const senderId =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const [loader, setLoader] = useState(false);
  const [loaderChat, setLoaderChat] = useState(false);
  const [loaderImage, setLoaderImage] = useState(false);
  const messagesEndRef = useRef(null);
  const isMobile = useMobileMediaQuery();
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [assets, setAssets] = useState<IAssets>(defaultAssets);
  const [fileUploadingProgress, setFileUploadingProgress] = useState(0);
  const chatDetails =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('chatDetails'));
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [isChatProfileOpen, setIsChatProfileOpen] = useState(false);
  // Add these with your other state declarations
  const [isGroupProfileOpen, setIsGroupProfileOpen] = useState(false);
  // Add this with your other handler functions
  const handleGroupProfileOpenForMobile = () => setIsGroupProfileOpen(!isGroupProfileOpen);
  //group
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isGroupSelected, setIsGroupSelected] = useState(false);


  const handleEmojiSelector = (emojiCode: string) => {
    setNewMessage(
      (prevState) => prevState + String.fromCodePoint(parseInt(emojiCode, 16))
    );
  };

  const handleChatProfileOpenForMobile = () => setIsChatProfileOpen(!isChatProfileOpen);

  const [showGroupProfile, setShowGroupProfile] = useState(false);
  const [selectedView, setSelectedView] = useState<'chats' | 'community' | 'universal'>('chats');

  //real time chat

  useEffect(() => {
    if (senderId?.Id) {
      signalRService.startConnection(senderId.Id);

      signalRService.onReceivePrivateMessage((message) => {

        const createdDate = new Date();
        // Ensure that the date object is valid
        if (isNaN(createdDate.getTime())) {
          createdDate.setTime(Date.now()); // Force a valid current time
        }

        // Format the date for India Standard Time (IST) using toLocaleString
        const formattedDate = createdDate.toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true, // Ensure the time is in 12-hour format with AM/PM
        });

        const formattedMessage = {
          Id: message.Id || message.id || uuidv4(),
          Message: message.message || message.Message,
          Sender_UserId: message.sender_UserId || message.Sender_UserId,
          Receiver_UserId: message.receiver_UserId || message.Receiver_UserId,
          SenderProfileImage: message.senderProfileImage || message.SenderProfileImage,
          ReceiverProfileImage: message.receiverProfileImage || message.ReceiverProfileImage,
          CreatedDate: message.messageDate || new Date(),
          TimeStatus: message.timeStatus || GetMessageTime(createdDate),
          ChatDocument: message.chatDocument || null,
          IsRead: message.isRead || false,
          FullName: message.fullName || message.FullName || "Unknown",
          AssociateId: message.associateId || message.AssociateId || null, // ✅ Add this
          AssociateDetails: message.associateDetails || message.AssociateDetails || null // ✅ Add this
        };

        setMessages(prev => {
          const exists = prev.some(m => m.Id === formattedMessage.Id);
          return exists ? prev : [...prev, formattedMessage];
        });
        fetchChats();
      });


      return () => {
        if (senderId?.Id) {
          signalRService.stopConnection(senderId.Id);
        }
      };
    }
  }, [senderId?.Id]);


  useEffect(() => {
    if (senderId?.Id) {
      signalRService.startConnection(senderId.Id);

      // Add this for group messages
      // signalRService.onReceiveGroupMessage((message) => {
      //   if (selectedGroup && message.groupId === selectedGroup.Id) {
      //     MarkAsReadForGroup(selectedGroup);
      //   }
      //   const createdDate = new Date(message.messageDate || message.MessageDate);
      //   // Fallback to current time only if invalid
      //   if (isNaN(createdDate.getTime())) {
      //     console.warn('Invalid server date, falling back to local time');
      //     createdDate.setTime(Date.now());
      //   }
      //   const formattedDate = createdDate.toLocaleString('en-IN', {
      //     day: '2-digit',
      //     month: '2-digit',
      //     year: 'numeric',
      //     hour: '2-digit',
      //     minute: '2-digit',
      //     second: '2-digit',
      //     hour12: true,
      //   });
      //   const formattedMessage = {
      //     Id: message.Id || message.id || uuidv4(),
      //     GroupId: message.groupId || message.GroupId,
      //     Message: message.message || message.Message,
      //     SenderId: message.senderId || message.SenderId,
      //     CreatedDate: createdDate,
      //     MessageDate: message.messageDate || message.MessageDate,
      //     TimeStatus: GetMessageTime(createdDate),
      //     ProfileImage: `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${message.profileImage.split('/').pop().split('?')[0]}`,
      //     GroupChatDocument: message.chatDocument || null,
      //     SenderName: message.senderName || message.SenderName || "Unknown",
      //     AssociateId: message.AssociateId || message.associateId || null,
      //     AssociateDetails: message.AssociateDetails || message.associateDetails || null
      //   };
      //   setMessages(prev => {
      //     const exists = prev.some(m => m.Id === formattedMessage.Id);
      //     return exists ? prev : [...prev, formattedMessage];
      //   });
      //   fetchChats();
      //   scrollToBottom();
      // });

      const resolveProfileImage = (profileImage: string | null | undefined): string => {
        if (!profileImage) return '/default-profile.png';
        if (profileImage.startsWith('http')) {
          const filename = profileImage.split('/').pop()?.split('?')[0];
          return `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${filename}`;
        }
        return `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${profileImage}`;
      };



      signalRService.onReceiveGroupMessage((message) => {
        if (selectedGroup && message.GroupId === selectedGroup.Id) {
          MarkAsReadForGroup(selectedGroup);
        }
        const createdDate = new Date(message.MessageDate || message.messageDate);
        if (isNaN(createdDate.getTime())) {
          createdDate.setTime(Date.now());
        }
        const formattedMessage = {
          Id: message.Id || message.id || uuidv4(),
          GroupId: message.GroupId || message.groupId,
          Message: message.Message || message.message,
          SenderId: message.SenderId || message.senderId,
          CreatedDate: createdDate,
          MessageDate: message.MessageDate || message.messageDate,
          TimeStatus: message.TimeStatus || GetMessageTime(createdDate),
          ProfileImage: resolveProfileImage(message.profileImage || message.ProfileImage),
          GroupChatDocument: message.ChatDocument || message.chatDocument || null,
          SenderName: message.SenderName || message.senderName || "Unknown",
          AssociateId: message.AssociateId || message.associateId || null,
          AssociateDetails: message.AssociateDetails || message.associateDetails || null
        };

        setMessages(prev => {
          const exists = prev.some(m => m.Id === formattedMessage.Id);
          return exists ? prev : [...prev, formattedMessage];
        });

        scrollToBottom();
      });

      return () => {
        if (senderId?.Id) {
          signalRService.stopConnection(senderId.Id);
        }
      };
    }
  }, [senderId?.Id]);

  useEffect(() => {
    if (selectedGroup?.type === 'group' && (!selectedGroup.GroupMember || selectedGroup.GroupMember.length === 0)) {
      refreshGroupData(selectedGroup.Id);
    }
  }, [selectedGroup]);


  const GetMessageTime = (createdDate: Date) => {
    if (!createdDate || isNaN(createdDate.getTime())) {
      return "Just now";
    }

    const now = new Date();
    const timeElapsed = now.getTime() - createdDate.getTime();

    // Convert to seconds/minutes/hours
    const seconds = Math.floor(timeElapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days === 1) return 'Yesterday';

    // For older dates, show actual date/time in local format
    return createdDate.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleManageChat = () => {
    setShowGroupProfile(!showGroupProfile); // Toggle the state
  };


  const fetchChats = async () => {
    try {
      const result = await chatApi.getActiveUserChatList(senderId.Id);
      setLoaderChat(false);
      setAllChats(
        result.userList.sort((a, b) =>
          new Date(b.LastMessageDate || b.CreatedDate || 0).getTime() -
          new Date(a.LastMessageDate || a.CreatedDate || 0).getTime()
        )
      );
      if (result.groupDetails) {
        const groupsWithLatestDates = result.groupDetails.map(group => {
          // Get all message dates from the group
          const messageDates = group.GroupMessage?.map(msg => new Date(msg.MessageDate)) || [];

          // Find the latest date
          const latestDate = messageDates.length > 0
            ? new Date(Math.max(...messageDates.map(date => date.getTime())))
            : null;

          return {
            ...group,
            latestMessageDate: latestDate
          };
        });

        setGroups(groupsWithLatestDates);
      }

      // Only update messages if no group is currently selected
      if (!selectedGroup) return;

      // Find and update the current group's messages if it exists in the new data
      const updatedGroup = result.groupDetails.find(g => g.Id === selectedGroup.Id);
      if (updatedGroup) {
        const mappedMessages = updatedGroup.GroupMessage.map(msg => {
          const sender = updatedGroup.GroupMember.find(member => member.UserId === msg.SenderId) ||
            { FullName: msg.Sender?.FirstName + ' ' + msg.Sender?.LastName };
          return {
            ...msg,
            SenderId: msg.SenderId,
            SenderName: sender?.FullName || msg.Sender?.FirstName + ' ' + msg.Sender?.LastName,
            ProfileImage: sender?.User.ProfileImage,
            CreatedDate: msg.MessageDate?.toString() || msg.CreatedDate?.toString(),
            Message: msg.Message,
            GroupChatDocument: msg.ChatDocument
          };
        });

        setMessages(mappedMessages);
        setGroupMembers(updatedGroup.GroupMember || []);
      }
    } catch (error) {
      setChats([]);
      setAllChats([]);
      setLoaderChat(false);
      console.error('Error fetching chats:', error);
    }
  };
  // Handle group selection
  // In handleGroupSelect function, modify the message mapping:
  const handleGroupSelect = async (group) => {
    fetchGroupAssets(group.Id);
    setSelectedGroup(group);
    setSelectedChat(null);
    setIsGroupSelected(true);

    try {
      setLoader(true); // Start loader

      // Join the SignalR group
      await signalRService.joinGroup(group.Id);

      // 🔄 Fetch fresh group data from backend
      const response = await chatApi.getGroupChatDetails(group.Id);

      const updatedGroup = response?.Result?.groupDetails;

      if (!updatedGroup) throw new Error("Group details not found");

      setGroupMembers(updatedGroup.GroupMember || []);

      const mappedMessages = updatedGroup.GroupMessage.map(msg => {
        const sender = updatedGroup.GroupMember.find(m => m.UserId === msg.SenderId) || {};
        return {
          ...msg,
          SenderId: msg.SenderId,
          SenderName: sender.FullName || `${msg.Sender?.FirstName ?? ''} ${msg.Sender?.LastName ?? ''}`,
          ProfileImage: sender?.User.ProfileImage,
          CreatedDate: new Date(msg.MessageDate).toISOString(),
          Message: msg.Message,
          GroupChatDocument: msg.ChatDocument
        };
      });
      setGroups(prevGroups =>
        prevGroups.map(g =>
          g.Id === group.Id ? { ...g, UnreadMessagesCount: 0 } : g
        )
      );
      MarkAsReadForGroup(group);
      setMessages(mappedMessages);
      setLoader(false);
      scrollToBottom();
    } catch (error) {
      console.error('Error selecting group:', error);
      toast.error('Failed to load group chat');
      setLoader(false);
    }
  };


  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredChats = allChats.filter((chat) =>
        chat.FullName.toLowerCase().includes(searchQuery.trim())
      );
      setChats([...filteredChats]);
    } else {
      setChats([...allChats]);
    }
  }, [allChats, searchQuery]);

  useEffect(() => {
    setLoaderChat(true);

    fetchChats();
  }, [profileData]);


  useEffect(() => {
    if (selectedChat) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedChat]);

  const fetchAssets = async () => {
    try {
      // First get the API data
      const result = await chatApi.getUserChatDetails(
        senderId.Id,
        selectedChat?.UserId
      );

      // Then process messages for links (similar to group chat)
      const messages = result?.Messages || [];

      const links = messages
        .filter(msg => msg.Message?.match(/\b(?:https?:\/\/|www\.)[^\s]+/gi))
        .map(linkMsg => {
          // Find either http/https link or www link
          const httpLink = linkMsg.Message.match(/https?:\/\/[^\s]+/)?.[0];
          const wwwLink = linkMsg.Message.match(/\bwww\.[^\s]+/gi)?.[0];

          return {
            Link: httpLink || (wwwLink ? `https://${wwwLink}` : null),
            Title: linkMsg.Message.slice(0, 30),
            CreatedDate: linkMsg.CreatedDate || linkMsg.MessageDate,
            Platform: 'Shared Link',
            Image: ''
          };
        })
        .filter(link => link.Link); // Filter out any null links

      // Combine API assets with extracted links
      setAssets({
        ...result,
        Links: [...(result.Links || []), ...links]
      });
    } catch (error) {
      setAssets(defaultAssets);
    }
  };
  const fetchGroupAssets = async (groupId) => {
    try {
      const result = await chatApi.getGroupChatDetails(groupId);
      const messages = result?.Result?.groupDetails?.GroupMessage || [];

      const links = messages
        .filter(msg => msg.Message?.match(/\b(?:https?:\/\/|www\.)[^\s]+/gi))
        .map(linkMsg => ({
          Link: linkMsg.Message.match(/https?:\/\/[^\s]+/)?.[0],
          Title: linkMsg.Message.slice(0, 30), // fallback title
          CreatedDate: linkMsg.CreatedDate || linkMsg.MessageDate,
          Platform: 'Shared Link',
          Image: '', // Optional, or use OpenGraph scraping for real preview
        }));

      const images = messages
        .filter(msg => msg.ChatDocument?.FileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        .map(img => ({
          Document: img.ChatDocument.Document,
          FileName: img.ChatDocument.FileName,
          CreatedDate: img.CreatedDate,
        }));

      const files = messages
        .filter(msg => msg.ChatDocument)
        .map(file => ({
          Document: file.ChatDocument.Document,
          FileName: file.ChatDocument.FileName,
          size: file.ChatDocument.size,
          CreatedDate: file.CreatedDate,
        }));

      setAssets({ Links: links, Images: images, Files: files });
    } catch (error) {
      console.error('Failed to fetch group assets:', error);
      setAssets({ Links: [], Images: [], Files: [] });
    }
  };

  const fetchMessages = async () => {
    try {
      const result = await chatApi.getUserChatData(
        senderId.Id,
        selectedChat?.UserId
      );
      setMessages(result);
      setLoader(false);

    } catch (error) {
      setMessages([]);
      setLoader(false);
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (chatDetails) {
      if (chatDetails.IsGroup) {
        chatApi.getGroupChatDetails(chatDetails.Id).then(response => {
          const fullGroup = response?.Result?.groupDetails;
          if (fullGroup) {
            handleGroupSelect({ ...fullGroup, Name: fullGroup.GroupName || fullGroup.Name });
          }
        }).catch(error => {
          console.error("Failed to fetch group details:", error);
        });
      }

      else {
        // Fall back to individual chat
        setSelectedChat(chatDetails);
      }

      // Clear after use
      setTimeout(() => {
        localStorage.removeItem('chatDetails');
      }, 2000);
    }
  }, []);


  useEffect(() => {
    setLoader(true);
    if (selectedChat) {
      fetchMessages();
      fetchAssets();
      MarkAsRead(selectedChat);
    }
  }, [selectedChat]);


  const MarkAsRead = (chat) => {
    (async () => {
      try {
        await chatApi.markAsReadMessage(senderId.Id, chat.UserId);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    })();
  };
  const MarkAsReadForGroup = (group) => {
    (async () => {
      try {
        await chatApi.markAsReadMessageFroGroup(group.Id, senderId.Id);
        setGroups(prevGroups =>
          prevGroups.map(g =>
            g.Id === group.Id
              ? { ...g, UnreadMessagesCount: 0 }
              : g
          )
        );
        if (selectedGroup?.Id === group.Id) {
          setSelectedGroup(prev => ({ ...prev, UnreadMessagesCount: 0 }));
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    })();
  };


  const refreshGroupData = async (groupId: string) => {
    try {
      const response = await chatApi.getGroupChatDetails(groupId);
      const updatedGroup = response?.Result?.groupDetails;

      if (updatedGroup) {
        setSelectedGroup(updatedGroup);
        setGroupMembers(updatedGroup.GroupMember || []);

        // Optionally also refresh messages:
        const mappedMessages = updatedGroup.GroupMessage.map(msg => {
          const sender = updatedGroup.GroupMember.find(m => m.UserId === msg.SenderId) || {};
          return {
            ...msg,
            SenderId: msg.SenderId,
            SenderName: sender.FullName || `${msg.Sender?.FirstName ?? ''} ${msg.Sender?.LastName ?? ''}`,
            ProfileImage: sender?.User.ProfileImage,
            CreatedDate: new Date(msg.MessageDate).toISOString(),
            Message: msg.Message,
            GroupChatDocument: msg.ChatDocument
          };
        });
        setMessages(
          mappedMessages.sort((a, b) => new Date(a.CreatedDate ?? 0).getTime() - new Date(b.CreatedDate ?? 0).getTime())
        );
      }
    } catch (error) {
      console.error('Error refreshing group data:', error);
    }
  };


  const handleChatSelect = async (chatOrGroup) => {
    setShowGroupProfile(false);

    if (chatOrGroup.CreatedBy) {
      setLoader(true);
      try {
        await handleGroupSelect(chatOrGroup);
        fetchChats();
        fetchAssets();
      } catch (error) {
        console.error('Error selecting group:', error);
        toast.error('Failed to load group chat');
      } finally {
        setLoader(false);
      }
    } else {
      setSelectedChat(chatOrGroup);
      setSelectedGroup(null);
      setIsGroupSelected(false);
      if (isMobile) {
        setIsChatSelected(true);
      }
      // Mark messages as read
      await MarkAsRead(chatOrGroup);

      // Update the unread count in the chats list\

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.UserId === chatOrGroup.UserId
            ? { ...chat, UnReadCount: 0 }
            : chat
        )
      );
    }
  };

  const handleSendGroupMessage = async () => {

    if (newMessage.trim() || attachment) {
      try {
        const messageData = {
          Message: newMessage.trim(),
          SenderId: senderId.Id,
          GroupChatId: selectedGroup.Id,
          AssociateId: (currentUser != null && currentUser?.AssociateId != null && currentUser?.AssociateId > 0) ? currentUser?.AssociateId : null,
          ChatDocument: attachmentUrl
            ? {
              // Extract just the filename from the URL (before any query parameters)
              Document: attachmentUrl.split('/').pop().split('?')[0],
              FileName: file.name,
              Size: file.size.toString(),
            }
            : undefined,
        };
        const result = await chatApi.saveGroupMessage(messageData);
        await refreshGroupData(selectedGroup.Id);
        fetchGroupAssets(selectedGroup.Id);
        setNewMessage('');
        setAttachment(null);
        setAttachmentUrl('');
        setAttachmentName('');
        setFile(null);
        setFileUploadingProgress(0);
        await MarkAsReadForGroup(selectedGroup);
        setTimeout(() => scrollToBottom(), 100);
      } catch (error) {
        console.error('Error sending group message:', error);
        toast.error('Failed to send message');
      }
    }
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
    e.target.value = null;
  };

  const generateUploadFileSasTokenfunc = useCallback(async () => {
    try {
      const tokenResponse = await generateUploadFileSasTokenDataForChat();
      setSasToken(tokenResponse.token);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    generateUploadFileSasTokenfunc();
  }, [generateUploadFileSasTokenfunc]);

  const handleFileUpload = async (files) => {
    if (!files[0]) return;

    const file = files[0];
    setFile(file);
    const fileExtension = file.name.split('.').pop();
    const randomName = `${uuidv4()}.${fileExtension}`;
    const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/chat-documents/${randomName}?${sasToken}`;
    const config = {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        if (total) {
          const progress = Math.round((loaded / total) * 100);
          setFileUploadingProgress(progress);
        }
      },
    };

    try {
      setLoaderImage(true);
      setFileUploadingProgress(0);
      const res = await axios.put(blobUrl, file, config);
      if (res.status === 201) {
        const url = res?.config?.url;
        const fileName = url.split('/').pop().split('?')[0];
        setAttachmentUrl(url);
        setAttachment(file);
        setAttachmentName(fileName);
        setLoaderImage(false);
        setFileUploadingProgress(100);
      }
    } catch (error) {
      setLoaderImage(false);
      setAttachment(null);
      setAttachmentUrl('');
      setAttachmentName('');
      setFile(null);
      setFileUploadingProgress(0);
      toast.error('Error uploading file to Azure Blob Storage');
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() || attachment) {
      const messageData = {
        Sender_UserId: senderId.Id,
        Receiver_UserId: selectedChat?.UserId,
        IsRead: senderId.Id == selectedChat?.UserId,
        Message: newMessage,
        AssociateId: (currentUser != null && currentUser?.AssociateId != null && currentUser?.AssociateId > 0) ? currentUser?.AssociateId : null,
        ChatDocument: attachmentUrl
          ? {
            Document: attachmentName,
            FileName: file.name,
            size: file.size,
          }
          : undefined,
      };
      try {
        const result = await chatApi.saveMessage(messageData);
        setMessages([
          ...messages,
          {
            ...result,
            CreatedDate: moment().utc().toISOString(),
          },
        ]);

        // Refresh chat assets after sending message
        fetchAssets();

        setFileUploadingProgress(0);
        fetchChats();
        setNewMessage('');
        setAttachment(null);
        setAttachmentUrl('');
        setAttachmentName('');
        setFile(null);
        setFileUploadingProgress(0);

        const timeoutId = setTimeout(() => {
          scrollToBottom();
        }, 100);

        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (loaderImage) {
        toast.info('Wait until the image is uploaded');
      } else {
        if (selectedGroup) {
          handleSendGroupMessage(); // Call group message handler if a group is selected
        } else {
          handleSendMessage(); // Call individual message handler otherwise
        }
      }
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentUrl('');
    setAttachmentName('');
    setFile(null);
    setFileUploadingProgress(0);
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const result = await chatApi.searchUserByNameList(query);
        // Filter out the current user from the results
        const filteredResults = result.filter(user => user.UserId !== senderId.Id);
        setUserList(filteredResults);
      } catch (error) {
        console.error('Error searching users:', error);
        setUserList([]);
      }
    } else {
      setUserList([]);
    }
  };

  const renderChatInterface = () => {
    return (
      <ChatInterface
        selectedChat={selectedChat}
        isMobile={isMobile}
        loader={loader}
        setIsChatSelected={(value) =>
          setSelectedChat(value ? selectedChat : null)
        }
        messages={messages}
        newMessage={newMessage}
        handleMessageChange={handleMessageChange}
        file={file}
        loaderImage={loaderImage}
        handleRemoveAttachment={handleRemoveAttachment}
        handleAttachmentChange={handleAttachmentChange}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
        handleChatProfileOpenForMobile={handleChatProfileOpenForMobile}
        fileUploadingProgress={fileUploadingProgress}
        handleEmojiSelector={handleEmojiSelector}
        scrollToBottom={scrollToBottom}
        isLoading={loaderChat}
      />
    );
  };

  const renderChatProfile = () => {
    return (
      <ChatProfile
        loader={loader}
        isMobile={isMobile}
        selectedChat={selectedChat}
        setIsChatSelected={(value) =>
          setSelectedChat(value ? selectedChat : null)
        }
        handleChatProfileOpenForMobile={handleChatProfileOpenForMobile}
        assets={assets}
      />
    );
  };

  return (
    <>
      <div className="lg:hidden overflow-hidden flex items-center justify-center p-4 !pb-0">
        <Hamburger className="hidden" />
        <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
          Chats
        </p>
      </div>
      <div className="w-full flex flex-row h-[calc(100vh-40px)] lg:h-[100vh]  overflow-hidden gap-6 md:p-6  relative">
        {(
          <>
            <ChatList
              isMobile={isMobile}
              selectedChat={selectedChat || selectedGroup}
              chats={chats}
              groups={groups}
              searchQuery={searchQuery}
              userList={userList}
              selectedView={selectedView}
              setSelectedView={setSelectedView}
              handleSearch={handleSearch}
              handleChatSelect={handleChatSelect}
              currentUserId={senderId?.Id}
              MarkAsRead={MarkAsRead}
              fetchChats={fetchChats}
              setSearchQuery={setSearchQuery}        
              setUserList={setUserList}
              isLoading={loaderChat}
            />

            {isMobile ? (
              !isChatProfileOpen && !isGroupProfileOpen ? (
                selectedGroup ? (
                  <GroupChatInterface
                    selectedGroup={selectedGroup}
                    isMobile={isMobile}
                    loader={loader}
                    setIsGroupSelected={setIsGroupSelected}
                    messages={messages}
                    newMessage={newMessage}
                    handleMessageChange={handleMessageChange}
                    file={file}
                    loaderImage={loaderImage}
                    handleRemoveAttachment={handleRemoveAttachment}
                    handleAttachmentChange={handleAttachmentChange}
                    handleSendGroupMessage={handleSendGroupMessage}
                    handleKeyPress={handleKeyPress}
                    handleGroupProfileOpenForMobile={handleGroupProfileOpenForMobile}
                    fileUploadingProgress={fileUploadingProgress}
                    handleEmojiSelector={handleEmojiSelector}
                    scrollToBottom={scrollToBottom}
                    groupMembers={groupMembers}
                    senderId={senderId}
                    handleManageChat={handleManageChat}
                    setMessages={setMessages}
                    setSelectedGroup={setSelectedGroup}
                    setShowGroupProfile={setShowGroupProfile}
                    refreshGroupData={refreshGroupData}
                    fetchchats={fetchChats}
                  />
                ) : selectedChat ? (
                  renderChatInterface()
                ) : null
              ) : (
                selectedGroup && showGroupProfile ? (
                  <GroupProfile
                    loader={loader}
                    isMobile={isMobile}
                    selectedGroup={selectedGroup}
                    setIsGroupSelected={setIsGroupSelected}
                    handleGroupProfileOpenForMobile={handleGroupProfileOpenForMobile}
                    assets={assets}
                    groupMembers={groupMembers}
                    refreshGroupData={refreshGroupData}
                  />
                ) : selectedChat ? (
                  renderChatProfile()
                ) :  null
              )
            ) : (
              <>
               {selectedGroup ? (
                  <>
                    <GroupChatInterface
                      selectedGroup={selectedGroup}
                      isMobile={isMobile}
                      loader={loader}
                      setIsGroupSelected={setIsGroupSelected}
                      messages={messages}
                      newMessage={newMessage}
                      handleMessageChange={handleMessageChange}
                      file={file}
                      loaderImage={loaderImage}
                      handleRemoveAttachment={handleRemoveAttachment}
                      handleAttachmentChange={handleAttachmentChange}
                      handleSendGroupMessage={handleSendGroupMessage} // Make sure this is correct
                      handleKeyPress={handleKeyPress}
                      handleGroupProfileOpenForMobile={handleGroupProfileOpenForMobile}
                      fileUploadingProgress={fileUploadingProgress}
                      handleEmojiSelector={handleEmojiSelector}
                      scrollToBottom={scrollToBottom}
                      groupMembers={groupMembers}
                      senderId={senderId}
                      handleManageChat={handleManageChat}
                      setMessages={setMessages}
                      setSelectedGroup={setSelectedGroup}
                      setShowGroupProfile={setShowGroupProfile}
                      refreshGroupData={refreshGroupData}
                      fetchchats={fetchChats}
                    />
                    {showGroupProfile && (
                      <GroupProfile
                        loader={loader}
                        isMobile={isMobile}
                        selectedGroup={selectedGroup}
                        setIsGroupSelected={setIsGroupSelected}
                        handleGroupProfileOpenForMobile={handleGroupProfileOpenForMobile}
                        assets={assets}
                        groupMembers={groupMembers}
                        refreshGroupData={refreshGroupData}
                      />
                    )}
                  </>
                ) : selectedChat ? (
                  <>
                    {renderChatInterface()}
                    {renderChatProfile()}
                  </>
                ) : (
                  <>
                    {renderChatInterface()}
                    {renderChatProfile()}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Chats;