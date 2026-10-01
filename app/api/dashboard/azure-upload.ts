import { generateUploadFileSasTokenDataForChat } from '@/server-actions/verification';
import axios from 'axios';
import { on } from 'events';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResponse {
  success: boolean;
  url?: string;
  fileId?: string;
  fileName?: string;
  size?: number;
  error?: string;
  contentType?: string;

}

export async function uploadFileToAzure(
  file: File,
  containerPath: string = 'chat-documents',
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  try {
    // Generate SAS token for upload
    const sasTokenResult = await generateUploadFileSasTokenDataForChat();

    if (!sasTokenResult || !sasTokenResult.token) {
      throw new Error('Failed to get upload token');
    }

    // Generate unique filename while preserving original extension
    const fileExtension = file.name.split('.').pop() || '';
    const originalFileName = file.name;
    const randomName = `${uuidv4()}${fileExtension ? `.${fileExtension}` : ''}`;

    // Construct the blob URL with SAS token
    const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/${containerPath}/${randomName}?${sasTokenResult.token}`;

    // Configure upload request
    const config = {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type || 'application/octet-stream',
      },
      onUploadProgress: (progressEvent: any) => {
        if (!progressEvent.total) return;
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // report progress to caller if provided
        if (typeof onProgress === 'function') {
          try { onProgress(percentCompleted); } catch (e) { /* noop */ }
        }
      }

    };

    // Perform upload
    const uploadResponse = await axios.put(blobUrl, file, config);

    if (uploadResponse.status !== 201) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    // Get public URL without SAS token
    const publicUrl = blobUrl.split('?')[0];

    return {
      success: true,
      url: publicUrl,
      fileId: randomName,
      fileName: originalFileName,
      size: file.size,
      contentType: file.type,
    };

  } catch (error: any) {
    console.error('❌ Azure upload error:', error);
    console.error('❌ Error details:', error.message, error.response?.data);
    
    return {
      success: false,
      error: error.message || 'Failed to upload file',
    };
  }
}

// Helper function to validate file before upload
export function validateFile(
  file: File, 
  maxSizeMB: number = 5,
  allowedTypes?: string[]
): { isValid: boolean; error?: string } {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  // Check file type if specified
  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type.toLowerCase();
    const isAllowedType = allowedTypes.some(type => 
      fileType.startsWith(type.toLowerCase())
    );

    if (!isAllowedType) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }
  }

  return { isValid: true };
}

// Example usage of allowed file types
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  ALL: ['*/*']
};
