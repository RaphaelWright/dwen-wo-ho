import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { School } from "@/types/school";

interface SchoolWithExtras extends School {
  studentCount?: number;
  newPatientName?: string;
  latestLockInDate?: string;
  providerCount?: number;
  newProviderName?: string;
  latestProviderDate?: string;
  isLoading?: boolean;
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
      } else {
        // If school doesn't exist, add it (for incremental loading)
        const newSchool = action.payload.data as SchoolWithExtras;
        if (newSchool.id) {
          state.schools.push(newSchool);
        }
      }
      state.lastUpdated = Date.now();
    },
    addSchools: (state, action: PayloadAction<SchoolWithExtras[]>) => {
      // Add new schools without replacing existing ones
      const existingIds = new Set(state.schools.map(s => s.id));
      const newSchools = action.payload.filter(school => !existingIds.has(school.id));
      state.schools.push(...newSchools);
      state.lastUpdated = Date.now();
    },
    removeSchool: (state, action: PayloadAction<string | number>) => {
      state.schools = state.schools.filter(s => s.id !== action.payload);
      state.lastUpdated = Date.now();
    },
    clearSchools: (state) => {
      state.schools = [];
      state.lastUpdated = null;
      state.isLoading = false;
    },
  },
});

export const { 
  setSchools, 
  setLoading, 
  updateSchool, 
  addSchools, 
  removeSchool, 
  clearSchools 
} = providerSchoolsSlice.actions;

export default providerSchoolsSlice.reducer;