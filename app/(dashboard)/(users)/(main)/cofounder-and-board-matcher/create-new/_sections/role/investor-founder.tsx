import React, { Dispatch, SetStateAction } from 'react';
import FormLayout from '@/components/ui/form-layout';
import Toggle from '@/components/ui/toggle';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const InvestorFounder: React.FC<IProps> = ({ step, setStep }) => {
  const {
    setValue,
    formState: { errors },
    trigger,
  } = useFormContext<CreateBusinessMemberOpportunityData>();

  const handleContinue = async () => {
    try {
      const InvestmentRequired = await trigger('InvestmentRequired');

      if (InvestmentRequired) {
        setStep(step + 1);
      } 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormLayout
      title="Is an investment required to become co-founder?"
      handleNext={handleContinue}
      position="start"
    >
      <form className="space-y-4">
        <div className="flex items-center gap-4">
          <Toggle
            className="text-center"
            value={'Yes'}
            onClick={(e) => {
              setValue('InvestmentRequired', true);
            }}
          >
            Yes
          </Toggle>
          <Toggle
            className="text-center"
            value={'No'}
            onClick={(e) => {
              setValue('InvestmentRequired', false);
            }}
          >
            No
          </Toggle>
        </div>
      </form>
    </FormLayout>
  );
};

export default InvestorFounder;
