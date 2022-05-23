import React from "react"

import { UserItem } from "./AdminPanelUserListFragment"

interface UserCardPropsTypes {
    user: UserItem,
    update: Function
}

const AdminPanelUserCard: React.FunctionComponent<UserCardPropsTypes> = ({user, update}) => {

    return(
    <>
    {user.email}
    </>
    )
}

export default AdminPanelUserCard;