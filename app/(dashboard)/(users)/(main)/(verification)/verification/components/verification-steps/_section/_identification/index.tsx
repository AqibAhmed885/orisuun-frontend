import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Personal from './personal';
import Resume from './resume';
import PersonalURLs from './PersonalUrls';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const Identification: React.FC<IProps> = ({ step, setStep }) => {
  const [identificationStep, setIdentificationStep] = useState(0);
  const [personaldocuments, setPersonalDocuments] = useState([]);
  const [resume, setResume] = useState([]);
  const [profileUrls, setProfileUrls] = useState('');
  const { currentUser, verificationData } = useSelector(
    (state: RootState) => state.user
  );
  useEffect(() => {
    if (verificationData) {
      const updatedPersonalDocuments = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'PhotoIdentification'
      );
      setPersonalDocuments(updatedPersonalDocuments || []);
      const updatedResume = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'Resume/Cv'
      );
      setResume(updatedResume || []);
      setProfileUrls(verificationData?.PersionalIdentificationURL || '');
    }
  }, [verificationData,step]);
  return (
    <>
      {identificationStep === 0 ? (
        <Personal
          identificationStep={identificationStep}
          setIdentificationStep={setIdentificationStep}
          step={step}
          setStep={setStep}
          setPersonalDocuments={setPersonalDocuments}
          personaldocuments={personaldocuments}
        />
      ) : null}
      {identificationStep === 1 ? (
        <Resume
          identificationStep={identificationStep}
          setIdentificationStep={setIdentificationStep}
          setResume={setResume}
          resume={resume}
        />
      ) : null}
      {identificationStep === 2 ? (
        <PersonalURLs
          identificationStep={identificationStep}
          setIdentificationStep={setIdentificationStep}
          step={step}
          setStep={setStep}
          setProfileUrls={setProfileUrls}
          profileUrls={profileUrls}
        />
      ) : null}
    </>
  );
};

export default Identification;
