import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
  ButtonGroup,
  Button,
} from "@mui/material";

import { OpenNewPasswordStatus } from "./AdminPanelUserListFragment";
import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";

interface AdminPanelNewPasswordDialogTypesProps {
  openStatus: OpenNewPasswordStatus;
  setNewPassword: Function;
  closeDialog: Function;
}

const AdminPanelNewPasswordDialog: React.FunctionComponent<
  AdminPanelNewPasswordDialogTypesProps
> = ({ openStatus, setNewPassword, closeDialog }) => {
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

  // click handlers
  const cancelClickHandler = () => {
    closeDialog();
  };
  const setPasswordClickHandler = () => {
    // TODO: validate passwords
    // TODO: submit new password value
    setNewPassword("asdfg123")
  };
  const generatePasswordClickHandler = () => {
    // TODO: generate and set new passsword
    // TODO: copy new password to teh clipboard
  };

  return (
    <Dialog open={openStatus.open}>
      <DialogTitle>
        <Typography>{textResourses.newPasswordDialogHeader}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>{`${textResourses.newPasswordDialogText} ${openStatus.user?.email}`}</Typography>
        <TextField label={textResourses.passwordInputLabel} />
        <TextField label={textResourses.confirmPasswordInputLabel} />
      </DialogContent>
      <DialogActions>
        <ButtonGroup>
          <Button onClick={setPasswordClickHandler}>
            {textResourses.setNewPasswordDialogBtnLabel}
          </Button>
          <Button onClick={generatePasswordClickHandler}>
            {textResourses.generateNewPasswordDialogBtnLabel}
          </Button>
          <Button onClick={cancelClickHandler}>
            {textResourses.cancelNewPasswordDialogBtnLabel}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanelNewPasswordDialog;
