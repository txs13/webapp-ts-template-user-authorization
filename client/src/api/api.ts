import axios from "axios";
import {
  LoginInput,
  RoleDocument,
  RoleInput,
  UserDocument,
  UserInput,
} from "../interfaces/inputInterfaces";
import getConfig from "../config/config";
import { localLogoutService } from "../app/services/logoutService";

interface ObjectLiteral {
  [key: string]: any;
}

export interface APICallInterface {
  success: Boolean;
  errorMessage?: String;
  payload?: ObjectLiteral;
  updatedAccessToken?: String;
  expiredToken?: Boolean;
}

const { baseApiUrl, userApi, roleApi, reqOptions, reqOptionsToken } =
  getConfig();

export const client = axios.create({
  baseURL: baseApiUrl,
  timeout: 1000,
});

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
): Promise<APICallInterface | void> => {
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
    localLogoutService();
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

  if (response.status === 409) {
    // normally this should never happen - this status can happen if wrong token is submitted
    return { success: false, errorMessage: response.data[0].message };
  }
};

export const fetchAllUsersApiCall = async (
  accessToken: string,
  refreshToken: string,
  secondCall: Boolean = false
): Promise<APICallInterface | void> => {
  let response;
  // first we try to perform logout with the access token we have
  try {
    response = await client.get(`${userApi}/allusers`, {
      ...reqOptionsToken(accessToken),
    });
  } catch (e: any) {
    response = e.response;
  }
  // if logout api call was successful, we return proper message
  if (response.status === 200) {
    if (secondCall) {
      return {
        success: true,
        payload: response.data,
        updatedAccessToken: accessToken,
      };
    } else {
      return { success: true, payload: response.data };
    }
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
      return await fetchAllUsersApiCall(newAccessToken, refreshToken, true);
    } else {
      // in case we do not get new access token, we have to clean up and exit
      if (response?.errorMessage === "wrong token") {
        return {
          success: false,
          errorMessage: response?.errorMessage,
          expiredToken: true,
        };
      } else {
        return { success: false, errorMessage: response?.errorMessage };
      }
    }
  }
  // normally this should never happen - this status can happen if wrong token is submitted
  if (response.status === 409) {
    return { success: false, errorMessage: response.data[0].message };
  }
};

