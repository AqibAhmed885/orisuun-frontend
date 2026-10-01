import { cn } from '@/utils/utils';
import React, { Dispatch, SetStateAction } from 'react';
import Overview from './overview';
import Budget from './budget';
import Expiry from './expiry';
import Member from './member';
import { ContractCreateData, contractCreateSchema } from '@/utils/schema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { createContract } from '@/server-actions/contractEscrow';
import { toast } from 'react-toastify';
import Tick from '@/icons/tick';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  steps: Array<any>;
}

const NewContractSteps: React.FC<IProps> = ({ steps, step, setStep }) => {
  const methods = useForm<ContractCreateData>({
    resolver: zodResolver(contractCreateSchema),
    defaultValues: {
      expert:
        (typeof window !== 'undefined' &&
          JSON.parse(localStorage.getItem('expert'))) ||
        [],
    },
  });
  const { currentUser } = useSelector((state: RootState) => state.user);

  const onSubmit = async (data: ContractCreateData) => {
    try {
      if (currentUser.UserId !== null) {
        const expiryDate = new Date(data.ExpiryDate);
        const formattedExpiryDate = expiryDate.toISOString();

        const ContractData = {
          ContractCreatorId: currentUser.Id,
          CounterPartyName: data.CounterPartyName ?? 'Not_Set',
          ContractName: data.Title,
          ContractDescription: data.Description,
          ContractType: 'FreelanceContract',
          Terms: data.TermsOfContact,
          ContractAmount: data.Budget,
          ExpiryDate: formattedExpiryDate,
        };
        const result = await createContract(ContractData);
        if (result.success) {
          toast.success(result.message);
        }
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
    }
  };

  const handleStepClick = (stepId: number) => {
    setStep(stepId);
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ul className={`hidden p-6 grid-cols-${steps.length} md:grid`}>
            {steps.slice(0, 5).map((item: any, index: number) => (
              <li
                className={cn(
                  'flex items-center gap-2 border-b-2 py-2 cursor-pointer transition-colors duration-200 hover:bg-gray-50',
                  item.id === step
                    ? 'border-b-omblue-700'
                    : 'border-b-omblue-100'
                )}
                key={index}
                onClick={() => handleStepClick(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleStepClick(item.id);
                  }
                }}
              >
                <div
                  className={cn(
                    'w-6 h-6 p-2 rounded-full text-xs border font-medium flex items-center justify-center',
                    item.id === step
                      ? 'border-omblue-500 bg-olblue-50 text-omblue-500'
                      : item.id < step
                      ? 'bg-omblue-400 border-none'
                      : 'border-omblue-100 bg-transparent text-omblue-300'
                  )}
                >
                  {item.id < step ? (
                    <Tick className="text-white w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <p
                  className={cn(
                    'font-semibold text-h7',
                    item.id === step ? 'text-omblue-700' : 'text-omblue-300'
                  )}
                >
                  {item.name}
                </p>
              </li>
            ))}
          </ul>

          <div>
            {step === 0 && <Overview step={step} setStep={setStep} />}
            {step === 1 && <Budget step={step} setStep={setStep} />}
            {step === 2 && <Expiry step={step} setStep={setStep} />}
            {step === 3 && <Member step={step} setStep={setStep} />}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default NewContractSteps;