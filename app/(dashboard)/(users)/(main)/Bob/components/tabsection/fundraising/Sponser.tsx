import React from 'react';
import Image from 'next/image';

const Sponser = ({ sponsor }) => {
    const daysLeft = sponsor.Duration
        ? Math.ceil((new Date(sponsor.Duration).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className='border w-full md:w-1/2 border-gray-200 rounded-2xl shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 mt-3'>
            <div className=" w-full p-4 flex items-start gap-4">
                {/* Profile image */}
                <Image
                    className="w-12 h-12 rounded-full object-cover"
                    src={sponsor.ProfilePicture || 'https://via.placeholder.com/48'}
                    width={48}
                    height={48}
                    alt="Profile"
                />

                {/* Content */}
                <div className="flex flex-col justify-between w-full">
                    {/* Header row */}
                    <div className="flex justify-between items-start w-full">
                        <div className="min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                {sponsor.SponsorName}
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {sponsor.Slogan}
                            </p>
                        </div>
                        <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold whitespace-nowrap">
                            Sponsorship
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Content */}
            <div className="w-full flex flex-col pb-3">
                <p className="text-sm text-gray-700 dark:text-gray-400 mt-2 px-6">
                    {sponsor.ShortMessage}
                </p>

                <div className='flex items-center justify-between w-full mt-3 px-6'>
                    <span className="text-sm text-gray-700">
                        {daysLeft > 0 ? `${daysLeft} day${daysLeft > 1 ? 's' : ''} left` : 'Ended'}
                    </span>
                    <a
                        href={sponsor.WebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#2357C6] hover:underline font-medium"
                    >
                        Visit Website
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Sponser;