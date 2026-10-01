import FormLayout from '@/components/ui/form-layout';
import Input from '@/components/ui/input';
import Add from '@/icons/add';
import { ProfileExpertBasicFormData } from '@/utils/schema';
import React, { Dispatch, SetStateAction } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import ChipInput from '@/components/ui/chip-input';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

interface IProps {
  basicExpertStep: number;
  setBasicExpertStep: Dispatch<SetStateAction<number>>;
  loader: boolean;
  onSubmit: () => void;
}

const UserDetailsExpertsAdditional: React.FC<IProps> = ({
  basicExpertStep,
  setBasicExpertStep,
  loader,
  onSubmit,
}) => {

  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext<ProfileExpertBasicFormData>();
  const [details, setDetails] = useState<
    Array<any>
  >(getValues()?.AdditionalAboutYouDetails || []);

  const {
    fields: aboutYouFields,
    append: appendAboutYou,
    remove: removeAboutYou,
  } = useFieldArray({
    control,
    // @ts-ignore
    name: 'AdditionalAboutYouDetails' as const,
  });

  const {
    fields: tagFields,
    append: appendTags,
    remove: removeTags,
  } = useFieldArray({
    control,
    // @ts-ignore
    name: 'Tags' as const,
  });


  return (
    <FormLayout
      title="Basic Information"
      description="Please provide some more information about you"
      position="start"
      nextButtonType="submit"
      variant="equal"
      showBack={true}
      handleBack={() => setBasicExpertStep(basicExpertStep - 1)}
      disableNext={loader}
      handleNext={onSubmit}
    >
      <div className="flex flex-col w-full mb-10 rounded-lg gap-6 md:py-6 lg:px-6">
        <div className="space-y-3">
          <label
            id="about_you"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            About You <span className="text-danger-500">*</span>
          </label>
          <div className="">
            <textarea
              id="about_you"
              rows={3}
              placeholder="Write a brief, introductory statement about yourself and Work....."
              className="w-full resize-none border-[0.8px] border-black-200 rounded-md px-4 py-3 text-h9 2xl:text-scaled-h9 text-black-400 font-medium"
              {...register('AboutYou')}
            />
            <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-300">
              Maximum 1000 words description
            </p>
            {errors.AboutYou && (
              // <span className="absolute left-0 text-red-400 text-xs 2xl:text-sm -bottom-3.5">
              <span className="text-red-400 text-xs mt-2 m-1">
                {errors.AboutYou.message}
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
                  placeholder: `Additional detail ${details.length + 1}.....`,
                },
              ])
            }
          >
            <Add />
            Add Additional Detail
          </button>
          {details.map((detail, index) => (
            <Input
              {...register(`AdditionalAboutYouDetails.${index}`)}
              placeholder={detail.placeholder}
              key={index}
              error={
                errors.AdditionalAboutYouDetails?.[index] &&
                errors.AdditionalAboutYouDetails[index].message
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
        <div className="space-y-3">
          <label
            htmlFor="video-link"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Video Link
          </label>
          <Input
            id="video-link"
            placeholder="Video Link"
            error={errors.VideoLink?.message}
            {...register('VideoLink')}
          />
        </div>
      </div>
    </FormLayout>
  );
};

export default UserDetailsExpertsAdditional;
