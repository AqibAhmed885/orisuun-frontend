'use client';

import { useState } from 'react';
import AvatarGroup from '../ui/avatar-group';
import Calendar from '@/icons/cofounder/calendar';

const countriesList = [
  { code: 'us', name: 'Afghanistan' },
  { code: 'gb', name: 'Albania' },
  { code: 'ca', name: 'Andorra' },
  { code: 'in', name: 'China' },
  { code: 'jp', name: 'Japan' },
];

const months = {
  '1': 'January',
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
};

interface RewardsDetails {
  Id: number;
  Title: string;
  Description: string;
  Pricing: number;
  Inventory: number;
  ShippingTo: string;
  ShippingFrom: string;
  EstimatedDeliveryMonth: string;
  EstimatedDeliveryYear: string;
  CampaignId: number;
  ShippingToCountries: string[];
}

const RewardSummary = ({
  reward,
  contributions,
}: {
  reward: RewardsDetails;
  contributions: any[];
}) => {
  const [selectedCountry, setSelectedCountry] = useState<{
    code: string;
    name: string;
    flag: string;
  } | null>(null);
  const [showOnlyCertainCountries, setShowOnlyCertainCountries] =
    useState(false);

  return (
    <div className="space-y-6 xs:p-4 xl:p-6 xl:!pt-[120px] w-full mx-auto">
      <div className="max-w-[541px] mx-auto space-y-[60px]">
        <h1 className="text-h2 text-center lg:!text-left lg:text-5xl font-semibold text-gray-900">
          Rewards Summary
        </h1>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-blue-600 leading-none font-semibold">
              {reward.Title}
            </h2>
            <span className="text-nav-blue text-[32px] leading-none font-semibold">
              ${reward.Pricing.toLocaleString()}
            </span>
          </div>

          <p className="text-gray-600 text-h8 font-medium">
            Brief description of incentive
            {/* {reward.Description || "Brief descripHon of incentive"} */}
          </p>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm text-blue-500 font-semibold leading-none">
                  Contributors
                </h4>
                <AvatarGroup contributors={contributions} />
              </div>
              <div className="flex flex-col gap-2 text-right relative overflow-visible">
                <h4 className="text-sm text-blue-500 font-semibold leading-none">
                  Ships to
                </h4>
                <p
                  className="text-sm cursor-pointer"
                  onClick={() =>
                    setShowOnlyCertainCountries(!showOnlyCertainCountries)
                  }
                >
                  Only certain countries
                </p>

                {showOnlyCertainCountries && (
                  <div className="!absolute w-max bg-white !rounded shadow-custom right-0 top-full p-4 border border-gray-300">
                    <div className="flex flex-col gap-2.5">
                      {reward.ShippingToCountries.map((country, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          <button>{country}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm text-blue-500 font-semibold leading-none">
                  Estimated Delivery
                </h4>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-nav-blue" />
                  <span className="text-sm font-medium text-blue-500">
                    {months[reward.EstimatedDeliveryMonth]},{' '}
                    {reward.EstimatedDeliveryYear}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-right">
                <h4 className="text-sm text-blue-500 font-semibold leading-none">
                  limited quantity
                </h4>
                <p className="text-sm">
                  {reward.Inventory - contributions.length} of{' '}
                  {reward.Inventory}{' '}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardSummary;
