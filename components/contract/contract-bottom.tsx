import BottomSheet from '@/components/ui/bottom-sheet';
import Toggle from '@/components/ui/toggle';
import DisputeIcon from '@/icons/dispute-icon';
import EditIcon from '@/icons/edit-icon';
import FileIconAlt from '@/icons/upload-icons/file-icon-alt';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import WorkDescription from '../ui/work-description';
import Dropzone from '../ui/dropzone';
import { addMonths, addYears, format } from 'date-fns';
import DatePicker from '../ui/date-picker';
import StarRatings from 'react-star-ratings';
import ProfileCard from '../cards/profile-card';
import { TypeIcons } from '@/utils/helper';
import Input from '../ui/input';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
const ContractBottom = ({
  openSheet,
  setOpenSheet,
  openSheetEndContract,
  endContract,
  setEndContract,
  setOpenSheetEndContract,
  setShowTerms,
  showDisputeContractSheet,
  setShowDisputeContractSheet,
  disputeContract,
  setDisputeContract,
  editContract,
  setEditContract,
  openSheetEditContract,
  setOpenSheetEditContract,
  openSheetConfirmEditContract,
  setOpenSheetConfirmEditContract,

  contractTerms,
  setContractTerms,
  contractDetails,
  setShowReviewSheet,
  showReviewSheet,
  ratingDetails,
  handleChange,
  ReviewSubmit,
  setOpenSheetConfirmEndContract,
  openSheetConfirmEndContract,
  setShowEndDisputeSheet,
  showEndDisputeSheet,
  setDisputeTerms,
  disputeTerms,
  EndContract,
  isSubmitDispute,
  EndDispute,
  CreateDispute,
  setShowFundReleasesSheet,
  showFundReleasesSheet,
  ReleaseFund,
  handleFileUpload,
  setAttachments,
  attachments,

}: {
  openSheet: boolean;
  // terms
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
  setShowTerms: Dispatch<SetStateAction<boolean>>;
  // end
  openSheetEndContract: boolean;
  setOpenSheetEndContract: Dispatch<SetStateAction<boolean>>;
  endContract: boolean;
  setEndContract: Dispatch<SetStateAction<boolean>>;
  // dispute
  showDisputeContractSheet: boolean;
  setShowDisputeContractSheet: Dispatch<SetStateAction<boolean>>;
  disputeContract: boolean;
  setDisputeContract: Dispatch<SetStateAction<boolean>>;
  // edit
  editContract: boolean;
  setEditContract: Dispatch<SetStateAction<boolean>>;
  openSheetEditContract: boolean;
  setOpenSheetEditContract: Dispatch<SetStateAction<boolean>>;
  openSheetConfirmEditContract: boolean;
  setOpenSheetConfirmEditContract: Dispatch<SetStateAction<boolean>>;

  setContractTerms?: any;
  contractTerms?: any;
  contractDetails?: any;
  setShowReviewSheet?: any;
  showReviewSheet?: any;
  handleChange?: any;
  ratingDetails?: any;
  ReviewSubmit?: any;
  openSheetConfirmEndContract?: boolean;
  setOpenSheetConfirmEndContract?: Dispatch<SetStateAction<boolean>>;
  EndContract?: any;
  setShowEndDisputeSheet?: Dispatch<SetStateAction<boolean>>;
  showEndDisputeSheet?: boolean;
  setDisputeTerms?: any;
  disputeTerms?: any;
  isSubmitDispute?: boolean;
  EndDispute?: () => void;
  CreateDispute?: () => void;
  setShowFundReleasesSheet?: Dispatch<SetStateAction<boolean>>;
  showFundReleasesSheet?: boolean;
  ReleaseFund?: () => void;
  handleFileUpload?: any;
  setAttachments?: any;
  attachments?: any;
}) => {
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const handleDurationClick = (duration: number, unit: 'months' | 'years') => {
    const currentDate = new Date();
    let newExpiryDate: Date;

    if (unit === 'months') {
      newExpiryDate = addMonths(currentDate, duration);
    } else {
      newExpiryDate = addYears(currentDate, duration);
    }

    setContractTerms({
      ...contractTerms,
      ExpiryDate: format(newExpiryDate, 'yyyy-MM-dd'),
      Deadline: duration + ' ' + unit,
    });
    setExpiryDate(newExpiryDate);
    // setCustom(false);
  };
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const totalBudget = contractDetails?.escrowContract?.ContractAmount;
  return (
    <>
      {/* common bottom sheet */}
      <BottomSheet isOpen={openSheet} onClose={() => setOpenSheet(false)}>
        <ul>
          {contractDetails?.escrowContract?.ContractCreatorId ===
            currentUser.Id &&
            contractDetails?.escrowContract?.Status !== 'Completed' && (
              <li
                className="p-3 flex items-center gap-3 text-h8 2xl:text-scaled-h8 text-black-500 font-medium"
                onClick={() => {
                  setOpenSheet(false);
                  setOpenSheetEndContract(true);
                }}
              >
                <Image
                  src="/images/vector/end-contract.svg"
                  alt="end-contract"
                  width={18}
                  height={18}
                />
                <p>End Contract</p>
              </li>
            )}
          <li
            className="p-3 flex items-center gap-3 text-h8 2xl:text-scaled-h8 text-black-500 font-medium"
            onClick={() => {
              setOpenSheet(false);
              setShowTerms(true);
            }}
          >
            <FileIconAlt className="w-4 h-4" />
            <p>Terms of contract</p>
          </li>
          {contractDetails?.escrowContract?.Status !== 'Completed' &&
            contractDetails?.escrowContract?.Status !== 'Dispute' && contractDetails?.escrowContract?.Status !== 'Draft' && (
              <li
                className="p-3 flex items-center gap-3 text-h8 2xl:text-scaled-h8 text-black-500 font-medium"
                onClick={() => {
                  setOpenSheet(false);
                  setShowDisputeContractSheet(true);
                }}
              >
                <DisputeIcon className="w-4 h-4" />
                <p>Dispute</p>
              </li>
            )}
          {contractDetails?.escrowContract?.Status === 'Completed' &&
            !contractDetails?.IsReviewed && (
              <li
                className="p-3 flex items-center gap-3 text-h8 2xl:text-scaled-h8 text-black-500 font-medium"
                onClick={() => {
                  setOpenSheet(false);
                  setShowReviewSheet(true);
                }}
              >
                <DisputeIcon className="w-4 h-4" />
                <p>Write a review</p>
              </li>
            )}
          {contractDetails?.escrowContract?.Status === 'Completed' && contractDetails?.escrowContract?.Status !== 'Draft' && !contractDetails?.escrowContract?.IsPaymentDone && contractDetails?.escrowContract?.ContractCreatorId === currentUser.Id && (
            <li
              className="p-3 flex items-center gap-3 text-h8 2xl:text-scaled-h8 text-black-500 font-medium"
              onClick={() => {
                setOpenSheet(false);
                setShowFundReleasesSheet(true);
              }}
            >
              <DisputeIcon className="w-4 h-4" />
              <p>Release Fund</p>
            </li>
          )}
          {contractDetails?.escrowContract?.ContractCreatorId ===
            currentUser.Id &&
            contractDetails?.escrowContract?.Status !== 'Dispute' && contractDetails?.escrowContract?.Status !== 'Completed' && (
              <li
                className="p-3 flex items-center gap-3 text-h8 2xl:text-scaled-h8 text-black-500 font-medium"
                onClick={() => {
                  setOpenSheet(false);
                  setOpenSheetEditContract(true);
                }}
              >
                <EditIcon className="w-4 h-4" />
                <p>Edit terms</p>
              </li>
            )}
          {currentUser.UserProfileTypeId == 10 && (
            <li
              className="p-3 flex items-center gap-3 text-h8 2xl:text-scaled-h8 text-black-500 font-medium"
              onClick={() => {
                setOpenSheet(false);
                setShowEndDisputeSheet(true);
              }}
            >
              <DisputeIcon className="w-4 h-4" />
              <p>End Dispute</p>
            </li>
          )}
        </ul>
      </BottomSheet>
      <BottomSheet
        isOpen={showEndDisputeSheet}
        onClose={() => setShowEndDisputeSheet(false)}
      >
        <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500 text-center mb-4">
          End Dispute
        </h5>
        <div className="mb-4">
          <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium mb-1">
            Please provide your decision below.
          </p>
          <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
            Once the decision is submitted, the other parties will able to see
            it.
          </p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap justify-between gap-4 md:gap-0">
          {/* Client Section */}
          <div className="flex flex-col gap-2 w-full md:pe-4 md:border-r">
            {/* <h4 className="font-semibold">Client</h4> */}
            <div className="mb-4">
              <ProfileCard
                image={
                  contractDetails?.ClientDetails?.ProfilePicture ||
                  BASE_URL
                }
                name={contractDetails?.ClientDetails?.Name}
                company={
                  contractDetails?.ClientDetails?.UserProfileType || null
                }
                icon={
                  TypeIcons[contractDetails?.ClientDetails?.UserProfileType] ||
                  null
                }
                isImage={false}
              />
            </div>
            <div className="mb-4">
              <p className="text-h9 2xl:text-scaled-h9 font-semibold to-black-500 mb-2">
                Dispute Decision:
              </p>
              <textarea
                rows={4}
                placeholder="Write your message here....."
                onChange={(e) =>
                  setDisputeTerms({
                    ...disputeTerms,
                    clientDescription: e.target.value,
                  })
                }
                value={disputeTerms?.clientDescription}
                className="resize-none border border-black-100 w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
              />
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <p className="text-h9 2xl:text-scaled-h9 font-semibold to-black-500 mb-2 w-full text-start">
                Financial Decision:
              </p>
              <div className="flex items-center gap-2 w-full">
                <Toggle
                  onClick={() => {
                    const remainingBudget = totalBudget - 0;
                    setDisputeTerms({
                      ...disputeTerms,
                      clientBudget: 0,
                      memberBudget: remainingBudget,
                      isCustom: false,
                      isCustomMember: ![0, 250, 500].includes(remainingBudget), // Auto-select custom if remaining doesn't match predefined values
                    });
                  }}
                  checked={
                    disputeTerms?.clientBudget === 0 && !disputeTerms?.isCustom
                  }
                  className="text-center"
                >
                  $0
                </Toggle>

                <Toggle
                  onClick={() => {
                    const remainingBudget = totalBudget - 250;
                    setDisputeTerms({
                      ...disputeTerms,
                      clientBudget: 250,
                      memberBudget: remainingBudget,
                      isCustom: false,
                      isCustomMember: ![0, 250, 500].includes(remainingBudget), // Auto-select custom if needed
                    });
                  }}
                  checked={
                    disputeTerms?.clientBudget === 250 &&
                    !disputeTerms?.isCustom
                  }
                  className="text-center"
                >
                  $250
                </Toggle>

                <Toggle
                  onClick={() => {
                    const remainingBudget = totalBudget - 500;
                    setDisputeTerms({
                      ...disputeTerms,
                      clientBudget: 500,
                      memberBudget: remainingBudget,
                      isCustom: false,
                      isCustomMember: ![0, 250, 500].includes(remainingBudget), // Auto-select custom for member if needed
                    });
                  }}
                  checked={
                    disputeTerms?.clientBudget === 500 &&
                    !disputeTerms?.isCustom
                  }
                  className="text-center"
                >
                  $500
                </Toggle>

                <Toggle
                  onClick={() => {
                    setDisputeTerms({
                      ...disputeTerms,
                      isCustom: true,
                    });
                  }}
                  checked={disputeTerms?.isCustom}
                  className="text-center"
                >
                  Custom
                </Toggle>
              </div>
            </div>
            {disputeTerms?.isCustom && (
              <Input
                placeholder="Enter custom Client Budget"
                type="number"
                className="w-40"
                value={disputeTerms?.clientBudget}
                onChange={(e) => {
                  const inputValue = Number(e.target.value);

                  // Ensure the value is not negative and does not exceed totalBudget
                  if (inputValue < 0) {
                    // If the value is negative, set it to 0 or handle accordingly
                    setDisputeTerms({
                      ...disputeTerms,
                      clientBudget: 0,
                      memberBudget: totalBudget, // Assuming memberBudget should be total if clientBudget is 0
                      isCustomMember: ![0, 250, 500].includes(totalBudget), // Update the condition for custom
                    });
                  } else if (inputValue <= totalBudget) {
                    // If the value is valid, calculate remaining budget
                    const remainingBudget = totalBudget - inputValue;
                    setDisputeTerms({
                      ...disputeTerms,
                      clientBudget: inputValue,
                      memberBudget: remainingBudget,
                      isCustomMember: ![0, 250, 500].includes(remainingBudget), // Auto-select custom for member
                    });
                  }
                }}
              />
            )}
          </div>
          {/* Member Section */}
          <div className="flex flex-col gap-2 w-full md:ps-4">
            {/* <h4 className="font-semibold">Member</h4> */}
            <div className="mb-4">
              <ProfileCard
                image={
                  contractDetails?.team?.length > 0 && contractDetails?.team
                    ? contractDetails?.team[0]?.ProfilePicture
                    : BASE_URL
                }
                name={
                  contractDetails?.team?.length > 1
                    ? 'Team'
                    : !!contractDetails?.team && contractDetails?.team[0]?.Name
                }
                company={
                  contractDetails?.team?.length === 1
                    ? contractDetails?.team[0]?.UserProfileType
                    : null
                }
                icon={
                  contractDetails?.team?.length === 1
                    ? TypeIcons[contractDetails?.team[0]?.UserProfileType]
                    : null
                }
                isImage={false}
                // isTeamImage={isTeam.length  > 1 ? isTevam : null}
                isTeamImage={
                  contractDetails?.team?.length > 1
                    ? contractDetails?.team?.map((member) =>
                      member?.ProfilePicture
                        ? member?.ProfilePicture
                        : BASE_URL
                    )
                    : null
                }
              />
            </div>
            <div className="mb-4">
              <p className="text-h9 2xl:text-scaled-h9 font-semibold to-black-500 mb-2">
                Dispute Decision:
              </p>
              <textarea
                rows={4}
                placeholder="Write your message here....."
                onChange={(e) =>
                  setDisputeTerms({
                    ...disputeTerms,
                    memberDescription: e.target.value,
                  })
                }
                value={disputeTerms?.memberDescription}
                className="resize-none border border-black-100 w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
              />
            </div>

            {/* Member Amount Selection */}
            <div className="flex flex-col items-center gap-2 w-full">
              <p className="text-h9 2xl:text-scaled-h9 font-semibold to-black-500 mb-2 w-full text-start">
                Financial Decision:
              </p>
              <div className="flex items-center gap-2 w-full">
                <Toggle
                  onClick={() => {
                    const remainingBudget = totalBudget - 0;
                    setDisputeTerms({
                      ...disputeTerms,
                      memberBudget: 0,
                      clientBudget: remainingBudget,
                      isCustomMember: false,
                      isCustom: ![0, 250, 500].includes(remainingBudget), // Auto-select custom for client
                    });
                  }}
                  checked={
                    disputeTerms?.memberBudget === 0 &&
                    !disputeTerms?.isCustomMember
                  }
                  className="text-center"
                >
                  $0
                </Toggle>

                <Toggle
                  onClick={() => {
                    const remainingBudget = totalBudget - 250;
                    setDisputeTerms({
                      ...disputeTerms,
                      memberBudget: 250,
                      clientBudget: remainingBudget,
                      isCustomMember: false,
                      isCustom: ![0, 250, 500].includes(remainingBudget), // Auto-select custom for client
                    });
                  }}
                  checked={
                    disputeTerms?.memberBudget === 250 &&
                    !disputeTerms?.isCustomMember
                  }
                  className="text-center"
                >
                  $250
                </Toggle>

                <Toggle
                  onClick={() => {
                    const remainingBudget = totalBudget - 500;
                    setDisputeTerms({
                      ...disputeTerms,
                      memberBudget: 500,
                      clientBudget: remainingBudget,
                      isCustomMember: false,
                      isCustom: ![0, 250, 500].includes(remainingBudget), // Auto-select custom for client
                    });
                  }}
                  checked={
                    disputeTerms?.memberBudget === 500 &&
                    !disputeTerms?.isCustomMember
                  }
                  className="text-center"
                >
                  $500
                </Toggle>

                <Toggle
                  onClick={() => {
                    setDisputeTerms({
                      ...disputeTerms,
                      isCustomMember: true,
                    });
                  }}
                  checked={disputeTerms?.isCustomMember}
                  className="text-center"
                >
                  Custom
                </Toggle>
              </div>
            </div>
            {disputeTerms?.isCustomMember && (
              <Input
                placeholder="Enter custom Member Budget"
                type="number"
                className="w-40"
                value={disputeTerms?.memberBudget}
                onChange={(e) => {
                  const inputValue = Number(e.target.value);

                  // Ensure the value is not negative and does not exceed totalBudget
                  if (inputValue < 0) {
                    // If the value is negative, set it to 0 or handle accordingly
                    setDisputeTerms({
                      ...disputeTerms,
                      memberBudget: 0,
                      clientBudget: totalBudget, // Assuming clientBudget should be total if memberBudget is 0
                      isCustom: ![0, 250, 500].includes(totalBudget), // Update the condition for custom
                    });
                  } else if (inputValue <= totalBudget) {
                    // If the value is valid, calculate remaining budget
                    const remainingBudget = totalBudget - inputValue;
                    setDisputeTerms({
                      ...disputeTerms,
                      memberBudget: inputValue,
                      clientBudget: remainingBudget,
                      isCustom: ![0, 250, 500].includes(remainingBudget), // Auto-select custom for client
                    });
                  }
                }}
              />
            )}
          </div>
        </div>
        {/* {errors?.Budget && (
              <p className="text-red-500">{errors?.Budget?.message}</p>
            )} */}
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={() => setShowDisputeContractSheet(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // setEditContract(!endContract);
              setShowDisputeContractSheet(false);
              EndDispute();
              // onSubmit();
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Edit Contract
          </button>
        </div>
      </BottomSheet>
      {/* end contract sheet */}
      <BottomSheet
        isOpen={openSheetEndContract}
        onClose={() => setOpenSheetEndContract(false)}
      >
        <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500 text-center mb-4">
          Confirm action
        </h5>
        <p>
          Are you sure you want to end the contract? Once a end contract has
          been initiated, each side will be able to submit a statement and
          attach a file.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setOpenSheetEndContract(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setEndContract(!endContract);
              setOpenSheetEndContract(false);
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            End Contract
          </button>
        </div>
      </BottomSheet>
      {/* Review */}
      <BottomSheet
        isOpen={showReviewSheet}
        onClose={() => setShowReviewSheet(false)}
      >
        <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500 text-center mb-4">
          Write a review for{' '}
          {contractDetails?.team ? contractDetails?.team[0]?.Name : ''}
        </h5>
        <div className="mb-4">
          <div className="flex flex-wrap justify-between items-center gap-4 text-omblue-500 ">
            <div className="w-[45%] mb-2">
              <p className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
                Quality
              </p>
              <StarRatings
                starDimension={'40px'}
                rating={ratingDetails?.Quality}
                starRatedColor="#69B3E7"
                changeRating={(value) => handleChange('Quality', value)}
                numberOfStars={5}
                name="rate"
                starSpacing="5px"
                starEmptyColor="#D1E7F8"
                starHoverColor="#69B3E7"
              />
            </div>
            <div className="w-[45%] mb-2">
              <p className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
                Service
              </p>
              <StarRatings
                starDimension={'40px'}
                rating={ratingDetails?.Service}
                starRatedColor="#69B3E7"
                changeRating={(value) => handleChange('Service', value)}
                numberOfStars={5}
                name="Service"
                starSpacing="5px"
                starEmptyColor="#D1E7F8"
                starHoverColor="#69B3E7"
              />
            </div>
            <div className="w-[45%] mb-2">
              <p className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
                Cost
              </p>
              <StarRatings
                starDimension={'40px'}
                rating={ratingDetails?.Cost}
                starRatedColor="#69B3E7"
                changeRating={(value) => handleChange('Cost', value)}
                numberOfStars={5}
                name="Cost"
                starSpacing="5px"
                starEmptyColor="#D1E7F8"
                // svgIconPath="M29.1572 11.0578C29.0008 10.576 28.583 10.224 28.0817 10.1511L19.8683 8.95825L16.1955 1.5147C15.7475 0.604476 14.2523 0.604476 13.8043 1.5147L10.1315 8.95648L1.91813 10.1494C1.41679 10.2223 0.999014 10.5743 0.84257 11.056C0.686125 11.5378 0.815903 12.0694 1.18035 12.4231L7.12346 18.2151L5.71901 26.3947C5.63368 26.896 5.83813 27.4009 6.24879 27.6996C6.65946 27.9965 7.20524 28.0356 7.65324 27.8009L14.999 23.9378L22.3448 27.8009C22.5403 27.904 22.7519 27.9538 22.9652 27.9538C23.2408 27.9538 23.5163 27.8685 23.7492 27.6996C24.1599 27.4009 24.3661 26.896 24.279 26.3947L22.8746 18.2151L28.8177 12.4231C29.1821 12.0694 29.3119 11.5378 29.1555 11.056L29.1572 11.0578Z"
                starHoverColor="#69B3E7"
              />
            </div>
            <div className="w-[45%] mb-2">
              <p className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
                Willing For Refer
              </p>
              <StarRatings
                starDimension={'40px'}
                rating={ratingDetails?.Willing}
                starRatedColor="#69B3E7"
                changeRating={(value) => handleChange('Willing', value)}
                numberOfStars={5}
                name="Willing"
                starSpacing="5px"
                starEmptyColor="#D1E7F8"
                starHoverColor="#69B3E7"
              />
            </div>
          </div>
          <p className="text-h8 2xl:text-scaled-h8 font-semibold to-black-500 mb-2 mt-6">
            Your Review:
          </p>
          <textarea
            rows={4}
            placeholder="Write your message here....."
            onChange={(e) => handleChange('Review', e.target.value)}
            value={ratingDetails?.Review}
            className="resize-none border border-black-100 w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
          />
          <p className="text-gray-500 text-h10 2xl:text-scaled-h10 font-semibold my-2">
            Maximum 250 words
          </p>

          <div className="flex justify-end items-center gap-2 pt-3">
            <button
              onClick={() => setShowReviewSheet(false)}
              className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // setEndContract(!endContract);
                ReviewSubmit();
                setShowReviewSheet(false);
              }}
              className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
            >
              Write a review
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* dispute sheet */}
      <BottomSheet
        isOpen={showDisputeContractSheet}
        onClose={() => setShowDisputeContractSheet(false)}
      >
        <h3 className="text-h3 2xl:text-scaled-h3 font-bold text-olblue-900 mb-4">
          Dispute Details
        </h3>
        {disputeContract ? (
          <div className="mb-4">
            <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
              Please read the message below and provide us with your perspective
              on the situation.
            </p>
            <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
              Our administration will review this dispute and inform you of the
              next steps.
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
              Are you sure you want to start a dispute?
            </p>
            <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
              Once a dispute has been initiated, each side will be able to
              submit a statement and attach a file.
            </p>
          </div>
        )}
        {disputeContract ? (
          <div className="mb-4 px-6 py-4 bg-warning-75 rounded-lg">
            <h6 className="text-h6 2xl:text-scaled-h6 text-warning-700 font-semibold mb-1">
              Message from other side
            </h6>
            <p className="text-h7 2xl:text-scaled-h7 text-warning-800 font-medium mb-1">
              The process was unprofessional, and my expectations were not met.
              The result of this work is of low quality, and I would like a
              refund.
            </p>
          </div>
        ) : null}
        <div className="mb-4">
          <p className="text-h9 2xl:text-scaled-h9 font-semibold to-black-500 mb-2">
            Your message:
          </p>
          <textarea
            rows={4}
            placeholder="Statement explaining any omissions or discrepancies"
            className="resize-none border border-black-100 w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
          />
          <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
            Maximum 250 words description
          </p>
        </div>
        <div className="mb-4">
          <p className="text-h9 2xl:text-scaled-h9 font-semibold to-black-500 mb-2">
            Add attachment (Optional)
          </p>
          <Dropzone
            onFilesUpload={handleFileUpload}
            storedFile={attachments || []}
            acceptedFileTypes={'pdf'}
            setValue={setAttachments}
          />
        </div>
        <div className="flex items-center justify-center md:justify-end gap-3">
          <button
            onClick={() => setShowDisputeContractSheet(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setDisputeContract(!disputeContract);
              setShowDisputeContractSheet(false);
              isSubmitDispute ? CreateDispute() : () => { }
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Start Dispute
          </button>
        </div>
      </BottomSheet>
      <BottomSheet
        isOpen={showFundReleasesSheet}
        onClose={() => setShowDisputeContractSheet(false)}
      >
        <h3 className="text-h3 2xl:text-scaled-h3 font-bold text-olblue-900 mb-4">
          Release Fund
        </h3>
        <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
          Are you sure you want to release the fund?
        </p>
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={() => setShowFundReleasesSheet(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowFundReleasesSheet(false);
              ReleaseFund();
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Release Fund
          </button>
        </div>
      </BottomSheet>

      {/* edit */}
      <BottomSheet
        isOpen={openSheetEditContract}
        onClose={() => setOpenSheetEditContract(false)}
      >
        <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500 mb-4">
          Edit Contract Terms
        </h5>
        <div className="mb-4">
          <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium mb-1">
            Please provide the details below that you wish to edit.
          </p>
          <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
            Once edits are submitted, the other party must agree to these
            changes.
          </p>
        </div>
        <div className="mb-4">
          <p className="text-h9 2xl:text-scaled-h9 font-semibold to-black-500 mb-2">
            Task Description:
          </p>
          <textarea
            rows={4}
            placeholder="Write your message here....."
            onChange={(e) =>
              setContractTerms({
                ...contractTerms,
                Description: e.target.value,
              })
            }
            value={contractTerms?.Description}
            className="resize-none border border-black-100 w-full rounded-md py-3 px-4 focus:border-black-400 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Toggle
            onClick={() => handleDurationClick(1, 'months')}
            checked={contractTerms?.Deadline === '1 months'}
            className="text-center"
          >
            1 month
          </Toggle>
          <Toggle
            onClick={() => handleDurationClick(3, 'months')}
            checked={contractTerms?.Deadline === '3 months'}
            className="text-center"
          >
            3 months
          </Toggle>
          <Toggle
            onClick={() => handleDurationClick(6, 'months')}
            checked={contractTerms?.Deadline === '6 months'}
            className="text-center"
          >
            6 months
          </Toggle>
          <Toggle
            onClick={() => handleDurationClick(1, 'years')}
            checked={contractTerms?.Deadline === '1 years'}
            className="text-center"
          >
            1 year
          </Toggle>
          <Toggle
            value="custom"
            onClick={() => {
              setContractTerms({
                ...contractTerms,
                Deadline: 'custom',
                ExpiryDate: format(new Date(), 'yyyy-MM-dd'),
              });
            }}
            checked={contractTerms?.Deadline === 'custom'}
          >
            Custom
          </Toggle>
        </div>
        {contractTerms?.Deadline === 'custom' && (
          <DatePicker
            onChange={(date: any) => {
              setContractTerms({
                ...contractTerms,
                ExpiryDate: format(date, 'yyyy-MM-dd'),
              });

              setExpiryDate(date);
            }}
            value={new Date(expiryDate)}
            format="yyyy-MM-dd"
          />
        )}
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={() => setOpenSheetEditContract(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // setEditContract(!editContract);
              setOpenSheetEditContract(false);
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Edit Contract
          </button>
        </div>
      </BottomSheet>
      {/* confirm edit */}
      <BottomSheet
        isOpen={openSheetConfirmEditContract}
        onClose={() => setOpenSheetConfirmEditContract(false)}
      >
        <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500 text-center mb-4">
          Confirm action
        </h5>
        <WorkDescription
          title="Headline description of work"
          description="This is for a full SaaS website with a subscription-based platform  Changes are for desktop and mobile versions  Quick turnaround for design: - payment screen, including PayPal, ACH, Apple Pay, Google Pay - pricing page  Quick turnaround for redesign and touch up of: - menu/navigation system - member type explanation pages - homepage  Need illustrations to showcase our platform  Need dynamic and adaptive design for desktop and mobile"
          expiryDate="05 Jan, 2024"
        />

        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setOpenSheetConfirmEditContract(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => {
              setEditContract(false);
              setOpenSheetConfirmEditContract(false);
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Approve Edit
          </button>
        </div>
      </BottomSheet>
    </>
  );
};

export default ContractBottom;
