import Dropzone from '@/components/ui/dropzone';
import { generateUploadFileSasTokenData } from '@/server-actions/verification';
import { CampaignSchema } from '@/utils/schema';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { fileUploadService } from '../../../../../../../api/dashboard/fundraising';
export default function MediaDropzone() {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    control,
    watch,
    getValues,
    clearErrors,
  } = useFormContext<CampaignSchema>();

  const [sasToken, setSasToken] = useState('');
  const handleUploadIndividualImage = async (file: File) => {
    try {
      const url = await fileUploadService.uploadIndividualImage(file, sasToken);
      const Pictures = getValues('Pictures') || [];
      setValue('Pictures', [...Pictures, url]);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files[0]) return;
    files.forEach((file) => {
      handleUploadIndividualImage(file);
    });
  };
  const handleVIdeoUpload = async (files: File[]) => {
    if (!files[0]) return;
    try {
      const file = files[files.length - 1];
      const url = await fileUploadService.uploadVideo(file, sasToken);
      setValue('Video', url);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };
  const generateUploadFileSasTokenfunc = useCallback(async () => {
    try {
      const tokenResponse = await generateUploadFileSasTokenData();
      setSasToken(tokenResponse.token);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    generateUploadFileSasTokenfunc();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label
          htmlFor="campaignTitle"
          className="block text-sm font-semibold text-black-900"
        >
          Pictures
        </label>
        <Dropzone
          acceptedFileTypes="image"
          multiple
          onFilesUpload={async (files: File[]) => await handleFileUpload(files)}
          storedFile={watch('Pictures') ? watch('Pictures') : []}
        />

        {errors.Pictures && (
          <span className="text-red-400 text-xs mt-2 m-1">
            {errors.Pictures?.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label
          htmlFor="campaignTitle"
          className="block text-sm font-semibold text-black-900"
        >
          Video
        </label>
        <Dropzone
          acceptedFileTypes="video"
          onFilesUpload={async (files: File[]) =>
            await handleVIdeoUpload(files)
          }
          storedFile={watch('Video') ? [watch('Video')] : []}
        />
      </div>
    </div>
  );
}
