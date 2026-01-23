import { configureStore } from "@reduxjs/toolkit";
import providerSchoolsReducer from "./slices/providerSchoolsSlice";

export const store = configureStore({
  reducer: {
    providerSchools: providerSchoolsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
