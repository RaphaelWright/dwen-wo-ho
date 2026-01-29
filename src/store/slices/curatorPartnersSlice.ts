import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Partner {
  id: string | number;
  name: string;
  nickname?: string;
  slogan?: string;
  logo?: string;
}

interface CuratorPartnersState {
  partners: Partner[];
  lastUpdated: number | null;
  isLoading: boolean;
}

const initialState: CuratorPartnersState = {
  partners: [],
  lastUpdated: null,
  isLoading: false,
};

const curatorPartnersSlice = createSlice({
  name: "curatorPartners",
  initialState,
  reducers: {
    setPartners: (state, action: PayloadAction<Partner[]>) => {
      state.partners = action.payload;
      state.lastUpdated = Date.now();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setPartners, setLoading } = curatorPartnersSlice.actions;
export default curatorPartnersSlice.reducer;
