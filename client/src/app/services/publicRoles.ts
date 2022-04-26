import { fetchPublicRolesApiCall } from '../../api/api'
import { updatePublicRoles } from '../features/role.slice' 
import store from '../store'

export const fetchPublicRolesService = async ()  => {
    const response = await fetchPublicRolesApiCall();

    if (response.success) {
        return store.dispatch(updatePublicRoles(response.payload))
    } else {
        // TODO - redirect to Error fragment
    }
}