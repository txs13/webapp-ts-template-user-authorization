import { createSlice } from "@reduxjs/toolkit";

export interface AppAlertMessage {
  alertType: "error" | "warning" | "info" | "success" | null;
  actionDescription?: string | null;
  alertMessage: string | null;
}

const initialAppAlertMessageValue: AppAlertMessage = {
  alertType: null,
  actionDescription: undefined,
  alertMessage: null,
};

export const appAlertMessageSlice = createSlice({
  name: "appAlertMessage",
  initialState: {value: initialAppAlertMessageValue},
  reducers: {
    showMessage: (state, action) => {
      state.value = action.payload
    },
    clearMessage: (state) => {
      state.value = initialAppAlertMessageValue;
    },
  },
});

export const { showMessage, clearMessage } = appAlertMessageSlice.actions;

export default appAlertMessageSlice.reducer;
