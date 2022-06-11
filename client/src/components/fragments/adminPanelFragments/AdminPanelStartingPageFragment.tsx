import React from "react";
import { Box } from "@mui/material";

import styles from "../../styles/adminPanelStyles/adminPanelStartingPageStyles"
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";

interface AdminPanelStartingPageFragmentPropsTypes {
  users: UserDocument[] | undefined;
  roles: RoleDocument[] | undefined;
  dataUpdate: Function;
}

const AdminPanelStartingPageFragment: React.FunctionComponent<
  AdminPanelStartingPageFragmentPropsTypes
> = ({users, roles, dataUpdate}) => {
  return (
    <Box sx={styles.fragmentFrame}>ADMIN PANEL STARTING PAGE FRAGMENT</Box>
  );
};

export default AdminPanelStartingPageFragment;
