import { UserInput, UserDocument } from "../../interfaces/inputInterfaces";
import {
  registerApi,
  fetchAllUsersApiCall,
  APICallInterface,
  putUserApiCall,
  deleteUserApiCall,
} from "../../api/api";
import store from "../store";
import { accessTockenUpdate } from "../features/user.slice";
import getTextResources from "../../res/textResourcesFunction";
import {
  AppAlertMessage,
  showMessage,
} from "../features/appAlertMessage.slice";
import { logoutService } from "./logoutService";

const currentState = store.getState();

const { userExistsRegisterMessage, wrongUserDataRegisterMessage } =
  getTextResources(currentState.appSettings.value.language);

export const registerUser = async (userInput: UserInput) => {
  const response = await registerApi(userInput);
  if (response?.success) {
    return null;
  }
  if (!response?.success) {
    if (response?.errorMessage === "this email is already registered") {
      return userExistsRegisterMessage;
    }
    return wrongUserDataRegisterMessage;
  }
};

export const fetchAllUsers = async () => {
  // get actual store state
  const storeState = store.getState();
  // api call
  const response = (await fetchAllUsersApiCall(
    storeState.user.value.tokens?.accessToken as string,
    storeState.user.value.tokens?.refreshToken as string
  )) as APICallInterface;
  if (response.success) {
    // update the store with new access tocken if we got one
    if (response.updatedAccessToken) {
      store.dispatch(accessTockenUpdate(response.updatedAccessToken));
    }
    // return array of user records
    return response.payload as UserDocument[];
  } else {
    // logout precedure to be started
  }
};

export const putUserService = async (
  updatedUser: UserDocument,
  newPassword?: string
): Promise<boolean> => {
  // get actual store state
  const storeState = store.getState();
  // add new password to the object if any
  let user: UserDocument = {...updatedUser}
  if (newPassword) {
    user.password = newPassword
  }
  // api call
  const response = (await putUserApiCall(
    storeState.user.value.tokens?.accessToken as string,
    storeState.user.value.tokens?.refreshToken as string,
    false,
    user
  )) as APICallInterface;
  if (response.success) {
    // update the store with new access tocken if we got one
    if (response.updatedAccessToken) {
      store.dispatch(accessTockenUpdate(response.updatedAccessToken));
    }
    // show confirmation message
    const { userUpdateSuccessMessage } = getTextResources(
      storeState.appSettings.value.language
    );
    const successMessage: AppAlertMessage = {
      alertType: "success",
      alertMessage: userUpdateSuccessMessage,
    };
    store.dispatch(showMessage(successMessage));
    return true;
  } else {
    // show the error message
    const { userUpdateFailureMessage } = getTextResources(
      storeState.appSettings.value.language
    );
    const errorMessage: AppAlertMessage = {
      alertType: "error",
      alertMessage: userUpdateFailureMessage,
    };
    store.dispatch(showMessage(errorMessage));
    return false;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  // get actual store state
  const storeState = store.getState();
  // api call
  const response = (await deleteUserApiCall(
    storeState.user.value.tokens?.accessToken as string,
    storeState.user.value.tokens?.refreshToken as string,
    false,
    userId
  )) as APICallInterface;
  if (response.success) {
    // update the store with new access tocken if we got one
    if (response.updatedAccessToken) {
      store.dispatch(accessTockenUpdate(response.updatedAccessToken));
    }
    // show confirmation message
    const { userDeleteSuccessMessage } = getTextResources(
      storeState.appSettings.value.language
    );
    const successMessage: AppAlertMessage = {
      alertType: "success",
      alertMessage: userDeleteSuccessMessage,
    };
    store.dispatch(showMessage(successMessage));
    return true;
  } else {
    // show the error message
    const { userDeleteFailureMessage } = getTextResources(
      storeState.appSettings.value.language
    );
    const errorMessage: AppAlertMessage = {
      alertType: "error",
      alertMessage: userDeleteFailureMessage,
    };
    store.dispatch(showMessage(errorMessage));
    return false;
  }
};
