import React from 'react';

interface ShimmerProps {
  className?: string;
}

const Shimmer: React.FC<ShimmerProps> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}>
      <div className="h-full w-full bg-gray-300 rounded"></div>
    </div>
  );
};

export default Shimmer;