import { createSlice } from "@reduxjs/toolkit";

export interface UserInterface {
  _id: String;
  email: String;
  name: String;
  familyname?: String;
  phone?: String;
  address?: String;
  company?: String;
  position?: String;
  description?: String;
  userrole_id: String;
  createdAt: Date;
  updatedAt: Date;
  __v: Number;
}

const initialUserValue: UserInterface | null = null;

export const userSlice = createSlice({
  name: "user",
  initialState: { value: initialUserValue },
  reducers: {
    
    loginUser: (state, action) => {
      
    },

    logoutUser: (state, action) => {
      
    },

  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
