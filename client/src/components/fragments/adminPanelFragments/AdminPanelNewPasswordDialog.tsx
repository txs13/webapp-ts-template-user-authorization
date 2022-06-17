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
import styles from "../../styles/adminPanelStyles/adminPanelNewPasswordDialogStyles";
import {
  PasswordCheckInputType,
  PasswordSubmitInputType,
  passwordCheckSchema,
  passwordSubmitSchema,
} from "../../../schemas/InputValidationSchemas";
import { validateResourceAsync } from "../../../utils/validateResource";

interface AdminPanelNewPasswordDialogTypesProps {
  openStatus: OpenNewPasswordStatus;
  setNewPassword: Function;
  closeDialog: Function;
  isSmallScreen: boolean;
}

interface FormState {
  password: string;
  passwordError: string;
  confirmPassword: string;
  confirmPasswordError: string;
}

interface ValidationErrors {
  passwordError?: string;
  confirmPasswordError?: string;
}

const initialFormState: FormState = {
  password: "",
  passwordError: "",
  confirmPassword: "",
  confirmPasswordError: "",
};

const shortName = (name: string): string => {
  return name.slice(0, 8) + "...";
};

const AdminPanelNewPasswordDialog: React.FunctionComponent<
  AdminPanelNewPasswordDialogTypesProps
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
    };
    // test imputs
    const errors: any[] = await validateResourceAsync(
      callType === "fill" ? passwordCheckSchema : passwordSubmitSchema,
      passwordsInput
    );
    if (!errors) {
      let errorsToShow: ValidationErrors = {
        passwordError: "",
        confirmPasswordError: ""
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
        }
      });
      if ( passwordsInput.password &&
        passwordsInput.confirmPassword &&
        !errorsToShow.passwordError &&
        !errorsToShow.confirmPasswordError &&
        errors.length > 0
      ) {
        errorsToShow = {
          passwordError: errors[0].message,
          confirmPasswordError: errors[0].message,
        };
      }
      setFormState({ ...formState, ...errorsToShow });
      return false;
    }
  };

  // input cleaner
  useEffect(() => {
    setFormState(initialFormState);
  }, [openStatus.user])

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
    }
  };

  // click handlers
  const cancelClickHandler = () => {
    closeDialog();
  };
  const setPasswordClickHandler = async () => {
    const result = await validateInputs("submit")
    if (result) {
      setNewPassword(formState.password);
    }
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

export default AdminPanelNewPasswordDialog;
