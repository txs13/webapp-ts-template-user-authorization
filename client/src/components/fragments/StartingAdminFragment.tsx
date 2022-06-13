import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"

import AdminPanelNavigationFragment from "./adminPanelFragments/AdminPanelNavigationFragment";
import AdminPanelUserListFragment from "./adminPanelFragments/AdminPanelUserListFragment";
import AdminPanelRoleListFragment from "./adminPanelFragments/AdminPanelRoleListFragment";
import AdminPanelStartingPageFragment from "./adminPanelFragments/AdminPanelStartingPageFragment";
import startingAdminFragmentStyles from "../styles/startingAdminFragmentStyles";
import { fetchAllUsers } from "../../app/services/userServices";
import { RoleDocument, UserDocument } from "../../interfaces/inputInterfaces";
import { RootState } from "../../app/store";

type DataRefreshState = "userupdate" | "waiting";

const StartingAdminFragment: React.FunctionComponent = () => {
  const dispatch = useDispatch()
  // variables to store list of users, roles, shortened list to be mapped and shown
  const [users, setUsers] = useState<UserDocument[]>();
  //const [roles, setRoles] = useState<RoleDocument[]>();
  const roles = useSelector((state: RootState) => state.role.value)

  // this structure is needed in order to fetch data once after fragment is shown and
  // then I could initiate another datafetch for instance after I delete a user or edit it
  // "start" to fetch both users and roles after fragment is rendered
  // "userupdate" to fetch only users - there is not going to be option to change roles so
  // there is no need to fetch roles once again
  // "waiting" to do nothing unless another data fetching is needed
  const [dataRefreshState, setDataRefreshState] =
    useState<DataRefreshState>("userupdate");
  useEffect(() => {
    switch (dataRefreshState) {
      case "userupdate":
        fetchAllUsers().then((userres) => {
          setUsers(userres);
          setDataRefreshState("waiting");
        });
        break;
      case "waiting":
        break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRefreshState]);
  const dataUpdate = () => {
    setDataRefreshState("userupdate");
  };

  return (
    <Box sx={startingAdminFragmentStyles.fragmentFrame}>
      <AdminPanelNavigationFragment />
      <>
        <Routes>
          <Route
            path=""
            element={
              <AdminPanelStartingPageFragment
                users={users}
                roles={roles}
                dataUpdate={dataUpdate}
              />
            }
          />
          <Route
            path="userlist"
            element={
              <AdminPanelUserListFragment
                users={users}
                roles={roles}
                dataUpdate={dataUpdate}
              />
            }
          />
          <Route
            path="rolelist"
            element={
              <AdminPanelRoleListFragment
                users={users}
                roles={roles}
                dataUpdate={dataUpdate}
              />
            }
          />
        </Routes>
      </>
    </Box>
  );
};

export default StartingAdminFragment;
