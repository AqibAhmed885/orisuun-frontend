"use client"
import React, { useEffect, useState } from 'react';
import Close from '@/icons/close';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateBusinessMemberOpportunityData,
  createBusinessMemberOpportunitySchema,
} from '@/utils/schema';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import StepZero from './_sections/step-zero';
import CofounderMatchSteps from './_sections/cofounder-match-steps';
import { steps } from '../../../../../../../data/dashboard/coFounder';
import { getBusinessMemberDetails, updateBusinessMemberOpportunity } from '../../../../../../api/dashboard/coFounder';
const CreateNewBusiness = () => {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState(0);
  const router = useRouter();
  const { id } = useParams();
  const [cofounderData, setCofounderData] = useState(null);
 
  useEffect(() => {
    setWidth(Math.round(((step / steps.length) * 100 * 100) / 100));
  }, [step]);
 
  const methods = useForm<CreateBusinessMemberOpportunityData>({
    resolver: zodResolver(createBusinessMemberOpportunitySchema),
    mode: 'onBlur', // Validate on blur
    defaultValues: {
      MatchType: 0,
      BusinessName: '',
      BusinessType: '',
      BusinessLocation: null,
      BusinessIndustry: '',
      BusinessWebsite: '',
      BusinessDescription: '',
      ContactName: '',
      ContactEmail: '',
      ContactPhone: '',
      RoleSought: '',
      RoleDescription: '',
      PostDuration: '3',
      PreferredExperience: '',
      PostTitle: '',
      DurationDescription: '',
      PreferredExperienceDescription: '',
      InvestmentRequired: true
    },
  });
 
  const { reset } = methods;
 
  useEffect(() => {
    (async () => {
      const getUserData = JSON.parse(localStorage.getItem('userData'));
      try {
        const fetchedData = await getBusinessMemberDetails(Array.isArray(id) ? id[0] : id, getUserData?.Id);
        setCofounderData(fetchedData);
        reset({
          MatchType: fetchedData.MatchType || 0,
          BusinessName: fetchedData.BusinessName || '',
          YearsInBusiness: fetchedData.YearsInBusiness || null,
          BusinessType: fetchedData.BusinessType || '',
          BusinessLocation: fetchedData.BusinessLocation || null,
          BusinessIndustry: fetchedData.BusinessIndustry || '',
          BusinessWebsite: fetchedData.BusinessWebsite || '',
          BusinessDescription: fetchedData.BusinessDescription || '',
          ContactName: fetchedData.ContactName || '',
          ContactEmail: fetchedData.ContactEmail || '',
          ContactPhone: fetchedData.ContactPhone || '',
          RoleSought: fetchedData.RoleSought || '',
          RoleDescription: fetchedData.RoleDescription || '',
          PostDuration: fetchedData.PostDuration || '3',
          PreferredExperience: fetchedData.PreferredExperience || '',
          PostTitle: fetchedData.PostTitle || '',
          DurationDescription: fetchedData.DurationDescription || '',
          PreferredExperienceDescription: fetchedData.PreferredExperienceDescription || '',
          InvestmentRequired: fetchedData.InvestmentRequired,
        });
      } catch (error) {
        console.error('Error fetching business member details:', error);
        toast.error('Failed to fetch business details');
      }
    })();
  }, [id, reset]);
 
  const onSubmit = async (data: CreateBusinessMemberOpportunityData) => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        const matchData = {
          ...data,
          UserId: cofounderData?.UserId,
          Id: Number(id)
        };
 
        await updateBusinessMemberOpportunity(matchData);
        toast.success('Opportunity has been updated');
        setTimeout(() => {
          router.push('/cofounder-and-board-matcher');
        }, 200);
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
      toast.error(error?.response?.data?.Message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
 
  return (
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
      </form>
    </FormProvider>
  );
};
 
export default CreateNewBusiness;