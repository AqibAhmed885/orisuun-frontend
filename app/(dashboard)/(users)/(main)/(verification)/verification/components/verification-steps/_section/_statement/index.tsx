import Button from '@/components/ui/button';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { RootState } from '@/data/store';
import { addVerificationDetails } from '@/server-actions/verification';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  VerficationStatementsData,
  verficationStatementsSchema,
} from '@/utils/schema';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const Statement: React.FC<IProps> = ({ step, setStep }) => {
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<VerficationStatementsData>({
    resolver: zodResolver(verficationStatementsSchema),
  });
  const { verificationData } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (verificationData) {
      reset({
        Statements: verificationData.Statements || ''
      })
    }
  }, [step]);

  const onSubmit = async (data: VerficationStatementsData) => {
    try {
      if (currentUser?.Id) {

        const personalIdentificationStatementsData = {
          Id: 1,
          UserId: currentUser?.Id,
          Statements: data.Statements,
        };

        const result: any = await addVerificationDetails(
          personalIdentificationStatementsData
        );

        if (result.success) {
          const responseData = result.data.Result;

          toast.success(result.message);
          setStep(step + 1);
        }
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-8 gap-5 md:px-6 px-4 min-h-[90vh]">
        <div className="col-span-8 my-4 lg:col-span-4 md:mx-4 md:my-11">
          <h1 className="mb-6 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
            Statement
          </h1>
          <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A]">
            Please provide a statement for any issues that require further
            explanation
          </p>
        </div>
        <div className="flex flex-col col-span-8 my-4 lg:col-span-4 lg:col-start-5 md:mx-4 md:my-11">
          <div className="flex">
            <div className="flex flex-col w-full gap-4 rounded-lg md:py-6 lg:px-6">
              <div className="flex flex-col">
                <textarea
                  rows={10}
                  className="resize-none border-[0.8px] border-black-200 rounded-md px-4 py-3 text-h9 2xl:text-scaled-h9 text-black-200 font-medium mb-2"
                  {...register('Statements')}
                />
                {errors && (
                  <span className=" text-red-400 text-xs mt-2 m-1">
                    {errors.Statements?.message}
                  </span>
                )}

                <p className="font-medium text-h9 2xl:text-scaled-h9 text-black-300">
                  Maximum 250 words description
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse mt-auto md:mx-4 md:ml-auto md:flex-row">
            <Button
              className={
                'h9 text-omblue-500 bg-transparent font-semibold px-4 py-3 me-3 justify-end mb-2'
              }
              title="Back"
              onClick={() => setStep(step - 1)}
            />
            <Button type="submit" title="Continue" className="min-w-full mb-2 btn-secondary text-h9 2xl:text-scaled-h9 ms-1 md:min-w-[170px] w-full text-white" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Statement;
