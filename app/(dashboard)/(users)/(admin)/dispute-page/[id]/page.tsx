'use client';

import Breadcrumbs from '@/components/ui/breadcrumbs';
import ContractDetails from '@/components/contract/contract-details';
import ContractHeader from '@/components/contract/contract-header';
import ContractModals from '@/components/contract/contract-modals';
import ContractOverview from '@/components/contract/contract-overview';
import ProfileCard from '@/components/cards/profile-card';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import useOutsideClick from '@/hooks/useOutsideClick';
import DisputeIcon from '@/icons/dispute-icon';
import EditIcon from '@/icons/edit-icon';
import { cn } from '@/utils/utils';
import { useRef, useState } from 'react';
import { useCallback, useEffect } from 'react';
import {
  GenerateUploadFileSasTokenForVerificationDocuments
} from '@/server-actions/verification';
import { toast } from 'react-toastify';
import ContractBottom from '@/components/contract/contract-bottom';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { TypeIcons } from '@/utils/helper';
import { v4 as uuidv4 } from 'uuid';
import Loader from '@/components/ui/loader';
import WorkDescription from '@/components/ui/work-description';
import Attachments from '@/components/ui/attachments';
import { ContractDisputeService } from '@/app/api/dashboard/dispute-page';
import ContractAlert from '../components/ContractAlert';
import TabItem from '../components/TabItem';
import { tabs } from '../../../../../../data/dashboard/dispute-page'
import { BASE_URL } from '../../../../../../public/defaultProfile/defaultProfile'
const DisputeDetails = () => {
  const [sasToken, setSasToken] = useState('');
  const [loader, setLoader] = useState(true);
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showEndContract, setShowEndContract] = useState<boolean>(false);
  const [openSheetEndContract, setOpenSheetEndContract] = useState<boolean>(false);
  const [endContract, setEndContract] = useState<boolean>(false);
  const [confirmEndContract, setConfirmEndContract] = useState<boolean>(false);
  const [openSheetConfirmEndContract, setOpenSheetConfirmEndContract] = useState<boolean>(false);
  const [showDisputeContract, setShowDisputeContract] = useState<boolean>(false);
  const [showDisputeContractSheet, setShowDisputeContractSheet] = useState<boolean>(false);
  const [disputeContract, setDisputeContract] = useState<boolean>(false);
  const [showEditContract, setShowEditContract] = useState<boolean>(false);
  const [showEndDispute, setShowEndDispute] = useState<boolean>(false);
  const [showEndDisputeSheet, setShowEndDisputeSheet] = useState<boolean>(false);
  const [openSheetEditContract, setOpenSheetEditContract] = useState<boolean>(false);
  const [editContract, setEditContract] = useState<boolean>(false);
  const [confirmEditContract, setConfirmEditContract] = useState<boolean>(false);
  const [openSheetConfirmEditContract, setOpenSheetConfirmEditContract] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [showReviewSheet, setShowReviewSheet] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState(0);
  const [contractDetails, setContractDetails] = useState<any>([]);
  const [contractTerms, setContractTerms] = useState<any>({
    Description: '',
    Deadline: '',
    ExpiryDate: '',
  });
  const [ratingDetails, setRatingDetails] = useState({
    Quality: 0,
    Service: 0,
    Cost: 0,
    Willing: 0,
    Review: '',
  });
  const [disputeTerms, setDisputeTerms] = useState<any>({
    memberDescription: '',
    clientDescription: '',
    clientBudget: '',
    memberBudget: '',
    isCustomMember: false,
    isCustom: false,
  });
  const [disputeDetails, setDisputeDetails] = useState({
    Message: '',
  });

  const [Attachment, setAttachment] = useState([]);
  const { id } = useParams();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  useEffect(() => {
    (async () => {
      try {
        const res = await ContractDisputeService.getContractById(id, currentUser?.Id);
        if (res.status == 200) {
          setContractDetails(res.data?.Result);
          setContractTerms({
            Description: res.data?.Result?.escrowContract?.ContractDescription,
            ExpiryDate: new Date(res.data?.Result?.escrowContract?.ExpiryDate),
            Deadline: res.data?.Result?.escrowContract?.ProjectDuration,
          });
          setAttachment(res.data?.Result.escrowContractDocuments);
          setLoader(false);
        }
      } catch (error) {
        setLoader(false);
      }
    })();
  }, []);

  const onSubmit = async () => {
    const values = contractDetails?.escrowContract;
    const requestData = {
      ContractCreatorId: currentUser?.Id,
      ContractName: values?.ContractName,
      ContractDescription: contractTerms?.Description,
      ContractAmount: values?.ContractAmount,
      ExpiryDate: new Date(contractTerms.ExpiryDate),
      EscrowContractDocumentsList:
        contractDetails?.escrowContractDocuments || [],
      Terms: values?.Terms || '',
      CounterPartyId: values?.CounterPartyId,
      ProjectDuration: contractTerms?.Deadline,
      ContractId: values?.Id,
      Status: values?.Status,
      UserId: currentUser.Id,
    };
    try {
      const response = await ContractDisputeService.updateContractOffer(requestData);
      if (response.status === 200) {
        toast.success(response.data.Message);
        setContractDetails({
          ...contractDetails,
          escrowContract: response.data.Result,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error creating campaign:', error);
    }
  };

  const ReviewSubmit = async () => {
    const values = contractDetails?.escrowContract;
    const requestData = {
      ReviewerGiverId: currentUser?.Id,
      ContractId: values?.Id,
      ServiceRating: ratingDetails.Service,
      QualityRating: ratingDetails.Quality,
      CostRating: ratingDetails.Cost,
      WillingToReferRating: ratingDetails.Willing,
      ReviewText: ratingDetails.Review,
      ReviewedUserId:
        values.ContractCreatorId === currentUser.Id
          ? values.CounterPartyId
          : values.ContractCreatorId,
    };
    try {
      const response = await ContractDisputeService.submitContractReview(requestData);
      if (response.status === 200) {
        toast.success(response.data.Message);
        setContractDetails({
          ...contractDetails,
          IsReviewed: true,
          Reviews: response.data.Result,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error creating campaign:', error);
    }
  };

  const CreateDispute = async () => {
    const values = contractDetails?.escrowContract;
    const requestData = {
      FiledByUserId: currentUser?.Id,
      ContractId: values?.Id,
      DisputeReason: disputeDetails.Message,
      EscrowContractDocumentsList: Attachment,
      FiledAgainstUserId: values?.CounterPartyId
    };
    try {
      const response = await ContractDisputeService.createContractDispute(requestData);
      if (response.status === 200) {
        toast.success(response.data.Message);
        setContractDetails({
          ...contractDetails,
          escrowContract: {
            ...contractDetails.escrowContract,
            Status: 'Dispute'
          },
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error creating campaign:', error);
    }
  };

  const EndContract = async () => {
    const values = contractDetails?.escrowContract;
    const requestData = {
      ContractId: values?.Id,
      ContractCreatorId: values.ContractCreatorId || currentUser.Id,
    };
    try {
      const response = await ContractDisputeService.completeContract(requestData);
      if (response.status === 200) {
        toast.success(response.data.Message);
        setContractDetails({
          ...contractDetails,
          escrowContract: response.data.Result,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error creating campaign:', error);
    }
  };

  const EndDispute = async () => {
    const values =
      contractDetails?.DisputeDetails && contractDetails?.DisputeDetails[0];
    const requestData = {
      Id: values?.Id,
      ContractId: values?.ContractId,
      FiledByUserId: currentUser.Id,
      DisputeClientDescription: disputeTerms.clientDescription || '',
      DisputeFreelancerDescription: disputeTerms.memberDescription || '',
      DisputeClientAmount: disputeTerms.clientBudget || 0,
      DisputeFreelancerAmount: disputeTerms.memberBudget || 0,
    };
    try {
      const response = await ContractDisputeService.endDispute(requestData);
      if (response.status === 200) {
        toast.success(response.data.Message);
        setContractDetails({
          ...contractDetails,
          escrowContract: response.data.Result,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error creating campaign:', error);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files[0]) return;

    const file = files[0];
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
      const res = await ContractDisputeService.uploadFile(blobUrl, file);
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
        const currentData = Attachment || [];
        setAttachment([...currentData, fileData]);
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
  const handleChange = (field, value) => {
    setRatingDetails((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const isMobile = useMobileMediaQuery();
  const optionsRef = useRef(null);

  useOutsideClick(optionsRef, () => setOpenOptions(false));

  const contractOptions = [
    ...(contractDetails?.escrowContract?.Status !== 'Dispute' &&
      contractDetails?.escrowContract?.Status !== 'Draft' &&
      currentUser.UserProfileTypeId != 10
      ? [
        {
          icon: <DisputeIcon className="w-4 h-4" />,
          text: 'Dispute',
          onClick: () => setShowDisputeContract(true),
        },
      ]
      : []),
    ...(contractDetails?.escrowContract?.ContractCreatorId === currentUser.Id &&
      contractDetails?.escrowContract?.Status !== 'Completed'
      ? [
        {
          icon: <EditIcon className="w-4 h-4" />,
          text: 'Edit terms',
          onClick: () =>
            isMobile
              ? setOpenSheetEditContract(true)
              : setShowEditContract(true),
        },
      ]
      : []),
  ];
  if (loader) {
    return <Loader />;
  }
  return (
    <div className="p-6">
      <Breadcrumbs
        breadcrumbs={[
          {
            title: 'Dispute',
            url: '/dispute-page',
          },
          { title: 'Contract Page' },
        ]}
      />
      <div className="md:border border-grey-600 mt-8 rounded-tl-lg rounded-tr-lg md:shadow-[0px_3px_12px_0px_rgba(99,126,183,0.11),_0px_0px_10px_0px_rgba(131,148,185,0.04)]">
        {endContract && (
          <ContractAlert
            title="End Contract Initiated"
            description="The other part has decided to end this contract. Confirm to view details and take action to finalize the contract termination."
            buttonText="End Contract"
            onButtonClick={() => setConfirmEndContract(true)}
          />
        )}
        {disputeContract && (
          <ContractAlert
            title="Contract Dispute Initiated"
            description="The other party has disputed this contract. Confirm to view details and take action to resolve the dispute."
            buttonText="Submit Statement"
            onButtonClick={() =>
              isMobile
                ? setShowDisputeContractSheet(true)
                : setShowDisputeContract(true)
            }
          />
        )}
        {editContract && (
          <ContractAlert
            title="Edit Contract Initiated"
            description="The other party has proposed changes to this contract. Click the button on the right to view the details."
            buttonText="Submit Statement"
            onButtonClick={() =>
              isMobile
                ? setOpenSheetConfirmEditContract(true)
                : setConfirmEditContract(true)
            }
          />
        )}
        <div className="md:p-6">
          <div className="relative">
            <ContractHeader
              title={contractDetails?.escrowContract?.ContractName}
              endContract={
                contractDetails?.escrowContract?.ContractCreatorId ===
                currentUser.Id &&
                contractDetails?.escrowContract?.Status !== 'Completed' &&
                contractDetails?.escrowContract?.Status !== 'Dispute'
              }
              onOpenOptions={() => setOpenOptions(!openOptions)}
              onShowTerms={() => setShowTerms(true)}
              onShowEndContract={() => setShowEndContract(true)}
              onShowEndDispute={() => setShowEndDispute(true)}
              endDispute={
                currentUser.UserProfileTypeId == 10 &&
                contractDetails?.escrowContract?.Status === 'Dispute'
              }
              onOpenOptionsMobile={() => setOpenSheet(true)}
              showReview={
                contractDetails?.escrowContract?.Status === 'Completed' &&
                !contractDetails?.IsReviewed &&
                currentUser.UserProfileTypeId != 10
              }
              contractDetails={contractDetails}
              onShowReviews={() => setShowReview(true)}
            />
            <div
              className={cn(
                'absolute right-2 top-14 w-[160px] bg-white p-2 rounded-md border border-grey-600 shadow-[0px_0px_21px_0px_#0808080D]',
                openOptions ? 'block' : 'hidden'
              )}
              ref={optionsRef}
            >
              {contractOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 w-full text-black-200 px-4 py-3 cursor-pointer hover:text-omblue-500"
                  onClick={option.onClick}
                >
                  {option.icon}
                  <p className="text-h8 2xl:text-scaled-h8 font-medium">
                    {option.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <ContractDetails
            amount={`$${contractDetails?.escrowContract?.ContractAmount}`}
            expiryDate={moment(
              contractDetails?.escrowContract?.ExpiryDate
            ).format('DD MMM, YYYY')}
          />
          <div className="grid grid-cols-12 gap-4 mt-8 pt-8 border-t">
            <>
              <div
                className={cn(
                  'col-span-12 md:col-span-8',
                  selectedSection > 1 ? '' : 'md:border-e border-[#D2D4DA]'
                )}
              >
                <div className={cn('flex mb-6 mt-2 me-4 gap-5')}>
                  {tabs.map((tab) => (
                    <TabItem
                      key={tab.id}
                      label={tab.label}
                      isSelected={selectedSection === tab.id}
                      onClick={() => setSelectedSection(tab.id)}
                    />
                  ))}
                </div>
                <ContractOverview
                  selectedSection={selectedSection}
                  admin={true}
                  data={contractDetails}
                />
              </div>
              <div
                className={cn(
                  'col-span-12 md:col-span-4',
                  selectedSection < 2 ? '' : 'hidden'
                )}
              >
                <>
                  <h6 className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500 mb-4">
                    Member Details
                  </h6>
                  {contractDetails?.team?.length > 0 ? (
                    contractDetails?.team?.map((team, index) => (
                      <div className="my-4" key={index}>
                        <ProfileCard
                          image={
                            team?.ProfilePicture 
                          }
                          name={team.Name}
                          company={team.UserProfileType}
                          icon={TypeIcons[team.UserProfileType]}
                          isImage={false}
                          key={index}
                          profileId={team.UserProfileId}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 my-4">
                      No team members found.
                    </p>
                  )}
                  {contractDetails?.escrowContract?.ContractCreatorId !==
                    currentUser.Id && (
                      <>
                        <h6 className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500 mb-4 mt-8">
                          Client Details
                        </h6>
                        {!!contractDetails?.ClientDetails ? (
                          <div className="my-2">
                            <ProfileCard
                              image={
                                contractDetails?.ClientDetails?.ProfilePicture ||
                                BASE_URL
                              }
                              name={contractDetails?.ClientDetails.Name}
                              company={
                                contractDetails?.ClientDetails.UserProfileType
                              }
                              icon={
                                TypeIcons[
                                contractDetails?.ClientDetails.UserProfileType
                                ]
                              }
                              profileId={
                                contractDetails?.ClientDetails.UserProfileId
                              }
                              isImage={false}
                            />
                          </div>
                        ) : (
                          <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 my-4">
                            No Client found.
                          </p>
                        )}
                      </>
                    )}
                </>
              </div>
            </>
            <>
              <div
                className={cn(
                  'col-span-12 md:col-span-12',
                  selectedSection < 2 ? 'hidden' : ''
                )}
              >
                {contractDetails?.DisputeDetails?.length > 0 ? (
                  <div className="space-y-4">
                    {contractDetails?.DisputeDetails?.map((dispute, index) => (
                      <div key={index}>
                        <div className="mb-6">
                          <ProfileCard
                            image={
                              dispute?.DisputeFiledByUserProfiles[0] ||
                              BASE_URL
                            }
                            name={dispute?.DisputeFiledByUserName[0]}
                            company={dispute?.DisputeFiledByUserTypeName[0]}
                            icon={
                              TypeIcons[dispute?.DisputeFiledByUserTypeName[0]]
                            }
                            isImage={false}
                          />
                        </div>
                        <WorkDescription
                          title="Dispute Message"
                          description={dispute?.DisputeReason}
                        />
                        <Attachments
                          length={2}
                          contractDetails={dispute}
                          isDispute={true}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-h9 2xl:text-scaled-h9 font-medium to-black-500 mb-2">
                    No staements found.
                  </p>
                )}
              </div>
            </>
          </div>
        </div>
      </div>
      <ContractModals
        showTerms={showTerms}
        setShowTerms={setShowTerms}
        contractDetails={contractDetails}
        ReviewSubmit={ReviewSubmit}
        setContractTerms={setContractTerms}
        contractTerms={contractTerms}
        handleChange={handleChange}
        ratingDetails={ratingDetails}
        setDisputeDetails={setDisputeDetails}
        handleFileUpload={handleFileUpload}
        setAttachments={setAttachment}
        attachments={Attachment}
        CreateDispute={CreateDispute}
        EndContract={EndContract}
        showEndContract={showEndContract}
        onSubmit={onSubmit}
        setShowReview={setShowReview}
        showReview={showReview}
        setShowEndContract={setShowEndContract}
        endContract={endContract}
        setEndContract={setEndContract}
        confirmEndContract={confirmEndContract}
        setConfirmEndContract={setConfirmEndContract}
        disputeContract={disputeContract}
        showDisputeContract={showDisputeContract}
        setShowDisputeContract={setShowDisputeContract}
        setDisputeContract={setDisputeContract}
        showEditContract={showEditContract}
        setShowEditContract={setShowEditContract}
        editContract={editContract}
        setEditContract={setEditContract}
        confirmEditContract={confirmEditContract}
        setConfirmEditContract={setConfirmEditContract}
        setShowEndDispute={setShowEndDispute}
        showEndDispute={showEndDispute}
        setDisputeTerms={setDisputeTerms}
        disputeTerms={disputeTerms}
        EndDispute={EndDispute}
      />
      <ContractBottom
        openSheet={openSheet}
        setOpenSheet={setOpenSheet}
        setShowTerms={setShowTerms}
        contractDetails={contractDetails}
        openSheetEndContract={openSheetEndContract}
        setOpenSheetEndContract={setOpenSheetEndContract}
        setOpenSheetConfirmEndContract={setOpenSheetConfirmEndContract}
        openSheetConfirmEndContract={openSheetConfirmEndContract}
        endContract={endContract}
        setEndContract={setEndContract}
        showDisputeContractSheet={showDisputeContractSheet}
        setShowDisputeContractSheet={setShowDisputeContractSheet}
        disputeContract={disputeContract}
        setDisputeContract={setDisputeContract}
        editContract={editContract}
        setEditContract={setEditContract}
        openSheetEditContract={openSheetEditContract}
        setOpenSheetEditContract={setOpenSheetEditContract}
        openSheetConfirmEditContract={openSheetConfirmEditContract}
        setOpenSheetConfirmEditContract={setOpenSheetConfirmEditContract}
        setContractTerms={setContractTerms}
        contractTerms={contractTerms}
        setShowReviewSheet={setShowReviewSheet}
        showReviewSheet={showReviewSheet}
        handleChange={handleChange}
        ratingDetails={ratingDetails}
        ReviewSubmit={ReviewSubmit}
        setShowEndDisputeSheet={setShowEndDisputeSheet}
        showEndDisputeSheet={showEndDisputeSheet}
        setDisputeTerms={setDisputeTerms}
        disputeTerms={disputeTerms}
        EndDispute={EndDispute}
        handleFileUpload={handleFileUpload}
        setAttachments={setAttachment}
        attachments={Attachment}
      />
    </div>
  );
};

export default DisputeDetails;
