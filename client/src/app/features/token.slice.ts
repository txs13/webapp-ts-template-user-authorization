import { createSlice } from "@reduxjs/toolkit";

export interface TokensInterface {
  accessToken: String;
  refreshToken: String;
  sessionTtl: Number;
  isAdmin?: Boolean; 
}

const initialTokenValue: TokensInterface | null = null

export const tokenSlice = createSlice({
  name: "token",
  initialState: { value: initialTokenValue },
  reducers: {
    loginToken: (state, action) => {

    },
    logoutToken: (state, action) => {

    }
  },
});

export const { loginToken, logoutToken } = tokenSlice.actions;

export default tokenSlice.reducer;