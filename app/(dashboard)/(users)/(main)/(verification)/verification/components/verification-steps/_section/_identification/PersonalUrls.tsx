import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { addVerificationDetails } from '@/server-actions/verification';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  PersonalIdentificationData,
  personalIdentificationPresenceSchema,
} from '@/utils/schema';
interface IProps {
  identificationStep: number;
  setIdentificationStep: Dispatch<SetStateAction<number>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  setProfileUrls: Dispatch<SetStateAction<string>>;
  profileUrls: string
}

const PersonalURLs: React.FC<IProps> = ({
  identificationStep,
  setIdentificationStep,
  step,
  setStep,
  setProfileUrls,
  profileUrls
}) => {
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
  const [loader, setLoader] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<PersonalIdentificationData>({
    resolver: zodResolver(personalIdentificationPresenceSchema),
  });
  useEffect(() => {
    setValue('PersionalIdentificationURL', profileUrls)
  }, [])

  const onSubmit = async (data: PersonalIdentificationData) => {
    setLoader(true)
    try {
      if (currentUser?.Id) {

        const personalIdentificationData = {
          Id: 1,
          UserId: currentUser?.Id,
          PersionalIdentificationURL: data.PersionalIdentificationURL,
        };

        const result: any = await addVerificationDetails(
          personalIdentificationData
        );

        if (result.success) {
          const responseData = result.data.Result;
          setLoader(false)
          toast.success(result.message);
          setStep(step + 1);
        }
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
      setLoader(false)
      //   // Handle any unexpected errors
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-8 gap-5 p-4 md:p-6 lg:min-h-[90vh]">
        <div className="my-4 col-span-8 lg:col-span-4 md:mx-4 md:my-11">
          <h1 className="mb-6 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
            Personal Identification
          </h1>
          <p className="mb-6 font-medium text-blue-400 text-h7 2xl:text-scaled-h7">
            (for each owner, if verification is for a business)
          </p>
          <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A]">
            Please share your personal LinkedIn address
          </p>
        </div>
        <div className="flex flex-col my-4 col-span-8 lg:col-span-4 lg:col-start-5 md:mx-4 md:my-11">
          <div className="flex-grow">
            <div className="flex flex-col w-full py-6 rounded-lg gap-4 lg:px-6">
              <div className="flex flex-col">
                <h5 className="mb-4 font-semibold text-blue-500 text-h5 2xl:text-scaled-h5">
                  LinkedIn
                </h5>
                <Input
                  {...register('PersionalIdentificationURL')}
                  error={errors.PersionalIdentificationURL?.message}
                  placeholder="https://linkedin.com/pagename"
                  onChange={(e) => setProfileUrls(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse mt-auto md:mx-4 md:ml-auto md:flex-row">
            <Button
              className={
                'text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold px-4 py-3 me-3 justify-center md:justify-end mb-2'
              }
              title="Back"
              onClick={() => setIdentificationStep(identificationStep - 1)}
            />
            <Button
              className="min-w-full mb-2 btn-secondary text-h9 2xl:text-scaled-h9 ms-1 md:min-w-[170px] w-full text-white"
              type="submit"
              title="Continue"
              disabled={loader}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PersonalURLs;
