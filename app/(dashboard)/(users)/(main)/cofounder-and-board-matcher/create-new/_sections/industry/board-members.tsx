import React, { Dispatch, SetStateAction, useState } from 'react';
import FormLayout from '@/components/ui/form-layout';
import { useFormContext } from 'react-hook-form';
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
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

const SelectIndustry: React.FC<IProps> = ({ step, setStep, BdId, setServiceStep, setBdId }) => {
  const { setValue, watch } = useFormContext<CreateBusinessMemberOpportunityData>();
  const selectedMatchType = watch('MatchType');
  const currentBusinessType = watch('BusinessType'); // 'SeekingBoardMember' | 'OpenBoardMember'
  const teamData = useSelector((state: RootState) => state.user.teamData);
  const [loading, setLoading] = useState(false);

  const handleSelect = (matchType: number, bdType: 'SeekingBoardMember' | 'OpenBoardMember') => {
    setValue('MatchType', 1002);
    setValue('BusinessType', bdType);
  };

  const handleContinue = async () => {

    if (!currentBusinessType) return;
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData') || 'null');
      // use BusinessType (not MatchType) to decide BDType
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
      description="Choose the type of Board Member opportunity you're creating."
      position="start"
      handleNext={handleContinue}
      handleBack={() => setServiceStep((prev) => prev - 1)}
      disableNext={loading}
    >
      <div className="space-y-4 tracking-wide">
        <button
          type="button"
          onClick={() => handleSelect(1002, 'SeekingBoardMember')}
          className={`w-full border rounded-lg p-6 text-left ${currentBusinessType === 'SeekingBoardMember' ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
            : 'border-[#D2D4DA]'
          }`} // <-- Highlight selected
        >
          <h3 className="font-semibold ">Seeking a Board Member</h3>
          <p className="text-sm font-medium text-gray-600">I&apos;m looking for someone to join my board.</p>
        </button>
        <button
          type="button"
          onClick={() => handleSelect(1002, 'OpenBoardMember')}
          className={`w-full p-6 border  rounded-lg text-left  ${currentBusinessType === 'OpenBoardMember' ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
            : 'border-[#D2D4DA]'
          }`} // <-- Highlight selected
        >
          <h3 className="font-semibold">Open to Being a Board Member</h3>
          <p className="text-sm font-medium text-gray-600">I&apos;m interested in joining a board as a Board Member.</p>
        </button>
      </div>
    </FormLayout>
  );
};

export default SelectIndustry;