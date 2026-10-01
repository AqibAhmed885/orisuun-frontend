'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { followUser, getFollowersList, getFollowingList, unfollowUser } from '@/app/api/dashboard/following';
import { leaderboard } from '@/app/api/dashboard/leaderboard';
import { cn } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { renderProfileTypeIcon } from '@/components/ui/profile-type';
import { toast } from 'react-toastify';

interface FollowListItem {
  raw: any;
  id: string | number | null;
  relationUserId: string | number | null;
  profileId: string | number | null;
  name: string;
  profileType: string;
  location: string;
  image: string;
  isVerified: boolean;
}

const RELATION_TABS = [
  { id: 'following', label: 'Following' },
  { id: 'followers', label: 'Followers' },
] as const;

type RelationTabId = (typeof RELATION_TABS)[number]['id'];

const normalizeListResponse = (response: any): { total: number; list: FollowListItem[] } => {
  const result = response?.Result ?? response?.result ?? response ?? {};

  const arrayCandidate = [
    result?.Following,
    result?.Followers,
  ].find((entry) => Array.isArray(entry));

  const safeList = (arrayCandidate || []).map((entry: any) => {
    const relationUserId =
      entry?.FollowingId ??
      entry?.FollowedId ??
      entry?.FollowerId ??
      entry?.UserId ??
      entry?.Id ??
      null;

    const profileId = entry?.ProfileTypeId ;

    const isVerified = entry?.IsVerified ?? false;

    return {
      raw: entry,
      id: entry?.Id ?? `${entry?.UserId || ''}-${entry?.ProfileId || ''}`,
      relationUserId,
      profileId,
      name:
        entry?.FollowingName ||
        entry?.FollowerName ,
      profileType:
        entry?.FollowingProfileType ||
        entry?.FollowerProfileType ||
        entry?.ProfileTypeName ||
        entry?.ProfileType ||
        entry?.UserProfileName ||
        'Member',
      location:
        entry?.CountryName || entry?.Location || 'Unknown location',
      image:
        entry?.FollowingProfilePicture ||
        entry?.FollowerProfilePicture ||
        entry?.ProfilePicture ||
        entry?.CompanyLogo ||
        entry?.Image ||
        BASE_URL,
      isVerified,
    };
  });

  const total = Number(result?.TotalCount ?? result?.totalCount ?? safeList.length) || safeList.length;

  return { total, list: safeList };
};

