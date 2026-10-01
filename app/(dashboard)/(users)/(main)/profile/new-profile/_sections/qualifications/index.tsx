import Input from '@/components/ui/input';
import Add from '@/icons/add';
import Bin from '@/icons/upload-icons/bin';
import {
  ProfileQualificationsInfoSchema,
  profileQualificationsInfoSchema,
} from '@/utils/schema';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { addQualificationsDetailsAction } from '@/server-actions/createProfile';
import FormLayout from '@/components/ui/form-layout';
import { updateCurrentUser } from '@/data/slices/user-slice';
import { useParams } from 'next/navigation';
import { apiEndpoint } from '@/utils/utils';
import axios from 'axios';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  currentUser?: any;
}

const Qualifications: React.FC<IProps> = ({ step, setStep, currentUser: user }) => {
  const { id } = useParams();
  const currentUser = user ? user : typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));
  const { profileData } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset, // <-- use reset from the main form instance
    formState: { errors },
  } = useForm<ProfileQualificationsInfoSchema>({
    resolver: zodResolver(profileQualificationsInfoSchema),
    defaultValues: {
      affiliations: [{ name: '' }],
      certifications: [{ name: '', year: '' }],
      recognitions: [{ name: '' }],
    },
  });

  // Field arrays for dynamic input lists
  const {
    fields: affiliationFields,
    append: appendAffiliation,
    remove: removeAffiliation,
  } = useFieldArray({
    control,
    name: 'affiliations',
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: 'certifications',
  });

  const {
    fields: recognitionFields,
    append: appendRecognition,
    remove: removeRecognition,
  } = useFieldArray({
    control,
    name: 'recognitions',
  });

  // UseEffect to populate the form data
  useEffect(() => {
    if (id && profileData) {
      reset({
        affiliations: profileData?.AffliationsInformation?.map((affiliation) => ({
          name: affiliation.AffiliationsName,
        })) || [{ name: '' }],
        certifications: profileData?.Certificates?.map((certification) => ({
          name: certification.Name,
          year: certification.Year,
        })) || [{ name: '', year: '' }],
        recognitions: profileData?.RecognitionInformation?.map((recognition) => ({
          name: recognition.Name,
          year: recognition.Year,
        })) || [{ name: '', year: '' }],
      });
    }
  }, [id, profileData, reset]); // <-- added profileData and reset to the dependency array

  const onSubmit = async (data: ProfileQualificationsInfoSchema) => {
    try {
      setLoader(true);

      if (currentUser) {
        const businessProfileData = {
          UserId: currentUser.Id,
          UserProfileDetailId: currentUser?.UserProfileDetailsId,

          // Filter out affiliations where name is empty
          AffiliationData: data.affiliations?.map(affiliation => affiliation.name).filter(name => name) ?? [],

          // Filter out certifications where both name and year are empty
          certificateModels: data.certifications
            ?.filter(certification => certification.name || certification.year) // Only include if name or year exists
            .map(certification => ({
              CertificateName: certification.name,
              CertificateYear: certification.year,
            })) ?? [],

          // Filter out recognitions where both name and year are empty
          RecognitionData: data.recognitions
            ?.filter(recognition => recognition.name || recognition.year) // Only include if name or year exists
            .map(recognition => ({
              RecognitionName: recognition.name,
              Year: recognition.year,
            })) ?? [],
        };

        try {
          const response = await axios.post(
            `${apiEndpoint}/Profile/CreateQualificationsInformationProfile`,
            businessProfileData,
            {
              headers: {
                XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              },
            }
          );

          if (response.status === 200) {
            dispatch(updateCurrentUser(response.data.Result));
            setTimeout(() => {
              setStep(step + 1);
            }, 200);
            toast.success(response.data.Message);
            setTimeout(() => {
              setLoader(false);
            }, 1000);
          }

          return {
            success: true,
            message: 'Business Details Saved!',
            data: response.data.Result,
          };
        } catch (error) {
          console.error('Axios error:', error);
          setLoader(false);
          return {
            success: false,
            message: 'An Error Occurred',
          };
        }
      }
    } catch (error) {
      setLoader(false);
      console.error('An error occurred during submission:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLayout
        title="Qualifications"
        description="Please provide business qualification details"
        position="start"
        handleBack={() => setStep(step - 1)}
        showBack={true}
        nextButtonType="submit"
        disableNext={loader}
      >
        <div className="flex flex-col w-full mb-10 rounded-lg gap-6 md:py-6 lg:px-6">
          <div className="space-y-3">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Affiliations
            </label>
            {affiliationFields.map((field, index) => (
              <div key={field.id} className="space-y-3">
                <div className="flex items-start gap-2 w-full">
                  <Input
                    placeholder={`Affiliation Name ${index}`}
                    containerClass="flex-1"
                    error={
                      errors.affiliations?.[index]?.name &&
                      errors.affiliations[index]?.name?.message
                    }
                    {...register(`affiliations.${index}.name`)}

                  />
                  <button
                    onClick={() => removeAffiliation(index)}
                    disabled={affiliationFields.length < 2}
                    className="text-danger-500 bg-danger-100 rounded-md p-2 disabled:text-danger-200"
                  >
                    <Bin className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendAffiliation({ name: '' })}
              className="flex gap-2 items-center btn-secondary text-h9 2xl:text-scaled-h9 ms-1 px-4 py-3 rounded-md bg-omblue-500 text-white font-semibold disabled:bg-omblue-50 disabled:text-omblue-200"
            >
              <Add />
              Add Affiliations
            </button>
          </div>
          <div className="space-y-3">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Certification
            </label>

            {certificationFields.map((field, index) => (
              <div key={field.id} className="space-y-3">
                <div className="flex items-start gap-2 w-full">
                  <div className="w-full flex items-start gap-2">
                    <Input
                      placeholder={`Certiifation Name ${index}`}
                      containerClass="flex-1"
                      error={
                        errors.certifications?.[index]?.name &&
                        errors.certifications[index]?.name?.message
                      }
                      {...register(`certifications.${index}.name`)}
                    />
                    <Input
                      placeholder="Year"
                      type='number'
                      containerClass="w-full md:max-w-[100px] 2xl:max-w-24"
                      error={
                        errors.certifications?.[index]?.year &&
                        errors.certifications[index]?.year?.message
                      }
                      {...register(`certifications.${index}.year`)}
                    />
                  </div>

                  <button
                    onClick={() => removeCertification(index)}
                    disabled={certificationFields.length < 2}
                    className="text-danger-500 bg-danger-100 rounded-md p-2 disabled:text-danger-200"
                  >
                    <Bin className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendCertification({ name: '', year: '' })}
              className="flex gap-2 items-center btn-secondary text-h9 2xl:text-scaled-h9 ms-1 px-4 py-3 rounded-md bg-omblue-500 text-white font-semibold disabled:bg-omblue-50 disabled:text-omblue-200"
            >
              <Add />
              Add Certification
            </button>
          </div>
          <div className="space-y-3">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Recognition
              {/* <span className="text-danger-500">*</span> */}
            </label>

            {recognitionFields.map((field, index) => (
              <div key={field.id} className="space-y-3">
                <div className="flex items-start gap-2 w-full">
                  <Input
                    containerClass="flex-1"
                    placeholder={`Recognition Name ${index}`}
                    error={
                      errors.recognitions?.[index]?.name &&
                      errors.recognitions[index]?.name?.message
                    }
                    {...register(`recognitions.${index}.name`)}
                  />
                  <Input
                    placeholder="Year"
                    containerClass="w-full md:max-w-[100px] 2xl:max-w-24"
                    error={
                      errors.recognitions?.[index]?.year &&
                      errors.recognitions[index]?.year?.message
                    }
                    {...register(`recognitions.${index}.year`)}
                  />
                  <button
                    onClick={() => removeRecognition(index)}
                    disabled={recognitionFields.length < 2}
                    className="text-danger-500 bg-danger-100 rounded-md p-2 disabled:text-danger-200"
                  >
                    <Bin className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => appendRecognition({ name: '' })}
              className="flex gap-2 items-center btn-secondary text-h9 2xl:text-scaled-h9 ms-1 px-4 py-3 rounded-md bg-omblue-500 text-white font-semibold disabled:bg-omblue-50 disabled:text-omblue-200"
            >
              <Add />
              Add Recognition
            </button>
          </div>
        </div>
      </FormLayout>
    </form>
  );
};

export default Qualifications;
