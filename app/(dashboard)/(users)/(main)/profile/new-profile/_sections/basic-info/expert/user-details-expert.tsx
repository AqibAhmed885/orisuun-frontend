import FormLayout from '@/components/ui/form-layout';
import Dropzone from '@/components/ui/dropzone';
import Input from '@/components/ui/input';
import Note from '@/components/ui/note';
import CustomSelect from '@/components/ui/select';
import { generateUploadFileSasTokenData } from '@/server-actions/verification';
import {
  ethnicityOptions,
  nationalityOptions,
  raceOptions,
} from '@/utils/constants';
import { ProfileExpertBasicFormData } from '@/utils/schema';
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
import { toast } from 'react-toastify';

import { v4 as uuidv4 } from 'uuid';
interface IProps {
  basicExpertStep: number;
  setBasicExpertStep: Dispatch<SetStateAction<number>>;
}

const BasicDetailsExperts: React.FC<IProps> = ({
  basicExpertStep,
  setBasicExpertStep,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
    control,
    getValues,
    clearErrors,
  } = useFormContext<ProfileExpertBasicFormData>();

  const [sasToken, setSasToken] = useState('');
  const [locations, setLocations] = useState([]);
  const router = useRouter();
  const [error, setError] = useState('');
  const [cityList, setCityList] = useState<
    { id: number; value: string; label: string }[]
  >([]);
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${apiEndpoint}/MyProfile/GetCountryList`, {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        });
        if (res.status === 200) {
          const locations = res.data.Result;
          setLocations(
            locations.map((location) => ({
              label: location?.CountryName,
              value: (location?.Id).toString(),
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching country list:', error);
      }
    })();
  }, []);
  const validateCustomProfileUrl = async (url: string) => {
    let value = getValues().CustomProfileUrl;
    value = url.split('orisuun.com/')[1];
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
      setError('Error validating URL');
    }
    await trigger('CustomProfileUrl');
  };
  useEffect(() => {
    (async () => {
      if (getValues().Nationality) {
        try {
          const res = await axios.post(
            `${apiEndpoint}/Profile/GetCityByRegion`,
            {
              CountryId: Number(getValues().Nationality),
            },
            {
              headers: {
                XApiKey:
                  'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              },
            }
          );
          if (res.status === 200) {
            const statesList = res.data.Result;
            const formattedStateList = statesList.map((item) => ({
              id: item.Id,
              value: item.Id.toString(),
              label: item.CityName,
            }));
            setCityList(formattedStateList);
          }
        } catch (error) {
          console.error('Error fetching country list:', error);
        }
      }
    })();
  }, [getValues().Nationality]);
  const handleFileUpload = async (files: File[]) => {
    // const handleFileUpload = async (files, sasToken, userId, userVerificationId, documentType) => {
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

  const handleContinue = async () => {
    try {
      const profilePic = await trigger('profilePic');
      const Name = await trigger('Name');
      const Nationality = await trigger('Nationality');
      const Ethinicity = await trigger('Ethinicity');
      const Race = await trigger('Race');
      const WorkTitle = await trigger('WorkTitle');
      const CustomProfileUrl = await trigger('CustomProfileUrl');
      // if (!profilePic) {
      //   toast.error('Profile Picture is required');
      //   return;
      // }
      if (
        Name &&
        Nationality &&
        // profilePic &&
        // Ethinicity &&
        Race &&
        WorkTitle &&
        error?.length == 0 &&
        Object.keys(errors)?.length == 0
      ) {
        setBasicExpertStep(basicExpertStep + 1);
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
      handleNext={handleContinue}
      handleBack={() => router.back()}
      variant="equal"
    >
      <div className="flex flex-col w-full mb-10 rounded-lg gap-6 md:py-6 lg:px-6">
        <div className="space-y-3">
          <label
            htmlFor="profile-pic"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Profile Picture
          </label>
          <Dropzone
            acceptedFileTypes="image"
            maxSize={5 * 1024 * 1024}
            layout="circular"
            onFilesUpload={handleFileUpload}
            storedFile={watch('profilePic') ? [watch('profilePic')] : []}
          />
        </div>
        <div className="space-y-3">
          <label
            htmlFor="name"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Name <span className="text-danger-500">*</span>
          </label>
          <Input
            id="name"
            placeholder="Name"
            error={errors.Name?.message}
            {...register('Name')}
          />
        </div>
        <div className="space-y-3">
          <label
            htmlFor="work_title"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Work Title <span className="text-danger-500">*</span>
          </label>
          <Input
            id="work_title"
            placeholder="Work Title"
            error={errors.WorkTitle?.message}
            {...register('WorkTitle')}
          />
        </div>
        <div className="space-y-3">
          <label
            htmlFor="race"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Race <span className="text-danger-500">*</span>
          </label>
          <CustomSelect
            placeholder={'Race'}
            options={raceOptions}
            onChange={async (val) => {
              setValue('Race', val.value);
              await trigger('Race');
            }}
            error={errors.Race?.message}
            value={raceOptions.find((option) => option.value === watch('Race'))}
          />
        </div>
        <div className="space-y-3">
          <label
            htmlFor="nationality"
            className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
          >
            Nationality <span className="text-danger-500">*</span>
          </label>
          <CustomSelect
            placeholder={'Nationality'}
            options={locations}
            onChange={async (val) => {
              setValue('Nationality', val.value);
              setValue('Ethinicity', '');
              await trigger('Nationality');
            }}
            error={errors.Nationality?.message}
            value={locations.find(
              (option) => option.value === watch('Nationality')
            )}
          />
        </div>
        {watch('Race') === 'Black' && (
          <div className="space-y-3 mb-2">
            <label
              htmlFor="ethnicity"
              className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
            >
              Ethnicity <span className="text-danger-500">*</span>
            </label>
            <CustomSelect
              placeholder={'Ethnicity'}
              options={cityList}
              onChange={async (val) => {
                setValue('Ethinicity', val.value);
                await trigger('Ethinicity');
              }}
              error={errors.Ethinicity?.message}
              value={
                cityList.find(
                  (option) => option.value === watch('Ethinicity')
                ) || ''
              }
            />
          </div>
        )}
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
                  <div className="flex w-full">
                    <span className="bg-gray-100 text-gray-500 px-3 py-3 rounded-l-md border border-r-0 border-black-200 text-h9 2xl:text-scaled-h9 font-medium">
                      {prefix}
                    </span>
                    <input
                      {...field}
                      placeholder="enterURL"
                      className={cn(
                        'border bg-white text-h9 2xl:text-scaled-h9 font-medium py-3 px-4 rounded-r-md w-full min-w-0',
                        'focus:outline-none focus:bg-[#f3f7f9]',
                        'transition-colors duration-200',
                        !!errors?.CustomProfileUrl?.message || !!error
                          ? 'border-red-500'
                          : 'border-black-200'
                      )}
                      onChange={async (e) => {
                        let value = e.target.value;

                        if (value.startsWith(prefix)) {
                          value = value.slice(prefix.length);
                        }

                        field.onChange(value);

                        if (value.length > 0) {
                          await validateCustomProfileUrl(prefix + value);
                        } else {
                          setError('');
                        }

                        await trigger('CustomProfileUrl');
                      }}
                      value={field.value || ''}
                      readOnly={false}
                    />
                  </div>
                  {!!errors?.CustomProfileUrl ? (
                    <p className="text-h9 2xl:text-scaled-h9 text-red-400 text-sm">
                      {errors?.CustomProfileUrl?.message}
                    </p>
                  ) : (
                    <p className="text-h9 2xl:text-scaled-h9 text-red-400 text-sm">
                      {error}
                    </p>
                  )}
                </>
              );
            }}
          />
        </div>
        <Note
          status="info"
          text="Race and Ethnicity selections are kept private and used for internal purposes only"
        />
      </div>
    </FormLayout>
  );
};

export default BasicDetailsExperts;
