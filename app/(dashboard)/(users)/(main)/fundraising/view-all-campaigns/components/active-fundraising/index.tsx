import { useState } from 'react';
import Button from '@/components/ui/button';
import ActiveCampaign from './active-fundraising-card';
import { Campaign } from '../../../../../../../../data/dashboard/fundraising';
import { ListingSkeleton } from '@/components/feed-card-skeleton/listingsSkeleton';
import ChevronLeft from '@/icons/chevron-left';

interface CampaignSectionProps {
  title: string;
  campaigns: Campaign[];
  className?: string;
}

export function CampaignSection({
  title,
  campaigns,
  className,
}: CampaignSectionProps) {
  const [viewAll, setViewAll] = useState(false);
  const displayedCampaigns = viewAll ? campaigns : campaigns.slice(0, 3); 
  const handleViewAllToggle = () => {
    setViewAll(!viewAll);
  };

  return (
    <div className={`flex flex-col gap-5 py-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg !leading-6 font-semibold text-blue-500">
          {title}
        </h2>
        {/* {campaigns.length > 3 && !viewAll && ( */}
          {/* <Button
            title="View all"
            variant="ghost"
            endIcon={<ChevronLeft className=" rotate-180 w-auto h-3 group-hover:-rotate-90 transition-all" />}
            onClick={handleViewAllToggle}
            className="!py-0 !pl-3 !pr-1 text-omblue-600 group text-sm flex items-center gap-1.5 font-semibold min-w-max w-max"
          /> */}
        {/* )} */}
      </div>

      <div className={` max-w-full lg:grid lg:grid-cols-3 w-full gap-5 hide-scrollbar snap-x snap-mandatory`}>
        {displayedCampaigns.length > 0 ? (
          displayedCampaigns.map((campaign, index) => (
            <div key={index} className="snap-start snap-always">
              <ActiveCampaign key={`${title}-${index}`} campaign={campaign} />
            </div>
          ))
        ) : (
          <div className="flex gap-5 p-5 w-full">
            <ListingSkeleton />
            <ListingSkeleton />
            <ListingSkeleton />
          </div>
        )}
      </div>
    </div>
  );
}
