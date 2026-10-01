import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import CommunityMembersModal from '../../communities/components/community-members-modal';
import LeaveGroupModal from '../../communities/components/leave-group-modal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface Community {
  id: string;
  name: string;
  avatar: string;
  lastSender: string;
  lastMessage: string;
  time: string;
  isVerified: boolean;
  members?: any[]; // added to hold API members
}

const mockMembers: { id: string; name: string; avatar: string; isVerified: boolean, location: string, country: string, role: string, online: boolean }[] = [
  {
    id: '1',
    name: 'Leslie Alexander',
    avatar: 'https://placehold.co/800@2x.png',
    isVerified: false,
    location: 'Atlanta, GA',
    country: 'US',
    role: 'Professional',
    online: true
  },
  {
    id: '2',
    name: 'Guy Hawkins',
    avatar: 'https://placehold.co/800@2x.png',
    isVerified: true,
    location: 'Los Angeles, CA',
    country: 'US',
    role: 'Partner',
    online: true
  },
  {
    id: '3',
    name: 'Dianne Russell',
    avatar: 'https://placehold.co/800@2x.png',
    isVerified: true,
    location: 'New York, NY',
    country: 'US',
    role: 'Advocate',
    online: true
  },
  {
    id: '4',
    name: 'Floyd Miles',
    avatar: 'https://placehold.co/800@2x.png',
    isVerified: true,
    location: 'Chicago, IL',
    country: 'US',
    role: 'Partner',
    online: true
  },
  {
    id: '5',
    name: 'Robert Fox',
    avatar: 'https://placehold.co/800@2x.png',
    isVerified: true,
    location: 'Los Angeles, CA',
    country: 'US',
    role: 'Advocate',
    online: true
  },
  {
    id: '6',
    name: 'Devon Lane',
    avatar: 'https://placehold.co/800@2x.png',
    isVerified: true,
    location: 'San Francisco, CA',
    country: 'US',
    role: 'Partner',
    online: false
  },
];

interface CommunityListProps {
  onCommunitySelect?: (community: Community) => void;
  onViewMembers?: (community: Community) => void;
  onLeaveGroup?: (community: Community) => void;
  onOpenChat?: (user: any) => void;
  isMobile?: boolean;
  selectedCommunity?: Community | null;
}

