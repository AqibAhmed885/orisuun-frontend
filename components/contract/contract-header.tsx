import ThreeDots from '@/icons/three-dots';
import FileIconAlt from '@/icons/upload-icons/file-icon-alt';

const ContractHeader = ({
  title,
  endContract,
  onOpenOptions,
  onShowTerms,
  onShowEndContract,
  onOpenOptionsMobile,
  onShowReviews,
  showReview,
  endDispute,
  contractDetails,
  onShowEndDispute,
  onShowFund
}: {
  title: string;
  endContract: boolean;
  onOpenOptions: () => void;
  showReview?: boolean;
  endDispute?: boolean;
  onShowReviews?: () => void;
  onShowTerms: () => void;
  onShowEndContract: () => void;
  onOpenOptionsMobile?: () => void;
  onShowEndDispute?: () => void;
  onShowFund?: () => void;
  contractDetails?: any;
}) => {
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  return (
    <div className="grid grid-cols-12 gap-4 items-center mb-5">
      <div className="sm-ipad:col-span-10 small-500:col-span-11 md:col-span-6">
        <h3 className="text-h3 2xl:text-scaled-h3 font-bold text-olblue-900">
          {title}
        </h3>
      </div>
      <div className="col-span-5 md:col-span-6 hidden md:flex items-start md:items-center justify-end space-x-2">
        <button
          onClick={onShowTerms}
          className="flex items-center gap-2 p-3 bg-white border border-omblue-100 text-omblue-500 rounded-md hover:bg-omblue-500 hover:text-white transition-colors"
        >
          Terms of contract
          <FileIconAlt />
        </button>
        {!showReview && endContract && (
          <button
            onClick={onShowEndContract}
            className="flex items-center justify-center gap-2 p-3 bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            End contract
          </button>
        )}
        {endDispute && (
          <button
            onClick={onShowEndDispute}
            className="flex items-center justify-center gap-2 p-3 bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            End Dispute
          </button>
        )}
        {contractDetails?.escrowContract?.Status !== 'Completed' &&
          contractDetails?.escrowContract?.Status !== 'Dispute' &&contractDetails?.escrowContract?.Status !== 'Draft' &&  !contractDetails?.escrowContract?.IsPaymentDone && contractDetails?.escrowContract?.ContractCreatorId === currentUser.Id && (
          <button
            onClick={onShowFund}
            className="flex items-center justify-center gap-2 p-3 bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Release Fund
          </button>
        )}
        {showReview && (
          <button
            onClick={onShowReviews}
            className="flex items-center justify-center gap-2 p-3 bg-omblue-500 text-white rounded-md hover:bg-omblue-600 transition-colors"
          >
            Write a review
          </button>
        )}
        {(currentUser.UserProfileTypeId != 10 &&
        contractDetails?.escrowContract?.Status !== 'Completed' &&
          contractDetails?.escrowContract?.Status !== 'Dispute' &&contractDetails?.escrowContract?.Status !== 'FundsReleased'  )&& (
            <button
              className="w-8 h-8 p-2 border border-omblue-100 rounded-full"
              onClick={onOpenOptions}
            >
              <ThreeDots />
            </button>
          )}
      </div>
      <button
        className="sm-ipad:col-span-2 small-500:col-span-1 flex justify-end w-8 h-8 p-2 border border-omblue-100 rounded-full md:hidden"
        onClick={onOpenOptionsMobile}
      >
        <ThreeDots />
      </button>
    </div>
  );
};

export default ContractHeader;
