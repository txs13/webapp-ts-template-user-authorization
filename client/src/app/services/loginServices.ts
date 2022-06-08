import { loginApiCall, refreshTokenApiCall } from "../../api/api";
import store from "../store";
import {
  successfulLoginUser,
  notSuccessfulLoginUser,
} from "../features/user.slice";
import getTextResources from "../../res/textResourcesFunction";
import { LoginInput } from "../../interfaces/inputInterfaces";
import { fetchAllRolesService } from "./roleServices";

const currentState = store.getState();

const {
  wrongUserNamePasswordMessage,
  wrongStoredTokenMessage,
  accountIsNotConfirmedMessage,
  wrongNetworkSettingsMessage,
  unknownErrorMessage,
} = getTextResources(currentState.appSettings.value.language);

export const loginService = async (loginInput: LoginInput) => {
  const response = await loginApiCall(loginInput);

  if (response.success) {
    // get all roles is user is admin
    if (response.payload?.tokens?.isAdmin) {
      await fetchAllRolesService();
    }
    // dispatching successful login
    return store.dispatch(successfulLoginUser(response.payload));
  } else {
    // dispatching not successfule login
    if (response.errorMessage === "Invalid email or password") {
      // normal server response with wrong password
      return store.dispatch(
        notSuccessfulLoginUser(wrongUserNamePasswordMessage)
      );
    }
    if (response.errorMessage === "Your accout is not confirmed yet") {
      // normal server response with wrong password
      return store.dispatch(
        notSuccessfulLoginUser(accountIsNotConfirmedMessage)
      );
    }
    if (
      response.errorMessage === "Wrong network settings. Please contact admin"
    ) {
      return store.dispatch(
        notSuccessfulLoginUser(wrongNetworkSettingsMessage)
      );
    }
    return store.dispatch(notSuccessfulLoginUser(unknownErrorMessage));
  }
};

export const loginWithRefreshTokenService = async (
  refreshToken: string,
  sessionTtl: number
) => {
  const response = await refreshTokenApiCall(refreshToken);

  if (response?.success) {
    // get all roles is user is admin
    if (response.payload?.isAdmin) {
      await fetchAllRolesService(response.payload?.accessToken, refreshToken);
    }
    // dispatching successful login
    const payload = {
      ...response.payload,
      refreshToken: refreshToken,
      sessionTtl: sessionTtl,
    };
    return store.dispatch(successfulLoginUser(payload));
  } else {
    // dispatching not successfule login
    return store.dispatch(notSuccessfulLoginUser(wrongStoredTokenMessage));
  }
};
