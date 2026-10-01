import React, { Dispatch, SetStateAction, useState } from 'react';
import { cn } from '@/utils/utils';
import CompanyInformation from './company-info';
import DiscountInformation from './discount-info';
import Expiry from './expiry';
import NoOfDiscounts from './no-of-discounts';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stepSchemas } from '@/utils/discountSchema';
import { companyInformationSchema } from '@/utils/schema';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { DiscountCreationService } from '@/app/api/dashboard/discount-portal';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  steps: Array<any>;
}

const CreateDiscountSteps: React.FC<IProps> = ({ steps, step, setStep }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const currentSchema = stepSchemas[step] || companyInformationSchema;
  const methods = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      CompanyLogo: '',
      CompanyName: '',
      CompanyWebsite: '',
      CompanySlogan: '',
      CompanyIndustry: '',
      CompanyType: '',
      CompanyDescription: '',
      DiscountDescription: '',
      IsStartUps: true,
      DiscountActivation: 'Online Only',
      DiscountType:
        currentUser?.UserProfileTypeId === 1
          ? 'Member discounts'
          : 'Partner discounts',
      DiscountFor: 'Businesses',
      ActiveDiscount: 'New Customers Only',
      ProposalDuration: 3,
      TermsOfUsing: '',
      DiscountCode: '',
      DiscountOff: '',
      DiscountPercentage: '',
      EstimatedSavings: '',
      SingleDiscountCode: '',
    },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      const allData = methods.getValues() as Record<string, unknown>;
      const formData = new FormData();
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData?.Id) {
        formData.append('UserId', String(userData.Id));
      }

      const transientKeys = new Set(['logo']);

      Object.entries(allData).forEach(([key, value]) => {
        if (transientKeys.has(key)) {
          return;
        }

        if (value === undefined || value === null || value === '') {
          return;
        }

        if (value && typeof value === 'object' && value instanceof File) {
          formData.append(key, value);
          return;
        }

        formData.append(key, String(value));
      });

      const singleDiscountCode = allData['SingleDiscountCode'];
      const discountCodeFile = allData['DiscountCode'];
      const discountCodeString = allData['DiscountCodeString'];

      if (singleDiscountCode && !discountCodeFile && !discountCodeString) {
        formData.append('DiscountCodeString', String(singleDiscountCode));
      }

      // Add required backend fields with default values if not present
      // These fields are required by the API but not collected in the UI
      if (!formData.has('CompanyType')) {
        formData.append('CompanyType', 'General');
      }
      if (!formData.has('CompanyIndustry')) {
        formData.append('CompanyIndustry', 'General');
      }

      const userId = localStorage.getItem('userId');
      if (userId) {
        formData.set('UserId', userId);
      }

      const debugEntries: Array<Record<string, unknown>> = [];
      formData.forEach((value, key) => {
        if (value instanceof File) {
          debugEntries.push({
            key,
            type: 'file',
            name: value.name,
            size: value.size,
            mimeType: value.type,
          });
          return;
        }

        debugEntries.push({ key, type: 'text', value });
      });


      const res = await DiscountCreationService.saveDiscountDetails(formData);

      if (res.status === 200) {
        toast.success('Discount created successfully');
        router.push('/discount-portal');
        setLoading(false);
      }
    } catch (error) {
      console.error('[DiscountCreate] Save API error', error);
      toast.error(
        error?.response?.data?.Message || 'Failed to create discount'
      );
      setLoading(false);
    }
  };

  

  return (
    <div>
      <div className='bg-white border-b border-gray-300'>
        <h1 className='md:px-6 px-4 py-4 text-3xl font-medium'>Create Discount</h1>
        <ul className="grid grid-cols-4 px-4 max-w-[920px] mx-auto">
          {steps.slice(0, 5).map((item, index) => (
            <li
              className={cn(
                'flex items-center flex-col gap-2  py-2',
                item.id === step ? 'border-b-2 border-b-[#2357C6]' : ''
              )}
              key={index}
            >
              <p
                className={cn(
                  ' rounded-full text-xs font-light flex items-center justify-center',
                  item.id === step
                    ? ' bg-olblue-50 text-[#2357C6]'
                    : 'bg-transparent text-[#7e7e7e] '
                )}
              >
                {item.icon}
              </p>
              <p
                className={cn(
                  'font-light text-xs text-center md:text-base ',
                  item.id === step ? 'text-[#2357C6]' : 'text-[#7e7e7e]'
                )}
              >
                {item.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div>
            {step === 0 && <CompanyInformation step={step} setStep={setStep} />}
            {step === 1 && (
              <DiscountInformation step={step} setStep={setStep} />
            )}
            {step === 2 && <Expiry step={step} setStep={setStep} />}
            {step === 3 && (
              <NoOfDiscounts step={step} setStep={setStep} loading={loading} />
            )}
          </div>

          
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateDiscountSteps;
