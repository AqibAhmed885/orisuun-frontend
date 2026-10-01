import axios from 'axios';

const apiBaseUrl = 'https://api.orisuun.com/api';
const header = {
    XApiKey: process.env.NEXT_PUBLIC_API_KEY || '',
    accept: '*/*',
};

/**
 * Get all resources (admin view)
 * @param params - Optional filters
 */
export const getAllResources = async (params?: {
    resourceTypeId?: number;
    countryId?: number;
    includeExpired?: boolean;
    page?: number;
    pageSize?: number;
}): Promise<any[]> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.resourceTypeId) queryParams.append('resourceTypeId', params.resourceTypeId.toString());
        if (params?.countryId) queryParams.append('countryId', params.countryId.toString());
        if (params?.includeExpired !== undefined) queryParams.append('includeExpired', params.includeExpired.toString());
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

        const url = `${apiBaseUrl}/Resources/GetAllResources?${queryParams.toString()}`;
        const res = await axios.get(url, { headers: header });
        return res.data.Result?.Resources || [];
    } catch (err) {
        console.error('getAllResources error', err);
        return [];
    }
};

/**
 * Get expired resources queue
 */
export const getExpiredResources = async (): Promise<any[]> => {
    try {
        const url = `${apiBaseUrl}/Resources/GetExpiredResources`;
        const res = await axios.get(url, { headers: header });
        return res.data.Result || [];
    } catch (err) {
        console.error('getExpiredResources error', err);
        return [];
    }
};

/**
 * Get update request queue
 */
export const getUpdateRequestQueue = async (): Promise<any[]> => {
    try {
        const url = `${apiBaseUrl}/Resources/GetUpdateRequestQueue`;
        const res = await axios.get(url, { headers: header });
        return res.data.Result || [];
    } catch (err) {
        console.error('getUpdateRequestQueue error', err);
        return [];
    }
};

/**
 * Delete a resource
 * @param resourceId - Resource ID
 */
export const deleteResource = async (resourceId: string): Promise<any> => {
    try {
        const url = `${apiBaseUrl}/Resources/DeleteResource?id=${resourceId}`;
        const res = await axios.delete(url, { headers: header });
        return res;
    } catch (err) {
        console.error('deleteResource error', err);
        throw err;
    }
};

/**
 * Pause or Resume a resource
 * @param resourceId - Resource ID
 * @param pause - true to pause, false to resume
 */
export const pauseOrResumeResource = async (resourceId: string, pause: boolean): Promise<any> => {
    try {
        const url = `${apiBaseUrl}/Resources/PauseOrResumeResource?id=${resourceId}&pause=${pause}`;
        const res = await axios.post(url, {}, { headers: header });
        return res;
    } catch (err) {
        console.error('pauseOrResumeResource error', err);
        throw err;
    }
};

/**
 * Toggle resource status (pause/resume) - Legacy wrapper
 * @param resourceId - Resource ID
 * @param isPaused - Current pause status
 */
export const toggleResourceStatus = async (resourceId: string, isPaused?: boolean): Promise<any> => {
    try {
        // Toggle: if currently paused, resume it; otherwise pause it
        const shouldPause = isPaused === undefined ? true : !isPaused;
        return await pauseOrResumeResource(resourceId, shouldPause);
    } catch (err) {
        console.error('toggleResourceStatus error', err);
        throw err;
    }
};

/**
 * Update a resource
 * @param payload - Resource data (must include Id)
 */
export const updateResource = async (payload: any): Promise<any> => {
    try {
        const url = `${apiBaseUrl}/Resources/UpdateResource`;
        const res = await axios.put(url, payload, {
            headers: {
                ...header,
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (err) {
        console.error('updateResource error', err);
        throw err;
    }
};

/**
 * Approve an update request
 * @param requestId - Request ID
 */
export const approveUpdateRequest = async (requestId: string): Promise<any> => {
    try {
        const url = `${apiBaseUrl}/Resources/ApproveUpdateRequest/${requestId}`;
        const res = await axios.put(url, {}, { headers: header });
        return res;
    } catch (err) {
        console.error('approveUpdateRequest error', err);
        throw err;
    }
};

/**
 * Reject an update request
 * @param requestId - Request ID
 */
export const rejectUpdateRequest = async (requestId: string): Promise<any> => {
    try {
        const url = `${apiBaseUrl}/Resources/RejectUpdateRequest/${requestId}`;
        const res = await axios.put(url, {}, { headers: header });
        return res;
    } catch (err) {
        console.error('rejectUpdateRequest error', err);
        throw err;
    }
};

/**
 * Submit an update request for a resource (public user)
 * @param resourceId - Resource ID
 * @param reason - Reason for update request
 * @param requestType - Optional type of request ('update' | 'deletion')
 * @param userId - Optional user ID submitting the request
 */
export const submitUpdateRequest = async (resourceId: string, reason: string, requestType?: string, userId?: string): Promise<any> => {
    try {
        // Use different endpoints based on request type
        const url = requestType === 'deletion'
            ? `${apiBaseUrl}/ResourceChangeRequest/SubmitDeleteRequest`
            : `${apiBaseUrl}/ResourceChangeRequest/SubmitChangeRequest`;

        const res = await axios.post(url, {
            UserId: userId || '1',
            ResourceId: resourceId,
            Reason: reason
        }, {
            headers: {
                ...header,
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (err) {
        console.error('submitUpdateRequest error', err);
        throw err;
    }
};

/**
 * Republish an expired resource
 * @param resourceId - Resource ID
 */
export const republishResource = async (resourceId: string): Promise<any> => {
    try {
        const url = `${apiBaseUrl}/Resources/RepublishResource/${resourceId}`;
        const res = await axios.put(url, {}, { headers: header });
        return res;
    } catch (err) {
        console.error('republishResource error', err);
        throw err;
    }
};
