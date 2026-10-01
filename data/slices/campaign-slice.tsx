
import { createSlice } from '@reduxjs/toolkit';
import { ICampaignList, IFavouriteCampaign } from '../dashboard/fundraising';

export const defaultCampaignList: ICampaignList = {
  favouriteCampaigns: [],
  popularCampaigns: [],
  newCampaigns: [],
  expiringCampaigns: [],
  contributedCampaigns: [],
  inMyCityCampaign: [],
};

export const defaultFavouriteCampaigns: IFavouriteCampaign[] = [];

const initialState: {
  campaignList: ICampaignList;
  favouriteCampaigns: IFavouriteCampaign[];
  campaignInfo: any;
} = {
  campaignList: defaultCampaignList,
  favouriteCampaigns: defaultFavouriteCampaigns,
  campaignInfo: null,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setCampaignList: (state, action) => {
      state.campaignList = action.payload;
    },
    setFavouriteCampaigns: (state, action) => {
      state.favouriteCampaigns = action.payload;
    },
    setCampaignBasicInfo: (state, action) => {
      state.campaignInfo = action.payload;
    },
  },
});

export const { setCampaignList, setFavouriteCampaigns, setCampaignBasicInfo } =
  campaignSlice.actions;
export default campaignSlice.reducer;
