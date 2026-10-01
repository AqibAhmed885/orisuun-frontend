import Modal from '@/components/ui/modal/modal';
import Toggle from '@/components/ui/toggle';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import WorkDescription from '../ui/work-description';
import Dropzone from '../ui/dropzone';
import Input from '../ui/input';
import DatePicker from '../ui/date-picker';
import { addMonths, addYears, format } from 'date-fns';
import StarRatings from 'react-star-ratings';
import { v4 as uuidv4 } from 'uuid';
import ProfileCard from '../cards/profile-card';
import { TypeIcons } from '@/utils/helper';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
const ContractModals = ({
  showTerms,
  setShowTerms,
  onSubmit,
  // end
  showEndContract,
  setShowEndContract,
  contractTerms,
  setContractTerms,
  endContract,
  setEndContract,
  confirmEndContract,
  setConfirmEndContract,
  // dispute
  disputeContract,
  showDisputeContract,
  setShowDisputeContract,
  setDisputeDetails,
  setDisputeContract,
  // edit
  showEditContract,
  setShowEditContract,
  editContract,
  setEditContract,
  confirmEditContract,
  setConfirmEditContract,
  contractDetails,
  setShowReview,
  showReview,
  ratingDetails,
  handleChange,
  handleFileUpload,
  setAttachments,
  attachments,
  CreateDispute,
  ReviewSubmit,
  EndContract,
  setShowEndDispute,
  showEndDispute,
  setDisputeTerms,
  disputeTerms,
  isSubmitDispute,
  EndDispute,
  setShowFundReleases,
  showFundReleases,
  ReleaseFund
}: {
  // terms
  showTerms: boolean;
  setShowTerms: Dispatch<SetStateAction<boolean>>;
  // end contract
  showEndContract: boolean;
  setShowEndContract: Dispatch<SetStateAction<boolean>>;
  setShowReview?: Dispatch<SetStateAction<boolean>>;
  showReview?: boolean;
  endContract: boolean;
  setEndContract: Dispatch<SetStateAction<boolean>>;
  confirmEndContract: boolean;
  setConfirmEndContract: Dispatch<SetStateAction<boolean>>;
  // dispute contract
  showDisputeContract: boolean;
  setShowDisputeContract: Dispatch<SetStateAction<boolean>>;
  disputeContract: boolean;
  setDisputeContract: Dispatch<SetStateAction<boolean>>;
  // edit contract
  showEditContract: boolean;
  setShowEditContract: Dispatch<SetStateAction<boolean>>;
  editContract: boolean;
  setEditContract: Dispatch<SetStateAction<boolean>>;
  confirmEditContract: boolean;
  setConfirmEditContract: Dispatch<SetStateAction<boolean>>;
  contractDetails?: any;
  setContractTerms?: any;
  contractTerms?: any;
  onSubmit?: any;
  handleChange?: any;
  ratingDetails?: any;
  setDisputeDetails?: any;
  handleFileUpload?: any;
  setAttachments?: any;
  attachments?: any;
  CreateDispute?: any;
  ReviewSubmit?: any;
  EndContract?: any;
  setShowEndDispute?: Dispatch<SetStateAction<boolean>>;
  showEndDispute?: boolean;
  setShowFundReleases?: Dispatch<SetStateAction<boolean>>;
  showFundReleases?: boolean;
  setDisputeTerms?: any;
  disputeTerms?: any;
  isSubmitDispute?: boolean;
  EndDispute?: () => void;
  ReleaseFund?: () => void;
}) => {


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
  const isTeam = ["https://images.unsplash.com/photo-1706905615690-91782b2d5491?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const totalBudget = contractDetails.escrowContract?.ContractAmount;
  const members = contractDetails?.team;
  return (
    <>
      {/* terms */}
      <Modal
        showModal={showTerms}
        setShowModal={setShowTerms}
        title="Terms of contract"
      >
        <object width="100%" height="450" data="https://orisuundocumentsdev.blob.core.windows.net/profile-verification/953917b4-629f-4b9e-9212-716f4d4ef729.pdf" type="application/pdf">   </object>
        {/* <iframe src='' height={150} width={150} /> */}

      </Modal>
      <Modal
        showModal={showReview}
        setShowModal={setShowReview}
        title={`Write a review for ${contractDetails?.team ? contractDetails?.team[0]?.Name : ''
          }`}
      >
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
                svgIconViewBox="0 0 25 25"
                svgIconPath="M21.9668 8.16346L21.9672 8.16461C22.0078 8.28943 22.0108 8.42343 21.9759 8.54996C21.941 8.67649 21.8697 8.78998 21.7708 8.87632L21.7701 8.87696L16.9704 13.0854L16.7465 13.2817L16.8124 13.5721L18.2277 19.8066L18.2278 19.8068C18.2569 19.9349 18.2478 20.0687 18.2015 20.1916C18.1552 20.3145 18.0738 20.421 17.9675 20.498L17.9672 20.4982C17.7495 20.656 17.4614 20.668 17.2332 20.5307L17.232 20.53L11.7567 17.2564L11.5001 17.103L11.2436 17.2563L5.7663 20.53L5.76615 20.53C5.65828 20.5946 5.54069 20.626 5.42339 20.626C5.28679 20.626 5.15017 20.5836 5.03147 20.4978C4.81444 20.341 4.71199 20.0706 4.77149 19.8064C4.77152 19.8063 4.77155 19.8062 4.77158 19.806L6.1868 13.5721L6.25271 13.2818L6.02889 13.0855L1.22916 8.87613L1.22821 8.87531C1.02694 8.69969 0.949845 8.42048 1.03307 8.16452L1.03324 8.164C1.0736 8.0394 1.14965 7.92937 1.25195 7.84758C1.35426 7.76579 1.47832 7.71582 1.60876 7.70387L7.95917 7.12734L8.25645 7.10035L8.37374 6.82586L10.8844 0.950474C10.991 0.70175 11.2325 0.542969 11.5001 0.542969C11.7676 0.542969 12.009 0.701641 12.1158 0.949201C12.1158 0.949426 12.1159 0.949651 12.116 0.949876L14.6264 6.82578L14.7437 7.1003L15.041 7.12729L21.3908 7.70391L21.3915 7.70397C21.5219 7.71564 21.646 7.76543 21.7483 7.84714C21.8506 7.92885 21.9266 8.03886 21.9668 8.16346Z"
                style={{ margin: 'auto' }}
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
                svgIconViewBox="0 0 25 25"
                svgIconPath="M21.9668 8.16346L21.9672 8.16461C22.0078 8.28943 22.0108 8.42343 21.9759 8.54996C21.941 8.67649 21.8697 8.78998 21.7708 8.87632L21.7701 8.87696L16.9704 13.0854L16.7465 13.2817L16.8124 13.5721L18.2277 19.8066L18.2278 19.8068C18.2569 19.9349 18.2478 20.0687 18.2015 20.1916C18.1552 20.3145 18.0738 20.421 17.9675 20.498L17.9672 20.4982C17.7495 20.656 17.4614 20.668 17.2332 20.5307L17.232 20.53L11.7567 17.2564L11.5001 17.103L11.2436 17.2563L5.7663 20.53L5.76615 20.53C5.65828 20.5946 5.54069 20.626 5.42339 20.626C5.28679 20.626 5.15017 20.5836 5.03147 20.4978C4.81444 20.341 4.71199 20.0706 4.77149 19.8064C4.77152 19.8063 4.77155 19.8062 4.77158 19.806L6.1868 13.5721L6.25271 13.2818L6.02889 13.0855L1.22916 8.87613L1.22821 8.87531C1.02694 8.69969 0.949845 8.42048 1.03307 8.16452L1.03324 8.164C1.0736 8.0394 1.14965 7.92937 1.25195 7.84758C1.35426 7.76579 1.47832 7.71582 1.60876 7.70387L7.95917 7.12734L8.25645 7.10035L8.37374 6.82586L10.8844 0.950474C10.991 0.70175 11.2325 0.542969 11.5001 0.542969C11.7676 0.542969 12.009 0.701641 12.1158 0.949201C12.1158 0.949426 12.1159 0.949651 12.116 0.949876L14.6264 6.82578L14.7437 7.1003L15.041 7.12729L21.3908 7.70391L21.3915 7.70397C21.5219 7.71564 21.646 7.76543 21.7483 7.84714C21.8506 7.92885 21.9266 8.03886 21.9668 8.16346Z"
                style={{ margin: 'auto' }}
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
                svgIconViewBox="0 0 25 25"
                svgIconPath="M21.9668 8.16346L21.9672 8.16461C22.0078 8.28943 22.0108 8.42343 21.9759 8.54996C21.941 8.67649 21.8697 8.78998 21.7708 8.87632L21.7701 8.87696L16.9704 13.0854L16.7465 13.2817L16.8124 13.5721L18.2277 19.8066L18.2278 19.8068C18.2569 19.9349 18.2478 20.0687 18.2015 20.1916C18.1552 20.3145 18.0738 20.421 17.9675 20.498L17.9672 20.4982C17.7495 20.656 17.4614 20.668 17.2332 20.5307L17.232 20.53L11.7567 17.2564L11.5001 17.103L11.2436 17.2563L5.7663 20.53L5.76615 20.53C5.65828 20.5946 5.54069 20.626 5.42339 20.626C5.28679 20.626 5.15017 20.5836 5.03147 20.4978C4.81444 20.341 4.71199 20.0706 4.77149 19.8064C4.77152 19.8063 4.77155 19.8062 4.77158 19.806L6.1868 13.5721L6.25271 13.2818L6.02889 13.0855L1.22916 8.87613L1.22821 8.87531C1.02694 8.69969 0.949845 8.42048 1.03307 8.16452L1.03324 8.164C1.0736 8.0394 1.14965 7.92937 1.25195 7.84758C1.35426 7.76579 1.47832 7.71582 1.60876 7.70387L7.95917 7.12734L8.25645 7.10035L8.37374 6.82586L10.8844 0.950474C10.991 0.70175 11.2325 0.542969 11.5001 0.542969C11.7676 0.542969 12.009 0.701641 12.1158 0.949201C12.1158 0.949426 12.1159 0.949651 12.116 0.949876L14.6264 6.82578L14.7437 7.1003L15.041 7.12729L21.3908 7.70391L21.3915 7.70397C21.5219 7.71564 21.646 7.76543 21.7483 7.84714C21.8506 7.92885 21.9266 8.03886 21.9668 8.16346Z"
                style={{ margin: 'auto' }}
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
                svgIconViewBox="0 0 25 25"
                svgIconPath="M21.9668 8.16346L21.9672 8.16461C22.0078 8.28943 22.0108 8.42343 21.9759 8.54996C21.941 8.67649 21.8697 8.78998 21.7708 8.87632L21.7701 8.87696L16.9704 13.0854L16.7465 13.2817L16.8124 13.5721L18.2277 19.8066L18.2278 19.8068C18.2569 19.9349 18.2478 20.0687 18.2015 20.1916C18.1552 20.3145 18.0738 20.421 17.9675 20.498L17.9672 20.4982C17.7495 20.656 17.4614 20.668 17.2332 20.5307L17.232 20.53L11.7567 17.2564L11.5001 17.103L11.2436 17.2563L5.7663 20.53L5.76615 20.53C5.65828 20.5946 5.54069 20.626 5.42339 20.626C5.28679 20.626 5.15017 20.5836 5.03147 20.4978C4.81444 20.341 4.71199 20.0706 4.77149 19.8064C4.77152 19.8063 4.77155 19.8062 4.77158 19.806L6.1868 13.5721L6.25271 13.2818L6.02889 13.0855L1.22916 8.87613L1.22821 8.87531C1.02694 8.69969 0.949845 8.42048 1.03307 8.16452L1.03324 8.164C1.0736 8.0394 1.14965 7.92937 1.25195 7.84758C1.35426 7.76579 1.47832 7.71582 1.60876 7.70387L7.95917 7.12734L8.25645 7.10035L8.37374 6.82586L10.8844 0.950474C10.991 0.70175 11.2325 0.542969 11.5001 0.542969C11.7676 0.542969 12.009 0.701641 12.1158 0.949201C12.1158 0.949426 12.1159 0.949651 12.116 0.949876L14.6264 6.82578L14.7437 7.1003L15.041 7.12729L21.3908 7.70391L21.3915 7.70397C21.5219 7.71564 21.646 7.76543 21.7483 7.84714C21.8506 7.92885 21.9266 8.03886 21.9668 8.16346Z"
                style={{ margin: 'auto' }}
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
              onClick={() => setShowReview(false)}
              className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // setEndContract(!endContract);
                ReviewSubmit();
                setShowReview(false);
              }}
              className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
            >
              Write a review
            </button>
          </div>
        </div>
      </Modal>

      {/* end contract */}
      <Modal
        showModal={showEndContract}
        setShowModal={setShowEndContract}
        title="Confirm action"
        modalSize="sm"
      >
        <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
          Are you sure you want to end the contract? Once a end contract has
          been initiated, each side will be able to submit a statement and
          attach a file.
        </p>
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={() => setShowEndContract(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setEndContract(!endContract);
              setShowEndContract(false);
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            End Contract
          </button>
        </div>
      </Modal>

      {/* confirm end contract */}
      <Modal
        showModal={confirmEndContract}
        setShowModal={setConfirmEndContract}
        title="End Contract Details"
        modalSize="sm"
      >
        <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
          Are you sure you want to end the contract?
        </p>
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={() => setConfirmEndContract(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setEndContract(false);
              setConfirmEndContract(false);
              EndContract();
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            End Contract
          </button>
        </div>
      </Modal>

      <Modal
        showModal={showFundReleases}
        setShowModal={setShowFundReleases}
        title="Release Fund"
        modalSize="sm"
      >
        <p className="text-blue-300 text-h9 2xl:text-scaled-h9 font-medium">
          Are you sure you want to release the fund?
        </p>
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={() => setShowFundReleases(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowFundReleases(false);
              ReleaseFund();
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Release Fund
          </button>
        </div>
      </Modal>

      {/* dispute contract */}
      <Modal
        showModal={showDisputeContract}
        setShowModal={setShowDisputeContract}
        title="Dispute Details"
        modalSize="lg"
      >
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
            onChange={(e) => setDisputeDetails({ Message: e.target.value })}
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
            onClick={() => setShowDisputeContract(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setDisputeContract(!disputeContract);
              setShowDisputeContract(false);
              isSubmitDispute ? CreateDispute() : () => { }
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Start Dispute
          </button>
        </div>
      </Modal>
      {/* End Dis[ute */}
      <Modal
        showModal={showEndDispute}
        setShowModal={setShowEndDispute}
        title="End Dispute"
      >
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
            <div className='mb-4'>
              <ProfileCard
                image={
                  contractDetails?.ClientDetails?.ProfilePicture ||
                  BASE_URL
                }
                name={contractDetails?.ClientDetails?.Name}
                company={contractDetails?.ClientDetails?.UserProfileType || null}
                icon={TypeIcons[contractDetails?.ClientDetails?.UserProfileType] || null}
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
                    disputeTerms?.clientBudget === 250 && !disputeTerms?.isCustom
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
                    disputeTerms?.clientBudget === 500 && !disputeTerms?.isCustom
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
            <div className='mb-4'>
              <ProfileCard
                image={
                  contractDetails?.team?.length > 0 && contractDetails?.team ? contractDetails?.team[0]?.ProfilePicture :
                    BASE_URL
                }
                name={contractDetails?.team?.length > 1 ? 'Team' : !!contractDetails?.team && contractDetails?.team[0]?.Name}
                company={contractDetails?.team?.length === 1 ? contractDetails?.team[0]?.UserProfileType : null}
                icon={contractDetails?.team?.length === 1 ? TypeIcons[contractDetails?.team[0]?.UserProfileType] : null}
                isImage={false}
                // isTeamImage={isTeam.length  > 1 ? isTevam : null}
                isTeamImage={contractDetails?.team?.length > 1 ? contractDetails?.team?.map(member => member?.ProfilePicture ? member?.ProfilePicture : BASE_URL) : null}

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
            onClick={() => setShowEndDispute(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // setEditContract(!endContract);
              setShowEndDispute(false);
              EndDispute();
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            End Dispute
          </button>
        </div>
      </Modal>

      {/* edit contract */}
      <Modal
        showModal={showEditContract}
        setShowModal={setShowEditContract}
        title="Edit Contract Terms"
      >
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
            // value="custom"
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
            value={expiryDate ? expiryDate : contractTerms.ExpiryDate}
            format="yyyy-MM-dd"
          />
        )}
        {/* {errors?.Budget && (
              <p className="text-red-500">{errors?.Budget?.message}</p>
            )} */}
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={() => setShowEditContract(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // setEditContract(!endContract);
              setShowEditContract(false);
              onSubmit();
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Edit Contract
          </button>
        </div>
      </Modal>

      {/* confirm edit contract */}
      <Modal
        showModal={confirmEditContract}
        setShowModal={setConfirmEditContract}
        title="Edit Contract Terms"
      >
        <WorkDescription
          title="Headline description of work"
          description="This is for a full SaaS website with a subscription-based platform  Changes are for desktop and mobile versions  Quick turnaround for design: - payment screen, including PayPal, ACH, Apple Pay, Google Pay - pricing page  Quick turnaround for redesign and touch up of: - menu/navigation system - member type explanation pages - homepage  Need illustrations to showcase our platform  Need dynamic and adaptive design for desktop and mobile"
          expiryDate="05 Jan, 2024"
        />
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={() => setConfirmEditContract(false)}
            className="flex items-center text-h9 2xl:text-scaled-h9 gap-2  py-3 px-6 font-semibold bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => {
              setEditContract(false);
              setConfirmEditContract(false);
            }}
            className="flex items-center text-h9 2xl:text-scaled-h9 justify-center gap-2 py-3 px-6 font-semibold bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Approve Edit
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ContractModals;
