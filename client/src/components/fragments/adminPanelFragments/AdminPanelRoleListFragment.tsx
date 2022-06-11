import React, { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  TextField,
  IconButton,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { useTheme, useMediaQuery } from "@mui/material";

import styles from "../../styles/adminPanelStyles/adminPanelRoleListStyles";
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";
import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import AdminPanelRoleCard from "./AdminPanelRoleCard";

interface AdminPanelRoleListFragmentPropsTypes {
  users: UserDocument[] | undefined;
  roles: RoleDocument[] | undefined;
  dataUpdate: Function;
}

export interface RoleItem {
  _id: string;
  role: string;
  description?: string;
  usersNumber: number;
  isPublic: boolean;
}

type MenuValue = "role" | "description";

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

const AdminPanelRoleListFragment: React.FunctionComponent<
  AdminPanelRoleListFragmentPropsTypes
> = ({ users, roles, dataUpdate }) => {
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
  const [roleItems, setRoleItems] = useState<RoleItem[]>();
  const [roleItemsToShow, setRoleItemsToShow] = useState<RoleItem[]>();

  // as soon as both users and roles are fetched or one of them is changed to initiate
  // update of the list to be shown
  useEffect(() => {
    if (users && roles) {
      setRoleItems(createRoleList(users, roles));
    }
  }, [users, roles]);
  // I decided to organize it the similar way as I have done it for user cards details
  const createRoleList = (
    users: UserDocument[],
    roles: RoleDocument[]
  ): RoleItem[] => {
    return roles.map((role) => {
      const usersNumber = users.filter(
        (user) => user.userrole_id === role._id
      ).length;
      // currently all roles with "admin" word in name are considered as not public
      // the code to define this was copied from the server part
      const roleItem: RoleItem = {
        _id: role._id,
        role: role.role,
        description: role.description,
        usersNumber: usersNumber,
        isPublic: !role.role.toLowerCase().includes("admin"),
      };
      return roleItem;
    });
  };

  // filter block handling variables
  const menuItems: FilterMenuItem[] = [
    { id: "1", label: textResourses.roleNameCardlabel, value: "role" },
    {
      id: "2",
      label: textResourses.roleDescriptionCardlabel,
      value: "description",
    },
  ];
  const [filters, setFilters] = useState<UserFilters>({
    field: "role",
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
    }
  };

  // here user filters are applied depending on user choices
  useEffect(() => {
    let filteredItems: RoleItem[] | undefined = roleItems?.filter((item) => {
      switch (filters.field) {
        case "role":
          if (
            item.role.includes(filters.filterValue) ||
            filters.filterValue === ""
          ) {
            return true;
          }
          break;
        case "description":
          if (
            item.description?.includes(filters.filterValue) ||
            filters.filterValue === ""
          ) {
            return true;
          }
          break;
      }
      return false;
    });

    setRoleItemsToShow(filteredItems);
  }, [filters, roleItems]);

  // click handlers
  const refreshDataClickHandler = () => {
    dataUpdate();
  };

  const addRoleClickHandler = () => {
    // TODO: add role click handler
  };

  // handle screen size change
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={styles.fragmentFrame}>
      <Toolbar sx={styles.toolbox}>
        <IconButton
          aria-label="delete"
          size="large"
          onClick={refreshDataClickHandler}
        >
          <CachedIcon fontSize="inherit" />
          {isSmallScreen ? null : (
            <Typography>{textResourses.refreshRolesBtnLabel}</Typography>
          )}
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
        <IconButton
          aria-label="delete"
          size="large"
          onClick={addRoleClickHandler}
        >
          <AddIcon fontSize="inherit" />
          {isSmallScreen ? null : (
            <Typography>{textResourses.addRoleBtnLabel}</Typography>
          )}
        </IconButton>
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
          {roleItemsToShow?.map((roleItem) => (
            <Grid
              item
              key={roleItem._id}
              sx={styles.gridItem}
              xs={12}
              sm={8}
              md={6}
              lg={4}
              xl={3}
            >
              <AdminPanelRoleCard roleItem={roleItem} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminPanelRoleListFragment;
