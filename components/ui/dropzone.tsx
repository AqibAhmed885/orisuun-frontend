import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { cn } from '@/utils/utils';
import UploadIcon from '@/icons/verification/upload-icon';
import Image from 'next/image';
import FileIcon from '@/icons/upload-icons/file-icon';
import Trash from '@/icons/trash';
import Bin from '@/icons/upload-icons/bin';
import EditIcon from '@/icons/edit-icon';

interface DropzoneProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  onFilesUpload?: (files: File[]) => void;
  onFileRemove?: (file: File) => void;
  layout?: 'classic' | 'normal' | 'circular';
  maxSize?: number; // in bytes
  acceptedFileTypes?: 'image' | 'pdf' | 'xlsx' | 'video';
  multiple?: boolean;
  disabled?: boolean;
  storedFile?: (File | string)[];
  setValue?: any;
  valueKey?: string;
  previewClasses?: string;
}

const Dropzone: React.FC<DropzoneProps> = ({
  className,
  previewClasses,
  onFilesUpload = () => {},
  onFileRemove = () => {},
  layout = 'normal',
  maxSize = 10 * 1024 * 1024, // default to 10MB
  acceptedFileTypes = 'pdf',
  multiple = false,
  disabled = false,
  storedFile = null,
  setValue = () => {},
  valueKey = '',
}) => {
  const [files, setFiles] = useState<any>(storedFile);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        const isValidType =
          acceptedFileTypes === 'image'
            ? file.type.startsWith('image/')
            : acceptedFileTypes === 'pdf'
            ? file.type === 'application/pdf'
            : acceptedFileTypes === 'xlsx'
            ? file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : acceptedFileTypes === 'video'
            ? file.type.startsWith('video/')
            : false;
  
        return isValidType && file.size <= maxSize;
      });
  
      if (validFiles.length > 0) {
        if (onFilesUpload) {
          onFilesUpload(validFiles);
        }
      }
  
      if (validFiles.length !== acceptedFiles.length) {
        alert(
          `Some files were rejected. Please upload ${
            acceptedFileTypes === 'image'
              ? 'JPG or PNG'
              : acceptedFileTypes === 'pdf'
              ? 'PDF'
              : acceptedFileTypes === 'xlsx'
              ? 'XLSX'
              : 'Video'
          } files no larger than ${maxSize / (1024 * 1024)}MB.`
        );
      }
    },
    [onFilesUpload, maxSize, acceptedFileTypes]
  );

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);

      if (onFileRemove && newFiles.length === 0) {
        onFileRemove(fileToRemove);
      }

      if (setValue && valueKey) {
        setValue(valueKey, newFiles);
      } else if (setValue) {
        setValue(newFiles);
      }

      return newFiles;
    });
  };

  useEffect(() => {
    if (storedFile) {
      setFiles(storedFile);
    }
  }, [storedFile]);

  useEffect(() => {
    if (!storedFile) {
      setFiles([]);
    }
  }, []);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept:
      acceptedFileTypes === 'image'
        ? { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }
        : acceptedFileTypes === 'pdf'
        ? { 'application/pdf': ['.pdf'] }
        : acceptedFileTypes === 'xlsx'
        ? {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
              ['.xlsx'],
          }
        : acceptedFileTypes === 'video'
        ? { 'video/mp4': ['.mp4'], 'video/webm': ['.webm'] }
        : {},
    maxSize,
    multiple,
    disabled,
  };

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone(dropzoneOptions);

  const renderDropzoneContent = () => (
    <div
      className={cn(
        'flex flex-col gap-3 items-center justify-center cursor-pointer transition-colors duration-300 ease-in-out',
        isDragActive ? 'border-[#9AB2E5] bg-omblue-50' : 'border-omblue-200',
        layout === 'circular'
          ? 'rounded-full w-40 h-40 border relative'
          : 'px-6 py-4 rounded-lg border-2',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
    >
      {files?.length <= 0 || layout !== 'circular' ? (
        <>
          <input {...getInputProps()} />
          <UploadIcon className="text-omblue-600 w-10 h-10" />
          <div className="flex flex-col items-center">
            <p className="font-semibold text-h9 2xl:text-scaled-h9 text-omblue-700">
              Click to upload{' '}
              <span className="font-normal text-omblue-600">
                {layout !== 'circular' && 'or drag and drop'}
              </span>
            </p>
            <p className="mt-1 text-xs font-medium text-omblue-600">
              {acceptedFileTypes === 'image'
                ? 'JPG, PNG'
                : acceptedFileTypes === 'pdf'
                ? 'PDF'
                : acceptedFileTypes === 'xlsx'
                ? 'XLSX'
                : 'MP4, WebM'}{' '}
              (max. {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
        </>
      ) : (
        layout === 'circular' && (
          <>
            {files[0]?.length > 0 && (
              <Image
                src={files[0]}
                alt={`Uploaded file ${0}`}
                className="w-full h-full object-cover rounded-full"
                width={144}
                height={104}
              />
            )}
            <button className="absolute bottom-1 right-1 border border-omblue-100 text-omblue-500 bg-white rounded-full p-1.5">
              <input {...getInputProps()} />
              <EditIcon />
            </button>
          </>
        )
      )}
    </div>
  );

  const renderFileCards = () => {
    return (
      <div className={`w-full flex flex-wrap items-center gap-6 lg:mt-4 ${previewClasses}`}>
        {files.map((file, index) => {
          const isVideo =
            acceptedFileTypes == 'video' || file.type?.startsWith('video/');
          return isVideo ? (
            <div key={index} className="relative w-36 h-24 mb-2">
              <video
                className="w-full h-full object-contain rounded"
                controls
                src={
                  typeof file === 'string' ? file : URL.createObjectURL(file)
                }
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 border bg-danger-50 text-danger-500 rounded w-[44px] h-[44px] flex items-center justify-center"
                >
                <Bin />
              </button>
            </div>
          ) : acceptedFileTypes === 'pdf' ? (
            <li
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg border-omblue-200"
            >
              <FileIcon />
              <div className="flex flex-col flex-grow ms-4 gap-1">
                <>
                  <span className="font-medium text-blue-500 truncate text-h9 2xl:text-scaled-h9">
                    {file.DocumentOriginalName || file.name || file.FileName}
                  </span>
                  <span className="font-normal text-blue-300 truncate text-h9 2xl:text-scaled-h9">
                    {((file.FileSize || file.size) / 1024).toFixed(2)}{' '}
                    {(file.FileSize || file.size) / 1024 > 1024 ? 'MB' : 'KB'}
                  </span>
                </>
              </div>
              <button onClick={() => removeFile(index)} className="">
                <Trash />
              </button>
            </li>
          ) : (
            layout !== 'circular' && (
              <div
                key={index}
                className="relative w-36 h-24 bg-gray-200 rounded flex justify-center items-center"
              >
                <Image
                  src={
                    typeof file === 'string' ? file : URL.createObjectURL(file)
                  }
                  alt={`Uploaded file ${index}`}
                  className="w-full h-full object-cover"
                  width={144}
                  height={104}
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 border bg-danger-50 text-danger-500 rounded w-[44px] h-[44px] flex items-center justify-center"
                >
                  <Bin />
                </button>
              </div>
            )
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div {...getRootProps()}>{renderDropzoneContent()}</div>
      {files?.length > 0 && renderFileCards()}
    </div>
  );
};

export default Dropzone;
