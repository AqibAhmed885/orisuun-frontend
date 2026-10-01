import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import UserDetails from './user-details';
import SocialLinks from './social-links';
import AboutCompany from './about-company';
import { FormProvider, useForm } from 'react-hook-form';
import { ProfileBasicFormData, profileBasicInfoSchema } from '@/utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { addBasicDetailsAction } from '@/server-actions/createProfile';
import { toast } from 'react-toastify';
import { addProfileData, updateCurrentUser } from '@/data/slices/user-slice';
import { apiEndpoint } from '@/utils/utils';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  locations: any;
  currentUser?: any;
}

const BasicInformation: React.FC<IProps> = ({
  step,
  setStep,
  locations,
  currentUser: user,
}) => {
  const { id } = useParams();
  const [basicInfoStep, setBasicInfoStep] = useState(0);
  const [loader, setLoader] = useState(false);
  const { profileData } = useSelector((state: RootState) => state.user);
  // const { currentUser } = useSelector((state: RootState) => state.user);
  const currentUser = user
    ? user
    : typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const dispatch = useDispatch();

  const methods = useForm<ProfileBasicFormData>({
    resolver: zodResolver(profileBasicInfoSchema),
    mode: 'onSubmit',
  });
  const values = methods.getValues();

  const onSubmit = async (e) => {
    // e.preventDefault();
    setLoader(true);
    try {
      if (currentUser) {
        const socialMediaLinks = {
          YoutubeUrl: values.Youtubeurl,
          FacebookUrl: values.Facebookurl,
          LinkedinUrl: values.Linkedinurl,
          TwitterUrl: values.BlueSkyurl,
          InstagramUrl: values.Instagramurl,
        };

        const basicProfileData = {
          UserId: currentUser.Id,
          UserProfileTypeId: currentUser.UserProfileTypeId,
          UserProfileId: currentUser.UserProfileDetailsId,
          CompanyName: values.CompanyName,
          ProfilePicture: methods.watch('profilePic'),
          Tagline: values.Tagline,
          CountryOfOrigin: values.CountryOfOrigin,
          City: values.City,
          ProfileUrl: values.CustomProfileUrl,
          AboutCompany: methods.watch('AboutCompany'),
          SocialMedias: socialMediaLinks,
          Tags: methods.watch('Tags'),
          CompanyDetails: values?.CompanyDetails?.map((detail) => ({
            CompanyDetail: detail,
          })).filter((item) => item.CompanyDetail !== ''),
        };

        if (basicProfileData.AboutCompany === '') {
          setLoader(false);
          return {
            success: false,
            message: 'About Company is required',
          };
        }

        try {
          const result = await axios.post(
            `${apiEndpoint}/Profile/CreateBasicInformationProfile`,
            basicProfileData,
            {
              headers: {
                XApiKey:
                  'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              },
            }
          );

          if (result.status === 200) {
            dispatch(updateCurrentUser(result.data.Result));
            toast.success(result.data.Message);
            setTimeout(() => {
              setStep(step + 1);
            }, 200);
            let item = localStorage.getItem('userData');

            if (item) {
              // Parse the item to modify its properties
              let parsedItem = JSON.parse(item);

              // Modify the desired properties
              parsedItem.UserProfileDetailsId = result?.data?.Result?.ProfileId;
              if (parsedItem?.UserProfileTypeId === 4) {
                parsedItem.isBasicProfileDetailExist = true;
                parsedItem.isProfileComplete = true;
              }
              // Save the updated object back to localStorage
              localStorage.setItem('userData', JSON.stringify(parsedItem));
              Cookies.set('userData', JSON.stringify(parsedItem), {
                path: '/',
              });
            }
            setTimeout(() => {
              setLoader(false);
            }, 1000);
          }
        } catch (error) {
          console.error('Axios error:', error);
          setLoader(false);
          return {
            success: false,
            message: 'An Error Occured',
          };
        }
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (id && profileData) {
      const socialMediaUrls = {
        YouTube: '',
        BlueSky: '',
        Instagram: '',
        LinkedIn: '',
        FaceBook: '',
      };

      profileData?.SocialMediaUrls?.forEach((link) => {
        if (socialMediaUrls?.hasOwnProperty(link?.LinkType)) {
          socialMediaUrls[link?.LinkType] = link?.SocialMediaUrl;
        }
      });

      // Log the values you're going to reset the form with
      const resetValues = {
        CompanyName: profileData?.CompanyName || '',
        profilePic: profileData?.ProfilePicture || '',
        Tagline: profileData?.Tagline || '',
        CountryOfOrigin: profileData?.CountryOfOrigin || '',
        CustomProfileUrl: profileData?.ProfileUrl || '',
        Youtubeurl: socialMediaUrls?.YouTube || '',
        BlueSkyurl: socialMediaUrls?.BlueSky || '',
        Instagramurl: socialMediaUrls?.Instagram || '',
        Linkedinurl: socialMediaUrls?.LinkedIn || '',
        Facebookurl: socialMediaUrls?.FaceBook || '',
        AboutCompany: profileData?.AboutCompany || '',
        Tags: profileData?.Tags || [],
        CompanyDetails:
          profileData?.CompanyDetails?.map((detail) => detail.CompanyDetails) ||
          [],
        City: profileData?.UserCity || '',
      };
      methods.reset(resetValues);
    }
  }, [id, methods, profileData]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {basicInfoStep === 0 ? (
          <UserDetails
            basicInfoStep={basicInfoStep}
            setBasicInfoStep={setBasicInfoStep}
            locations={locations}
          />
        ) : null}
        {basicInfoStep === 1 ? (
          <SocialLinks
            basicInfoStep={basicInfoStep}
            setBasicInfoStep={setBasicInfoStep}
          />
        ) : null}
        {basicInfoStep === 2 ? (
          <AboutCompany
            basicInfoStep={basicInfoStep}
            setBasicInfoStep={setBasicInfoStep}
            onSubmit={onSubmit}
            loader={loader}
          />
        ) : null}
      </form>
    </FormProvider>
  );
};

export default BasicInformation;
