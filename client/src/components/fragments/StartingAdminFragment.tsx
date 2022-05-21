import React from "react";
import { Box } from '@mui/material'
import {Routes, Route} from 'react-router-dom'

import AdminPanelNavigationFragment from "./adminPanelFragments/AdminPanelNavigationFragment";
import AdminPanelUserListFragment from "./adminPanelFragments/AdminPanelUserListFragment";
import AdminPanelRoleListFragment from "./adminPanelFragments/AdminPanelRoleListFragment";
import AdminPanelStartingPageFragment from "./adminPanelFragments/AdminPanelStartingPageFragment";

const StartingAdminFragment: React.FunctionComponent = () => {

  return (
    <>
      <AdminPanelNavigationFragment />
      <Box>
        <Routes>
          <Route path="" element={<AdminPanelStartingPageFragment />} />
          <Route path="userlist" element={<AdminPanelUserListFragment />} />
          <Route path="rolelist" element={<AdminPanelRoleListFragment />} />
        </Routes>
      </Box>
    </>
  );
};

export default StartingAdminFragment;
