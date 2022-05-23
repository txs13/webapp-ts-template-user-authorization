import { createSlice } from "@reduxjs/toolkit";

import {
  UserDocument,
  LoginError,
  TokensInterface,
} from "../../interfaces/inputInterfaces";

export interface UserValue {
  user: UserDocument | null;
  tokens: TokensInterface | null;
  loginError: LoginError | null;
}

const initialUserValue: UserValue = {
  user: null,
  tokens: null,
  loginError: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: { value: initialUserValue },
  reducers: {
    notSuccessfulLoginUser: (state, action) => {
      state.value = {
        user: null,
        tokens: null,
        loginError: { errorMessage: action.payload as string },
      } as UserValue;
    },
    successfulLoginUser: (state, action) => {
      state.value = {
        user: action.payload.user,
        tokens: {
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
          sessionTtl: action.payload.sessionTtl,
          isAdmin: action.payload.isAdmin ? true : false,
        },
        loginError: null,
      } as UserValue;
    },
    backToInitialState: (state) => {
      state.value = initialUserValue;
    },
    accessTockenUpdate: (state, action) => {
      state.value = {...state.value, tokens: {...state.value.tokens, accessToken: action.payload}} as UserValue
    }
  },
});

export const {
  successfulLoginUser,
  notSuccessfulLoginUser,
  backToInitialState,
  accessTockenUpdate
} = userSlice.actions;

export default userSlice.reducer;
