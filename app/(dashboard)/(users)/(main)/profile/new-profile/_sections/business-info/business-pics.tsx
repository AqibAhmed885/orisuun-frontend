import FormLayout from '@/components/ui/form-layout';
import Dropzone from '@/components/ui/dropzone';
import { generateUploadFileSasTokenData } from '@/server-actions/verification';
import { ProfileBusinessFormData } from '@/utils/schema';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
  businessInfoStep: number;
  setBusinessInfoStep: Dispatch<SetStateAction<number>>;
  onSubmit: any;
  loader: boolean
}

const BusinessPics: React.FC<IProps> = ({
  businessInfoStep,
  setBusinessInfoStep,
  onSubmit,
  loader
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    getValues
  } = useFormContext<ProfileBusinessFormData>();

  const [sasToken, setSasToken] = useState('');
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
  const { id } = useParams();

  // const handleFileUpload = async (files: File[], fileType: 'image' | 'video') => {
  //   debugger
  //   if (!files[0]) return;

  //   const file = files[files.length - 1];
  //   const fileExtension = file?.name?.split('.')?.pop();
  //   const randomName = `${uuidv4()}.${fileExtension}`;
  //   const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${randomName}?${sasToken}`;

  //   const config = {
  //     headers: {
  //       'x-ms-blob-type': 'BlockBlob',
  //       'Content-Type': file.type,
  //     },
  //   };

  //   try {
  //     // Upload the file to Azure Blob Storage
  //     const res = await axios.put(blobUrl, file, config);      

  //     if (res.status === 201) {
  //       const url = res?.config?.url?.split('??')[0];

  //       const currentImages = getValues('images') || [];
  //       const currentVideos = getValues('videos') || [];

  //       if (fileType === 'image') {
  //         setValue('images', [...currentImages, url]);
  //       } else if (fileType === 'video') {
  //         setValue('videos', [...currentVideos, url]);
  //       }
  //     }

  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };

  const handleFileUpload = async (files: File[], fileType: 'image' | 'video') => {
    if (files.length === 0) return;

    const currentFiles = fileType === 'image' ? getValues('images') || [] : getValues('videos') || [];
    const maxFiles = fileType === 'image' ? 12 : 6;

    if (currentFiles.length + files.length > maxFiles) {
      toast(`Maximum ${maxFiles} ${fileType}s allowed. You can upload ${maxFiles - currentFiles.length} more.`, {
        type: 'error',
        toastId: `${fileType}-upload-error`,
        autoClose: 2000,
      });
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExtension = file?.name?.split('.')?.pop();
      const randomName = `${uuidv4()}.${fileExtension}`;
      const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/user-profile/${randomName}?${sasToken}`;

      try {
        const res = await axios.put(blobUrl, file, {
          headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': file.type,
          },
        });

        if (res.status === 201) {
          uploadedUrls.push(res?.config?.url?.split('??')[0]);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    if (uploadedUrls.length > 0) {
      setValue(fileType === 'image' ? 'images' : 'videos', [...currentFiles, ...uploadedUrls]);
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
  }, [generateUploadFileSasTokenfunc]);

  return (
    <FormLayout
      title="Profile photos and videos"
      description="Please upload any relevant photos (maximum of 12 photos) or a video"
      position="start"
      variant="equal"
      nextButtonType="submit"
      showBack={true}
      disableNext={isLoading || loader}
      handleNext={onSubmit}
      handleBack={() => setBusinessInfoStep(businessInfoStep - 1)}
    >
      <div className="flex flex-col w-full mb-10 rounded-lg gap-6 md:py-6 lg:px-6">

        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
            Photos
          </label>
          <Dropzone
            acceptedFileTypes="image"
            maxSize={5 * 1024 * 1024}
            layout="normal"
            multiple
            setValue={setValue}
            valueKey={"images"}
            onFilesUpload={async (files: File[]) => {
              if (files?.length <= 12) {
                setIsLoading(true);
                try {
                  handleFileUpload(files, 'image');
                } catch (error) {
                  console.error('Error uploading files:', error);
                } finally {
                  setIsLoading(false);
                }
              } else {
                toast('No more than 12 images are allowed', {
                  type: 'error',
                  toastId: 'image-upload-error',
                  autoClose: 2000,
                });
                setIsLoading(false);
              }
            }}
            storedFile={watch('images')}
          />
        </div>

        {/* Video Upload Section */}
        <div className="space-y-3">
          <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
            Video
          </label>
          <Dropzone
            acceptedFileTypes="video"
            maxSize={50 * 1024 * 1024} // Allow larger file size for videos
            layout="normal"
            multiple
            setValue={setValue}
            valueKey={"videos"}
            onFilesUpload={async (files: File[]) => {
              if (files?.length <= 6) {
                setIsLoading(true);
                try {
                  handleFileUpload(files, 'video');
                } catch (error) {
                  console.error('Error uploading video:', error);
                } finally {
                  setIsLoading(false);
                }
              }
              else {
                toast('No more than 6 videos are allowed', {
                  type: 'error',
                  toastId: 'video-upload-error',
                  autoClose: 2000,
                });
                setIsLoading(false);
              }
            }}
            storedFile={watch('videos')}
          />
        </div>

        {/* Video URL Input (optional) */}

      </div>
    </FormLayout>
  );
};

export default BusinessPics;
