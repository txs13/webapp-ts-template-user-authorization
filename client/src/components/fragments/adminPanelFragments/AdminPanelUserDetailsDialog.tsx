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

interface UserDocumentForm extends UserDocument {
  nameError: string;
  familynameError: string;
  emailError: string;
  phoneError: string;
  addressError: string;
  companyError: string;
  positionError: string;
  descriptionError: string;
  isConfirmedError: string;
  userroleError: string;
}

const initialUserValue: UserDocumentForm = {
  _id: "",
  name: "",
  nameError: "",
  familyname: "",
  familynameError: "",
  email: "",
  emailError: "",
  phone: "",
  phoneError: "",
  address: "",
  addressError: "",
  company: "",
  companyError: "",
  position: "",
  positionError: "",
  description: "",
  descriptionError: "",
  isConfirmed: false,
  isConfirmedError: "",
  userrole_id: "",
  userroleError: "",
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

  // user card state variable
  const [cardState, setCardState] = useState<"view" | "edit">("view");

  // callback function to be done after screen is closed
  const handleClose = () => {};

  // variable to store user changes
  const [currentUser, setCurrentUser] =
    useState<UserDocumentForm>(initialUserValue);
  useEffect(() => {
    const userData = openStatus.currentUser as UserDocument;
    if (userData) {
      setCurrentUser({ ...initialUserValue, ...userData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openStatus]);
  // input changes handler
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "id":
        break;
    }
  };

  // buttons' click handlers
  const clipboardClickHandler = () => {};
  const editClickHandler = () => {
    setCardState("edit");
  };
  const viewClickHandler = () => {
    setCardState("view");
  };
  const deleteClickHandler = () => {};
  const saveClickHandler = () => {};
  const closeClickHandler = () => {
    closeDialog();
  };

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
          name="id"
          onChange={changeHandler}
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
          <Button onClick={clipboardClickHandler}>
            {textResourses.clipboardBtnDialogBoxLabel}
          </Button>
          <Button
            sx={{ display: cardState === "view" ? "none" : "" }}
            onClick={deleteClickHandler}
          >
            {textResourses.deleteBtnDialogBoxLabel}
          </Button>
          <Button
            sx={{ display: cardState === "view" ? "none" : "" }}
            onClick={saveClickHandler}
          >
            {textResourses.saveBtnDialogBoxLabel}
          </Button>
          <Button
            sx={{ display: cardState === "view" ? "" : "none" }}
            onClick={editClickHandler}
          >
            {textResourses.editBtnDialogBoxLabel}
          </Button>
          <Button
            sx={{ display: cardState === "view" ? "none" : "" }}
            onClick={viewClickHandler}
          >
            {textResourses.cancelBtnDialogBoxLabel}
          </Button>
          <Button onClick={closeClickHandler}>
            {textResourses.closeBtnDialogBoxLabel}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanelUserDetailsDialog;
