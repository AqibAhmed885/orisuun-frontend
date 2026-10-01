'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const AllInOneTabs = ({ UserType }) => {
    const [activeTab, setActiveTab] = useState('Discover');
    const [openDropdown, setOpenDropdown] = useState('Customizable Public Profile Page');

    const tabs = [
        {
            name: 'Discover',
            iconWhite: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/ri_compass-discover-fill.png`,
            iconBlue: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/DiscoverBlue.png`,
            description: 'Find and get found with search, personalized feeds, and real-time community chats',
        },
        {
            name: 'Collab',
            iconWhite: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/CollaborateWhite.png`,
            iconBlue: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/streamline-flex_user-collaborate-group-remix.png`,
            description: 'Connect, team up, and grow together through chat, collaboration, and shared feedback',
        },
        {
            name: 'Do Business',
            iconWhite: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/DoBusinessWhite.png`,
            iconBlue: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/DoBusiness.png`,
            description: 'Build, fund, and formalize partnerships with trusted tools for doing real business',
        },
        {
            name: 'Grow',
            iconWhite: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/GrowWhite.png`,
            iconBlue: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/icons/Grow.png`,
            description: 'Fuel your growth with savings and community-powered funding',
        },
    ];

    const tabContent = {
        Discover: [
            {
                title: 'Customizable Public Profile Page',
                text: (
                    <>
                        <span className="text-sm text-gray-600 mb-3">
                            Increase your web presence with a beautiful, easy-to-follow profile designed to show potential clients and customers—on and off our site—what you can offer. Pages include:
                        </span>
                        <ul className="list-none text-sm space-y-2">
                            <li className="flex items-center gap-2 text-[#2357C6]">
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0013 2.16675C5.4013 2.16675 1.66797 5.90008 1.66797 10.5001C1.66797 15.1001 5.4013 18.8334 10.0013 18.8334C14.6013 18.8334 18.3346 15.1001 18.3346 10.5001C18.3346 5.90008 14.6013 2.16675 10.0013 2.16675ZM7.74297 14.0751L4.7513 11.0834C4.67415 11.0063 4.61295 10.9147 4.5712 10.8139C4.52944 10.7131 4.50795 10.605 4.50795 10.4959C4.50795 10.3868 4.52944 10.2788 4.5712 10.178C4.61295 10.0772 4.67415 9.98557 4.7513 9.90841C4.82845 9.83126 4.92005 9.77006 5.02085 9.72831C5.12165 9.68655 5.22969 9.66506 5.3388 9.66506C5.44791 9.66506 5.55595 9.68655 5.65675 9.72831C5.75756 9.77006 5.84915 9.83126 5.9263 9.90841L8.33464 12.3084L14.068 6.57508C14.2238 6.41927 14.4351 6.33173 14.6555 6.33173C14.8758 6.33173 15.0872 6.41927 15.243 6.57508C15.3988 6.7309 15.4863 6.94223 15.4863 7.16258C15.4863 7.38294 15.3988 7.59427 15.243 7.75008L8.91797 14.0751C8.84087 14.1523 8.7493 14.2136 8.64849 14.2554C8.54768 14.2973 8.43961 14.3188 8.33047 14.3188C8.22133 14.3188 8.11326 14.2973 8.01245 14.2554C7.91164 14.2136 7.82006 14.1523 7.74297 14.0751Z" fill="#447DFC" />
                                </svg>
                                <span className="text-gray-700">Ratings and reviews</span>
                            </li>
                            <li className="flex items-center gap-2 text-[#2357C6]">
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0013 2.16675C5.4013 2.16675 1.66797 5.90008 1.66797 10.5001C1.66797 15.1001 5.4013 18.8334 10.0013 18.8334C14.6013 18.8334 18.3346 15.1001 18.3346 10.5001C18.3346 5.90008 14.6013 2.16675 10.0013 2.16675ZM7.74297 14.0751L4.7513 11.0834C4.67415 11.0063 4.61295 10.9147 4.5712 10.8139C4.52944 10.7131 4.50795 10.605 4.50795 10.4959C4.50795 10.3868 4.52944 10.2788 4.5712 10.178C4.61295 10.0772 4.67415 9.98557 4.7513 9.90841C4.82845 9.83126 4.92005 9.77006 5.02085 9.72831C5.12165 9.68655 5.22969 9.66506 5.3388 9.66506C5.44791 9.66506 5.55595 9.68655 5.65675 9.72831C5.75756 9.77006 5.84915 9.83126 5.9263 9.90841L8.33464 12.3084L14.068 6.57508C14.2238 6.41927 14.4351 6.33173 14.6555 6.33173C14.8758 6.33173 15.0872 6.41927 15.243 6.57508C15.3988 6.7309 15.4863 6.94223 15.4863 7.16258C15.4863 7.38294 15.3988 7.59427 15.243 7.75008L8.91797 14.0751C8.84087 14.1523 8.7493 14.2136 8.64849 14.2554C8.54768 14.2973 8.43961 14.3188 8.33047 14.3188C8.22133 14.3188 8.11326 14.2973 8.01245 14.2554C7.91164 14.2136 7.82006 14.1523 7.74297 14.0751Z" fill="#447DFC" />
                                </svg>
                                <span className="text-gray-700">Business development opportunity posts</span>
                            </li>
                            <li className="flex items-center gap-2 text-[#2357C6]">
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0013 2.16675C5.4013 2.16675 1.66797 5.90008 1.66797 10.5001C1.66797 15.1001 5.4013 18.8334 10.0013 18.8334C14.6013 18.8334 18.3346 15.1001 18.3346 10.5001C18.3346 5.90008 14.6013 2.16675 10.0013 2.16675ZM7.74297 14.0751L4.7513 11.0834C4.67415 11.0063 4.61295 10.9147 4.5712 10.8139C4.52944 10.7131 4.50795 10.605 4.50795 10.4959C4.50795 10.3868 4.52944 10.2788 4.5712 10.178C4.61295 10.0772 4.67415 9.98557 4.7513 9.90841C4.82845 9.83126 4.92005 9.77006 5.02085 9.72831C5.12165 9.68655 5.22969 9.66506 5.3388 9.66506C5.44791 9.66506 5.55595 9.68655 5.65675 9.72831C5.75756 9.77006 5.84915 9.83126 5.9263 9.90841L8.33464 12.3084L14.068 6.57508C14.2238 6.41927 14.4351 6.33173 14.6555 6.33173C14.8758 6.33173 15.0872 6.41927 15.243 6.57508C15.3988 6.7309 15.4863 6.94223 15.4863 7.16258C15.4863 7.38294 15.3988 7.59427 15.243 7.75008L8.91797 14.0751C8.84087 14.1523 8.7493 14.2136 8.64849 14.2554C8.54768 14.2973 8.43961 14.3188 8.33047 14.3188C8.22133 14.3188 8.11326 14.2973 8.01245 14.2554C7.91164 14.2136 7.82006 14.1523 7.74297 14.0751Z" fill="#447DFC" />
                                </svg>
                                <span className="text-gray-700">Fundraising campaigns</span>
                            </li>
                            <li className="flex items-center gap-2 text-[#2357C6]">
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0013 2.16675C5.4013 2.16675 1.66797 5.90008 1.66797 10.5001C1.66797 15.1001 5.4013 18.8334 10.0013 18.8334C14.6013 18.8334 18.3346 15.1001 18.3346 10.5001C18.3346 5.90008 14.6013 2.16675 10.0013 2.16675ZM7.74297 14.0751L4.7513 11.0834C4.67415 11.0063 4.61295 10.9147 4.5712 10.8139C4.52944 10.7131 4.50795 10.605 4.50795 10.4959C4.50795 10.3868 4.52944 10.2788 4.5712 10.178C4.61295 10.0772 4.67415 9.98557 4.7513 9.90841C4.82845 9.83126 4.92005 9.77006 5.02085 9.72831C5.12165 9.68655 5.22969 9.66506 5.3388 9.66506C5.44791 9.66506 5.55595 9.68655 5.65675 9.72831C5.75756 9.77006 5.84915 9.83126 5.9263 9.90841L8.33464 12.3084L14.068 6.57508C14.2238 6.41927 14.4351 6.33173 14.6555 6.33173C14.8758 6.33173 15.0872 6.41927 15.243 6.57508C15.3988 6.7309 15.4863 6.94223 15.4863 7.16258C15.4863 7.38294 15.3988 7.59427 15.243 7.75008L8.91797 14.0751C8.84087 14.1523 8.7493 14.2136 8.64849 14.2554C8.54768 14.2973 8.43961 14.3188 8.33047 14.3188C8.22133 14.3188 8.11326 14.2973 8.01245 14.2554C7.91164 14.2136 7.82006 14.1523 7.74297 14.0751Z" fill="#447DFC" />
                                </svg>
                                <span className="text-gray-700">Pitch books, discounts, co-founder opportunities</span>
                            </li>
                        </ul>
                    </>
                ),
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/CustomizablePublicProfileFeatures.png`,
            },
            {
                title: 'Database Search & Explore Functionality',
                text: [
                    'Find exactly what you need or want around the globe – search our database of businesses, experts, professionals, and investors by industry, country, region, city, and many other parameters.',
                    'Our powerful Explore tool enables members to zero in on exact matches using tags, keywords, location, and a robust set of filter options.'
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/DatabaseSearchAndExploreFeatures.png`,
            },
            {
                title: 'Personalized Feed',
                text: [
                    'Stay on top of site activity as it happens, from new members to new discounts, fundraising campaigns, and leaderboard changes',
                    'Check and add events to the Global Black Business Events Calendar.',
                    'Stay up-to-date on the latest news from around the world most relevant to Black-owned businesses and the community around them',
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/PersonalisedFeedFeatures.png`,
            },
            {
                title: 'Leaderboard and Badges',
                text: [
                    'Demonstrate your commitment to supporting Black-owned businesses by climbing our leaderboards for most reviews, received or given, most conversations, most money raised, most connections or favourites, and so much more.',
                    'Show off your contributions and make sure your dedication is recognized.',
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/LeaderboardAndBadgesFeatures.png`,
            },
            {
                title: 'Global Black Business Calendar',
                text: [
                    'Stay up-to-date on all of the Black business events, conferences, meetups, webinars, workshops, grant deadlines, competitions, and launches/grand openings in your neighborhood and around the world.',
                    'Add the events to your personal calendar or keep track of them on the platform.'
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/GlobalBlackBusinessCalendarFeatures.png`,
            },
            {
                title: 'Community Chat',
                text: [
                    'You’re not the only one navigating this path. Subject-based communities on Orisuun connect you with others working through the same questions, goals, and challenges. Share your experience, get answers, and find new people to build with. It’s collaboration without cold calls.',
                    'Orisuun’s subject-based chat rooms let you connect instantly with others who share your goals—whether you’re seeking funding, marketing advice, or operational tips. Get feedback, share wins, and learn from people who’ve been where you are. It’s the fastest way to go from questions to connections—and from connections to progress.'
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/CommunityChatFeatures.png`,
            },
        ],
        Collab: [
            {
                title: 'Chat',
                text: [
                    'We have developed a secure messaging system within the platform, so you don’t have to take business off the platform. Chat one-on-one with mentors, investors, and business members, or join/create group chats.',
                    'Members can use the messaging system to send files of all types.'
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/ChatFeatures.png`,
            },
            {
                title: 'Form Teams',
                text: [
                    'Members can form teams to conduct business as a unit. Teams can create their own profile page to promote their collective offerings separate from their own profile offerings.',
                    'Team forming is meant to facilitate cooperation and expanded capabilities and reach. It’s perfect for investment clubs, professional services packages (e.g., legal and accounting services together), and business combinations.'
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/FormTeamsFeatures.jpg`,
            },
            {
                title: 'Feedback and Reviews',
                text: [
                    'Give and receive public or private reviews from members you have interacted with.'
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/FeedbackAndReviewsFeatures.png`,
            },
        ],
        'Do Business': [
            {
                title: 'Transactions and Escrow',
                text: [
                    'In-platform peer-to-peer payment system, so you can do business. Orisuun acts as "escrow agent" to ensure payment is made only after goods or services are received',
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/EscrowAndTransactionFeatures.png`,
            },
            {
                title: 'Business Development Matching',
                text: [
                    'Create searchable posts showcasing the business development opportunities you can facilitate or are seeking',
                    'Our AI-powered system will automatically search profiles and other business  development posts to find your match. Members can show interest in a post directly by "matching" with it'
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/BusinessDevelopmentMatchingFeatures.png`,
            },
            {
                title: 'Co-founder Matching',
                text: [
                    'Create searchable posts showcasing the co-founder opportunities you can facilitate or are seeking.',
                    'Our AI-powered system will automatically search profiles and other co-founder posts to find your match. Members can show interest in a post directly by "matching" with it',
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/CofounderMatchingFeatures.png`,
            },
            {
                title: 'Board Member Matching',
                text: [
                    'Create searchable posts showcasing the board member opportunities you can facilitate or are seeking.',
                    'Our AI-powered system will automatically search profiles and other board member posts to find your match. Members can show interest in a post directly by "matching" with it',
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/BoardMemberMatchingFeatures.png`
            }
        ],
        Grow: [
            {
                title: 'Discount Club - Partners',
                text: [
                    'Business members can lower their costs with exclusive discounts from popular vendors across all industries. Partner discounts target startups and established businesses as well as new and existing customers',
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/DiscountClubFeatures.png`,
            },
            {
                title: 'Crowdfunding',
                text: [
                    'Business members can launch a campaign to raise funds for new equipment, expansion, or new products. All other members can contribute directly to the campaign (99% of fund go directly to the business), sponsor the campaign (by matching donations for any period of time), or donate on a reward basis to receive rewards offered by the campaign owner for reaching certain contribution levels.',
                    'Campaigns are also open to the public and can be shared across the web',
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/CrowdfundingFeatures.png`,
            },
            {
                title: 'Discount Club - B2B & B2C',
                text: [
                    'Business members can incentivize new or existing customers with individualized discounts from their business. Whether you are a business with other businesses as customers or individuals as customers, you’ll find that the Discount Club is a great way to find a new set of loyal customers',
                ],
                image: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/features/DiscountClubBToBFeatures.png`
            }
        ],
    };

    const activeContent = tabContent[activeTab];

    return (
        <>
            {(UserType != 'professionals' && UserType != 'experts' && UserType != 'mentors' && UserType != 'strategy-consultants' && UserType != 'partners' && UserType != 'investors' && UserType != 'advocates') && (
                <>
                    <p className=' text-center text-[16px] font-semibold text-[#5B657B] mt-10'>How to build</p>
                    <p className=' text-center text-[38px] font-[450px] text-[#001E5F] mb-2'>Hard Parts of Business Made Easy</p>
                </>
            )}

            {/* Mobile View */}
            <div className="md:hidden px-4 space-y-6 mb-10">
                {tabs.map((tab) => (
                    <div key={tab.name} className="rounded-2xl shadow-lg p-4 border-[#E2E8F5] cursor-pointer">
                        <div
                            className={`${activeTab == tab.name ? 'bg-[#2357C6]' : 'bg-[#FDFDFE]'} p-7 rounded-xl`}
                            onClick={() => {
                                setActiveTab(tab.name);
                                setOpenDropdown(tabContent[tab.name]?.[0]?.title || '');
                            }}
                        >
                            <Image src={activeTab == tab.name ? tab.iconWhite : tab.iconBlue} alt={tab.name} width={45} height={45} />
                            <div>
                                <p className={`${activeTab === tab.name ? 'text-[#FFFFFF]' : 'text-[#212121]'} text-[18px] font-[500] mt-4`}>{tab.name}</p>
                                <p className={`${activeTab === tab.name ? 'text-[#EDEEF1]' : 'text-[#5B657B]'} text-[14px] font-[450] mt-1`}>{tab.description}</p>
                            </div>
                        </div>

                        {activeTab === tab.name && (
                            <div className="mt-4 space-y-2">
                                {tabContent[tab.name]?.map((item) => (
                                    <div key={item.title} className="border-[#E9EAED] border-b">
                                        <button
                                            className={`w-full px-4 py-3 flex justify-between items-center text-left text-[14px] ${openDropdown === item.title ? "font-semibold" : "font-medium"} text-[#1E1E1E]`}
                                            onClick={() =>
                                                setOpenDropdown(openDropdown === item.title ? '' : item.title)
                                            }
                                        >
                                            {item.title}
                                            <FaChevronDown
                                                className={`transition-transform duration-300 ${openDropdown === item.title ? 'rotate-180' : 'rotate-0'
                                                    }`}
                                            />
                                        </button>
                                        {openDropdown === item.title && (
                                            <div className="px-4 pb-4 text-[12px] font-[450] text-[#5B657B]">
                                                {Array.isArray(item.text)
                                                    ? item.text.map((para, idx) => (
                                                        <p key={idx} className="mb-2">
                                                            {para}
                                                        </p>
                                                    ))
                                                    : <div>{item.text}</div>}
                                                <div className="mt-4">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        width={500}
                                                        height={400}
                                                        className="rounded-lg w-full h-auto object-contain"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div >

            <div className="hidden md:flex pt-7 md:pt-20 lg:flex-row flex-col justify-center text-center lg:text-start w-[85%] mx-auto">
                <div className="pb-[50px] text-center lg:text-start">
                    {/* Tabs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {tabs.map((tab) => (
                            <div
                                key={tab.name}
                                onClick={() => {
                                    setActiveTab(tab.name);
                                    setOpenDropdown(tabContent[tab.name]?.[0]?.title || '');
                                }}
                                className={`rounded-lg p-7  cursor-pointer border transition ${activeTab === tab.name
                                    ? 'bg-[#2357C6] text-white border-[#E2E8F5] shadow-lg shadow-[#80808033]'
                                    : 'bg-[#FDFDFE] border-[#E2E8F5] text-gray-800'
                                    }`}
                            >
                                <div className="items-start gap-3">
                                    <Image src={activeTab === tab.name ? tab.iconWhite : tab.iconBlue} alt={tab.name} width={40} height={40} />
                                    <div>
                                        <h4 className="text-[20px] text-left font-semibold mt-2">{tab.name}</h4>
                                        <p className="text-[14px] mt-1 text-left opacity-80">{tab.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <section className="hidden md:block xl:pl-[40px] mt-[60px] bg-[#FCFCFC] rounded-[25px]">
                        <div className="flex flex-col lg:flex-row gap-10 pt-12">
                            {/* Left Dropdown */}
                            <div className="w-full lg:w-1/2 space-y-2">
                                {activeContent?.map((item) => (
                                    <div key={item.title} className="border-b">
                                        <button
                                            onClick={() => setOpenDropdown(openDropdown === item.title ? '' : item.title)}
                                            className={`w-full flex justify-between items-center text-left py-4 px-2 ${openDropdown === item.title ? "font-semibold" : "font-medium"} text-[#1C1C1C] hover:text-[#2357C6]`}
                                        >
                                            {item.title}
                                            <FaChevronDown
                                                className={`transition-transform duration-300 ${openDropdown === item.title ? 'rotate-180' : 'rotate-0'}`}
                                            />
                                        </button>
                                        {openDropdown === item.title && (
                                            <div className="md:px-4 px-2 pb-4 text-left text-sm text-[#5A6376] leading-relaxed">
                                                {Array.isArray(item.text) ? (
                                                    item.text.map((para, idx) => <p key={idx} className="mb-2">{para}</p>)
                                                ) : (
                                                    <span>{item.text}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Right Image */}
                            <div className="w-full lg:w-1/2">
                                {activeContent?.map((item) =>
                                    openDropdown === item.title ? (
                                        <Image
                                            key={item.title}
                                            src={item.image}
                                            alt={item.title}
                                            width={650}
                                            height={650}
                                        />
                                    ) : null
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AllInOneTabs;
