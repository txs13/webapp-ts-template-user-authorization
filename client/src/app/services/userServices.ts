import { UserInput, UserDocument } from "../../interfaces/inputInterfaces";
import {
  registerApi,
  fetchAllUsersApiCall,
  APICallInterface,
} from "../../api/api";
import store from "../store";
import { accessTockenUpdate } from "../features/user.slice";
import getTextResources from "../../res/textResourcesFunction";

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
    return response.payload as [UserDocument];
  } else {
    // logout precedure to be started
  }
};
