import { createSlice } from "@reduxjs/toolkit";

import { AppLanguageOptions } from '../../res/textResourcesFunction'


export interface AppSettingsInterface {
  language: AppLanguageOptions;
}

const initialAppSettingsValue: AppSettingsInterface = { language: AppLanguageOptions.EN };

export const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState: { value: initialAppSettingsValue },
  reducers: {
    setAppLanguage: (state, action) => {

    },
  },
});

export const { setAppLanguage } = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
