import FormLayout from '@/components/ui/form-layout';
import Dropzone from '@/components/ui/dropzone';
import Input from '@/components/ui/input';
import CustomSelect from '@/components/ui/select';
import { generateUploadFileSasTokenData } from '@/server-actions/verification';
import { ProfileBasicFormData } from '@/utils/schema';
import { apiEndpoint, cn } from '@/utils/utils';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { v4 as uuidv4 } from 'uuid';

interface ICities {
  label: string;
  value: string;
}

interface IProps {
  basicInfoStep: number;
  setBasicInfoStep: Dispatch<SetStateAction<number>>;
  locations: any;
}

const UserDetails: React.FC<IProps> = ({
  basicInfoStep,
  setBasicInfoStep,
  locations,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    control,
    watch,
    getValues,
    clearErrors,
  } = useFormContext<ProfileBasicFormData>();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const [error, setError] = useState('');
  const router = useRouter();
  const [sasToken, setSasToken] = useState('');
  const [cities, setCities] = useState<Array<ICities>>();

  // const handleFileUpload = async (files: File[]) => {
  //   debugger
  //   // const handleFileUpload = async (files, sasToken, userId, userVerificationId, documentType) => {
  //   if (!files[0]) return;

  //   const file = files[files.length - 1];

  //   const fileExtension = file?.name?.split('.')?.pop();
  //   const randomName = `${uuidv4()}.${fileExtension}`;
  //   const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${randomName}?${sasToken}`;

  //   const config = {
  //     headers: {
  //       'x-ms-blob-type': 'BlockBlob',
  //       'Content-Type': file.type,
  //     },
  //   };

  //   try {
  //     // Upload the file to Azure Blob Storage
  //     const res = await axios.put(blobUrl, file, config);

  //     // Prepare the request data to add verification documents
  //     if (res.status === 201) {
  //       const url = res?.config?.url?.split('??')[0];

  //       const currentImages = getValues('profilePic') || [];
  //       setValue('profilePic', url);
  //     }
  //   } catch (error) {
  //     console.error(
  //       'Error uploading file or adding verification document:',
  //       error
  //     );
  //   }
  // };
  const handleFileUpload = async (files: File[]) => {
    // Ensure we don't proceed if there are no files
    if (!files[0]) return;

    const file = files[files.length - 1];

    const fileExtension = file?.name?.split('.')?.pop();
    const randomName = `${uuidv4()}.${fileExtension}`;
    const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${randomName}?${sasToken}`;

    const config = {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
    };

    try {
      // Upload the file to Azure Blob Storage
      const res = await axios.put(blobUrl, file, config);

      // Prepare the request data to add verification documents
      if (res.status === 201) {
        const url = res?.config?.url?.split('??')[0];

        const currentImages = getValues('profilePic') || [];
        setValue('profilePic', url);
      }
    } catch (error) {
      console.error(
        'Error uploading file or adding verification document:',
        error
      );
    }
  };

  const handleGetCitiesOfCountry = async (Country: string) => {
    try {
      if (!Country) return;
      const response = await axios.get(
        `${apiEndpoint}/MyProfile/GetCityList/${Country}`,
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        }
      );
      if (response.status === 200 && response.data.Result) {
        setCities(response.data.Result as ICities[]);
      } else {
        setError('Error fetching cities of country');
      }
    } catch (error) {
      console.error(error);
      setError('Error fetching cities of country');
    }
  };

  const CountryOfOrigin = watch('CountryOfOrigin');

  useEffect(() => {
    handleGetCitiesOfCountry(CountryOfOrigin);
  }, [CountryOfOrigin]);

  const generateUploadFileSasTokenfunc = useCallback(async () => {
    try {
      // setIsLoading(true);
      const tokenResponse = await generateUploadFileSasTokenData();
      setSasToken(tokenResponse.token);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    generateUploadFileSasTokenfunc();
  }, []);
  // const { handleFileUpload, isLoading } = useFileUploadHandler({
  //   onUploadSuccess: (fileName) => {
  //     setValue('profilePic', fileName);
  //   },
  //   onUploadError: (error) => {
  //     console.error('Upload failed:', error);
  //   },
  // });

  const validateCustomProfileUrl = async (url: string) => {
    let value = getValues().CustomProfileUrl;
    value = url.split('orisuun.com/')[1];
    if (value.length === 0) {
      return;
    }
    try {
      const response = await axios.get(
        `${apiEndpoint}/Profile/GetProfileDetailsNameWise?UserName=${value}`,
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        }
      );

      if (response.status === 200 && response.data.Result) {
        setError('Custom URL is not valid or already taken');
      } else {
        setError('');
      }
    } catch (error) {
      console.error('Error validating URL:', error);
      setError('');
      // setError('Error validating URL');
    }
    await trigger('CustomProfileUrl');
  };

  const handleContinue = async () => {
    try {
      const companyNameValid = await trigger('CompanyName');
      const taglineValid = await trigger('Tagline');
      const profilePic = await trigger('profilePic');
      const country = await trigger('CountryOfOrigin');
      const cityValid = await trigger('City');

      if (
        companyNameValid &&
        taglineValid &&
        cityValid &&
        profilePic &&
        country &&
        error?.length == 0 &&
        Object.keys(errors)?.length == 0
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
      handleBack={() => router.back()}
      variant="equal"
    // disableNext={isLoading}
    >
      <div className="flex flex-col w-full mb-10 rounded-lg gap-6 md:py-6 lg:px-6"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}>
        <div className="space-y-3">
          <label
            htmlFor="profile-pic"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Profile Picture <span className="text-danger-500">*</span>
          </label>
          <Dropzone
            id="dropzone"
            acceptedFileTypes="image"
            maxSize={5 * 1024 * 1024}
            layout="circular"
            onFilesUpload={async (files: File[]) =>
              await handleFileUpload(files)
            }
            storedFile={watch('profilePic') ? [watch('profilePic')] : []}
          />
        </div>
        <div className="space-y-3">
          <label
            htmlFor="company_name"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Company Name <span className="text-danger-500">*</span>
          </label>

          <Input
            placeholder="Company Name"
            {...register('CompanyName')}
            error={errors.CompanyName?.message}
          />
        </div>
        <div className="space-y-3">
          <label
            htmlFor="tagline"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Company Tagline <span className="text-danger-500">*</span>
          </label>

          <Input
            placeholder="Company Tagline"
            {...register('Tagline')}
            error={errors.Tagline?.message}
          />
        </div>
        <div className="space-y-3">
          <label
            htmlFor="country_of_origin"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Country <span className="text-danger-500">*</span>
          </label>

          <CustomSelect
            options={locations}
            placeholder="Select Country"
            {...register('CountryOfOrigin')}
            error={errors.CountryOfOrigin?.message}
            onChange={async (val) => {
              setValue('CountryOfOrigin', val.value);
              await trigger('CountryOfOrigin');
            }}
            value={locations?.find(
              (country) =>
                country.value.toString() === getValues('CountryOfOrigin')
            )}
          />
        </div>
        <div className="space-y-3">
          <label
            htmlFor="city"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            City <span className="text-danger-500">*</span>
          </label>

          <CustomSelect
            isDisabled={cities?.length !== 0 ? false : true}
            options={cities}
            placeholder="Select City"
            {...register('City')}
            error={errors.City?.message}
            onChange={async (val) => {
              setValue('City', val.value);
              await trigger('City');
            }}
            value={cities?.find(
              (city) => city.value.toString() === getValues('City')
            )}
          />
        </div>
        <div className="space-y-3">
          <label
            htmlFor="custom_url"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Custom URL <span className="text-danger-500">*</span>
          </label>
          <Controller
            name="CustomProfileUrl"
            control={control}
            defaultValue=""
            render={({ field }) => {
              const prefix = 'orisuun.com/';

              return (
                <>
                  <input
                    {...field}
                    placeholder="enterURL"
                    className={cn(
                      'border bg-white text-h9 2xl:text-scaled-h9 font-medium py-3 px-4 rounded-md w-full',
                      'focus:outline-none focus:bg-[#f3f7f9]',
                      'transition-colors duration-200',
                      !!errors?.CustomProfileUrl?.message || !!error
                        ? 'border-red-500'
                        : 'border-black-200'
                    )}
                    onChange={async (e) => {
                      let value = e.target.value;

                      // Always remove any duplicate occurrences of the prefix if user tries to add or modify it.
                      if (value.includes(prefix)) {
                        value = value.replace(
                          new RegExp(`^${prefix}+`),
                          prefix
                        );
                      }

                      // Make sure the prefix is intact, and handle the rest as user input
                      if (!value.startsWith(prefix)) {
                        value = prefix; // Reset to just the prefix if it's deleted
                      } else {
                        const customValue = value.slice(prefix.length); // Custom part after the prefix
                        field.onChange(customValue); // Only save custom part
                        await validateCustomProfileUrl(value);
                      }

                      // Trigger validation
                      await trigger('CustomProfileUrl');
                    }}
                    value={prefix + (field.value || '')} // Always display the prefix with the custom part
                    onFocus={(e) =>
                      e.target.setSelectionRange(
                        e.target.value.length,
                        e.target.value.length
                      )
                    }
                    readOnly={false}
                  />
                  {!!errors?.CustomProfileUrl ? (
                    <p className="2xl:text-scaled-h9 text-red-400 text-sm">
                      {errors?.CustomProfileUrl?.message}
                    </p>
                  ) : (
                    <p className="2xl:text-scaled-h9 text-red-400 text-sm">
                      {error}
                    </p>
                  )}
                </>
              );
            }}
          />
        </div>
      </div>
    </FormLayout>
  );
};

export default UserDetails;
