'use client';
import FormLayout from '@/components/ui/form-layout';
import Button from '@/components/ui/button';
import ChipInput from '@/components/ui/chip-input';
import DatePicker from '@/components/ui/date-picker';
import Input from '@/components/ui/input';
import CustomTimeRangePicker from '@/components/ui/picker';
import CustomSelect from '@/components/ui/select';
import Switch from '@/components/ui/switch';
import { ethnicityOptions } from '@/utils/constants';
import { ProfileBusinessFormData } from '@/utils/schema';
import { apiEndpoint, cn } from '@/utils/utils';
import axios from 'axios';
import { format } from 'date-fns';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';

interface IProps {
  businessInfoStep: number;
  setBusinessInfoStep: Dispatch<SetStateAction<number>>;
}

const employeeOptions = [
  { value: '1-10', label: '1-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-100', label: '51-100' },
  { value: '101-500', label: '101-500' },
  { value: '501-1000', label: '501-1000' },
  { value: '1001-5000', label: '1001-5000' },
  { value: '5001-10000', label: '5001-10000' },
  { value: '10001+', label: '10001+' },
];

const ownershipOptions = [
  { value: '0%', label: '0%' },
  { value: '1-10%', label: '1-10%' },
  { value: '11-30%', label: '11-30%' },
  { value: '31-50%', label: '31-50%' },
  { value: '51-70%', label: '51-70%' },
  { value: '91-99%', label: '91-99%' },
  { value: '100%', label: '100%' },
];

