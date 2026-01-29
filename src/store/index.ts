import { configureStore } from "@reduxjs/toolkit";
import providerSchoolsReducer from "./slices/providerSchoolsSlice";
import curatorSchoolsReducer from "./slices/curatorSchoolsSlice";
import curatorPartnersReducer from "./slices/curatorPartnersSlice";

export const store = configureStore({
  reducer: {
    providerSchools: providerSchoolsReducer,
    curatorSchools: curatorSchoolsReducer,
    curatorPartners: curatorPartnersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
