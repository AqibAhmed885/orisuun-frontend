'use client';

import React, { useEffect, useState } from 'react';
import Close from '@/icons/close';
import StepZero from './_sections/step-zero';
import CofounderMatchSteps from './_sections/cofounder-match-steps';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateBusinessMemberOpportunityData,
  createBusinessMemberOpportunitySchema,
} from '@/utils/schema';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { createBusinessMemberOpportunity } from '../../../../../api/dashboard/coFounder';
import { steps } from '../../../../../../data/dashboard/coFounder';
const CreateNewBusiness = () => {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setWidth(Math.round(((step / steps.length) * 100 * 100) / 100));
  }, [step]);

  const methods = useForm<CreateBusinessMemberOpportunityData>({
    resolver: zodResolver(createBusinessMemberOpportunitySchema),
    mode: "onChange", // Validate on blur
    defaultValues: {
      MatchType: 2,
      BusinessName: "",
      BusinessType: "",
      BusinessLocation: null,
      BusinessIndustry: "",
      BusinessWebsite: "",
      BusinessDescription: "",
      ContactName: "",
      ContactEmail: "",
      ContactPhone: "",
      RoleSought: "",
      RoleDescription: "",
      PostDuration: "3",
      InvestmentRequired: true,
      PreferredExperience: "",
      PostTitle: "",
      DurationDescription: "",
      PreferredExperienceDescription: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const userData = JSON.parse(localStorage.getItem('userData'));
      const teamData = JSON.parse(localStorage.getItem('teamData'));

      if (userData) {
        const matchData = {
          UserId: (teamData && teamData?.isActive) ? teamData?.teamId : userData.Id,
          BusinessName: data.BusinessName,
          YearsInBusiness: data.YearsInBusiness,
          BusinessType: data.BusinessType,
          BusinessLocation: data.BusinessLocation,
          BusinessIndustry: data.BusinessIndustry,
          BusinessWebsite: data.BusinessWebsite,
          BusinessDescription: data.BusinessDescription,
          ContactName: data.ContactName,
          ContactEmail: data.ContactEmail,
          ContactPhone: data.ContactPhone,
          RoleSought: data.RoleSought,
          RoleDescription: data.RoleDescription,
          PostDuration: data.PostDuration,
          InvestmentRequired: data.InvestmentRequired ? data.InvestmentRequired : false,
          PreferredExperience: data.PreferredExperience,
          MatchType: data.MatchType,
          PostTitle: data.PostTitle,
          DurationDescription: data.DurationDescription,
          PreferredExperienceDescription: data.PreferredExperienceDescription,
          Tags: data.Tags,
        };

        const response = await createBusinessMemberOpportunity(matchData);

        if (response.status == 200) {
          toast.success("Opportunity has been saved");
          setTimeout(() => {
            router.push('/cofounder');
          }, 200);
          setLoading(false)
        }
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
      toast.error(error?.response?.data?.Message || 'Something went wrong')
      setLoading(false)
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="w-full md:hidden">
            <div className="relative flex items-center justify-between px-4 py-6 w-100 md:hidden">
              <p className="mx-auto font-semibold text-blue-600 text-h7 2xl:text-scaled-h7">
                {steps[step - 1]?.name || 'Co-Founder & Board  Matcher'}
              </p>
              <Close className="absolute -translate-y-1/2 right-2 top-1/2" onClick={() => router.back()} />
            </div>
            <div
              className={`relative z-10 h-1 overflow-hidden rounded-md bg-omblue-100 w-full`}
            >
              <div
                className={`absolute inset-0 z-10 h-1 bg-omblue-600 transition-all duration-300 ease-in-out`}
                style={{ width: `${width}%` }}
              ></div>
            </div>
          </div>
          {step === 0 ? (
            <StepZero step={step} setStep={setStep} />
          ) : (
            <CofounderMatchSteps steps={steps} step={step} setStep={setStep} loading={loading} />
          )}

        </form >
      </FormProvider >
    </>
  );
};

export default CreateNewBusiness;
