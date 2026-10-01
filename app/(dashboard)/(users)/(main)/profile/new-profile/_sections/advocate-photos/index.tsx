import Dropzone from '@/components/ui/dropzone';
import Input from '@/components/ui/input';
import { generateUploadFileSasTokenData } from '@/server-actions/verification';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import Cookies from 'js-cookie';
import Verification from '../verification';
import FormLayout from '@/components/ui/form-layout';


interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  currentUser?: any;
}

const schema = z.object({
  images: z
    .array(z.string())
    .max(12, 'No more than 12 images are allowed')
    .optional()
    .nullable(),
  videoLink: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

const AdvocatePhotos: React.FC<IProps> = ({
  step,
  setStep,
  currentUser: user,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
    getValues,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // const { handleFileUpload } = useFileUploadHandler({
  //   onUploadSuccess: (fileName) => {
  //     if (watch('images')?.length > 0) {
  //       setValue('images', [...watch('images'), fileName]);
  //     } else {
  //       setValue('images', [fileName]);
  //     }
  //     toast('Images Uploaded', {
  //       type: 'success',
  //       toastId: fileName,
  //       autoClose: 2000,
  //     });
  //   },
  //   onUploadError: (error) => {
  //     console.error('Upload failed:', error);
  //     toast('Images Upload Failed', {
  //       type: 'error',
  //       toastId: 'image-upload-error',
  //       autoClose: 2000,
  //     });
  //   },
  // });
  const { profileData } = useSelector((state: RootState) => state.user);
  const [sasToken, setSasToken] = useState('');
  const currentUser = user
    ? user
    : typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id && profileData) {
      reset({
        images: profileData?.BusinessPhotos?.map(
          (image) => image.ProfilePicture
        ),
        videoLink: profileData?.VideoLink,
      });
    }
  }, [id, reset]);

  const handleFileUpload = async (files: File[]) => {
    // const handleFileUpload = async (files, sasToken, userId, userVerificationId, documentType) => {
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
      // Upload the file to Azure Blob Storage
      const res = await axios.put(blobUrl, file, config);

      // Prepare the request data to add verification documents
      if (res.status === 201) {
        const url = res?.config?.url?.split('??')[0];

        const currentImages = getValues('images') || [];

        setValue('images', [...currentImages, url]);
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
      // setIsLoading(true);
      const tokenResponse = await generateUploadFileSasTokenData();
      setSasToken(tokenResponse.token);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    generateUploadFileSasTokenfunc();
  }, []);
  const values = getValues();
  const onSubmit = async () => {
    setLoader(true);
    try {
      const paylaod = {
        UserId: currentUser.Id,
        UserProfileTypeId: currentUser.UserProfileTypeId,
        UserIndividualProfileId: currentUser.UserProfileDetailsId,
        ProfilePictureList: watch('images')?.map(
          (image: any, index: number) => ({
            OrigionalName: image,
          })
        ),
        // VideoLink: watch('videoLink')
      };

      try {
        const result = await axios.post(
          `${apiEndpoint}/MyProfile/CreateIndividualPhotos`,
          paylaod,
          {
            headers: {
              XApiKey:
                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              // 'Content-Type': 'multipart/form-data', // Important for FormData
            },
          }
        );

        if (result.status === 201) {
          setTimeout(() => {
            setLoader(false);
          }, 1000);
          currentUser.isProfileComplete = true;
          localStorage.setItem('userData', JSON.stringify(currentUser));
          Cookies.set('userData', JSON.stringify(currentUser));
          // dispatch(updateCurrentUser(result.data.Result));
          toast.success(result.data.Message);
          setStep(step + 1);
        }
      } catch (error) {
        console.error('Axios error:', error);
        setLoader(false);
        return {
          success: false,
          message: 'An Error Occurred',
        };
      }
    } catch (error) {
      setLoader(false);
      console.error('An error occurred during signup:', error);
    }
  };
  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLayout
        title="Advocate Information"
        description="Please upload any relevant photos (maximum of 12 photos)"
        position="start"
        nextButtonType="submit"
        disableNext={isLoading || loader}
        handleBack={() => setStep(step - 1)}
      >
        <div className="flex flex-col w-full mb-10 rounded-lg gap-6 md:py-6 lg:px-6">
          <div className="space-y-3">
            <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
              Pictures
            </label>
            <Dropzone
              acceptedFileTypes="image"
              maxSize={5 * 1024 * 1024}
              layout="normal"
              storedFile={watch('images')}
              multiple
              setValue={setValue}
              valueKey={'images'}
              onFilesUpload={async (files: File[]) => {
                if (files?.length <= 12) {
                  setIsLoading(true);
                  try {
                    handleFileUpload(files);
                    // const uploadPromises = files.map((file) =>
                    //   handleFileUpload([file])
                    // );
                    // await Promise.all(uploadPromises);
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
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="video"
              className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500"
            >
              Video
            </label>
            <Input
              id="video"
              placeholder="Enter youtube link"
              {...register('videoLink')}
              error={errors.videoLink && errors.videoLink?.message}
            />
          </div>
        </div>

        {/* <div className="flex flex-col-reverse md:mx-4 md:mt-auto md:ml-auto md:flex-row">
        <Button
          className={
            'text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold px-4 py-3 me-2 mb-2'
          }
          title="Back"
          // onClick={() => setBusinessInfoStep(businessInfoStep - 1)}
        />
        <Button
          className="min-w-full mb-2 btn-secondary text-h9 2xl:text-scaled-h9 ms-1 w-full md:min-w-[170px]"
          title="Continue"
          type="submit"
        />
      </div> */}
      </FormLayout>
    </form>
  )
};

export default AdvocatePhotos;
