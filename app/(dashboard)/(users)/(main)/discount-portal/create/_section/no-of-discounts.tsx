'use client';

import Button from '@/components/ui/button';
import Dropzone from '@/components/ui/dropzone';
import Input from '@/components/ui/input';
import Toggle from '@/components/ui/toggle';
import { CreateCompnayInformationData } from '@/utils/schema';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  loading?: boolean;
}

const NoOfDiscounts: React.FC<IProps> = ({ step, setStep, loading }) => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useFormContext<CreateCompnayInformationData>();
  const [custom, setCustom] = useState(false);
  const [customDiscount, setCustomDiscount] = useState('');
  const [error, setError] = useState('');
  const [discountCodeType, setDiscountCodeType] = useState<'unique' | 'single'>('unique');

  return (
    <div className="g md:gap-5 md:p-6 p-4 lg:min-h-[90vh]">
      <div className="my-4  md:mb-8  md:mx-4 md:my-4">
        <h1 className="mb-6 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
          Discount
        </h1>
        <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A] mb-3">
          {`Please enter the details of your discount codes.`}
        </p>
      </div>
      <div className="flex flex-col my-4 max-w-[920px] p-4 mx-auto border border-gray-200 rounded-md bg-white md:my-4"
        style={{
          boxShadow: '0px 2px 10px 0px rgba(3, 11, 27, 0.12)',
        }}
      >
        <div className="flex-grow">
          <div className="flex flex-col w-full mb-10 rounded-lg gap-10 md:py-6 lg:px-6">
            <div className="space-y-2">
              {/* Discount Code Type Selection */}
              <div className="mb-8 space-y-4">
                <h2 className="text-sm md:text-xl font-medium text-black-500 ">
                  How will the discount code work?
                </h2>
                <p className="text-base font-light text-[#58595A] ">
                  Choose whether each member receives their own unique code, or everyone shares a single code.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Unique Code Per Member Option */}
                  <label className="flex items-start p-4 border rounded-lg cursor-pointer transition-all">
                    
                    <div className=" flex-grow">
                      <h3 className="text-lg font-medium text-black-500 mb-1">
                        Unique code per member
                      </h3>
                      <p className="text-sm mt-3 text-[#58595A]">
                        Each member receives their own individual discount code. Best for tracking usage per person.
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="discountCodeType"
                      value="unique"
                      checked={discountCodeType === 'unique'}
                      onChange={() => {
                        setDiscountCodeType('unique');
                        setValue('SingleDiscountCode', '');
                      }}
                      className=" w-8 h-8 cursor-pointer"
                    />
                  </label>

                  {/* One Code For Everyone Option */}
                  <label className="flex items-start p-4 border rounded-lg cursor-pointer transition-all"
                   >
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-medium text-black-500 mb-1">
                        One code for everyone
                      </h3>
                      <p className="text-sm mt-3 text-[#58595A]">
                        All members share a single discount code. Simpler to manage and distribute.
                      </p>
                    </div>

                    <input
                      type="radio"
                      name="discountCodeType"
                      value="single"
                      checked={discountCodeType === 'single'}
                      onChange={() => {
                        setDiscountCodeType('single');
                        setValue('DiscountCode', null);
                        setValue('DiscountCodeString', '');
                      }}
                      className=" w-8 h-8 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Conditional Content Based on Selection */}
              {discountCodeType === 'unique' ? (
                // UNIQUE CODE PER MEMBER FORM
                <>
                  <label
                    htmlFor="profile-pic"
                    className="text-sm md:text-xl font-medium text-black-500 block mt-6"
                  >
                    Number of discounts per user
                  </label>
                  <p className="text-base font-medium text-blue-300">
                    User discount limit
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-6 items-center gap-2 mb-2 overflow-x-auto">
                    <Toggle
                      className="text-center"
                      value={'1 Discounts'}
                      onChange={() => setValue('NumberOfDiscount', '1')}
                      onClick={() => {
                        setCustom(false);
                        setCustomDiscount('');
                      }}
                      checked={Number(watch('NumberOfDiscount')) === 1}
                    >
                      1 Discount
                    </Toggle>
                    <Toggle
                      className="text-center"
                      value={'3 Discounts'}
                      onChange={() => setValue('NumberOfDiscount', '3')}
                      onClick={() => {
                        setCustom(false);
                        setCustomDiscount('');
                      }}
                      checked={Number(watch('NumberOfDiscount')) === 3}
                    >
                      3 Discounts
                    </Toggle>
                    <Toggle
                      className="text-center"
                      value={'5 Discounts'}
                      onChange={() => setValue('NumberOfDiscount', '5')}
                      onClick={() => {
                        setCustom(false);
                        setCustomDiscount('');
                      }}
                      checked={Number(watch('NumberOfDiscount')) === 5}
                    >
                      5 Discounts
                    </Toggle>
                    <Toggle
                      className="text-center"
                      value={'10 Discounts'}
                      onChange={() => setValue('NumberOfDiscount', '10')}
                      onClick={() => {
                        setCustom(false);
                        setCustomDiscount('');
                      }}
                      checked={Number(watch('NumberOfDiscount')) === 10}
                    >
                      10 Discounts
                    </Toggle>
                    <Toggle
                      className="text-center"
                      value={'Custom'}
                      onChange={() => setValue('NumberOfDiscount', '0')}
                      onClick={() => setCustom(!custom)}
                      checked={custom && true}
                    >
                      Custom
                    </Toggle>
                  </div>
                  {custom && (
                    <>
                      <Input
                        type="number"
                        placeholder="Enter your custom discount amount"
                        {...register('NumberOfDiscount', {
                          required: 'Enter your custom discount amount',
                        })}
                        error={errors.NumberOfDiscount?.message}
                      />
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                    </>
                  )}

                  <h2 className="text-sm md:text-xl font-medium pt-8 text-black-500 ">
                    Add Set of Unique Discount Codes
                  </h2>

                  <p className="text-base  text-black-500  pb-2">
                    There are two ways to enter your codes into our database. You
                    may use only one of the options.
                  </p>
                  <p className="text-base text-black-400 pb-2">
                    Option 1. Upload an Excel file with all the codes in the first
                    column (no header - first code in first row)
                  </p>
                  <Dropzone
                    acceptedFileTypes="xlsx"
                    maxSize={10 * 1024 * 1024}
                    layout="normal"
                    onFilesUpload={(file) => {
                      setValue('DiscountCode', file[0]);
                      trigger('DiscountCode');
                    }}
                    storedFile={watch('DiscountCode')}
                    onChange={(file) => {
                      trigger('DiscountCode');
                    }}
                    onFileRemove={() => {
                      setValue('DiscountCode', null);
                      trigger('DiscountCode');
                    }}
                    disabled={
                      watch('DiscountCodeString')?.length > 0 ? true : false
                    }
                  />

                  <p className="text-base text-black-400 py-2">
                    Option 2. Paste the codes directly in the box below
                  </p>
                  <textarea
                    rows={5}
                    placeholder="Paste your disocunt codes here (make sure each code is separated by a coma)"
                    {...register('DiscountCodeString')}
                    disabled={watch('DiscountCode')}
                    className={`w-full resize-none outline-none border-[0.8px] ${errors.DiscountCode?.message ||
                        errors.DiscountCodeString?.message
                        ? 'border-red-600'
                        : 'border-black-200 '
                      }   rounded-md px-4 py-3 text-h9 2xl:text-scaled-h9 text-black-200 font-medium`}
                  />

                  {(errors.DiscountCode?.message ||
                    errors.DiscountCodeString?.message) && (
                      <p className="text-red-600 text-sm">
                        {errors.DiscountCode?.message
                          ? typeof errors.DiscountCode?.message === 'string' &&
                          errors.DiscountCode?.message
                          : typeof errors.DiscountCodeString?.message === 'string' &&
                          errors.DiscountCodeString?.message}
                      </p>
                    )}
                </>
              ) : (
                // ONE CODE FOR EVERYONE FORM
                <>
                  <div className="mt-6 space-y-3">
                    <h3 className="text-sm md:text-xl font-medium text-black-500">
                      Enter the discount code
                    </h3>
                    <p className="text-base  text-[#58595A]">
                      This single code will be shared with all eligible members.
                    </p>
                    <Input
                      type="text"
                      placeholder="E.g. SAVE20"
                      {...register('SingleDiscountCode', {
                        required: 'Please enter a discount code',
                        onChange: (event) => {
                          setValue('DiscountCodeString', event.target.value || '');
                        },
                      })}
                      error={errors.SingleDiscountCode?.message}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
      </div>
      <div className='flex flex-col md:flex-row justify-between items-center py-8 '>
        {/* Stepper Section */}
        <div className="md:w-80 w-full">
          <p className="text-base text-black-500 mb-4">
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
        <div className="flex py-6 md:py-0  md:mx-4  md:mt-auto md:ml-auto md:flex-row">
          <Button
            className="px-4 py-3 text-omblue-500  me-4 bg-white md:w-[170px] rounded-md"
            title="Back"
            onClick={() => setStep(step - 1)}
          />
          <Button
            className="px-4 py-3 bg-omblue-500 text-white md:w-[170px] rounded-md"
            title="Submit"
            disabled={loading}
          />
        </div>

      </div>
      
    </div>
  );
};

export default NoOfDiscounts;
