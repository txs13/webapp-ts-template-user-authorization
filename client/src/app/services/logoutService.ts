import { logoutApiCall } from "../../api/api";
import store from "../store";
import { backToInitialState } from "../features/user.slice";

export const logoutService = async () => {
  // get current store state
  const currentState = store.getState();
  // call loagout api
  const response = await logoutApiCall(
    currentState?.user.value.tokens?.accessToken as string,
    currentState?.user.value.tokens?.refreshToken as string
  );
  // after logout API is called, for the client is not important
  // whether call was successfule or not successful
  // the purpose is just to wait until we try to close the current session
  if (response?.success === true || response?.success === false) {
    // dispatch "empty" store state
    store.dispatch(backToInitialState())
    // remove token record from the local storage
    localStorage.removeItem("refreshinfo");
  } else {
    // something went wrong
    console.log("Logout API call does not work properly");
  }
};

export const localLogoutService = () => {
  // dispatch "empty" store state
  store.dispatch(backToInitialState());
  // remove token record from the local storage
  localStorage.removeItem("refreshinfo");
}