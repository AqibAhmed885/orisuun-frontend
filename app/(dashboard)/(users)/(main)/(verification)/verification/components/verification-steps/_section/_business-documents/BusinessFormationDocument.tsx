import Button from '@/components/ui/button';
import React, { Dispatch, SetStateAction, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Dropzone from '@/components/ui/dropzone';
import { VerificationBusinessData } from '@/utils/schema';
import { useFormContext } from 'react-hook-form';
import { verfication } from '../../../../../../../../../api/dashboard/verification';
interface IProps {
  businessDocumentStep: number;
  setBusinessDocumentStep: Dispatch<SetStateAction<number>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const BusinessFormationDocument: React.FC<IProps> = ({
  businessDocumentStep,
  setBusinessDocumentStep,
  step,
  setStep,
}) => {
  const { setValue, watch } = useFormContext<VerificationBusinessData>();
  const [sasToken, setSasToken] = useState('');
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));
  const [loader, setLoader] = useState(false);
  const businessData = watch('businessFormationDocument');

  const handleFileUpload = async (files: File[]) => {
    if (!files[0]) return;
    const file = files[0];
    const fileExtension = file.name.split('.').pop();
    const randomName = `${uuidv4()}.${fileExtension}`;
    const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

    try {
      const res = await verfication.uploadFile(blobUrl, file);

      if (res.status === 201) {
        const url = res?.config?.url?.split('??')[0];
        const fileName = url.split('/').pop().split('?')[0];
        const fileData = {
          DocumentOriginalName: file.name,
          DocumentName: fileName,
          FileSize: file.size,
        };

        const currentData = businessData || [];
        setValue('businessFormationDocument', [...currentData, fileData]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const generateUploadFileSasTokenfunc = useCallback(async () => {
    try {
      const tokenResponse = await verfication.generateUploadFileSasToken();
      setSasToken(tokenResponse.token);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    generateUploadFileSasTokenfunc();
  }, [generateUploadFileSasTokenfunc]);

  const onSubmit = async () => {
    setLoader(true);
    try {
      const requestData = {
        UserId: currentUser?.Id,
        UserVerificationId: currentUser?.UserVerificationId,
        DocumentType: 'bussinessFormation',
        DocumentListsModel: businessData || [],
      };

      if (businessData.length > 0) {
        const result = await verfication.addVerificationDocuments(requestData);

        if (result.success) {
          setBusinessDocumentStep(businessDocumentStep + 1);
          setTimeout(() => {
            setLoader(false);
          }, 1000);
        }
      } else {
        setBusinessDocumentStep(businessDocumentStep + 1);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoader(false);
    }
  };

  return (
    <div className="grid grid-cols-8 gap-5 p-4 md:p-6 lg:min-h-[90vh]">
      <div className="my-4 col-span-8 lg:col-span-4 md:mx-4 md:my-11">
        <h1 className="mb-6 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
          Business Documents
        </h1>
        <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A]">
          Please upload your documents
        </p>
      </div>
      <div className="flex flex-col my-4 col-span-8 lg:col-span-4 lg:col-start-5 md:mx-4 md:my-11">
        <div className="flex-grow">
          <div className="flex flex-col w-full py-6 rounded-lg gap-4 lg:px-6">
            <div className="flex flex-col">
              <h5 className="mb-4 font-semibold text-blue-500 text-h5 2xl:text-scaled-h5">
                Business formation documents (eg, articles of incorporation)
              </h5>
              <Dropzone
                onFilesUpload={handleFileUpload}
                storedFile={businessData || []}
                acceptedFileTypes={'pdf'}
                setValue={setValue}
                valueKey="businessFormationDocument"
              />
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
            onClick={() => {
              onSubmit();
            }}
            disabled={loader}
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessFormationDocument;
