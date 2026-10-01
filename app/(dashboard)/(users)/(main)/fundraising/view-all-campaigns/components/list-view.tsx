import React from "react";
import Image from "next/image";
import { BASE_URL } from "@/public/defaultProfile/defaultProfile";
import Favourite from "@/icons/favourite";
import { Star } from "react-feather";

type Campaign = {
  Id?: string | number;
  Title?: string;
  Summary?: string;
  Goal?: number | string;
  Contributions?: number;
  Duration?: string | null; // ISO date string
  RaisedPercentage?: number; // e.g., 75 for 75%
  UserProfilePicture?: string;
  UserCompanyName?: string;
  UserCity?: string;
  UserCountry?: string;
  IsFavourite?: boolean;
};

type ListViewProps = {
  data: Campaign[];
  // accept string | number because callers may have numeric ids
  onView?: (id: string | number) => void;
  onFavourite?: (id: string | number) => void;
};

const ListView: React.FC<ListViewProps> = ({ data, onView, onFavourite }) => {
  const uniqueData = React.useMemo(() => {
    const seen = new Set();
    return data.filter(item => {
      if (!item.Id || seen.has(item.Id)) return false;
      seen.add(item.Id);
      return true;
    });
  }, [data]);

  return (
    // container provides horizontal scroll for the table body/header except sticky column
    <div className="shadow-sm overflow-x-auto tracking-wide relative py-4">
      <div className="min-w-[1600px]"> {/* ensure room for columns + action col */}
        {/* Header */}
        <div className=" bg-gray-100 border-b grid grid-cols-[200px_320px_minmax(300px,_1fr)_120px_120px_160px_260px_240px] gap-4 items-center text-sm text-gray-600 font-semibold">
          <div className="p-4">Campaign</div>
          <div className="p-4">Business</div>
          <div className="p-4">Campaign Purpose</div>
          <div className="p-4">Goal</div>
          <div className="p-4">Contributors</div>
          <div className="p-4 ">Expire Date</div>
          <div className="p-4">Funding Status</div>

          {/* Sticky Action header */}
          <div className="sticky right-0 z-30 h-14 p-4 bg-gray-100 border-b flex items-center ">
            Action
          </div>
        </div>

        {/* Rows */}
        {uniqueData.map((item) => (
          <div
            key={item.Id}
            className="grid grid-cols-[200px_320px_minmax(300px,_1fr)_120px_120px_160px_260px_240px] gap-4 items-center border-b last:border-b-0 bg-white relative"
          >
            {/* Campaign */}
            <div className="font-semibold text-sm p-4 text-gray-700">{item.Title}</div>

            {/* Business */}
            <div className="flex items-center p-4 gap-3 min-w-0">
              {item.UserProfilePicture ? (
                <Image
                  src={item.UserProfilePicture || BASE_URL}
                  alt={item.UserCompanyName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full  bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg"></div>
              )}
              <div>
                <div className="font-semibold">{item.UserCompanyName}</div>
                <div className="text-gray-500"> {item.UserCity}{item.UserCountry ? `, ${item.UserCountry}` : ''}</div>
              </div>
            </div>

            {/* Purpose */}
            <div className="text-gray-700 p-4 text-sm truncate">{item.Summary}</div>

            {/* Goal */}
            <div>
              <span className="text-[#2357C6] p-4 font-semibold">$ {item.Goal}</span>
            </div>

            {/* Contributors */}
            <div>
              <span className="text-gray-900 p-4 font-semibold">{item.Contributions}</span>
            </div>

            {/* Expiration Date + compute days left */}
            {(() => {
              const rawDate = item.Duration;
              const expDate = rawDate ? new Date(rawDate) : null;
              const expValid = expDate && !isNaN(expDate.getTime());
              const now = new Date();
              const diffMs = expValid ? expDate.getTime() - now.getTime() : 0;
              const daysLeft = expValid ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : null;
              const daysText =
                daysLeft === null ? '—' : daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? '0 days left' : 'Expired';

              return (
                <>
                  <div className="text-sm p-4 text-gray-600">
                    {expValid ? expDate.toLocaleDateString() : '—'}
                  </div>

                  {/* Funding Status */}
                  <div className="flex flex-col p-4 ">
                    <div className="flex gap-2 text-sm font-semibold text-[#2357C6]">
                      {(item.RaisedPercentage) ? `${item.RaisedPercentage}%` : '0%'}
                      <span className="text-gray-400 font-normal">{daysText}  </span>
                    </div>

                    <div className="w-full max-w-[200px] bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-[#2357C6] h-2 rounded-full"
                        style={{ width: `${Math.min(100, (item.RaisedPercentage) || 0)}%` }}
                      />
                    </div>

                  </div>
                </>
              );
            })()}

            {/* Action (sticky to right) */}
            <div className="sticky right-0 p-4 z-40 flex bg-white items-center gap-2">
              <button
                className="bg-[#2357C6] hover:bg-[#1f4fb5] text-nowrap text-white px-5 py-2 rounded-md text-sm font-semibold"
                onClick={() => onView?.(item.Id)}
              >
                View Campaign
              </button>
              <button
                className="border rounded-md w-10 h-10 flex items-center justify-center bg-white"
                onClick={() => onFavourite?.(item.Id)}
                aria-label="Favourite"
              >
                <Star size={20} className="text-gray-500 " />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;