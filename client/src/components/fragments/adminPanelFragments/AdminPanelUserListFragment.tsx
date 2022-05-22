import React from "react";
import {
  Box,
  Toolbar,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";

import styles from "../../styles/adminPanelStyles/adminPanelUserListStyles";

const AdminPanelUserListFragment: React.FunctionComponent = () => {
  return (
    <Box sx={styles.fragmentFrame}>
      <Toolbar sx={styles.toolbox}>
        <Typography>Search by</Typography>
        <TextField label="field name" variant="filled" />
        <TextField label="search field" variant="filled" />
        <FormControlLabel control={<Switch defaultChecked />} label="to be confirmed only" />
      </Toolbar>
      <Box sx={styles.databox}></Box>
    </Box>
  );
};

export default AdminPanelUserListFragment;
