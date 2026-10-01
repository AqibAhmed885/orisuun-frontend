import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center space-x-1">
            {[...Array(fullStars)].map((_, i) => (
                <Star
                    key={`full-${i}`}
                    className="text-yellow-500 fill-yellow-500"
                    strokeWidth={1.5}
                />
            ))}
            {hasHalfStar && (
                <div className="relative">
                    <Star
                        className="text-yellow-500 fill-none"
                        strokeWidth={1.5}
                    />
                    <StarHalf
                        className="absolute top-0 left-0 text-yellow-500 fill-yellow-500"
                        strokeWidth={1.5}
                    />
                </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <Star
                    key={`empty-${i}`}
                    className="text-yellow-500 fill-none"
                    strokeWidth={1.5}
                />
            ))}
        </div>
    );
};

export default StarRating;