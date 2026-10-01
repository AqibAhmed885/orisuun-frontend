import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  checkUserVerificationStatus
} from '@/server-actions/verification';
import { useCallback, useEffect } from 'react';
import { RootState } from '@/data/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import BusinessFormationDocument from './BusinessFormationDocument';
import { VerificationBusinessData, verificationBusinesseSchema } from '@/utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import GoodStandingCertificate from './GoodStandingCertificate';
import ShareholderAgreement from './ShareholderAgreement';
import CompanyBylaws from './CompanyBylaws';
import { addUserVerificationData } from '@/data/slices/user-slice';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const BusinessDocuments: React.FC<IProps> = ({ step, setStep }) => {
  const [businessDocumentStep, setBusinessDocumentStep] = useState(0);
  const dispatch = useDispatch()
  const { verificationData } = useSelector((state: RootState) => state.user);

  const methods = useForm<VerificationBusinessData>({
    resolver: zodResolver(verificationBusinesseSchema),
  });
  useEffect(() => {

    if (verificationData) {
      const updatedBusinessDocuments = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'bussinessFormation'
      );
      const updatedCertificatesData = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'certificateOfGood'
      );
      const updatedAgreementsData = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'shareholder'
      );
      const updatedCompanyByLawsData = verificationData?.DocumentList?.filter(
        (data) => data.DocumentType === 'companyByLaws'
      );

      methods.reset({
        businessFormationDocument: updatedBusinessDocuments || [],
        certificates: updatedCertificatesData || [],
        agreements: updatedAgreementsData || [],
        companyByLaws: updatedCompanyByLawsData || []
      })

    }
  }, [businessDocumentStep, methods]);
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
  }, [businessDocumentStep]);
  useEffect(() => {
    if (currentUser) {
      getCurrentUserVerificationDetailsData();
    }
  }, [businessDocumentStep]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(data => console.log(data))}>
        {businessDocumentStep === 0 ? (
          <BusinessFormationDocument
            businessDocumentStep={businessDocumentStep}
            setBusinessDocumentStep={setBusinessDocumentStep}
            step={step}
            setStep={setStep}
          />
        ) : null}
        {businessDocumentStep === 1 ? (
          <GoodStandingCertificate
            businessDocumentStep={businessDocumentStep}
            setBusinessDocumentStep={setBusinessDocumentStep}
          />
        ) : null}
        {businessDocumentStep === 2 ? (
          <ShareholderAgreement
            businessDocumentStep={businessDocumentStep}
            setBusinessDocumentStep={setBusinessDocumentStep}
          />
        ) : null}
        {businessDocumentStep === 3 ? (
          <CompanyBylaws
            businessDocumentStep={businessDocumentStep}
            setBusinessDocumentStep={setBusinessDocumentStep}
            step={step}
            setStep={setStep}
          />
        ) : null}
      </form>
    </FormProvider>
  );
};

export default BusinessDocuments;
