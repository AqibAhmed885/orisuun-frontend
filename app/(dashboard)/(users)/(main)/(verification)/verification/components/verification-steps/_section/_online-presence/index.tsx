import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { RootState } from '@/data/store';
import { addVerificationDetails } from '@/server-actions/verification';
import {
  VerificationOnlinePresenceData,
  verificationOnlinePresenceSchema,
} from '@/utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const OnlinePresence: React.FC<IProps> = ({ step, setStep }) => {
  const { verificationData } = useSelector(
    (state: RootState) => state.user
  );
  const currentUser= typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData')) 

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm<VerificationOnlinePresenceData>({
    resolver: zodResolver(verificationOnlinePresenceSchema),
  });

  useEffect(() => {
    if (verificationData) {
      reset({
        WebsiteUrl: verificationData.WebsiteUrl,
        FacebookUrl: verificationData.FacebookUrl,
        BlueSkyUrl: verificationData.BlueSkyUrl,
        LinkedinUrl: verificationData.LinkdinUrl,
        InstagramUrl: verificationData.InstagramUrl,
        YoutubeUrl: verificationData.YoutubeUrl,
      });
    }
  },[verificationData])
    
  const onSubmit = async (data: VerificationOnlinePresenceData) => {
    try {
      if (currentUser?.Id) {
        const businessProfileData = {
          UserId: currentUser?.Id,
          WebsiteUrl: data.WebsiteUrl,
          FacebookUrl: data.FacebookUrl,
          BlueSkyUrl: data.BlueSkyUrl,
          LinkedinUrl: data.LinkedinUrl,
          InstagramUrl: data.InstagramUrl,
          YoutubeUrl: data.YoutubeUrl,
        };

        const result: any = await addVerificationDetails(businessProfileData);

        if (result.success) {
          const responseData = result.data.Result;
          toast.success(result.message);
          setStep(step + 1);
        }
        else {
          toast.error(result?.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.Message || 'Something went wrong')
      console.error('An error occurred during signup:', error);
      //   // Handle any unexpected errors
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-8 gap-5 md:p-6 p-4 lg:min-h-[90vh]">
        <div className="my-4 col-span-8 md:mb-8 lg:col-span-4 md:mx-4 md:my-11">
          <h1 className="mb-6 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
            Online Presence
          </h1>
          <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A]">
            Let us know where we can find you on the web
          </p>
        </div>
        <div className="flex flex-col my-4 col-span-8 lg:col-span-4 lg:col-start-5 md:mx-4 md:my-11">
          <div className="flex-grow">
            <div className="flex flex-col w-full mb-10 rounded-lg gap-4 md:py-6 lg:px-6">
              <Input
                placeholder="Enter website url i.e.  https://www.websitename.com"
                {...register('WebsiteUrl')}
                error={errors.WebsiteUrl?.message}
                value={watch('WebsiteUrl')}
              />
              <Input
                placeholder="https://facebook.com/pagename"
                {...register('FacebookUrl')}
                error={errors.FacebookUrl?.message}
              />
              <Input
                placeholder="https://bluesky.com/pagename"
                {...register('BlueSkyUrl')}
                error={errors.BlueSkyUrl?.message}
              />
              <Input
                placeholder="https://linkedin.com/pagename"
                {...register('LinkedinUrl')}
                error={errors.LinkedinUrl?.message}
              />
              <Input
                placeholder="https://instagram.com/pagename"
                {...register('InstagramUrl')}
                error={errors.InstagramUrl?.message}
              />
              <Input
                placeholder="https://youtube.com/pagename"
                {...register('YoutubeUrl')}
                error={errors.YoutubeUrl?.message}
              />
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
              type="submit"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default OnlinePresence;
