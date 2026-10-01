import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import Button from '@/components/ui/button';
import Dropzone from '@/components/ui/dropzone';
import Input from '@/components/ui/input';
import { companyInformationSchema, CreateCompnayInformationData } from '@/utils/schema';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { generateUploadFileSasTokenData } from '@/server-actions/verification';
import { stepSchemas } from '@/utils/discountSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getOriginalPrivateId } from '@/utils/profile.helpers';

interface IProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const CompanyInformation: React.FC<IProps> = ({ step, setStep }) => {
  const { register, formState: { errors }, setValue, trigger, watch } = useFormContext<CreateCompnayInformationData>();
  const [sasToken, setSasToken] = useState('');
  const [industryOptions, setIndustryOptions] = useState<string[]>([]); // optional, if you present suggestions/select
  const router = useRouter()
  // const currentIndustry = watch('CompanyIndustry');

  const currentSchema = stepSchemas[step] || companyInformationSchema;

  const methods = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      CompanyLogo: null,
      CompanyName: "",
      CompanyWebsite: "",
      CompanySlogan: "",
      CompanyIndustry: null,
      CompanyType: null,
      CompanyCategory: "",
      CompanyDescription: "",
      DiscountDescription: "",
      DiscountActivation: "",
      ActiveDiscount: "",
      ProposalDuration: "",
      TermsOfUsing: "",
      NumberOfDiscount: 0,
      DiscountCode: "",
    },
  });

  // set CompanyIndustry from current user profile (localStorage) on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    (async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

        const resp = await axios.post(
          `${apiEndpoint}/Profile/ViewUserProfileV1`,
          {
            UserId: currentUser.Id,
            UserProfileDetailId: currentUser.UserProfileDetailsId,
            UserName: currentUser?.UserName || null,
          },
          {
            headers: {
              XApiKey: process.env.NEXT_PUBLIC_API_KEY || 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              'Content-Type': 'application/json',
            },
          }
        );

        const result = resp?.data?.Result || {};

        const userIndustry =
          (result?.UserProfileIndustrySelectionInformation && result.UserProfileIndustrySelectionInformation[0]?.IndustryName) ||
          '';

        // if (userIndustry) {
        //   // populate the form value directly (no user entry required)
        //   setValue('CompanyIndustry', userIndustry);
        //   setIndustryOptions((prev) => (prev.includes(userIndustry) ? prev : [...prev, userIndustry]));
        // }
      } catch (e) {
        console.error('Failed to fetch user profile for default industry', e);
      }
    })();
  }, [setValue]);

  const handleContinue = async () => {
    const CompanyName = await trigger('CompanyName');
    const CompanyWebsite = await trigger('CompanyWebsite');
    const CompanySlogan = await trigger('CompanySlogan');
    // const CompanyIndustry = await trigger('CompanyIndustry');
    const CompanyCategory = await trigger('CompanyCategory');
    // const CompanyType = await trigger('CompanyType');
    const CompanyDescription = await trigger('CompanyDescription');
    const CompanyLogo = await trigger('CompanyLogo');

    if (CompanyName && CompanyLogo && CompanyWebsite && CompanySlogan  && CompanyCategory && CompanyDescription) {
      setStep(step + 1);
    } else {
      const allData = methods.getValues();
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files[0]) return;
    const file = files[0];
    const fileExtension = file.name.split('.').pop();
    const randomName = `${uuidv4()}.${fileExtension}`;
    const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${randomName}?${sasToken}`;

    const config = {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
    };

    try {
      const res = await axios.put(blobUrl, file, config);
      if (res.status === 201) {
        const url = res?.config?.url;
        const fileName = url.split('/').pop().split('?')[0];
        setValue('logo', file);
        setValue('CompanyLogo', fileName);
        trigger('CompanyLogo');
      }


    } catch (error) {
      console.error(
        'Error uploading file or adding verification document:',
        error
      );
      toast.error('Error uploading file in azure Blob Storage');
    }
  };

  const generateUploadFileSasTokenfunc = useCallback(async () => {
    try {
      const tokenResponse = await generateUploadFileSasTokenData();
      setSasToken(tokenResponse.token);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    generateUploadFileSasTokenfunc();
  }, [generateUploadFileSasTokenfunc]);


  return (
    <div className=" md:gap-5 md:p-6 w-full p-4 lg:min-h-[90vh]">
      <div className="my-4 col-span-8 md:mb-8 lg:col-span-4 md:mx-4 md:my-11">
        <h1 className="mb-4 font-medium text-blue-500 text-h1 md:text-h1 ">
          Company Information
        </h1>
        <p className="text-h7  font-medium text-[#58595A]">
          Please provide your company&apos;s basic details
        </p>
      </div>

      <div className="flex flex-col  w-full my-4 md:my-11">
        <div className="max-w-[920px] mx-auto p-4 w-full border border-gray-200 bg-white rounded-lg"
          style={{
            boxShadow: '0px 2px 10px 0px rgba(3, 11, 27, 0.12)',
          }}>
          <div className="flex flex-col w-full mb-10 rounded-lg gap-6 md:py-6 lg:px-6">
            <div className="space-y-3">
              <label
                htmlFor="profile-pic"
                className="text-sm 2xl:text-scaled-h8 font-semibold text-black-500"
              >
                Company logo
              </label>
              <Dropzone
                acceptedFileTypes="image"
                maxSize={10 * 1024 * 1024}
                layout="normal"
                onFilesUpload={(file) => {
                  handleFileUpload(file)
                }
                }
                onChange={(file) => {
                  trigger('CompanyLogo');
                }}
                storedFile={watch('logo') ? [watch('logo')] : []}
                onFileRemove={() => {
                  setValue('CompanyLogo', "");
                  trigger('CompanyLogo');
                }}
              />
              {errors.CompanyLogo?.message && (
                <p className="text-red-500 text-sm">{errors.CompanyLogo?.message}</p>
              )}
            </div>
            <div className="space-y-4">
              <div className=" flex w-full gap-2">
                <div className='w-full space-y-2'>
                  <label className="text-sm md:text-xl 2xl:text-scaled-h8  font-semibold text-black-500">
                    Company Name
                  </label>
                  <Input
                    placeholder="Enter company name "
                    {...register('CompanyName', { required: 'Company name is required' })}
                    error={errors.CompanyName?.message}
                  />
                </div>
                <div className='w-full'>
                  <div className="space-y-2">
                    <label className="text-sm md:text-xl 2xl:text-scaled-h8  font-semibold text-black-500">
                      Company Website
                    </label>
                    <Input
                      placeholder="Enter company website "
                      {...register('CompanyWebsite', { required: 'Company website is required' })}
                      error={errors.CompanyWebsite?.message}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                
                
                
                <div className="space-y-2">
                  <label className="text-sm md:text-xl 2xl:text-scaled-h8  font-semibold text-black-500">
                    Company Slogen
                  </label>
                  <Input
                    placeholder="Company slogan"
                    {...register('CompanySlogan', { required: 'Company slogan is required' })}
                    error={errors.CompanySlogan?.message}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm md:text-xl 2xl:text-scaled-h8  font-semibold text-black-500">
                    Business Category
                  </label>
                  <Input
                    placeholder="Company Category"
                    {...register('CompanyCategory', { required: 'Company category is required' })}
                    error={errors.CompanyCategory?.message}
                  />
                </div>
                
                {/* <Input
                  placeholder="Company type"
                  {...register('CompanyType')}
                  error={errors.CompanyType?.message}
                /> */}

                <div className="space-y-2">
                  <label className="text-sm md:text-xl 2xl:text-scaled-h8  font-semibold text-black-500">
                    Company Description
                  </label>
                  <textarea
                    id="about_company"
                    rows={3}
                    placeholder="Tell us something about your company"
                    className="w-full resize-none border-[0.8px] border-black-200 rounded-md px-4 py-3 text-h9 2xl:text-scaled-h9 text-black-200 font-medium"
                    {...register('CompanyDescription')}
                  />
                  {errors.CompanyDescription && (
                    <p className="text-red-500 text-sm">{errors.CompanyDescription.message}</p>
                  )}
                </div>
                
                
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center py-8 justify-between ">
          <div className="md:w-80 w-full">
            <p className="text-base text-blue-300 mb-4">
              Step {step + 1} of 4
            </p>
            <div className="w-full bg-[#BBCBED] rounded-full h-3 overflow-hidden">
              <div
                className="bg-omblue-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((step + 1) / 4) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="flex  py-4 md:py-0 md:mt-auto md:ml-auto md:flex-row">
            <Button
              className="px-4 py-3 text-omblue-500  me-4 bg-omblue-50 md:w-[170px] rounded-md"
              title="Back"
              onClick={() => router.back()}
            />
            <Button
              className="px-4 py-3 bg-omblue-500 text-white md:w-[170px] rounded-md"
              title="Continue"
              onClick={handleContinue}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CompanyInformation;
