'use client';

import { updateCurrentUser } from '@/data/slices/user-slice';
import { RootState } from '@/data/store';
import { addIndividualBasicDetailsAction } from '@/server-actions/createProfile';
import {
  ProfileExpertBasicFormData,
  profileExpertBasicInfoSchema,
} from '@/utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import BasicDetailsExperts from './user-details-expert';
import UserDetailsExpertsAdditional from './user-details-expert-additional';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import Cookies from 'js-cookie';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  currentUser?: any;
}

const UserDetailsExperts: React.FC<IProps> = ({
  step,
  setStep,
  currentUser: user,
}) => {
  const currentUser = user
    ? user
    : typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const { profileData } = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [basicExpertStep, setBasicExpertStep] = useState(0);

  const methods = useForm<ProfileExpertBasicFormData>({
    resolver: zodResolver(profileExpertBasicInfoSchema),
    defaultValues: {
      AdditionalAboutYouDetails: [''],
      Tags: [],
    },
  });

  useEffect(() => {
    if (id && profileData) {
      methods.reset({
        Name: profileData?.CompanyName || '',
        WorkTitle: profileData?.WorkTitle || '',
        Race: profileData?.Race || '',
        Nationality: profileData?.Nationality || '',
        Ethinicity: profileData?.Ethnicity || '',
        profilePic: profileData?.ProfilePicture || '',
        VideoLink: profileData?.VideoLink || '',
        AboutYou: profileData?.AboutYou || '',
        CustomProfileUrl: profileData?.ProfileUrl || '',
        AdditionalAboutYouDetails:
          profileData?.UserAdditionalAboutYouDetails?.map(
            (detail) => detail.AboutYouDetail
          ) || [],
        Tags: profileData?.Tags || [],
      });
    }
  }, [id, methods, profileData]);
  const onSubmit = async (data: ProfileExpertBasicFormData) => {
    setLoader(true);

    try {
      if (currentUser) {
        const requestData = {
          UserId: currentUser.Id,
          // UserProfileTypeId: currentUser.UserProfileTypeId,
          // UserProfileId: currentUser.UserProfileDetailsId,
          Name: data.Name,
          WorkTitle: data.WorkTitle,
          Race: data.Race,
          Nationality: data.Nationality,
          Ethnicity: data.Ethinicity,
          ProfilePicture: data.profilePic || '',
          VideoLink: data.VideoLink,
          AboutYou: data.AboutYou,
          AdditionalAboutYouDetails: data.AdditionalAboutYouDetails,
          Tags: data.Tags,
          ProfileUrl: data.CustomProfileUrl,
        };
        try {
          const result = await axios.post(
            `${apiEndpoint}/MyProfile/CreateIndividualProfileDetails`,
            requestData,
            {
              headers: {
                XApiKey:
                  'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              },
            }
          );

          if (result.status === 201) {
            dispatch(updateCurrentUser(result.data.Result));
            setTimeout(() => {
              setStep(step + 1);
            }, 200);
            let item = localStorage.getItem('userData');

            if (item) {
              // Parse the item to modify its properties
              let parsedItem = JSON.parse(item);

              // Modify the desired properties
              parsedItem.UserProfileDetailsId = result.data.Result.ProfileId;
              parsedItem.isBasicProfileDetailExist = true;

              // Save the updated object back to localStorage
              localStorage.setItem('userData', JSON.stringify(parsedItem));
              Cookies.set('userData', JSON.stringify(parsedItem), {
                path: '/',
              });
            }
            toast.success(result.data.Message);
            setTimeout(() => {
              setLoader(false);
            }, 1000);
          }
        } catch (error) {
          setLoader(false);
          console.error('Axios error:', error);
          return {
            success: false,
            message: 'An Error Occured',
          };
        }
        // const result: any = await addIndividualBasicDetailsAction(requestData);

        // if (result.success) {
        //   dispatch(updateCurrentUser(result.data));
        //   toast.success(result.message);

        // }
      }
    } catch (error) {
      setLoader(false);
      console.error('An error occurred during signup:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        {basicExpertStep === 0 && (
          <BasicDetailsExperts
            basicExpertStep={basicExpertStep}
            setBasicExpertStep={setBasicExpertStep}
          />
        )}
        {basicExpertStep === 1 && (
          <UserDetailsExpertsAdditional
            basicExpertStep={basicExpertStep}
            setBasicExpertStep={setBasicExpertStep}
            onSubmit={() => methods.handleSubmit(onSubmit)()}
            loader={loader}
          />
        )}
      </form>
    </FormProvider>
  );
};

export default UserDetailsExperts;
