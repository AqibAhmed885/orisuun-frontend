import Button from '@/components/ui/button';
import Toggle from '@/components/ui/toggle';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ContractCreateData } from '@/utils/schema';
import { useFormContext } from 'react-hook-form';
import DatePicker from '@/components/ui/date-picker';
import { format, addMonths, addYears } from 'date-fns';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const Expiry: React.FC<IProps> = ({ step, setStep }) => {
  const [custom, setCustom] = useState(false);

  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    watch,
    getValues,
  } = useFormContext<ContractCreateData>();

  const selectedExpiryDate = watch('ExpiryDate');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const handleContinue = async () => {
    try {
      const ExpiryDateValid = await trigger('ExpiryDate');

      if (ExpiryDateValid) {
        setStep(step + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDurationClick = (duration: number, unit: 'months' | 'years') => {
    const currentDate = new Date();
    let newExpiryDate: Date;

    if (unit === 'months') {
      newExpiryDate = addMonths(currentDate, duration);
    } else {
      newExpiryDate = addYears(currentDate, duration);
    }

    setValue('ExpiryDate', format(newExpiryDate, 'yyyy-MM-dd'));
    setValue('Deadline', duration + ' ' + unit);
    setExpiryDate(newExpiryDate);
    setCustom(false);
  };

  return (
    <div className="grid grid-cols-8 gap-5 md:p-6 p-4 lg:min-h-[90vh]">
      <div className="my-4 col-span-8 md:mb-8 lg:col-span-4 md:mx-4">
        <h1 className="mb-6 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
          Expiry
        </h1>
        <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A]">
          Please tell us the deadline for this contract
        </p>
      </div>
      <div className="flex flex-col my-4 col-span-8 lg:col-span-4 lg:col-start-5 md:mx-4">
        <div className="flex-grow">
          <div className="flex flex-col w-full mb-10 rounded-lg gap-2 md:py-6 lg:px-6">
            <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-black-500">
              Project duration
            </h5>
            <p className="text-blue-300 text-h7 2xl:text-scaled-h7 font-medium mb-2">
              Choose the duration of the contract
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Toggle
                onClick={() => handleDurationClick(1, 'months')}
                checked={
                  selectedExpiryDate ===
                  format(addMonths(new Date(), 1), 'yyyy-MM-dd')
                }
                className="text-center"
              >
                1 month
              </Toggle>
              <Toggle
                onClick={() => handleDurationClick(3, 'months')}
                checked={
                  selectedExpiryDate ===
                  format(addMonths(new Date(), 3), 'yyyy-MM-dd')
                }
                className="text-center"
              >
                3 months
              </Toggle>
              <Toggle
                onClick={() => handleDurationClick(6, 'months')}
                checked={
                  selectedExpiryDate ===
                  format(addMonths(new Date(), 6), 'yyyy-MM-dd')
                }
                className="text-center"
              >
                6 months
              </Toggle>
              <Toggle
                onClick={() => handleDurationClick(1, 'years')}
                checked={
                  selectedExpiryDate ===
                  format(addYears(new Date(), 1), 'yyyy-MM-dd')
                }
                className="text-center"
              >
                1 year
              </Toggle>
              <Toggle value="custom" onClick={() => setCustom(true)}>
                Custom
              </Toggle>
            </div>
            {custom && (
              <DatePicker
                onChange={(date: any) => {
                  setValue('ExpiryDate', format(date, 'yyyy-MM-dd'));
                  setExpiryDate(date);
                }}
                value={expiryDate}
                format="yyyy-MM-dd"
              />
            )}
            {expiryDate && (
              <span className="text-sm text-gray-500">
                Expiry Date: {format(expiryDate, 'MMM d, yyyy')}
              </span>
            )}
            {errors?.ExpiryDate && (
              <p className="text-red-500">{errors.ExpiryDate.message}</p>
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

export default Expiry;
