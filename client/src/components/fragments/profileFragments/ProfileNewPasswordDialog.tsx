import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  ButtonGroup,
  Button,
  TextField,
} from "@mui/material";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import styles from "../../styles/profileFragmentStyles/profileNewPasswordDialogStyles";
import {
  PasswordCheckInputType,
  PasswordSubmitInputType,
  passwordCheckSchema,
  passwordSubmitSchema,
} from "../../../schemas/InputValidationSchemas";
import { validateResourceAsync } from "../../../utils/validateResource";
import generatePassword from "../../../utils/generatePassword";

interface ProfileNewPasswordDialogTypesProps {
  openStatus: boolean;
  setNewPassword: Function;
  closeDialog: Function;
  isSmallScreen: boolean;
}

interface FormState {
  oldPassword: string;
  oldPasswordError: string;
  password: string;
  passwordError: string;
  confirmPassword: string;
  confirmPasswordError: string;
}

interface ValidationErrors {
  oldPasswordError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
}

const initialFormState: FormState = {
  oldPassword: "",
  oldPasswordError: "",
  password: "",
  passwordError: "",
  confirmPassword: "",
  confirmPasswordError: "",
};

const shortName = (name: string): string => {
  return name.slice(0, 8) + "...";
};

const ProfileNewPasswordDialog: React.FunctionComponent<
  ProfileNewPasswordDialogTypesProps
> = ({ openStatus, setNewPassword, closeDialog, isSmallScreen }) => {
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

  // form state variable
  const [formState, setFormState] = useState<FormState>(initialFormState);

  // inputs validation
  const validateInputs = async (
    callType: "fill" | "submit"
  ): Promise<boolean> => {
    let passwordsInput: PasswordCheckInputType | PasswordSubmitInputType = {
      password: formState.password === "" ? undefined : formState.password,
      confirmPassword:
        formState.confirmPassword === ""
          ? undefined
          : formState.confirmPassword,
      oldPassword:
        formState.oldPassword === "" ? undefined : formState.oldPasswordError,
    };
    // test imputs
    const errors: any[] = await validateResourceAsync(
      callType === "fill" ? passwordCheckSchema : passwordSubmitSchema,
      passwordsInput
    );
    if (!errors) {
      let errorsToShow: ValidationErrors = {
        passwordError: "",
        confirmPasswordError: "",
      };
      setFormState({ ...formState, ...errorsToShow });
      return true;
    } else {
      let errorsToShow: ValidationErrors = {};
      errors.forEach((it) => {
        switch (it.path[0]) {
          case "password":
            if (!errorsToShow.passwordError) {
              errorsToShow.passwordError = it.message;
            }
            break;
          case "confirmPassword":
            if (!errorsToShow.confirmPasswordError) {
              errorsToShow.confirmPasswordError = it.message;
            }
            break;
          case "oldPassword":
            if (!errorsToShow.oldPasswordError) {
              errorsToShow.oldPasswordError = it.message;
            }
            break;
        }
      });
      if (
        passwordsInput.password &&
        passwordsInput.confirmPassword &&
        passwordsInput.oldPassword &&
        !errorsToShow.passwordError &&
        !errorsToShow.confirmPasswordError &&
        !errorsToShow.oldPasswordError &&
        errors.length > 0
      ) {
        errorsToShow = {
          passwordError: errors[0].message,
          confirmPasswordError: errors[0].message,
          oldPasswordError: errors[0].message,
        };
      }
      setFormState({ ...formState, ...errorsToShow });
      return false;
    }
  };

  // input cleaner
  useEffect(() => {
    if (!openStatus) {
      setFormState(initialFormState);
    }
  }, [openStatus]);

  // input change handler
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "password":
        setFormState({
          ...formState,
          password: e.target.value,
          passwordError: "",
        });
        break;
      case "confirmPassword":
        setFormState({
          ...formState,
          confirmPassword: e.target.value,
          confirmPasswordError: "",
        });
        break;
      case "oldPassword":
        setFormState({
          ...formState,
          oldPassword: e.target.value,
          oldPasswordError: "",
        });
    }
  };

  // click handlers
  const cancelClickHandler = () => {
    closeDialog();
  };
  const setPasswordClickHandler = async () => {
    const result = await validateInputs("submit");
    if (result) {
      setNewPassword(formState.password);
    }
  };
  const generatePasswordClickHandler = () => {
    const password = generatePassword();
    setFormState({
      ...formState,
      password: password,
      confirmPassword: password,
      passwordError: "",
      confirmPasswordError: "",
    });
  };
  return (
    <Dialog open={openStatus}>
      <DialogTitle>
        <Typography>{textResourses.newPasswordDialogHeader}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>{textResourses.newPasswordProfileDialogText}</Typography>
        <TextField
          sx={styles.inputField}
          fullWidth
          margin="dense"
          variant="outlined"
          label={textResourses.oldPasswordInputLabel}
          name="oldPassword"
          type="password"
          value={formState.oldPassword}
          onChange={changeHandler}
          helperText={formState.oldPasswordError}
          FormHelperTextProps={{ error: true }}
          error={formState.oldPasswordError === "" ? false : true}
          onBlur={() => validateInputs("fill")}
        />
        <TextField
          sx={styles.inputField}
          fullWidth
          margin="dense"
          variant="outlined"
          label={textResourses.passwordInputLabel}
          name="password"
          type="password"
          value={formState.password}
          onChange={changeHandler}
          helperText={formState.passwordError}
          FormHelperTextProps={{ error: true }}
          error={formState.passwordError === "" ? false : true}
          onBlur={() => validateInputs("fill")}
        />
        <TextField
          sx={styles.inputField}
          fullWidth
          margin="dense"
          variant="outlined"
          label={textResourses.confirmPasswordInputLabel}
          name="confirmPassword"
          type="password"
          value={formState.confirmPassword}
          onChange={changeHandler}
          helperText={formState.confirmPasswordError}
          FormHelperTextProps={{ error: true }}
          error={formState.confirmPasswordError === "" ? false : true}
          onBlur={() => validateInputs("fill")}
        />
      </DialogContent>
      <DialogActions>
        <ButtonGroup sx={styles.buttonGroup} fullWidth>
          <Button
            variant="contained"
            color="success"
            onClick={setPasswordClickHandler}
          >
            {isSmallScreen && textResourses.setNewPasswordDialogBtnLabel
              ? shortName(textResourses.setNewPasswordDialogBtnLabel)
              : textResourses.setNewPasswordDialogBtnLabel}
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={generatePasswordClickHandler}
          >
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

export default ProfileNewPasswordDialog;
