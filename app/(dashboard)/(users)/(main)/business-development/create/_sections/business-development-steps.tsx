import { cn } from '@/utils/utils';
import React, { Dispatch, SetStateAction, useState } from 'react';
import ServiceProducing from './service-producing';
import Region from './region';
import OpportunityDetails from './opportunity';
import { FormProvider, useForm } from 'react-hook-form';
import {
  BusinessOpportunitiesData,
  businessOpportunitySchema,
} from '@/utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { businessDevelopmentStepsService } from '@/app/api/dashboard/businessDevelopment';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  steps: Array<any>;
}

const BusinessDevelopmentSteps: React.FC<IProps> = ({
  steps,
  step,
  setStep,
}) => {
  const methods = useForm<BusinessOpportunitiesData>({
    resolver: zodResolver(businessOpportunitySchema),
    mode: "onChange",
    defaultValues: {
      tactics: [],
      strategy: "",
      timeline: ''
    }
  });
  const [BdId, setBdId] = useState()
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const onSubmit = async (data: BusinessOpportunitiesData) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
    try {
      setLoading(true);
      const response = await businessDevelopmentStepsService.saveBdDescriptionData(data, BdId, apiKey);
      toast.success(response?.Message || 'Saved Successfully');
      router.push("/business-development");
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error(error?.response?.data?.Message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='mb-14'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ul className="hidden p-6 grid-cols-3 gap-4 md:grid">
            {steps.slice(0, 5).map((item, index) => (
              <li
                className={cn(
                  'flex items-center gap-2 border-b-2 py-2',
                  item.id === step
                    ? 'border-b-omblue-700'
                    : 'border-b-omblue-100'
                )}
                key={index}
              >
                <p
                  className={cn(
                    'w-6 h-6 p-2 rounded-full text-xs border  font-medium flex items-center justify-center',
                    item.id === step
                      ? 'border-omblue-500 bg-olblue-50 text-omblue-500'
                      : 'border-omblue-100 bg-transparent text-omblue-300'
                  )}
                >
                  {++index}
                </p>
                <p
                  className={cn(
                    'font-semibold text-h7 2xl:text-scaled-h7',
                    item.id === step ? 'text-omblue-700' : 'text-omblue-300'
                  )}
                >
                  {item.name}
                </p>
              </li>
            ))}
          </ul>

          <div>
            {step === 1 && <ServiceProducing setBdId={setBdId} BdId={BdId} step={step} setStep={setStep} />}
            {step === 2 && <Region setBdId={setBdId} BdId={BdId} step={step} setStep={setStep} />}
            {step === 3 && <OpportunityDetails setBdId={setBdId} BdId={BdId} step={step} setStep={setStep} loading={loading} />}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default BusinessDevelopmentSteps;
