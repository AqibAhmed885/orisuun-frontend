import React, { Dispatch, SetStateAction, useState } from 'react';
import FormLayout from '@/components/ui/form-layout';
import CustomSelect from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
import Toggle from '@/components/ui/toggle';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { rolesOptions } from '../../../../../../../../data/dashboard/coFounder';
interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const CofounderRole: React.FC<IProps> = ({ step, setStep }) => {
  const {
    setValue,
    formState: { errors },
    watch,
    trigger,
  } = useFormContext<CreateBusinessMemberOpportunityData>();
  const [content, setContent] = useState(watch('RoleDescription'));
  const [contentPreferred, setContentPreferred] = useState(watch('PreferredExperienceDescription'));
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
    setValue('RoleDescription', sanitizedContent); // Update form value for 'RoleDescription'
    await trigger('RoleDescription')
  };

  const handleRichTextPreferredChange = async (value: string) => {
    const sanitizedContent = sanitizeQuillContent(value.trim()); // Sanitize content
    setContentPreferred(sanitizedContent); // Update the state with the sanitized content
    setValue('PreferredExperienceDescription', sanitizedContent); // Update form value for 'PreferredExperienceDescription'
    await trigger('PreferredExperienceDescription')
  };

  const handleContinue = async () => {
    await trigger('RoleDescription');
    await trigger('PreferredExperienceDescription');
    try {
      const RoleSought = await trigger('RoleSought');

      if (RoleSought && sanitizeQuillContent(content) !== '' &&
        sanitizeQuillContent(contentPreferred) !== '') {
        setStep(step + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormLayout
      title="Role Sought"
      description={`Please describe the role`}
      handleNext={handleContinue}
      position="start"
      handleBack={() => setStep(step - 1)}
    >
      <CustomSelect
        placeholder="Role Sought"
        options={rolesOptions}
        onChange={async (val) => {
          setValue('RoleSought', val.value);
          await trigger('RoleSought');
        }}
        error={errors.RoleSought?.message}
        value={rolesOptions.find(
          (rolesOption) => rolesOption.value === watch('RoleSought')
        )}
      />
      <div className="block">
        <ReactQuill
          value={content}
          onChange={handleRichTextChange}
          placeholder="Please describe the role"
          theme="snow"
          className="mb-4"
        />
        <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
          {`Maximum 250 words description`}
        </p>
        {errors.RoleDescription && (
          <span className=" text-red-400 text-xs mt-2 m-1">
            {errors.RoleDescription.message}
          </span>
        )}
      </div>
      <p>Is an investment required to become co-founder?</p>
      <div className="flex items-center gap-4">
        <Toggle
          className="text-center"
          value={'Yes'}
          onClick={(e) => {
            setValue('InvestmentRequired', true);
          }}
          checked={watch('InvestmentRequired') === true}
        >
          Yes
        </Toggle>
        <Toggle
          className="text-center"
          value={'No'}
          onClick={(e) => {
            setValue('InvestmentRequired', false);
          }}
          checked={watch('InvestmentRequired') === false}
        >
          No
        </Toggle>
      </div>
      <ReactQuill
        value={contentPreferred}
        onChange={handleRichTextPreferredChange}
        placeholder="Please describe preferred experience"
        theme="snow"
        className="mb-4"
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

export default CofounderRole;
