import React, { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";

import styles from "../../styles/adminPanelStyles/adminPanelUserListStyles";
import { fetchAllUsers } from "../../../app/services/userServices";
import { fetchAllRoles } from "../../../app/services/roleServices";
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";

const AdminPanelUserListFragment: React.FunctionComponent = () => {
  const [users, setUsers] = useState<[UserDocument]>();
  const [roles, setRoles] = useState<[RoleDocument]>();

  useEffect(() => {
    fetchAllUsers().then((res) => {
      setUsers(res);
      console.log(res);
    });
    fetchAllRoles().then((res) => {
      setRoles(res);
      console.log(res);
    });
  }, []);

  return (
    <Box sx={styles.fragmentFrame}>
      <Toolbar sx={styles.toolbox}>
        <Typography>Search by</Typography>
        <TextField label="field name" variant="filled" />
        <TextField label="search field" variant="filled" />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="to be confirmed only"
        />
      </Toolbar>
      <Box sx={styles.databox}></Box>
    </Box>
  );
};

export default AdminPanelUserListFragment;
