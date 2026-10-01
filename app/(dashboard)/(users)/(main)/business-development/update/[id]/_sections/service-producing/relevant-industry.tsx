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
import { useParams } from 'next/navigation';
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
  const { id } = useParams()
  const LevelOneIndustry = watch('LevelOneIndustry');
  const [industries, setIndustries] = useState([])
  const [loading, setLoading] = useState(false);

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

  function getIdsForSelectedIndustries(data: any[], selectedIndustries: string[]): number[] {
    return selectedIndustries.map(industry => {
      const industryObject = data.find(item => item.IndustryName === industry);
      return industryObject?.Id || 0;
    }).filter(id => id !== 0);
  }

  const handleConfitnue = async () => {
    if (selectedIndustries.length === 0) {
      toast.error('Please select at least one industry');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        BdId: Array.isArray(id) ? id[0] : id,
        IndustryList: getIdsForSelectedIndustries(industries, selectedIndustries),
        IndustryType: LevelOneIndustry
      };
      
      const response = await industryService.saveBDIndustryList(payload);
      if (response?.Message) {
        toast.success(response.Message);
        setStep((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await industryService.getIndustriesList();
        if (response?.Result) {
          setIndustries(response.Result);
        }
      } catch (error) {
        console.error('Error fetching industries:', error);
      }
    })();
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
