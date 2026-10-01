'use client';

import Image from 'next/image';
import { useState } from 'react';

const AllInOneTabs = ({ UserType }) => {
    const [activeTab, setActiveTab] = useState('Discover');
    const [openDropdown, setOpenDropdown] = useState('Customizable Public Profile Page');

    const tabs = [
        {
            name: 'Discover',
            iconWhite: '/home/icons/ri_compass-discover-fill.png',
            iconBlue: '/home/icons/DiscoverBlue.png',
            description: 'Find and get found with search, personalized feeds, and real-time community chats',
        },
        {
            name: 'Collab',
            iconWhite: '/home/icons/CollaborateWhite.png',
            iconBlue: '/home/icons/streamline-flex_user-collaborate-group-remix.png',
            description: 'Connect, team up, and grow together through chat, collaboration, and shared feedback',
        },
        {
            name: 'Do Business',
            iconWhite: '/home/icons/DoBusinessWhite.png',
            iconBlue: '/home/icons/DoBusiness.png',
            description: 'Build, fund, and formalize partnerships with trusted tools for doing real business',
        },
        {
            name: 'Grow',
            iconWhite: '/home/icons/GrowWhite.png',
            iconBlue: '/home/icons/Grow.png',
            description: 'Fuel your growth with savings and community-powered funding',
        },
    ];

    const tabContent = {
        Discover: [
            {
                title: 'Customizable Public Profile Page',
                text: (
                    <>
                        <span className="text-base text-gray-600 mb-3">
                            Increase your web presence with a beautiful, easy-to-follow profile designed to show potential clients and customers—on and off our site—what you can offer. Pages include:
                        </span>
                        <ul className="list-none text-base mt-4 space-y-2">
                            <li className="flex items-center gap-2 text-[#337DD4]">
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#447DFC" />
                                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#337DD4" />
                                </svg>
                                <span className="text-gray-700">Ratings and reviews</span>
                            </li>
                            <li className="flex items-center gap-2 text-[#337DD4]">
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#447DFC" />
                                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#337DD4" />
                                </svg>

                                <span className="text-gray-700">Business development opportunity posts</span>
                            </li>
                            <li className="flex items-center gap-2 text-[#337DD4]">
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#447DFC" />
                                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#337DD4" />
                                </svg>

                                <span className="text-gray-700">Fundraising campaigns</span>
                            </li>
                            <li className="flex items-center gap-2 text-[#337DD4]">
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#447DFC" />
                                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#337DD4" />
                                </svg>
                                <span className="text-gray-700">Pitch books, discounts, co-founder opportunities</span>
                            </li>
                        </ul>
                    </>
                ),
                image: '/homepage-new/tabs/discover/profile.svg',
            },
            {
                title: 'Database Search & Explore Functionality',
                text: [
                    'Find exactly what you need or want around the globe – search our database of businesses, experts, professionals, and investors by industry, country, region, city, and many other parameters.',
                    'Our powerful Explore tool enables members to zero in on exact matches using tags, keywords, location, and a robust set of filter options.'
                ],
                image: '/homepage-new/tabs/discover/database.svg',
            },
            {
                title: 'Personalized Feed',
                text: [
                    'Stay on top of site activity as it happens, from new members to new discounts, fundraising campaigns, and leaderboard changes',
                    'Check and add events to the Global Black Business Events Calendar.',
                    'Stay up-to-date on the latest news from around the world most relevant to Black-owned businesses and the community around them',
                ],
                image: '/homepage-new/tabs/discover/feed.svg',
            },
            {
                title: 'Leaderboard and Badges',
                text: [
                    'Demonstrate your commitment to supporting Black-owned businesses by climbing our leaderboards for most reviews, received or given, most conversations, most money raised, most connections or favourites, and so much more.',
                    'Show off your contributions and make sure your dedication is recognized.',
                ],
                image: '/homepage-new/tabs/discover/leaderboard.svg',
            },
            {
                title: 'Global Black Business Calendar',
                text: [
                    'Stay up-to-date on all of the Black business events, conferences, meetups, webinars, workshops, grant deadlines, competitions, and launches/grand openings in your neighborhood and around the world.',
                    'Add the events to your personal calendar or keep track of them on the platform.'
                ],
                image: '/homepage-new/tabs/discover/events.svg',
            },
            {
                title: 'Community Chat',
                text: [
                    'You’re not the only one navigating this path. Subject-based communities on Orisuun connect you with others working through the same questions, goals, and challenges. Share your experience, get answers, and find new people to build with. It’s collaboration without cold calls.',
                    'Orisuun’s subject-based chat rooms let you connect instantly with others who share your goals—whether you’re seeking funding, marketing advice, or operational tips. Get feedback, share wins, and learn from people who’ve been where you are. It’s the fastest way to go from questions to connections—and from connections to progress.'
                ],
                image: '/homepage-new/tabs/discover/community.svg',
            },
        ],
        Collab: [
            {
                title: 'Chat',
                text: [
                    'We have developed a secure messaging system within the platform, so you don’t have to take business off the platform. Chat one-on-one with mentors, investors, and business members, or join/create group chats.',
                    'Members can use the messaging system to send files of all types.'
                ],
                image: '/homepage-new/tabs/collab/chat.svg',
            },
            {
                title: 'Form Teams',
                text: [
                    'Members can form teams to conduct business as a unit. Teams can create their own profile page to promote their collective offerings separate from their own profile offerings.',
                    'Team forming is meant to facilitate cooperation and expanded capabilities and reach. It’s perfect for investment clubs, professional services packages (e.g., legal and accounting services together), and business combinations.'
                ],
                image: '/homepage-new/tabs/collab/teams.svg',
            },
            {
                title: 'Feedback and Reviews',
                text: [
                    'Give and receive public or private reviews from members you have interacted with.'
                ],
                image: '/homepage-new/tabs/collab/feedback.svg',
            },
        ],
        'Do Business': [
            {
                title: 'Transactions and Escrow',
                text: [
                    'In-platform peer-to-peer payment system, so you can do business. Orisuun acts as "escrow agent" to ensure payment is made only after goods or services are received',
                ],
                image: '/homepage-new/tabs/business/transactions.svg',
            },
            {
                title: 'Business Development Matching',
                text: [
                    'Create searchable posts showcasing the business development opportunities you can facilitate or are seeking',
                    'Our AI-powered system will automatically search profiles and other business  development posts to find your match. Members can show interest in a post directly by "matching" with it'
                ],
                image: '/homepage-new/tabs/business/business-development.svg',
            },
            {
                title: 'Co-founder Matching',
                text: [
                    'Create searchable posts showcasing the co-founder opportunities you can facilitate or are seeking.',
                    'Our AI-powered system will automatically search profiles and other co-founder posts to find your match. Members can show interest in a post directly by "matching" with it',
                ],
                image: '/homepage-new/tabs/business/cofounder.svg',
            },
            {
                title: 'Board Member Matching',
                text: [
                    'Create searchable posts showcasing the board member opportunities you can facilitate or are seeking.',
                    'Our AI-powered system will automatically search profiles and other board member posts to find your match. Members can show interest in a post directly by "matching" with it',
                ],
                image: '/homepage-new/tabs/business/board-member.svg'
            },
            //booking system meber can book the meetin directly through the platform and pay for it through our in-platform payment system
            {
                title: 'Booking System ',
                text: [
                    'Members can book meetings directly through the platform and pay for it through our in-platform payment system. This is perfect for booking consultations with professionals, meetings with investors, or any other business meeting that requires scheduling and payment.',
                    'Members can create a booking post showcasing the meeting they are offering or seeking. Our AI-powered system will automatically search profiles and other booking posts to find your match. Members can show interest in a post directly by "matching" with it',
                ],
                image: '/homepage-new/tabs/business/booking.svg'
            }
        ],
        Grow: [
            {
                title: 'Discount Club - Partners',
                text: [
                    'Business members can lower their costs with exclusive discounts from popular vendors across all industries. Partner discounts target startups and established businesses as well as new and existing customers',
                ],
                image: '/homepage-new/tabs/grow/partners.svg',
            },
            {
                title: 'Crowdfunding',
                text: [
                    'Business members can launch a campaign to raise funds for new equipment, expansion, or new products. All other members can contribute directly to the campaign (99% of fund go directly to the business), sponsor the campaign (by matching donations for any period of time), or donate on a reward basis to receive rewards offered by the campaign owner for reaching certain contribution levels.',
                    'Campaigns are also open to the public and can be shared across the web',
                ],
                image: '/homepage-new/tabs/grow/funding.svg',
            },
            {
                title: 'Discount Club - B2B & B2C',
                text: [
                    'Business members can incentivize new or existing customers with individualized discounts from their business. Whether you are a business with other businesses as customers or individuals as customers, you’ll find that the Discount Club is a great way to find a new set of loyal customers',
                ],
                image: '/homepage-new/tabs/grow/discount-club.svg'
            }
        ],
    };

    const activeContent = tabContent[activeTab];
    const selectedImageItem = activeContent?.find((item) => item.title === openDropdown) ?? activeContent?.[0];

    
    return (
        <div className="w-full bg-[#E9F2FF96] md:bg-transparent rounded-t-[24px] md:pt-0 pt-6">
        
        <section  className="md:bg-[#E9F2FF96] bg-[#D4DFEC] md:rounded-t-[150px] rounded-t-[75px] md:py-10 pt-6 md:mt-2 z-20">
            {(UserType != 'professionals' && UserType != 'experts' && UserType != 'mentors' && UserType != 'strategy-consultants' && UserType != 'partners' && UserType != 'investors' && UserType != 'advocates') && (
                <>
                    <p className='all-in-one-heading mx-auto max-w-[1180px] text-center text-2xl font-normal leading-[1.08] tracking-normal text-[#0F1116] md:text-[42px] '>
                        A{' '}
                        <span className="relative inline-block mx-1">
                            <svg
                                width="430"
                                height="50"
                                viewBox="0 0 430 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute w-full  z-0 md:top-0 -top-3"
                                // aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M298.92 3.02C283.82 2.55 271.12 2.05 264.56 1.61C251.6 0.74 220.88 1.12 196.29 2.45C177.4 3.47 146.43 6.02 118.31 8.65C110.45 8.47 102.48 8.24 94.63 7.97C24.49 5.52 15.49 5.88 11.94 11.34C8.27 16.99 8.25 17.47 11.76 17.64C12.72 17.69 13.71 18.03 14.55 18.55C12.99 19.33 12.08 20.26 11.39 21.38C11.24 21.63 11.09 21.87 10.95 22.1C5.55 20.56 4.77 21.43 5.64 27.64C5.84 29.03 5.82 30.63 5.63 32.27C5.1 32.83 4.96 33.82 5.07 35.36C4.55 37.5 3.76 39.52 2.79 41.01C-0.83 46.58 -0.73 47.05 4.21 47.71L4.44 47.74C4 49.15 3.44 50.45 2.8 51.5C-0.72 57.24 -0.61 57.71 4.34 58.12C7.27 58.37 10.4 58.39 11.3 58.17C12.04 57.99 14.58 60.72 17.36 64.58C15.23 65.07 15.95 65.84 18.98 67.69C19.31 67.89 19.63 68.1 19.94 68.33C21.41 70.36 22.97 72.02 24.61 73.3C26.32 76.04 26.62 78.52 24.47 78.64C18.17 79 25.94 85.82 40.6 92.79C56.54 100.38 57.43 100.39 135.17 93.41C151.73 91.92 168.77 90.2 184.23 88.49C192.92 89.05 203.43 89.52 214.18 89.84C222.34 90.48 230.62 91.03 238.31 91.43C283.7 93.8 397.13 94.91 382.02 92.83C369.16 91.06 375.86 87.38 396.2 85.04C406.68 83.84 415.65 81.11 416.13 78.99C416.61 76.86 419.79 75.26 423.2 75.43C427.82 75.66 429.43 73.87 429.53 68.44C429.57 66.37 429.3 64.73 428.61 63.38C429.49 62.23 429.85 60.45 429.85 57.85C429.85 52.94 428.19 50.53 423.2 48.78C425.39 48.68 425.88 48.3 424.92 47.32C425.61 46.43 425.52 44.67 424.98 41.64C424.8 40.61 424.73 39.45 424.76 38.23C425.53 37.98 425.52 37.58 424.82 36.92C425.07 33.72 425.95 30.33 427.24 28.01C430.54 22.07 430.42 21.61 425.59 21.47C422.94 21.4 420.13 21.52 419.04 21.75C418.29 20.4 416.26 18.51 413.2 16.31C412.49 15.39 411.76 14.38 411.03 13.33C406.9 7.35 402.14 4.45 396.77 4.63C395.57 4.67 394.02 4.7 392.16 4.71C381.08 0.44 367.67 0.81 303.76 2.83C302.1 2.89 300.51 2.95 298.92 3.02Z"
                                    fill="#BAD9FF"
                                />
                            </svg>
                            <span className="relative z-10">better way</span>
                        </span>{' '}
                        to connect with the
                        <br />
                        Black business community
                    </p>
                    <p className='all-in-one-heading mt-2.5 flex flex-col items-center text-center text-sm leading-[1.35] text-[#5B657B] md:text-base'>
                        <span>Our tools make it easy to build real relationships that move you forward</span>
                        <span>Check out our tools</span>
                    </p>
                </>
            )}


            <div className="flex md:pt-10 pt-4 lg:flex-row flex-col justify-center text-center lg:text-start md:w-[85%] mx-auto">
                <div className="md:pb-[50px] text-center lg:text-start">
                    {/* Tabs */}
                    <div className="all-in-one-desktop-animate w-full flex justify-center">
                        <div className="md:w-[990px] w-full rounded-full md:border-[0.5px] border-[#4C73A1]  transition-all duration-300 ease-out ">
                            <nav className="w-full md:rounded-full md:bg-[#1C55971A] px-5 py-3 transition-colors duration-300 ease-out">
                                <ul className="grid md:grid-cols-4 grid-cols-2 gap-4">
                                    {tabs.map((tab, idx) => {
                                        const isActive = activeTab === tab.name;
                                        const indexText = `{${String(idx + 1).padStart(2, '0')}}`;

                                        return (
                                            <li key={tab.name} className="flex-1 flex justify-center">
                                                <button
                                                    onClick={() => {
                                                        setActiveTab(tab.name);
                                                        setOpenDropdown(tabContent[tab.name]?.[0]?.title || '');
                                                    }}
                                                    className={`relative flex items-center gap-3 px-6 py-2 w-full max-w-[260px] justify-center rounded-full transition-all duration-700 ease-out ${isActive ? 'bg-[#03284E] text-white ' : 'text-[#194867] hover:bg-white/35 hover:text-[#0C1833] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(12,34,66,0.08)]'}`}
                                                >
                                                    <span className={`${isActive ? 'text-white' : 'text-[#0C1833]'} text-sm font-medium transition-colors duration-600`}>
                                                        {indexText}
                                                    </span>
                                                    <span className={`mx-2  h-[1px]  transition-all duration-300 ease-out ${isActive ? 'bg-white/70 md:w-28 w-8' : 'bg-[#9FB9D6] md:w-8 w-4'}`} />
                                                    <span className={`text-nowrap text-base transition-all duration-300 ease-out ${isActive ? ' tracking-[0.01em]' : 'font-medium'}`}>
                                                        {tab.name}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <section className="all-in-one-desktop-animate   md:mt-[40px] bg-[#FCFCFC] md:rounded-[25px]">
                        <div className="flex flex-col lg:flex-row gap-7 px-4 py-8">
                            {/* Left Dropdown */}
                            <div className="w-full lg:w-1/2 space-y-2">
                                {activeContent?.map((item) => (
                                    <div key={item.title} className="border-b">
                                        <button
                                            onClick={() => setOpenDropdown(openDropdown === item.title ? '' : item.title)}
                                            className={`w-full flex justify-between items-center text-left md:py-3 py-1.5 px-2 ${openDropdown === item.title ? "font-semibold" : "font-medium"} text-[#1C1C1C] hover:text-[#337DD4]`}
                                        >
                                            {item.title}
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`transition-transform duration-300 ${openDropdown === item.title ? 'rotate-180' : 'rotate-0'}`}
                                            >
                                                <path
                                                    d="M4 6L8 10L12 6"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                        <div
                                            className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                                openDropdown === item.title ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                            }`}
                                        >
                                            <div className="min-h-0 overflow-hidden">
                                                <div className="md:px-4 px-2 pb-4 text-left text-base text-[#5A6376] leading-relaxed">
                                                    {Array.isArray(item.text) ? (
                                                        item.text.map((para) =>
                                                            <p key={`${item.title}-${para}`} className="mb-2">{para}</p>)
                                                    ) : (
                                                        <span>{item.text}</span>
                                                    )}
                                                </div>
                                                {/* image */}
                                                <div className="px-4 pb-4 md:hidden block">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        width={500}
                                                        height={400}
                                                        className="rounded-lg w-full h-auto object-contain"
                                                    />
                                                </div>
                                            </div>

                                           
                                        </div>
                                      </div>
                                ))}
                            </div>

                            {/* Right Image */}
                            <div className="w-full lg:w-1/2 md:block hidden">
                                {selectedImageItem ? (
                                    <Image
                                        src={selectedImageItem.image}
                                        alt={selectedImageItem.title}
                                        width={650}
                                        height={650}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            </section>
        </div>
    );
};

export default AllInOneTabs;
