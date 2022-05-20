import axios from "axios";
import { LoginInput, UserInput } from "../interfaces/inputInterfaces";
import getConfig from "../config/config";

const { baseApiUrl, userApi, roleApi, reqOptions, reqOptionsToken } =
  getConfig();

export const client = axios.create({
  baseURL: baseApiUrl,
  timeout: 1000,
});

//const refreshAccesTokenApiCall = () => {};

export const loginApiCall = async (loginInput: LoginInput) => {
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

export const refreshTokenApiCall = async (refreshToken: string) => {
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
};

export const registerApi = async (userInput: UserInput) => {
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
};

export const fetchPublicRolesApiCall = async () => {
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

export const logoutApiCall = async (accessToken: string, refreshToken: string) => {
    let response;
    try {
      response = await client.post(
        `${userApi}/logout`,
        {},
        { ...reqOptionsToken(refreshToken) }
      );
    } catch (e: any) {
      response = e.response;
    }

    if (response.status === 200) {
      // TODO process successfull logout
    }

    if (response.status === 401) {
      response = await refreshTokenApiCall(refreshToken)
      if (response?.success) {
        logoutApiCall(response.payload.token.accessToken, refreshToken)
      } else {
        // TODO process logout
      }
    }

    if (response.status === 409) {
      // process not successfule logout 
    }
};