const FollowConnections = () => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<RelationTabId>('following');
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [items, setItems] = useState<FollowListItem[]>([]);
  const [countryFlags, setCountryFlags] = useState<Record<string, string>>({});
  const [followBackState, setFollowBackState] = useState<Record<string, boolean>>({});
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 10;

  const currentUser =
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || 'null') : null;

  const teamData =
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('teamData') || 'null') : null;

  const activeUserId = useMemo(() => {
    if (teamData?.isActive) {
      return teamData?.teamId;
    }

    return currentUser?.Id;
  }, [currentUser?.Id, teamData?.isActive, teamData?.teamId]);

  const fetchList = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      if (!activeUserId) {
        setItems([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      try {
        if (pageNum === 1) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response =
          activeTab === 'following'
            ? await getFollowingList(activeUserId, pageNum, ITEMS_PER_PAGE)
            : await getFollowersList(activeUserId, pageNum, ITEMS_PER_PAGE);

        const parsed = normalizeListResponse(response);

        setTotalCount(parsed.total);

        if (append) {
          setItems((prevItems) => [...prevItems, ...parsed.list]);
        } else {
          setItems(parsed.list);
        }

        setCurrentPage(pageNum);

        // Check if there are more items to load based on current page and total
        const expectedItemsOnPage = pageNum * ITEMS_PER_PAGE;
        setHasMore(expectedItemsOnPage < parsed.total);

        if (activeTab === 'followers' && pageNum === 1) {
          const followingResponse = await getFollowingList(activeUserId, 1, 999);
          const followingParsed = normalizeListResponse(followingResponse);
          const followingIds = new Set(
            followingParsed.list
              .map((item) => item.relationUserId)
              .filter((id): id is string | number => !!id)
              .map((id) => String(id))
          );

          setFollowBackState(() => {
            const initialState: Record<string, boolean> = {};

            parsed.list.forEach((item) => {
              const itemKey = String(item.id ?? item.relationUserId ?? '');
              const relationUserIdKey = String(item.relationUserId ?? '');
              initialState[itemKey] = followingIds.has(relationUserIdKey);
            });

            return initialState;
          });
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} list:`, error);
        if (pageNum === 1) {
          setItems([]);
          setTotalCount(0);
        }
      } finally {
        if (pageNum === 1) {
          setLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [activeTab, activeUserId]
  );

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    setFollowBackState({});
    fetchList(1, false);
  }, [fetchList]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (!scrollContainerRef.current || scrollTimeout) return;

      const target = scrollContainerRef.current;
      const isNearBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight < 100;

      if (isNearBottom && hasMore && !isLoadingMore && !loading) {
        fetchList(currentPage + 1, true);

        // Throttle scroll events to prevent rapid fetches
        scrollTimeout = setTimeout(() => {
          scrollTimeout = null;
        }, 500);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        if (scrollTimeout) clearTimeout(scrollTimeout);
      };
    }
  }, [currentPage, hasMore, isLoadingMore, loading, fetchList]);

  useEffect(() => {
    const countriesToFetch = Array.from(
      new Set(
        items
          .map((item) => item.location?.trim())
          .filter((country): country is string => !!country && country !== 'Unknown location' && !countryFlags[country])
      )
    );

    if (!countriesToFetch.length) {
      return;
    }

    let cancelled = false;

    const fetchFlags = async () => {
      const fetchedFlags = await Promise.all(
        countriesToFetch.map(async (country) => {
          const flagUrl = await leaderboard.fetchCountryFlag(country);
          return [country, flagUrl] as const;
        })
      );

      if (cancelled) {
        return;
      }

      setCountryFlags((prev) => {
        const next = { ...prev };

        fetchedFlags.forEach(([country, flagUrl]) => {
          if (flagUrl) {
            next[country] = flagUrl;
          }
        });

        return next;
      });
    };

    fetchFlags();

    return () => {
      cancelled = true;
    };
  }, [items, countryFlags]);

  const handleUnfollow = async (item: FollowListItem) => {
    if (!activeUserId || !item.relationUserId || activeTab !== 'following') {
      return;
    }

    try {
      await unfollowUser(activeUserId, item.relationUserId);
      setItems((prev) => prev.filter((entry) => entry.id !== item.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error while unfollowing user:', error);
    }
  };

  const handleFollowToggle = async (item: FollowListItem) => {
    if (!activeUserId || !item.relationUserId || activeTab !== 'followers') {
      return;
    }

    const itemKey = String(item.id ?? item.relationUserId ?? '');
    const isFollowingBack = !!followBackState[itemKey];

    try {
      setActionLoadingId(itemKey);

      if (isFollowingBack) {
        await unfollowUser(activeUserId, item.relationUserId);
        setFollowBackState((prev) => ({ ...prev, [itemKey]: false }));
        toast.success('Unfollowed successfully');
      } else {
        await followUser(activeUserId, item.relationUserId);
        setFollowBackState((prev) => ({ ...prev, [itemKey]: true }));
        toast.success('Following successfully');
      }
    } catch (error) {
      console.error('Error while toggling follow state:', error);
      toast.error('Could not update follow status');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="w-full mt-6">
      <div className="w-full flex items-center gap-8 border-b border-[#E5E7EB] px-1">
        {RELATION_TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className="relative pb-3 text-left"
              onClick={() => setActiveTab(tab.id)}
            >
              <p
                className={cn(
                  'text-sm 2xl:text-scaled-h9 font-medium transition-colors',
                  isActive ? 'text-omblue-500' : 'text-[#797B82]'
                )}
              >
                {tab.label}
              </p>
              {isActive && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 rounded bg-omblue-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="w-full mt-4 bg-white border border-[#EAECF0] rounded-lg shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] p-4 md:p-5">
        <p className="text-sm text-[#344054] mb-4">
          {activeTab === 'following'
            ? `You are following ${totalCount.toLocaleString()} account${totalCount === 1 ? '' : 's'}`
            : `${totalCount.toLocaleString()} account${totalCount === 1 ? '' : 's'} follow you`}
        </p>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-[76px] border border-[#EAECF0] rounded-lg animate-pulse bg-gray-50" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-[#667085] py-10 text-center">
            {activeTab === 'following' ? 'You are not following anyone yet.' : 'No followers yet.'}
          </p>
        ) : (
              <div className="max-h-screen overflow-y-auto pr-1 space-y-3" ref={scrollContainerRef}>
            {items.map((item) => (
              <div
                key={item.id}
                className="w-full border-b border-[#EAECF0]  py-1.5 md:p-2 flex items-center justify-between gap-3"
              >
                <div
                  className="flex items-center gap-3 min-w-0 cursor-pointer"
                  onClick={() => {
                    if (!item.profileId) {
                      return;
                    }

                    const numericProfileId = Number(item.profileId);

                    if (Number.isNaN(numericProfileId)) {
                      return;
                    }

                    router.push(`/profile/${add2040ToProfileDetailsId(numericProfileId)}`);
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div className=''>
                    <div className="min-w-0 flex items-center gap-2">
                      <p className="text-sm font-medium text-[#101828] truncate w-20 sm:w-full">{item.name}</p>
                      {item.isVerified && (
                        <Image
                          src="/chat/verified.svg"
                          alt="Verified"
                          width={16}
                          height={16}
                          className="flex-shrink-0"
                        />
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="inline-flex items-center rounded-full border border-[#D1E9FF] bg-[#F5FAFF] gap-1 px-2 py-0.5 text-[11px] text-[#1849A9]">
                          {renderProfileTypeIcon(
                            Number(item.profileId),
                            'default',
                            false,
                            'w-3.5 h-3.5 flex-shrink-0'
                          )}
                        </span>
                      </div>

                    </div>
                    <span className="inline-flex mt-1 items-center gap-1 rounded-[4px] border-0.5 border-[#FCFCFD33] bg-[#F5F8FF] px-2 py-0.5 text-[11px] text-[#667085]">
                      {countryFlags[item.location] ? (
                        <Image
                          src={countryFlags[item.location]}
                          alt={`${item.location} flag`}
                          width={20}
                          height={14}
                          className="h-3 w-4 rounded-[3px] object-cover"
                        />
                      ) : null}
                      {item.location}
                    </span>
                  </div>


                </div>

                {activeTab === 'following' ? (
                  <button
                    className="h-7 min-w-[70px] px-3 rounded-[4px] border border-[#D0D5DD] bg-white text-xs font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                    onClick={() => handleUnfollow(item)}
                    disabled={actionLoadingId === String(item.id ?? item.relationUserId ?? '')}
                  >
                    {actionLoadingId === String(item.id ?? item.relationUserId ?? '') ? 'Processing...' : 'Following'}
                  </button>
                ) : (
                    <button
                      className={cn(
                        'h-7 min-w-[70px] px-3 rounded-[4px] text-xs font-medium inline-flex items-center justify-center transition-colors',
                        followBackState[String(item.id ?? item.relationUserId ?? '')]
                          ? 'border border-[#D0D5DD] bg-white text-[#344054] hover:bg-gray-50'
                          : 'border border-[#85A9F6] bg-[#F6F9FF] text-[#2357C6] hover:bg-[#EEF4FF]'
                      )}
                      onClick={() => handleFollowToggle(item)}
                      disabled={actionLoadingId === String(item.id ?? item.relationUserId ?? '')}
                    >
                      {actionLoadingId === String(item.id ?? item.relationUserId ?? '')
                        ? 'Processing...'
                        : followBackState[String(item.id ?? item.relationUserId ?? '')]
                          ? 'Following'
                          : 'Follow'}
                    </button>
                )}
              </div>
            ))}
          </div>
        )}        
        {!loading && items.length > 0 && hasMore && (
          <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-[#EAECF0]">
            <button
              onClick={() => fetchList(currentPage + 1, true)}
              disabled={isLoadingMore}
              className="h-10 px-6 rounded-[6px] border border-[#85A9F6] bg-[#F6F9FF] text-sm font-medium text-[#2357C6] hover:bg-[#EEF4FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#85A9F6] border-t-transparent" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </>
              )}
            </button>
            <span className="text-xs text-[#667085]">
              {items.length} of {totalCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowConnections;
