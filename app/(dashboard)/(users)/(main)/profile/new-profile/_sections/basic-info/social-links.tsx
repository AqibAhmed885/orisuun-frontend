import FormLayout from '@/components/ui/form-layout';
import Input from '@/components/ui/input';
import { ProfileBasicFormData } from '@/utils/schema';
import React, { Dispatch, SetStateAction } from 'react';
import { useFormContext } from 'react-hook-form';

interface IProps {
  basicInfoStep: number;
  setBasicInfoStep: Dispatch<SetStateAction<number>>;
}

const SocialLinks: React.FC<IProps> = ({ basicInfoStep, setBasicInfoStep }) => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext<ProfileBasicFormData>();
  const handleContinue = async () => {
    try {
      const youtubeValid = await trigger('Youtubeurl');
      const fbValid = await trigger('Facebookurl');
      const instagramValid = await trigger('Instagramurl');
      const linkedInValid = await trigger('Linkedinurl');
      const twitterValid = await trigger('BlueSkyurl');

      if (
        youtubeValid &&
        fbValid &&
        instagramValid &&
        linkedInValid &&
        twitterValid
      ) {
        setBasicInfoStep(basicInfoStep + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormLayout
      title="Basic Information"
      description="Please provide your company’s information"
      position="start"
      showBack={true}
      handleNext={handleContinue}
      handleBack={() => setBasicInfoStep(basicInfoStep - 1)}
      variant="equal"
    >
      <div className="flex flex-col w-full mb-10 rounded-lg gap-6 md:py-6 lg:px-6">
        <div className="space-y-3">
          <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
            Social Media Links
          </label>
          <Input
            placeholder="Youtube url  e.g. https://youtube.com/companypagename"
            {...register('Youtubeurl')}
            error={errors.Youtubeurl?.message}
            containerClass="md:w-full"
          />
          <Input
            placeholder="Facebook url  e.g. https://facebook.com/companypagename"
            {...register('Facebookurl')}
            error={errors.Facebookurl?.message}
            containerClass="md:w-full"
          />
          <Input
            placeholder="Linkedinurl  e.g. https://linkedin.com/companypagename"
            {...register('Linkedinurl')}
            error={errors.Linkedinurl?.message}
            containerClass="md:w-full"
          />

          <Input
            placeholder="BlueSky url  e.g. https://bsky.app/companypagename"
            {...register('BlueSkyurl')}
            error={errors.BlueSkyurl?.message}
            containerClass="md:w-full"
          />

          <Input
            placeholder="Instagram url  e.g. https://instagram.com/companypagename"
            {...register('Instagramurl')}
            error={errors.Instagramurl?.message}
            containerClass="md:w-full"
          />
        </div>
      </div>
      {/* </div>
        <div className="flex flex-col-reverse md:mx-4 md:mt-auto md:ml-auto md:flex-row">
          <Button
            className={
              'text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold px-4 py-3 me-2 mb-2'
            }
            title="Back"
            onClick={() => setBasicInfoStep(basicInfoStep - 1)}
          />
          <Button
            className="min-w-full mb-2 btn-secondary text-h9 2xl:text-scaled-h9 ms-1 w-full md:min-w-[170px]"
            title="Continue"
            onClick={handleContinue}
          />
        </div>
      </div>
    </div> */}
    </FormLayout>
  );
};

export default SocialLinks;
