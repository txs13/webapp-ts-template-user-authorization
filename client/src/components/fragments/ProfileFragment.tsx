// the important this to keep in mind i sthat the majority of this code was copied
// from AdminPanelUserDetailsDialog component. I was looking for the way to
// refactor the code to avoid simlar code and functions in different files,
// but so far have not found any good way to reorganize / refactor it

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  ButtonGroup,
  Button,
  Typography,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { LocalizedTextResources } from "../../res/textResourcesFunction";
import getTextResources from "../../res/textResourcesFunction";
import { RootState } from "../../app/store";
import { UserDocument } from "../../interfaces/inputInterfaces";
import styles from "../styles/profileFragmentStyles";
import { validateResourceAsync } from "../../utils/validateResource";
import {
  putUserSchema,
  PutUserInput,
} from "../../schemas/InputValidationSchemas";
import {
  AppAlertMessage,
  showMessage,
} from "../../app/features/appAlertMessage.slice";
import ConfirmationDialog from "./reusableComponents/ConfirmationDialog";
import {
  OpenConfimationStatus,
  openConfimationInitialState,
} from "./reusableComponents/ConfirmationDialog";
import { deleteUser, putUserService } from "../../app/services/userServices";
import { logoutService } from "../../app/services/logoutService";
import ProfileNewPasswordDialog from "./profileFragments/ProfileNewPasswordDialog";

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

const shortName = (name: string): string => {
  return name.slice(0, 4) + "...";
};

