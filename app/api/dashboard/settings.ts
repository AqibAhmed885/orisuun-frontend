import axios from 'axios';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
const headers = {
    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
    'Content-Type': 'application/json',

};

export const getSubscriptionPlanBasedOnProfile = async (userProfileTypeId, planType) => {
    try {
        const response = await axios.post(
            `${apiEndpoint}/Marketing/GetSubscriptionPlanBasedOnProfilePlan`,
            {
                ProfileType: userProfileTypeId?.toString(),
                PlanType: planType === 'Standard' ? '1' : '2',
            },
            { headers }
        );

        if (response.status === 200) {
            return response.data?.Result;
        } else {
            throw new Error('Unexpected response status');
        }
    } catch (error) {
        console.error('API error:', error);
        throw error;
    }


};

export const settings = {
    deleteAccount: async (userId: string, password: any, feedback: string) => {
        const params = {
            UserId: userId,
            Password: password,
            DeletionReason: feedback,
        };

        const response = await axios.post(`${apiEndpoint}/User/DeleteAccount`,
            {}, // empty body
            { headers, params }
        );
        return response;
    },

    changePassword: async (userId: string, passwordData: any) => {
        const response = await axios.post(
            `${apiEndpoint}/User/ChangePassword`,
            {
                UserId: userId,
                ...passwordData
            },
            { headers }
        );
        return response;
    },

    generateInvoice: async (userId: string, escrowTranId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/User/GenerateInvoicePDF`,
            {},
            {
                headers,
                params: { UserId: userId, EscrowTranId: escrowTranId }
            }
        );
        return response;
    },

    createConnectAccount: async (userId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Escrow/CreateConnectAccount`,
            { UserId: userId },
            { headers }
        );
        return response;
    },

    refreshOnboardingLink: async (accountId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Escrow/GetNewOnboardingLink`,
            {},
            {
                headers,
                params: { accountId }
            }
        );
        return response;
    },

    sendInvitation: async (invitationData: any) => {
        const response = await axios.post(
            `${apiEndpoint}/Team/SendInvitation?senderId=${invitationData.senderId}&receiverId=${invitationData.receiverId}`,
            {},
            { headers }
        );
        return response;
    },
    GetTeamProfile: async (teamId: any) => {
        const response = await axios.get(
            `${apiEndpoint}/Team/GetTeamProfile?teamId=${encodeURIComponent(teamId)}`,

            { headers }
        );
        return response;
    },

    AddMember: async (invitationData: any) => {
        const response = await axios.post(
            `${apiEndpoint}/Team/AddMember?senderId=${invitationData.senderId}&receiverId=${invitationData.receiverId}&teamId=${invitationData.teamId}`,
            {},
            { headers }
        );
        return response;
    },

    getTeamInvites: async (userId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Team/GetTeamInvites`,
            {
                UserId: userId,
            },
            { headers }
        );
        return response;
    },
    CreateEditTeamProfile: async (teamData: any) => {
        const response = await axios.post(
            `${apiEndpoint}/Team/CreateEditTeamProfile`,
            teamData,
            { headers }
        );
        return response;
    },
    submitInvitation: async (teamId: string, userId: string, status: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Team/AcceptOrRejectInvitation`,
            {
                TeamId: teamId,
                UserId: userId,
                Status: status
            },
            { headers }
        );
        return response;
    },
    deleteTeam: async (userId: string, teamId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Team/DeleteTeam`,
            {
                TeamId: teamId,
                UserId: userId
            },
            { headers }
        );
        return response;
    },
    resendInvite: async (teamId: string, userId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Team/ResendInvite?teamId=${encodeURIComponent(teamId)}&userId=${encodeURIComponent(userId)}`,
            {
            },
            { headers }
        );
        return response;
    },

    removeTeamMember: async (teamId: string, userId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Team/RemoveMember?teamId=${encodeURIComponent(teamId)}&userId=${encodeURIComponent(userId)}`,
            {
            },
            { headers }
        );
        return response;
    },
    updateTeamName: async (teamId: string, teamName: string) => {
        try {
            const response = await axios.post(
                `${apiEndpoint}/Team/NameTeam?teamId=${encodeURIComponent(teamId)}&teamName=${encodeURIComponent(teamName)}`,
                {},
                { headers }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to update team name:', error);
            throw error;
        }
    }
    ,
    submitTeamReview: async (reviewData: {
        TeamId: string,
        UserId: string,
        ServiceRating: number,
        QualityRating: number,
        CostRating: number,
        ReferRating: number,
        Review: string,
    }) => {
        const response = await axios.post(`${apiEndpoint}/Team/RateTeamProfile`,
            reviewData,
            { headers }
        );
        return response;
    },
    getUserWiseReview: async (teamId: string, userId: string) => {
        const response = await axios.get(`${apiEndpoint}/Team/GetTeamRatingsUserVise?teamId=${encodeURIComponent(teamId)}&userId=${encodeURIComponent(userId)}`,
            { headers })
        return response;
    },
    searchTeamByName: async (name: string, profileType: number, userId: string) => {
        try {
            const response = await axios.get(
                `${apiEndpoint}/Team/SearchTeams?name=${name}&profileTypeId=${profileType}&userId=${userId}`,
                { headers }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to update team name:', error);
            throw error;
        }
    },
    getTeamReviews: async (teamId: string) => {
        const response = await axios.get(
            `${apiEndpoint}/Team/GetTeamRatingsReviews?teamId=${encodeURIComponent(teamId)}`,
            { headers }
        );
        return response;
    },

    getNotificationDetails: async (userId: string) => {
        const response = await axios.get(
            `${apiEndpoint}/User/GetNotificationDetails`,
            {
                headers,
                params: { UserId: userId }
            }
        );
        return response;
    },

    getBillingData: async (userId: string) => {
        const response = await axios.get(
            `${apiEndpoint}/User/GetBillingData`,
            {
                headers,
                params: { UserId: userId }
            }
        );
        return response;
    },

    getTeamList: async (userId: string) => {
        const response = await axios.post(
            `${apiEndpoint}/Team/GetTeamList`,
            { UserId: userId },
            { headers }
        );
        return response;
    },

    updateNotificationDetails: async (userId: string, key: string, value: string) => {
        const response = await axios.post(
            `${apiEndpoint}/User/UpdateNotificationDetails`,
            {
                UserId: userId,
                Key: key,
                Value: value
            },
            { headers }
        );
        return response;
    },

    saveDeleteFeedback: async (UserId: string, password: string, feedback: string) => {
        const feedbackData = { UserId, Password: password, Feedback: feedback };
        const response = await axios.post(
            `${apiEndpoint}/User/SaveDeleteFeedback`,
            { Feedback: feedback },
            { headers }
        );
        
        return feedbackData;
    }
};
interface SubscriptionPlanResponse {
    Result: any[];
}

export const getSubscriptionPlan = async (profileType: string, planType: string) => {
    try {
        const response = await axios.post<SubscriptionPlanResponse>(
            `${apiEndpoint}/Marketing/GetSubscriptionPlanBasedOnProfilePlan`,
            {
                ProfileType: profileType,
                PlanType: planType,
            },
            {
                headers: {
                    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.Result;
    } catch (error) {
        console.error('Error fetching subscription plan:', error);
        return [];
    }
};

export const renewSubscription = async (userId: string, planId: string, transactionId: string, profileId: string) => {
    try {
        const response = await axios.post(
            `${apiEndpoint}/User/RenewSubscription`,
            {
                UserId: userId,
                PlanId: planId,
                TransactionId: transactionId,
                ProfileId: profileId.toString(),
            },
            {
                headers: {
                    XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                },
            }
        );
        return response.status === 200;
    } catch (error) {
        throw error;
    }
};