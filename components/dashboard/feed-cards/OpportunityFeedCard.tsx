import React from 'react';
import Button from '@/components/ui/button';

export const OpportunityFeedCard = ({ feed, onRedirect })  => {
  if (!feed?.Content) return null;

  return (
    <div className="flex items-start mb-4  xs:flex-wrap  md:!flex-nowrap gap-4 justify-between">
      <div className="flex flex-col gap-1.5">
        <p className="text-blue-500 leading-[130%]">{feed.Content}</p>
        <p className="text-blue-500 leading-[130%]">Check it out!</p>
      </div>
      <div>
        <Button
          title={'View Opportunity'}
          className="text-sm text-omblue-600 border border-omblue-100 py-2 px-4 items-center !min-w-max max-h-[1.625rem] bg-white font-medium m-0 leading-none hover:underline"
          onClick={() =>
            onRedirect(feed?.PostId as string, feed?.Type as string)
          }
        />
      </div>
    </div>
  );
};
