'use server';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

export interface CreateProjectPayload {
  UserId: string;
  ProjectName: string;
  Headline: string;
  Description: string;
  AttachmentUrl: string;
  Location?: string;
  CountryId?: number;
  StateId?: number;
  CityId?: number;
  StartedDate: string;
  Status: string;
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Generate SAS token for project file uploads
 */
export async function generateUploadFileSasTokenForProjects() {
  try {
    const response = await axios.get(
      `${apiEndpoint}/UserVerification/GenerateUploadFileSasToken`,
      {
        headers: {
          XApiKey: apiKey,
        },
        timeout: 30000,
      }
    );
    return response.data.Result;
  } catch (error) {
    console.error('❌ Axios error getting SAS token:', error);
    return null;
  }
}

/**
 * Upload project attachment (image or PDF) to Azure Blob Storage
 */
export async function uploadProjectAttachmentToAzure(file: File): Promise<{
  success: boolean;
  url?: string;
  fileId?: string;
  size?: number;
  error?: string;
}> {
  try {
    // Get SAS token for upload
    const sasTokenResult = await generateUploadFileSasTokenForProjects();

    if (!sasTokenResult) {
      throw new Error('Failed to get upload token');
    }

    // Generate unique filename using uuid
    const fileExtension = file.name.split('.').pop() || 'unknown';
    const randomName = `${uuidv4()}.${fileExtension}`;
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
      fileId: randomName,
      size: file.size,
    };
  } catch (error: any) {
    console.error('❌ Azure upload error:', error);
    console.error('❌ Error details:', error.message, error.response?.data);
    return {
      success: false,
      error: error.message || 'Failed to upload attachment',
    };
  }
}

/**
 * Create a new project with attachment via API
 */
export async function createProjectWithAttachment(
  payload: CreateProjectPayload
): Promise<CreateProjectResponse> {
  try {
    const response = await axios.post(
      `${apiEndpoint}/Projects/CreateProject`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: apiKey,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: response.data.Message || 'Project created successfully',
        data: response.data.Result,
      };
    } else {
      return {
        success: false,
        message: response.data.Message || 'Failed to create project',
        error: response.data.error,
      };
    }
  } catch (error: any) {
    console.error('❌ Project creation error:', error);
    return {
      success: false,
      message: error.response?.data?.Message || 'Failed to create project',
      error: error.message,
    };
  }
}

/**
 * Standalone function to handle full project creation workflow:
 * 1. Upload attachment to Azure
 * 2. Create project via API
 */
export async function createProjectWithFile(
  file: File,
  projectData: Omit<CreateProjectPayload, 'AttachmentUrl'>
): Promise<CreateProjectResponse> {
  try {
    // Step 1: Upload file to Azure
    const uploadResult = await uploadProjectAttachmentToAzure(file);

    if (!uploadResult.success || !uploadResult.url) {
      return {
        success: false,
        message: 'Failed to upload project attachment',
        error: uploadResult.error,
      };
    }

    // Step 2: Create project with uploaded file URL
    const createPayload: CreateProjectPayload = {
      ...projectData,
      AttachmentUrl: uploadResult.url,
    };

    const projectResult = await createProjectWithAttachment(createPayload);
    return projectResult;
  } catch (error: any) {
    console.error('❌ Project creation workflow error:', error);
    return {
      success: false,
      message: 'Failed to complete project creation',
      error: error.message,
    };
  }
}
