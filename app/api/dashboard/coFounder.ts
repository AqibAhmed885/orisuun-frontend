const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
import { CreateBusinessMemberOpportunityData } from '@/utils/schema';
const headers = {
    'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
import axios from "axios";
export const getCountryList = async () => {
    const response = await axios.get(`${apiEndpoint}/MyProfile/GetCountryList`, {
        headers
    });

    if (response.status === 200) {
        const locations = response.data.Result;
        return locations.map((location) => ({
            label: location?.CountryName,
            value: (location?.Id).toString()
        }));
    }

    throw new Error('Failed to fetch country list');
};

export const createBusinessMemberOpportunity = async (matchData) => {
    const response = await axios.post(
        `${apiEndpoint}/BusinessMember/CreateBusinessMemberOpportunity`,
        matchData,
        {
            headers
        }
    );

    return response;
};

export const getBusinessMemberOpportunities = async (type: number, userId: string) => {
    const response = await axios.get(
        `${apiEndpoint}/BusinessMember/GetBusinessMemberOpportunityDetails?Id=${type}&UserId=${userId}`,
        { headers }
    );
    return response.data?.Result;
};

export const deleteBusinessMemberOpportunity = async (id: string, userId: string) => {
    const response = await axios.delete(
        `${apiEndpoint}/BusinessMember/DeleteBusinessMemberOpportunity?Id=${id}&UserId=${userId}`,
        { headers }
    );
    return response;
};

export const getMatchedList = async (BDId: string, UserId: string) => {
    const response = await axios.post(
        `${apiEndpoint}/BusinessOpportunity/GetMatchedListBasedonBdId`,
        { BDId, UserId },
        { headers }
    );
    return response.data?.Result;
};

export const rejectMatchedRequest = async (MatchedId: string) => {
    const response = await axios.post(
        `${apiEndpoint}/BusinessOpportunity/RejectMatchedRequest`,
        { MatchedId },
        { headers }
    );
    return response;
};

export const getBusinessMemberDetails = async (opportunityId: string, userId: string) => {
    try {
        const response = await axios.get(
            `${apiEndpoint}/BusinessMember/GetBusinessMemberDetailsByOpportunityId?Id=${opportunityId}&UserId=${userId}`,
            { headers }
        );
        return response.data?.Result;
    } catch (error) {
        throw error;
    }
};

export const updateBusinessMemberOpportunity = async (data: CreateBusinessMemberOpportunityData & { UserId: string, Id: number }) => {
    try {
        const response = await axios.put(
            `${apiEndpoint}/BusinessMember/UpdateBusinessMemberOpportunity`,
            data,
            { headers }
        );
        return response.status === 200;
    } catch (error) {
        throw error;
    }
};

// ---------------------- new helpers ----------------------
export const getComplementaryCoFounderJobs = async (opportunityId: number | string) => {
    const res = await axios.get(
        `${apiEndpoint}/BusinessOpportunity/GetComplementaryCoFounderJobs?opportunityId=${opportunityId}`,
        { headers }
    );
    return res.data?.Result ?? [];
};

export const getComplementaryBoardMemberJobs = async (opportunityId: number | string) => {
    const res = await axios.get(
        `${apiEndpoint}/BusinessOpportunity/GetComplementaryBoardMemberJobs?opportunityId=${opportunityId}`,
        { headers }
    );
    return res.data?.Result ?? [];
};

// export const getRecommendedUsersForOpportunity = async (opportunityId: number | string) => {
//     const res = await axios.get(
//         `${apiEndpoint}/BusinessOpportunity/GetRecommendedUsersForOpportunity?opportunityId=${opportunityId}`,
//         { headers }
//     );
//     const result = res?.data?.Result ?? res?.data ?? [];
//     if (Array.isArray(result)) return result;
//     return result?.RecommendedUsers ?? result?.Users ?? [];
// };
