import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Toolbar,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  MenuItem,
} from "@mui/material";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import AdminPanelUserCard from "./AdminPanelUserCard";
import AdminPanelLoadingFragment from "./AdminPanelLoadingFragment";
import styles from "../../styles/adminPanelStyles/adminPanelUserListStyles";
import {
  deleteUser,
  fetchAllUsers,
  putUser,
} from "../../../app/services/userServices";
import { fetchAllRoles } from "../../../app/services/roleServices";
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";
import AdminPanelUserDetailsDialog from "./AdminPanelUserDetailsDialog";
import AdminPanelUserListConfirmationDialog from "../reusableComponents/ConfirmationDialog";
import {
  AppAlertMessage,
  showMessage,
} from "../../../app/features/appAlertMessage.slice";
import {
  OpenConfimationStatus,
  openConfimationInitialState,
} from "../reusableComponents/ConfirmationDialog";

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

const AdminPanelUserListFragment: React.FunctionComponent = () => {
  const dispatch = useDispatch();
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
  const [userItemsToShow, setUserItemsToShow] = useState<UserItem[]>();

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
          //console.log(userres);
          fetchAllRoles().then((roleres) => {
            setRoles(roleres);
            //console.log(roleres);
            setDataRefreshState("waiting");
          });
        });
        break;
      case "userupdate":
        fetchAllUsers().then((userres) => {
          setUsers(userres);
          //console.log(userres);
          setDataRefreshState("waiting");
        });
        break;
      case "waiting":
        break;
    }
  }, [dataRefreshState]);
  const dataUpdate = () => {
    setDataRefreshState("userupdate");
  };
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
    const updatedUser: UserDocument = {
      ...users?.find((it) => it._id === userId),
    } as UserDocument;

    updatedUser.isConfirmed = true;
    const result = await putUser(updatedUser);
    // to process user updated result
    if (Array.isArray(result)) {
      if (result[0].message === "user is successfully updated") {
        setDataRefreshState("userupdate");
        const successMessage: AppAlertMessage = {
          alertType: "success",
          alertMessage: textResourses.userConfirmSuccessMessage,
        };
        dispatch(showMessage(successMessage));
      } else {
        const successMessage: AppAlertMessage = {
          alertType: "error",
          alertMessage: textResourses.userConfirmFailureMessage,
        };
        dispatch(showMessage(successMessage));
      }
    }
  };

  const updateUserServiceCall = async (updatedUser: UserDocument) => {
    const result = await putUser(updatedUser);
    // to process user updated result
    if (Array.isArray(result)) {
      if (result[0].message === "user is successfully updated") {
        setDataRefreshState("userupdate");
        closeUserDetails();
        const successMessage: AppAlertMessage = {
          alertType: "success",
          alertMessage: textResourses.userUpdateSuccessMessage,
        };
        dispatch(showMessage(successMessage));
      } else {
        const successMessage: AppAlertMessage = {
          alertType: "error",
          alertMessage: textResourses.userUpdateFailureMessage,
        };
        dispatch(showMessage(successMessage));
      }
    }
  };

  const deleteUserServiceCall = async (userId: string) => {
    const result = await deleteUser(userId);
    // to process user delete result
    if (Array.isArray(result)) {
      if (result[0].message === "user is successfully deleted") {
        setDataRefreshState("userupdate");
        closeUserDetails();
        const successMessage: AppAlertMessage = {
          alertType: "success",
          alertMessage: textResourses.userDeleteSuccessMessage,
        };
        dispatch(showMessage(successMessage));
      } else {
        const successMessage: AppAlertMessage = {
          alertType: "error",
          alertMessage: textResourses.userDeleteFailureMessage,
        };
        dispatch(showMessage(successMessage));
      }
    }
  };

  return (
    <Box sx={styles.fragmentFrame}>
      <Toolbar sx={styles.toolbox}>
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
        {userItems ? (
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
        ) : (
          <AdminPanelLoadingFragment />
        )}
      </Box>
      <AdminPanelUserDetailsDialog
        openStatus={openUserDetailsStatus}
        roles={roles}
        closeDialog={closeUserDetails}
        dataUpdate={dataUpdate}
        openConfirmationDialog={openConfirmationDialog}
        updateUserServiceCall={updateUserServiceCall}
        deleteUserServiceCall={deleteUserServiceCall}
      />
      <AdminPanelUserListConfirmationDialog
        openStatus={openConfirmationStatus}
        submitConfirmationDecision={submitConfirmationDecision}
      />
    </Box>
  );
};

export default AdminPanelUserListFragment;
