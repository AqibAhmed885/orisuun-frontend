import axios from 'axios';
interface FileData {
    DocumentOriginalName: string;
    DocumentName: string;
    FileSize: number;
}

import { v4 as uuidv4 } from 'uuid';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
export const verfication = {
    generateUploadFileSasToken: async () => {
        const response = await axios.post(`${apiEndpoint}/User/GenerateUploadFileSasToken`);
        return response.data;
    },

    uploadFile: async (blobUrl: string, file: File) => {
        const config = {
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
        };
        return await axios.put(blobUrl, file, config);
    },

    addVerificationDocuments: async (data: {
        UserId: string;
        UserVerificationId: string;
        DocumentType: string;
        DocumentListsModel: any[];
    }) => {
        const response = await axios.post(`${apiEndpoint}/User/AddVerificationDocuments`, data);
        return response.data;
    },
    uploadCompanyBylawsFile: async (file: File, sasToken: string): Promise<FileData | null> => {
        const fileExtension = file.name.split('.').pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

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
                const fileName = url.split('/').pop().split('?')[0];

                return {
                    DocumentOriginalName: file.name,
                    DocumentName: fileName,
                    FileSize: file.size,
                };
            }
            return null;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },
    uploadCertificateFile: async (file: File, sasToken: string): Promise<FileData | null> => {
        const fileExtension = file.name.split('.').pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

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
                const fileName = url.split('/').pop().split('?')[0];

                return {
                    DocumentOriginalName: file.name,
                    DocumentName: fileName,
                    FileSize: file.size,
                };
            }
            return null;
        } catch (error) {
            console.error('Error uploading certificate:', error);
            throw error;
        }
    },
    uploadShareholderFile: async (file: File, sasToken: string): Promise<FileData | null> => {
        const fileExtension = file.name.split('.').pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

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
                const fileName = url.split('/').pop().split('?')[0];

                return {
                    DocumentOriginalName: file.name,
                    DocumentName: fileName,
                    FileSize: file.size,
                };
            }
            return null;
        } catch (error) {
            console.error('Error uploading shareholder file:', error);
            throw error;
        }
    },
    uploadPersonalDocument: async (file: File, sasToken: string): Promise<FileData | null> => {
        const fileExtension = file.name.split('.').pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

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
                const fileName = url.split('/').pop().split('?')[0];

                return {
                    DocumentOriginalName: file.name,
                    DocumentName: fileName,
                    FileSize: file.size,
                };
            }
            return null;
        } catch (error) {
            console.error('Error uploading personal document:', error);
            throw error;
        }
    },
    uploadResumeFile: async (file: File, sasToken: string): Promise<FileData | null> => {
        const fileExtension = file.name.split('.').pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

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
                const fileName = url.split('/').pop().split('?')[0];

                return {
                    DocumentOriginalName: file.name,
                    DocumentName: fileName,
                    FileSize: file.size,
                };
            }
            return null;
        } catch (error) {
            console.error('Error uploading resume:', error);
            throw error;
        }
    },
    uploadAffiliationLetter: async (file: File, sasToken: string): Promise<FileData | null> => {
        const fileExtension = file.name.split('.').pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

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
                const fileName = url.split('/').pop().split('?')[0];

                return {
                    DocumentOriginalName: file.name,
                    DocumentName: fileName,
                    FileSize: file.size,
                };
            }
            return null;
        } catch (error) {
            console.error('Error uploading affiliation letter:', error);
            throw error;
        }
    },
    uploadAwardOrCertificate: async (file: File, sasToken: string): Promise<FileData | null> => {
        const fileExtension = file.name.split('.').pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

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
                const fileName = url.split('/').pop().split('?')[0];

                return {
                    DocumentOriginalName: file.name,
                    DocumentName: fileName,
                    FileSize: file.size,
                };
            }
            return null;
        } catch (error) {
            console.error('Error uploading award or certificate:', error);
            throw error;
        }
    },
    uploadCertificationFile: async (file: File, sasToken: string): Promise<FileData | null> => {
        const fileExtension = file.name.split('.').pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

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
                const fileName = url.split('/').pop().split('?')[0];

                return {
                    DocumentOriginalName: file.name,
                    DocumentName: fileName,
                    FileSize: file.size,
                };
            }
            return null;
        } catch (error) {
            console.error('Error uploading certification:', error);
            throw error;
        }
    },
    uploadTaxReturnFile: async (file: File, sasToken: string): Promise<FileData | null> => {
        const fileExtension = file.name.split('.').pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

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
                const fileName = url.split('/').pop().split('?')[0];

                return {
                    DocumentOriginalName: file.name,
                    DocumentName: fileName,
                    FileSize: file.size,
                };
            }
            return null;
        } catch (error) {
            console.error('Error uploading tax return:', error);
            throw error;
        }
    },
    uploadShareTransferLedger: async (file: File, sasToken: string): Promise<FileData | null> => {
        const fileExtension = file.name.split('.').pop();
        const randomName = `${uuidv4()}.${fileExtension}`;
        const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/profile-verification/${randomName}?${sasToken}`;

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
                const fileName = url.split('/').pop().split('?')[0];

                return {
                    DocumentOriginalName: file.name,
                    DocumentName: fileName,
                    FileSize: file.size,
                };
            }
            return null;
        } catch (error) {
            console.error('Error uploading share transfer ledger:', error);
            throw error;
        }
    }
};