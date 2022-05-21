import axios from "axios";
import { LoginInput, UserInput } from "../interfaces/inputInterfaces";
import getConfig from "../config/config";

const { baseApiUrl, userApi, roleApi, reqOptions, reqOptionsToken } =
  getConfig();

export const client = axios.create({
  baseURL: baseApiUrl,
  timeout: 1000,
});

interface ObjectLiteral {
  [key: string]: any;
}

interface APICallInterface {
  success: Boolean;
  errorMessage?: String;
  payload?: ObjectLiteral;
}

export const loginApiCall = async (
  loginInput: LoginInput
): Promise<APICallInterface> => {
  let response;
  try {
    response = await client.post(`${userApi}/login`, loginInput, {
      ...reqOptions,
    });
  } catch (e: any) {
    response = e.response;
  }

  if (response.status === 401) {
    // wrong login credentional provided
    return { success: false, errorMessage: response.data[0].message };
  }

  if (response.status === 200) {
    // process successful login response
    return { success: true, payload: response.data };
  }

  throw new Error("Something is wrong with API. Investigation required");
};

export const refreshTokenApiCall = async (
  refreshToken: string
): Promise<APICallInterface> => {
  let response;
  try {
    response = await client.post(
      `${userApi}/refresh`,
      {},
      { ...reqOptionsToken(refreshToken) }
    );
  } catch (e: any) {
    response = e.response;
  }

  if (response.status === 200) {
    // process successful login response
    return { success: true, payload: response.data };
  }

  if (response.status === 401) {
    // wrong login credentional provided
    return { success: false, errorMessage: response.data[0].message };
  }

  return { success: false, errorMessage: response.data[0].message };
};

export const registerApi = async (
  userInput: UserInput
): Promise<APICallInterface> => {
  let response;
  try {
    response = await client.post(`${userApi}/register`, userInput);
  } catch (e: any) {
    response = e.response;
  }

  if (response.status === 201) {
    // process successful registration response
    return { success: true, payload: response.data };
  }

  if (response.status === 400) {
    // process error registration
    return { success: false, errorMessage: response.data[0].message };
  }

  return { success: false, errorMessage: response.data[0].message };
};

export const fetchPublicRolesApiCall = async (): Promise<APICallInterface> => {
  let response;
  try {
    response = await client.get(roleApi, { ...reqOptions });
  } catch (e: any) {
    response = e.response;
  }

  if (response.status === 200) {
    return { success: true, payload: response.data };
  }

  return { success: false, errorMessage: response.data[0].message };
};

export const logoutApiCall = async (
  accessToken: string,
  refreshToken: string,
  secondCall: Boolean = false
): Promise<APICallInterface | void> => {
  let response;
  // first we try to perform logout with the access token we have
  try {
    response = await client.post(
      `${userApi}/logout`,
      {},
      { ...reqOptionsToken(accessToken) }
    );
  } catch (e: any) {
    response = e.response;
  }
  // if logout api call was successful, we return proper message
  if (response.status === 200) {
    return { success: true, payload: response.data };
  }
  // if access token is not valid, it could be because it is expired and we can try to
  // refresh it once - for this we have a function argument "secondCall"
  if (response.status === 401 && !secondCall) {
    // trying to get new access token
    response = await refreshTokenApiCall(refreshToken);
    if (response?.success) {
      // in case we have it, we call the same function to call the api once again
      // function is supposed to get done after the second api call returns status 200
      const newAccessToken = response.payload?.accessToken;
      return await logoutApiCall(newAccessToken, refreshToken, true);
    } else {
      // in case we do not get new access token, we have to clean up and exit
      return { success: false, errorMessage: response?.errorMessage };
    }
  }
  // normally this should never happen - this status can happen if wrong token is submitted
  if (response.status === 409) {
    return { success: false, errorMessage: response.data[0].message };
  }
};