export const fetchAllRolesApiCall = async (
  accessToken: string,
  refreshToken: string,
  secondCall: Boolean = false
): Promise<APICallInterface | void> => {
  let response;
  // first we try to perform logout with the access token we have
  try {
    response = await client.get(`${roleApi}/allroles`, {
      ...reqOptionsToken(accessToken),
    });
  } catch (e: any) {
    response = e.response;
  }
  // if logout api call was successful, we return proper message
  if (response.status === 200) {
    if (secondCall) {
      return {
        success: true,
        payload: response.data,
        updatedAccessToken: accessToken,
      };
    } else {
      return { success: true, payload: response.data };
    }
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
      return await fetchAllRolesApiCall(newAccessToken, refreshToken, true);
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

export const putUserApiCall = async (
  accessToken: string,
  refreshToken: string,
  secondCall: Boolean = false,
  updatedUser: UserDocument
): Promise<APICallInterface | void> => {
  let response;
  // first we try to perform logout with the access token we have
  try {
    response = await client.put(`${userApi}/putuser`, updatedUser, {
      ...reqOptionsToken(accessToken),
    });
  } catch (e: any) {
    response = e.response;
  }
  // if logout api call was successful, we return proper message
  if (response.status === 200) {
    if (secondCall) {
      return {
        success: true,
        payload: response.data,
        updatedAccessToken: accessToken,
      };
    } else {
      return { success: true, payload: response.data };
    }
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
      return await putUserApiCall(
        newAccessToken,
        refreshToken,
        true,
        updatedUser
      );
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

export const deleteUserApiCall = async (
  accessToken: string,
  refreshToken: string,
  secondCall: Boolean = false,
  userId: string
): Promise<APICallInterface | void> => {
  let response;
  // first we try to perform logout with the access token we have
  try {
    response = await client.delete(`${userApi}/deleteuser/${userId}`, {
      ...reqOptionsToken(accessToken),
    });
  } catch (e: any) {
    response = e.response;
  }
  // if logout api call was successful, we return proper message
  if (response.status === 200) {
    if (secondCall) {
      return {
        success: true,
        payload: response.data,
        updatedAccessToken: accessToken,
      };
    } else {
      return { success: true, payload: response.data };
    }
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
      return await deleteUserApiCall(
        newAccessToken,
        refreshToken,
        true,
        userId
      );
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

export const createRoleApiCall = async (
  accessToken: string,
  refreshToken: string,
  secondCall: Boolean = false,
  roleInput: RoleInput
): Promise<APICallInterface | void> => {
  let response;
  // first we try to perform logout with the access token we have
  try {
    response = await client.post(`${roleApi}`, roleInput, {
      ...reqOptionsToken(accessToken),
    });
  } catch (e: any) {
    response = e.response;
  }
  // if logout api call was successful, we return proper message
  if (response.status === 201) {
    if (secondCall) {
      return {
        success: true,
        payload: response.data,
        updatedAccessToken: accessToken,
      };
    } else {
      return { success: true, payload: response.data };
    }
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
      return await createRoleApiCall(
        newAccessToken,
        refreshToken,
        true,
        roleInput
      );
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

export const putRoleApiCall = async (
  accessToken: string,
  refreshToken: string,
  secondCall: Boolean = false,
  updatedRole: RoleDocument
): Promise<APICallInterface | void> => {
  let response;
  // first we try to perform logout with the access token we have
  try {
    response = await client.put(`${roleApi}`, updatedRole, {
      ...reqOptionsToken(accessToken),
    });
  } catch (e: any) {
    response = e.response;
  }
  // if logout api call was successful, we return proper message
  if (response.status === 200) {
    if (secondCall) {
      return {
        success: true,
        payload: response.data,
        updatedAccessToken: accessToken,
      };
    } else {
      return { success: true, payload: response.data };
    }
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
      return await putRoleApiCall(
        newAccessToken,
        refreshToken,
        true,
        updatedRole
      );
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

export const deleteRoleApiCall = async (
  accessToken: string,
  refreshToken: string,
  secondCall: Boolean = false,
  roleId: string
): Promise<APICallInterface | void> => {
  let response;
  // first we try to perform logout with the access token we have
  try {
    response = await client.delete(`${roleApi}/${roleId}`, {
      ...reqOptionsToken(accessToken),
    });
  } catch (e: any) {
    response = e.response;
  }
  // if logout api call was successful, we return proper message
  if (response.status === 200) {
    if (secondCall) {
      return {
        success: true,
        payload: response.data,
        updatedAccessToken: accessToken,
      };
    } else {
      return { success: true, payload: response.data };
    }
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
      return await deleteRoleApiCall(
        newAccessToken,
        refreshToken,
        true,
        roleId
      );
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

export const checkPasswordApiCall = async (
  accessToken: string,
  refreshToken: string,
  secondCall: Boolean = false,
  passwordToCheck: string
): Promise<APICallInterface | void> => {
  let response;
  // first we try to perform logout with the access token we have
  try {
    response = await client.post(
      `${userApi}/checkpassword`,
      {password: passwordToCheck},
      {
        ...reqOptionsToken(accessToken),
      }
    );
  } catch (e: any) {
    response = e.response;
  }
  // if logout api call was successful, we return proper message
  if (response.status === 200) {
    if (secondCall) {
      return {
        success: true,
        payload: response.data,
        updatedAccessToken: accessToken,
      };
    } else {
      return { success: true, payload: response.data };
    }
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
      return await checkPasswordApiCall(
        newAccessToken,
        refreshToken,
        true,
        passwordToCheck
      );
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
