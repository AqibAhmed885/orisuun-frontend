'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal/modal';
import StarRatings from 'react-star-ratings';
import { settings } from '@/app/api/dashboard/settings';
import { toast } from 'react-toastify';

const TeamReviewModal = ({
    showModal,
    setShowModal,
    teamId,
    teamName,
    currentUserId,
    refreshReviews
}) => {
    const [ratingDetails, setRatingDetails] = useState({
        Quality: 0,
        Service: 0,
        Cost: 0,
        Willing: 0,
        Review: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!ratingDetails.Review.trim()) {
            toast.error('Please write your review');
            return;
        }

        setSubmitting(true);
        try {
            const requestData = {
                TeamId: teamId,
                UserId: currentUserId,
                ServiceRating: ratingDetails.Service,
                QualityRating: ratingDetails.Quality,
                CostRating: ratingDetails.Cost,
                ReferRating: ratingDetails.Willing,
                Review: ratingDetails.Review,
            };

            const response = await settings.submitTeamReview(requestData);

            if (response.data?.StatusCode === 200) {
                toast.success("Review submitted successfully");
                setRatingDetails({
                    Quality: 0,
                    Service: 0,
                    Cost: 0,
                    Willing: 0,
                    Review: '',
                });
                refreshReviews();
                setShowModal(false);
            } else {
                toast.error(response.data?.Message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error?.response?.data?.Message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            title={`Write a review for Team - ${teamName}`}
        >
            <div className="mb-4">
                <div className="flex flex-wrap justify-between items-center gap-4 text-omblue-500">
                    {['Quality', 'Service', 'Cost', 'Willing'].map((field) => (
                        <div key={field} className="w-[45%] mb-2">
                            <p className="text-black-500 text-h8 font-semibold mb-1">{field}</p>
                            <StarRatings
                                starDimension="40px"
                                rating={ratingDetails[field]}
                                starRatedColor="#69B3E7"
                                changeRating={(value) =>
                                    setRatingDetails((prev) => ({ ...prev, [field]: value }))
                                }
                                numberOfStars={5}
                                name={field}
                                starSpacing="5px"
                                starEmptyColor="#D1E7F8"
                                starHoverColor="#69B3E7"
                            />
                        </div>
                    ))}
                </div>

                <p className="text-h8 font-semibold text-black-500 mb-2 mt-6">Your Review:</p>
                <textarea
                    rows={4}
                    placeholder="Write your message here..."
                    className="resize-none border border-black-100 w-full rounded-md py-3 px-4"
                    value={ratingDetails.Review}
                    onChange={(e) => setRatingDetails({ ...ratingDetails, Review: e.target.value })}
                    maxLength={250}
                />
                <p className="text-gray-500 text-h10 font-semibold my-2">Maximum 250 words</p>

                <div className="flex justify-end gap-2 pt-3">
                    <button
                        onClick={() => setShowModal(false)}
                        className="py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default TeamReviewModal;