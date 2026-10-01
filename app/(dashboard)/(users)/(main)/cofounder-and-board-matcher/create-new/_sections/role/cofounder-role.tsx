import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import FormLayout from '@/components/ui/form-layout';
import CustomSelect from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
import Toggle from '@/components/ui/toggle';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const rolesOptions = [
  { label: 'Chief Executive Officer (CEO)', value: 'Chief Executive Officer (CEO)' },
  { label: 'Chief Technology Officer (CTO)', value: 'Chief Technology Officer (CTO)' },
  { label: 'Chief Marketing Officer (CMO)', value: 'Chief Marketing Officer (CMO)' },
  { label: 'Chief Science Officer (CSO)', value: 'Chief Science Officer (CSO)' },
  { label: 'Chief Legal Officer (CLO)', value: 'Chief Legal Officer (CLO)' },
  { label: 'Chief Financial Officer (CFO)', value: 'Chief Financial Officer (CFO)' },
  { label: 'Chief Product Officer (CPO)', value: 'Chief Product Officer (CPO)' },
  { label: 'President', value: 'President' },
  { label: 'Other', value: 'Other' },
];

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CofounderRole: React.FC<IProps> = ({ step, setStep }) => {
  const [content, setContent] = useState('');
  const [contentPreferred, setContentPreferred] = useState('');

  const {
    setValue,
    formState: { errors },
    watch,
    trigger,
    register,
  } = useFormContext<CreateBusinessMemberOpportunityData>();

  const selectedType = watch('MatchType');

  useEffect(() => {
    setContent(watch('RoleDescription'))
    setContentPreferred(watch('PreferredExperienceDescription'))
    setValue('InvestmentRequired', watch('InvestmentRequired') ?? false)
    setValue('PassionateProblem', watch('PassionateProblem') ?? '')
  }, [])
  const sanitizeQuillContent = (content) => {
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
      <div className="block tracking-wide">
        <label
          htmlFor="RoleDescription"
          className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
        >
          Ideal Role
        </label>
        <ReactQuill
          value={content}
          onChange={handleRichTextChange}
          placeholder="Please describe the role"
          theme="snow"
          className="my-4"
        />
        {/* <textarea
          {...register('RoleDescription')}
          rows={4}
          placeholder="Please describe the role"
          className="resize-none border mb-0 border-black-100 w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
        /> */}

        <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
          {`Maximum 250 words description`}
        </p>
        {errors.RoleDescription && (
          <span className=" text-red-400 text-xs mt-2 m-1">
            {errors.RoleDescription.message}
          </span>
        )}
      </div>
      <p className='tracking-wide'>Are you open to making an investment in the business, right? </p>
      <div className="flex items-center gap-4 pb-3">
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
      <label
        htmlFor="PreferredDescription"
        className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
      >
        Relevant Experience
      </label>
      <ReactQuill
        value={contentPreferred}
        onChange={handleRichTextPreferredChange}
        placeholder="Please describe relevant experience"
        theme="snow"
        className="mb-4"
      />
      {/* <textarea
        {...register('PreferredExperience')}
        rows={4}
        placeholder="Please describe preferred experience"
        className="resize-none border mb-0 border-black-100 w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
      /> */}
      <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
        {`Maximum 250 words description`}
      </p>
      {errors.PreferredExperienceDescription && (
        <span className=" text-red-400 text-xs mt-2 m-1">
          {errors.PreferredExperienceDescription.message}
        </span>
      )}
      {/* Co-founder specific question */}
      {selectedType === 2 && (
        <div className="space-y-2 tracking-wide">
          <h5 className="text-base  ">
            What problem are you most passionate about solving right now?
          </h5>
          <textarea
            {...register('PassionateProblem', { required: 'This field is required' })}
            rows={4}
            placeholder="Describe the problem"
            className={`resize-none border ${errors.PassionateProblem ? 'border-red-500' : 'border-black-100'} w-full rounded-md py-3 px-4 focus:border-black-400 outline-none mb-2`}
          />
          {/* <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
            Maximum 250 words description
          </p> */}
          {errors.PassionateProblem && (
            <span className="text-red-400 text-xs mt-2 m-1">
              {errors.PassionateProblem.message}
            </span>
          )}
        </div>
      )}
    </FormLayout>
  );
};

export default CofounderRole;
