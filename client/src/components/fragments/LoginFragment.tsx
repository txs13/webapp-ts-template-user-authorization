import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  ButtonGroup,
  Button,
  FormControlLabel,
  Checkbox,
  Alert
} from "@mui/material";
import CoPresentTwoToneIcon from "@mui/icons-material/CoPresentTwoTone";

import { RootState } from "../../app/store";
import loginFragmentStyles from "../styles/loginFragmentStyles";
import getTextResources from "../../res/textResourcesFunction";
import { LocalizedTextResources } from "../../res/textResourcesFunction";

const LoginFragment: React.FunctionComponent = () => {
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
  const navigate = useNavigate()

  return (
    <>
      <Box sx={loginFragmentStyles.fragmentFrame}>
        <Box sx={loginFragmentStyles.loginBoxFrame}>
          <Box sx={loginFragmentStyles.logoSection}>
            <Box sx={loginFragmentStyles.logoSectionPictureBox}>
              <CoPresentTwoToneIcon
                fontSize="large"
                data-testid="applogo"
                sx={loginFragmentStyles.logoPicture}
              />
            </Box>
            <Typography
              sx={loginFragmentStyles.logoSectionText}
              data-testid="appName"
            >
              {textResourses.appName}
            </Typography>
          </Box>

          <Box sx={loginFragmentStyles.alertSection}>
            <Alert
              sx={loginFragmentStyles.alert}
              data-testid="loginAlert"
            ></Alert>
          </Box>

          <Box sx={loginFragmentStyles.userInputSection}>
            <TextField
              sx={loginFragmentStyles.emailInput}
              variant="outlined"
              margin="dense"
              label={textResourses.emailInputLabel}
              data-testid="emailInput"
            />
            <TextField
              sx={loginFragmentStyles.passwordInput}
              variant="outlined"
              margin="dense"
              label={textResourses.passwordInputLabel}
              data-testid="passwordInput"
            />
            <FormControlLabel
              sx={loginFragmentStyles.rememberUserEmailChkBox}
              label={textResourses.rememberEmailChkBoxLabel}
              data-testid="rememberEmailChckBox"
              control={<Checkbox />}
            />
          </Box>

          <Box sx={loginFragmentStyles.buttonsSection}>
            <ButtonGroup sx={loginFragmentStyles.buttonGroup} variant="text">
              <Button
                sx={loginFragmentStyles.loginButton}
                fullWidth
                data-testid="loginBtn"
              >
                {textResourses.loginBtnLabel}
              </Button>
              <Button
                sx={loginFragmentStyles.registerButton}
                fullWidth
                data-testid="registerBtn"
                onClick={() => navigate("/register")}
              >
                {textResourses.toRegisterBtnLabel}
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginFragment;
