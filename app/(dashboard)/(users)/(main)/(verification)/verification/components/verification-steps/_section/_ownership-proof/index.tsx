import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  checkUserVerificationStatus
} from '@/server-actions/verification';
import { useCallback, useEffect } from 'react';
import { RootState } from '@/data/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { VerificationOwnershipData, verificationOwnershipeSchema } from '@/utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { addUserVerificationData } from '@/data/slices/user-slice';
import ShareTransferLedger from './ShareTransferLedger';
import LatestTaxReturn from './LatestTaxReturn';
import AwardOrCertificate from './AwardOrCertificate';
import Certification from './Certification';
import AffiliationLetter from './AffiliationLetter';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const OwnershipProof: React.FC<IProps> = ({ step, setStep }) => {
  const [ownershipStep, setownershipStep] = useState(0);
  const dispatch = useDispatch()
  const { verificationData } = useSelector((state: RootState) => state.user);

  const methods = useForm<VerificationOwnershipData>({
    resolver: zodResolver(verificationOwnershipeSchema),
  });
  useEffect(() => {

    if (verificationData) {
      const updatedshareTransferLedger = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'shareTransferLedger'
      );
      const updatedlatestTaxReturn = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'latestTaxReturn'
      );
      const updatedcertification = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'certification'
      );
      const updatedAffiliationLetter = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'affiliationLetter'
      );
      const updatedAwardOrCertificate = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'awardOrCertificate'
      );

      methods.reset({
        shareTransferLedger: updatedshareTransferLedger || [],
        latestTaxReturn: updatedlatestTaxReturn || [],
        certification: updatedcertification || [],
        affiliationLetter: updatedAffiliationLetter || [],
        awardOrCertificate: updatedAwardOrCertificate || []
      })
      // setResume(updatedResume || []);
      // setProfileUrls(verificationData.PersionalIdentificationURL || '');
    }
  }, [ownershipStep, step, methods]);
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
  const getCurrentUserVerificationDetailsData = useCallback(async () => {
    try {
      if (currentUser.Id !== null) {
        const result = await checkUserVerificationStatus({
          Id: currentUser.Id,
        });
        if (result.success) {
          dispatch(addUserVerificationData(result.data.data.Result));
        } else {
          if (
            result.message &&
            result.message.toLowerCase().includes('this feature is not for')
          ) {
            toast.error(result.message);
          }
        }
      }
    } catch (error) {
      console.error(error, 'Error');
    }
  }, [ownershipStep]);
  useEffect(() => {
    if (currentUser) {
      getCurrentUserVerificationDetailsData();
    }
  }, [ownershipStep]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(data => console.log(data))}>
        {ownershipStep === 0 ? (
          <ShareTransferLedger
            ownershipStep={ownershipStep}
            setownershipStep={setownershipStep}
            step={step}
            setStep={setStep}
          />
        ) : null}
        {ownershipStep === 1 ? (
          <LatestTaxReturn
            ownershipStep={ownershipStep}
            setownershipStep={setownershipStep}
          />
        ) : null}
        {ownershipStep === 2 ? (
          <AwardOrCertificate
            ownershipStep={ownershipStep}
            setownershipStep={setownershipStep}
          />
        ) : null}
        {ownershipStep === 3 ? (
          <Certification
            ownershipStep={ownershipStep}
            setownershipStep={setownershipStep}
          />
        ) : null}
        {ownershipStep === 4 ? (
          <AffiliationLetter
            ownershipStep={ownershipStep}
            setownershipStep={setownershipStep}
            step={step}
            setStep={setStep}
          />
        ) : null}
      </form>
    </FormProvider>
  );
};

export default OwnershipProof;
