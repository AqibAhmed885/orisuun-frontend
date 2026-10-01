import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import {
  CampaignDetailsProvider,
  Contributor,
  useCampaignDetails,
} from './context/campaign-context';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { toast } from 'react-toastify';
import { CampaignDetailSkeletonList } from '@/components/feed-card-skeleton/campaignDetaIlsSkeleton';
import CampaignStats from './stats';
import GallerySlideshow from './gallery';
import Sponsors from './sponsors';
import Contributors from './contributors';
import Support from './support';
import Details from './details';
import RewardsList from './rewards';
import Modal from '@/components/ui/modal/modal';
import { Elements } from '@stripe/react-stripe-js';
import FundCampaign from './FundCampaign';
import ExclamationIcon from '@/icons/exclamation';

interface ICamapignPropos {
  CampaignId: number;
  isPublic?: boolean;
}

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_ESCROW_PUBLIC_KEY as string
// );

const CampaignDetailsContent = ({
  CampaignId,
  isPublic = false,
}: ICamapignPropos) => {
  const [isLoading, setIsLoading] = useState(false);
  const { campaignInfo, setNewContributor, setCampaignDetails } =
    useCampaignDetails();
  const [showDetails, setShowDetails] = useState(false);
  const [amount, setAmount] = useState<number>(null);

  const handleNextOnPayment = () => {
    setShowDetails(false);
  };

  const handleNewContribution = (data: Contributor) => {
    setNewContributor(data);
  };

  const fetchCampaignDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiEndpoint}/Campaign/GetCampaignDetails/${CampaignId}`,
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        }
      );
      if (response.status === 200) {
        setCampaignDetails(response.data.Result);
      } else {
        toast.error('Failed to fetch campaign');
      }
    } catch (error) {
      toast.error('Error fetching campaign!');
      console.error('Error fetching campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (CampaignId) fetchCampaignDetails();
  }, [CampaignId]);

  const handleShowSupport = () => setShowDetails(!showDetails);

  const handleOnSucess = () => {
    handleShowSupport();
    toast.success('Contribution successful!');
    fetchCampaignDetails();
  };

  return (
    <div className="grid xs:grid-cols-1 lg:!grid-cols-[auto_376px] 2xl:!grid-cols-3 gap-6 tracking-wide">
      {isLoading && <CampaignDetailSkeletonList />}
      {!isLoading && (
        <>
          <div className="divide-y flex flex-col space-y-7 2xl:col-span-2">
            <CampaignStats />
            <GallerySlideshow />
            <Details className={'xs:hidden lg:!block'} />
          </div>
          <div className="2xl:col-span-1 space-y-6">
            <Sponsors isPublic={isPublic} />
            <Contributors />
            <Support
              amount={amount}
              setAmount={setAmount}
              handleShowSupport={handleShowSupport}
              isPublic={isPublic}
            />
            <RewardsList isPublic={isPublic} />
            <Details className={'xs:block lg:!hidden'} />
          </div>
        </>
      )}

      <Modal
        showModal={showDetails}
        setShowModal={setShowDetails}
        title={`Contribute`}
        modalSize="sm"
      >
        <Elements stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_ESCROW_PUBLIC_KEY as string)}>
          <FundCampaign
            campaignId={campaignInfo.Id}
            handleNewContribution={handleNewContribution}
            isAmountFixed={false}
            amount={amount || 0}
            onSucess={handleOnSucess}
          />
        </Elements>
      </Modal>
    </div>
  );
};

const Campaign = ({ CampaignId, isPublic }: ICamapignPropos) => {
  return (
    <div className="xs:p-4 lg:!p-6 space-y-6">
      <CampaignDetailsProvider>
        <CampaignDetailsContent CampaignId={CampaignId} isPublic={isPublic} />
        <div className="mobile:p-3 p-4 rounded-xl flex mobile:items-start items-center bg-white shadow-custom box-border mobile:gap-2.5 gap-5 border border-gray-300-custom">
          <div className="mobile:min-w-[30px] mobile:min-h-[30px] min-w-[50px] h-[50px] flex items-center justify-center">
            <ExclamationIcon className="mobile:w-6 mobile:h-6 w-10 h-10" />
          </div>
          <p className="text-blue-300 font-medium text-sm mobile:text-h8 leading-[130%]">
            Orisuun does not guarantee the delivery of promised rewards.
            Furthermore, Orisuun is not responsible or liable for the content or
            claims found in any fundraising campaign. See our Terms of Service
            for more information.
          </p>
        </div>
      </CampaignDetailsProvider>
    </div>
  );
};

export default Campaign;
