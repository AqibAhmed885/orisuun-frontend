import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import StarRatings from 'react-star-ratings';
import MessageIcon from '@/icons/message-icon';
import Favourite from '@/icons/favourite';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

type Item = {
  ProfileDetailId?: string;
  ProfilePicture?: string;
  CompanyName?: string;
  City?: string;
  Country?: string;
  Rating?: number;
  Review?: number;
  UserId?: string;
  IsFavouriteProfile?: boolean;
  Website?: string;
  ChatUserName?: string;
  IsDummy?: boolean;
};

type Props = {
  items: Item[];
  flagUrls?: Record<string, string>;
  onViewProfile?: (id: string) => void;
  onChat?: (item: Item) => void;
  onToggleFavourite?: (item: Item) => void;
  initialPageSize?: number;
  pageSizeOptions?: number[];
};

const ListView: React.FC<Props> = ({
  items = [],
  flagUrls = {},
  onViewProfile,
  onChat,
  onToggleFavourite,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20],
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(''); // 'company' | 'rating' | 'location'
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [page, setPage] = useState<number>(1);

  // local flag cache (merged with incoming flagUrls prop)
  const [localFlags, setLocalFlags] = useState<Record<string, string>>({});
  const flags = { ...flagUrls, ...localFlags };

  // fetch flags for unique countries in `items` using restcountries -> flagcdn
  useEffect(() => {
    const countries = Array.from(new Set(items.map((it) => (it.Country || '').trim()).filter(Boolean)));
    if (countries.length === 0) return;

    countries.forEach((country) => {
      // skip if already have a URL (either from prop or local cache)
      if (flags[country]) return;

      (async () => {
        try {
          const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=false`);
          if (!res.ok) throw new Error('country lookup failed');
          const data = await res.json();
          const code = data?.[0]?.cca2?.toLowerCase();
          const url = code ? `https://flagcdn.com/w40/${code}.png` : '/default-flag.png';
          setLocalFlags((s) => ({ ...s, [country]: url }));
        } catch (err) {
          // fallback
          setLocalFlags((s) => ({ ...s, [country]: '/default-flag.png' }));
        }
      })();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // filter
  const filtered = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const company = (p.CompanyName || p.ChatUserName || '').toString().toLowerCase();
      const location = `${p.City || ''} ${p.Country || ''}`.toLowerCase();
      const rating = (p.Rating || '').toString().toLowerCase();
      return company.includes(q) || location.includes(q) || rating.includes(q);
    });
  }, [items, search]);

  // sort
  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      let va: any, vb: any;
      if (sortBy === 'company') {
        va = (a.CompanyName || a.ChatUserName || '').toString().toLowerCase();
        vb = (b.CompanyName || b.ChatUserName || '').toString().toLowerCase();
      } else if (sortBy === 'location') {
        va = `${a.City || ''} ${a.Country || ''}`.toLowerCase();
        vb = `${b.City || ''} ${b.Country || ''}`.toLowerCase();
      } else if (sortBy === 'rating') {
        va = Number(a.Rating || 0);
        vb = Number(b.Rating || 0);
      } else {
        va = '';
        vb = '';
      }

      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortBy, sortDir]);

  // pagination
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const toggleSort = (key: string) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const goToPage = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
  };

  return (
    // allow horizontal scroll when container is narrow (sidebar open)
    <div className="overflow-x-auto overflow-hidden">
      <div className=" rounded-lg tracking-wide w-full min-w-[1160px] ">
        {/* header - hidden on small screens, visible on md+ */}
        <div className="grid grid-cols-[80px_minmax(400px,_1fr)_300px_260px_200px_140px] gap-4 bg-gray-100 items-center px-5 py-3 text-sm text-gray-600 font-semibold tracking-wide border-b">
          <div className="pl-1">Ranking</div>

          <button
            onClick={() => toggleSort('company')}
            className="text-left  flex items-center font-semiboldgap-2"
          >
            Member
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform ${sortBy === 'company' && sortDir === 'asc' ? 'rotate-180' : ''} ${sortBy !== 'company' ? 'opacity-50' : ''}`}
            />
          </button>

          <button onClick={() => toggleSort('location')} className="text-left font-semibold flex items-center gap-2">
            Location
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform ${sortBy === 'location' && sortDir === 'asc' ? 'rotate-180' : ''} ${sortBy !== 'location' ? 'opacity-50' : ''}`}
            />
          </button>

          <button onClick={() => toggleSort('rating')} className="text-left font-semibold flex items-center gap-2">
            Ratings
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform ${sortBy === 'rating' && sortDir === 'asc' ? 'rotate-180' : ''} ${sortBy !== 'rating' ? 'opacity-50' : ''}`}
            />
          </button>

          <div className="text-left ">Website</div>
          <div className="text-left">Action</div>
        </div>

        {/* rows (single column on mobile, grid on md+) */}
        <div className="divide-y ">
          {paged.map((profile, idx) => {
            const absoluteIndex = (currentPage - 1) * pageSize + idx;
            return (
              <div
                key={profile.ProfileDetailId || absoluteIndex}
                className="grid grid-cols-[80px_minmax(400px,_1fr)_300px_260px_200px_140px] gap-4 items-center px-4 py-4 md:py-3"
              >
                {/* Ranking */}
                <div className="flex md:block items-center md:justify-start">
                  <div
                    className={`inline-flex items-center justify-center px-3 py-1 rounded text-sm font-semibold border ${absoluteIndex === 0
                      ? 'bg-[#FFF9D9] border-[#E5D99A] text-[#8D7A19]'
                      : absoluteIndex === 1
                        ? 'bg-[#F1F4F6] border-[#B1BCD1] text-[#4C525F]'
                        : absoluteIndex === 2
                          ? 'bg-[#FFE9D9] border-[#E5B99A] text-[#8D4919]'
                          : 'bg-[#F0F7FD] border-[#9AB2E5] text-[#193E8D]'
                      }`}
                  >
                    #{absoluteIndex + 1}
                  </div>
                </div>

                {/* Member */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                    <Image
                      src={profile.ProfilePicture || BASE_URL}
                      alt={profile.CompanyName || profile.ChatUserName || 'profile'}
                      width={48}
                      height={48}
                      className="rounded-full object-cover bg-gray-100 w-full h-full"
                    />

                  </div>

                  <div className="min-w-0">
                    <button
                      onClick={() => onViewProfile && onViewProfile(profile.ProfileDetailId || '')}
                      className="text-sm md:text-base font-semibold text-[#0B1220] truncate block text-left"
                    >
                      {profile.CompanyName || profile.ChatUserName || '—'}
                    </button>

                    <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center gap-2 bg-[#F5F8FF] text-[#4B5563] rounded px-2 py-0.5 text-xs">
                        <div className="w-5 h-4 rounded-sm flex items-center justify-center overflow-hidden">
                          <Image
                            src={flags[profile.Country] || '/default-flag.png'}
                            alt={profile.Country || ''}
                            width={20}
                            height={14}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="truncate">{profile.Country || ''}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="text-sm text-[#0B1220] font-semibold min-w-0">
                  <div className="truncate">{profile.City ? `${profile.City}, ` : ''}{profile.Country}</div>
                </div>

                {/* Ratings */}
                <div className="flex flex-col">

                  <div className="flex items-center gap-4">
                    <div className="text-[#204FB4] font-semibold text-lg">{profile.Rating ?? '-'}</div>
                    <StarRatings
                      rating={profile.Rating || 0}
                      starDimension="16px"
                      starSpacing="2px"
                      starRatedColor="#204FB4"
                      numberOfStars={5}
                      name={`rating-${profile.ProfileDetailId || absoluteIndex}`}
                    />
                  </div>
                  <div className="text-sm font-medium text-[#6B7280] ">{(profile.Review ?? 0) + ' Reviews'}</div>
                </div>

                {/* Website */}
                <div className="text-sm font-medium min-w-0">
                  {profile.Website ? (
                    <a href={profile.Website} target="_blank" rel="noreferrer" className="text-[#204FB4] underline">
                      Visit Website
                    </a>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => onChat && onChat(profile)}
                    disabled={profile.IsDummy}
                    className="bg-[#2357C6] hover:bg-[#1f4fb5] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                  >
                    {/* <MessageIcon className="w-4 h-4 text-white" /> */}
                    Chat
                  </button>

                  <button
                    onClick={() => onToggleFavourite && onToggleFavourite(profile)}
                    disabled={profile.IsDummy}
                    aria-label="Favourite"
                    className={`border rounded-md w-10 h-10 flex items-center justify-center ${profile.IsFavouriteProfile ? 'text-current bg-white' : 'text-[#667085] bg-white'}`}
                  >
                    <Favourite
                      className="w-4 h-4"
                      fill={profile.IsFavouriteProfile ? 'currentColor' : 'white'}
                      stroke={profile.IsFavouriteProfile ? 'currentColor' : '#667085'}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* pagination (centered, rounded like screenshot) */}
        <div className="w-full flex justify-center my-4 ">
          <nav className="inline-flex items-center  bg-white">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded-l-md border text-sm flex items-center hover:bg-gray-100 disabled:opacity-50"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" /> Previous
            </button>

            {/*
              Render page buttons with ellipses when many pages.
              Keep first, last and neighbors of current page visible.
            */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              if (totalPages > 7) {
                if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
                  return (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`px-3 py-1 rounded-full border text-sm ${p === currentPage ? 'bg-omblue-500 text-white' : 'bg-white'}`}
                    >
                      {p}
                    </button>
                  );
                }
                if (p === 2 && currentPage > 3) {
                  return <span key="dots-left" className="px-2 text-sm text-gray-500">...</span>;
                }
                if (p === totalPages - 1 && currentPage < totalPages - 2) {
                  return <span key="dots-right" className="px-2 text-sm text-gray-500">...</span>;
                }
                return null;
              }
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 py-1 border text-sm ${p === currentPage ? 'bg-omblue-500 text-white' : 'bg-white'}`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-r-md border text-sm flex items-center hover:bg-gray-100 disabled:opacity-50"
              aria-label="Next"
            >
              Next <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ListView;