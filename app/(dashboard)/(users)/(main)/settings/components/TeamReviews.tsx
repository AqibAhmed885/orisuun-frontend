'use client';

import { RootState } from '@/data/store';
import ChevronRight from '@/icons/chevron-right';
import Dollars from '@/icons/dollars';
import Star from '@/icons/star';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { TypeIcons } from '@/utils/helper';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const TeamReviews = ({
    showLimited = false,
    reviews = [],
}: {
    showLimited?: boolean;
    reviews?: any[];
}) => {
    const router = useRouter();
    const [expandedReviews, setExpandedReviews] = useState<number[]>([]);

    if (!reviews || reviews.length === 0) {
        return <p className="text-md text-black-500 m-8">No reviews found for this team.</p>;
    }

    const toggleExpand = (index: number) => {
        if (expandedReviews.includes(index)) {
            setExpandedReviews(expandedReviews.filter((i) => i !== index));
        } else {
            setExpandedReviews([...expandedReviews, index]);
        }
    };

    const reviewsToShow = showLimited ? reviews.slice(0, 3) : reviews;

    return (
        <div className="grid grid-cols-12 gap-8" id="team_reviews">
            {reviewsToShow.map((review, index) => {
                const isExpanded = expandedReviews.includes(index);
                const maxCharacters = 200;
                const displayText = isExpanded ? review.Review : review.Review?.slice(0, maxCharacters);

                return (
                    <div key={index} className="col-span-12 md:col-span-6 3xl:col-span-4">
                        <div className="border border-grey-600 rounded-md px-3.5 py-4">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={review.ProfilePicture || BASE_URL}
                                        alt="reviewer profile"
                                        width={36}
                                        height={36}
                                        className="w-9 h-9 rounded-full"
                                    />
                                    <div className="space-y-0.5">
                                        <p
                                            className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500 cursor-pointer"
                                            onClick={() =>
                                                review?.UserProfileId && (review.IsTeam ? router.push(`${review?.UserId}`) : router.push(`/profile/${review?.UserProfileId}`))
                                            }
                                        >
                                            {review.Name}
                                        </p>
                                        <div className="inline-flex items-center gap-1.5">
                                            <div title="Profile">{TypeIcons[review.ProfileType]}</div>
                                            <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-300">
                                                {review.ProfileType}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-400">
                                    {displayText}
                                    {review.Review?.length > maxCharacters && (
                                        <>
                                            {!isExpanded && '...'}
                                            <span
                                                onClick={() => toggleExpand(index)}
                                                className="text-blue-500 cursor-pointer ml-2 font-semibold"
                                            >
                                                {isExpanded ? 'Show less' : 'Show more'}
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>

                            <hr className="my-3" />

                            <div className="space-y-3 block mx-auto">
                                {[
                                    { label: 'Service', value: review.ServiceRating },
                                    { label: 'Cost', value: review.CostRating },
                                    { label: 'Refer', value: review.ReferRating },
                                    { label: 'Quality', value: review.QualityRating },
                                ].map(
                                    (item, idx) =>

                                        <div key={idx} className="flex items-center space-x-4">
                                            <div className="flex items-center gap-2 w-[10%]">
                                                <Star className="text-olblue-500 w-4 h-4" />
                                                <h6 className="text-h9 2xl:text-scaled-h6 font-medium text-blue-500 w-6">
                                                    {item.value}
                                                </h6>
                                            </div>
                                            <div className="bg-[#C7E8FF] w-[65%] h-2 py-1 rounded-3xl relative">
                                                <div
                                                    className="bg-olblue-500 h-full absolute inset-0 rounded-3xl"
                                                    style={{ width: `${item.value * 2 * 10}%` }} // scale rating (0–5) to %
                                                ></div>
                                            </div>
                                            <div className="w-3/12">
                                                <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                                                    {item.label === 'Refer' ? 'Willing For Refer' : item.label}
                                                </p>
                                            </div>
                                        </div>

                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TeamReviews;
