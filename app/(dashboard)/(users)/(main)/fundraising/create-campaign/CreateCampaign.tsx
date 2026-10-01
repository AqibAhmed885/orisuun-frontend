'use client';

import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CampaignSchema, createCampaignSchema } from '@/utils/schema';
import CreateCampaignSteps from '@/app/(dashboard)/(users)/(main)/fundraising/create-campaign/components/create-campaign-steps';
import { campaignService } from '../../../../../api/dashboard/fundraising'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function CreateCampaign() {
  const methods = useForm<CampaignSchema>({
    resolver: zodResolver(createCampaignSchema),
    mode: 'onSubmit',
    defaultValues: {
      Duration: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      YoutubeLink: '',
      FacebookLink: '',
      InstagramLink: '',
      LinkedInLink: '',
      BlueSkyLink: '',
    },
  });

  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const onSubmit = async () => {
    setLoading(true);
    const values = methods.getValues();
    try {
      await campaignService.createCampaign(values, currentUser.Id);
      toast.success('Campaign created successfully');
      router.push('/fundraising/view-all-campaigns');
      methods.reset();
    } catch (error) {
      toast.error('Error creating campaign!');
      console.error('Error creating campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xs:p-4 xs:mb-5 lg:!mb-0 lg:!p-6 lg:!h-screen overflow-auto">
      <FormProvider {...methods}>
        <CreateCampaignSteps
          onSubmit={onSubmit}
          isSubmitting={loading}
        />
      </FormProvider>
    </div>
  );
}
