import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Toolbar,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import AdminPanelUserCard from "./AdminPanelUserCard";
import styles from "../../styles/adminPanelStyles/adminPanelUserListStyles";
import { deleteUser, putUserService } from "../../../app/services/userServices";
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";
import AdminPanelUserDetailsDialog from "./AdminPanelUserDetailsDialog";
import AdminPanelUserListConfirmationDialog from "../reusableComponents/ConfirmationDialog";
import {
  OpenConfimationStatus,
  openConfimationInitialState,
} from "../reusableComponents/ConfirmationDialog";
import AdminPanelNewPasswordDialog from "./AdminPanelNewPasswordDialog";

export interface OpenNewPasswordStatus {
  open: boolean;
  user: UserDocument | undefined;
  password: string | undefined;
}

const initialNewPasswordStatus: OpenNewPasswordStatus = {
  open: false,
  user: undefined,
  password: undefined,
};

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

type MenuValue = "name" | "familyname" | "email" | "company" | "userrole";

interface FilterMenuItem {
  id: string;
  label: string;
  value: MenuValue;
}

interface UserFilters {
  field: MenuValue;
  filterValue: string;
  showNotConfirmed: boolean;
}

interface AdminPanelUserListFragmentPropsTypes {
  users: UserDocument[] | undefined;
  roles: RoleDocument[] | undefined;
  dataUpdate: Function;
}

const AdminPanelUserListFragment: React.FunctionComponent<
  AdminPanelUserListFragmentPropsTypes
