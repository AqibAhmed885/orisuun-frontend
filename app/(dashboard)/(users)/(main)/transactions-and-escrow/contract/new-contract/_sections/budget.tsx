import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Toggle from '@/components/ui/toggle';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ContractCreateData } from '@/utils/schema';
import { useFormContext } from 'react-hook-form';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const Budget: React.FC<IProps> = ({ step, setStep }) => {
  const [custom, setCustom] = useState(false);

  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    watch,
    getValues,
  } = useFormContext<ContractCreateData>();

  const selectedBudget = watch('Budget');

  const handleContinue = async () => {
    try {
      const BudgetValid = await trigger('Budget');

      if (BudgetValid) {
        setStep(step + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-8 gap-5 md:p-6 p-4 lg:min-h-[90vh]">
      <div className="my-4 col-span-8 md:mb-8 lg:col-span-4 md:mx-4">
        <h1 className="mb-6 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
          Project Overview
        </h1>
        <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A]">
          Please tell us about this transaction
        </p>
      </div>
      <div className="flex flex-col my-4 col-span-8 lg:col-span-4 lg:col-start-5 md:mx-4">
        <div className="flex-grow">
          <div className="flex flex-col w-full mb-10 rounded-lg gap-2 md:py-6 lg:px-6">
            <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-black-500">
              Fix Price
            </h5>
            <p className="text-blue-300 text-h7 2xl:text-scaled-h7 font-medium mb-2">
              Please provide the details of your contract
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Toggle
                onClick={() => {
                  setValue('Budget', 100);
                  setCustom(false);
                }}
                checked={selectedBudget === 100}
                className="text-center"
              >
                $100
              </Toggle>
              <Toggle
                onClick={() => {
                  setValue('Budget', 250);
                  setCustom(false);
                }}
                checked={selectedBudget === 250}
                className="text-center"
              >
                $250
              </Toggle>
              <Toggle
                onClick={() => {
                  setValue('Budget', 500);

                  setCustom(false);
                }}
                checked={selectedBudget === 500}
                className="text-center"
              >
                $500
              </Toggle>
              <Toggle
                onClick={() => {
                  setCustom(false);
                  setValue('Budget', 1000);
                }}
                checked={selectedBudget === 1000}
                className="text-center"
              >
                $1000
              </Toggle>
              <Toggle className="text-center" onClick={() => setCustom(true)}>
                Custom
              </Toggle>
            </div>
            {custom && (
              <Input
                placeholder="Enter custom Budget"
                type="number"
                {...register('Budget', {
                  valueAsNumber: true,
                })}
              />
            )}
            {errors?.Budget && (
              <p className="text-red-500">{errors?.Budget?.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col-reverse md:mx-4 md:mt-auto md:ml-auto md:flex-row">
          <Button
            className={
              'text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold px-4 py-3 me-3 justify-center md:justify-end mb-2'
            }
            title="Back"
            onClick={() => setStep(step - 1)}
          />
          <Button
            className="min-w-full mb-2 btn-secondary text-h9 2xl:text-scaled-h9 ms-1 w-full md:min-w-[170px] text-white"
            title="Continue"
            onClick={handleContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default Budget;
