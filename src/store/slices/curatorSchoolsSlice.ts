import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { School } from "@/types/school";

export interface SchoolWithExtras extends School {
  studentCount?: number;
  newPatientName?: string;
  latestLockInDate?: string;
  providerCount?: number;
  newProviderName?: string;
  latestProviderDate?: string;
}

interface CuratorSchoolsState {
  schools: SchoolWithExtras[];
  lastUpdated: number | null;
  isLoading: boolean;
}

const initialState: CuratorSchoolsState = {
  schools: [],
  lastUpdated: null,
  isLoading: false,
};

const curatorSchoolsSlice = createSlice({
  name: "curatorSchools",
  initialState,
  reducers: {
    setSchools: (state, action: PayloadAction<SchoolWithExtras[]>) => {
      state.schools = action.payload;
      state.lastUpdated = Date.now();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateSchool: (
      state,
      action: PayloadAction<{ id: string | number; data: Partial<SchoolWithExtras> }>
    ) => {
      const index = state.schools.findIndex((s) => String(s.id) === String(action.payload.id));
      if (index !== -1) {
        state.schools[index] = { ...state.schools[index], ...action.payload.data };
      }
    },
  },
});

export const { setSchools, setLoading, updateSchool } = curatorSchoolsSlice.actions;
export default curatorSchoolsSlice.reducer;
