import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Alert,
  TextField,
  Button,
  ButtonGroup,
  MenuItem,
} from "@mui/material";
import CoPresentTwoToneIcon from "@mui/icons-material/CoPresentTwoTone";

import { RootState } from "../../app/store";
import registerFragmentStyles from "../styles/registerFragmentStyles";
import getTextResources from "../../res/textResourcesFunction";
import { LocalizedTextResources } from "../../res/textResourcesFunction";

const initialFormState: {
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
  confirmPassword: string;
  confirmPasswordError: string;
  name: string;
  nameError: string;
  familyname: string;
  familynameError: string;
  role: string;
  roleError: string;
  alertMessage: string;
  alertType: "error" | "info";
} = {
  email: "",
  emailError: "",
  password: "",
  passwordError: "",
  confirmPassword: "",
  confirmPasswordError: "",
  name: "",
  nameError: "",
  familyname: "",
  familynameError: "",
  role: "",
  roleError: "",
  alertMessage: "",
  alertType: "info"
};

const RegisterFragment: React.FunctionComponent = () => {
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
  // app navigation: getting navigate function
  const navigate = useNavigate();

  // get user roles
  const appRoles = useSelector((state: RootState) => state.role.value);

  // form state variables definition
  const [formState, setFormState] = useState(initialFormState);

  // form state change handler
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (e.target.name) {
      case "email":
        setFormState({
          ...formState,
          email: e.target.value,
          emailError: "",
          alertMessage: "",
        });
        break;
      case "password":
        setFormState({
          ...formState,
          password: e.target.value,
          passwordError: "",
          alertMessage: "",
        });
        break;
      case "confirmpassword":
        setFormState({
          ...formState,
          confirmPassword: e.target.value,
          confirmPasswordError: "",
          alertMessage: "",
        });
        break;
      case "name":
        setFormState({
          ...formState,
          name: e.target.value,
          nameError: "",
          alertMessage: "",
        });
        break;
      case "familyname":
        setFormState({
          ...formState,
          familyname: e.target.value,
          familynameError: "",
          alertMessage: "",
        });
        break;
      case "role":
        setFormState({
          ...formState,
          role: e.target.value,
          roleError: "",
          alertMessage: "",
        });
        break;
      default:
        // TODO navigate to error page
        throw new Error("wrong input element(s) name prperty");
    }
  };

  const validateUserInput = async (mode: "input" | "submit") => {
    
  }

  return (
    <>
      <Box sx={registerFragmentStyles.fragmentFrame}>
        <Box sx={registerFragmentStyles.loginBoxFrame}>
          <Box sx={registerFragmentStyles.logoSection}>
            <Box sx={registerFragmentStyles.logoSectionPictureBox}>
              <CoPresentTwoToneIcon
                fontSize="large"
                data-testid="applogo"
                sx={registerFragmentStyles.logoPicture}
              />
            </Box>
            <Typography
              sx={registerFragmentStyles.logoSectionText}
              data-testid="appName"
            >
              {textResourses.appName}
            </Typography>
          </Box>

          <Box sx={registerFragmentStyles.alertSection}>
            <Alert
              sx={registerFragmentStyles.alert}
              data-testid="registerAlert"
            ></Alert>
          </Box>

          <Box sx={registerFragmentStyles.userInputSection}>
            <TextField
              sx={registerFragmentStyles.emailInput}
              variant="outlined"
              margin="dense"
              label={textResourses.emailInputLabel}
              data-testid="emailInputRegister"
              name="email"
              type="email"
              autoFocus
              value={formState.email}
              onChange={onInputChange}
              helperText={formState.emailError}
              FormHelperTextProps={{error:true}}
              error={formState.emailError === "" ? false : true}
            />
            <TextField
              sx={registerFragmentStyles.passwordInput}
              variant="outlined"
              margin="dense"
              label={textResourses.passwordInputLabel}
              data-testid="passwordInputRegister"
              name="password"
              type="password"
              value={formState.password}
              onChange={onInputChange}
              helperText={formState.passwordError}
              FormHelperTextProps={{error:true}}
              error={formState.passwordError === "" ? false : true}
            />
            <TextField
              sx={registerFragmentStyles.confirmPasswordInput}
              variant="outlined"
              margin="dense"
              label={textResourses.confirmPasswordInputLabel}
              data-testid="confirmPasswordInputRegister"
              name="confirmpassword"
              type="password"
              value={formState.confirmPassword}
              onChange={onInputChange}
              helperText={formState.confirmPasswordError}
              FormHelperTextProps={{error:true}}
              error={formState.confirmPasswordError === "" ? false : true}
            />
            <TextField
              sx={registerFragmentStyles.nameInput}
              variant="outlined"
              margin="dense"
              label={textResourses.nameInputLabel}
              data-testid="nameInput"
              name="name"
              value={formState.name}
              onChange={onInputChange}
              helperText={formState.nameError}
              FormHelperTextProps={{error:true}}
              error={formState.nameError === "" ? false : true}
            />
            <TextField
              sx={registerFragmentStyles.familynameInput}
              variant="outlined"
              margin="dense"
              label={textResourses.familynameInputLabel}
              data-testid="familynameInput"
              name="familyname"
              value={formState.familyname}
              onChange={onInputChange}
              helperText={formState.familynameError}
              FormHelperTextProps={{error:true}}
              error={formState.familynameError === "" ? false : true}
            />
            <TextField
              select
              sx={registerFragmentStyles.roleInput}
              variant="outlined"
              margin="dense"
              label={textResourses.roleInputLabel}
              data-testid="roleInput"
              name="role"
              value={formState.role}
              onChange={onInputChange}
              helperText={formState.roleError}
              FormHelperTextProps={{error:true}}
              error={formState.roleError === "" ? false : true}
            >
              {appRoles?.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  {role.role}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={registerFragmentStyles.buttonsSection}>
            <ButtonGroup sx={registerFragmentStyles.buttonGroup} variant="text">
              <Button
                sx={registerFragmentStyles.backToLoginButton}
                fullWidth
                data-testid="backToLoginBtn"
                onClick={() => navigate("/login")}
              >
                {textResourses.backToLoginBtnLabel}
              </Button>
              <Button
                sx={registerFragmentStyles.registerButton}
                fullWidth
                data-testid="registerBtn"
              >
                {textResourses.registerBtnLabel}
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RegisterFragment;
