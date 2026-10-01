'use client';

import Input from '@/components/ui/input';
import Add from '@/icons/add';
import SearchIcon from '@/icons/sidebar/search-icon';
import { cn } from '@/utils/utils';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import FormLayout from '@/components/ui/form-layout';
import { BusinessOpportunitiesData } from '@/utils/schema';
import { toast } from 'react-toastify';
import { locationService } from '@/app/api/dashboard/businessDevelopment';

interface IProps {
  setServiceStep: Dispatch<SetStateAction<number>>;
  setStep: Dispatch<SetStateAction<number>>;
  locationsData?: any
  BdId?: any
}

interface Location {
  Id: number;
  Name: string;
  Type?: string;
  CountryName?: string;
  CityName?: string;
  StateName?: string;

}

const schema = z.object({
  RegionId: z.number(),
  countryList: z.array(
    z.object({
      id: z.string(),
      value: z.string(),
    })
  ),
  stateList: z.array(
    z.object({
      id: z.string(),
      value: z.string(),
    })
  ),
  cityList: z.array(
    z.object({
      id: z.string(),
      value: z.string(),
    })
  ),
});

const options = [{ type: 'Countries' }, { type: 'Cities' }];

const Countries: React.FC<IProps> = ({ setStep, setServiceStep, locationsData, BdId }) => {
  const apiKey=process.env.NEXT_PUBLIC_API_KEY as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Countries');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const {
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useFormContext<BusinessOpportunitiesData>();
  const countryCount = watch("countryList")?.length || 0;
  const cityCount = watch("cityList")?.length || 0;
  const total = countryCount + cityCount;

  const searchLocations = React.useCallback(async (term: string, selectedType: string) => {
    try {
      if (term === "") {
        setSearchResults([]);
        return;
      }

      const result = await locationService.searchLocations(term, watch('RegionId'));
      
      let allResults = [];
      if (selectedType === "Countries") {
        allResults = [...result.CountriesData];
      } else if (selectedType === "Cities") {
        allResults = [...result.CitiesData];
      } else {
        allResults = [...result.StatesData];
      }

      setSearchResults(allResults);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  }, []);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      searchLocations(searchTerm, selectedType);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, searchLocations, selectedType]);
  useEffect(()=>{
    setValue('countryList',[])
    setValue('cityList',[])
  },[])
  const handleAddLocation = (location: Location) => {
    setSelectedLocations((prev) => [...prev, location]);
    setSearchResults((prev) => prev.filter((item) => item.Id !== location.Id));

    if (location.Type === 'Country') {
      setValue('countryList', [
        ...((getValues('countryList') as { value: string; id: number }[]) ||
          []),
        { id: location.Id, value: location.Name },
      ]);
    } else if (location.Type === 'State') {
      setValue('stateList', [
        ...((getValues('stateList') as { value: string; id: number }[]) || []),
        { id: location.Id, value: location.Name },
      ]);
    } else if (location.Type === 'City') {
      setValue('cityList', [
        ...((getValues('cityList') as { value: string; id: number }[]) || []),
        { id: location.Id, value: location.Name },
      ]);
    }
  };

  const handleRemoveLocation = (location: Location) => {
    setSelectedLocations((prev) =>
      prev.filter((item) => item.Id !== location.Id)
    );
    setSearchResults((prev) => [...prev, location]);
    if (location.Type === 'Country') {
      setValue(
        'countryList',
        (
          (getValues('countryList') as { value: string; id: number }[]) || []
        ).filter((item) => item.id !== location.Id)
      );
    } else if (location.Type === 'State') {
      setValue(
        'stateList',
        (
          (getValues('stateList') as { value: string; id: number }[]) || []
        ).filter((item) => item.id !== location.Id)
      );
    } else if (location.Type === 'City') {
      setValue(
        'cityList',
        (
          (getValues('cityList') as { value: string; id: number }[]) || []
        ).filter((item) => item.id !== location.Id)
      );
    }
  };

  const handleContinue = async () => {
    if(total === 0) {
      setError(true);
      return;
    }

    try {
      setError(false);
      setLoading(true);

      const payload = {
        CityIds: (watch("cityList"))?.map((city) => ({ CityId: city?.id })),
        CountryIds: (watch("countryList"))?.map((country) => ({ CountryId: country?.id })),
        StateIds: (watch("stateList"))?.map((state) => ({ StateId: state?.id })),
        BDId: BdId
      };

      const response = await locationService.saveBDLocations(payload, apiKey);
      toast.success(response?.Message || "Locations saved successfully");
      setStep((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
      handleBack={() => setServiceStep((prev) => prev - 1)}
      handleNext={() => handleContinue()}
      disableNext={loading}
      position="start"
    >
      <div className="hidden md:flex items-center gap-6 text-h7 2xl:text-scaled-h7">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedType(option.type);
              setSearchResults([]);
            }}
            className={cn(
              'cursor-pointer border-b-2',
              selectedType === option.type
                ? 'border-omblue-600 text-omblue-600 font-semibold'
                : 'text-[#797B82] border-transparent font-medium'
            )}
            type='button'
          >
            <p className="px-4 py-3">{option.type}</p>
          </button>
        ))}
      </div>
      <div className="flex items-center flex-wrap gap-2">
        {selectedLocations?.map((location: Location) => (
          <div
            className="p-1.5 text-h7 md:text-scaled-h7 font-semibold flex items-center justify-center rounded-md gap-2 cursor-pointer border bg-olblue-50 text-omblue-500 border-omblue-500"
            key={location.Id}
            onClick={() => handleRemoveLocation(location)}
          >
            <p>{location.Name}</p>
            <Add className="w-4 h-4 rotate-45" />
          </div>
        ))}
      </div>
      <div className="mb-4">
        <Input
          placeholder={selectedType === 'Countries' ? "Type country name..." : "Type city name..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<SearchIcon />}
        />
      </div>

      <div className="flex items-center flex-wrap gap-2">
      {total > 3 && <div className="w-full text-red-400 text-sm my-2 m-1">Maximum 4 locations allowed.</div>}

        {searchResults ? searchResults.map((result) => (
          <>
          <button
            className={`p-1.5 text-h7 md:text-scaled-h7 font-semibold gap-2 cursor-pointer flex items-center justify-center rounded-md border ${'text-omblue-500 border-omblue-500'}`}
            key={result.Id}
            onClick={() => handleAddLocation(result)}
            disabled={total > 3}
          >
            <p>{result.Name}</p>
            <Add className="w-4 h-4 " />
          </button>
            </>
        )) : <div>
          <p className="text-h7 md:text-scaled-h7 text-center text-[#797B82]">
            No results found.
          </p>
        </div>}
         {error && (
        <span className=" text-red-400 text-xs mt-2 m-1">
          Please select at least one location.
        </span>
      )}
        </div>
    </FormLayout>
  );
};

export default Countries;