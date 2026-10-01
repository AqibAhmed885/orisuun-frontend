import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface FormattedTeam {
  isActive: boolean;
  teamId: string;
  teamName: string;
  teamMembers: [];
  teamAdmin: string;
  isBusiness: boolean;
  isPremium: boolean;
  isVerified: boolean;
}
interface FormattedUser {
  AccountId: string | null;
  Expiration: string; // ISO date string
  Id: string;
  IsAccountVerified: boolean;
  IsSubscribed: boolean;
  IsSubscriptionExpired: number; // 0 or 1
  PayPalPlanId: string;
  ProfilePicture: string;
  RefreshToken: string;
  TempAccountId: string;
  TimeZone: string;
  Token: string;
  UserEmail: string;
  UserName: string;
  UserProfileDetailsId: number;
  UserProfileType: string;
  UserProfileTypeId: number;
  UserSubscribedPlanType: string;
  UserVerificationId: number;
  isBasicProfileDetailExist: boolean;
  isBusinessProfile: boolean;
  isIndividualProfile: boolean;
  isProfileComplete: boolean;
  isSubscriptionActive: boolean;
  isVerificationDetailExist: boolean;
  isVerified: number; // 0 or 1
}

const initialState: UserInitialState = {
  user: null,
  currentUser: null,
  profileData: null,
  teamData: null,
  feedbackData: null,
  profileTypes: null,
  verificationData: null,
  favouriteProfiles: [],
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const userSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    createUser: (state, action) => {
      state.user = { ...action.payload };
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    removeUser: (state) => {
      state.user = null;
    },
    addCurrentUser: (state, action) => {
      state.currentUser = { ...action.payload };
    },
    addUserVerificationData: (state, action) => {
      state.verificationData = { ...action.payload };
    },
    updateCurrentUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
    removeCurrentUser: (state) => {
      state.currentUser = null;
    },
    resetUserState: () => initialState,
    addProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    getProfileType: (state, action) => {
      state.profileTypes = action.payload;
    },
    addFeedbaackData: (state, action) => {
      state.feedbackData = action.payload;
    },
    addFavouriteProfiles: (state, action) => {
      state.favouriteProfiles = action.payload;
    },
    addTeamData: (state, action) => {
      state.teamData = action.payload;
    },
    updateTeamData: (state, action) => {
      state.teamData = { ...state.teamData, ...action.payload };
    },

    setTeamDataLocal: (state) => {
      let teamDataString = localStorage.getItem('teamData');
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) {
        localStorage.removeItem('teamData');
        Cookies.remove('teamData'); 
        return;
      }
      const userData: FormattedUser = JSON.parse(userDataString);
      let Team: FormattedTeam | null = null;
      if (teamDataString) {
        try {
          Team = JSON.parse(teamDataString);
        } catch {
          Team = null;
        }
      }
      if (!Team) {
        teamDataString = getCookie('teamData') as string;
        if (teamDataString) {
          try {
            Team = JSON.parse(teamDataString);
          } catch {
            Team = null;
          }
        }
      }
      if (Team && Team?.teamAdmin === userData.Id) {
        state.teamData = Team;
      } else {
        state.teamData = null;
        localStorage.removeItem('teamData');
        Cookies.remove('teamData');
      }
    }
    
  },
});

export const {
  createUser,
  updateUser,
  removeUser,
  addCurrentUser,
  updateCurrentUser,
  removeCurrentUser,
  resetUserState,
  addProfileData,
  addFeedbaackData,
  getProfileType,
  addUserVerificationData,
  addFavouriteProfiles,
  addTeamData,
  updateTeamData,
  setTeamDataLocal
} = userSlice.actions;

export default userSlice.reducer;
