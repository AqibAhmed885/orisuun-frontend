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
import { updateBusinessMemberOpportunity } from '../../../../../api/dashboard/coFounder';
import { steps } from '../../../../../../data/dashboard/coFounder';
import Industry from './_sections/industry';
import { RootState } from '@/data/store';
import { useSelector } from 'react-redux';

const CreateNewBusiness = () => {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState(0);
  const [BdId, setBdId] = useState<any>(null);
  const router = useRouter();
  const teamData = useSelector((state: RootState) => state.user.teamData);

  const methods = useForm<CreateBusinessMemberOpportunityData>({
    resolver: zodResolver(createBusinessMemberOpportunitySchema),
    mode: "onChange", // Validate on blur
    defaultValues: {
      MatchType: 2,
      BusinessName: "",
      BusinessType: "",
      BusinessLocation: null,
      BusinessIndustry: "", // Change to empty string for single-select
      BusinessWebsite: "test.com",
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
      PassionateProblem: "", // Add for Co-Founder question
      StrategicPartnerTypes: [], // Add for Board Member question
    },
  });


  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const userData = JSON.parse(localStorage.getItem('userData'));

      if (userData && BdId) {
        const matchData = {
          Id: BdId, // Use the BdId from state
          UserId: teamData?.isActive ? teamData?.teamId : userData.Id,
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
          PassionateProblem: data.PassionateProblem,
          StrategicPartnerTypes: data.StrategicPartnerTypes,
          PersonalLocation: data.PersonalLocation,
          StrategicStrengths: data.StrategicStrengths,
        };

        const response = await updateBusinessMemberOpportunity(matchData);

        if (response) {
          toast.success("Opportunity created successfully");
          setTimeout(() => {
            router.push('/cofounder-and-board-matcher');
          }, 200);
          setLoading(false)
        }
      } else {
        toast.error('BdId is missing. Please complete the previous steps.');
        setLoading(false);
      }
    } catch (error) {
      console.error('An error occurred during update:', error);
      toast.error(error?.response?.data?.Message || 'Something went wrong')
      setLoading(false)
    }
  };

  return (
    <div className='mb-14'>
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
            <Industry step={step} setStep={setStep} BdId={BdId} setBdId={setBdId} />
          ) : (
              <CofounderMatchSteps steps={steps} step={step} setStep={setStep} loading={loading} BdId={BdId} onSubmit={methods.handleSubmit(onSubmit)} /> 
          )}

        </form >
      </FormProvider >
    </div>
  );
};

export default CreateNewBusiness;
