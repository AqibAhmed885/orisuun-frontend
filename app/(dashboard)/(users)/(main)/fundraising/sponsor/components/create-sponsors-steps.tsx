'use client';

import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import SponsorshipDetails from './sponsorship-details'
import SponsorInfo from './sponsor-info';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SponsorPaymentMethod from './Payment';
import { CreateSponsorSchema } from '@/utils/schema';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { RootState } from '@/data/store';
import { useSelector } from 'react-redux';
import { sponsorTabs } from '../../../../../../../data/dashboard/fundraising';
import { SponsorService } from '@/app/api/dashboard/fundraising';

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_ESCROW_PUBLIC_KEY
// );

const CreateSponsorsSteps: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    formState: { errors },
    trigger,
    watch,
    reset,
    setValue,
  } = useFormContext<CreateSponsorSchema>();
  const { campaignInfo } = useSelector((state: RootState) => state.campaign);


  const handleCancle = () => {
    router.push(`/fundraising/${campaignInfo.Id}`);
  };

  const setPaymentMethodValue = (paymentMethod: string) => {
    setValue('PaymentMethodeStripeId', paymentMethod);
  };

  const setPayemntMethodType = (paymentMethodType: string) => {
    setValue('PaymentMethodType', paymentMethodType);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <SponsorInfo />;
      case 2:
        return <SponsorshipDetails />;
      case 3:
        return (
          <div className="max-w-[465px] mx-auto w-full flex flex-col gap-2.5 lg:!gap-6">
            <Elements stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_ESCROW_PUBLIC_KEY)}>
              <SponsorPaymentMethod
                setPaymentMethodValue={setPaymentMethodValue}
                setPayemntMethodType={setPayemntMethodType}
              />
            </Elements>
          </div>
        );
      default:
        return null;
    }
  };

  const validateSponsrBasicInfo = async () => {
    try {
      const PictureValid = await trigger('Picture');
      const NameValid = await trigger('Name');
      const SloganValid = await trigger('Slogan');
      const WebsiteValid = await trigger('Website');

      if (PictureValid && NameValid && SloganValid && WebsiteValid) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const validateSponsorDetails = async () => {
    try {
      const ShortMessageValid = await trigger('ShortMessage');
      const MaximumGiftValid = await trigger('MaximumGift');
      const ImpactValid = await trigger('Impact');
      const MinimumSupportAmountValid = await trigger('MinimumSupportAmount');

      if (
        ShortMessageValid &&
        MaximumGiftValid &&
        ImpactValid &&
        MinimumSupportAmountValid
      ) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const validateSponsorPaymentInfo = async () => {
    try {
      const PayemntMethodValid = await trigger('PaymentMethodeStripeId');
      const PayemntMethodTypeValid = await trigger('PaymentMethodType');
      if (PayemntMethodValid && PayemntMethodTypeValid) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const onNextValidation = async () => {
    if (activeTab === 1) {
      return await validateSponsrBasicInfo();
    } else if (activeTab === 2) {
      return await validateSponsorDetails();
    } else if (activeTab == 3) {
      return await validateSponsorPaymentInfo();
    }
    return false;
  };

  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const values = watch();

  const onSubmit = async () => {
    setLoading(true);
    const data = {
      ...values,
      ProfilePicture: values.Picture,
      SponsorName: values.Name,
      WebsiteUrl: values.Website,
    };
    try {
      const response = await SponsorService.createSponsor(
        values,
        currentUser.Id,
        campaignInfo.Id
      );

      if (response.status === 201) {
        toast.success('Sponsor created successfully');
        router.push('/fundraising/view-all-campaigns');
        reset();
      } else {
        toast.error('Failed to create sponsor');
      }
    } catch (error) {
      toast.error('Error creating posnor!', { type: 'error' });
      console.error('Error creating posnor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs
      tabs={sponsorTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      contentClass="h-full xs:max-h-[calc(100vh-216px)] 2xl:!max-h-[750px] 3xl:!max-h-[820px] 4xl:!max-h-[850px] overflow-auto hide-scrollbar"
      onSubmit={onSubmit}
      OnNextValidation={onNextValidation}
      IsSteps={'false'}
      handleCancle={handleCancle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 h-full">
        <div className="col-span-1 text-center lg:!text-left lg:justify-self-center">
          <h1 className=" xs:text-h2 lg:!text-5xl leading-[120%] text-blue-500 mb-4 lg:!mb-6">
            {sponsorTabs.find((tab) => tab.id === activeTab)?.title}
          </h1>
          <p className="text-[#58595A] lg:!w-[387px] max-w-[387px]">
            {activeTab === 1
              ? 'We want the world to see our campaign sponsors. Share your branding info here.'
              : activeTab === 2
                ? 'Let us know the terms of your sponsorship'
                : 'Add your payment details to complete the setup.'}
          </p>
        </div>
        <div className="col-span-1">{renderTabContent()}</div>
      </div>
    </Tabs>
  );
};

export default CreateSponsorsSteps;
