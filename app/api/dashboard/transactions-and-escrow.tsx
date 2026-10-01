import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

export const ContractService = {
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

  submitContractReview: async (
    contractDetails: any,
    ratingDetails: {
      Quality: number;
      Service: number;
      Cost: number;
      Willing: number;
      Review: string;
    },
    currentUser: any
  ) => {
    const values = contractDetails?.escrowContract;
    const requestData = {
      ReviewerGiverId: currentUser?.Id,
      ContractId: values?.Id,
      ServiceRating: ratingDetails.Service,
      QualityRating: ratingDetails.Quality,
      CostRating: ratingDetails.Cost,
      WillingToReferRating: ratingDetails.Willing,
      ReviewText: ratingDetails.Review,
      ReviewedUserId:
        values.ContractCreatorId === currentUser.Id
          ? values.CounterPartyId
          : values.ContractCreatorId,
    };
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

  createContractDispute: async (
    contractDetails: any,
    disputeDetails: {
      Message: string;
    },
    attachments: any[],
    currentUser: any
  ) => {
    const values = contractDetails?.escrowContract;
    const requestData = {
      ContractId: values?.Id,
      Message: disputeDetails.Message,
      Attachments: attachments,
      UserId: currentUser?.Id,
    };
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
  completeContract: async (contractDetails: any, currentUser: any) => {
    const requestData = {
      ContractId: contractDetails?.escrowContract?.Id,
      UserId: currentUser?.Id,
    };
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

  releaseContractFunds: async (contractDetails: any, currentUser: any) => {
    const requestData = {
      ContractId: contractDetails?.escrowContract?.Id,
      UserId: currentUser?.Id,
    };
    return axios.post(
      `${apiEndpoint}/Escrow/ReleaseContractFunds`,
      requestData,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },
};

export const ContractMemberService = {
  getAllPremiumUsers: async (userId: string) => {
    return axios.post(
      `${apiEndpoint}/Escrow/GetAllPremiumUserDetails`,
      {
        UserId: userId,
      },
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },

  createContractOffer: async (requestData: any) => {
    return axios.post(
      `${apiEndpoint}/Escrow/CreateContractOffer`,
      requestData,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },
};

export interface FundContractPayload {
  ContractCreatorId: string;
  ContractPartyId: string;
  PaymentMethodId: string;
  ContractAmount: number;
}

export const contractApi = {
  fundContractEscrow: async (payload: FundContractPayload) => {
    const response = await axios.post(
      `${apiEndpoint}/Escrow/FundContractEscrow`,
      payload,
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data.Result;
  }
};