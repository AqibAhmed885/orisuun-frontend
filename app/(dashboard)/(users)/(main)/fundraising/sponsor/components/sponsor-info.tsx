import Dropzone from '@/components/ui/dropzone';
import Input from '@/components/ui/input';
import { generateUploadFileSasTokenData } from '@/server-actions/verification';
import { CreateSponsorSchema } from '@/utils/schema';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

const SponsorInfo = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateSponsorSchema>();
  const [sasToken, setSasToken] = useState('');
  const handleFileUpload = async (files: File[]) => {
    if (!files[0]) return;
    const file = files[files.length - 1];
    const fileExtension = file?.name?.split('.')?.pop();
    const randomName = `${uuidv4()}.${fileExtension}`;
    const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${randomName}?${sasToken}`;
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
        setValue('Picture', url);
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
    <div className="max-w-[465px] mx-auto w-full flex flex-col gap-6">
      <div className="space-y-3">
        <label
          htmlFor="profile-pic"
          className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
        >
          Profile Picture{' '}
          <span className="mr-2 font-[0.7rem] text-red-500">*</span>
        </label>
        <Dropzone
          acceptedFileTypes="image"
          maxSize={5242880}
          layout="circular"
          onFilesUpload={async (files: File[]) => await handleFileUpload(files)}
          storedFile={watch('Picture') ? [watch('Picture')] : []}
        />
        {errors.Picture?.message && (
          <span className="text-sm text-red-500">Picture is required</span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label
          htmlFor="sponsorName"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Sponsor Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          id="sponsorName"
          placeholder="Sponsor Name"
          className="h-11 border-black-200 placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm"
          {...register('Name')}
          error={errors.Name?.message}
          name="Name"
        />
      </div>
      <div className="flex flex-col gap-3">
        <label
          htmlFor="slogan"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Slogan
        </label>
        <Input
          type="text"
          id="slogan"
          placeholder="Company Tagline"
          className="h-11 border-black-200 placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm"
          {...register('Slogan')}
          error={errors.Slogan?.message}
          name="Slogan"
        />
      </div>
      <div className="flex flex-col gap-3">
        <label
          htmlFor="website"
          className="text-sm font-semibold text-black-900 flex gap-1"
        >
          Website URL
        </label>
        <Input
          type="text"
          id="website"
          placeholder="https://yoursite.com"
          className="h-11 border-black-200 placeholder:text-black-200 w-full border rounded-md px-4 py-3 box-border text-sm"
          {...register('Website')}
          error={errors.Website?.message}
          name="Website"
        />
      </div>
    </div>
  );
};

export default SponsorInfo;
