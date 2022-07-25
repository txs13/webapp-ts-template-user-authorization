import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  ButtonGroup,
  Button
} from "@mui/material";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import { OpenRoleUserListStatus } from "./AdminPanelRoleListFragment";

export interface AdminPanelRoleUserListDialogPropsTypes {
  openStatus: OpenRoleUserListStatus;
  closeDialog: Function;
}

const AdminPanelRoleUserListDialog: React.FunctionComponent<
  AdminPanelRoleUserListDialogPropsTypes
> = ({ openStatus, closeDialog }) => {
  // get data from app settings store and get text resources in proper language
  const appSettings = useSelector(
    (state: RootState) => state.appSettings.value
  );
  const [textResources, setTextResources] = useState<LocalizedTextResources>(
    {}
  );
  useEffect(() => {
    setTextResources(getTextResources(appSettings.language));
  }, [appSettings]);

  // click handlers
  const closeClickHandler = () => {
    closeDialog()
  }

  return (
    <Dialog open={openStatus.open}>
      <DialogTitle>
        <Typography>
          {`${textResources.roleUsersListHeader} "${openStatus.currentRole?.role}"`}
        </Typography>
      </DialogTitle>
      <DialogContent>

      </DialogContent>
      <DialogActions>
        <ButtonGroup>
          <Button onClick={closeClickHandler}>
            {textResources.roleUsersListCloseBtnLabel}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanelRoleUserListDialog;
