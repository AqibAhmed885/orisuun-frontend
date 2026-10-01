import ChipInput from '@/components/ui/chip-input';
import FormLayout from '@/components/ui/form-layout';
import Input from '@/components/ui/input';
import Add from '@/icons/add';
import { ProfileBasicFormData } from '@/utils/schema';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface IProps {
  basicInfoStep: number;
  setBasicInfoStep: Dispatch<SetStateAction<number>>;
  onSubmit: any;
  loader: boolean
}

const AboutCompany: React.FC<IProps> = ({
  basicInfoStep,
  setBasicInfoStep,
  onSubmit,
  loader
}) => {
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext<ProfileBasicFormData>();
  const [details, setDetails] = useState<
    Array<any>
  >(getValues()?.CompanyDetails || []);
  const tags = watch('Tags')

  const handleKeyUp = async () => {
    await trigger('AboutCompany'); // Trigger validation for AboutCompany
  };


  return (
    <FormLayout
      title="Basic Information"
      description="Please provide your company’s information"
      position="start"
      showBack={true}
      nextButtonType="submit"
      variant="equal"
      handleNext={onSubmit}
      disableNext={loader}
      handleBack={() => setBasicInfoStep(basicInfoStep - 1)}
    >
      <div className="flex flex-col w-full mb-10 rounded-lg gap-10 md:py-6 lg:px-6">
        <div className="space-y-3">
          <label
            id="about_company"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            About Company <span className="text-danger-500">*</span>
          </label>
          <div className="">
            <textarea
              id="about_company"
              rows={3}
              placeholder="Write a brief, introductory statement about your company....."
              className="w-full resize-none border-[0.8px] border-black-200 rounded-md px-4 py-3 text-h9 2xl:text-scaled-h9 text-black-400 font-medium"
              {...register('AboutCompany')}
              onKeyUp={handleKeyUp}
            />
            <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-300">
              Maximum 1000 words description
            </p>
            {errors.AboutCompany && (
              // <span className="absolute left-0 text-red-400 text-xs 2xl:text-sm -bottom-3.5">
              <span className="text-red-400 text-xs mt-2 m-1">
                {errors.AboutCompany.message}
              </span>
            )}
          </div>
          <button
            type="button"
            className="text-omblue-600 text-h9 2xl:text-scaled-h9 font-semibold flex items-center gap-0.5"
            onClick={() =>
              setDetails((prev) => [
                ...prev,
                {
                  id: details.length + 1,
                  placeholder: `Company detail ${details.length + 1}.....`,
                },
              ])
            }
          >
            <Add />
            Add Company Detail
          </button>
          {details?.map((detail, index) => (
            <Input
              {...register(`CompanyDetails.${index}`)}
              placeholder={detail.placeholder}
              key={index}
              error={
                errors.CompanyDetails?.[index] &&
                errors.CompanyDetails[index].message
              }
            />
          ))}
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Search Tags
            </label>
            <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-300">
              Add related keywords for search purposes
            </p>
          </div>
          <div className="space-y-2">
            <Controller
              name="Tags"
              control={control}
              rules={{
                required: 'At least one tag is required',
                maxLength: {
                  value: 5,
                  message: 'Maximum 5 tags allowed',
                },
              }}
              render={({ field }) => (
                <ChipInput
                  placeholder="Enter tags (press Enter or comma to add)"
                  error={errors.Tags?.message as string}
                  {...field}
                />
              )}
            />
            <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
              Helps members find you – add up to 5 tags
            </p>
          </div>
        </div>
      </div>
    </FormLayout>
  );
};

export default AboutCompany;