'use client';
import React, { useEffect, useState } from 'react';
import CommunityChat from "./components/community-chat";
import CommunitiesList from "./components/communties-list";
import CommunityProfile from './components/community-profile';
import { useSelector } from 'react-redux';
import TrendingCommunities from '../chats/components/trending-communities';
import { signalRService } from '../chats/components/signalRService';
import { User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { communityApi } from '@/app/api/dashboard/community';
import router from 'next/router';

const Community: React.FC = () => {
  const [selectedCommunity, setSelectedCommunity] = useState<any | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<'trending' | 'your-communities'>('trending'); // New state for mobile view
  const [isCheckingCommunity, setIsCheckingCommunity] = useState<boolean>(false); // New loading state
  const userId = useSelector((state: any) => state.user?.currentUser?.UserId || state.auth?.user?.id || '');
  
  const userData = useSelector((state: any) => state.user?.currentUser || state.auth?.user || {});

  const searchParams = useSearchParams();
  const communityId = searchParams.get("id");
  const [refreshTrigger, setRefreshTrigger] = useState(0); // New state for triggering refreshes

  useEffect(() => {
    async function handleCommunityId() {
      if (communityId && userId) {
        
        setIsCheckingCommunity(true); // Start loading
        
        // Add a small delay to ensure loading state is visible
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          const isJoined = await communityApi.isCommunityJoined(communityId, userId);
          
          if (isJoined.success && isJoined.data && isJoined.data.IsMember === true) {
            // User is joined - get community details and show the community
            
            const communityDetails = await communityApi.getCommunityDetails(communityId);
            
            
            // Map the API response to the expected format for CommunityChat
            const mappedCommunity = {
              id: communityDetails.data?.Id || communityId,
              name: communityDetails.data?.Name || 'Community',
              description: communityDetails.data?.Description || '',
              avatar: communityDetails.data?.ProfilePhotoUrl || null,
              lastMessage: communityDetails.data?.LastMessage || '',
              ...communityDetails.data // Include all other properties
            };
            
            setSelectedCommunity(mappedCommunity);
          } else {
            // User is not joined - show trending communities and highlight the specific community
            
            setMobileView('trending');
            
            // Wait a bit for trending communities to load, then scroll and highlight
            setTimeout(() => {
              const community = document.getElementById(`community-${communityId}`);
              if (community) {
                // Scroll to the community
                community.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Add highlighting (both background and border)
                community.classList.add('bg-blue-100', 'border-2', 'border-blue-500', 'rounded-lg');
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                  community.classList.remove('bg-blue-100', 'border-2', 'border-blue-500', 'rounded-lg');
                }, 3000);
              }
            }, 1000); // Wait 1 second for trending communities to load
            
            
          }
        } catch (error) {
          console.error('Error checking community join status:', error);
          // On error, default to trending view
          setMobileView('trending');
        } finally {
          
          setIsCheckingCommunity(false); // Stop loading
        }
      } else if (!communityId) {
        // No community ID in URL - default to trending view
        
        setMobileView('trending');
        setIsCheckingCommunity(false);
      } else if (!userId) {
        
        // Don't set loading to false yet, wait for userId
      }
    }
    
    handleCommunityId();
  }, [communityId, userId]);

  useEffect(() => {
    if (!userId) return;
    signalRService.startConnection(userId);
    return () => {
      signalRService.stopConnection(userId);
    };
  }, [userId]);
  
  useEffect(() => {
    if (!userId) return;
    signalRService.startConnection(userId);

    return () => {
      signalRService.stopConnection(userId);
    };
  }, [userId]);
  


  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);



  const handleSelectCommunity = (community: any) => {
    setSelectedCommunity(community);
    setShowProfile(false);
  };

  const handleJoinSuccess = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger refetch in children
  };

  const handleBack = () => {
    setSelectedCommunity(null);
    setShowProfile(false);
    // On mobile, go back to "Your Communities" view
    if (isMobile) {
      setMobileView('your-communities');
    }
  };

  const handleShowProfile = () => setShowProfile(true);

  // Show loading state while checking community join status
  if (isCheckingCommunity) {
    return (
      <div className="w-full max-w-[110rem] flex flex-row h-[calc(100vh-40px)] mx-auto lg:h-[100vh] overflow-hidden gap-6 md:p-6 relative">
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Checking community access...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full  grid grid-cols-1 lg:grid-cols-[30rem_1fr] mx-auto max-w-[1440px] lg:h-[100vh] overflow-hidden gap-6 md:p-6  relative">
      {/* Mobile: show only list if no selection */}
      {isMobile ? (
        <>
          {!selectedCommunity && (
            <div className="w-full">
              {/* Mobile View Toggle Buttons */}
              <div className="flex items-center gap-2 mb-4 p-4">
                <button
                  onClick={() => setMobileView('trending')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm ${
                    mobileView === 'trending'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Trending
                </button>
                <button
                  onClick={() => setMobileView('your-communities')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm ${
                    mobileView === 'your-communities'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Your Communities
                </button>
              </div>
              
              {/* Content based on selected view */}
              {mobileView === 'trending' ? (
                <TrendingCommunities />
              ) : (
                <CommunitiesList onSelect={handleSelectCommunity} isCommunitySelected={!!selectedCommunity} />
              )}
            </div>
          )}
          {selectedCommunity && !showProfile && (
            <div className="w-full flex flex-col">
              <div className="flex items-center gap-2 mb-3 p-4">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm bg-white text-gray-800 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleShowProfile}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm bg-white text-gray-800 hover:bg-gray-50"
                >
                  Profile
                </button>
              </div>
              <CommunityChat group={selectedCommunity} onBack={handleBack} isMobile={isMobile} />
            </div>
          )}
          {selectedCommunity && showProfile && (
            <div className="w-full flex flex-col">
              <div className="flex items-center gap-2 mb-3 p-4">
                <button
                  onClick={() => setShowProfile(false)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm bg-white text-gray-800 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Chat
                </button>
              </div>
              <CommunityProfile community={selectedCommunity} isMobile />
            </div>
          )}
        </>
      ) : (
        // Desktop: show all panes
        <>
          <div className="md:block ">
            <CommunitiesList onSelect={handleSelectCommunity} isCommunitySelected={!!selectedCommunity} />
          </div>
          <div className="flex-1 flex flex-col">
            {selectedCommunity ? (
                <div className="flex w-full h-full gap-4">
                  <div className="flex-1 max-w-4xl mx-auto">
                    <CommunityChat group={selectedCommunity} userId={userId} userData={userData} onBack={handleBack} isMobile={isMobile} />
                  </div>
                  <div className="hidden md:block md:w-80 lg:w-96">
                    <CommunityProfile community={selectedCommunity} userData={userData} />
                  </div>
                </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <TrendingCommunities />
              </div>
            )}
          </div>
          
        </>
      )}
    </div>
  );
};

export default Community;
