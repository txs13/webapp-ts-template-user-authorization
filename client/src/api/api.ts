import axios from "axios";
import { LoginInput } from "../interfaces/inputInterfaces";
import getConfig from "../config/config";

const { baseApiUrl, userApi, roleApi, reqOptions, reqOptionsToken } =
  getConfig();

const client = axios.create({
  baseURL: baseApiUrl,
  timeout: 1000,
});

const refresh = () => {};

export const loginApiCall = async (loginInput: LoginInput) => {
  let response 
  try {
    response =  await client.post(`${userApi}/login`, loginInput, reqOptions);
  } catch (e: any) {
      response = e.response
  }

  if (response.status === 401) {
      // wrong login credentional provided
      return {success: false, errorMessage: response.data[0].message}
  }

  if (response.status === 200) {
    // process successful login response
    return {success: true, payload: response.data}
  }

  throw new Error ("Something is wrong with API. Investigation required")

};

export const register = () => {};

export const getPublicRoles = () => {};
