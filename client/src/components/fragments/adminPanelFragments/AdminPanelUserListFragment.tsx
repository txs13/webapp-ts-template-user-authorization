import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Toolbar,
  TextField,
  Switch,
  FormControlLabel,
  Grid
} from "@mui/material";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import AdminPanelUserCard from "./AdminPanelUserCard";
import AdminPanelLoadingFragment from "./AdminPanelLoadingFragment";
import styles from "../../styles/adminPanelStyles/adminPanelUserListStyles";
import { fetchAllUsers } from "../../../app/services/userServices";
import { fetchAllRoles } from "../../../app/services/roleServices";
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";
import AdminPanelUserDetailsDialog from "./AdminPanelUserDetailsDialog";

type DataRefreshState = "start" | "userupdate" | "waiting";

export interface OpenUserDetailsStatus {
  open: boolean;
  currentUser: UserDocument | undefined;
}

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
  // get data from app settings store and get text resouses in proper language
  const appSettings = useSelector(
    (state: RootState) => state.appSettings.value
  );
  const [textResourses, setTextResourses] = useState<LocalizedTextResources>(
    {}
  );
  useEffect(() => {
    setTextResourses(getTextResources(appSettings.language));
  }, [appSettings]);
  
  // variables to store list of users, roles, shortened list to be mapped and shown
  const [users, setUsers] = useState<UserDocument[]>();
  const [roles, setRoles] = useState<RoleDocument[]>();
  const [userItems, setUserItems] = useState<UserItem[]>();
  
  // this structure is needed in order to fetch data once after fragment is shown and
  // then I could initiate another datafetch for instance after I delete a user or edit it
  // "start" to fetch both users and roles after fragment is rendered
  // "userupdate" to fetch only users - there is not going to be option to change roles so
  // there is no need to fetch roles once again
  // "waiting" to do nothing unless another data fetching is needed
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
  const dataUpdate = () => {
    setDataRefreshState("userupdate");
  }
  // as soon as both users and roles are fetched or one of them is changed to initiate
  // update of the list to be shown
  useEffect(() => {
    if (users && roles) {
      setUserItems(createUserList(users, roles));
    }
  }, [users, roles]);
  // function which taked limited number of items to be shown, cobmines with the correct role names
  // one of the resons to organize it in this way was to be able to change it later on
  // if i decide that I would not like to fetch ALL users' details from teh server and only some
  // limited dataset, the only thing which is going to be required is to adjust api call and
  // this mapping function - everything else will work unchanged
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

  // this variable is needed to open dialog screen with user details
  const [openUserDetailsStatus, setOpenUserDetailsStatus] = useState<OpenUserDetailsStatus>({open:false, currentUser: undefined})
  const openUserDetails = (userId: string) => {
    const user = users?.find((user)=> user._id === userId)
    if (user) {
      setOpenUserDetailsStatus({open: true, currentUser: user})
    }
  }
  const closeUserDetails = () => {
    setOpenUserDetailsStatus({ open: false, currentUser: undefined });
  }

  return (
    <Box sx={styles.fragmentFrame}>
      <Toolbar sx={styles.toolbox}>
        <TextField
          sx={styles.searchFieldLabel}
          label={textResourses.searchFieldLabel}
          variant="standard"
        />
        <TextField
          sx={styles.searchWhatlabel}
          label={textResourses.searchWhatlabel}
          variant="standard"
        />
        <FormControlLabel
          control={<Switch size="small" defaultChecked />}
          label={textResourses.toBeConfirmedSwitchLabel}
        />
      </Toolbar>
      <Box sx={styles.databox}>
        {userItems ? (
          <Grid
            container
            rowSpacing={1}
            columnSpacing={1}
            sx={styles.gridBox}
            alignItems="center"
            columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
          >
            {userItems.map((user) => (
              <Grid
                item
                key={user._id}
                sx={styles.gridItem}
                xs={12}
                sm={8}
                md={6}
                lg={4}
                xl={3}
              >
                <AdminPanelUserCard
                  user={user}
                  dataUpdate={dataUpdate}
                  openUserDetails={openUserDetails}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AdminPanelLoadingFragment />
        )}
      </Box>
      <AdminPanelUserDetailsDialog
        openStatus={openUserDetailsStatus}
        roles={roles}
        closeDialog={closeUserDetails}
        dataUpdate={dataUpdate}
      />
    </Box>
  );
};

export default AdminPanelUserListFragment;
