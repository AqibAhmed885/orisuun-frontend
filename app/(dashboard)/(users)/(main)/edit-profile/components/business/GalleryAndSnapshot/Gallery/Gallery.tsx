'use client';

import { generateUploadFileSasTokenData } from '@/server-actions/verification';
import axios from 'axios';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

const Gallery = ({ currentUserData }) => {
  const { watch, setValue, getValues, trigger, reset, formState: { errors } } = useFormContext();

  useEffect(() => {
    if (currentUserData) {
      const mappedData = {
        Gallery: {
          photos: (currentUserData.BusinessPhotos || []).map(p => p.ProfilePicture),
          videos: (currentUserData.BusinessVideos || []).map(v => v.ProfileVideo),
        },
      }
      reset(mappedData);
    }
  }, [currentUserData])

  const [uploadedFilesMeta, setUploadedFilesMeta] = React.useState<{ name: string; size: number; url: string }[]>([]);
  const files = watch('Gallery') as {
    photos: string[];
    videos: string[];
  } || { photos: [], videos: [] };

  const [sasToken, setSasToken] = React.useState<string>('');

  React.useEffect(() => {
    const fetchSasToken = async () => {
      const tokenData = await generateUploadFileSasTokenData();
      setSasToken(tokenData.token);
    };
    fetchSasToken();
  }, []);

  const uploadToAzureBlob = async (file: File, sasToken: string): Promise<string | null> => {
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${uniqueFileName}?${sasToken}`;
    const config = {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
    };
    try {
      const res = await axios.put(blobUrl, file, config);
      if (res.status === 201) {
        return blobUrl.split('?')[0]; // return clean URL
      }
    } catch (err) {
      console.error('Azure upload error:', err);
    }
    return null;
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0 || !sasToken) {
      return;
    }
    const prevGallery = getValues('Gallery') || { photos: [], videos: [] };
    const newPhotos: string[] = [];
    const newVideos: string[] = [];
    const uniqueFiles = selectedFiles.filter(file => {
      return !uploadedFilesMeta.some(meta => meta.name === file.name && meta.size === file.size);
    });
    if (uniqueFiles.length === 0) {
      toast.error('All selected files are already uploaded.');
      return;
    }
    const newMeta: { name: string; size: number; url: string }[] = [];
    for (const file of uniqueFiles) {
      const uploadedUrl = await uploadToAzureBlob(file, sasToken);
      if (uploadedUrl) {
        newMeta.push({ name: file.name, size: file.size, url: uploadedUrl });
        if (file.type.startsWith('image/')) {
          newPhotos.push(uploadedUrl);
        } else if (file.type.startsWith('video/')) {
          newVideos.push(uploadedUrl);
        }
      }
    }
    const updatedGallery = {
      photos: [...(prevGallery.photos || []), ...newPhotos],
      videos: [...(prevGallery.videos || []), ...newVideos],
    };
    setValue('Gallery', updatedGallery);
    await trigger('Gallery');
    setUploadedFilesMeta(prev => [...prev, ...newMeta]);
    toast.success('Added Files Successfully!');
  };


  const removeFile = (type: 'photos' | 'videos', index: number) => {
    const updatedList = [...files[type]];
    const removedUrl = updatedList[index];
    updatedList.splice(index, 1);
    const updatedGallery = {
      ...files,
      [type]: updatedList,
    };
    setValue('Gallery', updatedGallery);
    setUploadedFilesMeta(prevMeta =>
      prevMeta.filter(meta => meta.url !== removedUrl)
    );
    toast.success('Removed File Successfully!');
  };

  return (
    <div className='w-[95%] mx-auto min-h-[30rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
      <div className="max-w-[97%] mx-auto">
        <div className="pt-5">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Gallery</h2>

          <div className="border border-dashed border-gray-300 rounded-xl min-h-[24rem] flex flex-col items-center justify-center text-center px-4 py-10">
            <svg width="54" height="53" viewBox="0 0 59 58" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.75" y="1" width="57" height="56" rx="11.5" fill="white" />
              <rect x="0.75" y="1" width="57" height="56" rx="11.5" stroke="#F2F4F7" />
              <path d="M35.0843 37H35.9262C36.7355 37 37.1402 37 37.3633 36.8313C37.5576 36.6843 37.6778 36.4596 37.6924 36.2163C37.709 35.9371 37.4846 35.6004 37.0356 34.9271L34.527 31.1641C34.1561 30.6077 33.9706 30.3295 33.7368 30.2325C33.5324 30.1478 33.3027 30.1478 33.0984 30.2325C32.8646 30.3295 32.6791 30.6077 32.3082 31.1641L31.688 32.0943M35.0843 37L28.6805 27.7501C28.3122 27.2182 28.1281 26.9522 27.8981 26.8587C27.6969 26.7769 27.4717 26.7769 27.2704 26.8587C27.0404 26.9522 26.8563 27.2182 26.488 27.7501L21.5328 34.9077C21.0636 35.5854 20.829 35.9243 20.8423 36.2061C20.854 36.4515 20.9733 36.6793 21.1685 36.8286C21.3926 37 21.8047 37 22.629 37H35.0843ZM36.7509 24.5C36.7509 25.8807 35.6316 27 34.2509 27C32.8702 27 31.7509 25.8807 31.7509 24.5C31.7509 23.1193 32.8702 22 34.2509 22C35.6316 22 36.7509 23.1193 36.7509 24.5Z" stroke="#101828" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-gray-600 mb-4 text-[14px]">
              Upload images & videos to the gallery of your business
            </p>

            <label className="text-[14px] bg-[#2357C6] text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
              Upload Files
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* View Files Component */}
            <div className="w-full flex flex-wrap gap-4 mt-8">
              {files.photos?.map((url: string, index: number) => (
                <div key={`photo-${index}`} className="relative group border rounded-md overflow-hidden h-[192px]">
                  <img
                    src={url}
                    alt={`Uploaded photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={() => removeFile('photos', index)}
                    className="absolute top-2 right-2 bg-gray-700 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600"
                    title="Remove"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 1L1 13M1 1L13 13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}

              {files.videos?.map((url: string, index: number) => (
                <div key={`video-${index}`} className="relative group border rounded-md overflow-hidden h-[192px]">
                  <video src={url} controls className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeFile('videos', index)}
                    className="absolute top-2 right-2 bg-gray-700 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-600"
                    title="Remove"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 1L1 13M1 1L13 13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {(errors.Gallery as any)?.message && (
              <p className="mt-1 text-[16px] text-red-600">
                {(errors.Gallery as any).message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
