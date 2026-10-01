'use client';

import React, { useRef, useState, useEffect } from 'react';
import ProfileCard from './profile-card';
import ChevronRight from '@/icons/chevron-right';
import Favourite from '@/icons/favourite';
import Image from 'next/image';
import favourite from '@/public/images/vector/favourite.svg';
import Crown from '@/icons/crown';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { TypeIcons } from '@/utils/helper';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import Accordion from '@/components/ui/accordian';
import NoChat from '@/icons/feeds/no-chat';
import Button from '@/components/ui/button';
import NoFavourites from '@/icons/feeds/no-favourites';
import Dropdown from '@/components/ui/dropdown';
import { AccordianSkeletonList } from '@/components/feed-card-skeleton/accordianSkeleton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/data/store';
import { addFavouriteProfiles } from '@/data/slices/user-slice';
import { getFavouriteProfiles, unfavouriteProfile } from '../../../../../api/dashboard/dashboard';
const tabs = [
  { 0: 'All' },
  { 3: 'Experts' },
  { 2: 'Consultants' },
  { 6: 'Professionals' },
  { 1: 'Businesses' },
  { 8: 'Mentors' },
];

const Favourites: React.FC = () => {
  const router = useRouter();
  const favouriteProfiles: any[] = useSelector(
    (state: RootState) => state?.user?.favouriteProfiles
  );
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [selectedItem, setSelectedItem] = useState(tabs[0]);
  const [loading, setLoading] = useState(true);

  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const teamData = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('teamData'));

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const nextIndex = (currentIndex + 1) % tabs.length;
      const tabElement = tabRefs.current[nextIndex];

      if (tabElement) {
        tabElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });

        setCurrentIndex(nextIndex);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            const index = Number(entry.target.dataset.index);
            if (!isNaN(index)) {
              setCurrentIndex(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentTabRefs = tabRefs.current;

    Object.values(currentTabRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentTabRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem('userData'))?.Id;
      const result = await getFavouriteProfiles(userId, Object.keys(selectedItem)[0]);
      dispatch(addFavouriteProfiles(result));
      setLoading(false);
    };
    fetchProfiles();
  }, [selectedItem]);

  const setUnFavourite = async (profile) => {
    const success = await unfavouriteProfile(profile?.FavouriteId, (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id);
    if (success) {
      const filterData = favouriteProfiles?.filter(
        (profileData) => profileData?.ProfileId !== profile?.ProfileId
      );
      dispatch(addFavouriteProfiles(filterData));
    }
  };


  return (
    <Accordion
      title="Favourites"
      bodyClasses={`text-gray-700 flex flex-col gap-3  ${loading && '!px-0'}`}
      headerClasses={`${loading && '!px-4'}`}
      className={`${favouriteProfiles?.length > 0 && '!pb-4'} ${loading && '!px-0'
        }`}
    >
      <Dropdown
        items={tabs}
        selected={selectedItem}
        onSelect={setSelectedItem}
        renderItem={(item) => Object.values(item)[0]}
        placeholder="Select an option"
        className={`w-full h-[50px] 3xl:h-12 ${loading && '!px-4'}`}
        wrapperClass="w-full h-full flex items-center justify-between  rounded-md px-4 cursor-pointer"
      />
      {loading ? (
        <AccordianSkeletonList />
      ) : favouriteProfiles?.length > 0 ? (
        <div className="flex items-center gap-3 flex-wrap overflow-y-scroll hide-scrollbar">
          <div className="flex items-center gap-3 max-h-[278px] 3xl:max-h-72 w-full flex-wrap overflow-y-scroll hide-scrollbar">
            {favouriteProfiles?.length > 0 &&
              favouriteProfiles?.map((favouriteProfile, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 border w-full min-h-[60px] 3xl:h-16 border-grey-600 rounded-md px-4 py-3 cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/profile/${add2040ToProfileDetailsId(
                        favouriteProfile?.ProfileId
                      )}`
                    )
                  }
                >
                  <ProfileCard
                    image={`${!!favouriteProfile?.ProfilePicture
                      ? favouriteProfile?.ProfilePicture
                      : 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png'
                      } `}
                    name={favouriteProfile?.CompanyName}
                    company={favouriteProfile?.ProfileType}
                    variant="sm"
                    icon={TypeIcons[favouriteProfile.ProfileType]}
                    isImage={false}
                    profileId={favouriteProfile.ProfileId}
                    chatDetails={favouriteProfile}
                  />
                  <button
                    className="border flex justify-center items-center min-w-8 max-w-8 min-h-8 max-h-8 rounded-full border-omblue-700 bg-olblue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUnFavourite(favouriteProfile);
                    }}
                  >
                    <Favourite className="text-omblue-700" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-3">
          <div className="flex flex-col gap-5">
            <NoFavourites className=" 3xl:w-36 3xl:h-36" />
            <p className="text-h9 2xl:text-scaled-h9 max-w-[9.25rem] text-center text-[#393939] mx-auto">
              Your favourited profiles will appear here
            </p>
          </div>
          <Button
            title="Browse Profiles"
            className="text-sm h-9 !min-w-36 3xl:!min-w-40 w-max m-0"
            onClick={() =>
              router.push(
                '/profile-search/search-results?searchQuery=&city=&profileType=1'
              )
            }
          />
        </div>
      )}
    </Accordion>
  );
};

export default Favourites;
