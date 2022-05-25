import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ButtonGroup,
  Button,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import { OpenUserDetailsStatus } from "./AdminPanelUserListFragment";
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";
import styles from "../../styles/adminPanelStyles/adminPanelUserDetailsDialogStyles";

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
    <Dialog open={openStatus.open} onClose={handleClose} sx={styles.mainFrame}>
      <DialogTitle>
        <Typography>{textResourses.headerDialogBoxLabel}</Typography>
      </DialogTitle>
      <DialogContent sx={styles.inputsBlock}>
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.nameDialogBoxlabel}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.familynameDialogBoxlabel}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.emailDialogBoxlabel}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.phoneDialogBoxlabel}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.addressDialogBoxlabel}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.companyDialogBoxlabel}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.positionDialogBoxlabel}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.descriptionDialogBoxlabel}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.userRoleDialogBoxlabel}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.createdAtDialogBoxlabel}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.updatedAtDialogBoxlabel}
        />
      </DialogContent>
      <DialogActions>
        <ButtonGroup fullWidth>
          <Button>edit</Button>
          <Button>confirm</Button>
          <Button>delete</Button>
          <Button onClick={() => closeDialog()}>close</Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanelUserDetailsDialog;
