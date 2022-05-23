import { fetchPublicRolesApiCall, fetchAllRolesApiCall, APICallInterface } from '../../api/api'
import { updatePublicRoles } from '../features/role.slice' 
import store from '../store'
import { accessTockenUpdate } from "../features/user.slice"
import { RoleDocument } from '../../interfaces/inputInterfaces'

export const fetchPublicRolesService = async ()  => {
    const response = await fetchPublicRolesApiCall();

    if (response.success) {
        return store.dispatch(updatePublicRoles(response.payload))
    } else {
        // TODO - redirect to Error fragment
    }
}

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