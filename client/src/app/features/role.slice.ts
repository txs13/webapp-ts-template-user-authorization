import { createSlice } from "@reduxjs/toolkit";

import { RoleDocument } from '../../interfaces/inputInterfaces'

const initialRoleValue: RoleDocument[] = []

export const roleSlice = createSlice({
  name: "role",
  initialState: { value: initialRoleValue },
  reducers: {
    updatePublicRoles: (state, action) => {
      state.value = [...(action.payload as RoleDocument[])];
    },
  },
});

export const { updatePublicRoles } = roleSlice.actions

export default roleSlice.reducer