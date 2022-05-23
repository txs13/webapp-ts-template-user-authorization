import React, { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Grid
} from "@mui/material";

import AdminPanelUserCard from "./AdminPanelUserCard";
import AdminPanelLoadingFragment from "./AdminPanelLoadingFragment";
import styles from "../../styles/adminPanelStyles/adminPanelUserListStyles";
import { fetchAllUsers } from "../../../app/services/userServices";
import { fetchAllRoles } from "../../../app/services/roleServices";
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";

type DataRefreshState = "start" | "userupdate" | "waiting";

export interface UserItem {
  _id: string;
  email: string;
  name: string;
  familyname?: string;
  company?: string;
  userrole: string;
  isConfirmed?: Boolean;
}

const AdminPanelUserListFragment: React.FunctionComponent = () => {
  const [users, setUsers] = useState<UserDocument[]>();
  const [roles, setRoles] = useState<RoleDocument[]>();
  const [userItems, setUserItems] = useState<UserItem[]>();
  const [dataRefreshState, setDataRefreshState] =
    useState<DataRefreshState>("start");

  useEffect(() => {
    switch (dataRefreshState) {
      case "start":
        fetchAllUsers().then((userres) => {
          setUsers(userres);
          console.log(userres);
          fetchAllRoles().then((roleres) => {
            setRoles(roleres);
            console.log(roleres);
            setDataRefreshState("waiting");
          });
        });
        break;
      case "userupdate":
        fetchAllUsers().then((userres) => {
          setUsers(userres);
          console.log(userres);
          setDataRefreshState("waiting");
        });
        break;
      case "waiting":
        break;
    }
  }, [dataRefreshState]);

  useEffect(() => {
    if (users && roles) {
      setUserItems(createUserList(users, roles));
    }
  }, [users, roles]);

  const createUserList = (
    users: UserDocument[],
    roles: RoleDocument[]
  ): UserItem[] => {
    return users.map((user) => {
      const userRole = roles.find((role) => role._id === user.userrole_id);
      const userItem: UserItem = {
        _id: user._id,
        email: user.email,
        name: user.name,
        familyname: user.familyname,
        company: user.company,
        userrole: userRole?.role as string,
        isConfirmed: user.isConfirmed,
      };
      return userItem;
    });
  };

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
      <Box sx={styles.databox}>
        {userItems ? <Grid container>
          {userItems.map((user)=>(
            <Grid item key={user._id}>
              <AdminPanelUserCard user={user} update={setDataRefreshState}/>
            </Grid>
          ))}
        </Grid> : <AdminPanelLoadingFragment />}
      </Box>
    </Box>
  );
};

export default AdminPanelUserListFragment;
