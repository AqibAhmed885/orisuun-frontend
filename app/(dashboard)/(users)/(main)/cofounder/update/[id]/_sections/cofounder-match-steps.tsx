import { cn } from '@/utils/utils';
import React, { Dispatch, SetStateAction } from 'react';
import BusinessDetails from './business-details';
import Contact from './contact';
import CofounderRole from '../role/cofounder-role';
import Duration from '../_sections/duration';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
import BodRole from '../role/bod-role';
import DurationDetails from './duration-details';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  steps: Array<any>;
  onSubmit?: any
  loading?: boolean;
}

const CofounderMatchSteps: React.FC<IProps> = ({ steps, step, setStep, onSubmit, loading }) => {
  const { watch } = useFormContext<CreateBusinessMemberOpportunityData>();
  return (
    <div>
      <ul className="hidden p-6 grid-cols-4 gap-4 md:grid">
        {steps.slice(1, 5).map((item, index) => (
          <li
            className={cn(
              'flex items-center gap-2 border-b-2 py-2',
              item.id === step ? 'border-b-omblue-700' : 'border-b-omblue-100'
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
        {step === 1 && <BusinessDetails step={step} setStep={setStep} />}
        {step === 2 && <Contact step={step} setStep={setStep} />}
        {step === 3 ? (
          watch('MatchType') === 2 ? (
            <CofounderRole step={step} setStep={setStep} />
          ) : (
            <BodRole step={step} setStep={setStep} />
          )
        ) : null}
        {step === 4 ? (
          watch('MatchType') === 2 ? (
            <Duration step={step} setStep={setStep} onSubmit={onSubmit} loading={loading} />
          ) : (
            <DurationDetails step={step} setStep={setStep} loading={loading} />
          )
        ) : null}
      </div>
    </div>
  );
};

export default CofounderMatchSteps;
