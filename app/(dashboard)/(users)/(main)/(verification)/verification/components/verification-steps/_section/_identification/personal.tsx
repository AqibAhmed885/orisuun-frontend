import Button from '@/components/ui/button';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { verfication } from '@/app/api/dashboard/verification';
import {
  GenerateUploadFileSasTokenForVerificationDocuments,
  addVerificationDocuments
} from '@/server-actions/verification';
import { useCallback, useEffect } from 'react';
import axios from 'axios';
import Dropzone from '@/components/ui/dropzone';

interface IProps {
  identificationStep: number;
  setIdentificationStep: Dispatch<SetStateAction<number>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  setPersonalDocuments: Dispatch<SetStateAction<any>>;
  personaldocuments: any
}

const Personal: React.FC<IProps> = ({
  identificationStep,
  setIdentificationStep,
  step,
  setStep,
  personaldocuments,
  setPersonalDocuments
}) => {
  const [sasToken, setSasToken] = useState('');

  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
  // const [documents, setDocuments] = useState([])
  const [loader, setLoader] = useState(false);
  const handleFileUpload = async (files: File[]) => {
    if (!files[0]) return;

    try {
      const fileData = await verfication.uploadPersonalDocument(files[0], sasToken);

      if (fileData) {
        const currentImages = personaldocuments || [];
        setPersonalDocuments([...currentImages, fileData]);
      }
    } catch (error) {
      console.error('Error uploading personal document:', error);
    }
  };

  const generateUploadFileSasTokenfunc = useCallback(async () => {
    try {
      // setIsLoading(true);
      const tokenResponse = await GenerateUploadFileSasTokenForVerificationDocuments();
      setSasToken(tokenResponse.token);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    generateUploadFileSasTokenfunc();
  }, [generateUploadFileSasTokenfunc]);
  const onSubmit = async () => {
    setLoader(true)
    try {

      // Prepare the request data to add verification documents
      const requestData = {
        UserId: currentUser?.Id,
        UserVerificationId: currentUser?.UserVerificationId,
        DocumentType: 'PhotoIdentification',
        DocumentListsModel: personaldocuments
      };

      // addVerificationDocuments
      if (personaldocuments.length > 0) {


        const result: any = await addVerificationDocuments(requestData);

        if (result.success) {
          setIdentificationStep(identificationStep + 1)
          setTimeout(() => {
            setLoader(false)
          }, 1000)
        }
      }
      else {
        setIdentificationStep(identificationStep + 1)
      }
    } catch (error) {
      console.error('Axios error:', error);
      setLoader(false)
      return {
        success: false,
        message: 'An Error Occurred',
      };
    }
  }


  return (
    <div className="grid grid-cols-8 gap-5 p-4 md:p-6 lg:min-h-[90vh]">
      <div className="my-4 col-span-8 lg:col-span-4 md:mx-4 md:my-11">
        <h1 className="mb-6 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
          Personal Identification
        </h1>
        <p className="mb-6 font-medium text-blue-400 text-h7 2xl:text-scaled-h7">
          (for each owner, if verification is for a business)
        </p>
        <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A]">
          Please upload your documents
        </p>
      </div>
      <div className="flex flex-col my-4 col-span-8 lg:col-span-4 lg:col-start-5 md:mx-4 md:my-11">
        <div className="flex-grow">
          <div className="flex flex-col w-full py-6 rounded-lg gap-4 lg:px-6">
            <div className="flex flex-col">
              <h5 className="mb-4 font-semibold text-blue-500 text-h5 2xl:text-scaled-h5">
                Photo Identification
              </h5>
              <Dropzone onFilesUpload={handleFileUpload} storedFile={personaldocuments || []} acceptedFileTypes={"pdf"} setValue={setPersonalDocuments} />
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse mt-auto md:mx-4 md:ml-auto md:flex-row">
          <Button
            className={
              'text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold px-4 py-3 me-3 justify-center md:justify-end mb-2'
            }
            title="Back"
            onClick={() => setStep(step - 1)}
          />
          <Button
            className="min-w-full mb-2 btn-secondary text-h9 2xl:text-scaled-h9 ms-1 md:min-w-[170px] w-full text-white"
            title="Continue"
            disabled={loader}
            onClick={() => { onSubmit() }}
          />
        </div>
      </div>
    </div>
  );
};

export default Personal;
