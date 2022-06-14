import {
  fetchPublicRolesApiCall,
  fetchAllRolesApiCall,
  APICallInterface,
  createRoleApiCall,
  putRoleApiCall,
  deleteRoleApiCall
} from "../../api/api";
import { updatePublicRoles } from "../features/role.slice";
import store from "../store";
import { accessTockenUpdate } from "../features/user.slice";
import {
  showMessage,
  AppAlertMessage,
} from "../features/appAlertMessage.slice";
import { RoleDocument, RoleInput } from "../../interfaces/inputInterfaces";
import getTextResources from "../../res/textResourcesFunction";

export const fetchPublicRolesService = async () => {
  const response = await fetchPublicRolesApiCall();

  if (response.success) {
    return store.dispatch(updatePublicRoles(response.payload));
  } else {
    // TODO - redirect to Error fragment
  }
};

export const fetchAllRolesService = async (
  accessToken?: string,
  refreshToken?: string
) => {
  // get actual store state
  const storeState = store.getState();
  // api call
  let response: APICallInterface;
  if (accessToken && refreshToken) {
    response = (await fetchAllRolesApiCall(
      accessToken,
      refreshToken
    )) as APICallInterface;
  } else {
    response = (await fetchAllRolesApiCall(
      storeState.user.value.tokens?.accessToken as string,
      storeState.user.value.tokens?.refreshToken as string
    )) as APICallInterface;
  }
  if (response.success) {
    // update the store with new access tocken if we got one
    if (response.updatedAccessToken) {
      store.dispatch(accessTockenUpdate(response.updatedAccessToken));
    }
    // store update
    return store.dispatch(updatePublicRoles(response.payload));
  } else {
    // TODO - redirect to Error fragment
  }
};

export const fetchAllRoles = async () => {
  // get actual store state
  const storeState = store.getState();
  // api call
  const response = (await fetchAllRolesApiCall(
    storeState.user.value.tokens?.accessToken as string,
    storeState.user.value.tokens?.refreshToken as string
  )) as APICallInterface;
  if (response.success) {
    // update the store with new access tocken if we got one
    if (response.updatedAccessToken) {
      store.dispatch(accessTockenUpdate(response.updatedAccessToken));
    }
    // return array of user records
    return response.payload as RoleDocument[];
  } else {
    // logout precedure to be started
  }
};

export const createRoleService = async (
  roleInput: RoleInput
): Promise<boolean> => {
  // get actual store state
  const storeState = store.getState();
  // api call
  const response = (await createRoleApiCall(
    storeState.user.value.tokens?.accessToken as string,
    storeState.user.value.tokens?.refreshToken as string,
    false,
    roleInput
  )) as APICallInterface;
  if (response.success) {
    // update the store with new access tocken if we got one
    if (response.updatedAccessToken) {
      store.dispatch(accessTockenUpdate(response.updatedAccessToken));
    }
    // store update
    const allRoles = await fetchAllRoles();
    store.dispatch(updatePublicRoles(allRoles));
    // show cinfirmation message
    const { successCreateRoleMessage } = getTextResources(
      storeState.appSettings.value.language
    );
    const alertMessage: AppAlertMessage = {
      alertType: "success",
      alertMessage: successCreateRoleMessage,
    };
    store.dispatch(showMessage(alertMessage));
    // return api call result
    return true;
  } else {
    // show cinfirmation message
    const { errorCreateRoleMessage } = getTextResources(
      storeState.appSettings.value.language
    );
    const alertMessage: AppAlertMessage = {
      alertType: "error",
      alertMessage: errorCreateRoleMessage,
    };
    store.dispatch(showMessage(alertMessage));
    // return api call result
    return false;
  }
};

export const putRoleService = async (
  updatedRole: RoleDocument
): Promise<boolean> => {
  // get actual store state
  const storeState = store.getState();
  // api call
  const response = (await putRoleApiCall(
    storeState.user.value.tokens?.accessToken as string,
    storeState.user.value.tokens?.refreshToken as string,
    false,
    updatedRole
  )) as APICallInterface;
  if (response.success) {
    // update the store with new access tocken if we got one
    if (response.updatedAccessToken) {
      store.dispatch(accessTockenUpdate(response.updatedAccessToken));
    }
    // store update
    const allRoles = await fetchAllRoles();
    store.dispatch(updatePublicRoles(allRoles));
    // show confirmation message
    const { roleUpdateSuccessMessage } = getTextResources(
      storeState.appSettings.value.language
    );
    const successMessage: AppAlertMessage = {
      alertType: "success",
      alertMessage: roleUpdateSuccessMessage,
    };
    store.dispatch(showMessage(successMessage));

    return true;
  } else {
    // show the error message
    const { roleUpdateFailureMessage } = getTextResources(
      storeState.appSettings.value.language
    );
    const errorMessage: AppAlertMessage = {
      alertType: "error",
      alertMessage: roleUpdateFailureMessage,
    };
    store.dispatch(showMessage(errorMessage));
    return false;
  }
};

export const deleteRoleService = async(roleId: string): Promise<boolean> => {
    // get actual store state
  const storeState = store.getState();
  // api call
  const response = (await deleteRoleApiCall(
    storeState.user.value.tokens?.accessToken as string,
    storeState.user.value.tokens?.refreshToken as string,
    false,
    roleId
  )) as APICallInterface;
  if (response.success) {
    // update the store with new access tocken if we got one
    if (response.updatedAccessToken) {
      store.dispatch(accessTockenUpdate(response.updatedAccessToken));
    }
    // store update
    const allRoles = await fetchAllRoles();
    store.dispatch(updatePublicRoles(allRoles));
    // show confirmation message
    const { roleDeleteSuccessMessage } = getTextResources(
      storeState.appSettings.value.language
    );
    const successMessage: AppAlertMessage = {
      alertType: "success",
      alertMessage: roleDeleteSuccessMessage,
    };
    store.dispatch(showMessage(successMessage));
    return true;
  } else {
    // show the error message
    const { roleDeleteFailureMessage } = getTextResources(
      storeState.appSettings.value.language
    );
    const errorMessage: AppAlertMessage = {
      alertType: "error",
      alertMessage: roleDeleteFailureMessage,
    };
    store.dispatch(showMessage(errorMessage));
    return false;
  }

}