'use client';
import dynamic from 'next/dynamic';
const CreateSponsorsSteps = dynamic(
  () => import('@/app/(dashboard)/(users)/(main)/fundraising/sponsor/components/create-sponsors-steps'),
  { ssr: false }
);
// import CreateSponsorsSteps from '@/app/(dashboard)/(users)/(main)/fundraising/sponsor/components/create-sponsors-steps';
import {
  createSponsor,
  CreateSponsorSchema,
} from '@/utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function CreateSponsor() {
  const methods = useForm<CreateSponsorSchema>({
    resolver: zodResolver(createSponsor),
    mode: 'onSubmit',
    defaultValues: {
      Duration: null,
    },
  });

  return (
    <div className="xs:p-4 lg:!p-6 h-[calc(100vh-60px)] lg:!h-screen overflow-auto">
      <FormProvider {...methods}>
        <CreateSponsorsSteps />
      </FormProvider>
    </div>
  );
}
