import React, { Dispatch, SetStateAction } from 'react';
import FormLayout from '@/components/ui/form-layout';
import Toggle from '@/components/ui/toggle';
import Input from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  loading?: boolean;
}

const DurationDetails: React.FC<IProps> = ({ step, setStep, loading }) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<CreateBusinessMemberOpportunityData>();
  return (
    <FormLayout
      title="Post details"
      description="Please fill in title and choose the duration of the post"
      nextButtonType="submit"
      position="start"
      isSubmit={true}
      handleBack={() => setStep(step - 1)}
      disableSubmit={loading}
    >
      <div className="space-y-2">
        <h5 className="sm:h5 xl:text-scaled-h5 font-semibold text-blue-500">
          Post title
        </h5>
        <p className="sm:h9 xl:text-scaled-h9 text-blue-300 font-medium mb-2">
          {`Please enter post title`}
        </p>
        <Input
          {...register('PostTitle')}
          placeholder="Post title"
          error={errors.PostTitle && errors.PostTitle.message}
        />
      </div>
      <div className="space-y-2">
        <h5 className="sm:h5 xl:text-scaled-h5 font-semibold text-blue-500">
          Post duration
        </h5>
        <p className="sm:h9 xl:text-scaled-h9 text-blue-300 font-medium mb-2">
          {`Choose the duration of the post`}
        </p>
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
      </div>
    </FormLayout>
  );
};

export default DurationDetails;
