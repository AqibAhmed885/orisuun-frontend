import ProfileImage from '@/public/fundraising/Profile2.png';
import Button from '@/components/ui/button';
import Calendar from '@/icons/cofounder/calendar';
import AvatarGroup from '@/components/ui/avatar-group';
import { useState } from 'react';
import { Reward, useCampaignDetails } from './context/campaign-context';
import { useRouter } from 'next/navigation';

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

const RewardCard = ({
  reward,
  isPublic = false,
}: {
  reward: Reward;
  isPublic: boolean;
}) => {
  const [selectedCountry, setSelectedCountry] = useState<{
    code: string;
    name: string;
    flag: string;
  } | null>(null);

  const [showOnlyCertainCountries, setShowOnlyCertainCountries] =
    useState(false);
  const router = useRouter();

  return (
    <div className=" flex flex-col gap-7 text-ellipsis whitespace-pre-wrap overflow-hidden break-words">
      <span className="flex justify-between gap-4">
        <h3 className="text-2xl font-bold text-gray-800">{reward.Title}</h3>
        <p className="text-h1 leading-none font-semibold text-nav-blue">
          ${reward.Pricing}
        </p>
      </span>
      <p className=" text-gray-600 text-h8 leading-[140%] line-clamp-4 text-ellipsis whitespace-pre-wrap overflow-hidden break-words">
        {reward.Description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <h4 className="text-sm text-blue-500 font-semibold leading-none">
            Contributors
          </h4>
          <AvatarGroup contributors={reward.RewardContributors} />
        </div>
        <div className="flex flex-col gap-3 text-right relative overflow-visible">
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
            <div className="!absolute w-max bg-white !rounded shadow-md right-0 top-[48px] p-4 border border-black-100">
              <div className="flex flex-col gap-2.5">
                {reward.ShippingToCountries.map((country, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <span>{country}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <h4 className="text-sm text-blue-500 font-semibold leading-none">
            Estimated Delivery
          </h4>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-nav-blue" />
            <span className="text-sm font-medium text-blue-500">
              {months[reward.EstimatedDeliveryMonth]}{' '}
              {reward.EstimatedDeliveryYear}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-right">
          <h4 className="text-sm text-blue-500 font-semibold leading-none">
            limited quantity remiaining
          </h4>
          <p className="text-sm">
            {reward.Inventory - reward.RewardContributors.length} left of{' '}
            {reward.Inventory}{' '}
          </p>
        </div>
      </div>

      <Button
        title="Choose Reward"
        className="px-4 py-2 text-sm font-semibold text-white bg-nav-blue rounded-md"
        onClick={() => router.push(`/reward/${reward.Id}`)}
        disabled={
          reward.RewardContributors.length - reward.Inventory == 0 || isPublic
            ? true
            : false
        }
      />
    </div>
  );
};

const RewardsList: React.FC<{ isPublic: boolean }> = ({ isPublic }) => {
  const { rewards } = useCampaignDetails();
  return (
    rewards.length > 0 && (
      <div className="shadow-custom overflow-hidden rounded">
        <div className="bg-lightBlueBg p-4">
          <h2 className="text-xl font-semibold text-blue-500 leading-[100%]">
            Available Rewards
          </h2>
        </div>
        <div className="flex flex-col max-h-[827px] overflow-auto">
          {rewards.map((reward, index) => (
            <>
              <div
                key={index}
                className={`p-4 flex flex-col ${
                  index < Math.min(rewards.length, 5) - 1 ? 'mb-[14px]' : 'mb-0'
                }`}
              >
                <RewardCard reward={reward} isPublic={isPublic} />
              </div>
              {index < Math.min(rewards.length, 5) - 1 && (
                <hr className="mb-[14px] mx-4" />
              )}
            </>
          )) || (
            <div className="p-4 text-center text-lg font-bold text-gray-500">
              No rewards available
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default RewardsList;
