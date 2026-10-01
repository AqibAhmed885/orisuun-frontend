import UploadCard from '@/components/cards/upload-card';
import React, { useState, useEffect } from 'react';

const Attachments = ({
  onFileSelect=()=>{},
  length = 3,
  contractDetails,
  isDispute = false
}: {
  onFileSelect?: (file: File) => void;
  length?: number;
  attachments?: any[];
  contractDetails?:any;
  isDispute?: boolean;
}) => {
  const [disabledCards, setDisabledCards] = useState<boolean[]>([]);

  useEffect(() => {
    // Initialize the disabledCards state based on the number of attachments
    if(isDispute) {
      setDisabledCards(
        Array.from({ length }).map((_, index) => !(index === 0 || contractDetails?.DisputeDocuments[index - 1]))
      );
    }
    else {
      contractDetails?.escrowContractDocuments &&
      setDisabledCards(
        Array.from({ length }).map((_, index) => !(index === 0 || contractDetails?.escrowContractDocuments[index - 1]))
      );
    }
  }, [length]);

  const handleFileSelect = (index: number, file: File) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
    // Enable the next card when a file is selected
    setDisabledCards((prev) =>
      prev.map((disabled, i) => (i === index + 1 ? false : disabled))
    );
  };

  return (
    <div className="my-5">
      <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
        Attachments:
      </h6>
      <div className="my-5 flex items-center gap-4 lg:overflow-x-hidden overflow-x-scroll hide-scrollbar">
        {Array.from({ length }).map((_, index) => (
          <UploadCard
            key={index}
            onFileSelect={
              !disabledCards[index]
                ? (file) => handleFileSelect(index, file)
                : undefined
            }
            attachment={isDispute?  (contractDetails?.DisputeDocuments ? contractDetails?.DisputeDocuments[index]:null) : contractDetails?.escrowContractDocuments ? contractDetails?.escrowContractDocuments[index] : null}
            image={index > 2}
            disabled={disabledCards[index] || contractDetails?.escrowContract?.Status === 'Completed' || contractDetails?.escrowContract?.Status === 'Dispute' || contractDetails?.escrowContract?.Status === 'FundsReleased' || isDispute}
          />
        ))}
      </div>
      {length > 2 && (
        <p>
          You can upload up to {length} files. PDF, JPG, TIFF supported formats.
        </p>
      )}
    </div>
  );
};

export default Attachments;