const ProfileFragment: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // get current user
  const storeUser = useSelector((state: RootState) => state.user.value);
  // get public roles
  const roles = useSelector((state: RootState) => state.role.value);
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

  // user card state variable
  const [cardState, setCardState] = useState<"view" | "edit">("view");

  // this variable is needed in order to open new passsword dialog window
  const [openNewPasswordStatus, setOpenNewPasswordStatus] =
    useState<boolean>(false);
  // this function is used to open new password dialog and should be
  // passed to the user details dialog
  const openNewPasswordDialog = () => {
    setOpenNewPasswordStatus(true);
  };
  // this function is needed to set new password and should be passed to
  // the new password dialog only
  const setNewPassword = (password: string) => {
    setCurrentUser({ ...currentUser, password: password });
    setOpenNewPasswordStatus(false);
  };
  // this function is needed for both cancelling the new password dialog and
  // resetting the dialog state after the new password for is read
  const closeNewPasswordDialog = () => {
    setOpenNewPasswordStatus(false);
  };

  // variable to store user changes
  const [currentUser, setCurrentUser] =
    useState<UserDocumentForm>(initialUserValue);
  useEffect(() => {
    const userData = storeUser.user as UserDocument;
    if (userData) {
      setCurrentUser({ ...initialUserValue, ...userData });
      setCardState("view");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUser]);
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

  // the function to combine current user parameters as either UserDocument
  // or PutUserInput object

  const assembleUserObject = (
    type: "PutUserInput" | "UserDocument"
  ): PutUserInput | UserDocument => {
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
      user = { ...user, familyname: currentUser.familyname };
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
    if (currentUser.password && currentUser.password !== "") {
      user = {...user, password: currentUser.password}
    }
    if (type === "PutUserInput") {
      return user;
    } else {
      let userDocType: UserDocument = {
        ...user,
        createdAt: currentUser.createdAt,
        updatedAt: currentUser.updatedAt,
      };
      return userDocType;
    }
  };

  // input validation
  const validateInputs = async (): Promise<boolean> => {
    let user = assembleUserObject("PutUserInput");

    const errors: any[] = await validateResourceAsync(putUserSchema, user);
    if (!errors) {
      return true;
    } else {
      //console.log(errors)
      let errorsToShow: ValidationErrors = {};
      errors.forEach((it) => {
        switch (it.path[0]) {
          case "email":
            if (!errorsToShow.emailError) {
              errorsToShow.emailError = it.message;
            }
            break;
          case "name":
            if (!errorsToShow.nameError) {
              errorsToShow.nameError = it.message;
            }
            break;
          case "familyname":
            if (!errorsToShow.familynameError) {
              errorsToShow.familynameError = it.message;
            }
            break;
          case "phone":
            if (!errorsToShow.phoneError) {
              errorsToShow.phoneError = it.message;
            }
            break;
          case "address":
            if (!errorsToShow.addressError) {
              errorsToShow.addressError = it.message;
            }
            break;
          case "company":
            if (!errorsToShow.companyError) {
              errorsToShow.companyError = it.message;
            }
            break;
          case "position":
            if (!errorsToShow.positionError) {
              errorsToShow.positionError = it.message;
            }
            break;
          case "description":
            if (!errorsToShow.descriptionError) {
              errorsToShow.descriptionError = it.message;
            }
            break;
          case "portalrole":
            if (!errorsToShow.userroleError) {
              errorsToShow.userroleError = it.message;
            }
            break;
          case "isconfirmed":
            if (!errorsToShow.isConfirmedError) {
              errorsToShow.isConfirmedError = it.message;
            }
        }
      });
      setCurrentUser({ ...currentUser, ...errorsToShow });
      return false;
    }
  };

  // compare function to have the difference between saved and updated user data
  // in order to disable "save" button properly
  const fieldsAreEqual = (
    initialParam: string | Boolean | undefined,
    updatedParam: string | Boolean | undefined
  ): boolean => {
    if (!initialParam && updatedParam === "") {
      return true;
    }
    if (initialParam === updatedParam) {
      return true;
    }
    return false;
  };
  const compareSavedData = (): boolean => {
    const noEdits =
      fieldsAreEqual(storeUser?.user?.name, currentUser?.name) &&
      fieldsAreEqual(storeUser?.user?.familyname, currentUser?.familyname) &&
      fieldsAreEqual(storeUser?.user?.email, currentUser?.email) &&
      fieldsAreEqual(storeUser?.user?.phone, currentUser?.phone) &&
      fieldsAreEqual(storeUser?.user?.company, currentUser?.company) &&
      fieldsAreEqual(storeUser?.user?.position, currentUser?.position) &&
      fieldsAreEqual(storeUser?.user?.address, currentUser?.address) &&
      fieldsAreEqual(storeUser?.user?.description, currentUser?.description) &&
      fieldsAreEqual(storeUser?.user?.userrole_id, currentUser?.userrole_id) &&
      fieldsAreEqual(storeUser?.user?.password, currentUser?.password);
      console.log(storeUser?.user?.password, currentUser?.password);
    return !noEdits;
  };
  const [edits, setEdits] = useState<boolean>(false);
  useMemo(() => {
    const changes = compareSavedData();
    setEdits(changes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // buttons' click handlers
  const clipboardClickHandler = () => {
    let userDetails = "";
    userDetails +=
      `name: ${storeUser?.user?.name}` +
      (storeUser?.user?.familyname
        ? ` ${storeUser?.user?.familyname}\n`
        : `\n`);
    userDetails += `email: ${storeUser?.user?.email}\n`;
    if (storeUser?.user?.phone) {
      userDetails += `phone: ${storeUser?.user?.phone}\n`;
    }
    if (storeUser?.user?.company) {
      userDetails += `company: ${storeUser?.user?.company}\n`;
    }
    if (storeUser?.user?.position) {
      userDetails += `position: ${storeUser?.user?.position}\n`;
    }
    if (storeUser?.user?.address) {
      userDetails += `address: ${storeUser?.user?.address}\n`;
    }
    if (storeUser?.user?.description) {
      userDetails += `description: ${storeUser?.user?.description}`;
    }
    let data = [
      new window.ClipboardItem({
        "text/plain": new Blob([userDetails], { type: "text/plain" }),
      }),
    ];
    navigator.clipboard
      .write(data)
      .then(() => {
        const successMessage: AppAlertMessage = {
          alertType: "success",
          alertMessage: textResourses.userDataIsInClipboardMessage,
        };
        dispatch(showMessage(successMessage));
      })
      .catch((error) => {
        console.log(error);
        const successMessage: AppAlertMessage = {
          alertType: "error",
          alertMessage: textResourses.userDataIsNotInClipboardMessage,
        };
        dispatch(showMessage(successMessage));
      });
  };
  const editClickHandler = () => {
    setCardState("edit");
  };
  const calcelClickHandler = () => {
    const userData = storeUser?.user as UserDocument;
    setCurrentUser({ ...initialUserValue, ...userData });
    setCardState("view");
  };
  const deleteClickHandler = async () => {
    openConfirmationDialog(`${textResourses.deleteUserCardMessage}`, () =>
      deleteUserServiceCall(storeUser?.user?._id as string)
    );
  };
  const saveClickHandler = async () => {
    const inputsAreOk = await validateInputs();
    if (inputsAreOk) {
      const updatedUser = assembleUserObject("UserDocument") as UserDocument;
      openConfirmationDialog(`${textResourses.saveUserUpdatesMessage}`, () =>
        updateUserServiceCall(updatedUser)
      );
    }
  };
  const passwordClickHandler = () => {
    openNewPasswordDialog()
  }

  // this block is needed for the universal model / confimation window
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
  const updateUserServiceCall = async (updatedUser: UserDocument) => {
    const result = await putUserService(updatedUser);
    // to process user updated result
    if (Array.isArray(result)) {
      if (result[0].message === "user is successfully updated") {
        // TODO: to initiate store update
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
        // show confirmation message
        const successMessage: AppAlertMessage = {
          alertType: "success",
          alertMessage: textResourses.userDeleteSuccessMessage,
        };
        dispatch(showMessage(successMessage));

        // delete email from cookies if it is there
        const oldSettings = localStorage.getItem("rememberEmail");
        if (oldSettings) {
          localStorage.removeItem("rememberEmail");
        }
        // call logout service to clean up the store
        await logoutService();
        navigate("/");
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
      <Box sx={styles.userCardFrame}>
        <Typography variant="h5" sx={styles.cardHeader}>
          {textResourses.profileCardHeader}
        </Typography>
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
          required
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
          required
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
          required
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
          fullWidth
          disabled={true}
          name="password"
          type="password"
          label={textResourses.passwordInputLabel}
          sx={{
            ...styles.inputField,
            display: currentUser?.password ? "" : "none",
          }}
          value={currentUser?.password}
        />

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

        <ButtonGroup fullWidth sx={styles.buttonGroup}>
          <Button
            color="info"
            variant="contained"
            onClick={clipboardClickHandler}
          >
            {isSmallScreen && textResourses.clipboardBtnDialogBoxLabel
              ? shortName(textResourses.clipboardBtnDialogBoxLabel)
              : textResourses.clipboardBtnDialogBoxLabel}
          </Button>
          <Button
            color="error"
            variant="contained"
            sx={{ display: cardState === "view" ? "none" : "" }}
            onClick={deleteClickHandler}
          >
            {textResourses.deleteBtnDialogBoxLabel}
          </Button>
          <Button
            color="success"
            variant="contained"
            disabled={!edits}
            sx={{ display: cardState === "view" ? "none" : "" }}
            onClick={saveClickHandler}
          >
            {textResourses.saveBtnDialogBoxLabel}
          </Button>
          <Button
            color="success"
            variant="contained"
            sx={{ display: cardState === "view" ? "" : "none" }}
            onClick={editClickHandler}
          >
            {textResourses.editBtnDialogBoxLabel}
          </Button>
          <Button
            sx={{ display: cardState === "edit" ? "" : "none" }}
            variant="contained"
            onClick={passwordClickHandler}
          >
            {isSmallScreen && textResourses.passwordBtnDialogBoxLabel
              ? shortName(textResourses.passwordBtnDialogBoxLabel)
              : textResourses.passwordBtnDialogBoxLabel}
          </Button>
          <Button
            sx={{ display: cardState === "view" ? "none" : "" }}
            onClick={calcelClickHandler}
          >
            {textResourses.cancelBtnDialogBoxLabel}
          </Button>
        </ButtonGroup>
      </Box>
      <ConfirmationDialog
        openStatus={openConfirmationStatus}
        submitConfirmationDecision={submitConfirmationDecision}
      />
      <ProfileNewPasswordDialog
        openStatus={openNewPasswordStatus}
        closeDialog={closeNewPasswordDialog}
        setNewPassword={setNewPassword}
        isSmallScreen={isSmallScreen}
      />
    </Box>
  );
};

export default ProfileFragment;
