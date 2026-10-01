import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

export const ContractDisputeService = {
  getContractById: async (id: string | string[], userId: string) => {
    return axios.post(
      `${apiEndpoint}/Escrow/GetContractById`,
      {
        Id: id,
        UserId: userId,
      },
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },

  updateContractOffer: async (requestData: any) => {
    return axios.post(
      `${apiEndpoint}/Escrow/UpdateContractOffer`,
      requestData,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },

  submitContractReview: async (requestData: any) => {
    return axios.post(
      `${apiEndpoint}/Escrow/SubmitContractReview`,
      requestData,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },

  createContractDispute: async (requestData: any) => {
    return axios.post(
      `${apiEndpoint}/Escrow/CreateContractDispute`,
      requestData,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },

  completeContract: async (requestData: any) => {
    return axios.post(
      `${apiEndpoint}/Escrow/CompleteContract`,
      requestData,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },

  endDispute: async (requestData: any) => {
    return axios.post(
      `${apiEndpoint}/Escrow/EndDispute`,
      requestData,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },

  uploadFile: async (blobUrl: string, file: File) => {
    return axios.put(blobUrl, file, {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
    });
  },
};