import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { cn } from '@/utils/utils';
import BusinessDocuments from './_section/_business-documents';
import Identification from './_section/_identification';
import OnlinePresence from './_section/_online-presence';
import OwnershipProof from './_section/_ownership-proof';
import Review from './_section/review';
import Statement from './_section/_statement';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  steps: Array<any>;
}
const VerificationSteps: React.FC<IProps> = ({ steps, step, setStep }) => {

  return (
    <div>
      <ul className="hidden p-6 grid-cols-5 md:grid">
        {steps.slice(0, 5).map((item, index) => (
          <li
            className={cn(
              'flex items-center gap-2 border-b-2 py-2',
              item.id === step ? 'border-b-omblue-700' : 'border-b-omblue-100'
            )}
            key={index}
          >
            <p
              className={cn(
                'w-6 h-6 p-2 rounded-full text-xs border font-medium flex items-center justify-center',
                item.id === step
                  ? 'border-omblue-500 bg-olblue-50 text-omblue-500'
                  : 'border-omblue-100 bg-transparent text-omblue-300'
              )}
            >
              {++index}
            </p>
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
        {step === 1 && <OnlinePresence step={step} setStep={setStep} />}
        {step === 2 && <Identification step={step} setStep={setStep} />}
        {step === 3 && <BusinessDocuments step={step} setStep={setStep} />}
        {step === 4 && <OwnershipProof step={step} setStep={setStep} />}
        {step === 5 && <Statement step={step} setStep={setStep} />}
        {step === 6 && <Review step={step} setStep={setStep} />}
      </div>
    </div>
  );
};

export default VerificationSteps;
