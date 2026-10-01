import React, { Dispatch, SetStateAction, useState } from 'react';
import RelevantIndustry from './relevent-indusry';
import BoardMembers from './board-members'; // Import board member component
import StepZero from '../step-zero';
import { useFormContext } from 'react-hook-form'; // Import useFormContext
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
import Cofounder from './co-founder';
import SelectIndustry from './select-industry'; // Add import


interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  BdId?: any;
  setBdId?: any;
}

const Industry: React.FC<IProps> = ({ step, setStep, BdId, setBdId }) => {
  const [serviceStep, setServiceStep] = useState(0);
  const { watch } = useFormContext<CreateBusinessMemberOpportunityData>();
  const matchType = watch('MatchType');

  return (
    <>
      {serviceStep === 0 ? (
        <StepZero step={step} setServiceStep={setServiceStep} setStep={setStep} />
      ) : null}
      {serviceStep === 1 ? (
        matchType === 2  ? ( // For Co-Founder types
          <Cofounder step={step} setServiceStep={setServiceStep} setStep={setStep} setBdId={setBdId} />
        ) : ( // For Board Member types
            <BoardMembers step={step} setServiceStep={setServiceStep} setStep={setStep} setBdId={setBdId} />
        )
      ) : null}
      {serviceStep === 2 ? (
        <SelectIndustry setServiceStep={setServiceStep} setStep={setStep} />
      ) : null}
      {serviceStep === 3 ? (
        <RelevantIndustry setServiceStep={setServiceStep} setStep={setStep} BdId={BdId} />
      ) : null}
    </>
  );
};

export default Industry;
