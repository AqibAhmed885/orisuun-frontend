'use client';

import React, { useEffect, useState } from 'react';
import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import { toast } from 'react-toastify';
import axios from 'axios';

const StarRatingInput = ({ label, value, onChange }) => {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="px-2 mb-4">
            <p className="text-[#344054] font-semibold mb-1">{label}</p>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <InteractiveStar
                        key={star}
                        selected={hovered >= star || value >= star}
                        onClick={() => onChange(star)}
                        onHover={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                    />
                ))}
            </div>
        </div>
    );
};

const InteractiveStar = ({ selected, onClick, onHover, onMouseLeave }) => (
    <div
        className="cursor-pointer w-5 h-5"
        onClick={onClick}
        onMouseEnter={onHover}
        onMouseLeave={onMouseLeave}
    >
        {selected ? (
            <SolidStar className="text-[#2563EB] w-full h-full" />
        ) : (
            <OutlineStar className="text-gray-400 w-full h-full" />
        )}
    </div>
);



const Rating = ({ rating }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;
        stars.push(
            <div key={i} className="relative w-5 h-5">
                <div
                    className="absolute w-5 h-5 overflow-hidden z-10"
                    style={{
                        clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
                    }}
                >
                    <SolidStar className="w-5 h-5 text-[#BFD2FB]" />
                </div>
                <OutlineStar className="absolute w-5 h-5 text-[#759EF7] z-20" />
            </div>
        );
    }
    return <div className="flex gap-0.5">{stars}</div>;
};

export const TypeIcons = {
    'Black-owned Business': <BlackOwnedBusinessIcon className="text-omblue-500 w-5 h-5" />,
    Expert: <ExpertsIcon className="text-omblue-500 w-5 h-5" />,
    Mentor: <MentorsIcon className="text-omblue-500 w-5 h-5" />,
    Professional: <ProfessionalsIcon className="text-omblue-500 w-4 h-4" />,
    'Strategy Consultant': <ConsultantIcon className="text-omblue-500 w-4 h-4" />,
    Investor: <InvestorsIcon className="text-omblue-500 w-4 h-4" />,
    Advocate: <AdvocatesIcon className="text-omblue-500 w-4 h-4" />,
    Partner: <AdvocatesIcon className="text-omblue-500 w-4 h-4" />,
    Admin: <AdvocatesIcon className="text-omblue-500 w-4 h-4" />,
    SystemAdmin: <AdvocatesIcon className="text-omblue-500 w-4 h-4" />,
};

