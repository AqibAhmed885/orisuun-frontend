'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Close from '@/icons/close';
import NewProfileSteps from '../../new-profile/_sections/new-profile-steps';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { toast } from 'react-toastify';
import { welcomeMessage } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import BobProfileForm from '../../../edit-profile/BobProfileForm';
import CreateInvestorAccountPage from '../../../edit-profile/components/investor/InvestorTypeForm';
import MentorRegistrationForm from '../../../edit-profile/MentorProfileForm';
import PartnerRegistrationForm from '../../../edit-profile/PartnerProfileForm';
import AdvocateRegistrationForm from '../../../edit-profile/AdvocateProfileForm';
import ConsultantRegistrationForm from '../../../edit-profile/StrategyConsultantForm';
import CreateProfessionalAccountPage from '../../../edit-profile/components/professional/ProfessionalTypeForm';
import ProfessionalRegistrationForm from '../../../edit-profile/ProfessionalProfileForm';
import ExpertRegistrationForm from '../../../edit-profile/ExpertProfileForm';

const businessFormFlowSteps = [
  {
    name: 'Basic Information',
    componentName: 'BasicInformation',
    id: 0,
  },
  {
    name: 'Business Information',
    componentName: 'BusinessInformation',
    id: 1,
  },
  {
    name: 'Qualifications',
    componentName: 'Qualifications',
    id: 2,
  },
  {
    name: 'Charts',
    componentName: 'Charts',
    id: 3,
  },
  {
    name: 'Industry',
    componentName: 'IndustrySelection',
    id: 4,
  },
  {
    name: 'Verify BusinessForm',
    componentName: 'Verification',
    id: 5,
  },
];

const individualFormFlowSteps = [
  {
    name: 'Basic Information',
    componentName: 'UserDetailsExperts',
    id: 0,
  },
  {
    name: 'Skills & Experience',
    componentName: 'SkillsAndExperiences',
    id: 1,
  },
  {
    name: 'Qualifications',
    componentName: 'Qualifications',
    id: 2,
  },
  {
    name: 'Charts',
    componentName: 'Charts',
    id: 3,
  },
  {
    name: 'Industry',
    componentName: 'IndustrySelection',
    id: 4,
  },
  {
    name: 'Verify IndividualForm',
    componentName: 'Verification',
    id: 5,
  }
];

const advocateFormFlowsteps = [
  {
    name: 'Basic Information',
    componentName: 'UserDetailsExperts',
    id: 0,
  },
  {
    name: 'Photos',
    componentName: 'AdvocatePhotos',
    id: 1,
  },
  {
    name: 'Verify Advocate Form',
    componentName: 'Verification',
    id: 2,
  },
];

const EditProfile = () => {
  // const { currentUser } = useSelector((state: RootState) => state.user);
  const { profileData } = useSelector((state: RootState) => state.user);


  const currentUser =
    typeof window !== 'undefined' &&
      JSON.parse(localStorage.getItem('userData'))?.UserProfileTypeId === 10
      ? JSON.parse(localStorage.getItem('editProfile'))
      : JSON.parse(localStorage.getItem('userData'));

  const [step, setStep] = useState(0);
  const [width, setWidth] = useState(0);
  const [steps, setSteps] = useState<any>([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const businessFormFlowProfileTypes = useMemo(
    () => ['Black-owned Business', 'Partner', 'Investor'],
    []
  );
  const individualFormFlowProfileTypes = useMemo(
    () => ['Expert', 'Professional', 'Strategy Consultants', 'Mentor'],
    []
  );

  useEffect(() => {
    setWidth(Math.round(((step / steps.length) * 100 * 100) / 100));
  }, [step, steps.length]);

  useEffect(() => {
    if (!currentUser?.isProfileComplete) toast.success(welcomeMessage);
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Logic to setSteps based on CurrentUSer.UserProfileType
      // Set steps based on UserProfileType
      if (businessFormFlowProfileTypes.includes(currentUser.UserProfileType)) {
        setSteps(businessFormFlowSteps);
      } else if (
        individualFormFlowProfileTypes.includes(currentUser.UserProfileType)
      ) {
        setSteps(individualFormFlowSteps);
      } else if (currentUser.UserProfileType === 'Advocate') {
        setSteps(advocateFormFlowsteps);
      } else {
        setSteps([]);
      }
      setStep(currentUser?.FilledStep || 0);
    }
  }, [businessFormFlowProfileTypes, individualFormFlowProfileTypes]);

  return (
    // loader ? <Loader />:
    <>
      {currentUser?.UserProfileTypeId === 1 ? (
        <BobProfileForm />
      ) : currentUser?.UserProfileTypeId === 7 ? (
        <CreateInvestorAccountPage />
      ) : currentUser?.UserProfileTypeId === 8 ? (
        <MentorRegistrationForm />
      ) : currentUser?.UserProfileTypeId === 5 ? (
        <PartnerRegistrationForm />
      ) : currentUser?.UserProfileTypeId === 4 ? (
        <AdvocateRegistrationForm />
      ) : currentUser?.UserProfileTypeId === 2 ? (
        <ConsultantRegistrationForm />
      ) : currentUser?.UserProfileTypeId === 6 ? (
        <CreateProfessionalAccountPage />
      ) : currentUser?.UserProfileTypeId === 3 ? (
        <ExpertRegistrationForm />
      ) : (
        <>
          <div className="w-full md:hidden">
            <div className="relative flex items-center justify-between px-4 py-6 w-100 md:hidden">
              <p className="mx-auto font-semibold text-blue-600 text-h7 2xl:text-scaled-h7">
                {steps[step]?.name}
              </p>
              <Close
                className="absolute -translate-y-1/2 right-2 top-1/2"
                onClick={() => router.back()}
              />
            </div>
            <div
              className={`relative z-10 h-1 overflow-hidden rounded-md bg-omblue-100 w-full`}
            >
              <div
                className={`absolute inset-0 z-10 h-1 bg-omblue-600 transition-all duration-300 ease-in-out`}
                style={{ width: `${width}%` }}
              ></div>
            </div>
          </div>

          <NewProfileSteps
            steps={steps}
            step={step}
            setStep={setStep}
            currentUser={currentUser}
          />
        </>
      )}
    </>
  );
};

export default EditProfile;
