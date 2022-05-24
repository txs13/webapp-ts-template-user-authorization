import React, {useState, useEffect} from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, ButtonGroup, Button } from "@mui/material";
import { useSelector } from "react-redux";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import { OpenUserDetailsStatus } from "./AdminPanelUserListFragment"
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";

export interface AdminPanelUserDetailsDialogPropsTypes {
  openStatus: OpenUserDetailsStatus;
  roles: RoleDocument[] | undefined;
  closeDialog: Function;
  dataUpdate: Function;
}

const AdminPanelUserDetailsDialog: React.FunctionComponent<
  AdminPanelUserDetailsDialogPropsTypes
> = ({ openStatus, roles, closeDialog, dataUpdate }) => {
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

  // callback function to be done after screen is closed
  const handleClose = () => {};

  return (
    <Dialog open={openStatus.open} onClose={handleClose}>
      <DialogTitle>User details</DialogTitle>
      <DialogContent>
        <TextField label="id" />
        <TextField label="id" />
        <TextField label="id" />
        <TextField label="id" />
        <TextField label="id" />
        <TextField label="id" />
        <TextField label="id" />
        <TextField label="id" />
        <TextField label="id" />
        <TextField label="id" />
      </DialogContent>
      <DialogActions>
        <ButtonGroup>
          <Button>edit</Button>
          <Button>confirm</Button>
          <Button>delete</Button>
          <Button onClick={()=>closeDialog()}>close</Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanelUserDetailsDialog;
