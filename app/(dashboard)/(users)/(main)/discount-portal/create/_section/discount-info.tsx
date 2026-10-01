import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Toggle from '@/components/ui/toggle';
import { CreateCompnayInformationData } from '@/utils/schema';
import { useFormContext } from 'react-hook-form';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Switch from '@/components/ui/switch';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';


interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}


const DiscountInformation: React.FC<IProps> = ({ step, setStep }) => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useFormContext<CreateCompnayInformationData>();
  

  const handleContinue = async () => {
    const DiscountDescription = await trigger('DiscountDescription');
    // const TermsOfUsing = await trigger('TermsOfUsing');
    // const DiscountActivation = await trigger('DiscountActivation');
    // const ActivationEligibility = await trigger('ActivationEligibility');

    if (
      DiscountDescription 
      // DiscountActivation &&
      // ActivationEligibility &&
      // TermsOfUsing
    ) {
      setStep(step + 1); 
    }
  };



  return (
    <div className=" md:p-6 p-4 lg:min-h-[90vh]">
      <div className="my-4  md:mx-4 md:my-4">
        <h1 className="mb-3 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
          Discount Info
        </h1>
        <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A]">
          {`Tell us about the discount you want to offer.`}
        </p>
      </div>
      <div className="flex flex-col max-w-[920px] mx-auto p-4 bg-white border border-gray-200 rounded-lg" style={{
        boxShadow: '0px 2px 10px 0px rgba(3, 11, 27, 0.12)',
      }}>
        <div className="">
          <div className="flex flex-col w-full mb-10 rounded-lg gap-10 md:py-6 lg:px-6">
            <div className="space-y-2">
              <label
                htmlFor="discountDescription"
                className="text-lg font-semibold text-black-500"
              >
                Discount Details
              </label>
              <p className="text-base font-light text-blue-300">
                What type of discount are you offering?
              </p>
              <Input
                {...register('DiscountDescription')}
                placeholder="Discount type / description "
                error={
                  errors.DiscountDescription
                    ? errors.DiscountDescription?.message
                    : null
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="discountDescription"
                className="text-lg font-semibold text-black-500"
              >
                Percentage OFF
              </label>
              <p className="text-base font-light text-blue-300">
                Enter a value between 1–100%.
              </p>
              <Input
                {...register('DiscountPercentage')}
                placeholder="1-100%"
                error={
                  errors.DiscountPercentage
                    ? errors.DiscountPercentage?.message
                    : null
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="discountDescription"
                className="text-lg font-semibold text-black-500"
              >
                Estimated Savings
              </label>
              <p className="text-base font-light text-blue-300">
                Select the estimated value
              </p>
              <Input
                {...register('EstimatedSavings')}
                placeholder="$1000-2000"
                error={
                  errors.EstimatedSavings
                    ? errors.EstimatedSavings?.message
                    : null
                }
              />
            </div>
            {/* */}

            {/* 
            */}

            {/* */}

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Switch
                  label="Ideal for startups?"
                  isOn={watch('IsStartUps')}
                  isTitle={'Yes'}
                  onToggle={() => setValue('IsStartUps', !watch('IsStartUps'))}
                />
              </div>
            </div>
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

        <div className="flex  md:py-0 py-6 md:mt-auto md:ml-auto md:flex-row">
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

export default DiscountInformation;
