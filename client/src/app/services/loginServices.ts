import {
  loginApiCall,
  refreshTokenApiCall,
  checkPasswordApiCall,
} from "../../api/api";
import store from "../store";
import {
  successfulLoginUser,
  notSuccessfulLoginUser,
} from "../features/user.slice";
import { APICallInterface } from "../../api/api";
import getTextResources from "../../res/textResourcesFunction";
import { LoginInput } from "../../interfaces/inputInterfaces";
import { fetchAllRolesService } from "./roleServices";
import { accessTockenUpdate } from "../features/user.slice";
import { AppAlertMessage, showMessage } from "../features/appAlertMessage.slice";

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
    if (response.payload?.isAdmin) {
      await fetchAllRolesService(
        response.payload?.accessToken,
        response.payload?.refreshToken
      );
    }
    // dispatching successful login
    return store.dispatch(successfulLoginUser(response.payload));
  } else {
    // dispatching not successful login
    if (response.errorMessage === "Invalid email or password") {
      // normal server response with wrong password
      return store.dispatch(
        notSuccessfulLoginUser(wrongUserNamePasswordMessage)
      );
    }
    if (response.errorMessage === "Your account is not confirmed yet") {
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

export const checkPasswordService = async (
  passwordToCheck: string
): Promise<boolean> => {
  // get actual store state
  const storeState = store.getState();
  // api call
  const response = (await checkPasswordApiCall(
    storeState.user.value.tokens?.accessToken as string,
    storeState.user.value.tokens?.refreshToken as string,
    false,
    passwordToCheck
  )) as APICallInterface;
  if (response.success) {
    // update the store with new access tocken if we got one
    if (response.updatedAccessToken) {
      store.dispatch(accessTockenUpdate(response.updatedAccessToken));
    }
    // return array of user records
    if (response.payload?.message === "password is NOT OK") {
      return false;
    }

    if (response.payload?.message === "password is OK") {
      return true;
    }
  } 
  // show error
  const { passwordCheckFailureMessage } = getTextResources(
    storeState.appSettings.value.language
  );
  const errorMessage: AppAlertMessage = {
    alertType: "error",
    alertMessage: passwordCheckFailureMessage,
  };
  store.dispatch(showMessage(errorMessage));
  return false;
};
