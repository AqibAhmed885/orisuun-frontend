import FormLayout from '@/components/ui/form-layout';
import Bag from '@/icons/business-development/bag';
import Profile from '@/icons/business-development/profile';
import { BusinessOpportunitiesData } from '@/utils/schema';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface IProps {
  setServiceStep: Dispatch<SetStateAction<number>>;
  setStep: Dispatch<SetStateAction<number>>;
  BdId?: any
}

const SelectIndustry: React.FC<IProps> = ({ setServiceStep }) => {
  const {
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useFormContext<BusinessOpportunitiesData>();
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    try {
      setLoading(true)
      const LevelOneIndustryValid = await trigger('LevelOneIndustry');

      if (LevelOneIndustryValid) {
        setServiceStep((prev) => prev + 1);
        setLoading(false)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  return (
    <FormLayout
      title="Please select the relevant industry"
      description="Select up to 3 industries for this business development opportunity."
      handleBack={() => setServiceStep((prev) => prev - 1)}
      handleNext={() => handleContinue()}
      position="start"
      disableNext={loading}
    >
      <button
        className={`w-full border rounded-lg p-6 space-y-4 ${watch('LevelOneIndustry') === 'Goods-Producing Industries'
          ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
          : 'border-[#D2D4DA]'
          }`}
        onClick={() =>
          setValue('LevelOneIndustry', 'Goods-Producing Industries')
        }
        type="button"
      >
        <Bag className="text-omblue-500" />
        <h5 className="text-h5 2xl:text-scaled-h5 text-left font-semibold text-black-400">
          Goods-Producing Industries
        </h5>
      </button>
      <button
        className={`w-full border rounded-lg p-6 space-y-4 ${watch('LevelOneIndustry') === 'Service-Producing Industries'
          ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
          : 'border-[#D2D4DA]'
          }`}
        onClick={() =>
          setValue('LevelOneIndustry', 'Service-Producing Industries')
        }
        type="button"
      >
        <Profile className="text-omblue-500" />
        <h5 className="text-h5 2xl:text-scaled-h5 text-left font-semibold text-black-400">
          Service-Producing Industries
        </h5>
      </button>
      {errors?.LevelOneIndustry && (
        <p className="text-red-500">{errors?.LevelOneIndustry?.message}</p>
      )}
    </FormLayout>
  );
};

export default SelectIndustry;
