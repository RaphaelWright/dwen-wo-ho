import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { School } from "@/types/school";

interface SchoolWithExtras extends School {
  studentCount?: number;
  newPatientName?: string;
  latestLockInDate?: string;
}

interface ProviderSchoolsState {
  schools: SchoolWithExtras[];
  lastUpdated: number | null;
  isLoading: boolean;
}

const initialState: ProviderSchoolsState = {
  schools: [],
  lastUpdated: null,
  isLoading: false,
};

const providerSchoolsSlice = createSlice({
  name: "providerSchools",
  initialState,
  reducers: {
    setSchools: (state, action: PayloadAction<SchoolWithExtras[]>) => {
      state.schools = action.payload;
      state.lastUpdated = Date.now();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateSchool: (state, action: PayloadAction<{ id: string | number; data: Partial<SchoolWithExtras> }>) => {
      const index = state.schools.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.schools[index] = { ...state.schools[index], ...action.payload.data };
      }
    },
  },
});

export const { setSchools, setLoading, updateSchool } = providerSchoolsSlice.actions;
export default providerSchoolsSlice.reducer;
