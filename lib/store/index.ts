import { configureStore } from "@reduxjs/toolkit";
import agreementReducer from "@/lib/store/slices/agreement-slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      agreement: agreementReducer
    }
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
