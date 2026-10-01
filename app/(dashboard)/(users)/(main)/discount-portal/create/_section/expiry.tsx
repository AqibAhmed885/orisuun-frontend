'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Toggle from '@/components/ui/toggle';
import { CreateCompnayInformationData } from '@/utils/schema';
import dynamic from 'next/dynamic';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const Expiry: React.FC<IProps> = ({ step, setStep }) => {
  const { register, formState: { errors }, setValue, trigger, watch } = useFormContext<CreateCompnayInformationData>();
  const [custom, setCustom] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [customDuration, setCustomDuration] = useState('');
  const [error, setError] = useState('');
  const [content, setContent] = useState('');

  const handleContinue = () => {
    if (custom && !customDuration.trim()) {
      setError('Please enter a custom duration.');
    } else {
      setError('');
      setStep(step + 1);
    }
  };

  const handleRichTextChange = async (value: string) => {
    setContent(value);
    setValue('TermsOfUsing', value);
    await trigger('TermsOfUsing');
  };

  const handleActivationChange = (value: string) => {
    setValue('DiscountActivation', value);
  };

  const handleEligibilityChange = (value: string) => {
    setValue('ActiveDiscount', value);
  };

  const DiscountForList = ['Businesses', 'Individuals', 'Both'];

  const handlediscountForChange = (value: string) => {
    setValue('DiscountFor', value);
  };

  return (
    <div className=" md:p-6 p-4 lg:min-h-[90vh]">
      <div className="my-4 md:mb-8  md:mx-4 md:my-4">
        <h1 className="mb-6 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
          Expiration
        </h1>
        <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A]">
          {`Set how long the discount is valid and who can use it.`}
        </p>
      </div>
      <div className="flex flex-col my-4 p-4 bg-white border rounded-md border-gray-200 max-w-[920px] mx-auto  md:my-4"
        style={{
          boxShadow: '0px 2px 10px 0px rgba(3, 11, 27, 0.12)',
        }}
      >
        <div className="flex-grow">
          <div className="flex flex-col w-full mb-10 rounded-lg gap-10 md:py-6 lg:px-6">
            <div className="space-y-2">
              <label
                htmlFor="profile-pic"
                className="text-sm md:text-xl font-semibold text-black-500"
              >
                Discount duration
              </label>
              <p className="text-base font-medium text-blue-300">
                Choose how long this discount will remain active.
              </p>
              <div className="grid md:grid-cols-3 grid-cols-2  items-center gap-2 mb-2">
                <Toggle
                  className="text-center"
                  value={'3 Months'}
                  onChange={() => setValue('ProposalDuration', 3)}
                  onClick={() => {
                    setCustom(false);
                    setCustomDuration('');
                  }}
                  checked={watch('ProposalDuration') === 3}

                >
                  3 Months
                </Toggle>
                <Toggle
                  className="text-center"
                  value={'6 Months'}
                  onChange={() => setValue('ProposalDuration', 6)}
                  onClick={() => {
                    setCustom(false);
                    setCustomDuration('');
                  }}
                  checked={watch('ProposalDuration') === 6}

                >
                  6 Months
                </Toggle>
                <Toggle
                  className="text-center"
                  value={0}
                  onChange={() => setValue('ProposalDuration', 0)}
                  // onChange={() => setValue('ProposalDuration', "Custom")}
                  onClick={() => setCustom(!custom)}
                  checked={watch('ProposalDuration') === 0}

                >
                  Custom
                </Toggle>
              </div>
              {custom && (
                <>
                  <Input
                    placeholder="Enter your duration"
                    value={customDuration}
                    type='number'
                    onChange={(e) => {
                      setValue('ProposalDuration', Number(e.target.value))
                      setCustomDuration(e.target.value)
                    }
                    }
                  />
                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="discountDescription"
                className="text-sm md:text-xl font-semibold text-black-500"
              >
                Terms Of use
              </label>
              <p className="text-base font-medium text-blue-300">
                Please provide the full contractual terms of the discount
              </p>
              <ReactQuill
                value={content}
                onChange={handleRichTextChange}
                placeholder="Paste the full terms of use for the discount"
                theme="snow"
                className={`my-4 h-[200px] ${errors.TermsOfUsing ? 'border-red-500' : 'border-gray-300'} border rounded-md`}
              />
              {errors.TermsOfUsing?.message && (
                <p className="text-red-600 text-sm">
                  {errors?.TermsOfUsing?.message}
                </p>
              )}
            </div> 

            <div className="space-y-2 mt-6">
              <label
                htmlFor="discountActivation"
                className="text-sm md:text-xl font-semibold text-black-500"
              >
                Where can this discount be used
              </label>
              <p className="text-base font-medium text-blue-300">
                Select where the discount applies.
              </p>
              <div className="grid md:grid-cols-3 grid-cols-2 items-center gap-2 mb-2">
                <Toggle
                  className="text-center"
                  value={'Online Only'}
                  onChange={() => handleActivationChange('Online Only')}
                  onClick={() => handleActivationChange('Online Only')}
                  checked={watch('DiscountActivation') === 'Online Only'}
                >
                  Online Only
                </Toggle>
                <Toggle
                  className="text-center"
                  value={'In store Only'}
                  onChange={() => handleActivationChange('In store Only')}
                  onClick={() => handleActivationChange('In store Only')}
                  checked={watch('DiscountActivation') === 'In store Only'}
                >
                  In Store Only
                </Toggle>
                <Toggle
                  className="text-center"
                  value={'Online or In Store'}
                  onChange={() => handleActivationChange('Online or In Store')}
                  onClick={() => handleActivationChange('Online or In Store')}
                  checked={watch('DiscountActivation') === 'Online or In Store'}
                >
                  Online or In Store
                </Toggle>
              </div>
              {errors.DiscountActivation && (
                <p className="text-red-600 text-sm">
                  {errors.DiscountActivation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="activationEligibility"
                className="text-sm md:text-xl font-semibold text-black-500"
              >
                Who is eligible for this discount?
              </label>
              <p className="text-base font-medium text-blue-300">
                Choose the customer groups that can redeem this discount.
              </p>
              <div className="grid md:grid-cols-3 grid-cols-2 items-center gap-2 mb-2 w-full ">
                <Toggle
                  className="text-center"
                  value={'New Customers Only'}
                  onChange={() => handleEligibilityChange('New Customers Only')}
                  onClick={() => handleEligibilityChange('New Customers Only')}
                  checked={watch('ActiveDiscount') === 'New Customers Only'}
                >
                  New Customers Only
                </Toggle>
                <Toggle
                  className="text-center"
                  value={'Existing Customers Only'}
                  onChange={() =>
                    handleEligibilityChange('Existing Customers Only')
                  }
                  onClick={() =>
                    handleEligibilityChange('Existing Customers Only')
                  }
                  checked={
                    watch('ActiveDiscount') === 'Existing Customers Only'
                  }
                >
                  Existing Customers Only
                </Toggle>
                <Toggle
                  className="text-center"
                  value={'New Customers and Existing Customers'}
                  onChange={() =>
                    handleEligibilityChange(
                      'New Customers and Existing Customers'
                    )
                  }
                  onClick={() =>
                    handleEligibilityChange(
                      'New Customers and Existing Customers'
                    )
                  }
                  checked={
                    watch('ActiveDiscount') ===
                    'New Customers and Existing Customers'
                  }
                >
                  New Customers and Existing Customers
                </Toggle>
              </div>
              {errors.DiscountActivation && (
                <p className="text-red-600 text-sm">
                  {errors.DiscountActivation.message}
                </p>
              )}
            </div> 

            {currentUser.UserProfileTypeId === 1 && (
              <div className="space-y-2">
                <label
                  htmlFor="activationEligibility"
                  className="text-sm md:text-xl font-semibold text-black-500"
                >
                  Who can use this discount?
                </label>
                <p className="text-base font-medium text-blue-300">
                  Who can avail this discount
                </p>
                <div className="grid md:grid-cols-3 grid-cols-2 items-center gap-2 mb-2">
                  {DiscountForList.map((discountForTitle: string) => (
                    <Toggle
                      key={discountForTitle}
                      className="text-center"
                      value={discountForTitle}
                      onChange={() => handlediscountForChange(discountForTitle)}
                      onClick={() => handlediscountForChange(discountForTitle)}
                      checked={watch('DiscountFor') === discountForTitle}
                    >
                      {discountForTitle}
                    </Toggle>
                  ))}
                </div>
              </div>
            )} 
          </div>
        </div>
        
      </div>
      <div className="flex flex-col md:flex-row items-center py-8 justify-between ">
        <div className="md:w-80 w-full">
          <p className="text-base text-blue-500 mb-4">
            Step {step + 1} of 4
          </p>
          <div className="w-full bg-[#BBCBED] rounded-full h-3 overflow-hidden">
            <div
              className="bg-omblue-500 h-full rounded-full transition-all duration-300"
              style={{
                width: `${((step + 1) / 4) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="flex py-6 flex-row md:mt-auto md:ml-auto ">
          <Button
            className="px-4 py-3 text-omblue-500  me-4 bg-omblue-50 md:w-[170px] rounded-md"
            title="Back"
            onClick={() => setStep(step - 1)}
          />
          <Button
            className="px-4 py-3 bg-omblue-500 text-white md:w-[170px] rounded-md"
            title="Continue"
            onClick={handleContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default Expiry;
