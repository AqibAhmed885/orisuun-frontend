import React from 'react';
import Button from '@/components/ui/button';

export const OfferingOpportunityCard = ({ feed, onRedirect }) => {
  if (!feed?.Post) return null;

  const { Post, User } = feed;
  const industryList = Post.IndustryType?.split(',') || [];

  return (
    <div className="bg-white mb-4  rounded-2xl shadow-blur overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#204FB4]">Offering an Opportunity</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Business Development
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-4">
        <h4 className="text-base font-semibold text-gray-900">{Post.Name}</h4>
        
        {/* Industry Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 font-medium">Open to:</span>
          {industryList.slice(0, 3).map((industry, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
            >
              {industry.trim()}
            </span>
          ))}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Industry:</p>
            <p className="text-gray-900 font-medium">{Post.IndustryType}</p>
          </div>
          <div>
            <p className="text-gray-500">Business type:</p>
            <p className="text-gray-900 font-medium">{Post.CompanyName || 'N/A'}</p>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
              {User.Name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                {User.Name}
                {User.IsVerified === 1 && (
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </p>
              <p className="text-xs text-gray-500">{Post.CompanyName}</p>
            </div>
          </div>
          <span className="ml-auto text-xs text-gray-400">📍 {Post.RegionName || 'City'}</span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        title="View Opportunity"
        className="w-full text-sm text-white bg-[#204FB4] hover:bg-[#1a3d8f] py-2.5 px-4 rounded-lg font-medium transition-colors"
        onClick={() => onRedirect(feed?.PostId as string, feed?.Type as string)}
      />
    </div>
  );
};
