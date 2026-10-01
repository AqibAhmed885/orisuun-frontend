import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import MultiChips from '@/components/ui/multi-chips';
import FormLayout from '@/components/ui/form-layout';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema'; // Update import
import { GoodsIndustriesData, servicesIndustriesData } from '@/utils/constants'; // Add import for constants
import { toast } from 'react-toastify'; // Add for notifications
import { industryService } from '@/app/api/dashboard/businessDevelopment'; // Add for API

interface RelevantIndustryProps {
  setStep: Dispatch<SetStateAction<number>>; // Remove setServiceStep and BdId
  setServiceStep?: Dispatch<SetStateAction<number>>;
  BdId?: string; // Add BdId prop if needed for save
}

const RelevantIndustry: React.FC<RelevantIndustryProps> = ({ setStep, setServiceStep, BdId }) => { // Add BdId prop if needed for save
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]); // Array of names
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateBusinessMemberOpportunityData>();

  const LevelOneIndustry = watch('LevelOneIndustry'); // Watch the selected type
  const [industries, setIndustries] = useState([]); // Not needed if using constants
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
    setValue('IndustryList', selectedIndustries); // Store array of names
    setValue('BusinessIndustry', LevelOneIndustry);
  }, [selectedIndustries]);

  const handleContinue = async () => {
    if (selectedIndustries.length > 0) {
      try {
        setLoading(true);
        const response = await industryService.saveBDIndustryList({
          BdId, // Pass BdId if available
          IndustryList: getIdsForSelectedIndustries(industries, selectedIndustries), // Now an array of IDs (number[])
          IndustryType: LevelOneIndustry,
        });
        toast.success(response?.Message || 'Saved successfully');
        setStep((prev) => prev + 1);
      } catch (error) {
        toast.error(error?.response?.data?.Message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
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
      description="Select up to 3 industries for this opportunity."
      position="start"
      handleBack={() => setServiceStep((prev) => prev - 1)}
      handleNext={handleContinue}
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
            isFirst={false}
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
            isFirst={false}
          />
        ))}
    </FormLayout>
  );
};

export default RelevantIndustry;
