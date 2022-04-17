import { createSlice } from "@reduxjs/toolkit";

import { RoleDocument } from '../../interfaces/inputInterfaces'

const initialRoleValue: RoleDocument[] | null = null

export const roleSlice = createSlice({
    name: "role",
    initialState: {value: initialRoleValue},
    reducers: {
        getPublicRoles: (state, action) => {

        }
    }
})

export const { getPublicRoles } = roleSlice.actions

export default roleSlice.reducer