import CalendarButton from '@/components/calendar/calendar-button';
import Dropzone from '@/components/ui/dropzone';
import Input from '@/components/ui/input';
import CustomSelect from '@/components/ui/select';
import { generateUploadFileSasTokenData } from '@/server-actions/verification';
import { CampaignSchema } from '@/utils/schema';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { fileUploadService } from '../../../../../../../api/dashboard/fundraising';
import { campaignPurposes } from '../../../../../../../../data/dashboard/fundraising'
import axios from 'axios';

// Define apiEndpoint
const apiEndpoint = process.env.NEXT_PUBLIC_APP_BASE_URL
  ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
  : 'https://api.orisuun.com/api';

export const Campaign = () => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    control,
    watch,
    getValues,
    clearErrors,
  } = useFormContext<CampaignSchema>();

  const [sasToken, setSasToken] = useState('');
  const [DurationDate, setDurationDate] = useState('1 Month');
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [industries, setIndustries] = useState([]);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const resInsdustries = await axios.get(
          `${apiEndpoint}/Search/GetIndustriesList`,
          {
            headers: {
              accept: '*/*',
              XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            },
          }
        );
        if (resInsdustries.status === 200) {
          setIndustries(
            resInsdustries.data.Result.map((data) => ({
              label: data.IndustryName,
              value: data.Id,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching industries:', error);
        setIndustries([]);
      }
    };
    fetchIndustries();
  }, []);

  const handleDateSelectFromCalender = (date: Date) => {
    setValue('Duration', date);
    setDurationDate('custom');
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files[0]) return;
    try {
      const file = files[files.length - 1];
      const url = await fileUploadService.uploadFile(file, sasToken);
      setValue('BackgroundImage', url);
    } catch (error) {
      console.error('Error uploading file:', error);
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
  }, []);

  const RadioButton = ({ title, value, name }) => {
    const isSelected = DurationDate === value;

    const handleDurationChange = async () => {
      let newDate: Date;
      if (value === '1 Month') {
        newDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
      } else if (value === '3 Months') {
        newDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
      } else if (value === '6 Months') {
        newDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
      }
      if (newDate) {
        setValue('Duration', newDate);
        await trigger('Duration');
        setDurationDate(value);
      }
    };

    return (
      <label
        className="flex items-center w-full rounded cursor-pointer"
        onClick={handleDurationChange}
      >
        <input required type="radio" value={value} className="sr-only" />
        <div
          className={`flex items-center justify-between w-full px-4 py-3 h-11 border rounded ${isSelected
            ? 'border-olblue-500 text-nav-blue bg-olblue-50'
            : `${errors.Duration ? 'border-red-500' : 'border-black-200'
            } text-black-200`
            }`}
        >
          <div className="flex items-center w-full justify-between">
            <div
              className={`relative flex items-center justify-center w-4 h-4 border rounded-full ${isSelected ? 'border-nav-blue' : 'border-black-100'
                }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${isSelected ? 'bg-nav-blue' : 'bg-transparent'
                  }`}
              />
            </div>
            <span className="ml-2 leading-5 text-sm font-medium">{title}</span>
          </div>
        </div>
      </label>
    );
  };

  return (
    <form
      className={`lg:max-w-[465px] 4xl:!max-w-screen-sm mx-auto space-y-2.5 lg:!space-y-6`}
    >
      <div className={`flex flex-col gap-2.5 lg:!gap-3`}>
        <label
          htmlFor="campaignTitle"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Campaign Title <span className="text-red-500">*</span>
        </label>
        <Input
          required
          type="text"
          placeholder="Campaign Title"
          className={`h-11 ${errors.Title ? 'border-red-500' : 'border-black-200'
            } placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm`}
          {...register('Title')}
          error={errors.Title?.message}
        />
      </div>

      <div className={`flex flex-col relative gap-3`}>
        <label
          htmlFor="executiveSummary"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Executive Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          id="executiveSummary"
          placeholder="Campaign Title"
          rows={3}
          className={`${errors.Summary ? 'border-red-500' : 'border-black-200'
            } resize-none !outline-none placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm focus:border-omblue-500`}
          {...register('Summary')}
        ></textarea>
        {errors.Summary && (
          <span className="text-red-400 text-xs absolute right-4">
            {errors.Summary.message}
          </span>
        )}
      </div>

      <div className={`flex flex-col relative gap-3`}>
        <label
          htmlFor="campaignDuration"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Campaign Duration <span className="text-red-500">*</span>
        </label>
        <div className=" grid grid-cols-2 lg:!flex lg:!flex-nowrap gap-1 lg:max-h-11">
          <RadioButton
            title="1 Month"
            value="1 Month"
            name="campaignDuration"
          />
          <RadioButton
            title="3 Months"
            value="3 Months"
            name="campaignDuration"
          />
          <RadioButton
            title="6 Months"
            value="6 Months"
            name="campaignDuration"
          />
          <CalendarButton
            className={` ${DurationDate == "custom" && 'bg-olblue-50 border-olblue-500'}`}
            iconClasses={` ${DurationDate == "custom" && 'text-nav-blue'}`}
            handleDateSelectFromCalender={handleDateSelectFromCalender}
          />
        </div>
        {errors.Duration && (
          <span className="text-red-400 text-xs absolute right-4">
            {errors.Duration?.message}
          </span>
        )}
      </div>

      <div className={`flex flex-col gap-2.5 lg:!gap-3`}>
        <label
          htmlFor="campaignPurpose"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Purpose of Campaign <span className="text-red-500">*</span>
        </label>
        <CustomSelect
          options={campaignPurposes}
          placeholder="Select Campaign Purpose"
          {...register('Purpose')}
          error={errors.Purpose?.message}
          onChange={async (val) => {
            setValue('Purpose', val.value);
            await trigger('Purpose');
          }}
          controlClasses="h-11"
          className="col-span-1 w-full rounded-md box-border text-sm"
          name="Purpose"
          value={campaignPurposes?.find(
            (purpose) => purpose.value.toString() === getValues('Purpose')
          )}
        />
      </div>

      <div className={`flex flex-col gap-2.5 lg:!gap-3`}>
        <label
          htmlFor="campaignGoal"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Campaign Goal <span className="text-red-500">*</span>
        </label>
        <Input
          required
          type="number"
          id="campaignGoal"
          placeholder="USD"
          icon={
            <p
              className={`${watch('Goal') ? 'text-black-500-custom' : 'text-black-200 '
                } text-sm font-medium`}
            >
              $
            </p>
          }
          iconControlClasses="!pl-5"
          className={`h-11 ${errors.Goal ? 'border-red-500' : 'border-black-200'
            } placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm mt-0 4xl:mt-1`}
          {...register('Goal', {
            setValueAs: (value) =>
              value === '' ? undefined : parseFloat(value),
          })}
          error={errors.Goal?.message}
          name="Goal"
        />
      </div>

      <div className={`flex flex-col gap-2.5 lg:!gap-3`}>
        <label
          htmlFor="campaignIndustry"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Industry <span className="text-red-500">*</span> {/* Remove * if optional */}
        </label>
        <CustomSelect
          options={industries}
          placeholder="Select Industry"
          {...register('Industry')}
          error={errors.Industry?.message}
          onChange={async (val) => {
            setValue('Industry', val.label); // Send the string name
            await trigger('Industry');
          }}
          controlClasses="h-11"
          className="col-span-1 w-full rounded-md box-border text-sm"
          name="Industry"
          value={industries?.find(
            (ind) => ind.label === getValues('Industry') // Find by label
          )}
        />
      </div>

      <div className="flex flex-col relative">
        <label
          htmlFor="campaignGoal"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Upload Background Image <span className="text-red-500">*</span>
        </label>
        <Dropzone
          acceptedFileTypes="image"
          maxSize={5242880}
          onFilesUpload={async (files: File[]) => await handleFileUpload(files)}
          storedFile={
            watch('BackgroundImage') ? [watch('BackgroundImage')] : []
          }
          className="mt-3 mb-10 lg:mb-0"
          previewClasses={'max-h-[250px] overflow-auto'}
        />
        {errors.BackgroundImage && (
          <span className="text-red-400 text-xs mx-2 mt-1 absolute right-4">
            {errors.BackgroundImage?.message}
          </span>
        )}
      </div>
    </form>
  );
};
