'use client';

import FormLayout from '@/components/ui/form-layout';
import Handshake from '@/icons/handshake';
import Users from '@/icons/users';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
import React, { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const StepZero: React.FC<IProps> = ({ step, setStep }) => {
  const { setValue, watch } =
    useFormContext<CreateBusinessMemberOpportunityData>();

  return (
    <FormLayout
      title="How can we help you get started?"
      description={`Take advantage of Orisuun's network and find a knowledgeable and
              well-connected board member for your business or a co-founder for
              your new business venture.`}
      handleNext={() => setStep(step + 1)}
      showBack={false}
    >
      <button
        className={`w-full border rounded-lg p-6 space-y-4 ${watch('MatchType') === 2
          ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
          : 'border-[#D2D4DA]'
          }`}
        onClick={() => setValue('MatchType', 2)}
        type="button"
      >
        <Users className="text-omblue-500 w-6 h-6" />
        <h5 className="md:h5 text-left font-semibold text-black-400">
          Co-Founder Match
        </h5>
      </button>
      <button
        className={`w-full border rounded-lg p-6 space-y-4 ${watch('MatchType') === 1002
          ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
          : 'border-[#D2D4DA]'
          }`}
        onClick={() => setValue('MatchType', 1002)}
        type="button"
      >
        <Handshake className="text-omblue-500 w-6 h-6" />
        <h5 className="md:h5 text-left font-semibold text-black-400">
          Board of Directors Member Match
        </h5>
      </button>
    </FormLayout>
  );
};

export default StepZero;
