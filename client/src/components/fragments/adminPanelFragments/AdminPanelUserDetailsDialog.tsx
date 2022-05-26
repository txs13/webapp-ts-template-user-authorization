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

const initialUserValue: UserDocument = {
  _id: "",
  name: "",
  familyname: "",
  email: "",
  phone: "",
  address: "",
  company: "",
  position: "",
  description: "",
  isConfirmed: false,
  userrole_id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

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

  // variable to store user changes
  const [currentUser, setCurrentUser] =
    useState<UserDocument>(initialUserValue);
  useEffect(() => {
    const userData = openStatus.currentUser as UserDocument;
    if (userData) {
      setCurrentUser({ ...initialUserValue, ...userData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openStatus]);

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
          label={textResourses.idDialogBoxlabel}
          value={currentUser._id}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.nameDialogBoxlabel}
          value={currentUser.name}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.familynameDialogBoxlabel}
          value={currentUser.familyname}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.emailDialogBoxlabel}
          value={currentUser.email}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.phoneDialogBoxlabel}
          value={currentUser.phone}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.addressDialogBoxlabel}
          value={currentUser.address}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.companyDialogBoxlabel}
          value={currentUser.company}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.positionDialogBoxlabel}
          value={currentUser.position}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.descriptionDialogBoxlabel}
          value={currentUser.description}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.userRoleDialogBoxlabel}
          value={currentUser.userrole_id}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.isconfirmedDialogBoxlabel}
          value={currentUser.isConfirmed}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.createdAtDialogBoxlabel}
          value={currentUser.createdAt}
        />
        <TextField
          fullWidth
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.updatedAtDialogBoxlabel}
          value={currentUser.updatedAt}
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
