import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import FormLayout from '@/components/ui/form-layout';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
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
      title="Relevant experience"
      description={`What experience are you seeking in your new board member?`}
      handleNext={handleContinue}
      position="start"
      handleBack={() => setStep(step - 1)}
    >
      <label
        htmlFor="PreferredDescription"
        className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
      >
        Preferred experience
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
      {errors.PreferredExperienceDescription && (
        <span className=" text-red-400 text-xs mt-2 m-1">
          {errors.PreferredExperienceDescription.message}
        </span>
      )}
    </FormLayout>
  );
};

export default BodRole;
