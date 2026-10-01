import React from 'react';
import Image from 'next/image';
import Favourite from '@/icons/favourite';
import ChatterIcon from '@/icons/feeds/chatter-icon';
import { EllipsisSmIcon } from '@/icons/ellipsis';
import { feedTypes } from '@/utils/constants';
import { formatPostedLabel, getRangeLabel } from './feed-card-utils';
import Tooltip from '@/components/ui/tooltip';
import ChatIcon from '@/icons/feeds/chat-icon';
import Link from 'next/link';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';


export const LeaderboardFeedCard = ({ feed, onChatterClick }) => {
    console.log('Rendering LeaderboardFeedCard with feed:', feed);
    const isChatterType =
        feed?.Type === feedTypes.MostActiveChatterOfTheWeek ||
        feed?.Type === feedTypes.MostActiveChatterOfTheMonth ||
        feed?.Type === feedTypes.MostActiveChatterOfTheYear;
    const isReviewType =
        feed?.Type === feedTypes.MostReviewedProfileOfTheDay ||
        feed?.Type === feedTypes.MostReviewedProfileOfTheWeek ||
        feed?.Type === feedTypes.MostReviewedProfileOfTheYear;
    const isFavoriteType =
        feed?.Type === feedTypes.MostFavoritedProfileOfTheDay ||
        feed?.Type === feedTypes.MostFavoritedProfileOfTheWeek ||
        feed?.Type === feedTypes.MostFavoritedProfileOfTheYear;
    const isFollowedType =
        feed?.Type === feedTypes.MostFollowedProfileOfTheDay ||
        feed?.Type === feedTypes.MostFollowedProfileOfTheWeek ||
        feed?.Type === feedTypes.MostFollowedProfileOfTheYear;

    if (!isChatterType && !isReviewType && !isFavoriteType && !isFollowedType) return null;

    const config = isChatterType
        ? {
            label: 'Number 1 Chatter',
            pillBg: '#0A0A0A',
            pillText: '#FFFFFF',
            metric: 'messages',
            icon: (
                <ChatIcon
                    className="text-white w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                    onClick={() => onChatterClick?.(feed?.UserId as string)}
                />
            ),
        }
        : isReviewType
            ? {
                label: 'Number 1 Reviews Given',
                pillBg: '#CE9647',
                pillText: '#FFFFFF',
                metric: 'reviews',
                icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5251 2.29489C11.5689 2.20635 11.6366 2.13183 11.7205 2.07972C11.8045 2.02761 11.9013 2 12.0001 2C12.0989 2 12.1957 2.02761 12.2796 2.07972C12.3636 2.13183 12.4313 2.20635 12.4751 2.29489L14.7851 6.97389C14.9373 7.28186 15.1619 7.5483 15.4397 7.75035C15.7175 7.95239 16.0402 8.08401 16.3801 8.13389L21.5461 8.88989C21.644 8.90408 21.7359 8.94537 21.8116 9.00909C21.8872 9.07282 21.9435 9.15644 21.9741 9.2505C22.0047 9.34456 22.0084 9.4453 21.9847 9.54133C21.961 9.63736 21.9109 9.72485 21.8401 9.79389L18.1041 13.4319C17.8577 13.672 17.6734 13.9684 17.5669 14.2955C17.4605 14.6227 17.4352 14.9708 17.4931 15.3099L18.3751 20.4499C18.3924 20.5477 18.3818 20.6485 18.3446 20.7406C18.3074 20.8327 18.245 20.9125 18.1646 20.9709C18.0842 21.0293 17.9891 21.0639 17.89 21.0708C17.7908 21.0777 17.6918 21.0566 17.6041 21.0099L12.9861 18.5819C12.6818 18.4221 12.3433 18.3386 11.9996 18.3386C11.6559 18.3386 11.3174 18.4221 11.0131 18.5819L6.39609 21.0099C6.30842 21.0563 6.20949 21.0772 6.11054 21.0701C6.0116 21.0631 5.91661 21.0285 5.83639 20.9701C5.75616 20.9118 5.69392 20.8321 5.65675 20.7401C5.61957 20.6482 5.60895 20.5476 5.62609 20.4499L6.50709 15.3109C6.56529 14.9716 6.54007 14.6233 6.43363 14.2959C6.32718 13.9686 6.1427 13.672 5.89609 13.4319L2.16009 9.79489C2.08868 9.72593 2.03808 9.63829 2.01405 9.54197C1.99002 9.44565 1.99353 9.34451 2.02417 9.25008C2.05481 9.15566 2.11136 9.07174 2.18737 9.00788C2.26338 8.94402 2.35579 8.90279 2.45409 8.88889L7.61909 8.13389C7.95935 8.08439 8.28248 7.95295 8.56067 7.75088C8.83887 7.54881 9.06379 7.28216 9.21609 6.97389L11.5251 2.29489Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ),
            }
            : isFavoriteType
                ? {
                    label: 'Number 1 Most Favorited',
                    pillBg: '#CE4747',
                    pillText: '#FFFFFF',
                    metric: 'favorites',
                    icon: (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5251 2.29489C11.5689 2.20635 11.6366 2.13183 11.7205 2.07972C11.8045 2.02761 11.9013 2 12.0001 2C12.0989 2 12.1957 2.02761 12.2796 2.07972C12.3636 2.13183 12.4313 2.20635 12.4751 2.29489L14.7851 6.97389C14.9373 7.28186 15.1619 7.5483 15.4397 7.75035C15.7175 7.95239 16.0402 8.08401 16.3801 8.13389L21.5461 8.88989C21.644 8.90408 21.7359 8.94537 21.8116 9.00909C21.8872 9.07282 21.9435 9.15644 21.9741 9.2505C22.0047 9.34456 22.0084 9.4453 21.9847 9.54133C21.961 9.63736 21.9109 9.72485 21.8401 9.79389L18.1041 13.4319C17.8577 13.672 17.6734 13.9684 17.5669 14.2955C17.4605 14.6227 17.4352 14.9708 17.4931 15.3099L18.3751 20.4499C18.3924 20.5477 18.3818 20.6485 18.3446 20.7406C18.3074 20.8327 18.245 20.9125 18.1646 20.9709C18.0842 21.0293 17.9891 21.0639 17.89 21.0708C17.7908 21.0777 17.6918 21.0566 17.6041 21.0099L12.9861 18.5819C12.6818 18.4221 12.3433 18.3386 11.9996 18.3386C11.6559 18.3386 11.3174 18.4221 11.0131 18.5819L6.39609 21.0099C6.30842 21.0563 6.20949 21.0772 6.11054 21.0701C6.0116 21.0631 5.91661 21.0285 5.83639 20.9701C5.75616 20.9118 5.69392 20.8321 5.65675 20.7401C5.61957 20.6482 5.60895 20.5476 5.62609 20.4499L6.50709 15.3109C6.56529 14.9716 6.54007 14.6233 6.43363 14.2959C6.32718 13.9686 6.1427 13.672 5.89609 13.4319L2.16009 9.79489C2.08868 9.72593 2.03808 9.63829 2.01405 9.54197C1.99002 9.44565 1.99353 9.34451 2.02417 9.25008C2.05481 9.15566 2.11136 9.07174 2.18737 9.00788C2.26338 8.94402 2.35579 8.90279 2.45409 8.88889L7.61909 8.13389C7.95935 8.08439 8.28248 7.95295 8.56067 7.75088C8.83887 7.54881 9.06379 7.28216 9.21609 6.97389L11.5251 2.29489Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ),
                }
                : {
                    label: 'Number 1 Most Followed',
                    pillBg: '#2357C6',
                    pillText: '#FFFFFF',
                    metric: 'followers',
                    icon: (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 10V4M16 7L22 7M16 21V19.8C16 18.1198 16 17.2798 15.673 16.638C15.3854 16.0735 14.9265 15.6146 14.362 15.327C13.7202 15 12.8802 15 11.2 15H6.8C5.11984 15 4.27976 15 3.63803 15.327C3.07354 15.6146 2.6146 16.0735 2.32698 16.638C2 17.2798 2 18.1198 2 19.8V21M12.5 7.5C12.5 9.433 10.933 11 9 11C7.067 11 5.5 9.433 5.5 7.5C5.5 5.567 7.067 4 9 4C10.933 4 12.5 5.567 12.5 7.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    ),
                };

    const postedLabel = formatPostedLabel(feed?.CreateDate || feed?.DateTime);
    const rangeLabel = getRangeLabel(feed?.Type);
    const metricUnit = config.metric;
    const primaryName = feed?.User?.Name || 'Member';
    const primaryAvatar = feed?.User?.ProfileDetails?.ProfilePicture || '';

    // prefer explicit TopUsers from the feed (API) — fall back to placeholders when missing
    const topUsers = Array.isArray(feed?.TopUsers) ? feed.TopUsers.slice(0, 5) : [];
    const sortedTopUsers = topUsers.length ? [...topUsers].sort((a, b) => (b.Count ?? 0) - (a.Count ?? 0)) : [];

    const rankItems = [1, 2, 3, 4, 5].map((rank) => {
        const user = sortedTopUsers[rank - 1];
        if (user) {
            return {
                rank,
                name: user.Name || 'Member',
                count: `Over ${user.Count ?? 0} ${metricUnit}`,
                avatar: user.ProfilePicture || undefined,
                UserProfileDetailId:  user.UserProfileDetailId,
            };
        }

        // existing visual fallbacks
        if (rank === 1) {
            return { rank: 1, name: primaryName, count: `Over 1000 ${metricUnit}`, avatar: primaryAvatar };
        }

        return { rank, name: 'Member', count: `Over 100 ${metricUnit}` };
    });

    const rankStyles = [
        { rank: 5, border: '#D6D3CB', badgeBg: '#E5E7EB', badgeText: '#111827' },
        { rank: 3, border: '#AEADAB', badgeBg: '#111111', badgeText: '#FFFFFF' },
        { rank: 1, border: '#FFF152', badgeBg: '#FFF152', badgeText: '#0D1B39' },
        { rank: 2, border: '#FFC852', badgeBg: '#FFC852', badgeText: '#0D1B39' },
        { rank: 4, border: '#D6D3CB', badgeBg: '#E5E7EB', badgeText: '#111827' },
    ];

    const itemsByRank = new Map(rankItems.map((item) => [item.rank, item]));

    return (
        <div className="flex flex-col gap-5 mb-4  bg-white rounded-2xl shadow-blur overflow-hidden md:aspect-[643/280]">
            <style>{`
                .avatar-rank-5, .avatar-rank-4 { width: 35px; height: 35px; }
                .avatar-rank-3, .avatar-rank-2 { width: 40px; height: 40px; }
                .avatar-rank-1 { width: 65px; height: 65px; }
                
                @media (min-width: 640px) {
                    .avatar-rank-5, .avatar-rank-4 { width: 70px; height: 70px; }
                    .avatar-rank-3, .avatar-rank-2 { width: 86px; height: 86px; }
                    .avatar-rank-1 { width: 120px; height: 120px; }
                }
            `}</style>
            <div className="flex items-center justify-between border-b gap-3 px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span
                        className="inline-flex items-center gap-2 rounded-lg md:px-4 px-2 md:py-2 py-1 md:text-sm text-[9px] font-semibold"
                        style={{ backgroundColor: config.pillBg, color: config.pillText }}
                    >
                        {config.icon}
                        {config.label}
                    </span>
                    <span className="text-sm text-[#5B657B]">•</span>
                    <span className="text-sm font-medium text-[#5B657B]">{postedLabel}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="md:text-sm text-[9px] font-semibold text-[#0D1B39]">{rangeLabel}</span>
                    <EllipsisSmIcon className="text-[#5B657B] md:rotate-0 rotate-90" />
                </div>
            </div>

            <div className="grid items-end gap-6 grid-cols-5 sm:gap-4 px-6 py-4">
                {rankStyles.map((slot) => {
                    const item = itemsByRank.get(slot.rank);
                    return (
                        <div key={slot.rank} className={`flex flex-col items-center text-center ${slot.rank === 1 ? '' : 'mb-4'}`}>
                            <div
                                className={`avatar-rank-${slot.rank} relative flex items-center justify-center rounded-full border-2 bg-white`}
                                style={{ borderColor: slot.border }}
                            >
                                {item?.avatar ? (
                                    <Link href={`/profile/${add2040ToProfileDetailsId(item.UserProfileDetailId)}`} >
                                        <Image
                                            src={item.avatar}
                                            alt={item.name}
                                            fill
                                            className="h-full w-full rounded-full bg-profile-frame object-cover"
                                        />
                                    </Link>
                                    
                                ) : null}
                                <span
                                    className="absolute -right-1 -bottom-1 flex md:h-7 md:w-7 w-3 h-3 items-center justify-center rounded-full md:text-xs text-[7px] font-bold shadow-sm"
                                    style={{ backgroundColor: slot.badgeBg, color: slot.badgeText }}
                                >
                                    {slot.rank}
                                </span>
                            </div>
                            <Tooltip content={item?.name ?? ''}>
                                <p className="mt-3 md:text-base text-[9px] font-semibold text-[#0D1B39] truncate max-w-[70px] md:max-w-[140px]">{item?.name}</p>
                            </Tooltip>
                            <p className="md:text-sm text-[6px] text-[#7B869A]">{item?.count}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
