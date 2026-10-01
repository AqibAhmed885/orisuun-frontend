import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
    'XApiKey': 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
export interface OpportunityPost {
    Id: string;
    UserProfileId: number;
    MatchType: number;
    PostTitle: string;
    RoleDescription: string;
    BusinessName: string;
    BusinessType: string;
    BusinessIndustry: string;
    ChildIndustries: {
        Id: number;
        IndustryName: string;
      }[];
    CreatedDateTime: string;
    UserId: string;
    BusinessDescription: string;
    PreferredExperience: string;
    BusinessLocation: { id: string; value: string }[];
    ContactEmail: string;
    ContactName: string;
    ContactPhone: string;
    IsPaused: boolean;
    MemberName :string;
    PostDuration: string;
    NumberMatches: number;
    RoleSought : string;
    StrategyName : string;
    Tactics : string[];
}

export const opportunity = {
    fetchOpportunityPosts: async (typeId: number, userId: string) => {
        try {
            const response = await axios.get(
                `${apiEndpoint}/BusinessMember/GetBusinessMemberOpportunityDetails?Id=${typeId}&UserId=${userId}`,
                { headers }
            );
            return response.status === 200 ? response.data.Result || [] : [];
        } catch (error) {
            console.error('Error fetching opportunity posts:', error);
            return [];
        }
    },

    deleteOpportunity: async (id: string, userId: string) => {
        const response = await axios.delete(
            `${apiEndpoint}/BusinessMember/DeleteBusinessMemberOpportunity?Id=${id}&UserId=${userId}`,
            { headers }
        );
        return response;
    },

    toggleOpportunityStatus: async (postId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/BusinessMember/PauseResumeOpportunityPost?postId=${postId}`,
            {},
            { headers }
        );
        return response;
    }
};