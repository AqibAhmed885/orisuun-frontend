import React, { Dispatch, SetStateAction, useState } from 'react';
import SelectIndustry from './select-industry';
import RelevantIndustry from './relevant-industry';

import StepZero from './step-zero';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  setBdId?: any;
  BdId?: any
}

const ServiceProducing: React.FC<IProps> = ({ step, setStep, setBdId, BdId }) => {
  const [serviceStep, setServiceStep] = useState(0);


  return (
    <>
      {serviceStep === 0 ? (
        <StepZero setBdId={setBdId} setServiceStep={setServiceStep} setStep={setStep} />
      ) : null}
      {serviceStep === 1 ? (
        <SelectIndustry BdId={BdId} setServiceStep={setServiceStep} setStep={setStep} />
      ) : null}
      {serviceStep === 2 ? (
        <RelevantIndustry BdId={BdId} setServiceStep={setServiceStep} setStep={setStep} />
      ) : null}
    </>
  );
};

export default ServiceProducing;
