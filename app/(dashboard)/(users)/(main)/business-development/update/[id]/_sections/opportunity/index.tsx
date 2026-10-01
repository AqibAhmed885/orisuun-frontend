'use client';

import Button from '@/components/ui/button';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useState } from 'react';
import opportunityImage from '@/public/images/opportunity-details.png';
import Toggle from '@/components/ui/toggle';
import Add from '@/icons/add';
import Input from '@/components/ui/input';
import CustomSelect from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';
import { BusinessOpportunitiesData } from '@/utils/schema';
import BottomSheet from '@/components/ui/bottom-sheet';
import { cn } from '@/utils/utils';
import ChipInput from '@/components/ui/chip-input';
import {
  diversificationTacticOptions,
  mdTacticOptions,
  mpTacticOptions,
  pdTacticOptions,
} from '@/utils/businessDevelopment';
import { strategyColorMapUpdateSteps, strategyOptions, structureOptions, timelineOptions } from '@/data/dashboard/BusinessDevelopment';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  BdId?: any;
  setBdId?: any;
  tagsList?: any;
  methods?: any;
  loading?: any;
}

const OpportunityDetails: React.FC<IProps> = ({
  step,
  setStep,
  methods,
  BdId,
  setBdId,
  tagsList,
  loading,
}) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    formState: { errors },
    trigger,
    handleSubmit,
    setValue,
    watch,
    control,
  } = useFormContext<BusinessOpportunitiesData>();

  const watchedStrategy = watch('strategy');
  const watchedTactics = watch('tactics');
  const handleStrategyToggle = async (strategy: string) => {
    setValue('strategy', strategy);
    await trigger('strategy')
  };
  const handleTacticToggle =async (tactic: string) => {
    const currentTactics = watchedTactics || [];
    const updatedTactics = currentTactics.includes(tactic)
      ? currentTactics.filter((t: any) => t !== tactic)
      : [...currentTactics, tactic];
    setValue('tactics', updatedTactics);
    await trigger('tactics')
  };

  const mapTactics = {
    'Market Penetration': mpTacticOptions,
    'Market Development': mdTacticOptions,
    'Product Development': pdTacticOptions,
    Diversification: diversificationTacticOptions,
  };

  return (
    <>
      <div className="grid grid-cols-8 gap-5 p-4 md:p-6">
        <div className="col-span-8 my-4 lg:col-span-4 md:mx-4 md:my-11 md:h-screen">
          <div className="flex items-start justify-between gap-4 md:px-4">
            <div className="space-y-4">
              <h1 className="text-h1 md:text-h11 2xl:text-scaled-h11">
                Opportunity Details
              </h1>
              <p className="text-h7 2xl:text-scaled-h7 text-blue-300 font-medium">
                Please tell us about your opportunity
              </p>
            </div>
          </div>
          <div className="space-y-4 hidden md:block">
            <div className="py-8">
              <Image
                src={opportunityImage}
                alt="opportunity details"
                width={2096}
                height={2096}
                className="w-[80%] h-auto"
              />
            </div>
            <div className="space-y-2.5">
              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-300">
                <span className="text-h7 2xl:text-scaled-h7 font-semibold text-black-500">
                  Market Penetration:
                </span>{' '}
                Increasing sales of a business&rsquo;s existing products into
                its existing market.
              </p>

              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-300">
                <span className="text-h7 2xl:text-scaled-h7 font-semibold text-black-500">
                  Product Development:
                </span>{' '}
                Introducing a new product (for the business) into that
                business&rsquo;s existing market.
              </p>

              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-300">
                <span className="text-h7 2xl:text-scaled-h7 font-semibold text-black-500">
                  Market Development:
                </span>{' '}
                Introducing a business&rsquo;s existing product into a new
                market.
              </p>
              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-300">
                <span className="text-h7 2xl:text-scaled-h7 font-semibold text-black-500">
                  Diversification:
                </span>{' '}
                Entering a new market with a new (for the business) product.
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-8 lg:col-span-4 lg:col-start-5 md:mx-4">
          <div className="flex flex-col md:my-6">
            <div className="flex-grow space-y-10">
              <div className="space-y-2">
                <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500">
                  Strategy
                </h5>
                <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
                  Choose the strategy
                </p>
                <div className="grid grid-cols-12 gap-2">
                  {strategyOptions?.map((strategy, index) => {
                    const selectedStyles = strategyColorMapUpdateSteps[strategy] || {};

                    return (
                      <div key={index} className="col-span-12 md:col-span-6">
                        <Toggle
                          className="text-center"
                          onClick={() => handleStrategyToggle(strategy)}
                          selectedColor={`${selectedStyles.bg} ${selectedStyles.text} ${selectedStyles.border} border 2xl:text-scaled-h5 text-h9`}
                          checked={watchedStrategy?.includes(strategy)}
                          spanColor={selectedStyles.text}
                          value={strategy}
                        >
                          {strategy}
                        </Toggle>
                      </div>
                    );
                  })}
                </div>
                {errors.strategy && (
                  <p className="text-red-500">{errors.strategy.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500">
                  Tactics
                </h5>
                <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
                  Choose the tactics
                </p>
                <div className="flex items-center flex-wrap gap-2">
                  {mapTactics[`${watchedStrategy}`]?.map((item) => (
                    <div
                      key={item.value}
                      className="cursor-pointer"
                      onClick={() => handleTacticToggle(item.value)}
                    >
                      <div
                        className={`p-1.5 text-h7 2xl:text-scaled-h7 font-semibold border flex items-center justify-center rounded-md gap-2 ${
                          watchedTactics?.includes(item.value)
                            ? 'text-omblue-500 bg-olblue-50 border-omblue-500'
                            : 'text-blue-500 border-blue-500'
                        }`}
                      >
                        <p>{item.label}</p>
                        <Add
                          className={cn('w-4 h-4 transition-transform', {
                            '-rotate-45': watchedTactics?.includes(item.value),
                          })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {errors.tactics && (
                  <p className="text-red-500">{errors.tactics.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500">
                  Business Development Representative
                </h5>
                <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
                  {`Please enter contact details for the opportunity's point of
                contact`}
                </p>
                <div className="space-y-2">
                  <Input
                    placeholder="Representative Name"
                    {...register('representativeName')}
                    error={errors.representativeName?.message}
                  />
                  <Input
                    placeholder="Job Title"
                    {...register('jobTitle')}
                    error={errors.jobTitle?.message}
                  />
                  <Input
                    placeholder="Phone (Optional)"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                  <Input
                    placeholder="Email"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500">
                    Opportunity Structure
                  </h5>
                </div>
                <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
                  {`Choose the opportunity structure`}
                </p>
                <div className="space-y-2">
                  <div className="col-span-6">
                    <CustomSelect
                      placeholder={'Select Structure'}
                      options={structureOptions}
                      onChange={async (val) => {
                        setValue('structure', val.value);
                        await trigger('structure');
                      }}
                      error={errors.structure?.message}
                      value={structureOptions.find(
                        (structureOption) =>
                          structureOption.value === watch('structure')
                      )}
                    />
                  </div>{' '}
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500">
                  Timeline
                </h5>
                <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
                  {`Choose the timeline`}
                </p>
                <div className="flex items-center flex-wrap gap-2">
                  {timelineOptions.map((timeline) => (
                    <div key={timeline}>
                      <Toggle
                        className="text-center"
                        onClick={async() => {setValue('timeline', timeline);await trigger('timeline')}}
                        checked={watch('timeline') === timeline}
                        value={timeline}
                      >
                        {timeline}
                      </Toggle>
                    </div>
                  ))}
                </div>
                {errors.timeline && (
                  <span className="text-danger-500 text-xs mt-2 m-1">
                    {errors.timeline.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500">
                  Search Tags
                </h5>
                <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
                  {`Add related tags for search purposes`}
                </p>
                <div className="space-y-2">
                  <Controller
                    name="tags"
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
                        error={errors.tags?.message}
                        {...field}
                      />
                    )}
                  />
                  <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
                    {`Enter up to 5 tags`}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500">
                  Opportunity Description
                </h5>
                <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
                  {`Please provide the details of this opportunity`}
                </p>
                <div className="space-y-1">
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Describe your opportunity"
                    className={`block w-full outline-none border ${errors.description
                      ? 'border-red-500'
                      : 'border-[#457EA2]'
                      } rounded-md py-2 px-3 text-gray-700`}
                  />
                  {errors.description && (
                   <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                  <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
                    {`Maximum 250 words description`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4 w-full mt-40 md:mt-auto flex flex-col md:flex-row items-center justify-end gap-4 md:pe-10">
            <Button
              className="px-4 py-3 text-omblue-500 border border-omblue-100 bg-white md:w-[170px] rounded-md"
              onClick={() => setStep((prev) => prev - 1)}
              title="Back"
            >
              Back
            </Button>
            <Button
              className="px-4 py-3 bg-omblue-500 text-white md:w-[170px] rounded-md"
              title="Submit"
              type="submit"
              disabled={loading}
            ></Button>
          </div>
        </div>
      </div>
      <BottomSheet isOpen={open} onClose={() => setOpen(false)}>
        <div className="space-y-4 block">
          <div className="py-8">
            <Image
              src={opportunityImage}
              alt="opportunity details"
              width={2096}
              height={2096}
            />
          </div>
          <div className="space-y-2.5">
            <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-300">
              <span className="text-h7 2xl:text-scaled-h7 font-semibold text-black-500">
                Market Penetration:
              </span>{' '}
              Increasing sales of a business’s existing products into its
              existing market.
            </p>
            <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-300">
              <span className="text-h7 2xl:text-scaled-h7 font-semibold text-black-500">
                Market Penetration:
              </span>{' '}
              Increasing sales of a business’s existing products into its
              existing market.
            </p>
            <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-300">
              <span className="text-h7 2xl:text-scaled-h7 font-semibold text-black-500">
                Market Penetration:
              </span>{' '}
              Increasing sales of a business’s existing products into its
              existing market.
            </p>
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default OpportunityDetails;
