import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AgreementState = {
  isAccepted: boolean;
  isConfirmed: boolean;
};

const initialState: AgreementState = {
  isAccepted: false,
  isConfirmed: false
};

const agreementSlice = createSlice({
  name: "agreement",
  initialState,
  reducers: {
    setAccepted(state, action: PayloadAction<boolean>) {
      state.isAccepted = action.payload;
      if (!action.payload) {
        state.isConfirmed = false;
      }
    },
    confirmAgreement(state) {
      if (state.isAccepted) {
        state.isConfirmed = true;
      }
    },
    resetAgreement() {
      return initialState;
    }
  }
});

export const { setAccepted, confirmAgreement, resetAgreement } = agreementSlice.actions;
export default agreementSlice.reducer;
