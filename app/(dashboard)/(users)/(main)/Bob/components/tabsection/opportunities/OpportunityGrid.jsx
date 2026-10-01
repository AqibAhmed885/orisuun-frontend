import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

const OpportunityCard = ({ opportunity }) => {
    const router = useRouter();

    return (
        <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {/* Header with title and status */}
            <div className='flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700'>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{opportunity.IndustryType || 'TechWave Innovations'}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{opportunity.StrategyName || 'Riding the Tech Wave'}</p>
                </div>

                <span className={`px-4 py-1 rounded-full text-sm font-medium ${opportunity.bdtype === 'Seeking'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                    {opportunity.bdtype || 'Seeking'}
                </span>
            </div>

            {/* Strategy section */}
            <div className="my-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {opportunity.StrategyName || 'Market Penetration'}
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {opportunity.OpportunityStructure || 'Join our dynamic team...'}
                </p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 my-4">
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{opportunity.RegionName || 'Atlanta, GA'}</span>
                </div>

                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{opportunity.timeLine || '4-6 months'}</span>
                </div>
            </div>

            {/* Tactics checklist */}
            {opportunity.bDTacticsSelections?.length > 0 && (
                <div className="my-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">TACTICS</h4>
                    <div className="space-y-2">
                        {opportunity.bDTacticsSelections.map((tactic, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    readOnly
                                />
                                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {tactic.TacticsName}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Profile footer */}
            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image
                            src={opportunity.ProfilePicture || BASE_URL}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {opportunity.UserCompanyName || 'Amara\'s Artisan Coffee'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {opportunity.UserType || 'Black-owned Business'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => router.push(`/profile/${opportunity.UserProfileId}`)}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                    View Profile
                </button>
            </div>
        </div>
    );
};

const OpportunityGrid = ({ profileData }) => {
    // Group opportunities by match type
    const groupedOpportunities = profileData?.BdList?.reduce((acc, opportunity) => {
        if (!acc[opportunity.MatchType]) {
            acc[opportunity.MatchType] = [];
        }
        acc[opportunity.MatchType].push(opportunity);
        return acc;
    }, {});

    // Define section titles based on match type
    const sectionTitles = {
        1: 'BD Opportunities',
        2: 'BB2 Opportunities',
        1002: 'BD3 Opportunities'
    };

    return (
        <div className="space-y-8">
            {Object.entries(groupedOpportunities || {}).map(([matchType, opportunities]) => (
                <div key={matchType}>
                    <h2 className="text-2xl font-bold mb-6">
                        {sectionTitles[matchType] || `Opportunities (Type ${matchType})`}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {opportunities.map((opportunity, index) => (
                            <OpportunityCard key={index} opportunity={opportunity} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OpportunityGrid;