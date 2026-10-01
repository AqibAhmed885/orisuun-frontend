'use client';

import Breadcrumbs from '@/components/ui/breadcrumbs';
import ContractDetails from '@/components/contract/contract-details';
import ContractHeader from '@/components/contract/contract-header';
import ContractModals from '@/components/contract/contract-modals';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import useOutsideClick from '@/hooks/useOutsideClick';
import DisputeIcon from '@/icons/dispute-icon';
import EditIcon from '@/icons/edit-icon';
import { cn } from '@/utils/utils';
import { useRef, useState } from 'react';
import { useCallback, useEffect } from 'react';
import {
  GenerateUploadFileSasTokenForVerificationDocuments,
} from '@/server-actions/verification';
import { toast } from 'react-toastify';
import ContractBottom from '@/components/contract/contract-bottom';
import axios from 'axios';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import OverViewTab from './components/OverviewTab';
import ReviewTab from './components/ReviewTab';
import Loader from '@/components/ui/loader';
import { TABS } from '../../../../../../data/dashboard/transactions-and-escrow'
import { ContractService } from '@/app/api/dashboard/transactions-and-escrow';

const Contract = () => {
  const [sasToken, setSasToken] = useState('');
  const [loader, setLoader] = useState(true);
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showEndContract, setShowEndContract] = useState<boolean>(false);
  const [openSheetEndContract, setOpenSheetEndContract] = useState<boolean>(false);
  const [isSubmitDispute, setIsSubmitDispute] = useState<boolean>(false);
  const [endContract, setEndContract] = useState<boolean>(false);
  const [confirmEndContract, setConfirmEndContract] = useState<boolean>(false);
  const [openSheetConfirmEndContract, setOpenSheetConfirmEndContract] = useState<boolean>(false);
  const [showDisputeContract, setShowDisputeContract] = useState<boolean>(false);
  const [showDisputeContractSheet, setShowDisputeContractSheet] = useState<boolean>(false);
  const [disputeContract, setDisputeContract] = useState<boolean>(false);
  const [showEditContract, setShowEditContract] = useState<boolean>(false);
  const [openSheetEditContract, setOpenSheetEditContract] = useState<boolean>(false);
  const [editContract, setEditContract] = useState<boolean>(false);
  const [confirmEditContract, setConfirmEditContract] = useState<boolean>(false);
  const [openSheetConfirmEditContract, setOpenSheetConfirmEditContract] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [showReviewSheet, setShowReviewSheet] = useState<boolean>(false);
  const [showFundReleases, setShowFundReleases] = useState<boolean>(false);
  const [showFundReleasesSheet, setShowFundReleasesSheet] = useState<boolean>(false);
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
  const [disputeDetails, setDisputeDetails] = useState({
    Message: '',
  });
  const renderTabContent = (selectedTab: string) => {
    switch (selectedTab) {
      case 'overview':
        return <OverViewTab contractDetails={contractDetails} />;
      case 'reviews':
        return <ReviewTab contractDetails={contractDetails} />;
      default:
        return null;
    }
  };
  const [Attachments, setAttachments] = useState([]);
  const [selectedTab, setSelectedTab] = useState(TABS[0].id);
  const { id } = useParams();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  useEffect(() => {
    (async () => {
      try {
        const res = await ContractService.getContractById(id, currentUser?.Id);
        if (res.status == 200) {
          setContractDetails(res.data?.Result);
          setContractTerms({
            Description: res.data?.Result?.escrowContract?.ContractDescription,
            ExpiryDate: new Date(res.data?.Result?.escrowContract?.ExpiryDate),
            Deadline: res.data?.Result?.escrowContract?.ProjectDuration,
          });
          setAttachments(res.data?.Result.escrowContractDocuments);
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
      EscrowContractDocumentsList: contractDetails?.escrowContractDocuments || [],
      Terms: values?.Terms || '',
      CounterPartyId: values?.CounterPartyId,
      ProjectDuration: contractTerms?.Deadline,
      ContractId: values?.Id,
      Status: values?.Status,
      UserId: currentUser.Id,
    };
    try {
      const response = await ContractService.updateContractOffer(requestData);
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
      const response = await ContractService.submitContractReview(
        contractDetails,
        ratingDetails,
        currentUser
      );
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
      console.error('Error submitting review:', error);
    }
  };

  const CreateDispute = async () => {
    const values = contractDetails?.escrowContract;
    try {
      const response = await ContractService.createContractDispute(
        contractDetails,
        disputeDetails,
        Attachments,
        currentUser
      );
      if (response.status === 200) {
        toast.success(response.data.Message);
        setContractDetails({
          ...contractDetails,
          escrowContract: response?.data?.Result,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error creating dispute:', error);
    }
  };

  const EndContract = async () => {
    try {
      const response = await ContractService.completeContract(
        contractDetails,
        currentUser
      );
      if (response.status === 200) {
        toast.success(response.data.Message);
        setContractDetails({
          ...contractDetails,
          escrowContract: response?.data?.Result,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error ending contract:', error);
    }
  };

  const ReleaseFund = async () => {
    try {
      const response = await ContractService.releaseContractFunds(
        contractDetails,
        currentUser
      );
      if (response.status === 200) {
        toast.success(response.data.Message);
        setContractDetails({
          ...contractDetails,
          escrowContract: response.data.Result,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error releasing funds:', error);
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

        const currentData = Attachments || [];

        setAttachments([...currentData, fileData]);
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
            title: 'Transactions & Escrow',
            url: '/transactions-and-escrow',
          },
          { title: 'Contract Page' },
        ]}
      />
      <div className="md:border border-grey-600 mt-8 rounded-tl-lg rounded-tr-lg md:shadow-[0px_3px_12px_0px_rgba(99,126,183,0.11),_0px_0px_10px_0px_rgba(131,148,185,0.04)]">
        {endContract && (
          <div className="mb-8 md:mb-0 px-6 py-4 bg-warning-75 rounded-tl-lg rounded-tr-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h6 className="text-h6 2xl:text-scaled-h6 text-warning-700 font-semibold mb-1">
                End Contract Initiated
              </h6>
              <p className="text-h7 2xl:text-scaled-h7 text-warning-800 font-medium mb-1">
                The other part has decided to end this contract. Confirm to view
                details and take action to finalize the contract termination.
              </p>
            </div>
            <div>
              <button
                onClick={() => setConfirmEndContract(true)}
                className="bg-blue-500 py-3 px-6 rounded-md text-h9 2xl:text-scaled-h9 font-semibold text-white"
              >
                End Contract
              </button>
            </div>
          </div>
        )}
        {disputeContract && (
          <div className="mb-8 md:mb-0 px-6 py-4 bg-warning-75 rounded-tl-lg rounded-tr-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h6 className="text-h6 2xl:text-scaled-h6 text-warning-700 font-semibold mb-1">
                Contract Dispute Initiated
              </h6>
              <p className="text-h7 2xl:text-scaled-h7 text-warning-800 font-medium mb-1">
                The other party has disputed this contract. Confirm to view
                details and take action to resolve the dispute.
              </p>
            </div>
            <div>
              <button
                onClick={() => {
                  setIsSubmitDispute(true);
                  isMobile
                    ? setShowDisputeContractSheet(true)
                    : setShowDisputeContract(true);
                }}
                className="bg-blue-500 py-3 px-6 rounded-md text-h9 2xl:text-scaled-h9 font-semibold text-white"
              >
                Submit Statement
              </button>
            </div>
          </div>
        )}
        {editContract && (
          <div className="mb-8 md:mb-0 px-6 py-4 bg-warning-75 rounded-tl-lg rounded-tr-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h6 className="text-h6 2xl:text-scaled-h6 text-warning-700 font-semibold mb-1">
                Edit Contract Initiated
              </h6>
              <p className="text-h7 2xl:text-scaled-h7 text-warning-800 font-medium mb-1">
                The other party has proposed changes to this contract. Click the
                button on the right to view the details.
              </p>
            </div>
            <div>
              <button
                onClick={() =>
                  isMobile
                    ? setOpenSheetConfirmEditContract(true)
                    : setConfirmEditContract(true)
                }
                className="bg-blue-500 py-3 px-6 rounded-md text-h9 2xl:text-scaled-h9 font-semibold text-white"
              >
                Submit Statement
              </button>
            </div>
          </div>
        )}
        <div className="md:p-6">
          <div className="relative">
            <ContractHeader
              title={contractDetails?.escrowContract?.ContractName}
              endContract={
                contractDetails?.escrowContract?.ContractCreatorId ===
                currentUser.Id &&
                contractDetails?.escrowContract?.Status !== 'Completed'
              }
              onShowFund={() => setShowFundReleases(true)}
              onOpenOptions={() => setOpenOptions(!openOptions)}
              onShowTerms={() => setShowTerms(true)}
              onShowEndContract={() => setShowEndContract(true)}
              onOpenOptionsMobile={() => setOpenSheet(true)}
              showReview={
                contractDetails?.escrowContract?.Status === 'Completed' &&
                !contractDetails?.IsReviewed
              }
              onShowReviews={() => setShowReview(true)}
              contractDetails={contractDetails}
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
          <hr className="border border-[#D2D4DA] my-6" />
          {contractDetails?.IsReviewed > 0 ? (
            <>
              <div className="flex items-center gap-0 overflow-x-auto hide-scrollbar mb-10">
                {TABS?.map((tab) => (
                  <div
                    key={tab.id}
                    className={cn(
                      'px-4 py-3 border-b text-h8 2xl:text-scaled-h8 flex items-center gap-2 cursor-pointer',
                      selectedTab === tab.id
                        ? 'border-omblue-600 text-omblue-600 font-semibold'
                        : 'border-transparent text-[#797B82] font-medium'
                    )}
                    style={{
                      fontVariationSettings:
                        selectedTab === tab.id ? "'wght' 600" : "'wght' 500",
                      textRendering: 'optimizeLegibility',
                    }}
                    onClick={() => setSelectedTab(tab.id)}
                  >
                    <p className="w-max">{tab.name}</p>
                  </div>
                ))}
              </div>
              <div className="tab-content">{renderTabContent(selectedTab)}</div>{' '}
            </>
          ) : (
            <OverViewTab contractDetails={contractDetails} />
          )}
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
        setAttachments={setAttachments}
        attachments={Attachments}
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
        isSubmitDispute={isSubmitDispute}
        showFundReleases={showFundReleases}
        setShowFundReleases={setShowFundReleases}
        ReleaseFund={ReleaseFund}
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
        isSubmitDispute={isSubmitDispute}
        CreateDispute={CreateDispute}
        setShowFundReleasesSheet={setShowFundReleasesSheet}
        showFundReleasesSheet={showFundReleasesSheet}
        ReleaseFund={ReleaseFund}
        handleFileUpload={handleFileUpload}
        setAttachments={setAttachments}
        attachments={Attachments}
      />
    </div>
  );
};

export default Contract;
