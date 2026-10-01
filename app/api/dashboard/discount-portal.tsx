import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

export const DiscountPortalService = {
  getDiscountDetails: async (userId: string) => {
    return axios.get(`${apiEndpoint}/DiscountPortal/GetDiscountDetails?UserId=${userId}`, {
      headers: {
        XApiKey: apiKey,
      },
    });
  },
  
  getMyDiscountDetails: async (userId: string) => {
    return axios.get(`${apiEndpoint}/DiscountPortal/GetMyCreatedDiscounts?UserId=${userId}`, {
      headers: {
        XApiKey: apiKey,
      },
    });
  },

  getSelectedDiscountCodes: async (filters: any, userId: string) => {
    return axios.post(
      `${apiEndpoint}/DiscountPortal/GetSelectedDiscountCodes`,
      {
        ...filters,
        UserId: userId,
      },
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },

};

export const DiscountCreationService = {
  saveDiscountDetails: async (formData: FormData) => {
    return axios.post('/api/discount-portal/save-details', formData);
  },
};

interface FilterPayload {
  MainSearch: string;
  SortBy: string;
  BusinessType: string[];
  OfferType: string[];
  TypeOfUsage: string[];
  TypeOfDiscount: string[];
  IsNewCustomers: boolean;
  IsStartUps: boolean;
  UserId: string;
}

export const DiscountSearchService = {
  getFilteredDiscountCode: async (payload: FilterPayload) => {
    return axios.post(
      `${apiEndpoint}/DiscountPortal/GetFilteredDiscountCode`,
      payload,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },

  getOfferTypeList: async (userId: string) => {
    return axios.get(
      `${apiEndpoint}/DiscountPortal/GetOfferTypeList?UserId=${userId}`,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );
  },
};

export const DiscountDetailsService = {
  getDiscountCodeDetails: async (id: string, userId: string) => {
    return axios.get(
      `${apiEndpoint}/DiscountPortal/GetDiscountCodeDetailsIdWise?Id=${id}&UserId=${userId}`,
      {
        headers: {
          XApiKey: apiKey,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};


//Admin - discount-portal/discount
export interface Discount {
  Id: number;
  CompanyLogo: string;
  CompanyName: string;
  CompanyWebsite: string;
  CompanySlogan: string;
  CompanyIndustry: string;
  CompanyType: string;
  CompanyDescription: string;
  DiscountDescription: string;
  DiscountActivation: string;
  ActiveDiscount: string;
  ProposalDuration: number;
  NumberOfDiscount: number;
  Code: string;
  CreatedDateTime: string;
  UpdatedDateTime: string;
  IsFavourite: boolean;
  DiscountType: string;
  DiscountFor: string;
  IsStartUps: boolean;
  DiscountCreatorUserId: string;
  TermsOfUsing: string;
  IsActive: boolean;
}

export const DiscountManagementService = {
  getAllDiscounts: async (token: string, id: string) => {
    return axios.get(`${apiEndpoint}/DiscountPortal/GetAllDiscountsList?id=${id}`, {
      headers: {
        XApiKey: token,
      },
    });
  },

  deleteDiscount: async (discountId: number, token: string) => {
    return axios.delete(
      `${apiEndpoint}/DiscountPortal/DeleteDiscount?discountId=${discountId}`,
      {
        headers: {
          XApiKey: token,
        },
      }
    );
  },

  toggleDiscountStatus: async (discountId: number, isActive: boolean, token: string) => {
    return axios.post(
      `${apiEndpoint}/DiscountPortal/PauseResumeDiscount?discountId=${discountId}`,
      { isActive },
      {
        headers: {
          XApiKey: token,
        },
      }
    );
  },
};
