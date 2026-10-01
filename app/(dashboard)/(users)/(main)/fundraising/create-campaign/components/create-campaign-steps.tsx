import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Campaign } from '@/app/(dashboard)/(users)/(main)/fundraising/create-campaign/components/basic-information/campaign';
import SocialLinks from '@/app/(dashboard)/(users)/(main)/fundraising/create-campaign/components/basic-information/social-links';
import MediaDropzone from '@/app/(dashboard)/(users)/(main)/fundraising/create-campaign/components/basic-information/media-dropzone';
import RichTextEditor from '@/components/ui/rich-text-editor';
import RewardForm from '@/app/(dashboard)/(users)/(main)/fundraising/create-campaign/components/rewards/reward-form';
import { useFormContext } from 'react-hook-form';
import { CampaignSchema } from '@/utils/schema';
import { useRouter } from 'next/navigation';
import { tabs } from '../../../../../../../data/dashboard/fundraising';

interface ICreateCampaignStepsProps {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

const CreateCampaignSteps: React.FC<ICreateCampaignStepsProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [activeTab, setActiveTab] = useState(1);
  const [activeStep, setActiveStep] = useState(1);
  const router = useRouter();
  const renderBasicInformationStep = (step: number) => {
    switch (step) {
      case 1:
        return <Campaign />;
      case 2:
        return <SocialLinks />;
      case 3:
        return <MediaDropzone />;
      default:
        return null;
    }
  };
  const {
    formState: { errors },
    trigger,
  } = useFormContext<CampaignSchema>();

  const validateFirstStepOfBasicInfo = async () => {
    try {
      const TitleValid = await trigger('Title');
      const SummaryValid = await trigger('Summary');
      const PurposeValid = await trigger('Purpose');
      const GoalValid = await trigger('Goal');
      const DurationValid = await trigger('Duration');
      const BackgroundImageValid = await trigger('BackgroundImage');
      if (
        TitleValid &&
        SummaryValid &&
        PurposeValid &&
        GoalValid &&
        DurationValid &&
        BackgroundImageValid
      ) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }
  };

  const validateThirdStepfOfBasicInfo = async () => {
    try {
      const picturesValid = await trigger('Pictures');
      const videoValid = await trigger('Video');

      if (picturesValid && videoValid) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleValidations = async (): Promise<boolean> => {
    if (activeTab === 1) {
      if (activeStep === 1) {
        return await validateFirstStepOfBasicInfo();
      } else if (activeStep === 2) {
        return true;
      } else if (activeStep === 3) {
        return await validateThirdStepfOfBasicInfo();
      }
    } else if (activeTab === 2) {
      return await trigger('CampaignDetails');
    } else if (activeTab === 3) {
      return await trigger('Rewards');
    }
  };

  const handleCancle = () => {
    router.push('/fundraising/view-all-campaigns');
  };

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      activeStep={activeStep}
      onTabChange={setActiveTab}
      onStepChange={setActiveStep}
      contentClass="h-full lg:overflow-auto"
      onSubmit={onSubmit}
      OnNextValidation={handleValidations}
      handleCancle={handleCancle}
      isSubmitting={isSubmitting}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mobile:min-h-screen lg:!h-full">
        {activeTab === 1 && (
          <>
            <div className="col-span-1 lg:justify-self-center">
              <h1 className="text-h2 lg:!text-5xl lg:w-[387px] max-w-[387px] 4xl:w-full 4xl:max-w-max leading-[120%] text-blue-500 mb-4 lg:mb-6">
                {activeTab === 1 && activeStep === 3 ? (
                  <>
                    Profile photos
                    <br />
                    and videos
                  </>
                ) : (
                  'Basic Information'
                )}
              </h1>
              <p className="text-[#58595A] lg:w-[387px] max-w-[387px]">
                {activeTab === 1 && activeStep === 1 ? (
                  'Please provide your basic Campaign information'
                ) : activeStep === 2 ? (
                  'Please provide the social media accounts you would like featured on your profile page'
                ) : (
                  <>
                    Please upload any relevant photos <br />
                    (maximum of 12 photos)
                  </>
                )}
              </p>
            </div>
            <div className="col-span-1 xs:min-h-full mt-6 lg:!mt-0 lg:!max-h-[calc(100vh-210px)] 4xl:!max-h-[calc(100vh-290px)] lg:overflow-auto">
              <div className="max-w-[465px] 4xl:!max-w-screen-sm mx-auto w-full">
                {renderBasicInformationStep(activeStep)}
              </div>
            </div>
          </>
        )}
        {activeTab === 2 && (
          <>
            <div className="col-span-1 justify-self-center">
              <h1 className="text-5xl lg:w-[387px] max-w-[387px] leading-[120%] flex items-start gap-4 text-blue-500 mb-6">
                Campaign Details{' '}
                <span className="text-red-500 text-base">*</span>
              </h1>
              <p className="text-[#58595A] lg:w-[387px] max-w-[387px]">
                Please provide the full story of your campaign
              </p>
            </div>
            <div className="col-span-1 xs:min-h-full mt-6 lg:!mt-0 lg:!max-h-[calc(100vh-210px)] 4xl:!max-h-[calc(100vh-290px)] lg:overflow-auto">
              <RichTextEditor
                className={
                  ' h-[450px] mb-10 lg:!mb-0 lg:!h-[676px] 3xl:!h-[768px] 2k:!h-[1268px] tiptapWrapper'
                }
              />
            </div>
          </>
        )}
        {activeTab === 3 && (
          <>
            <div className="col-span-1 justify-self-center">
              <h1 className="text-5xl lg:w-[387px] max-w-[387px] leading-[120%] text-blue-500 mb-6">
                Add your incentives
              </h1>
              <p className="text-[#58595A] lg:w-[387px] max-w-[387px]">
                Please provide the details of your campaign incentives
              </p>
            </div>
            <div className="col-span-1 xs:min-h-full mt-6 lg:!mt-0 lg:!max-h-[calc(100vh-210px)] 4xl:!max-h-[calc(100vh-290px)] lg:overflow-auto">
              <RewardForm />
            </div>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default CreateCampaignSteps;
