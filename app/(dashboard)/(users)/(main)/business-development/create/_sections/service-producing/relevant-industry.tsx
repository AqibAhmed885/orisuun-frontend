import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import MultiChips from '@/components/ui/multi-chips';
import FormLayout from '@/components/ui/form-layout';
import { useFormContext } from 'react-hook-form';
import { BusinessOpportunitiesData } from '@/utils/schema';
import { servicesIndustriesData, GoodsIndustriesData } from '@/utils/constants';
import { toast } from 'react-toastify';
import { industryService } from '@/app/api/dashboard/businessDevelopment';

interface RelevantIndustryProps {
  setServiceStep: Dispatch<SetStateAction<number>>;
  setStep: Dispatch<SetStateAction<number>>;
  BdId?: any
}

const RelevantIndustry: React.FC<RelevantIndustryProps> = ({
  setStep,
  setServiceStep,
  BdId
}) => {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BusinessOpportunitiesData>();

  const LevelOneIndustry = watch('LevelOneIndustry');
  const [industries, setIndustries] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSelectIndustry = (industryName: string) => {
    setSelectedIndustries((prev) => {
      if (prev.includes(industryName)) {
        return prev.filter((name) => name !== industryName);
      } else if (prev.length < 3) {
        return [...prev, industryName];
      }
      return prev;
    });
  };

  useEffect(() => {
    setValue('IndustryList', selectedIndustries);
  }, [selectedIndustries]);

  const handleConfitnue = async () => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
    try {
      setLoading(true);

      const response = await industryService.saveBDIndustryList(
        {
          BdId,
          IndustryList: getIdsForSelectedIndustries(industries, selectedIndustries),
          IndustryType: LevelOneIndustry
        }
      );

      toast.success(response?.Message || 'Saved data successfully');
      setStep((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  function getIdsForSelectedIndustries(data, selectedIndustries) {
    return selectedIndustries.map(industry => {
      const industryObject = data.find(item => item.IndustryName === industry);
      return industryObject?.Id && industryObject?.Id
    });
  }

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await industryService.getIndustriesList();
        if (response?.Result) {
          setIndustries(response.Result);
        }
      } catch (error) {
        console.error('Error fetching industries:', error);
      }
    };

    fetchIndustries();
  }, []);


  return (
    <FormLayout
      title="Please select the relevant industry"
      description="Select up to 3 industries for this business development opportunity."
      position="start"
      handleBack={() => setServiceStep((prev) => prev - 1)}
      handleNext={() => handleConfitnue()}
      disableNext={loading}
    >
      {LevelOneIndustry === 'Goods-Producing Industries' &&
        GoodsIndustriesData.map((industry, index) => (
          <MultiChips
            key={index}
            industry={industry}
            onSelect={handleSelectIndustry}
            selectedIndustries={selectedIndustries}
            level={0}
            isFirst={index === 0}
          />
        ))}
      {LevelOneIndustry === 'Service-Producing Industries' &&
        servicesIndustriesData.map((industry, index) => (
          <MultiChips
            key={index}
            industry={industry}
            onSelect={handleSelectIndustry}
            selectedIndustries={selectedIndustries}
            level={0}
            isFirst={index === 0}
          />
        ))}
    </FormLayout>
  );
};

export default RelevantIndustry;