const TestimonialCard = ({ profileData, currentUser, apiEndpoint, userId, UserProfileDetailId, GivenReview }) => {
    const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
    const [showReview, setShowReview] = useState(false);
    const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');
    const [ratingDetails, setRatingDetails] = useState({
        Quality: 0,
        Service: 0,
        Cost: 0,
        Willing: 0,
        Review: '',
    });

    const [viewingReview, setViewingReview] = useState(null);

    const user = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));

    const toggleExpanded = (index: number) => {
        setExpandedIndices((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };
    useEffect(() => {
        if (viewingReview || showReview) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [viewingReview, showReview]);
    const handleChange = (field, value) => {
        setRatingDetails((prev) => ({ ...prev, [field]: value }));
    };

    const ReviewSubmit = async () => {
        const requestData = {
            ReviewedProfileId: UserProfileDetailId,
            UserId: currentUser?.Id,
            Service: ratingDetails.Service,
            Quality: ratingDetails.Quality,
            Cost: ratingDetails.Cost,
            Refer: ratingDetails.Willing,
            Description: ratingDetails.Review,
            IsTeam: false,
        };
        try {
            const response = await axios.post(
                `${apiEndpoint}/Profile/SaveProfileReview`,
                requestData,
                {
                    headers: {
                        XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    },
                }
            );
            if (response.status === 200) {
                toast.success(response.data.Message);
                setShowReview(false);
                setRatingDetails({ Quality: 0, Service: 0, Cost: 0, Willing: 0, Review: '' });
            }
        } catch (error) {
            toast.error(error?.response?.data?.Message);
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('received')}
                    className={`px-4 py-2 text-md font-semibold ${activeTab === 'received'
                        ? 'text-[#2357C6] border-b-2 border-[#2357C6]'
                        : 'text-gray-500'
                        }`}
                >
                    Reviews Received
                </button>
                <button
                    onClick={() => setActiveTab('given')}
                    className={`ml-4 px-4 py-2 text-md font-semibold ${activeTab === 'given'
                        ? 'text-[#2357C6] border-b-2 border-[#2357C6]'
                        : 'text-gray-500'
                        }`}
                >
                    Review Given
                </button>
            </div>



            {/* Content */}
            <div className="grid grid-cols-1 gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-200 ">
                <div className='flex justify-between items-center'>
                    <p className="text-gray-900 text-xl font-semibold">Reviews {activeTab === 'received' ? 'Received' : 'Given'}</p>
                    {/* Add Review Button */}
                    {activeTab === 'received' && user?.Id !== userId && (
                        <div className="">
                            <button
                                onClick={() => setShowReview(true)}
                                className="hover:bg-gray-200 border border-gray-300 rounded-md py-2 px-4 font-semibold"
                            >
                                Add Review
                            </button>
                        </div>
                    )}
                </div>

                {activeTab === 'received' && (
                    profileData && profileData.length > 0 ? (
                        profileData.map((item, index) => {
                            const shouldTruncate = item?.Description?.length > 100;
                            const averageRating = (item?.Service + item?.Quality + item?.Cost + item?.Refer) / 4 || 4.5;

                            return (
                                <div
                                    key={index}
                                    className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50"
                                    onClick={() => setViewingReview(item)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-slate-400">
                                                {item?.ProfilePicture ? (
                                                    <img
                                                        src={item?.ProfilePicture}
                                                        alt="Profile"
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <svg width="33" height="32" viewBox="0 0 33 32" fill="none">
                                                        <g opacity="0.08">
                                                            <rect x="0.75" y="0.25" width="31.5" height="31.5" rx="15.75" stroke="#101828" strokeWidth="0.5" />
                                                        </g>
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <p className="text-gray-700 font-semibold">{item?.ProfileReviewedbyName}</p>
                                                <span className="bg-[#ECF4FB] border border-[#D1E9FF] px-3 mt-1 rounded-2xl inline-flex items-center gap-1">
                                                    {TypeIcons[item?.ProfileReviewedbyUserType]} {item?.ProfileReviewedbyUserType}
                                                </span>
                                                <p className="text-gray-700 mt-1">
                                                    {shouldTruncate
                                                        ? `${item.Description.slice(0, 100)}...`
                                                        : item.Description}
                                                </p>
                                                <p className="text-sm text-slate-500">2 months ago</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 mt-1">
                                            <Rating rating={averageRating} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-500 py-6">
                            No received reviews available.
                        </div>
                    )
                )}


                {activeTab !== 'received' && (
                    GivenReview && GivenReview.length > 0 ? (
                        GivenReview.map((item, index) => (
                            <div key={index} className="w-full bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex justify-between items-start w-full">
                                    {/* Left: Reviewer Info */}
                                    <div className="flex flex-col">
                                        <p className="text-gray-700 font-semibold">{item?.ProfileReviewedbyName}</p>
                                        <span className="bg-[#ECF4FB] border border-[#D1E9FF] px-3 mt-1 rounded-2xl inline-flex items-center gap-1 w-fit">
                                            {TypeIcons['Investor']} {'Investor'}
                                        </span>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="mt-2">
                                    <p className="text-gray-700">{item?.Description}</p>
                                </div>

                                {/* Rating Section */}
                                <div className="w-full 2xl:w-[60vh] mt-4">
                                    <div className="bg-gray-50 border border-[#F9FAFB] rounded-xl px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-y-2">
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-medium text-[#475467] mb-1">Quality</p>
                                            <Rating rating={item?.Quality} />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-medium text-[#475467] mb-1">Service</p>
                                            <Rating rating={item?.Service} />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-medium text-[#475467] mb-1">Cost</p>
                                            <Rating rating={item?.Cost} />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-medium text-[#475467] mb-1">Willing to Refer</p>
                                            <Rating rating={item?.Refer} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-6">
                            No given reviews available.
                        </div>
                    )
                )}

            </div>


            {/* Modal */}
            {showReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
                    <div className="w-[85vh]  h-auto max-h-[95vh] border overflow-auto bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Write a review</h3>
                            <button onClick={() => setShowReview(false)} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>

                        <p className="text-[#344054] text-[16px] font-semibold mb-3">Rate Your Experience</p>
                        <div className="flex flex-wrap">
                            {['Quality', 'Service', 'Willing', 'Cost'].map((key) => (
                                <div className="w-1/2 mb-2" key={key}>
                                    <StarRatingInput
                                        label={key === 'Willing' ? 'Willing to Refer' : key}
                                        value={ratingDetails[key]}
                                        onChange={(val) => handleChange(key, val)}
                                    />
                                </div>
                            ))}
                        </div>

                        <p className="text-h8 font-semibold text-[#344054] mb-2 mt-4">Your Review</p>
                        <textarea
                            rows={4}
                            placeholder="Share your experience with others..."
                            value={ratingDetails.Review}
                            onChange={(e) => handleChange('Review', e.target.value)}
                            className="resize-none border border-[#EAECF0] w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
                        />

                        <div className="flex w-full gap-4 pt-4">
                            <button
                                onClick={() => setShowReview(false)}
                                className="flex-1 py-3 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={ReviewSubmit}
                                className="flex-1 py-3 bg-[#2357C6] text-white rounded-md hover:bg-omblue-300"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Review Details Modal */}
            {viewingReview && (
                <div className="fixed inset-0 z-50  flex items-center justify-center backdrop-blur-sm bg-white/40">
                    <div className="w-[85vh]  h-auto max-h-[95vh] border overflow-auto bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Review Details</h3>
                            <button
                                onClick={() => setViewingReview(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex gap-4 mb-6">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full bg-[#1E293B] flex items-center justify-center text-slate-400">
                                {viewingReview?.ProfilePicture ? (
                                    <img
                                        src={viewingReview?.ProfilePicture}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <svg width="33" height="32" viewBox="0 0 33 32" fill="none">
                                        <g opacity="0.08">
                                            <rect x="0.75" y="0.25" width="31.5" height="31.5" rx="15.75" stroke="#101828" strokeWidth="0.5" />
                                        </g>
                                    </svg>
                                )}
                            </div>

                            {/* Reviewer Info */}
                            <div>
                                <p className="text-gray-900 font-semibold text-lg">{viewingReview?.ProfileReviewedbyName}</p>
                                <span className="bg-[#ECF4FB] border border-[#D1E9FF] px-3 mt-1 rounded-2xl inline-flex items-center gap-1">
                                    {TypeIcons[viewingReview?.ProfileReviewedbyUserType]} {viewingReview?.ProfileReviewedbyUserType}
                                </span>
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="mb-6">
                            <p className="text-gray-700">{viewingReview.Description}</p>
                            <p className="text-sm text-slate-500 mt-2">2 months ago</p>
                        </div>

                        {/* Rating Details */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-medium">Quality</span>
                                <Rating rating={viewingReview.Quality} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-medium">Service</span>
                                <Rating rating={viewingReview.Service} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-medium">Cost</span>
                                <Rating rating={viewingReview.Cost} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-medium">Willing to Refer</span>
                                <Rating rating={viewingReview.Refer} />
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <span className="text-gray-900 font-semibold">Overall Rating</span>
                                <Rating
                                    rating={(viewingReview.Service + viewingReview.Quality + viewingReview.Cost + viewingReview.Refer) / 4}

                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setViewingReview(null)}
                                className="w-full py-3 bg-[#2357C6] text-white rounded-md hover:bg-omblue-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialCard;
