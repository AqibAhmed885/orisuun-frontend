'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import StarRatings from 'react-star-ratings';
import CustomSelect from '@/components/ui/select';
import Loader from '@/components/ui/loader';
import { leaderboard } from '../../../../api/dashboard/leaderboard';
import ChevronRight from '@/icons/chevron-right';
import Favourite from '@/icons/favourite';
import LocationPin from '@/icons/location-pin';
import MessageIcon from '@/icons/message-icon';
import Hamburger from '@/icons/sidebar/hamburger';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import Select from '@/components/ui/select';
import { components } from 'react-select';
import Eye from '@/icons/eye';
import { Grid, List } from 'react-feather';
import ListView from './components/listView';
import { Grip } from 'lucide-react';
import { ListBulletIcon } from '@heroicons/react/24/solid';

// Place this at the top of your leaderboard/page.tsx or in a separate file and import it
const LeaderboardCardShimmer = () => (
  <div className="border-2 bg-white border-[#F9FAFB] rounded-md flex items-center justify-between gap-3 p-4 md:w-[calc(50%-0.5rem)] w-full flex-wrap sm:flex-nowrap md:flex-wrap xl:flex-nowrap shadow-[0px_0px_0px_1px_#EAF1FE,0px_1px_1px_0px_#1018280F,0px_1px_2px_0px_#1018281A] animate-pulse mb-2">
    {/* Rank */}
    <div className="px-3 py-1 rounded-[4px] bg-gray-100 w-12 h-7" />
    {/* Profile image and name */}
    <div className="space-y-2 w-[calc(40%-1rem)] xl:w-[20%] flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center justify-center relative w-16 h-16">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="w-5 h-5 rounded-full border border-grey-600 absolute right-0 top-10 bg-gray-100" />
      </div>
      <div className="h-4 w-20 bg-gray-200 rounded mx-auto" />
    </div>
    {/* Location, rating, reviews */}
    <div className="space-y-3 w-[calc(50%-1rem)] xl:w-[40%]">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-5 w-10 bg-gray-200 rounded" />
        <div className="h-5 w-24 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-5 w-5 bg-gray-200 rounded" />
      </div>
    </div>
    {/* Actions */}
    <div className="w-full sm:w-[40%] md:w-[100%] xl:w-[25%] flex gap-2 flex-row sm-ipad:flex-col sm:flex-col md:flex-row xl:flex-col">
      <div className="h-10 w-full bg-gray-200 rounded mb-2" />
      <div className="h-10 w-full bg-gray-200 rounded mb-2" />
      <div className="h-10 w-full bg-gray-200 rounded" />
    </div>
  </div>
);


