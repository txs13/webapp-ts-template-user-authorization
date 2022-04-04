import { createSlice } from "@reduxjs/toolkit";

export interface RoleInterface {
    _id: String;
    role: String;
    description: String;
    createdAt: Date;
    updatedAt: Date;
    __v: Number;
}

const initialRoleValue: RoleInterface | null = null

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