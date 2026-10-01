'use client';

import { CampaignSkeleton } from '@/components/feed-card-skeleton/campaignDetaIlsSkeleton';
import { RewardsSkeletonList } from '@/components/feed-card-skeleton/rewardsSkeleton';
import FundCampaign from '@/components/fundraising/campaign-details/FundCampaign';
import AddressForm from '@/components/rewards/address-details';
import RewardsSummary from '@/components/rewards/reward-summary';
import { AddressFormTypes } from '@/utils/schema';
import { apiEndpoint } from '@/utils/utils';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const rewardData = {
  title: 'Premium Membership Reward',
  description:
    'Lorem ipsum dolor sit amet consectetur. Elit in facilisis at in viverra viverra nulla cras. Non posuere elementum tellus odio mi non dui nisl odio. Aliquam urna cras enim congue lectus.',
  price: 99,
  contributors: 150,
  deliveryDate: 'December 25, 2025',
  limitedQuantity: '135 of 200',
  shipsTo: 'Only certain countries',
};

interface PageProps {
  params: { id: number };
}

interface UserRewardComponentProps {
  rewardId: number;
}

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

const UserRewardComponent: React.FC<UserRewardComponentProps> = ({
  rewardId,
}) => {
  const [page, setPage] = useState(0);
  const router = useRouter();

  // const stripePromise = loadStripe(
  //   process.env.NEXT_PUBLIC_STRIPE_ESCROW_PUBLIC_KEY
  // );

  const [reward, setReward] = useState<RewardsDetails>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contributions, setContributions] = useState<any[]>(null);
  const [address, setAddress] = useState<AddressFormTypes>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const fetchRewardDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiEndpoint}/Campaign/GetReward/${rewardId}`,
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        }
      );
      if (response.status === 200) {
        setReward(response.data.Result?.RewardsDetails);
        setContributions(response.data.Result?.Contributions);
      } else {
        toast.error('Failed to fetch reward');
      }
    } catch (error) {
      toast.error('Error fetching reward!');
      console.error('Error fetching reward:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardDetails();
  }, [rewardId]);

  const handlePageChange = (address: AddressFormTypes) => {
    setPage(page + 1);
    setAddress(address);
  };

  const SaveUserReward = async (ContributionId: number) => {
    const data = {
      ContributionId,
      UserId: currentUser.Id,
      RewardId: reward.Id,
      CampaignId: reward.CampaignId,
      StreetName: address.streetName,
      StreetNumber: address.streetNumber,
      StreetUnit: address.unitNumber,
      PostalCode: address.postalCode,
      City: address.city,
      State: address.state,
      Country: address.country,
    };

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${apiEndpoint}/Campaign/CreateUserReward`,
        data,
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        }
      );
      if (response.status === 201) {
        toast.success('Your Reward added');
        router.push(`/fundraising/${reward.CampaignId}`);
      } else {
        toast.error('error adding reard');
      }
    } catch (error) {
      toast.error('error adding reard!');
      console.error('error adding reard:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewContribution = (newContribution) => {
    SaveUserReward(newContribution.Id);
  };

  return (
    <div className="flex flex-col lg:!flex-row items-start h-full">
      {isLoading ? (
        <RewardsSkeletonList />
      ) : (
        <RewardsSummary contributions={contributions} reward={reward} />
      )}

      <Suspense>
        <div className="space-y-6 xs:p-4 xl:p-6 xl:!pt-[120px] w-full max-w-[674px] h-full mx-auto lg:bg-lightBlueBg">
          <div className="max-w-[444px] mx-auto max-h-max space-y-10">
            {page === 0 && (
              <SessionProvider>
                <AddressForm OnNextValidation={handlePageChange} />
              </SessionProvider>
            )}
            {page === 1 && (
              <Elements stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_ESCROW_PUBLIC_KEY)}>
                {' '}
                <FundCampaign
                  amount={reward.Pricing}
                  handleNewContribution={handleNewContribution}
                  campaignId={reward.CampaignId}
                  isAmountFixed={true}
                />
              </Elements>
            )}
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default function Page({ params }: PageProps) {
  return (
    <div className="min-h-screen">
      <main className="w-full h-screen">
        <UserRewardComponent rewardId={params.id} />
      </main>
    </div>
  );
}
