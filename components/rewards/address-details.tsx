'use client';

import { useEffect, useState } from 'react';
import Dropdown from '../ui/dropdown';
import Input from '../ui/input';
import ExclamationIcon from '@/icons/exclamation';
import Checkbox from '../ui/checbox';
import { AddressFormTypes, AddressFormSchema } from '@/utils/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import csc from 'countries-states-cities';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import CustomSelect from '../ui/select';
import Button from '../ui/button';

const tabs = [
  { title: 'Sponsor Info', steps: 3 },
  { title: 'Sponsorship Details', steps: 1 },
  { title: 'Payment Details', steps: 1 },
];

interface AddressFormProps {
  OnNextValidation?: (AddressFormTypes) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ OnNextValidation }) => {
  const [selectedItem, setSelectedItem] = useState(tabs[0]);
  const [stateList, setStateList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [agreeTermsAndConditions, setAgreeTermsAndConditions] =
    useState<boolean>(false);

  const {
    register,
    formState: { errors },
    getValues,
    watch,
    setValue,
    trigger,
  } = useForm<AddressFormTypes>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      streetName: '',
      streetNumber: '',
      unitNumber: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  useEffect(() => {
    (async () => {
      try {
        if (getValues().country == '') {
          return;
        }
        const res = await axios.get(
          `${apiEndpoint}/MyProfile/GetStateListByCountry/${Number(
            getValues().country
          )}`,
          {
            headers: {
              XApiKey:
                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            },
          }
        );
        if (res.status === 200) {
          const locations = res.data.Result;
          setStateList(
            locations.map((location) => ({
              label: location?.StateName,
              value: (location?.Id).toString(),
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching state list:', error);
      }
    })();
  }, [getValues().country]);

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
          setCountryList(
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

  useEffect(() => {
    (async () => {
      if (getValues().country) {
        try {
          const res = await axios.get(
            `${apiEndpoint}/MyProfile/GetCityList/${getValues().country}`,
            {
              headers: {
                XApiKey:
                  'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              },
            }
          );
          if (res.status === 200) {
            const statesList = res.data.Result;
            // const formattedCityList = statesList.map((item) => ({
            //   value: item.Id.toString(),
            //   label: item.CityName,
            // }));
            setCityList(res.data.Result);
          }
        } catch (error) {
          console.error('Error fetching country list:', error);
        }
      }
    })();
  }, [getValues().country]);

  const values = watch();

  const onSubmit = () => {
    if (!Object.keys(errors).length) {
      OnNextValidation(values);
    }
  };

  const handleSubmit = async (data) => {
    const valid = await trigger();
    if (valid) {
      onSubmit();
    }
  };

  return (
    <>
      {' '}
      <h2 className="text-2xl text-center lg:!text-left lg:text-5xl font-medium text-gray-900">
        Address Details
      </h2>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission behavior
          handleSubmit(onSubmit); // Properly call `handleSubmit` with the event
        }}
      >
        <div className="space-y-[14px]">
          <label className="flex flex-col gap-3">
            <span className="text-gray-700">Name</span>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              <Input
                type="text"
                placeholder="First Name"
                className="w-full px-3 py-2 border border-black-100 rounded-[5px] !text-[14px]"
                {...register('firstName')}
                error={errors?.firstName?.message}
              />
              <Input
                type="text"
                placeholder="Last Name"
                className="w-full px-3 py-2 border border-black-100 rounded-[5px] !text-[14px]"
                {...register('lastName')}
                error={errors?.lastName?.message}
              />
            </div>
          </label>

          <label className="flex flex-col gap-3">
            <span className="text-gray-700">Address</span>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              <Input
                type="text"
                placeholder="Street Name"
                className="w-full px-3 py-2 border border-black-100 rounded-[5px] !text-[14px]"
                {...register('streetName')}
                error={errors?.streetName?.message}
              />
              <Input
                type="text"
                placeholder="Number"
                className="w-full px-3 py-2 border border-black-100 rounded-[5px] !text-[14px]"
                {...register('streetNumber')}
                error={errors?.streetNumber?.message}
              />
            </div>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            <Input
              type="text"
              placeholder="Unit Number"
              className="w-full px-3 py-2 border border-black-100 rounded-[5px] !text-[14px]"
              {...register('unitNumber')}
              error={errors?.unitNumber?.message}
            />
            <Input
              type="text"
              placeholder="Postal Code"
              className="w-full px-3 py-2 border border-black-100 rounded-[5px] !text-[14px]"
              {...register('postalCode')}
              error={errors?.postalCode?.message}
            />
          </div>
          <CustomSelect
            placeholder={'Country'}
            options={countryList}
            onChange={async (val) => {
              setValue('country', val.value);
              await trigger('country');
            }}
            error={errors.country?.message}
            value={
              countryList.find((option) => option.value === watch('country')) ||
              ''
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            <CustomSelect
              placeholder={'City'}
              options={cityList}
              onChange={async (val) => {
                setValue('city', val.value);
                await trigger('city');
              }}
              error={errors.city?.message}
              value={
                cityList.find((option) => option.value === watch('city')) || ''
              }
              isDisabled={watch('country') ? false : true}
            />
            <CustomSelect
              placeholder={'State'}
              options={stateList}
              onChange={async (val) => {
                setValue('state', val.value);
                await trigger('state');
              }}
              error={errors.state?.message}
              value={
                stateList.find((option) => option.value === watch('state')) ||
                ''
              }
              isDisabled={watch('country') ? false : true}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[30px] !mt-10 ">
          <div className="py-[9px] px-[15px] 4xl:px-4 4xl:py-2.5 bg-white border border-black-100 rounded-[5px] flex items-center gap-1.5 !text-[14px] text-blue-300 leading-[20px]">
            <span className="w-[20px] h-[20px] flex justify-center items-center">
              <ExclamationIcon className="w-4 h-4" />
            </span>
            <span>
              Backing means supporting a campaign, regardless of the outcome.
            </span>
          </div>

          <Checkbox
            checkedColor="nav-blue"
            onChange={(e) => setAgreeTermsAndConditions(e.target.checked)}
          >
            I understand that rewards or reimbursements aren’t guaranteed.
          </Checkbox>
        </div>

        <Button
          type="submit"
          title="Next"
          className="max-w-max justify-self-end rounded-full transition-colors"
          disabled={!agreeTermsAndConditions}
        />
      </form>
    </>
  );
};

export default AddressForm;
