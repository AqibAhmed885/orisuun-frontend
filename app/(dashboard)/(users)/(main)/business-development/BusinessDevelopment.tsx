'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/utils';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import {
  getBusinessOpportunitySeekingList,
  getBusinessOpportunityFacilitateList,
  getUsersMatchedWithOpportunity,
  getRecommendedUsersForOpportunity,

} from '@/server-actions/businessDevelopment';
import ProfileCard from '@/components/cards/profile-card';
import ChevronRight from '@/icons/chevron-right';
import Crown from '@/icons/crown';
import message from '@/public/images/vector/message.svg';
import transfer from '@/public/images/vector/exhange.svg';
import cross from '@/public/images/vector/cross.svg';
import OpportunityCard from '@/components/cards/opportunity-card';
import { toast } from 'react-toastify';
import { getMatchedListBasedonBdId, getOpportunityVisitors } from '@/app/api/dashboard/businessDevelopment';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { BASE_URL } from '../../../../../public/defaultProfile/defaultProfile';
import Loader from '@/components/ui/loader';
import EmptyIcon from '@/icons/community/empty';
import Shimmer from '@/components/ui/shimmer'; // Add import
import { data } from '@/data/dashboard/discount-portal';
import ChatsIcon from '@/icons/sidebar/chats-icon';
import { useRouter } from 'next/navigation';
import { TypeIcons } from '@/utils/helper';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';

