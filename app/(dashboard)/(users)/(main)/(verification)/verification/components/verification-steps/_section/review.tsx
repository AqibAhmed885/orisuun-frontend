import PaymentVerification from '../../../../../../../(auth)/(account)/signup/components/PaymentVefification';
import Modal from '@/components/ui/modal/modal';
import Button from '@/components/ui/button';
import UploadedFile from '@/components/ui/uploaded-file';
import { RootState } from '@/data/store';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const Review: React.FC<IProps> = ({ step, setStep }) => {
  const { verificationData } = useSelector((state: RootState) => state.user);
  const sample = './sample.pdf';
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
  // const stripePromise = loadStripe(
  //   (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)
  // );
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex flex-col items-start justify-center max-w-[465px] mx-auto md:my-16 px-4 py-5 gap-10">
      <div className="flex flex-col items-start justify-center max-w-[465px] mx-auto px-4 gap-10">
        <div className="block w-full">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h5 className="font-semibold text-blue-500 text-h5 2xl:text-scaled-h5">
              Online Presence
            </h5>
          </div>
          {(!verificationData?.WebsiteUrl && !verificationData?.FacebookUrl && !verificationData?.BlueSkyUrl && !verificationData?.LinkdinUrl && !verificationData?.InstagramUrl && !verificationData?.YoutubeUrl) ? <p> No urls found</p> : <div className="flex flex-col gap-3">
            <p className="font-medium text-h6 2xl:text-scaled-h6">
              {verificationData?.WebsiteUrl || ''}
            </p>
            <p className="font-medium text-h6 2xl:text-scaled-h6">
              {verificationData?.FacebookUrl || ''}
            </p>
            <p className="font-medium text-h6 2xl:text-scaled-h6">
              {verificationData?.BlueSkyUrl || ''}
            </p>
            <p className="font-medium text-h6 2xl:text-scaled-h6">
              {verificationData?.LinkdinUrl || ''}
            </p>
            <p className="font-medium text-h6 2xl:text-scaled-h6">
              {verificationData?.InstagramUrl || ''}
            </p>
            <p className="font-medium text-h6 2xl:text-scaled-h6">
              {verificationData?.YoutubeUrl || ''}
            </p>
          </div>}
        </div>
        <div className="block w-full">
          <div className="flex items-center justify-between w-full gap-4 mb-6">
            <h5 className="font-semibold text-blue-500 text-h5 2xl:text-scaled-h5">
              Personal Identification (for Each Owner)
            </h5>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Id(s) photos
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'PhotoIdentification'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'PhotoIdentification' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Résumé/CV
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'Resume/Cv'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'Resume/Cv' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                LinkedIn
              </p>
              <p className="text-black-500">
                https://linkedin.com/pagename
              </p>
            </div>
          </div>
        </div>
        <div className="block w-full">
          <div className="flex items-center justify-between w-full gap-4 mb-6">
            <h5 className="font-semibold text-blue-500 text-h5 2xl:text-scaled-h5">
              Business formation documents
            </h5>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Business formation documents (eg, articles of
                incorporation)
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'bussinessFormation'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'bussinessFormation' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Certificate of good standing
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'certificateOfGood'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'certificateOfGood' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Any shareholder agreements
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'shareholder'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'shareholder' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Company Bylaws
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'companyByLaws'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'companyByLaws' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="block w-full">
          <div className="flex items-center justify-between w-full gap-4 mb-6">
            <h5 className="font-semibold text-blue-500 text-h5 2xl:text-scaled-h5">
              Proof of ownership
            </h5>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Current stock/share transfer ledger
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'shareTransferLedger'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'shareTransferLedger' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Latest tax return ownership schedule (eg, 1065 K-1, 1120
                G, 1065 C, 1040 C)
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'latestTaxReturn'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'latestTaxReturn' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Photos of awards, certificates, etc.
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'awardOrCertificate'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'awardOrCertificate' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Copies of certifications
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'certification'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'certification' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-3 font-semibold text-blue-500 text-h9 2xl:text-scaled-h9">
                Copies of letters expressing terms of affiliation
              </p>
              {verificationData.DocumentList &&
                verificationData.DocumentList.some(
                  (data) => data.DocumentType === 'affiliationLetter'
                ) ? (
                verificationData.DocumentList.map(
                  (data, index) =>
                    data.DocumentType === 'affiliationLetter' && (
                      <UploadedFile file={data} readOnly={true} key={index} />
                    )
                )
              ) : (
                <p className="text-gray-600">
                  No document found for this section
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="block w-full">
          <div className="flex items-center justify-between w-full gap-4 mb-6">
            <h5 className="font-semibold text-blue-500 text-h5 2xl:text-scaled-h5">
              Statement
            </h5>
          </div>
          <div className="mb-4">
            <p className="text-blue-400 text-h7 2xl:text-scaled-h7">
              {verificationData?.Statements || ''}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse w-full mt-auto md:mx-4 md:ml-auto md:flex-row">
        <Button
          className={
            'text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold w-full px-4 py-3 me-3 justify-end mb-2'
          }
          title="Back"
          onClick={() => setStep(step - 1)}
        />
        <Button
          className="min-w-full mb-2 btn-secondary text-h9 2xl:text-scaled-h9 ms-1 md:min-w-[170px] w-full text-white"
          title="Payment & Submit"
          onClick={() => setShowModal(true)}
        />
      </div>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title="Verification Fee Payment"
      >
        {/* {clientSecret && paymentIntentDetails && ( */}
        <Elements stripe={loadStripe((process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string))}>
          {/* <PaymentForm
              paymentClientSecret={clientSecret}
              paymentAmount={'$99'}
              paymentDuration={'One time'}
              paymentIntent={paymentIntent}
              paypalPlanID={paypalTransactionId}
              paymentType={'VerificationFee'}
            /> */}
          <PaymentVerification userData={currentUser} />
        </Elements>
        {/* )} */}
      </Modal>
    </div>
  );
};

export default Review;
