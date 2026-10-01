import Trash from '@/icons/trash';
import FileIcon from '@/icons/upload-icons/file-icon';
import React from 'react';

const UploadedFile = ({
  file,
  readOnly = false,
  handleDelete,
}: {
  file?: any;
  readOnly?: boolean;
  handleDelete?: VoidFunction;
}) => {

  if (!file) return <></>;
  return (
    <li className="flex items-center justify-between p-4 border rounded-lg border-omblue-200">
      <FileIcon />
      <div className="flex flex-col flex-grow ms-4 gap-1">
        <span className="font-medium text-blue-500 truncate text-h9 2xl:text-scaled-h9">
          {file.DocumentOriginalName}
        </span>
        <span className="font-normal text-blue-300 truncate text-h9 2xl:text-scaled-h9">
          {(file.FileSize / 1024).toFixed(2)}{' '}
          {file.FileSize / 1024 > 1024 ? 'MB' : 'KB'}
        </span>
      </div>
      {/* <button disabled={readOnly} onClick={handleDelete} className="">
        <Trash />
      </button> */}
    </li>
  );
};

export default UploadedFile;