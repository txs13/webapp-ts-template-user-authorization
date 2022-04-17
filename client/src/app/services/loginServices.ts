import { loginApiCall } from "../../api/api";
import store from "../store";
import { successfulLoginUser, notSuccessfulLoginUser } from '../features/user.slice'
import getTextResources from "../../res/textResourcesFunction";
import { LoginInput } from "../../interfaces/inputInterfaces";

const currentState = store.getState();

const { wrongUserNamePasswordMessage } = getTextResources(
  currentState.appSettings.value.language
);

export const loginService = async (loginInput: LoginInput) => {
  const response = await loginApiCall(loginInput);

  if (response.success) {
    // dispatching successful login
    store.dispatch(successfulLoginUser(response.payload));
  } else {
    // dispatching not successfule login
    if (response.errorMessage === "Invalid email or password") {
      // normal server response with wrong password
      store.dispatch(notSuccessfulLoginUser(wrongUserNamePasswordMessage));
    } else {
      // TODO - some unknown error - redirect to Error fragment
    }
  }
};