const BusinessDevelopment: React.FC = () => {
  const [selected, setSelected] = useState('Seeking');
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMobileMediaQuery();
  const [businessOpportunityList, SetBusinessOpportunityList] = useState([]);
  const [selectedOppourtunity, setSelectedOpportunity] = useState<string>('');
  const [selectedOppourtunityUserId, setSelectedOpportunityUserId] = useState<string>('');
  const [opportunityMatch, setOpportunityMatch] = useState([]);
  const [complementaryPosts, setComplementaryPosts] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [interestedLoading, setInterestedLoading] = useState(false); // Add for interested section
  const [complementaryLoading, setComplementaryLoading] = useState(false); // Add for complementary section
  const [suggestedLoading, setSuggestedLoading] = useState(false); // Add for suggested section
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));
  const router = useRouter();

  const fetchBusinessOppotunityLists = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const teamData = JSON.parse(localStorage.getItem('teamData'));
      const data = {
        UserId: (teamData && teamData?.isActive) ? teamData.teamId : userData?.Id,
      };


      if (selected === 'Seeking') {
        const response = await getBusinessOpportunitySeekingList(data);

        const seekingList = response?.data?.BDSeekingList;

        if (seekingList?.length > 0) {
          SetBusinessOpportunityList(seekingList);
          setSelectedOpportunity(seekingList[0]?.BDId);
          setSelectedOpportunityUserId(seekingList[0]?.UserId);
        } else {
          SetBusinessOpportunityList([]);
        }

      } else if (selected === 'Facilitate') {
        const response = await getBusinessOpportunityFacilitateList(data);
        const facilitateList = response?.data?.BDFacilitateList;
        if (facilitateList?.length > 0) {
          SetBusinessOpportunityList(facilitateList);
          setSelectedOpportunity(facilitateList[0]?.BDId);
          setSelectedOpportunityUserId(facilitateList[0]?.UserId);
        } else {
          SetBusinessOpportunityList([]);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Error while fetching data');
      console.error('Error fetching business opportunities:', error);
    }
    setIsLoading(false);
  }, [selected]);

  useEffect(() => {
    fetchBusinessOppotunityLists();
  }, [fetchBusinessOppotunityLists, selected]);


  useEffect(() => {
    (async () => {
      try {
        if (selectedOppourtunity && selectedOppourtunityUserId) {
          setInterestedLoading(true); // Set loading for interested
          const res = await getOpportunityVisitors(selectedOppourtunity);
          setOpportunityMatch(res?.Result?.RecentVisitors);
        }
      } catch (error) {
        setOpportunityMatch([]);
      } finally {
        setInterestedLoading(false); // Reset loading for interested
      }
    })()
  }, [selectedOppourtunity, selectedOppourtunityUserId])


  useEffect(() => {
    const fetchExtraSections = async () => {
      // Set loading for suggested
      try {
        // Implement APIs to return complementary posts and suggested users
        const [compRes, sugRes] = await Promise.all([
          getUsersMatchedWithOpportunity(selectedOppourtunity),
          getRecommendedUsersForOpportunity(selectedOppourtunity),
        ]);
        setComplementaryPosts(compRes?.data?.MatchedOpportunities);
        setSuggestedUsers(sugRes?.data);
      } catch (err) {
        console.error('fetchComplementaryAndSuggested error', err);
      }
    };
    fetchExtraSections();
  }, [selectedOppourtunity]);

  // helper tooltip component (inline)
  const Tooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="absolute left-0 -top-18 w-56 p-2 text-xs bg-gray-700 text-white rounded hidden group-hover:block z-10">
      {text}
    </div>
  );

  if (showDetails !== null) {
    return (
      <div className="px-4">
        <div className="md:hidden flex items-center justify-between py-4">
          <ChevronRight
            onClick={() => setShowDetails(null)}
            className="rotate-180 text-black-700"
          />
        </div>
        <div className="my-6">
          <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500 mb-6">
            Business Development Opportunity Matches
          </h6>
          <OpportunityCard
            id={showDetails}
            onClick={() => {
              if (isMobile) {
                setShowDetails(showDetails);
              }
            }}
            borderless
            selected={selected}
            SetBusinessOpportunityList={SetBusinessOpportunityList}
            selectedOpportunity={selectedOppourtunity}
            setSelectedOpportunity={setSelectedOpportunity}
            setSelectedOpportunityUserId={setSelectedOpportunityUserId}
          />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex w-full md:hidden flex-col items-center px-4 py-2"
              >
                <div className="w-full border border-grey-600 rounded-md px-4 py-3">
                  <div className="w-full flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <p className="text-h10 2xl:text-scaled-h10 font-semibold flex items-center text-black-500">
                        Market Penetration
                      </p>
                      <p className="text-h10 2xl:text-scaled-h10 font-medium flex items-center text-green-500">
                        Mutually Matched
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <ProfileCard
                      variant="sm"
                      name="Brooks Orozco"
                      company="Consultant"
                      image={BASE_URL}
                    />
                    <div className="flex items-center gap-2">
                      <button className="border border-blue-100 p-2 rounded-full">
                        <Image
                          src={message}
                          alt="message"
                          width={16}
                          height={16}
                        />
                      </button>
                      <button className="border border-danger-100 p-2 rounded-full">
                        <Image
                          src={cross}
                          alt="message"
                          width={16}
                          height={16}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="px-4 md:px-6 h-screen flex flex-col tracking-wide overflow-hidden">
      {/* {isLoading && <Loader />} */}
      <Header currentUser={currentUser} />

      <div className="flex-shrink-0 py-6">
        <Navigation selected={selected} setSelected={setSelected} />
      </div>

      <div className="flex-grow grid grid-cols-12 gap-6 overflow-hidden">
        <div className="col-span-12 md:col-span-4 flex flex-col border shadow-md bg-white px-2 md:px-4 rounded-t-lg overflow-hidden">
          <p className="py-4 pe-3 mb-2 text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold md:block hidden">
            {selected == "Seeking" ? "Opportunities We Are Seeking" : "Opportunities We Can Facilitate"}
          </p>
          <div className="flex-grow overflow-y-scroll custom-scroll">
            <div className="flex flex-col gap-4">
              {isLoading ? ( // Show shimmer cards while loading
                Array.from({ length: 3 }).map((_, index) => ( // Show 3 shimmer cards
                  <div key={index} className="rounded-md p-4 space-y-6 border border-grey-600">
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="space-y-2">
                        <Shimmer className="h-6 w-3/4 bg-black-100" /> {/* Title */}
                        <Shimmer className="h-4 w-1/2 bg-black-50" /> {/* Chip */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Shimmer className="h-8 w-8 rounded-full" /> {/* Edit button */}
                        <Shimmer className="h-8 w-8 rounded-full" /> {/* Delete button */}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mb-5">
                      <Shimmer className="h-6 w-6 rounded" /> {/* Icon */}
                      <div className="space-y-2">
                        <Shimmer className="h-4 w-1/2" /> {/* Location */}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mb-5">
                      <Shimmer className="h-6 w-6 rounded" /> {/* Icon */}
                      <div className="space-y-2">
                        <Shimmer className="h-4 w-3/4" /> {/* Industry */}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-5">
                      <Shimmer className="h-6 w-6 rounded" /> {/* Icon */}
                      <Shimmer className="h-4 w-1/2" /> {/* Timeline */}
                    </div>
                    <div className="flex items-center gap-2 mb-5">
                      <Shimmer className="h-6 w-6 rounded" /> {/* Icon */}
                      <Shimmer className="h-4 w-1/2" /> {/* Structure */}
                    </div>
                  </div>
                ))
              ) : businessOpportunityList?.length > 0 ? businessOpportunityList?.map((item, index) => (
                <OpportunityCard
                  key={index}
                  id={index}
                  opportunity={item}
                  onClick={() => {
                    if (isMobile) {
                      setShowDetails(index);
                    }
                  }}
                  selected={selected}
                  selectedOpportunity={selectedOppourtunity}
                  setSelectedOpportunity={setSelectedOpportunity}
                  setSelectedOpportunityUserId={setSelectedOpportunityUserId}
                  SetBusinessOpportunityList={SetBusinessOpportunityList}
                />
              )) : (
                <div className='inline-flex w-full min-h-[60vh] items-center p-10 mt-[44px] justify-center text-center'>
                  <div className='flex flex-col items-center'>
                    <EmptyIcon />
                    <p className='mt-4 text-sm font-medium'>Your Business Opportunity posts will appear here</p>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-8 rounded-t-lg border shadow-md bg-white px-2 md:px-4 md:flex hidden flex-col overflow-hidden">
          <h6 className="py-4 pe-3 mb-2 text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold">
            Business Development Opportunity Matches
          </h6>

          <div className="flex-grow flex flex-col overflow-hidden">
            <div className="grid grid-cols-5 bg-[#F2F6FF] text-[#0A193A] rounded-lg p-3">
              <div className="col-span-2 text-start text-h8 2xl:text-scaled-h8 font-semibold">Profile</div>
              <div className="col-span-2 text-start text-h8 2xl:text-scaled-h8 font-semibold">Status</div>
              <div className="text-start text-h8 2xl:text-scaled-h8 font-semibold">Actions</div>
            </div>

            <div className="flex-grow overflow-y-auto">
              {(interestedLoading || complementaryLoading || suggestedLoading) && (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, index) => ( // Show 6 shimmer rows
                    <div
                      key={index}
                      className="grid grid-cols-5 border-b border-grey-600 p-3 items-center"
                    >
                      <div className="col-span-2">
                        <div className="flex items-center gap-3">
                          <Shimmer className="h-10 w-10 rounded-full" /> {/* Profile Pic */}
                          <div className="space-y-2">
                            <Shimmer className="h-4 w-32" /> {/* Name */}
                            <Shimmer className="h-3 w-24" /> {/* Company */}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Shimmer className="h-4 w-20" /> {/* Status */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Shimmer className="h-8 w-8 rounded-full" /> {/* Action 1 */}
                        <Shimmer className="h-8 w-8 rounded-full" /> {/* Action 2 */}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Section 1 — Users who have shown interest */}
              {opportunityMatch?.length > 0 ? (
                <>
                  <div className="py-2 text-sm text-blue-500 font-semibold">
                    Users who have shown interest
                  </div>
                  {opportunityMatch.map((data, idx) => (
                    <div key={idx} className="grid grid-cols-5 border-b border-grey-600 p-3 items-center">
                      <div className="col-span-2">
                        <ProfileCard
                          variant="sm"
                          name={data?.VisitorFullName || data?.VisitorFullName}
                          company={data?.ProfileType}
                          icon={TypeIcons[data?.ProfileType]}
                          isImage={false}
                          image={`${data?.VisitorProfilePicture ? data?.VisitorProfilePicture : BASE_URL}`}
                        />
                      </div>

                      <div className={cn(
                        'col-span-2 text-h10 2xl:text-scaled-h10 font-medium flex items-center',
                        data?.IsBDCreatedUserProfileMatched ? 'text-green-500' : 'text-blue-500'
                      )}>
                        <div className="relative ml-2  group">
                          {data?.IsBDCreatedUserProfileMatched ? 'Mutually Matched' : 'Interested'}

                          {/* <Tooltip text={data?.IsBDCreatedUserProfileMatched ? 'Mutually Matched: you both confirmed the match' : 'Interested: user clicked match on this post'} /> */}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* show chat button only if not chatted yet */}
                        {!data?.HasChatted && (
                          <button className="border border-blue-100 p-2 rounded-full" onClick={() => {
                            router.push(`/chats`);
                          }}>
                            <Image src={message} alt="message" width={16} height={16} className="w-4 h-4" />
                          </button>
                        )}
                        {/* show mutual-match button only when not mutual */}

                        <button className="border border-blue-100 p-2 rounded-full"
                            onClick={() =>
                              router.push(
                                `/profile/${add2040ToProfileDetailsId(
                                  data?.profileId
                                )}`
                              )
                            }>

                            <ChevronRight className="w-4 h-4 text-blue-600" />
                          </button>
                      </div>
                    </div>
                  ))}
                </>

              ) : null}

              {/* Section 2 — Complementary Posts */}
              {complementaryPosts?.length > 0 ? (
                <>
                  <div className="py-2 text-sm text-blue-500 font-semibold">
                    Complementary Posts
                  </div>
                  {complementaryPosts.map((post, i) => (
                    <div key={i} className="grid grid-cols-5 border-b border-grey-600 p-3 items-center">

                      <div className="col-span-2">
                        <div className="text-h10 font-semibold">{post?.OpportunityName || post?.Title}</div>
                        <div className="text-sm text-gray-500">{post?.OpportunityType}</div>
                      </div>
                      <div className="col-span-2 text-h10 2xl:text-scaled-h10 font-medium text-green-600">Active</div>
                      <div className="flex items-center gap-2">
                        {/* <button
                          className="border border-blue-100 p-2 rounded-full"
                          onClick={() => {
                            // implement create interested entry for current user on this post
                            // e.g. handleCreateInterest(post)
                          }}
                          title="Match"
                        >
                          <Image src={transfer} alt="match" width={16} height={16} className="w-4 h-4" />
                        </button> */}

                        <button
                          className="border border-omblue-100 p-2 rounded-full"
                          onClick={() => {
                            router.push(`/business-development/${post?.OpportunityId}`);
                          }}
                          title="View Post"
                        >
                          <ChevronRight className="w-4 h-4 text-omblue-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : null
              }

              {/* Section 3 — Suggested Users */}
              {suggestedUsers?.length > 0 ? (
                <>

                  <div className="py-2 text-sm text-blue-500 font-semibold">
                    Suggested Users
                  </div>
                  {
                    suggestedUsers.map((user, i) => (
                      <div key={i} className="grid grid-cols-5 border-b border-grey-600 p-3 items-center">
                        <div className="col-span-2">
                          <ProfileCard
                            variant="sm"
                            name={user?.User?.CompanyName}
                            company={user?.ProfileType}
                            icon={TypeIcons[user?.ProfileType]}
                            isImage={false}
                            image={user?.User?.ProfilePicture || BASE_URL} />
                        </div>
                        <div className="col-span-2 text-h10 2xl:text-scaled-h10 font-medium text-gray-700">
                          {user?.Score ? ` ${user?.Score}%` : 'Profile Suggestion'}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="border border-omblue-100 p-2 rounded-full" onClick={() => {
                            router.push(`/chats`);
                          }}>
                            <Image src={message} alt="message" width={16} height={16} className="w-4 h-4" />
                          </button>
                          <button className="border border-blue-100 p-2 rounded-full"
                            onClick={() =>
                              router.push(
                                `/profile/${add2040ToProfileDetailsId(
                                  user?.User?.Id
                                )}`
                              )
                            }>

                            <ChevronRight className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                </>
              ) : null}

              {!(interestedLoading || complementaryLoading || suggestedLoading) &&
                opportunityMatch?.length === 0 &&
                complementaryPosts?.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 h-full text-base">
                    <EmptyIcon />
                    <p className="mt-4  font-medium">Your matches will appear here</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDevelopment;
