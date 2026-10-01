import Add from '@/icons/add';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';

interface UploadCardProps {
  image?: boolean;
  onFileSelect?: (file: File) => void;
  attachment?: any;
  disabled?: boolean;
}

const UploadCard: React.FC<UploadCardProps> = ({
  image = false,
  onFileSelect,
  attachment,
  disabled,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<any>(attachment);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (attachment) {
      setExistingFile(attachment);
    }
  }, [attachment]);

  const handleClick = async () => {
    // if (disabled) return;
    if (existingFile) {
      // If a file is already uploaded, download it
      try {
        const response = await fetch(
          `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${existingFile.StoredFileName}`
        );
        const blob = await response.blob();

        // Create a link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = existingFile.FileName || 'download'; // Provide a filename for the download
        document.body.appendChild(link); // Append the link to the body
        link.click(); // Simulate click
        link.remove(); // Remove the link if it is still attached

        // Revoke the object URL after download
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error('Failed to download file:', error);
      }
    } else if (selectedFile) {
      // If a new file is selected, trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(selectedFile);
      link.download = selectedFile.name; // Use the name of the selected file
      document.body.appendChild(link); // Append the link to the body
      link.click(); // Simulate click
      link.remove(); // Remove the link if it is still attached

      // Revoke the object URL after download
      URL.revokeObjectURL(link.href);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setExistingFile(null); // Clear existing file if a new one is selected
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const renderFileIcon = () => {
    if (existingFile) {
      const fileType = existingFile.FileName.split('.').pop().toLowerCase();

      switch (fileType) {
        case 'pdf':
          return (
            <Image
              src="/images/vector/pdf.svg"
              alt="PDF file"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              width={20}
              height={20}
            />
          );
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'tiff':
          return (
            <Image
              src="/images/vector/image.svg"
              alt="Image file"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              width={20}
              height={20}
            />
          );
        default:
          return (
            <Image
              src="/whats-new/fileBlue.svg"
              alt="File"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              width={20}
              height={20}
            />
          );
      }
    } else if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();

      switch (fileType) {
        case 'pdf':
          return (
            <Image
              src="/images/vector/pdf.svg"
              alt="PDF file"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              width={20}
              height={20}
            />
          );
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'tiff':
          return (
            <Image
              src="/images/vector/image.svg"
              alt="Image file"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              width={20}
              height={20}
            />
          );
        default:
          return (
            <Image
              src="/whats-new/fileBlue.svg"
              alt="File"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              width={20}
              height={20}
            />
          );
      }
    } else if (image) {
      return (
        <Image
          src="/images/vector/image.svg"
          alt="image"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          width={20}
          height={20}
        />
      );
    } else {
      return (
        <Add className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-omblue-500" />
      );
    }
  };

  return (
    <div
      className={`min-w-[180px] min-h-[115px] bg-omblue-50 relative rounded-md ${
        disabled && !existingFile ? 'cursor-default' : 'cursor-pointer'
      }`}
      onClick={handleClick}
    >
      {renderFileIcon()}
      {!selectedFile && !existingFile && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf, .jpg, .jpeg, .tiff, .png"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default UploadCard;
