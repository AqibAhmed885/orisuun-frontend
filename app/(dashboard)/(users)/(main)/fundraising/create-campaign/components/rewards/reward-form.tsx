import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CampaignSchema } from '@/utils/schema';
import CustomSelect from '@/components/ui/select';
import { rewardService } from '@/app/api/dashboard/fundraising';
import { months, ICustomSelectOptions } from '../../../../../../../../data/dashboard/fundraising';

export default function RewardForm() {
  const [years, setYears] = useState<Array<ICustomSelectOptions>>([]);
  const {
    register,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useFormContext<CampaignSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'Rewards',
  });
  const [locations, setLocations] = useState<Array<ICustomSelectOptions>>([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const next10Years: Array<ICustomSelectOptions> = Array.from(
      { length: 10 },
      (_, index) => {
        const year = currentYear + index;
        return { label: year.toString(), value: year.toString() };
      }
    );
    setYears(next10Years);

    const fetchCountries = async () => {
      const countries = await rewardService.getCountryList();
      setLocations(countries);
    };
    fetchCountries();
  }, []);

  return (
    <form className="lg:max-w-[465px] 4xl:!max-w-max mx-auto space-y-6">
      {fields.map((field, index) => (
        <>
          <Button
            type="button"
            title="- Delete"
            variant="ghost"
            className="h-11 !min-w-max !max-w-max !py-0 text-danger-500 text-sm font-medium"
            onClick={() => remove(index)}
          />
          <div className="flex flex-col gap-3">
            <label
              htmlFor={`Rewards.${index}.Title`}
              className="block text-sm font-semibold text-black-900"
            >
              Title
            </label>
            <Input
              required
              type="text"
              placeholder="Reward Title"
              className="h-11 border-black-200 placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm"
              {...register(`Rewards.${index}.Title`)}
              error={
                errors?.Rewards ? errors?.Rewards[index]?.Title?.message : ''
              }
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-3">
            <label
              htmlFor={`Rewards.${index}.Description`}
              className="block text-sm font-semibold text-black-900"
            >
              Description
            </label>
            <textarea
              {...register(`Rewards.${index}.Description`)}
              placeholder="Brief, Description statement about reward."
              rows={3}
              className="border-black-200 resize-none placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm"
            />
            {errors?.Rewards && errors?.Rewards[index]?.Description?.message ? (
              <span className="text-sm text-red-500">
                {errors?.Rewards[index]?.Description?.message}
              </span>
            ) : (
              <span className="text-sm text-blue-300">
                Maximum 200 words description
              </span>
            )}
          </div>

          {/* Pricing Dropdown */}
          <div className="flex flex-col gap-3">
            <label
              htmlFor={`Rewards.${index}.Pricing`}
              className="block text-sm font-semibold text-black-900"
            >
              Pricing
            </label>
            <Input
              required
              type="number"
              id="Pricing"
              placeholder="USD$"
              className="h-11 border-black-200 placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm"
              {...register(`Rewards.${index}.Pricing`, {
                setValueAs: (value) =>
                  value === '' ? undefined : parseFloat(value),
              })}
              error={
                errors.Rewards ? errors.Rewards[index]?.Pricing?.message : ''
              }
            />
          </div>

          {/* Shipping Section */}
          <div className="flex flex-col gap-3">
            <label
              htmlFor="campaignGoal"
              className="block text-sm font-semibold text-black-900"
            >
              Shipping
            </label>
            <div className="grid grid-cols-2 gap-x-1.5 gap-y-3">
              <Input
                required
                type="number"
                id="Inventory"
                placeholder="Inventory"
                {...register(`Rewards.${index}.Inventory`, {
                  setValueAs: (value) =>
                    value === '' ? undefined : parseFloat(value),
                })}
                className="h-11 col-span-1 border-black-200 placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm"
                error={
                  errors?.Rewards && errors?.Rewards[index]?.Inventory?.message
                }
              />
              <CustomSelect
                options={locations}
                placeholder="Shipping from"
                {...register(`Rewards.${index}.ShippingFrom`)}
                error={
                  errors.Rewards
                    ? errors.Rewards[index]?.ShippingFrom?.message
                    : ''
                }
                onChange={async (val) => {
                  let rewards = getValues('Rewards');
                  rewards[index].ShippingFrom = val.value;
                  setValue('Rewards', rewards);
                }}
                controlClasses="h-11"
                className="h-11 col-span-1 w-full rounded-md box-border text-sm"
                value={locations?.find(
                  (location) =>
                    location.value.toString() ===
                    getValues('Rewards')?.[index]?.ShippingFrom
                )}
              />
              <CustomSelect
                options={locations}
                placeholder="Shipping To"
                {...register(`Rewards.${index}.ShippingTo`)}
                error={
                  errors.Rewards
                    ? errors.Rewards[index]?.ShippingTo?.message
                    : ''
                }
                isMulti={true}
                onChange={async (val) => {
                  let rewards = getValues('Rewards');
                  rewards[index].ShippingTo = val.map((r) => r.value).join(',');
                  setValue('Rewards', rewards);
                }}
                controlClasses="h-11 !py-0"
                className="h-11 col-span-1 lg:!col-span-2 w-full rounded-md box-border text-sm"
                value={locations?.find(
                  (location) =>
                    location.value.toString() ===
                    getValues('Rewards')?.[index]?.ShippingTo
                )}
              />
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="flex flex-col gap-3">
            <label
              htmlFor="campaignGoal"
              className="block text-sm font-semibold text-black-900"
            >
              Estimated delivery
            </label>
            <div className="grid grid-cols-2 gap-x-1.5 gap-y-3">
              <CustomSelect
                options={months}
                placeholder="Month"
                {...register(`Rewards.${index}.EstimatedDeliveryMonth`)}
                error={
                  errors.Rewards
                    ? errors.Rewards[index]?.EstimatedDeliveryMonth?.message
                    : ''
                }
                onChange={async (val) => {
                  let rewards = getValues('Rewards');
                  rewards[index].EstimatedDeliveryMonth = val.value;
                  setValue('Rewards', rewards);
                }}
                controlClasses="h-11"
                className="h-11 col-span-1 w-full rounded-md box-border text-sm"
                value={months?.find(
                  (month) =>
                    month.value.toString() ===
                    getValues('Rewards')?.[index]?.EstimatedDeliveryMonth
                )}
              />
              <CustomSelect
                options={years}
                placeholder="Month"
                {...register(`Rewards.${index}.EstimatedDeliveryYear`)}
                error={
                  errors?.Rewards
                    ? errors.Rewards[index]?.EstimatedDeliveryYear?.message
                    : ''
                }
                onChange={async (val) => {
                  let rewards = getValues('Rewards');
                  rewards[index].EstimatedDeliveryYear = val.value;
                  setValue('Rewards', rewards);
                }}
                controlClasses="h-11"
                className="h-11 col-span-1 w-full rounded-md box-border text-sm"
                value={years?.find(
                  (year) =>
                    year.value.toString() ===
                    getValues('Rewards')?.[index]?.EstimatedDeliveryYear
                )}
              />

            </div>
            <div className="mt-4 border-b-[1px] border-gray-400 w-full"></div>
          </div>
        </>
      ))}

      <div className="flex gap-3 items-center">
        <Button
          type="button"
          title="+ Add New Reward"
          variant="ghost"
          className="h-11 !min-w-max !max-w-max !py-0 text-nav-blue text-sm"
          onClick={() =>
            append({
              Title: '',
              Description: '',
              Pricing: null,
              Inventory: null,
              ShippingTo: '',
              ShippingFrom: '',
              EstimatedDeliveryMonth: '1',
              EstimatedDeliveryYear: `${new Date().getFullYear()}`,
            })
          }
        />
      </div>
    </form>
  );
}