> = ({ users, roles, dataUpdate }) => {
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

  // handle screen size change
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // variables to store list of users, roles, shortened list to be mapped and shown
  const [userItems, setUserItems] = useState<UserItem[]>();
  const [userItemsToShow, setUserItemsToShow] = useState<UserItem[]>();

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

  // filter block handling variables
  const menuItems: FilterMenuItem[] = [
    { id: "1", label: textResourses.nameDialogBoxlabel, value: "name" },
    {
      id: "2",
      label: textResourses.familynameDialogBoxlabel,
      value: "familyname",
    },
    { id: "3", label: textResourses.emailDialogBoxlabel, value: "email" },
    { id: "4", label: textResourses.companyDialogBoxlabel, value: "company" },
    { id: "5", label: textResourses.userRoleDialogBoxlabel, value: "userrole" },
  ];
  const [filters, setFilters] = useState<UserFilters>({
    field: "familyname",
    filterValue: "",
    showNotConfirmed: true,
  });
  const filtersChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "field":
        setFilters({ ...filters, field: e.target.value as MenuValue });
        break;
      case "filterValue":
        setFilters({ ...filters, filterValue: e.target.value });
        break;
      case "showNotConfirmed":
        setFilters({ ...filters, showNotConfirmed: !filters.showNotConfirmed });
    }
  };

  // here user filters are applied depending on user choices
  useEffect(() => {
    let filteredItems: UserItem[] | undefined = userItems?.filter((item) => {
      switch (filters.field) {
        case "name":
          if (
            item.name.includes(filters.filterValue) ||
            filters.filterValue === ""
          ) {
            return true;
          }
          break;
        case "familyname":
          if (
            item.familyname?.includes(filters.filterValue) ||
            filters.filterValue === ""
          ) {
            return true;
          }
          break;
        case "email":
          if (
            item.email.includes(filters.filterValue) ||
            filters.filterValue === ""
          ) {
            return true;
          }
          break;
        case "company":
          if (
            item.company?.includes(filters.filterValue) ||
            filters.filterValue === ""
          ) {
            return true;
          }
          break;
        case "userrole":
          if (
            item.userrole.includes(filters.filterValue) ||
            filters.filterValue === ""
          ) {
            return true;
          }
          break;
      }
      return false;
    });

    if (filters.showNotConfirmed) {
      filteredItems = filteredItems?.filter((it) => !it.isConfirmed);
    }

    setUserItemsToShow(filteredItems);
  }, [filters, userItems]);

  // this variable is needed in order to open new passsword dialog window
  // according to my current investigation, MUI Dialog does not allow to
  // nest dialog windows - so this is the reason to handle it exactly this way
  // part of the related code - useEffect and password reset are organized in
  // userdetails dialog fragment
  const [openNewPasswordStatus, setOpenNewPasswordStatus] =
    useState<OpenNewPasswordStatus>(initialNewPasswordStatus);
  // this function is used to open new password dialog and should be
  // passed to the user details dialog
  const openNewPasswordDialog = (user: UserDocument) => {
    setOpenNewPasswordStatus({
      ...openNewPasswordStatus,
      user: user,
      open: true,
    });
  };
  // this function is needed to set new password and should be passed to
  // the new password dialog only
  const setNewPassword = (password: string) => {
    setOpenNewPasswordStatus({
      ...openNewPasswordStatus,
      password: password,
      open: false,
    });
  };
  // this function is needed for both cancelling the new password dialog and
  // resetting the dialog state after the new password for is read
  const resetNewPasswordDialog = () => {
    setOpenNewPasswordStatus(initialNewPasswordStatus);
  };

  // this variable is needed to open dialog screen with user details
  const [openUserDetailsStatus, setOpenUserDetailsStatus] =
    useState<OpenUserDetailsStatus>({ open: false, currentUser: undefined });
  const openUserDetails = (userId: string) => {
    const user = users?.find((user) => user._id === userId);
    if (user) {
      setOpenUserDetailsStatus({ open: true, currentUser: user });
    }
  };
  const closeUserDetails = () => {
    setOpenUserDetailsStatus({ open: false, currentUser: undefined });
  };

  // this block is responsibelt for the universal model / confimation window
  const [openConfirmationStatus, setOpenConfirmationStatus] =
    useState<OpenConfimationStatus>(openConfimationInitialState);
  const openConfirmationDialog = (
    message: string,
    successCBFunction: Function
  ) => {
    setOpenConfirmationStatus({
      open: true,
      message: message,
      successCBFunction: successCBFunction,
    });
  };
  const submitConfirmationDecision = (
    decision: "yes" | "no",
    successCBFunction?: Function
  ) => {
    if (decision === "yes" && successCBFunction) {
      successCBFunction();
    }
    setOpenConfirmationStatus(openConfimationInitialState);
  };

  // functions to call proper services and api calls
  const confirmUserServiceCall = async (userId: string) => {
    // assemble ready to transmit updated user object
    const updatedUser: UserDocument = {
      ...users?.find((it) => it._id === userId),
    } as UserDocument;
    updatedUser.isConfirmed = true;
    // api call service
    const result = await putUserService(updatedUser);
    // if api call was successful, show the confirmation
    // update users list
    if (result) {
      dataUpdate();
      closeUserDetails();
    }
  };

  const updateUserServiceCall = async (updatedUser: UserDocument) => {
    // api call service
    const result = await putUserService(updatedUser);
    // if api call was successful, show the confirmation
    // update users list
    if (result) {
      dataUpdate();
      closeUserDetails();
    }
  };

  const deleteUserServiceCall = async (userId: string) => {
    // api call service
    const result = await deleteUser(userId);
    // if api call was successful, show the confirmation
    // update users list
    if (result) {
      dataUpdate();
      closeUserDetails();
    }
  };

  // click handlers
  const refreshDataClickHandler = () => {
    dataUpdate();
  };

  return (
    <Box sx={styles.fragmentFrame}>
      <Toolbar sx={styles.toolbox}>
        <IconButton
          aria-label="delete"
          size="large"
          onClick={refreshDataClickHandler}
        >
          <CachedIcon fontSize="inherit" />
        </IconButton>
        <TextField
          select
          name="field"
          value={filters.field}
          onChange={filtersChangeHandler}
          sx={styles.searchFieldLabel}
          label={textResourses.searchFieldLabel}
          variant="standard"
        >
          {menuItems.map((item) => (
            <MenuItem key={item.id} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="filterValue"
          onChange={filtersChangeHandler}
          value={filters.filterValue}
          sx={styles.searchWhatlabel}
          label={textResourses.searchWhatlabel}
          variant="standard"
        />
        <FormControlLabel
          control={
            <Switch
              name="showNotConfirmed"
              onChange={filtersChangeHandler}
              value={filters.showNotConfirmed}
              size="small"
              defaultChecked
            />
          }
          label={textResourses.toBeConfirmedSwitchLabel}
        />
      </Toolbar>
      <Box sx={styles.databox}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={1}
          sx={styles.gridBox}
          alignItems="center"
          columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
        >
          {userItemsToShow?.map((user) => (
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
                openConfirmationDialog={openConfirmationDialog}
                confirmUserServiceCall={confirmUserServiceCall}
                deleteUserServiceCall={deleteUserServiceCall}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <AdminPanelUserDetailsDialog
        openStatus={openUserDetailsStatus}
        roles={roles}
        closeDialog={closeUserDetails}
        dataUpdate={dataUpdate}
        openConfirmationDialog={openConfirmationDialog}
        updateUserServiceCall={updateUserServiceCall}
        deleteUserServiceCall={deleteUserServiceCall}
        openNewPasswordDialogStatus={openNewPasswordStatus}
        openNewPasswordDialog={openNewPasswordDialog}
        resetNewPasswordDialog={resetNewPasswordDialog}
        isSmallScreen={isSmallScreen}
      />
      <AdminPanelUserListConfirmationDialog
        openStatus={openConfirmationStatus}
        submitConfirmationDecision={submitConfirmationDecision}
      />
      <AdminPanelNewPasswordDialog
        openStatus={openNewPasswordStatus}
        setNewPassword={setNewPassword}
        closeDialog={resetNewPasswordDialog}
        isSmallScreen={isSmallScreen}
      />
    </Box>
  );
};

export default AdminPanelUserListFragment;
