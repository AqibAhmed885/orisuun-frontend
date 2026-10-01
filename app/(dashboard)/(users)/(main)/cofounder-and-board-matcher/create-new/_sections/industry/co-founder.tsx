import React, { Dispatch, SetStateAction, useState } from 'react';
import FormLayout from '@/components/ui/form-layout';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
import { set } from 'lodash';
import { businessOpportunityService } from '@/app/api/dashboard/businessDevelopment';
import { RootState } from '@/data/store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  BdId?: any
  setServiceStep?: any
  setBdId?: any
}

const Cofounder: React.FC<IProps> = ({ step, setStep, BdId, setServiceStep, setBdId }) => {
  const { setValue, watch } = useFormContext<CreateBusinessMemberOpportunityData>();
  // Keep MatchType fixed (2) and use BusinessType for the actual stored type
  const selectedType = watch('MatchType');
  const currentBusinessType = watch('BusinessType'); // 'SeekingCoFounder' | 'OpenCoFounder'

  const teamData = useSelector((state: RootState) => state.user.teamData);
  const [loading, setLoading] = useState(false);

  const handleSelect = (matchType: number, bdType: 'SeekingCoFounder' | 'OpenCoFounder') => {
    // keep MatchType fixed to 2 but store the selected business type
    setValue('MatchType', 2);
    setValue('BusinessType', bdType);
  };

  const handleContinue = async () => {
    // require business type to be selected
    if (!currentBusinessType) return;
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData') || 'null');
      const bdType = currentBusinessType;
      const response = await businessOpportunityService.saveUserBdType({
        BDType: bdType,
        BDId: 0,
        userId: teamData?.isActive ? teamData?.teamId : userData?.Id,
      });
      toast.success(response?.Message || 'Saved successfully');
      if (setBdId) setBdId(response?.Result?.Id);
      setServiceStep?.((prev: number) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.Message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout
      title="What are you looking for?"
      description="Choose the type of Co-Founder opportunity you're creating."
      position="start"
      handleNext={handleContinue}
      handleBack={() => setServiceStep((prev) => prev - 1)}
      disableNext={loading}
    >
      <div className="space-y-4 tracking-wide">
        <button
          type="button"
          onClick={() => handleSelect(2, 'SeekingCoFounder')}
          className={`w-full border rounded-lg p-6 text-left ${currentBusinessType === 'SeekingCoFounder' ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
            : 'border-[#D2D4DA]'
          }`} // <-- Highlight selected
        >
          <h3 className="font-semibold ">Seeking a Co-Founder</h3>
          <p className="text-sm font-medium text-gray-600">I&apos;m looking for someone to join my business.</p>
        </button>
        <button
          type="button"
          onClick={() => handleSelect(2, 'OpenCoFounder')}
          className={`w-full p-6 border rounded-lg text-left  ${currentBusinessType === 'OpenCoFounder' ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
            : 'border-[#D2D4DA]'
          }`} // <-- Highlight selected
        >
          <h3 className="font-semibold">Open to Being a Co-Founder</h3>
          <p className="text-sm font-medium text-gray-600">I&apos;m interested in joining a business as a Co-Founder.</p>
        </button>
      </div>
    </FormLayout>
  );
};

export default Cofounder;