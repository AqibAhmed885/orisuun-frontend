import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { useRouter } from 'next/navigation';
import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { trackOpportunityVisit } from '@/app/api/dashboard/businessDevelopment'; // Adjust path if needed

interface Tactic {
    TacticsName: string;
}

interface Opportunity {
    MatchType: number;
    IndustryType?: string;
    bdtype?: string;
    StrategyName?: string;
    OpportunityStructure?: string;
    RegionName?: string;
    timeLine?: string;
    bDTacticsSelections?: Tactic[];
    BDId?: string | number;
    // Add any other properties you use in the component
}

interface OpportunityCardProps {
    profileData: Opportunity[] | null | undefined;
}

const OpportunityCard = ({ profileData }: OpportunityCardProps) => {
    const router = useRouter();
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

    // Handler for card click
    const handleCardClick = async (item: Opportunity) => {
        const userId = currentUser?.Id; 

        if (userId && item.BDId) {
            const result = await trackOpportunityVisit(item.BDId, userId);
            if (!result.success) {          
                console.error('Error tracking visit:', result.error);
            }
        }
        
        router.push(`/profile/${add2040ToProfileDetailsId(Number(item.BDId))}`);
    };


    // Group opportunities by match type
    const groupedOpportunities = profileData?.reduce((acc: Record<number, Opportunity[]>, opportunity) => {
        if (!acc[opportunity.MatchType]) {
            acc[opportunity.MatchType] = [];
        }
        acc[opportunity.MatchType].push(opportunity);
        return acc;
    }, {});


    // Define section titles based on match type
    const sectionTitles: Record<number, string> = {
        1: 'Business Development Opportunities',
        2: 'Co-Founder Opportunities',
        1002: 'Board Opportunities'
    };

    const sectionSubTitles: Record<number, string> = {
        1: 'Business Development Opportunities',
        2: 'Co-Founder Opportunities',
        1002: 'Board Opportunities'
    };

    return (
        <div className="space-y-8">
            {groupedOpportunities && Object.entries(groupedOpportunities).map(([matchType, opportunities]) => {
                const matchTypeNum = Number(matchType);
                return (
                    <div key={matchType}>
                        <h2 className="text-xl font-bold mb-1">
                            {sectionTitles[matchTypeNum] || `Opportunities (Type ${matchType})`}
                        </h2>
                        <h2 className="text-[#344054] mb-3">
                            {sectionSubTitles[matchTypeNum] || `Opportunities (Type ${matchType})`}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {opportunities.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 cursor-pointer" // Add cursor-pointer for UX
                                    onClick={() => handleCardClick(item)} // Track visit on card click
                                >
                                    <div className="flex-grow">
                                        <div className='flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700'>
                                            <div className="flex items-start gap-4">
                                                <div>
                                                    <p className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                                        {item.IndustryType || 'Opportunity'}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className={`mt-2 px-4 py-[2px] rounded-3xl text-center w-fit ${item.bdtype === 'Seeking'
                                                ? 'text-[#085D3A] bg-[#DCFAE6]'
                                                : item.bdtype === 'Facilitate'
                                                    ? 'text-[#B54708] bg-[#FFFAEB]'
                                                    : 'text-[#026AA2] bg-[#EFF8FF]'
                                                }`}>
                                                {item.bdtype || 'Opportunity'}
                                            </p>
                                        </div>

                                        <h1 className='py-3 text-xl'>{item.StrategyName || 'Business Strategy'}</h1>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                            {item.OpportunityStructure || 'No description available'}
                                        </p>

                                        <div className='flex gap-2 text-sm mb-4'>
                                            <span className="flex items-center gap-1">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.16683 14.9487C7.48576 14.7348 5.94921 13.8888 4.86949 12.5826C3.78976 11.2765 3.2479 9.60827 3.35401 7.91697C3.46013 6.22567 4.20627 4.63823 5.44078 3.47731C6.6753 2.31639 8.30554 1.66909 10.0002 1.66699C11.6969 1.66573 13.3302 2.31144 14.5674 3.47256C15.8046 4.63368 16.5525 6.22282 16.6587 7.91619C16.765 9.60956 16.2215 11.2797 15.1392 12.5864C14.0569 13.893 12.517 14.7378 10.8335 14.9487V16.677C14.1218 16.7537 16.6668 17.2795 16.6668 17.917C16.6668 18.607 13.6818 19.167 10.0002 19.167C6.3185 19.167 3.3335 18.607 3.3335 17.917C3.3335 17.2795 5.8785 16.7537 9.16683 16.677V14.9487ZM10.0002 13.3337C11.3262 13.3337 12.598 12.8069 13.5357 11.8692C14.4734 10.9315 15.0002 9.65974 15.0002 8.33366C15.0002 7.00758 14.4734 5.73581 13.5357 4.79813C12.598 3.86045 11.3262 3.33366 10.0002 3.33366C8.67408 3.33366 7.40231 3.86045 6.46463 4.79813C5.52695 5.73581 5.00016 7.00758 5.00016 8.33366C5.00016 9.65974 5.52695 10.9315 6.46463 11.8692C7.40231 12.8069 8.67408 13.3337 10.0002 13.3337ZM10.0002 10.0003C9.55814 10.0003 9.13421 9.82473 8.82165 9.51217C8.50909 9.19961 8.3335 8.77569 8.3335 8.33366C8.3335 7.89163 8.50909 7.46771 8.82165 7.15515C9.13421 6.84259 9.55814 6.66699 10.0002 6.66699C10.4422 6.66699 10.8661 6.84259 11.1787 7.15515C11.4912 7.46771 11.6668 7.89163 11.6668 8.33366C11.6668 8.77569 11.4912 9.19961 11.1787 9.51217C10.8661 9.82473 10.4422 10.0003 10.0002 10.0003Z" fill="#98A2B3" />
                                                </svg>
                                                {item.RegionName || 'Location not specified'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.4166 8.58333L15.7505 10.25L14.0833 8.58333M15.9542 9.83333C15.9845 9.55972 16 9.28167 16 9C16 4.85786 12.6421 1.5 8.5 1.5C4.35786 1.5 1 4.85786 1 9C1 13.1421 4.35786 16.5 8.5 16.5C10.8561 16.5 12.9584 15.4136 14.3333 13.7144M8.5 4.83333V9L11 10.6667" stroke="#98A2B3" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                {item.timeLine || 'Timeline not specified'}
                                            </span>
                                        </div>

                                        {item.bDTacticsSelections?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {item.bDTacticsSelections.map((tactic, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-white text-blue-800 border rounded-md boreder-[#D0D5DD] p-2 text-xs font-medium"
                                                    >
                                                        {tactic.TacticsName}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent double call if button is clicked
                                                handleCardClick(item);
                                            }}
                                            className="w-[82%] px-6 py-2 bg-[#2357C6] font-semibold text-white rounded-md hover:bg-[#658ce0] transition-colors"
                                        >
                                            View Profile
                                        </button>

                                        <button className="w-[18%] flex justify-center items-center py-3 px-3 border border-[#121b2e0d] font-semibold text-[#131d300d] rounded-md hover:bg-[#f0f4ff] transition-colors">
                                            <svg
                                                width="19"
                                                height="17"
                                                viewBox="0 0 19 17"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M8.90229 1.8778C9.09436 1.48869 9.1904 1.29413 9.32077 1.23197C9.4342 1.17789 9.56599 1.17789 9.67942 1.23197C9.80979 1.29413 9.90583 1.48869 10.0979 1.8778L11.9201 5.56944C11.9768 5.68432 12.0052 5.74176 12.0466 5.78635C12.0833 5.82584 12.1273 5.85783 12.1762 5.88056C12.2314 5.90623 12.2948 5.91549 12.4215 5.93402L16.4976 6.5298C16.9268 6.59253 17.1414 6.6239 17.2407 6.72874C17.3271 6.81995 17.3678 6.94529 17.3513 7.06985C17.3324 7.21302 17.1771 7.36436 16.8663 7.66702L13.918 10.5387C13.826 10.6282 13.7801 10.673 13.7504 10.7263C13.7242 10.7734 13.7073 10.8252 13.7008 10.8788C13.6935 10.9393 13.7043 11.0025 13.726 11.129L14.4217 15.1851C14.4951 15.6129 14.5318 15.8269 14.4628 15.9538C14.4028 16.0642 14.2962 16.1417 14.1726 16.1646C14.0306 16.1909 13.8385 16.0899 13.4543 15.8879L9.8104 13.9716C9.69686 13.9119 9.64009 13.882 9.58028 13.8703C9.52733 13.8599 9.47286 13.8599 9.41991 13.8703C9.3601 13.882 9.30333 13.9119 9.1898 13.9716L5.54585 15.8879C5.16168 16.0899 4.96959 16.1909 4.82756 16.1646C4.70398 16.1417 4.59735 16.0642 4.53736 15.9538C4.46842 15.8269 4.5051 15.6129 4.57848 15.1851L5.27415 11.129C5.29584 11.0025 5.30669 10.9393 5.29935 10.8788C5.29285 10.8252 5.27601 10.7734 5.24975 10.7263C5.2201 10.673 5.17415 10.6282 5.08224 10.5387L2.13388 7.66702C1.82313 7.36436 1.66776 7.21302 1.64885 7.06985C1.6324 6.94529 1.67304 6.81995 1.75946 6.72874C1.85878 6.6239 2.07339 6.59253 2.50262 6.5298L6.57867 5.93402C6.70543 5.91549 6.76882 5.90623 6.82401 5.88056C6.87288 5.85783 6.91688 5.82584 6.95357 5.78635C6.995 5.74176 7.02336 5.68432 7.08006 5.56944L8.90229 1.8778Z"
                                                    stroke="#344054"
                                                    strokeWidth="1.66667"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
            {
                !groupedOpportunities && <div className='flex justify-center items-center min-h-20vh'>No Opportunity</div>
            }
        </div>
    );
};

export default OpportunityCard;