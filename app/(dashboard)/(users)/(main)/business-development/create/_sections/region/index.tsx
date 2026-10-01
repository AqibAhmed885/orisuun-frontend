import React, { Dispatch, SetStateAction, useState } from 'react';
import Continents from './continents';
import Countries from './countries';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  setBdId?: any
  BdId?: any
}


const Region: React.FC<IProps> = ({ step, setStep, BdId }) => {
  const [serviceStep, setServiceStep] = useState(0);
  const [locationsData, setLocationsData] = useState([])


  return (
    <>
      {serviceStep === 0 ? (
        <Continents setServiceStep={setServiceStep} setStep={setStep} BdId={BdId} setLocationsData={setLocationsData} />
      ) : null}
      {serviceStep === 1 ? (
        <Countries BdId={BdId} setServiceStep={setServiceStep} setStep={setStep} locationsData={locationsData} />
      ) : null}
    </>
  );
};

export default Region;
