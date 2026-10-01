import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import FormLayout from '@/components/ui/form-layout';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import CustomSelect from '@/components/ui/select';
interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


const BodRole: React.FC<IProps> = ({ step, setStep }) => {
  const {
    formState: { errors },
    trigger,
    watch,
    setValue
  } = useFormContext<CreateBusinessMemberOpportunityData>();
  const selectedType = watch('MatchType');

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
  const [content, setContent] = useState('');
  useEffect(() => {
    setContent(watch('PreferredExperienceDescription'))
  }, [])
  const sanitizeQuillContent = (content) => {
    // Strip out empty <p><br></p> from Quill content
    if (content === '<p><br></p>') {
      return '';
    }
    return content;
  };
  const handleRichTextChange = async (value: string) => {
    const sanitizedContent = sanitizeQuillContent(value.trim()); // Sanitize content
    setContent(sanitizedContent); // Update the state with the sanitized content
    setValue('PreferredExperienceDescription', sanitizedContent); // Update form value for 'RoleDescription'
    await trigger('PreferredExperienceDescription')
  };
  const handleContinue = async () => {
    try {
      if (sanitizeQuillContent(content) !== '') {
        setStep(step + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormLayout
      title="Relevant Experience"
      description={`What experience are you seeking in your new board member?`}
      handleNext={handleContinue}
      position="start"
      handleBack={() => setStep(step - 1)}
    >
      <label
        htmlFor="PreferredDescription"
        className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
      >
        Relevant experience
      </label>
      <ReactQuill
        value={content}
        onChange={handleRichTextChange}
        placeholder="Please describe relevant experience"
        theme="snow"
        className="my-4"
      />

      <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
        {`Maximum 250 words description`}
      </p>

      {/* Board-member specific question */}
      {selectedType === 1002 && (
        <div className="space-y-2 mt-4">
          <h5 className="sm:h5 xl:text-scaled-h5 font-semibold text-blue-500">
            What type of strategic partner are you looking for in a board member?
          </h5>
          <CustomSelect
            placeholder="Select options"
            options={strategicOptions}
            onChange={(selected) => {
              const values = (selected || []).map((s: any) => s.value);
              setValue('StrategicPartnerTypes', values);
              // validate
              trigger('StrategicPartnerTypes');
            }}
            value={watch('StrategicPartnerTypes')?.map((val: string) => ({ value: val, label: val }))}
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
      {errors.PreferredExperienceDescription && (
        <span className=" text-red-400 text-xs mt-2 m-1">
          {errors.PreferredExperienceDescription.message}
        </span>
      )}
    </FormLayout>
  );
};

export default BodRole;
function register(arg0: string, arg1: { required: string; }): React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTextAreaElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  throw new Error('Function not implemented.');
}

