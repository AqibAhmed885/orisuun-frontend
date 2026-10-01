import Input from '@/components/ui/input';
import Radio from '@/components/ui/radio';
import CustomSelect from '@/components/ui/select';
import { CreateSponsorSchema } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { DaysOfMonths, months, years } from '../../../../../../../data/dashboard/fundraising';
import CalendarButton from '@/components/calendar/calendar-button';
import {impactOptions} from '../../../../../../../data/dashboard/fundraising';

interface ICustomSelectOptions {
  label: string;
  value: string;
  icon?: string;
}

const SponsorshipDetails = () => {
  const [selectedValue, setSelectedValue] = useState<string>('fullTerm');
  const [selectedMonth, setSelectedMonth] = useState<ICustomSelectOptions>(months[0]);
  const [selectedDay, setSelectedDay] = useState<ICustomSelectOptions>(DaysOfMonths[months[0].value][0]);
  const [selectedYear, setSelectedYear] = useState<ICustomSelectOptions>(years[0]);
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useFormContext<CreateSponsorSchema>();

  useEffect(() => {
    if (
      selectedValue == 'custom' &&
      selectedMonth &&
      selectedDay &&
      selectedYear
    ) {
      setValue(
        'Duration',
        new Date(
          Number(selectedYear.value),
          Number(selectedMonth.value) - 1,
          Number(selectedDay.value)
        )
      );
    } else {
      setValue('Duration', null);
      setValue('DurationStatus', selectedValue);
    }
  }, [selectedMonth, selectedYear, selectedDay]);

  const handleDateSelectFromCalender = (date: Date) => {
    setSelectedDay({
      label: date.getDate().toString(),
      value: date.getDate().toString(),
    });
    setSelectedMonth(months[date.getMonth().toString()]);
    setSelectedYear({
      label: date.getFullYear().toString(),
      value: date.getFullYear().toString(),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
  };
  return (
    <div className="max-w-[465px] mx-auto w-full flex flex-col gap-2.5 lg:!gap-6">
      <div className="flex flex-col gap-2.5 lg:!gap-3 items-start">
        <label className="text-sm font-semibold text-black-900 flex gap-1">
          Duration of Sponsorship <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-2.5 lg:!gap-3 w-full">
          <Radio
            id="fullTerm"
            label="Full Term"
            value="fullTerm"
            checked={selectedValue === 'fullTerm'}
            onChange={handleChange}
            variant="thin"
            outerSize="w-5 h-5"
            innerSize="w-5 h-5"
            helperText="(campaign start date to campaign end date)"
          />
          <Radio
            id="remainingTerm"
            label="Remaining Term"
            value="remainingTerm"
            checked={selectedValue === 'remainingTerm'}
            onChange={handleChange}
            variant="thin"
            outerSize="w-5 h-5"
            innerSize="w-5 h-5"
            helperText="(today to campaign end date)"
          />
          <Radio
            id="custom"
            label="Custom"
            value="custom"
            checked={selectedValue === 'custom'}
            onChange={handleChange}
            variant="thin"
            outerSize="w-5 h-5"
            innerSize="w-5 h-5"
            helperText="(today to custom date)"
          />
          {selectedValue === 'custom' && (
            <div className="flex gap-1 items-start w-full mt-2">
              <CustomSelect
                options={months}
                placeholder="Month"
                onChange={async (val: ICustomSelectOptions) => {
                  setSelectedMonth(val);
                }}
                controlClasses="h-11"
                className="h-11 col-span-1 w-full rounded-md box-border text-sm"
                value={selectedMonth}
              />
              <CustomSelect
                options={DaysOfMonths[selectedMonth.value]}
                placeholder="Day"
                onChange={async (val: ICustomSelectOptions) => {
                  setSelectedDay(val);
                }}
                controlClasses="h-11"
                className="h-11 col-span-1 w-full rounded-md box-border text-sm"
                value={selectedDay}
              />
              <CustomSelect
                options={years}
                placeholder="Year"
                onChange={async (val: ICustomSelectOptions) => {
                  setSelectedYear(val);
                }}
                controlClasses="h-11"
                className="h-11 col-span-1 w-full rounded-md box-border text-sm"
                value={selectedYear}
              />
              <CalendarButton
                handleDateSelectFromCalender={handleDateSelectFromCalender}
              />
            </div>
          )}
          {errors.Duration && (
            <span className="text-red-400 text-xs right-4">
              {errors.Duration.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2.5 lg:!gap-3">
        <label
          htmlFor="maximumGift"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Maximum Gift
        </label>
        <Input
          required
          type="number"
          id="maximumGift"
          placeholder="USD"
          icon={
            <p
              className={`${
                watch('MaximumGift')
                  ? 'text-black-500-custom'
                  : 'text-black-200 '
              } text-sm font-medium`}
            >
              $
            </p>
          }
          iconControlClasses="!pl-5"
          className="h-11 border-black-200 placeholder:text-black-200 w-full border rounded-md px-4 py-3  box-border text-sm"
          {...register('MaximumGift', {
            setValueAs: (value) =>
              value === '' ? undefined : parseFloat(value),
          })}
          error={errors.MaximumGift?.message}
          name="MaximumGift"
        />
      </div>

      <div className="flex flex-col gap-2.5 lg:!gap-3">
        <label
          htmlFor="impact"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Impact <span className="text-red-500">*</span>
          <span className="text-blue-300 self-baseline text-xs font-medium">
            Matching Impact (1:1 match is 1x, 2:1 match is 2x)
          </span>
        </label>
        <CustomSelect
          options={impactOptions}
          placeholder="Impact"
          {...register(`Impact`)}
          error={errors?.Impact ? errors.Impact?.message : ''}
          onChange={async (val) => {
            setValue('Impact', val.value);
          }}
          controlClasses="h-11"
          className="h-11 col-span-1 w-full rounded-md box-border text-sm"
          value={impactOptions?.find(
            (impactOption) =>
              impactOption.value.toString() === getValues('Impact')
          )}
        />
      </div>

      <div className="flex flex-col gap-2.5 lg:!gap-3">
        <label
          htmlFor="minimumSupport"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Minimum Support Amount <span className="text-red-500">*</span>
        </label>
        <Input
          required
          type="number"
          id="minimumSupport"
          placeholder="USD"
          icon={
            <p
              className={`${
                watch('MinimumSupportAmount')
                  ? 'text-black-500-custom'
                  : 'text-black-200 '
              } text-sm font-medium`}
            >
              $
            </p>
          }
          iconControlClasses="!pl-5"
          className="h-11 border-black-200 placeholder:text-black-200 w-full border rounded-md px-4 py-3  box-border text-sm"
          {...register('MinimumSupportAmount', {
            setValueAs: (value) =>
              value === '' ? undefined : parseFloat(value),
          })}
          error={errors.MinimumSupportAmount?.message}
          name="MinimumSupportAmount"
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="shortMessage"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Short Message <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Short Message"
          rows={3}
          maxLength={70}
          className={`${
            errors.ShortMessage ? 'border-red-500' : 'border-black-200'
          } resize-none !outline-none placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm focus:border-omblue-500`}
          {...register('ShortMessage')}
        />
        {errors.ShortMessage ? (
          <span className="text-red-400 text-xs right-4">
            {errors.ShortMessage.message}
          </span>
        ) : (
          <span className="text-sm font-medium text-blue-300 mt-2">
            Maximum 70 characters
          </span>
        )}
      </div>
    </div>
  );
};

export default SponsorshipDetails;
