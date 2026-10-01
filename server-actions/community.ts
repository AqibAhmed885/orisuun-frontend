import React from 'react';
import axios from 'axios';
import { generateUploadFileSasTokenData, generateUploadFileSasTokenDataForChat } from './verification';
import { v4 as uuidv4 } from 'uuid';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

export interface CreateCommunityPayload {
  Name: string;
  Description: string;
  CreatedBy: string;
  City: string;
  Country: string;
  ProfilePhotoUrl: string;
  ProfilePhotoId: string;
  ProfilePhotoSize: number;
  InitialMemberIds: string[];
}

export interface CreateCommunityResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Upload image to Azure Blob Storage using axios (improved version)
 */
export async function uploadImageToAzure(file: File): Promise<{
  success: boolean;
  url?: string;
  photoId?: string;
  size?: number;
  error?: string;
}> {
  try {

    // Generate SAS token for upload - try chat token as fallback
    let sasTokenResult = await generateUploadFileSasTokenDataForChat();


    // If the chat SAS token fails, fallback to the main token
    if (!sasTokenResult) {
      throw new Error('Failed to get upload token from both endpoints');
    }

    // const { sasUrl, containerName, token } = sasTokenResult;

    // Generate unique filename using uuid
    const fileExtension = file.name.split('.').pop() || 'png';
    const randomName = `${uuidv4()}.${fileExtension}`;
    // Use different container paths based on which token we got
    const containerPath = 'chat-documents';

    const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/${containerPath}/${randomName}?${sasTokenResult.token}`;

    // Upload using axios
    const config = {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
    };

    const uploadResponse = await axios.put(blobUrl, file, config);

    if (uploadResponse.status !== 201) {
      console.error('❌ Upload failed with status:', uploadResponse.status);
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    // Extract the public URL (remove SAS parameters)
    const publicUrl = blobUrl.split('?')[0];

    return {
      success: true,
      url: publicUrl,
      photoId: randomName,
      size: file.size,
    };
  } catch (error: any) {
    console.error('❌ Azure upload error:', error);
    console.error('❌ Error details:', error.message, error.response?.data);
    return {
      success: false,
      error: error.message || 'Failed to upload image',
    };
  }
}

/**
 * Create a new community via API
 */
export async function createCommunity(
  data: Omit<CreateCommunityPayload, 'ProfilePhotoUrl' | 'ProfilePhotoId' | 'ProfilePhotoSize'> & {
    imageFile?: File | null;
  }
): Promise<CreateCommunityResponse> {

  try {
    let profilePhotoUrl = '';
    let profilePhotoId = '';
    let profilePhotoSize = 0;

    // Upload image if provided
    if (data.imageFile) {

      const uploadResult = await uploadImageToAzure(data.imageFile);
      if (!uploadResult.success) {
        console.error('❌ Image upload failed:', uploadResult.error);
        return {
          success: false,
          message: uploadResult.error || 'Failed to upload image',
        };
      }
      profilePhotoUrl = uploadResult.url || '';
      profilePhotoId = uploadResult.photoId || '';
      profilePhotoSize = uploadResult.size || 0;
    } else {
      
    }

    // Prepare payload for API
    const payload: CreateCommunityPayload = {
      Name: data.Name,
      Description: data.Description,
      CreatedBy: data.CreatedBy,
      City: data.City,
      Country: data.Country,
      ProfilePhotoUrl: profilePhotoUrl,
      ProfilePhotoId: profilePhotoId,
      ProfilePhotoSize: profilePhotoSize,
      InitialMemberIds: data.InitialMemberIds || [],
    };

    // Call the API
    const response = await axios.post(
      `${apiEndpoint}/chat/Createcommunity`,
      payload,
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );


    return {
      success: true,
      message: response.data.Message || 'Community created successfully',
      data: response.data.Result,
    };
  } catch (error: any) {
    console.error('❌ Create community error:', error);
    console.error('❌ Error response status:', error.response?.status);
    console.error('❌ Error response data:', error.response?.data);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error config:', error.config);

    return {
      success: false,
      message: error.response?.data?.Message || error.message || 'Failed to create community',
      data: error.response?.data?.Result,
    };
  }
}

/**
 * Get current user ID (you'll need to implement this based on your auth system)
 * This is a placeholder - replace with your actual user context/auth logic
 */
export function getCurrentUserId(): string {
  // This should come from your authentication context/Redux store
  // For now, returning a placeholder - you'll need to update this
  if (typeof window !== 'undefined') {
    // Try to get from localStorage, Redux store, or auth context
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.Id || user.id || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }
  return ''; // Return empty string if no user found
}

/**
 * React hook helper for file uploads (can be used in components)
 * Usage example:
 * const { uploadFile, sasToken, isLoading } = useFileUpload();
 */
export function useFileUpload() {
  const [sasToken, setSasToken] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  const generateSasToken = React.useCallback(async () => {
    try {
      
      const tokenResponse = await generateUploadFileSasTokenData();
      if (tokenResponse?.token) {
        setSasToken(tokenResponse.token);
      }
    } catch (error) {
      console.error('❌ Error generating SAS token:', error);
    }
  }, []);

  const uploadFile = React.useCallback(async (
    files: File[],
    onSuccess?: (fileName: string, url: string) => void,
    onError?: (error: string) => void
  ) => {
    if (!files[0]) {
      onError?.('No file selected');
      return;
    }

    const file = files[0];
    setIsLoading(true);

    try {
      

      if (!sasToken) {
        throw new Error('SAS token not available');
      }

      // Generate unique filename
      const fileExtension = file.name.split('.').pop() || 'png';
      const randomName = `${uuidv4()}.${fileExtension}`;
      const fileName = `community-${randomName}`;

      // Create blob URL
      const sasTokenResult = await generateUploadFileSasTokenData();
      if (!sasTokenResult?.sasUrl) {
        throw new Error('Failed to get SAS URL');
      }

      const blobUrl = `${sasTokenResult.sasUrl}/${fileName}?${sasToken}`;

      // Upload using axios
      const config = {
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': file.type,
        },
      };

      const response = await axios.put(blobUrl, file, config);

      if (response.status === 201) {
        const publicUrl = blobUrl.split('?')[0];
        
        onSuccess?.(fileName, publicUrl);
      } else {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('❌ Error uploading file:', error);
      onError?.(error.message || 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  }, [sasToken]);

  // Generate token on mount
  React.useEffect(() => {
    generateSasToken();
  }, [generateSasToken]);

  return {
    uploadFile,
    sasToken,
    isLoading,
    regenerateToken: generateSasToken
  };
}

/**
 * Example usage in a React component:
 *
 * import { useFileUpload } from '@/server-actions/community';
 *
 * function MyComponent() {
 *   const { uploadFile, isLoading } = useFileUpload();
 *
 *   const handleFileSelect = async (files: File[]) => {
 *     await uploadFile(
 *       files,
 *       (fileName, url) => {
 *         // Handle success - update form state, etc.
 *       },
 *       (error) => {
 *         console.error('Upload failed:', error);
 *         // Handle error - show toast, etc.
 *       }
 *     );
 *   };
 *
 *   return (
 *     <input
 *       type="file"
 *       onChange={(e) => handleFileSelect(Array.from(e.target.files || []))}
 *       disabled={isLoading}
 *     />
 *   );
 * }
 */
