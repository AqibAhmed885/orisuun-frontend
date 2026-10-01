import Button from '@/components/ui/button';
import React, { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  GenerateUploadFileSasTokenForVerificationDocuments,
  addVerificationDocuments
} from '@/server-actions/verification';
import { useCallback, useEffect } from 'react';
import { verfication } from '@/app/api/dashboard/verification';
import { toast } from 'react-toastify';
import Dropzone from '@/components/ui/dropzone';

interface IProps {
  identificationStep: number;
  setIdentificationStep: Dispatch<SetStateAction<number>>;
  setResume: Dispatch<SetStateAction<any>>;
  resume: any;
}

const Resume: React.FC<IProps> = ({
  identificationStep,
  setIdentificationStep,
  setResume,
  resume
}) => {
  const [sasToken, setSasToken] = useState('');

  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
  const [loader, setLoader] = useState(false);
  const handleFileUpload = async (files: File[]) => {
    if (!files[0]) return;

    try {
      const fileData = await verfication.uploadResumeFile(files[0], sasToken);

      if (fileData) {
        setResume([fileData]);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
    }
  };

  const generateUploadFileSasTokenfunc = useCallback(async () => {
    try {
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
        DocumentType: 'Resume/Cv',
        DocumentListsModel: resume
      };
      if (resume.length > 0) {


        // addVerificationDocuments
        const result: any = await addVerificationDocuments(requestData);

        if (result.success) {
          setTimeout(() => {
            setLoader(false)
          }, 1000)
          toast.success(result.message);
          setIdentificationStep(identificationStep + 1)
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
          Résumé/CV
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
                Résumé/CV
              </h5>
              <Dropzone onFilesUpload={handleFileUpload} storedFile={resume || []} acceptedFileTypes={"pdf"} setValue={setResume} />
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse mt-auto md:mx-4 md:ml-auto md:flex-row">
          <Button
            className={
              'text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold px-4 py-3 me-3 justify-center md:justify-end mb-2'
            }
            title="Back"
            onClick={() => setIdentificationStep(identificationStep - 1)}
          />
          <Button
            className="min-w-full mb-2 btn-secondary text-h9 2xl:text-scaled-h9 ms-1 md:min-w-[170px] w-full text-white"
            title="Continue"
            onClick={() => { onSubmit() }}
            disabled={loader}
          />
        </div>
      </div>
    </div>
  );
};

export default Resume;