const BusinessExtraDetails: React.FC<IProps> = ({
  businessInfoStep,
  setBusinessInfoStep,
}) => {

  function ConvertDateFormat(dateStr){
    if(dateStr == null){
      return null;
    }
    const [day, month, year] = dateStr.split('/');
    return `${month}/${day}/${year}`;
  }
const prevBusinessSince = useSelector((state: RootState) => state.user.profileData.BusinessSince);

  const {
    control,
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
    getValues,
  } = useFormContext<ProfileBusinessFormData>();
  const [selectedDate, setSelectedDate] = useState(ConvertDateFormat(prevBusinessSince) || new Date());
  const [cityList, setCityList] = useState<
    { id: number; value: string; label: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      if (getValues().Country) {
        try {
          const res = await axios.post(
            `${apiEndpoint}/Profile/GetCityByRegion`,
            {
              CountryId: Number(getValues().Country),
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
  }, [getValues().Country]);

  const handleWebsiteChange = (e) => {
    let website = e.target.value;

    // If the website starts with http:// or https://, keep it as is
    if (
      website &&
      !website.startsWith('http://') &&
      !website.startsWith('https://')
    ) {
      website = `https://${website}`;
    }

    // Update the form value with the corrected website
    setValue('Website', website);
  };
  useEffect(() => {
    if (
      cityList.length > 0 &&
      !cityList.find(
        (option) => option.value === watch('ethinicityBlackOwnership')
      )
    ) {
      setValue('ethinicityBlackOwnership', null);
    }
  }, [cityList]);
  const handleContinue = async () => {
    try {
      const isValidWebsite = await trigger('Website');
      const noOfEmployees = await trigger('noOfEmployees');
      const emailQueries = await trigger('emailQueries');
      const emailBusinessDevelopment = await trigger(
        'emailBusinessDevelopment'
      );
      const blackOwnershipPercentage = await trigger(
        'blackOwnershipPercentage'
      );
      const ethinicityBlackOwnership =
        (await trigger('ethinicityBlackOwnership')) ||
        !!watch('ethinicityBlackOwnership');
      const languages = await trigger('languages');
      const inBusinessSince =
        (await trigger('inBusinessSince')) || !!watch('inBusinessSince');
      const businessType = await trigger('businessType');
      const hoursFrom = await trigger('hoursFrom');
      const hoursTo = await trigger('hoursTo');
      if (
        isValidWebsite &&
        noOfEmployees &&
        emailQueries &&
        emailBusinessDevelopment &&
        blackOwnershipPercentage &&
        ethinicityBlackOwnership &&
        languages &&
        inBusinessSince &&
        businessType &&
        hoursTo &&
        hoursFrom
      ) {
        setBusinessInfoStep(businessInfoStep + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setValue('inBusinessSince', format(selectedDate, 'dd/MM/yyyy'));
  }, [selectedDate, setValue]);
  return (
    <FormLayout
      title="Business Information"
      description="Please provide your business's address (headquarters)"
      position="start"
      variant="equal"
      handleNext={handleContinue}
      showBack={true}
      handleBack={() => setBusinessInfoStep(businessInfoStep - 1)}
    >
      <div className="flex flex-col w-full mb-10 rounded-lg gap-6 md:py-6 lg:px-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Website
            </label>
            <Input
              placeholder="https://website.com"
              error={errors.Website?.message}
              {...register('Website', {
                onBlur: handleWebsiteChange,
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              No. Of Employees <span className="text-danger-500">*</span>
            </label>
            <CustomSelect
              placeholder="Select number of employees"
              options={employeeOptions}
              onChange={async (val) => {
                setValue('noOfEmployees', val.value);
                await trigger('noOfEmployees');
              }}
              error={errors.noOfEmployees?.message}
              value={employeeOptions.find(
                (option) => option.value === watch('noOfEmployees')
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Email - Queries <span className="text-danger-500">*</span>
            </label>
            <Input
              placeholder="Enter email"
              error={errors.emailQueries?.message}
              {...register('emailQueries')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Email - Business Development{' '}
            </label>
            <Input
              placeholder="Enter email"
              error={errors.emailBusinessDevelopment?.message}
              {...register('emailBusinessDevelopment')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Black Ownership Percentage{' '}
              <span className="text-danger-500">*</span>
            </label>
            <CustomSelect
              placeholder="Select Ownership Percentage"
              options={ownershipOptions}
              onChange={async (val) => {
                setValue('blackOwnershipPercentage', val.value);
                await trigger('blackOwnershipPercentage');
              }}
              error={errors.blackOwnershipPercentage?.message}
              value={ownershipOptions.find(
                (option) => option.value === watch('blackOwnershipPercentage')
              )}
            />
          </div>
          {watch('blackOwnershipPercentage') !== '0%' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center justify-between text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
                  <div className="w-full">
                    Ethnicity of Black Ownership{' '}
                    <span className="text-danger-500">*</span>
                  </div>
                </label>
                <div className='flex items-center gap-1'>
                  <p className="font-normal ml-1 text-xs">Private?</p>
                  <div className="w-auto">
                    <Switch
                      label=""
                      isOn={watch('isPrivate')}
                      onToggle={() =>
                        setValue('isPrivate', !watch('isPrivate'))
                      }
                      isTitle={'Private'}
                    />
                  </div>
                </div>
              </div>
              <CustomSelect
                placeholder="Select Ethnicity of Black Ownership"
                options={cityList}
                onChange={async (val) => {
                  setValue('ethinicityBlackOwnership', val.value);
                  await trigger('ethinicityBlackOwnership');
                }}
                error={errors.ethinicityBlackOwnership?.message}
                value={
                  cityList.find(
                    (option) =>
                      option.value === watch('ethinicityBlackOwnership')
                  ) || null
                }
              />
            </div>
          ) : null}

          {/* <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Languages <span className="text-danger-500">*</span>
            </label>
            <Input
              placeholder="Select Languages"
              error={errors.languages?.message}
              {...register('languages')}
            />
          </div> */}
          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Languages
            </label>
            <Controller
              name="languages"
              control={control}
              rules={{
                maxLength: {
                  value: 5,
                  message: 'Maximum 5 languages allowed',
                },
              }}
              render={({ field }) => (
                <ChipInput
                  placeholder="Select Languages (Press Enter to select additional languages)"
                  error={errors.languages?.message as string}
                  {...field}
                />
              )}
            />
            <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
              {`Enter up to 5 languages`}
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Phone Number
            </label>
            <Input
              placeholder="Enter Phone Number"
              error={errors.phoneNo?.message}
              {...register('phoneNo')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Hours
            </label>
            <CustomTimeRangePicker<ProfileBusinessFormData>
              nameFrom="hoursFrom"
              nameTo="hoursTo"
              control={control}
              label="Business Hours"
            />
          </div>
          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Business Type <span className="text-danger-500">*</span>
            </label>
            <Input
              placeholder="How do you describe your business (e.g., Salon or Marketing Firm)"
              error={errors.businessType?.message}
              {...register('businessType')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              In Business Since
            </label>

            <DatePicker
              onChange={setSelectedDate}
              value={selectedDate}
              format="yyyy-MM-dd"
            />
          </div>
        </div>
      </div>
    </FormLayout>
  );
};

export default BusinessExtraDetails;
