import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import FormLayout from '@/components/ui/form-layout';
import Input from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
import CustomSelect from '@/components/ui/select';
import { getCountryList } from '../../../../../../../api/dashboard/coFounder';
interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const BusinessDetails: React.FC<IProps> = ({ step, setStep }) => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useFormContext<CreateBusinessMemberOpportunityData>();
  const [locations, setLocations] = useState([])

  const handleContinue = async () => {
    try {
      const BusinessName = await trigger('BusinessName');
      const YearsInBusiness = await trigger('YearsInBusiness');
      const BusinessType = await trigger('BusinessType');
      const BusinessLocation = await trigger('BusinessLocation');
      const BusinessIndustry = await trigger('BusinessIndustry');
      const BusinessWebsite = await trigger('BusinessWebsite');
      const BusinessDescription = await trigger('BusinessDescription');

      if (
        BusinessName &&
        YearsInBusiness &&
        BusinessType &&
        BusinessLocation &&
        BusinessIndustry &&
        BusinessWebsite &&
        BusinessDescription
      ) {
        setStep(step + 1);
      }
    } catch (error) {
      // const allData = methods.getValues();
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const locationsList = await getCountryList();
        setLocations(locationsList);
      } catch (error) {
        console.error('Error fetching country list:', error);
      }
    })();
  }, []);



  return (
    <FormLayout
      title="Business Details"
      description={`Please tell us about your business`}
      handleNext={handleContinue}
      handleBack={() => setStep(step - 1)}
      position="start"
    >
      <Input
        {...register('BusinessName', { required: 'BusinessName is required' })}
        placeholder="Business name"
        error={errors.BusinessName ? errors.BusinessName.message : null}
        value={watch('BusinessName')}
      />
      <Input
        {...register('YearsInBusiness')}
        placeholder="Years in business"
        error={errors.YearsInBusiness ? errors.YearsInBusiness.message : null}
      />

      <Input
        {...register('BusinessType', { required: 'BusinessType is required' })}
        placeholder="Business Type (how do you describe your business - e.g., Salon or Marketing Firm)"
        error={errors.BusinessType ? errors.BusinessType.message : null}
      />
      <CustomSelect
        placeholder="Business Location"
        options={locations}
        onChange={async (selectedVal) => {
          setValue(
            'BusinessLocation',
            selectedVal.map((val) => ({
              id: val.value,
              value: val.label,
            }))
          );
          await trigger('BusinessLocation');
        }}
        value={watch('BusinessLocation')?.map((loc) => ({
          value: loc.id,
          label: loc.value,
        }))}
        error={errors.BusinessLocation && errors.BusinessLocation.message}
        isMulti
      />

      <Input
        {...register('BusinessIndustry', { required: 'BusinessIndustry is required' })}
        placeholder="Industry"
        error={errors.BusinessIndustry && errors.BusinessIndustry.message}
      />
      <Input
        {...register('BusinessWebsite')}
        placeholder="Website"
        error={errors.BusinessWebsite && errors.BusinessWebsite.message}
      />
      <textarea
        {...register('BusinessDescription')}
        rows={4}
        placeholder="Business description"
        className={`resize-none border ${errors.BusinessDescription ? 'border-red-500 ' : 'border-black-100 '} w-full rounded-md py-3 px-4 focus:border-black-400 outline-none mb-2`}
      />
      <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
        {`Maximum 250 words description`}
      </p>
      {errors.BusinessDescription && (
        <span className=" text-red-400 text-xs mt-2 m-1">
          {errors.BusinessDescription.message}
        </span>
      )}
    </FormLayout>
  );
};

export default BusinessDetails;
