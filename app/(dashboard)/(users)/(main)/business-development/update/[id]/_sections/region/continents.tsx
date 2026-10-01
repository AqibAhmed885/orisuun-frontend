'use client';

import { continentsService } from '@/app/api/dashboard/businessDevelopment';
import FormLayout from '@/components/ui/form-layout';
import Africa from '@/icons/region/africa';
import Asia from '@/icons/region/asia';
import CentralAmericaAndCaribbean from '@/icons/region/central-america-and-carribbean';
import Europe from '@/icons/region/europe';
import NorthAmerica from '@/icons/region/north-america';
import SouthAmerica from '@/icons/region/south-america';
import {
  getRegionListAction,
} from '@/server-actions/businessDevelopment';
import { BusinessOpportunitiesData } from '@/utils/schema';
import { useParams } from 'next/navigation';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

interface IProps {
  setServiceStep: Dispatch<SetStateAction<number>>;
  setStep: Dispatch<SetStateAction<number>>;
  BdId?: any
  setLocationsData?: any
}
interface Region {
  Id: number;
  RegionName: string;
  IconName: React.ComponentType<any>;
}

const regionIcons: { [key: string]: React.ComponentType<any> } = {
  Africa,
  Asia,
  CentralAmericaAndCaribbean,
  Europe,
  NorthAmerica,
  SouthAmerica,
};

const Continents: React.FC<IProps> = ({ setStep, setServiceStep, BdId, setLocationsData }) => {
  const { id } = useParams()
  const [continent, setContinent] = useState<string>();
  const { setValue, watch } = useFormContext<BusinessOpportunitiesData>();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false)


  const regionId = watch('RegionId')

  const fetchRegions = useCallback(async () => {
    try {
      const response = await getRegionListAction();
      setRegions(
        response?.data.map((region: any) => ({
          ...region,
          IconName:
          regionIcons[region.RegionName.split(' ')            
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
          .join('')] || (() => null),
        }))
        
      );
      if(regionId){
        const result = response?.data.find(r => r.Id === regionId)?.RegionName
        setContinent(result)
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const handleContinue = async () => {
    try {
      setLoading(true)
      const resGetCityAndCountryList = await continentsService.getCityAndCountryList(watch("RegionId"), BdId);
      if (resGetCityAndCountryList.StatusCode == 200) {
        toast.success(resGetCityAndCountryList?.Message || 'Data saved successfully')
        setLocationsData(resGetCityAndCountryList?.Result)
        setServiceStep((prev) => prev + 1)
        setLoading(false)
      }
    } catch (error) {
      toast.error(error.response?.data?.Message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <FormLayout
      title="Please select the relevant region for your business development opportunity"
      descriptionAlt={
        <p className="text-h7 2xl:text-scaled-h7 text-blue-300 font-medium">
          Select at the{' '}
          <span className="font-semibold text-omblue-700">
            Region/Country/State
          </span>
          , or <span className="font-semibold text-omblue-700">City</span>{' '}
          level.
        </p>
      }
      handleNext={() => handleContinue()}
      handleBack={() => setStep((prev) => prev - 1)}
      position="start"
      disableNext={loading}
    >
      <div className="grid grid-cols-12 gap-4">
        {regions.map((item) => {
          const Icon = item.IconName;
          return (
            <button
              key={item.Id}
              className={`col-span-6 w-full border rounded-lg p-6 space-y-4 ${item?.Id === regionId
                ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
                : 'border-[#D2D4DA]'
                }`}
              onClick={() => {
                if (item.RegionName) setContinent(item.RegionName);
                setValue('RegionId', item.Id);
              }}
              type="button"
            >
              <Icon
                className={
                  continent === item.RegionName
                    ? 'text-omblue-500'
                    : 'text-omblue-300'
                }
              />
              <h5 className="text-h5 2xl:text-scaled-h5 text-left font-semibold text-black-400">
                {item.RegionName}
              </h5>
            </button>
          );
        })}
      </div>
    </FormLayout>
  );
};

export default Continents;