const CommunityList: React.FC<CommunityListProps> = ({ onCommunitySelect, onViewMembers, onLeaveGroup, onOpenChat}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedCommunityMembers, setSelectedCommunityMembers] = useState<any[] | null>(null);
  const [selectedCommunityName, setSelectedCommunityName] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [communityToLeave, setCommunityToLeave] = useState<Community | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]); // replaces mockCommunities usage
  const [loading, setLoading] = useState(false);

  // get user id from redux (adjust selector path to your store)
  const userId = useSelector((state: any) => state.user?.currentUser?.UserId || state.auth?.user?.id || '');

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!rootRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  // Fetch user communities from API
  useEffect(() => {
    let cancelled = false;
    async function fetchCommunities() {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_APP_BASE_URL;
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        const fullUrl = `${base}/api/Chat/GetUserCommunities`;

        const res = await axios.get(fullUrl, {
          params: { userId },
          headers: {
            'Content-Type': 'application/json',
            'XApiKey': apiKey,
              // For ngrok compatibility
          },
          timeout: 30000 // 30 second timeout
        });

        const result = res?.data?.Result || [];

        

        const mapped: Community[] = result.map((c: any) => {
          return {
            id: c.Id,
            name: c.Name,
            avatar: c.ProfilePhotoUrl || 'https://placehold.co/600x400/000000/FFFFFF.png',
            lastSender: c.Members && c.Members.length ? c.Members[0].UserName : '',
            lastMessage: c.Description || '',
            time: c.CreatedAt ? new Date(c.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            isVerified: false,
            members: c.Members || []
          };
        });

        

        if (!cancelled) {
          setLoading(false);
          setCommunities(mapped);
        }

      } catch (err: any) {
        setLoading(false);
      }
    }

    fetchCommunities();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const filteredCommunities = (searchQuery ? communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastSender.toLowerCase().includes(searchQuery.toLowerCase())
  ) : communities);

  const handleLeaveCommunity = async (community: Community) => {
    if (!community?.id || !userId) return;
    try {
      const base = process.env.NEXT_PUBLIC_APP_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      await axios.delete(
        `${base}/api/Chat/RemoveCommunityMember`,
        {
          headers: {
            'Content-Type': 'application/json',
            'XApiKey': apiKey,
             
          },
          data: {
            CommunityId: community.id,
            UserId: userId
          }
        }
      );
      // Remove the community from the local list after successful leave
      setCommunities(prev => prev.filter(c => c.id !== community.id));
      toast.success(`You have left the community "${community.name}"`);
    } catch (err) {
      console.error('Failed to leave community', err);
    }
  };

  return (
    <div className={`h-full flex flex-col w-full `} ref={rootRef}>      {/* Header */}
      <div className="pt-4 pb-2 px-4">
        {/* Search */}
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search your communities"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Communities List */}
      <div className="flex overflow-y-auto">
        <div className="w-full">
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="text-base font-semibold text-gray-800">Your Communities</h3>
          </div>

          <div className="space-y-2">
            {loading ? (
              // Loading skeleton
              <div className="space-y-2 px-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3 py-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : communities.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-20">
                  <svg width="64" height="65" viewBox="0 0 64 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1831_220800)">
                      <path d="M60 17.8359V21.8359C60 23.604 59.2976 25.2997 58.0474 26.55C56.7971 27.8002 55.1014 28.5026 53.3333 28.5026H52V20.5026H12V28.5026H10.6667C8.89856 28.5026 7.20286 27.8002 5.95262 26.55C4.70238 25.2997 4 23.604 4 21.8359V17.8359C4 14.1559 6.98667 11.1693 10.6667 11.1693H12.0933C12.7467 5.84927 17.2933 1.83594 22.6667 1.83594C26.68 1.83594 30.1733 4.0626 32 7.3426C33.8267 4.0626 37.32 1.83594 41.3333 1.83594C43.9332 1.83832 46.443 2.789 48.392 4.50972C50.341 6.23045 51.5954 8.60303 51.92 11.1826L53.3333 11.1693C57.0133 11.1693 60 14.1559 60 17.8359Z" fill="#85A9F6" fill-opacity="0.3" />
                      <path d="M12.001 18.8359H52.001C52.9152 18.8361 53.667 19.5886 53.667 20.5029V32.5029C53.6669 33.1178 53.3459 33.6627 52.8203 33.9541L52.7129 34.0088C52.4755 34.119 52.233 34.1689 51.9873 34.1689C51.6109 34.1689 51.2413 34.0445 50.9365 33.7891L50.9355 33.7881L46.8818 30.4023L46.6035 30.1689H36L35.7002 30.5449L33.3027 33.541C33.0109 33.9017 32.5407 34.1161 32.001 34.1162C31.5417 34.1162 31.1121 33.9527 30.8066 33.6592L30.6836 33.5254L28.3008 30.5566L28.001 30.1836L27.5225 30.1826L17.7617 30.1689H17.3984L17.1191 30.4023L13.0664 33.7881C12.5698 34.2015 11.8918 34.2889 11.2891 34.0088L11.1816 33.9551C10.9414 33.8224 10.7377 33.6311 10.5898 33.3984C10.421 33.1326 10.3322 32.8237 10.334 32.5088V20.5029C10.334 19.5885 11.0866 18.8359 12.001 18.8359Z" fill="#F6F9FF" stroke="#85A9F6" stroke-width="2" />
                      <path d="M13.3333 48.5026C16.2789 48.5026 18.6667 46.1148 18.6667 43.1693C18.6667 40.2238 16.2789 37.8359 13.3333 37.8359C10.3878 37.8359 8 40.2238 8 43.1693C8 46.1148 10.3878 48.5026 13.3333 48.5026Z" fill="#85A9F6" fill-opacity="0.3" />
                      <path d="M17.334 51.1641H9.33398C7.12865 51.1641 5.33398 52.9587 5.33398 55.1641V60.4974C5.33398 61.9681 6.52998 63.1641 8.00065 63.1641H18.6673C20.138 63.1641 21.334 61.9681 21.334 60.4974V55.1641C21.334 52.9587 19.5393 51.1641 17.334 51.1641Z" fill="#85A9F6" fill-opacity="0.3" />
                      <path d="M31.9993 48.5026C34.9449 48.5026 37.3327 46.1148 37.3327 43.1693C37.3327 40.2238 34.9449 37.8359 31.9993 37.8359C29.0538 37.8359 26.666 40.2238 26.666 43.1693C26.666 46.1148 29.0538 48.5026 31.9993 48.5026Z" fill="#2357C6" />
                      <path d="M40 55.1641V60.4974C40 61.9641 38.8 63.1641 37.3333 63.1641H26.6667C25.2 63.1641 24 61.9641 24 60.4974V55.1641C24 52.9641 25.8 51.1641 28 51.1641H36C38.2 51.1641 40 52.9641 40 55.1641Z" fill="#2357C6" />
                      <path d="M50.6673 48.5026C53.6128 48.5026 56.0007 46.1148 56.0007 43.1693C56.0007 40.2238 53.6128 37.8359 50.6673 37.8359C47.7218 37.8359 45.334 40.2238 45.334 43.1693C45.334 46.1148 47.7218 48.5026 50.6673 48.5026Z" fill="#F6F9FF" />
                      <path d="M58.666 55.1641V60.4974C58.666 61.9641 57.466 63.1641 55.9993 63.1641H45.3327C43.866 63.1641 42.666 61.9641 42.666 60.4974V55.1641C42.666 52.9641 44.466 51.1641 46.666 51.1641H54.666C56.866 51.1641 58.666 52.9641 58.666 55.1641Z" fill="#F6F9FF" />
                      <path d="M31.9993 25.8341C31.6527 25.8341 31.306 25.6874 31.0527 25.4474C30.8127 25.1941 30.666 24.8474 30.666 24.5007C30.666 24.1541 30.8127 23.8074 31.0527 23.5541C31.3727 23.2474 31.826 23.1141 32.266 23.1941C32.346 23.2074 32.426 23.2341 32.506 23.2741C32.586 23.3007 32.666 23.3407 32.746 23.3941L32.946 23.5541C33.186 23.8074 33.3327 24.1541 33.3327 24.5007C33.3327 24.6741 33.306 24.8474 33.226 25.0074C33.1593 25.1807 33.066 25.3141 32.946 25.4474C32.8793 25.5007 32.8127 25.5674 32.746 25.6074C32.666 25.6607 32.586 25.7007 32.506 25.7274C32.426 25.7674 32.346 25.7941 32.266 25.8074C32.1727 25.8207 32.0793 25.8341 31.9993 25.8341ZM26.666 25.8341C26.3193 25.8341 25.9727 25.6874 25.7194 25.4474C25.5994 25.3141 25.506 25.1807 25.4393 25.0074C25.3709 24.8471 25.3346 24.675 25.3327 24.5007C25.3327 24.1407 25.4794 23.8074 25.7194 23.5541C26.0927 23.1807 26.6793 23.0607 27.1727 23.2741C27.3327 23.3407 27.4793 23.4341 27.6127 23.5541C27.8527 23.8074 27.9993 24.1541 27.9993 24.5007C27.9993 24.8474 27.8527 25.1941 27.6127 25.4474C27.3593 25.6874 27.0127 25.8341 26.666 25.8341ZM21.3327 25.8341C21.1593 25.8341 20.986 25.8074 20.826 25.7274C20.6527 25.6607 20.5193 25.5674 20.386 25.4474L20.226 25.2474C20.1755 25.1731 20.1352 25.0924 20.106 25.0074C20.0675 24.9318 20.0405 24.8509 20.026 24.7674C20.0127 24.6741 19.9993 24.5807 19.9993 24.5007C19.9993 24.3274 20.0393 24.1541 20.106 23.9941C20.1727 23.8341 20.266 23.6874 20.386 23.5541C20.5193 23.4341 20.6527 23.3407 20.826 23.2741C21.1506 23.1407 21.5147 23.1407 21.8393 23.2741C22.0127 23.3407 22.1593 23.4341 22.2793 23.5541C22.5193 23.8074 22.666 24.1541 22.666 24.5007C22.666 24.5807 22.6527 24.6741 22.6393 24.7674C22.626 24.8474 22.5993 24.9274 22.5593 25.0074C22.5327 25.0874 22.4927 25.1674 22.4393 25.2474C22.3993 25.3141 22.3327 25.3807 22.2793 25.4474C22.026 25.6874 21.6793 25.8341 21.3327 25.8341ZM15.9993 25.8341C15.6527 25.8341 15.306 25.6874 15.0527 25.4474L14.8927 25.2474C14.8422 25.1731 14.8018 25.0924 14.7727 25.0074C14.7342 24.9318 14.7072 24.8509 14.6927 24.7674C14.6793 24.6741 14.666 24.5807 14.666 24.5007C14.666 24.3274 14.706 24.1541 14.7727 23.9941C14.8393 23.8341 14.9327 23.6874 15.0527 23.5541C15.186 23.4341 15.3193 23.3407 15.4927 23.2741C15.8173 23.1407 16.1814 23.1407 16.506 23.2741C16.6793 23.3407 16.826 23.4341 16.946 23.5541C17.186 23.8074 17.3327 24.1541 17.3327 24.5007C17.3327 24.5807 17.3193 24.6741 17.306 24.7674C17.2927 24.8474 17.266 24.9274 17.226 25.0074C17.1993 25.0874 17.1593 25.1674 17.106 25.2474C17.066 25.3141 16.9993 25.3807 16.946 25.4474C16.6927 25.6874 16.346 25.8341 15.9993 25.8341ZM47.9994 25.8341C47.6527 25.8341 47.3047 25.6874 47.0527 25.4474C46.8114 25.1941 46.666 24.8607 46.666 24.5007C46.666 24.1541 46.8114 23.8074 47.0527 23.5541C47.546 23.0607 48.4394 23.0607 48.946 23.5541C49.186 23.8074 49.3327 24.1541 49.3327 24.5007C49.3327 24.8607 49.186 25.1941 48.946 25.4474C48.6927 25.6874 48.346 25.8341 47.9994 25.8341ZM42.666 25.8341C42.3193 25.8341 41.9714 25.6874 41.7194 25.4474C41.478 25.1941 41.3327 24.8474 41.3327 24.5007C41.3327 24.1541 41.478 23.8074 41.7194 23.5541C42.0247 23.2474 42.4927 23.1007 42.9327 23.1941C43.0127 23.2074 43.0914 23.2341 43.1727 23.2741C43.2527 23.3007 43.3327 23.3407 43.4127 23.3941C43.4794 23.4341 43.5473 23.5007 43.6127 23.5541C43.7327 23.6874 43.826 23.8207 43.8927 23.9941C43.9593 24.1541 43.9993 24.3274 43.9993 24.5007C43.9993 24.8607 43.8527 25.1941 43.6127 25.4474C43.3593 25.6874 43.0127 25.8341 42.666 25.8341ZM37.3327 25.8341C37.2514 25.8341 37.1593 25.8207 37.066 25.8074C36.9825 25.7929 36.9016 25.7659 36.826 25.7274C36.7406 25.6983 36.6594 25.6579 36.5847 25.6074C36.518 25.5674 36.4514 25.5007 36.386 25.4474C36.266 25.3141 36.1727 25.1807 36.106 25.0074C36.0375 24.8471 36.0013 24.675 35.9993 24.5007C35.9993 24.3274 36.0393 24.1541 36.106 23.9941C36.1727 23.8207 36.266 23.6874 36.386 23.5541C36.4527 23.5007 36.5193 23.4341 36.5847 23.3941C36.666 23.3407 36.7447 23.3007 36.826 23.2741C36.906 23.2341 36.986 23.2074 37.066 23.1941C37.2393 23.1541 37.4127 23.1541 37.586 23.1941C37.6793 23.2074 37.7593 23.2341 37.8393 23.2741C37.9193 23.3007 37.9993 23.3407 38.0793 23.3941C38.146 23.4341 38.214 23.5007 38.2793 23.5541C38.3993 23.6874 38.4927 23.8207 38.5593 23.9941C38.626 24.1541 38.666 24.3274 38.666 24.5007C38.666 24.6741 38.626 24.8474 38.5593 25.0074C38.4927 25.1807 38.3993 25.3141 38.2793 25.4474C38.2127 25.5007 38.1447 25.5674 38.0793 25.6074C37.9993 25.6607 37.9193 25.7007 37.8393 25.7274C37.7598 25.7677 37.6743 25.7947 37.586 25.8074C37.506 25.8207 37.4127 25.8341 37.3327 25.8341Z" fill="#85A9F6" fill-opacity="0.3" />
                      <path opacity="0.1" d="M32 48.5026V37.8359C34.9467 37.8359 37.3333 40.2226 37.3333 43.1693C37.3333 46.1159 34.9467 48.5026 32 48.5026ZM40 55.1693V60.5026C40 61.9693 38.8 63.1693 37.3333 63.1693H32V51.1693H36C38.2 51.1693 40 52.9693 40 55.1693Z" fill="#2357C6" />
                      <path d="M50.6673 48.5026C53.6128 48.5026 56.0007 46.1148 56.0007 43.1693C56.0007 40.2238 53.6128 37.8359 50.6673 37.8359C47.7218 37.8359 45.334 40.2238 45.334 43.1693C45.334 46.1148 47.7218 48.5026 50.6673 48.5026Z" fill="#85A9F6" fill-opacity="0.3" />
                      <path d="M58.6667 55.1693V60.5026C58.6667 61.9693 57.4667 63.1693 56 63.1693H45.3333C43.8667 63.1693 42.6667 61.9693 42.6667 60.5026V55.1693C42.6667 52.9693 44.4667 51.1693 46.6667 51.1693H54.6667C56.8667 51.1693 58.6667 52.9693 58.6667 55.1693ZM60 17.8359V21.8359C60.0003 23.3728 59.4696 24.8626 58.4977 26.0531C57.5259 27.2437 56.1725 28.0619 54.6667 28.3693V32.5026C54.6667 33.5426 54.08 34.4759 53.1333 34.9159C52.76 35.0893 52.3733 35.1693 51.9867 35.1693C51.3867 35.1693 50.7867 34.9693 50.2933 34.5559L46.24 31.1693H36.48L34.08 34.1693C33.5733 34.7959 32.8 35.1159 32 35.1159V7.3426C33.8267 4.0626 37.32 1.83594 41.3333 1.83594C43.9332 1.83832 46.443 2.789 48.392 4.50973C50.341 6.23045 51.5954 8.60304 51.92 11.1826L53.3333 11.1693C57.0133 11.1693 60 14.1559 60 17.8359Z" fill="#85A9F6" fill-opacity="0.2" />
                      <path d="M57 4V7.5" stroke="#2357C6" stroke-width="1.16667" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M55.25 5.75H58.75" stroke="#2357C6" stroke-width="1.16667" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3 50V53.5" stroke="#2357C6" stroke-width="1.16667" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M1.25 51.75H4.75" stroke="#2357C6" stroke-width="1.16667" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1831_220800">
                        <rect width="64" height="64" fill="white" transform="translate(0 0.5)" />
                      </clipPath>
                    </defs>
                  </svg>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">No Community Yet</h2>
                <p className="text-base text-gray-400 mb-6 text-center max-w-xs">
                  Set the tone for what matters. Create a space where others can connect, share, and grow.
                </p>
                <button
                    className="px-4 py-2 border border-[#85A9F6] rounded-lg bg-[#F6F9FF] text-[#2357C6] font-meduim shadow hover:bg-[#85A9F6] transition"
                  onClick={() => {/* open create community modal here */ }}
                >
                  Create New Community
                </button>
              </div>
            ) : (
              // Communities list
              filteredCommunities.map((community) => (
                <button
                  key={community.id}
                  onClick={() => onCommunitySelect?.(community)}
                  className="w-full hover:bg-[#F0F4FF] transition-colors text-left"
                >
                  <div className="flex items-start space-x-3 px-4 py-2">
                    {/* Avatar */}
                    <div className={`w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center`}>
                      <Image
                        src={community.avatar}
                        alt={community.name}
                        width={120}
                        height={120}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1">
                          <h4 className="font-semibold capitalize text-base text-gray-800 truncate">{community.name}</h4>
                        </div>

                        {/* three-dots + dropdown wrapper */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId((id) => (id === community.id ? null : community.id));
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                            aria-label="Open community menu"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <circle cx="4" cy="10" r="2" />
                              <circle cx="10" cy="10" r="2" />
                              <circle cx="16" cy="10" r="2" />
                            </svg>
                          </button>

                          {openMenuId === community.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-md shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1)] z-50"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                          // open modal locally in CommunityList
                          // if community has members, use them; otherwise use placeholder
                                  // if (community && (community as any).members) {
                                    // setSelectedCommunityMembers(community.members);
                                  // } else {
                                  setSelectedCommunityMembers(community?.members?.length ? community.members : []);
                                  // }
                                  setSelectedCommunityName(community.name);
                                  setShowMembersModal(true);
                                  // still call parent callback if provided
                                  if (onViewMembers) onViewMembers(community);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                              >
                                View Members
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  // open leave confirmation modal
                                  setCommunityToLeave(community);
                                  setShowLeaveModal(true);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                              >
                                Leave group
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between space-x-1 mb-1">
                        <div className='flex gap-2'>
                          <span className="text-sm font-semibold text-gray-800">{community.lastSender}</span>
                          {community.isVerified && (
                            <Image
                              src="/chat/verified.svg"
                              alt="Verified"
                              width={20}
                              height={20}
                            />
                          )}
                        </div>

                        <span className="text-sm text-[#5B657B]">{community.time}</span>
                      </div>

                      <p className="text-xs text-[#5B657B] line-clamp-2">{community.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Members modal rendered inside CommunityList */}
      <CommunityMembersModal
        isOpen={showMembersModal}
        onClose={() => {
          setShowMembersModal(false);
          setSelectedCommunityMembers(null);
          setSelectedCommunityName(null);
        }}
        members={selectedCommunityMembers || []}
        onChat={(member) => {
          // open direct chat with member if provided
          if (onOpenChat) {
            onOpenChat(member);
          } else if (onCommunitySelect) {
            onCommunitySelect(member as any);
          } 
          setShowMembersModal(false);
          setSelectedCommunityMembers(null);
        }}
      />

      <LeaveGroupModal
        isOpen={showLeaveModal}
        onClose={() => {
          setShowLeaveModal(false);
          setCommunityToLeave(null);
        }}
        communityName={communityToLeave?.name || null}
        onConfirm={() => {
          if (communityToLeave) {
            handleLeaveCommunity(communityToLeave); // <-- call API here
            if (onLeaveGroup) onLeaveGroup(communityToLeave);
          }
        }}
      />

    </div>
  );
};

export default CommunityList;
