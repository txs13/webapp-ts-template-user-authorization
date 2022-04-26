import { loginApiCall, loginWithRefreshTokenApiCall } from "../../api/api";
import store from "../store";
import {
  successfulLoginUser,
  notSuccessfulLoginUser,
} from "../features/user.slice";
import getTextResources from "../../res/textResourcesFunction";
import { LoginInput } from "../../interfaces/inputInterfaces";

const currentState = store.getState();

const { wrongUserNamePasswordMessage, wrongStoredTokenMessage } =
  getTextResources(currentState.appSettings.value.language);

export const loginService = async (loginInput: LoginInput) => {
  const response = await loginApiCall(loginInput);

  if (response.success) {
    // dispatching successful login
    return store.dispatch(successfulLoginUser(response.payload));
  } else {
    // dispatching not successfule login
    if (response.errorMessage === "Invalid email or password") {
      // normal server response with wrong password
      return store.dispatch(
        notSuccessfulLoginUser(wrongUserNamePasswordMessage)
      );
    } else {
      // TODO - some unknown error - redirect to Error fragment
    }
  }
};

export const loginWithRefreshTokenService = async (
  refreshToken: string,
  sessionTtl: number
) => {
  const response = await loginWithRefreshTokenApiCall(refreshToken);

  if (response?.success) {
    // dispatching successful login
    const payload = {
      ...response.payload,
      refreshToken: refreshToken,
      sessionTtl: sessionTtl
    };
    return store.dispatch(successfulLoginUser(payload));
  } else {
    // dispatching not successfule login
    return store.dispatch(notSuccessfulLoginUser(wrongStoredTokenMessage));
  }
};
