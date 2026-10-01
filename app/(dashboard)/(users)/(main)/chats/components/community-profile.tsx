import React from 'react';
import { Menu } from '@headlessui/react';
import Image from 'next/image';
import getRolesIcon from '@/icons/chats/role-icons';

interface CommunityMember {
  Id: string;
  UserId: string;
  UserName: string;
  UserEmail: string;
  JoinedDate: string;
  IsAdmin: boolean;
  IsActive: boolean;
}

interface Community {
  id: string;
  name: string;
  avatar: string;
  lastSender: string;
  lastMessage: string;
  time: string;
  isVerified: boolean;
  members?: CommunityMember[]; // <-- Add this
  createdBy?: string;
  createdByName?: string;
  createdByProfilePicture?: string;
  createdByCountry?: string;
  CreatedByUserType?: string;
  City?: string;
  Country?: string;
}

interface CommunityProfileProps {
  community: Community;
  isMobile?: boolean;
  onBack?: () => void;
}

const CommunityProfile: React.FC<CommunityProfileProps> = ({
  community,
  isMobile = false,
  onBack
}) => {

  


  const [topCommentsFilter, setTopCommentsFilter] = React.useState<'Most Loved' | 'Most Approved' | 'Most Disapproved' | 'Funniest Comments'>('Most Loved');

  const admins = [
    // Creator as admin
    ...(community.createdBy
      ? [{
        id: community.createdBy,
        name: community.createdByName,
        avatar: community.createdByProfilePicture,
        isVerified: true,
        location: community.City,
        country: community.Country,
        role: community.CreatedByUserType,
      }]
      : []),
    // Other admins from members
    ...(community.members
      ? community.members
        .filter(m => m.IsAdmin)
        .map(m => ({
          id: m.UserId,
          name: m.UserName,
          avatar: community.createdByProfilePicture, // or use member avatar if available
          isVerified: true,
          location: community.City,
          country: community.Country,
          role: 'Admin',
        }))
      : [])
  ];

  const topComments = [
    { id: '1', name: 'Savannah Nguyen', avatar: '/api/placeholder/32/32', isVerified: true, likes: 1267, time: '12:15 PM', location: 'San Francisco, CA', country: 'US', role: 'Business' },
    { id: '2', name: 'Wade Warren', avatar: '/api/placeholder/32/32', isVerified: true, likes: 1260, time: '09:15 PM', location: 'Atlanta, GA', country: 'US', role: 'Investor' },
  ];

  const getFlagImgForCountry = (country?: string) => {
    if (!country) return null;
    const cc = country.toLowerCase();
    // use SVG for crisp rendering
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://flagcdn.com/${cc}.svg`}
        alt={country}
        className="w-4 h-3 object-cover rounded-sm"
      />
    );
  };

  return (
    <div className={`bg-white h-full w-full md:w-80 flex flex-col ${isMobile ? 'hidden' : ''}`}>
      {/* {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <h2 className="text-lg font-semibold">Community Info</h2>
          <div></div>
        </div>
      )} */}

      <div className="flex-1 overflow-y-auto p-2 space-y-3">

        {/* Members Section */}
        <div className="rounded-lg p-4  "
          style={{
            boxShadow: '0px 2px 4px 2px #1018280F, 2px 0px 8px 2px #1018281A, 2px 0px 8px 2px #1018281A'
          }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">2,375,222 members</h3>
              <p className="text-xs text-[#475467]">Including Ayushi, SENDHI and 296 other connections</p>
            </div>
          </div>
          <div className="flex -space-x-3 mb-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white"></div>
            ))}
            <span className="ml-3 text-sm text-gray-600">+5</span>
          </div>
          <button className="text-blue-600 text-sm font-medium border border-blue-50 hover:bg-blue-200 rounded-md px-2 py-1">
            See members
          </button>
        </div>

        {/* Admins Section */}
        <div className=" rounded-lg p-4 bg-gray-50  "
          style={{
            boxShadow: '0px 2px 4px 2px #1018280F, 2px 0px 8px 2px #1018281A, 2px 0px 8px 2px #1018281A'
          }}>
          <h3 className="text-base font-semibold text-gray-800 ">Admins</h3>
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="flex justify-between space-x-4">
                  {admin.avatar ? (
                    <Image
                      src={admin.avatar }
                      alt={admin.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 "></div>
                  )}
                <div className="flex-1">
                  <div className="flex space-x-2">
                    <span className="font-semibold text-base text-nowrap text-gray-800">{admin.name}</span>
                    {admin.isVerified && (
                      <Image
                        src="/chat/verified.svg"
                        alt="Verified"
                        width={16}
                        height={16}
                      />
                    )}
                    <span className="inline-flex items-center gap-2 bg-[#F5FAFF] border border-[#D1E9FF] text-blue-700 px-2 py-1 rounded-full text-xs">
                      {getRolesIcon(admin.role)}
                      {admin.role}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {getFlagImgForCountry(admin.country)}
                    <span>{admin.location}</span>
                  </div>
                  <span className="text-sm text-gray-500 rounded-md shadow-price bg-white border border-gray-200  px-2 py-1">Creator</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Comments Section */}
        <div className=" rounded-lg p-4 "
          style={{
            boxShadow: '0px 2px 4px 2px #1018280F, 2px 0px 8px 2px #1018281A, 2px 0px 8px 2px #1018281A'
          }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">Top Comments</h3>
            <div className="relative inline-block text-left">
              <Menu as="div" className="relative inline-block text-left ">
                <div>
                  <Menu.Button className="px-3 py-1 text-xs bg-white border w-36 f rounded-md flex items-center justify-between gap-2">
                    {topCommentsFilter}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Menu.Button>
                </div>

                <Menu.Items className="absolute right-0 mt-2 w-36  bg-white border rounded-md  z-10">
                  {(['Most Loved', 'Most Approved', 'Most Disapproved', 'Funniest Comments'] as const).map((opt) => (
                    <Menu.Item key={opt}>
                      {({ active }) => (
                        <button
                          onClick={() => setTopCommentsFilter(opt as any)}
                          className={`w-full text-left px-2 py-1.5 text-xs ${active ? 'bg-gray-100' : ''}`}
                        >
                          {opt}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>
            </div>
          </div>
          <div className="space-y-4">
            {topComments.map((comment) => (
              <div key={comment.id} className="flex  space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-800">{comment.name}</span>
                    {comment.isVerified && (
                      <Image
                        src="/chat/verified.svg"
                        alt="Verified"
                        width={14}
                        height={14}
                      />
                    )}
                    <span className="text-xs text-gray-500">{comment.time}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-2 bg-[#F5FAFF] border border-[#D1E9FF] text-blue-700 px-2 py-1 rounded-full text-xs">
                      {getRolesIcon(comment.role)}
                      {comment.role}
                    </span>
                    {getFlagImgForCountry(comment.country)}
                    <span>{comment.location}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. .
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      className="flex items-center space-x-1 px-1.5 py-0.5 shadow-price bg-white border border-gray-200  hover:bg-gray-50 rounded-full text-sm"
                    >
                      <Image src={`/chat/heart.png`} alt="like" width={12} height={12} />
                      <span className="text-gray-600 text-xs">{20}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Stats Section */}
        <div className="rounded-lg p-4  "
          style={{
            boxShadow: '0px 2px 4px 2px #1018280F, 2px 0px 8px 2px #1018281A, 2px 0px 8px 2px #1018281A'
          }}>
          <h3 className="text-base font-semibold text-gray-800 mb-4">Your Stats</h3>
          <div className="flex justify-between space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="flex space-x-2">
                <span className="font-semibold text-gray-800">Yasmin</span>
                  <Image
                    src="/chat/verified.svg"
                    alt="Verified"
                    width={16}
                    height={16}
                  />
                <span className="inline-flex items-center gap-2 bg-[#F5FAFF] border border-[#D1E9FF] text-blue-700 px-2 py-1 rounded-full text-xs">
                  {getRolesIcon('Business')}
                  Business
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {getFlagImgForCountry('US')}
                <span>California</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-gray-600 mt-2">
            <div className="flex justify-between text-xs">
              <span className=" ">Number of interactions</span>
              <span className="">20,458 likes</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="">Number of Comments</span>
              <span className="">269 comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfile;
