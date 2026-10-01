import React, { Dispatch, SetStateAction } from 'react';
import FormLayout from '@/components/ui/form-layout';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const PreferredExperience: React.FC<IProps> = ({ step, setStep }) => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext<CreateBusinessMemberOpportunityData>();

  const handleContinue = async () => {
    try {
      const PreferredExperience = await trigger('PreferredExperience');

      if (PreferredExperience) {
        setStep(step + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormLayout
      title="Preferred experience"
      description="Please describe preferred experience"
      handleNext={handleContinue}
      position="start"
    >
      <form className="space-y-4">
        <textarea
          {...register('PreferredExperience')}
          rows={4}
          placeholder="Please describe preferred experience"
          className="resize-none border mb-0 border-black-100 w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
        />
        <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
          {`Maximum 250 words description`}
        </p>
      </form>
    </FormLayout>
  );
};

export default PreferredExperience;
