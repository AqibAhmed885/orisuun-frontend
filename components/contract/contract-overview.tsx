import React, { useCallback, useEffect, useState } from 'react';
import WorkDescription from '../ui/work-description';
import Attachments from '../ui/attachments';
import ProfileCard from '../cards/profile-card';
import { apiEndpoint, cn } from '@/utils/utils';
import Image from 'next/image';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { GenerateUploadFileSasTokenForVerificationDocuments } from '@/server-actions/verification';
import axios from 'axios';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
const messages = [
  { text: `Absolutely! I'd be happy to assist you.` },
  {
    text: `I see you're interested in market penetration in Southern California.`,
  },
  {
    text: `Exactly. I'm thinking we can adapt our product just a little for California taste, but I don't know what the approach should look like.`,
  },
  {
    text: `Of course. You're on the right track. I've done exactly what you're talking about a few times. Are you available for a video call?`,
  },
  { text: `Absolutely! How about at 4pm EST?` },
  { text: `Yes, that works. I'll send you an invite.` },
];

const ContractOverview = ({ admin = false, selectedSection = 0, data = null }) => {
  const handleFileSelect = (file: File) => {
  };
  const [sasToken, setSasToken] = useState('');

  // const [attachements, setAttachments] = useState([]);

  const handleFileUpload = async (file: File) => {
    // const handleFileUpload = async (files, sasToken, userId, userVerificationId, documentType) => {
    if (!file) return;

    // const file = files[0];
    const fileExtension = file.name.split('.').pop();
    const randomName = `${uuidv4()}.${fileExtension}`;
    const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

    const config = {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
    };

    try {
      // Upload the file to Azure Blob Storage
      const res = await axios.put(blobUrl, file, config);


      if (res.status === 201) {
        const url = res?.config?.url?.split('??')[0];

        const fileName = url.split('/').pop().split('?')[0];
        const fileSizeInBytes = file.size;
        const fileData = {
          DocumentType: file.type,
          FileName: file.name,
          StoredFileName: fileName,
          FileSize: fileSizeInBytes,
        };
        // 
        // 

        const currentData = [...data?.escrowContractDocuments, fileData];
        // 

        const response = await axios.post(
          `${apiEndpoint}/Escrow/AddContractDocumentsByContractId`,
          {
            EscrowContractDocumentsList: currentData,
            ContractId: data?.escrowContract?.Id,
            ContractCreatorId: data?.escrowContract?.ContractCreatorId,
          },
          {
            headers: {
              XApiKey:
                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            },
          }
        );
        // if (response.status === 200) {
        //   setAttachments([...currentData, fileData]);
        // }
      }
    } catch (error) {
      console.error(
        'Error uploading file or adding verification document:',
        error
      );
    }
  };
  const generateUploadFileSasTokenfunc = useCallback(async () => {
    try {
      // setIsLoading(true);
      const tokenResponse =
        await GenerateUploadFileSasTokenForVerificationDocuments();
      setSasToken(tokenResponse.token);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    generateUploadFileSasTokenfunc();
  }, [generateUploadFileSasTokenfunc]);
  return (
    <>
      {selectedSection === 0 && (
        <>
          <WorkDescription
            title="Headline description of work"
            description={data?.escrowContract?.ContractDescription}
            amount={`$${data?.escrowContract?.ContractAmount}`}
            status={data?.escrowContract?.Status}
            expiryDate={moment(data?.escrowContract?.ExpiryDate).format(
              'DD MMM, YYYY'
            )}
          />
          <Attachments onFileSelect={handleFileUpload} contractDetails={data} />
        </>
      )}
      {selectedSection === 1 && (
        <div className="space-y-4 w-full pe-4">
          {data?.HistoryDetails?.map((message, index) => {
            return (
              <div
                className="flex items-center gap-4 text-black-500"
                key={index}
              >
                <Image
                  src={message?.ProfilePicture || BASE_URL}
                  alt="user"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
                <div
                  className={cn(
                    'p-3 rounded-md flex w-full items-start gap-2 justify-between',
                    index % 2 === 0 ? 'bg-olblue-50' : 'bg-grey-500'
                  )}
                >
                  <p className="w-[calc(100%-5rem)]">{message.Notes}</p>
                  <p
                    className={cn(
                      'w-20 text-end',
                      index % 2 === 0 ? 'text-olblue-500' : 'text-black-200'
                    )}
                  >
                    {moment(message.CreatedDateTime).format('DD/MM/YYYY hh:mm A')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ContractOverview;
