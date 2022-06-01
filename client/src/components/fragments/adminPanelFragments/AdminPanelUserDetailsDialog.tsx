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
  MenuItem,
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
import { validateResourceAsync } from "../../../utils/validateResource"
import { putUserSchema, PutUserInput } from "../../../schemas/InputValidationSchemas"

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

interface ValidationErrors {
  nameError?: string;
  familynameError?: string;
  emailError?: string;
  phoneError?: string;
  addressError?: string;
  companyError?: string;
  positionError?: string;
  descriptionError?: string;
  isConfirmedError?: string;
  userroleError?: string;
}

interface IsConfirmedMenuItem {
  id: string;
  label: string;
  value: string;
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

  // hanling right names for is confirmed drop-down menu
  const [isConfirmedMenu, setIsConfirmedMenu] = useState<IsConfirmedMenuItem[]>(
    [
      { id: "0", label: "true", value: "true" },
      { id: "1", label: "false", value: "false" },
    ]
  );
  useEffect(() => {
    setIsConfirmedMenu([
      { id: "0", label: textResourses.userYStatusLabel, value: "true" },
      { id: "1", label: textResourses.userNStatusLabel, value: "false" },
    ]);
  }, [textResourses]);

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
      case "name":
        setCurrentUser({ ...currentUser, name: e.target.value, nameError: "" });
        break;
      case "familyname":
        setCurrentUser({
          ...currentUser,
          familyname: e.target.value,
          familynameError: "",
        });
        break;
      case "email":
        setCurrentUser({
          ...currentUser,
          email: e.target.value,
          emailError: "",
        });
        break;
      case "phone":
        setCurrentUser({
          ...currentUser,
          phone: e.target.value,
          phoneError: "",
        });
        break;
      case "address":
        setCurrentUser({
          ...currentUser,
          address: e.target.value,
          addressError: "",
        });
        break;
      case "company":
        setCurrentUser({
          ...currentUser,
          company: e.target.value,
          companyError: "",
        });
        break;
      case "position":
        setCurrentUser({
          ...currentUser,
          position: e.target.value,
          positionError: "",
        });
        break;
      case "description":
        setCurrentUser({
          ...currentUser,
          description: e.target.value,
          descriptionError: "",
        });
        break;
      case "portalrole":
        setCurrentUser({
          ...currentUser,
          userrole_id: e.target.value,
          userroleError: "",
        });
        break;
      case "isconfirmed":
        setCurrentUser({
          ...currentUser,
          isConfirmed: e.target.value === "true" ? true : false,
          isConfirmedError: "",
        });
        break;
    }
  };

  // input calidation
  const validateInputs = async (): Promise<boolean> => {
    let user: PutUserInput = {
      _id: currentUser._id,
      __v: currentUser.__v,
      createdAt: currentUser.createdAt.toString(),
      updatedAt: currentUser.updatedAt.toString(),
      email: currentUser.email,
      name: currentUser.name,
      userrole_id: currentUser.userrole_id,
      isConfirmed: currentUser.isConfirmed as boolean,
    };
    if (currentUser.familyname !== "") {
      user = { ...user, familyname: currentUser.familyname};
    }
    if (currentUser.company !== "") {
      user = { ...user, company: currentUser.company };
    }
    if (currentUser.position !== "") {
      user = { ...user, position: currentUser.position };
    }
    if (currentUser.address !== "") {
      user = { ...user, address: currentUser.address };
    }
    if (currentUser.description !== "") {
      user = { ...user, description: currentUser.description };
    }
    if (currentUser.phone !== "") {
      user = { ...user, phone: currentUser.phone };
    }


    const errors: any[] = await validateResourceAsync(putUserSchema, user)
    if (!errors) {
      return true
    } else {
      //console.log(errors)
      let errorsToShow: ValidationErrors = {}
      errors.forEach((it) => {
        switch(it.path[0]) {
          case "email":
            errorsToShow.emailError = it.message
            break;
          // TODO: add the rest of the cases  
        }
      })
      setCurrentUser({...currentUser, ...errorsToShow})
      return false
    }
  };

  // buttons' click handlers
  const clipboardClickHandler = () => {};
  const editClickHandler = () => {
    setCardState("edit");
  };
  const calcelClickHandler = () => {
    const userData = openStatus.currentUser as UserDocument;
    setCurrentUser({ ...initialUserValue, ...userData });
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
          disabled={true}
          sx={styles.inputField}
          variant="outlined"
          label={textResourses.idDialogBoxlabel}
          name="id"
          value={currentUser._id}
        />
        <TextField
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="name"
          type="text"
          label={textResourses.nameDialogBoxlabel}
          value={currentUser.name}
          onChange={changeHandler}
          helperText={currentUser.nameError}
          FormHelperTextProps={{ error: true }}
          error={currentUser.nameError === "" ? false : true}
          onBlur={validateInputs}
        />
        <TextField
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="familyname"
          type="text"
          label={textResourses.familynameDialogBoxlabel}
          value={currentUser.familyname}
          onChange={changeHandler}
          helperText={currentUser.familynameError}
          FormHelperTextProps={{ error: true }}
          error={currentUser.familynameError === "" ? false : true}
          onBlur={validateInputs}
        />
        <TextField
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="email"
          type="email"
          label={textResourses.emailDialogBoxlabel}
          value={currentUser.email}
          onChange={changeHandler}
          helperText={currentUser.emailError}
          FormHelperTextProps={{ error: true }}
          error={currentUser.emailError === "" ? false : true}
          onBlur={validateInputs}
        />
        <TextField
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="phone"
          type="tel"
          label={textResourses.phoneDialogBoxlabel}
          value={currentUser.phone}
          onChange={changeHandler}
          helperText={currentUser.phoneError}
          FormHelperTextProps={{ error: true }}
          error={currentUser.phoneError === "" ? false : true}
          onBlur={validateInputs}
        />
        <TextField
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="address"
          type="text"
          label={textResourses.addressDialogBoxlabel}
          value={currentUser.address}
          onChange={changeHandler}
          helperText={currentUser.addressError}
          FormHelperTextProps={{ error: true }}
          error={currentUser.addressError === "" ? false : true}
          onBlur={validateInputs}
        />
        <TextField
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="company"
          type="text"
          label={textResourses.companyDialogBoxlabel}
          value={currentUser.company}
          onChange={changeHandler}
          helperText={currentUser.companyError}
          FormHelperTextProps={{ error: true }}
          error={currentUser.companyError === "" ? false : true}
          onBlur={validateInputs}
        />
        <TextField
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="position"
          type="text"
          label={textResourses.positionDialogBoxlabel}
          value={currentUser.position}
          onChange={changeHandler}
          helperText={currentUser.positionError}
          FormHelperTextProps={{ error: true }}
          error={currentUser.positionError === "" ? false : true}
          onBlur={validateInputs}
        />
        <TextField
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="description"
          type="text"
          label={textResourses.descriptionDialogBoxlabel}
          value={currentUser.description}
          onChange={changeHandler}
          helperText={currentUser.descriptionError}
          FormHelperTextProps={{ error: true }}
          error={currentUser.descriptionError === "" ? false : true}
          onBlur={validateInputs}
        />
        <TextField
          select
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="portalrole"
          label={textResourses.userRoleDialogBoxlabel}
          value={currentUser.userrole_id}
          onChange={changeHandler}
          helperText={currentUser.userroleError}
          FormHelperTextProps={{ error: true }}
          error={currentUser.userroleError === "" ? false : true}
        >
          {roles?.map((role) => (
            <MenuItem key={role._id} value={role._id}>
              {role.role}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="isconfirmed"
          label={textResourses.isconfirmedDialogBoxlabel}
          value={currentUser.isConfirmed}
          onChange={changeHandler}
          helperText={currentUser.isConfirmedError}
          FormHelperTextProps={{ error: true }}
          error={currentUser.isConfirmedError === "" ? false : true}
        >
          {isConfirmedMenu?.map((item) => (
            <MenuItem key={item.id} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          sx={styles.inputField}
          disabled={true}
          variant="outlined"
          name="createdat"
          label={textResourses.createdAtDialogBoxlabel}
          value={currentUser.createdAt}
        />

        <TextField
          fullWidth
          disabled={true}
          sx={styles.inputField}
          variant="outlined"
          name="updatedat"
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
            onClick={calcelClickHandler}
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
