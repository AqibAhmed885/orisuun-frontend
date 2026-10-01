'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomSelect from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Button } from '@headlessui/react';
// import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import Loader from '@/components/ui/loader';
import UploadedFile from '@/components/ui/uploaded-file';
import Image from 'next/image';
import { CloseIcon } from 'yet-another-react-lightbox';
import { toast } from 'react-toastify';
import Tooltip from '@/components/ui/tooltip';

// Define the zod schema
const formSchema = z.object({
  PurposeOfFunds: z
    .string({ required_error: 'Purpose of funds is required' })
    .min(1, 'Purpose of funds is required'),
  Amount: z
    .string({ required_error: 'Amount is required' })
    .min(1, 'Amount is required'),
  CampaignLength: z
    .string({ required_error: 'Campaign length is required' })
    .min(1, 'Campaign length is required'),
  CampaignDescription: z
    .string({ required_error: 'Campaign description is required' })
    .min(1, 'Campaign description is required'),
});

const ProfileVerification = () => {
  const {
    register,
    setValue,
    trigger,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema), // Use zodResolver here
  });

  const [showForm, setShowForm] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selected, setSelected] = useState('Credit Card');
  const [verificationDetails, setVerificationDetails] = useState([]);
  const [verificationData, setVerificationData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const customPath =
    'https://orisuundocumentsdev.blob.core.windows.net/profile-verification';
  useEffect(() => {
    const fetchverificationDetails = async () => {
      try {
        const response = await axios.get(
          `${apiEndpoint}/UserVerification/GetVerificationPendingDocumentList`,
          {
            headers: {
              XApiKey: currentUser?.Token,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          setVerificationDetails(response.data.Result.pendingVerificationList);
          setLoader(false);
        }
      } catch (error) {
        console.error('Error fetching verificationDetails:', error);
        setLoader(false);
      }
    };

    fetchverificationDetails();
  }, []);
  const onSubmit = async (status, id) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/UserVerification/UpdateVerificationPendingDocument`,
        {
          UserId: currentUser?.Id,
          Status: status,
          Id: id,
        },
        {
          headers: {
            XApiKey: currentUser?.Token,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.Message);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };
  return loader ? (
    <Loader />
  ) : (
    <div className="p-6 tracking-wide">
      <div className="bg-white rounded-lg shadow-md py-5">
        <div className="flex justify-between items-center mb-4 pe-5">
          <h2 className="text-xl font-semibold text-[#0B1636] flex items-center gap-3">
            <div className="h-12 w-[8px] rounded-r-lg bg-[#0B1636]"></div>
            <span>Verification Profile</span>
          </h2>
        </div>

        <div className="overflow-auto px-5 min-h-[calc(100vh-150px)]">
          {verificationDetails.length > 0 ? (
            <table className="min-w-[500px] w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                    Company Name
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                    Action
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {verificationDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-2 py-3 text-sm text-gray-800 border-t">
                      {detail?.UserDetails?.FirstName + " " + detail?.UserDetails?.LastName}
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-800 border-t">
                      {detail?.CompanyDetails?.CompanyName || ''}
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-800 border-t">
                      <div className="flex items-center gap-3">

                        <Tooltip content={"Approve"}>
                          <Button
                            className="bg-omblue-50 p-3 text-white w-[40px] h-[40px] rounded-full flex items-center justify-center"
                            onClick={() => onSubmit('Verified', detail.Id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 512 512"
                            >
                              <g>
                                <path
                                  d="M504.502 75.496c-9.997-9.998-26.205-9.998-36.204 0L161.594 382.203 43.702 264.311c-9.997-9.998-26.205-9.997-36.204 0-9.998 9.997-9.998 26.205 0 36.203l135.994 135.992c9.994 9.997 26.214 9.99 36.204 0L504.502 111.7c9.998-9.997 9.997-26.206 0-36.204z"
                                  fill="#2357c6"
                                  opacity="1"
                                  data-original="#2357c6"
                                ></path>
                              </g>
                            </svg>
                          </Button>
                        </Tooltip>

                        <Tooltip content={"Reject"}>
                          <Button
                            className="bg-red-100 p-3 text-white w-[40px] h-[40px] rounded-full flex items-center justify-center"
                            //   onClick={() => {
                            //     setShowForm(false);

                            //   }}
                            onClick={() => {
                              onSubmit('Reject', detail.Id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              width="16"
                              height="16"
                              x="0"
                              y="0"
                              viewBox="0 0 329.269 329"
                            >
                              <g>
                                <path
                                  d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.266 21.266 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.273 21.273 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0"
                                  fill="#ef4444"
                                  opacity="1"
                                  data-original="#ef4444"
                                ></path>
                              </g>
                            </svg>
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-800 border-t">
                      <Button
                        className="h-[40px] bg-omblue-500 text-white rounded-md px-4"
                        onClick={() => {
                          setVerificationData(detail);
                          setIsOpen(true);
                        }}
                      >
                        Show Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No VerificationProfile available</p>
          )}
        </div>
        <div
          className={`fixed top-0 right-0 h-screen max-w-[450px] bg-white rounded-l-sm z-[99]  shadow-2xl overflow-y-auto transition-[0.2s] p-4 ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between w-full mb-6 px-3 pb-3 border-b">
            <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
              Vefification Documents
            </p>
            <span className="inline-block" onClick={() => setIsOpen(false)}>
              {' '}
              <CloseIcon />
            </span>
          </div>
          {verificationData && (
            <>
              <div className="flex flex-col items-start justify-center max-w-[465px] mx-auto px-4 gap-10">
                <div className="block w-full">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h5 className="font-semibold text-blue-500 text-h5 2xl:text-scaled-h5">
                      Online Presence
                    </h5>
                  </div>
                  {(!verificationData?.WebsiteUrl && ~verificationData?.FacebookUrl && !verificationData?.BlueSkyUrl && !verificationData?.LinkdinUrl && !verificationData?.InstagramUrl && !verificationData?.YoutubeUrl) ? <p> No urls found</p> : <div className="flex flex-col gap-3">
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
                              <a
                                href={`${customPath}/${data.DocumentName}`}
                                target="_blank"
                                key={index}
                              >
                                <UploadedFile file={data} readOnly={true} />
                              </a>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileVerification;