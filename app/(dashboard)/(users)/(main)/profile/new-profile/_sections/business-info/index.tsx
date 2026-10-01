import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Location from './location';
import BusinessPics from './business-pics';
import BusinessExtraDetails from './business-extra-details';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import {
  ProfileBusinessFormData,
  profileBusinessInfoSchema,
} from '@/utils/schema';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { addBusinessDetailsAction } from '@/server-actions/createProfile';
import { updateCurrentUser } from '@/data/slices/user-slice';
import { useParams } from 'next/navigation';
import { apiEndpoint } from '@/utils/utils';
import axios from 'axios';
interface location {
  label: string;
  value: string;
}
interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  locations: location;
  currentUser?: any;
}

const BusinessInformation: React.FC<IProps> = ({
  step,
  setStep,
  locations,
  currentUser: user
}) => {
  const { id } = useParams();
  const [businessInfoStep, setBusinessInfoStep] = useState(0);
  const { profileData } = useSelector((state: RootState) => state.user);
  const currentUser =
    user ? user : typeof window !== 'undefined' &&
      JSON.parse(localStorage.getItem('userData'));
  const dispatch = useDispatch();
  const methods = useForm<ProfileBusinessFormData>({
    resolver: zodResolver(profileBusinessInfoSchema),
  });
  const [loader, setLoader] = useState(false);
  const values = methods.getValues();

  useEffect(() => {
    if (id && profileData) {
      const hours = profileData?.Hours?.split(" - ")
      methods.reset({
        AddressLine1: profileData?.AddressLine1,
        AddressLine2: profileData?.AddressLine2,
        Country: profileData?.Country,
        State: profileData?.State,
        City: profileData?.City,
        Code: profileData?.Code,
        Website: profileData?.WebsiteUrl,
        noOfEmployees: profileData?.NumberOfEmployess,
        emailQueries: profileData?.EmailIdForQueries,
        emailBusinessDevelopment: profileData?.EmailIdForBusinessDevelopment,
        blackOwnershipPercentage: profileData?.BlackOwnershipPercentage,
        languages: profileData?.Languages || [],
        phoneNo: profileData?.PhoneNumber,
        hours: profileData?.Hours,
        hoursFrom: hours ? hours[0] : '12:00',
        hoursTo: hours ? hours[1] : '12:00',
        images: profileData?.BusinessPhotos?.map(image => image.ProfilePicture),
        videos: profileData?.BusinessVideos?.map(image => image.ProfileVideo),
        businessType: profileData?.BussinessType,
        inBusinessSince: profileData?.BusinessSince,
        isPrivate: profileData?.PublicCompany === "false" ? false : true,
        ethinicityBlackOwnership: profileData?.EthinicityBlackOwnership
      });
    }
  }, [id, methods, profileData]);

  // const onSubmit = async (data: ProfileBusinessFormData) => {
  //   try {
  //     const businessProfileData = {
  //       UserId: currentUser.Id,
  //       // UserBusinessBasicDetailId: currentUser.BusinessBasicProfileData.Id,
  //       UserProfileTypeId: currentUser.UserProfileTypeId,
  //       AddressLine1: values.AddressLine1,
  //       AddressLine2: values.AddressLine2,
  //       Country: values.Country,
  //       State: values.State || "",
  //       City: values.City || "",
  //       LocationCode: values.Code,
  //       WebsiteURL: values.Website,
  //       NumberOfEmployees: values.noOfEmployees,
  //       EmailForQueries: values.emailQueries,
  //       EmailForBusinessDevelopment: values.emailBusinessDevelopment,
  //       BlackOwnershipPercentage: values.blackOwnershipPercentage,
  //       Language: values.languages,
  //       PhoneNumber: values.phoneNo,
  //       Hours: values.hours,
  //       VideoLink: values.videoLink,
  //       BusinessType: values.businessType,
  //       BusinessSince: values.inBusinessSince,
  //       IsPrivate: values.isPrivate || false,
  //       UserProfileId:currentUser.UserProfileDetailsId,
  //       // BusinessId: 0,
  //     };
  //    

  //     // const result: any = await addBusinessDetailsAction(businessProfileData);
  //     try {
  //       const result = await axios.post(
  //         `${apiEndpoint}/Profile/CreateBusinessInformationProfilev1`,
  //         businessProfileData,
  //         {
  //           headers: {
  //             XApiKey:
  //               'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
  //           },
  //         }
  //       );

  //       // const result: any = await addBasicDetailsAction(basicProfileData);
  //     

  //     if (result.status === 200) {
  //       dispatch(updateCurrentUser(result.data.Result));
  //       toast.success(result.data.Message);
  //       setTimeout(() => {
  //         setStep(step + 1);
  //       }, 200);
  //     }
  //   } catch (error) {
  //       console.error('Axios error:', error);
  //       return {
  //         success: false,
  //         message: 'An Error Occured',
  //       };
  //     }

  //   } catch (error) {
  //     console.error('An error occurred during signup:', error);
  //   }
  // };
  const onSubmit = async (data: ProfileBusinessFormData) => {
    // return
    setLoader(true)
    try {
      const formData = new FormData();

      formData.append('UserId', currentUser.Id.toString());
      formData.append(
        'UserProfileDetailId',
        currentUser.UserProfileDetailsId.toString()
      );
      formData.append('AddressLine1', values.AddressLine1 || '');
      formData.append('AddressLine2', values.AddressLine2 || '');
      formData.append('Country', values.Country || '');
      formData.append('State', values.State || '');
      formData.append('City', values.City || '');
      formData.append('Code', values.Code || '');
      formData.append('CompanyWebsite', values.Website || '');
      formData.append(
        'NumberofEmployees',
        values.noOfEmployees?.toString() || ''
      );
      formData.append('EmailIdForQueries', values.emailQueries || '');
      formData.append(
        'EmailIdForBusinessDevelopment',
        values.emailBusinessDevelopment || ''
      );
      formData.append(
        'BlackOwnershipPercentage',
        values.blackOwnershipPercentage?.toString() || ''
      );
      formData.append(
        'EthinicityBlackOwnership',
        values.ethinicityBlackOwnership?.toString() || ''
      );
      formData.append('Language', values?.languages?.join(",") || '');
      formData.append('PhoneNumber', values.phoneNo || '');
      formData.append('Hours', values.hoursFrom + " - " + values.hoursTo || '');
      // formData.append('VideoList', values.videoLink || '');
      formData.append('BusinessType', values.businessType || '');
      formData.append('BusinessSince', values.inBusinessSince || '');
      formData.append('PublicCompany', (values.isPrivate || false).toString());
      formData.append(
        'UserProfileId',
        currentUser.UserProfileDetailsId?.toString() || ''
      );
      // methods.watch('languages')?.forEach((language: any, index: number) => {
      //   formData.append(
      //     `Language[${index}]`,
      //     language
      //   );
      // });

      // methods.watch('images')?.forEach((image: any, index: number) => {
      //   formData.append(
      //     `ProfilePictureList[${index}][OrigionalName]`,
      //     image
      //   );
      // });

      const images = methods.watch('images');
      if (images && images.length > 0) {
        // Check if the number of images is greater than 12
        if (images.length > 12) {
          setLoader(false)
          return {
            success: false,
            message: 'Please remove some images. The maximum allowed is 12.',
          };
        } else {
          // Loop through the images and append them to formData
          images.forEach((image: any, index: number) => {
            formData.append(
              `ProfilePictureList[${index}][OrigionalName]`,
              image
            );
          });
        }
      } else {

      }
      methods.watch('videos')?.forEach((video: any, index: number) => {
        formData.append(
          `videoList[${index}][OrigionalName]`,
          video
        );
      });

      try {
        const result = await axios.post(
          `${apiEndpoint}/Profile/CreateBusinessInformationProfilev1`,
          formData,
          {
            headers: {
              XApiKey:
                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              'Content-Type': 'multipart/form-data', // Important for FormData
            },
          }
        );

        if (result.status === 200) {
          dispatch(updateCurrentUser(result.data.Result));
          toast.success(result.data.Message);
          setTimeout(() => {
            setStep(step + 1);
          }, 200);
          setTimeout(() => {
            setLoader(false)
          }, 1000)
        }
      } catch (error) {
        console.error('Axios error:', error);
        setLoader(false)
        return {
          success: false,
          message: 'An Error Occurred',
        };
      }
    } catch (error) {
      setLoader(false)
      console.error('An error occurred during signup:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {businessInfoStep === 0 ? (
          <Location
            businessInfoStep={businessInfoStep}
            setBusinessInfoStep={setBusinessInfoStep}
            setStep={setStep}
            step={step}
            locations={locations}
          />
        ) : null}
        {businessInfoStep === 1 ? (
          <BusinessExtraDetails
            businessInfoStep={businessInfoStep}
            setBusinessInfoStep={setBusinessInfoStep}
          />
        ) : null}
        {businessInfoStep === 2 ? (
          <BusinessPics
            businessInfoStep={businessInfoStep}
            setBusinessInfoStep={setBusinessInfoStep}
            onSubmit={onSubmit}
            loader={loader}
          />
        ) : null}
      </form>
    </FormProvider>
  );
};

export default BusinessInformation;