const Leaderboard = () => {
  const router = useRouter();
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));
  const teamData = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('teamData'));

  const [category, setCategory] = useState({ label: 'Most favorited', value: 'Most favorited' });
  const [profileTypes, setProfileTypes] = useState([]);
  const [profileType, setProfileType] = useState({ label: 'All', value: 0 });
  const [industries, setIndustries] = useState([]);
  const [industry, setIndustry] = useState({ label: 'All', value: null });
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState({ label: 'All', value: null });
  const [timeframe, setTimeframe] = useState({ label: 'Last 7 days', value: 'Last 7 days' });
  const [profiles, setProfiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const [flagUrls, setFlagUrls] = useState({});


  // view toggle and industry text search
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [industrySearch, setIndustrySearch] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // mobile search

  const fetchProfileTypes = async () => {
    try {
      const result = await leaderboard.getProfileTypes();
      setProfileTypes(result);
    } catch (error) {
      console.error('Error fetching profile types:', error);
    }
  };

  const fetchLocationsByProfileType = async (profileTypeId) => {
    try {
      const result = await leaderboard.getLocationsByProfileType(profileTypeId.value, currentUser?.Id);
      setLocations(result);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchIndustriesByProfileType = async (profileTypeId) => {
    try {
      const result = await leaderboard.getIndustriesByProfileType(profileTypeId.value, currentUser?.Id);
      setIndustries(result);
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };



  const setFavourite = async (profile, isFavourite) => {
    try {
      const result = await leaderboard.setFavouriteProfile(profile, isFavourite, (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id);
      setProfiles((prevList) =>
        prevList.map((p) =>
          p.ProfileDetailId === profile.ProfileDetailId
            ? { ...p, IsFavouriteProfile: !p.IsFavouriteProfile, FavouriteProfileId: result }
            : p
        )
      );
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };

  const fetchFilteredProfiles = async () => {
    setLoader(true);


    try {
      const filters = {
        Category: category?.value,
        ProfileTypeId: profileType?.value,
        Timeframe: timeframe?.value,
        Location: location?.value,
        Industry: industry?.value,
        UserId: currentUser?.Id,
      };
      const result = await leaderboard.getFilteredProfiles(filters);
      setProfiles(result);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoader(false);
    }
  };

  const loadFlags = async (profiles) => {
    const flags = {};
    const flagPromises = profiles.map(async (profile) => {
      if (profile.Country) {
        const flagUrl = await leaderboard.fetchCountryFlag(profile.Country);
        if (flagUrl) flags[profile.Country] = flagUrl;
      }
    });
    await Promise.all(flagPromises);
    return flags;
  };

  useEffect(() => {
    fetchProfileTypes();
  }, []);

  useEffect(() => {
    if (profileType) {
      fetchLocationsByProfileType(profileType);
      fetchIndustriesByProfileType(profileType)
    }
  }, [profileType]);

  useEffect(() => {
    if (profileType) {
      fetchFilteredProfiles();
    }
  }, [category, profileType, timeframe, location, industry]);

  useEffect(() => {
    if (profiles.length > 0) {
      const fetchFlags = async () => {
        const flags = await loadFlags(profiles);
        setFlagUrls(flags);
      };
      fetchFlags();
    }
  }, [profiles]);

  const handleClick = (id) => () => {
    router.push(`/profile/${add2040ToProfileDetailsId(id)}#profile_reviews`);
  };

  const handleViewProfile = (id) => () => {
    router.push(`/profile/${add2040ToProfileDetailsId(id)}`);
  };

  const [availableHeight, setAvailableHeight] = useState(null);

  useEffect(() => {
    function updateHeight() {
      setAvailableHeight(window.innerHeight * 0.9);
    }

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  if (!availableHeight) {
    return null;
  }

  // const openProfile = (id?: string) => {
  //   if (!id) return;
  //   router.push(`/profile/${add2040ToProfileDetailsId(id)}`);
  // };

  // client-side filter by industry search text and selected industry
  const displayedProfiles = profiles.filter((p) => {
    if (industry?.value) {
      const sel = (industry.value || '').toString().toLowerCase();
      if (!String(p.Industry || p.IndustryName || '').toLowerCase().includes(sel)) return false;
    }
    if (!industrySearch) return true;
    return String(p.Industry || p.IndustryName || '').toLowerCase().includes(industrySearch.toLowerCase());
  });

  // Use only real profiles
  const effectiveProfiles = profiles;

  // derive filtered list (uses only real profiles)
  const filteredProfiles = (effectiveProfiles || []).filter((p) => {
    const q = (searchQuery || industrySearch || '').toString().trim().toLowerCase();
    if (!q) return true;
    const company = (p.CompanyName || p.ChatUserName || '').toString().toLowerCase();
    const location = `${p.City || ''} ${p.Country || ''}`.toLowerCase();
    return company.includes(q) || location.includes(q);
  });

  // helper for list view to open profile
  const openProfile = (id?: string) => {
    if (!id) return;
    router.push(`/profile/${add2040ToProfileDetailsId(Number(id))}`);
  };

  return (
    <div className="px-2 py-5 md:p-6">
      <div className="w-full hidden items-center gap-4 justify-between mb-6">
        <Hamburger className="hamburger-top-icon" />
        <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
          Profiles
        </h6>
        <Link href={'/profiles/new-profile'}>
          <button className="hidden md:flex px-4 py-3 rounded-md bg-omblue-500 text-white max-w-[170px] font-semibold">
            Add Profile
          </button>
        </Link>
        <Image
          src={currentUser?.ProfilePicture || BASE_URL}
          alt="user"
          width={32}
          height={32}
          className="rounded-full h-8 w-8 me-2"
        />
      </div>

      <div className="flex items-center flex-wrap xl:flex-nowrap justify-between gap-4 mb-2 bg-[#FFFFFF] p-5 shadow-[0px_4px_6px_-2px_#10182808,_0px_12px_16px_-4px_#10182814] rounded-[8px]">


        {/* <div className="ml-auto w-72">
          <input
            type="search"
            value={industrySearch}
            onChange={(e) => setIndustrySearch(e.target.value)}
            placeholder="Search by industry..."
            className="w-full border rounded px-3 py-2"
          />
        </div> */}
        {/* keep the rest of the controls */}
        <div className="w-full sm:w-[calc(50%-1rem)] xl:w-[calc(25%-1rem)] text-[#8D8D8D]">
          <label className="text-[#080808] text-[15px] 2xl:text-scaled-h8 font-[600] mb-1">
            Category
          </label>
          <CustomSelect
            placeholder="Select Category"
            options={[
              { value: 'Most contributions', label: 'Most contributions' },
              { value: 'Most reviews received', label: 'Most reviews received' },
              { value: 'Most reviews given', label: 'Most reviews given' },
              { value: 'Most followed', label: 'Most followed' },
              { value: 'Highest rating', label: 'Highest rating' },
              { value: 'Most discount used', label: 'Most discount used' },
              { value: 'Most chats', label: 'Most chats' },
              { value: 'Most favorited', label: 'Most favorited' },
            ]}
            onChange={setCategory}
            value={category}
            styles={{
              option: (baseStyles, state) => ({
                ...baseStyles,
                ':hover': {
                  backgroundColor: '#2357C6',
                  color: 'white',
                  fontWeight: 'bold',
                  paddingLeft: '10px'
                }
              })
            }}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-1rem)] xl:w-[calc(25%-1rem)] text-[#8D8D8D]">
          <label className="text-[#080808] text-[15px] 2xl:text-scaled-h8 font-[600] mb-1">
            Profile Type
          </label>
          <CustomSelect
            placeholder="Select Profile Type"
            options={[
              { value: 0, label: 'All' },
              ...profileTypes.map((type) => ({
                value: type.Id,
                label: type.UserProfileName,
              })),
            ]}
            onChange={setProfileType}
            value={profileType}
            styles={{
              menuList: (baseStyles) => ({
                ...baseStyles,
                maxHeight: 'none',
                overflowY: 'visible',
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                ':hover': {
                  backgroundColor: '#2357C6',
                  color: 'white',
                  fontWeight: 'bold',
                  paddingLeft: '10px'
                }
              })
            }}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-1rem)] xl:w-[calc(25%-1rem)] text-[#8D8D8D]">
          <label className="text-[#080808] text-[15px] 2xl:text-scaled-h8 font-[600] mb-1">
            Industry
          </label>
          <CustomSelect
            placeholder="Select Industry"
            options={[
              { value: null, label: 'All' },
              ...industries.map((industry) => ({
                value: industry,
                label: industry,
              })),
            ]}
            onChange={setIndustry}
            value={industry}
            components={{
              SingleValue: (props) => {
                const label = industry.label || '';
                const words = label.split(' ');
                const truncated =
                  words.length > 5 ? `${words.slice(0, 5).join(' ')}...` : label;
                return (
                  <components.SingleValue {...props}>
                    {truncated}
                  </components.SingleValue>
                );
              }
            }}
            styles={{
              menuList: (baseStyles) => ({
                ...baseStyles,
                maxHeight: `${availableHeight}px`,
                overflowY: 'auto',
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                ':hover': {
                  backgroundColor: '#2357C6',
                  color: 'white',
                  fontWeight: 'bold',
                  paddingLeft: '10px'
                }
              })
            }}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-1rem)] xl:w-[calc(25%-1rem)] text-[#8D8D8D]">
          <label className="text-[#080808] text-[15px] 2xl:text-scaled-h8 font-[600] mb-1">
            Location
          </label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            placeholder="Select Location"
            options={[
              { value: null, label: 'All' },
              ...locations.map((location) => ({
                value: location.LocationName,
                label: location.LocationName,
              })),
            ]}
            onChange={setLocation}
            value={location}
            styles={{
              menuList: (baseStyles) => ({
                ...baseStyles,
                maxHeight: `${availableHeight}px`,
                overflowY: 'auto',
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                ':hover': {
                  backgroundColor: '#2357C6',
                  color: 'white',
                  fontWeight: 'bold',
                  paddingLeft: '10px'
                }
              })
            }}
            isSearchable={true}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-1rem)] xl:w-[calc(25%-1rem)] text-[#8D8D8D]">
          <label className="text-[#080808] text-[15px] 2xl:text-scaled-h8 font-[600] mb-1">
            Timeframe
          </label>
          <CustomSelect
            placeholder="Select Timeframe"
            options={[
              { value: 'Today', label: 'Today' },
              { value: 'Last 7 days', label: 'Last 7 days' },
              { value: 'Last 30 days', label: 'Last 30 days' },
              { value: 'Last 365 days', label: 'Last 365 days' },
              { value: 'Last year', label: 'Last year' },
              { value: 'This month', label: 'This month' },
              { value: 'Last month', label: 'Last month' },
              { value: 'Last three months', label: 'Last three months' },
              { value: 'Last six months', label: 'Last six months' },
              { value: 'Last twelve months', label: 'Last twelve months' },
              { value: 'Last two years', label: 'Last two years' },
            ]}
            onChange={setTimeframe}
            value={timeframe}
            styles={{
              option: (baseStyles, state) => ({
                ...baseStyles,
                ':hover': {
                  backgroundColor: '#2357C6',
                  color: 'white',
                  fontWeight: 'bold',
                  paddingLeft: '10px'
                }
              })
            }}
          />
        </div>
      </div>



      <div className="flex flex-wrap p-4 bg-white border border-gray-200 rounded-lg gap-4 ">
        {/* View toggle + industry search (non-intrusive, small controls) */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center  justify-between gap-3">
          {/* Title + optional subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">Leaderboard</h1>
            {/* small subtitle line if needed */}
            {/* <p className="text-sm text-gray-500 mt-1">Your top profiles</p> */}
          </div>

          {/* Buttons container: stacked on mobile, inline on desktop */}
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button
              aria-label="Grid view"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 font-medium px-3 py-2 rounded ${viewMode === 'grid' ? 'bg-omblue-500 text-white' : 'bg-white border'}`}
            >
              <Grip className="w-4 h-4" /> <span className="">Card View</span>
            </button>

            <button
              aria-label="List view"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 font-medium px-3 py-2 rounded ${viewMode === 'list' ? 'bg-omblue-500 text-white' : 'bg-white border'}`}
            >
              <ListBulletIcon className="w-4 h-4" /> <span className="">List view</span>
            </button>
          </div>
        </div>

        {loader ? (
          <div className="flex flex-wrap gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <LeaderboardCardShimmer key={idx} />
            ))}
          </div>
        ) : filteredProfiles.length > 0 ? (
          viewMode === "grid" ? (
              filteredProfiles.slice(0, 10).map((profile, index) => (
                <div
                  key={profile.ProfileDetailId}
                  className="border-2  border-[#F9FAFB] rounded-md flex items-center justify-between gap-3 p-4 md:w-[calc(50%-0.5rem)] w-full flex-wrap sm:flex-nowrap md:flex-wrap xl:flex-nowrap shadow-[0px_0px_0px_1px_#EAF1FE,0px_1px_1px_0px_#1018280F,0px_1px_2px_0px_#1018281A]"
              >
                {/* RANK BADGE */}
                <div
                  className={`
                        px-3 py-1 rounded-[4px] gap-[4px] text-h10 font-semibold border
                        ${index === 0
                        ? "bg-[#FFF9D9] border-[#E5D99A] text-[#8D7A19]"
                        : index === 1
                          ? "bg-[#F1F4F6] border-[#B1BCD1] text-[#4C525F]"
                          : index === 2
                          ? "bg-[#FFE9D9] border-[#E5B99A] text-[#8D4919]"
                          : "bg-[#F0F7FD] border-[#9AB2E5] text-[#193E8D]"
                    }
                      `}
                >
                  #{index + 1}
                </div>

                {/* PROFILE IMAGE + NAME */}
                <div className="space-y-2 w-[calc(40%-1rem)] xl:w-[20%] flex flex-col items-center justify-center text-center">
                  <div className="inline-flex items-center justify-center relative w-16 h-16">
                    <Image
                      src={profile?.ProfilePicture || BASE_URL}
                      alt="profile"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="w-5 h-5 rounded-full border border-grey-600 absolute right-0 top-10">
                      <Image
                        src={flagUrls[profile.Country] || BASE_URL}
                        alt={profile.Country}
                        title={profile.Country}
                        width={200}
                        height={200}
                        className="w-5 h-5 object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <p
                    className="w-20 text-[13px] font-bold text-center text-[#080808] cursor-pointer hover:underline"
                    onClick={handleViewProfile(profile?.ProfileDetailId)}
                  >
                    {profile.CompanyName}
                  </p>
                </div>

                {/* LOCATION + RATING + REVIEWS */}
                <div className="space-y-3 w-[calc(50%-1rem)] xl:w-[40%]">
                  <div className="flex items-center gap-2">
                    <LocationPin className="w-6 h-6 text-[#2357C6]" />
                    <p className="text-[#0A193A] text-[14px] 2xl:text-scaled-h8 font-[500]">
                      {profile.City ? `${profile.City}, ` : ""} {profile.Country}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[#204FB4]">
                    <p className="text-[18px] 2xl:text-scaled-h8 font-[500]">
                      {profile.Rating}
                    </p>
                    <StarRatings
                      starDimension={"25px"}
                      rating={profile.Rating}
                      starRatedColor="#204FB4"
                      numberOfStars={5}
                      name="rating"
                      starSpacing="0px"
                      starHoverColor="#01AFD7"
                      svgIconViewBox="0 0 25 25"
                      svgIconPath="M21.9668 8.16346L21.9672..."
                      style={{ margin: "auto" }}
                    />
                  </div>
                  <button
                    className="flex items-center gap-0.5 text-[#0F2553]"
                    onClick={handleClick(profile?.ProfileDetailId)}
                  >
                    <p className="text-[14px] 2xl:text-scaled-h8 font-[500]">
                      {profile.Review} Reviews
                    </p>
                    <ChevronRight className="w-5 h-5 pt-1" />
                  </button>
                </div>

                {/* ACTION BUTTONS */}
                <div className="w-full sm:w-[40%] md:w-[100%] xl:w-[25%] flex gap-2 flex-row sm-ipad:flex-col sm:flex-col md:flex-row xl:flex-col">
                  <button
                    className="text-[#667085] w-full md:w-auto xl:w-full gap-1 flex items-center justify-center text-[14px] 2xl:text-scaled-h9 font-medium p-2.5"
                    onClick={() => setFavourite(profile, profile.IsFavouriteProfile)}
                  >
                    <Favourite
                      className="w-4 h-4"
                      fill={profile.IsFavouriteProfile ? "currentColor" : "white"}
                      stroke={profile.IsFavouriteProfile ? "currentColor" : "#667085"}
                    />
                    Favourites
                  </button>

                  <a
                    onClick={handleViewProfile(profile.ProfileDetailId)}
                    target="_blank"
                    className="text-[#204FB4] w-full md:w-auto xl:w-full gap-1 flex items-center justify-center text-[14px] 2xl:text-scaled-h9 font-[500] rounded-md border border-[#BBCBED] p-2.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#204FB4]" /> View Profile
                  </a>

                  <button
                    className="text-[#FBFBFD] bg-[#2357C6] w-full md:w-auto xl:w-full gap-1 flex items-center justify-center text-[14px] 2xl:text-scaled-h9 font-[500] rounded-md border border-[#BBCBED] p-2.5"
                    onClick={() => {
                      const payload = {
                        UserId: profile?.UserId,
                        ProfilePicture: profile?.ProfilePicture,
                        FullName: profile?.ChatUserName,
                      };
                      if (typeof window !== "undefined") {
                        localStorage.setItem("chatDetails", JSON.stringify(payload));
                      }
                      router.push("/chats");
                    }}
                  >
                    <MessageIcon className="w-4 h-4 text-[#FBFBFD]" />
                    Chat
                  </button>
                </div>
              </div>
            ))
            ) : (
              <div className="w-full">
                <ListView
                    items={filteredProfiles}
                    flagUrls={flagUrls}
                    onViewProfile={(id) => openProfile(id)}
                    onChat={(item) => {
                      if (item.IsDummy) return;
                      const payload = {
                        UserId: item?.UserId,
                        ProfilePicture: item?.ProfilePicture,
                        FullName: item?.ChatUserName || item?.CompanyName,
                      };
                      if (typeof window !== 'undefined') localStorage.setItem('chatDetails', JSON.stringify(payload));
                      router.push('/chats');
                    }}
                    onToggleFavourite={(item) => {
                      if (item.IsDummy) return;
                      setFavourite(item, item.IsFavouriteProfile);
                    }}
                  />
                </div>
              )
        ) : (
          <p className="w-full text-center">No Profile found</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;