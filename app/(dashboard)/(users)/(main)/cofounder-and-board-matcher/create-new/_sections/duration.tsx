import React, { Dispatch, SetStateAction } from 'react';
import FormLayout from '@/components/ui/form-layout';
import Toggle from '@/components/ui/toggle';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  onSubmit?: any
  loading?: boolean;
}

const Duration: React.FC<IProps> = ({ step, setStep, onSubmit, loading }) => {
  const {
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<CreateBusinessMemberOpportunityData>();
  return (
    <FormLayout
      title="Choose the duration of the post"
      nextButtonType="submit"
      position="start"
      isSubmit={true}
      handleNext={onSubmit}
      handleBack={() => setStep(step - 1)}
      disableSubmit={loading}
    >
      <div className="flex items-center gap-4">
        <Toggle
          className="text-center"
          value={'3'}
          onChange={(e) => {
            setValue('PostDuration', e.target.value);
          }}
          checked={watch('PostDuration') === '3'}
        >
          3 months
        </Toggle>
        <Toggle
          className="text-center"
          value={'6'}
          onChange={(e) => {
            setValue('PostDuration', e.target.value);
          }}
          checked={watch('PostDuration') === '6'}
        >
          6 months
        </Toggle>
      </div>
      {errors.PostDuration && (
        <span className="text-danger-500 text-xs mt-2 m-1">
          {errors.PostDuration.message as string}
        </span>
      )}
    </FormLayout>
  );
};

export default Duration;
