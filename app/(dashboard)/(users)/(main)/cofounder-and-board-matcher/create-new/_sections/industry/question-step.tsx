'use client';

import FormLayout from '@/components/ui/form-layout';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
import React, { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomSelect from '@/components/ui/select';

interface IProps {
  setServiceStep: Dispatch<SetStateAction<number>>;
}

const QuestionStep: React.FC<IProps> = ({ setServiceStep }) => {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
    trigger,
    setError,
    clearErrors,
  } = useFormContext<CreateBusinessMemberOpportunityData>();
  const selectedType = watch('MatchType');

  const handleContinue = async () => {
    // ensure a type is selected
    if (!selectedType) {
      setError('MatchType', { type: 'manual', message: 'Please select an opportunity type' });
      return;
    }

    let isValid = true;

    if (selectedType === 2) { // Co-Founder
      // PassionateProblem already registered with required in textarea below,
      // trigger will set errors if empty
      isValid = await trigger('PassionateProblem');
      if (!isValid) setError('PassionateProblem', { type: 'manual', message: 'Please describe the problem' });
    } else if (selectedType === 1002) { // Board Member
      const selectedStrategic = watch('StrategicPartnerTypes') ?? [];
      if (!Array.isArray(selectedStrategic) || selectedStrategic.length === 0) {
        setError('StrategicPartnerTypes', { type: 'manual', message: 'Select at least one strategic partner type' });
        isValid = false;
      } else {
        // clear manual error and trigger validation
        clearErrors('StrategicPartnerTypes');
        await trigger('StrategicPartnerTypes');
      }
    }

    if (isValid) {
      setServiceStep((prev) => prev + 1);
    }
  };

  const strategicOptions = [
    { value: 'Industry expertise', label: 'Industry expertise' },
    { value: 'Network & Access', label: 'Network & Access' },
    { value: 'Functional Strength', label: 'Functional Strength' },
    { value: 'Stage-Relevant Experience', label: 'Stage-Relevant Experience' },
    { value: 'Diversity & Representation', label: 'Diversity & Representation' },
    { value: 'Mission Alignment', label: 'Mission Alignment' },
    { value: 'Strategic vision', label: 'Strategic vision' },
    { value: 'Operational Excellence', label: 'Operational Excellence' },
    { value: 'Governance & Accountability', label: 'Governance & Accountability' },
  ];

  return (
    <FormLayout
      title="Tell us more"
      description="Provide details to help us match you better."
      handleNext={handleContinue}
      handleBack={() => setServiceStep((prev) => prev - 1)}
    >
      {selectedType === 2 && ( // Co-Founder question
        <div className="space-y-2 ">
          <h5 className="sm:h5 xl:text-scaled-h5 font-semibold text-blue-500">
            What problem are you most passionate about solving right now?
          </h5>
          <textarea
            {...register('PassionateProblem', { required: 'This field is required' })}
            rows={4}
            placeholder="Describe the problem"
            className={`resize-none border ${errors.PassionateProblem ? 'border-red-500' : 'border-black-100'} w-full rounded-md py-3 px-4 focus:border-black-400 outline-none mb-2`}
          />
          <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
            Maximum 250 words description
          </p>
          {errors.PassionateProblem && (
            <span className="text-red-400 text-xs mt-2 m-1">
              {errors.PassionateProblem.message}
            </span>
          )}
        </div>
      )}

      {selectedType === 1002 && ( // Board Member question
        <div className="space-y-2">
          <h5 className="sm:h5 xl:text-scaled-h5 font-semibold text-blue-500">
            What type of strategic partner are you looking for in a board member?
          </h5>
          <CustomSelect
            placeholder="Select options"
            options={strategicOptions}
            onChange={(selected) => {
              const values = (selected || []).map(s => s.value);
              setValue('StrategicPartnerTypes', values);
              if (values.length === 0) {
                setError('StrategicPartnerTypes', { type: 'manual', message: 'Select at least one option' });
              } else {
                clearErrors('StrategicPartnerTypes');
              }
              trigger('StrategicPartnerTypes');
            }}
            value={watch('StrategicPartnerTypes')?.map(val => ({ value: val, label: val }))}
            isMulti
            error={errors.StrategicPartnerTypes?.message}
          />
          {errors.StrategicPartnerTypes && (
            <span className="text-red-400 text-xs mt-2 m-1">
              {errors.StrategicPartnerTypes.message}
            </span>
          )}
        </div>
      )}
    </FormLayout>
  );
};

export default QuestionStep;