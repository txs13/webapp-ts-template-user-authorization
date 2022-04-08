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
} from "@mui/material";
import CoPresentTwoToneIcon from "@mui/icons-material/CoPresentTwoTone";

import { RootState } from "../../app/store";
import registerFragmentStyles from "../styles/registerFragmentStyles";
import getTextResources from "../../res/textResourcesFunction";
import { LocalizedTextResources } from "../../res/textResourcesFunction";

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
            />
            <TextField
              sx={registerFragmentStyles.passwordInput}
              variant="outlined"
              margin="dense"
              label={textResourses.passwordInputLabel}
              data-testid="passwordInputRegister"
            />
            <TextField
              sx={registerFragmentStyles.confirmPasswordInput}
              variant="outlined"
              margin="dense"
              label={textResourses.confirmPasswordInputLabel}
              data-testid="confirmPasswordInputRegister"
            />
            <TextField
              sx={registerFragmentStyles.nameInput}
              variant="outlined"
              margin="dense"
              label={textResourses.nameInputLabel}
              data-testid="nameInput"
            />
            <TextField
              sx={registerFragmentStyles.familynameInput}
              variant="outlined"
              margin="dense"
              label={textResourses.familynameInputLabel}
              data-testid="familynameInput"
            />
            <TextField
              sx={registerFragmentStyles.roleInput}
              variant="outlined"
              margin="dense"
              label={textResourses.roleInputLabel}
              data-testid="roleInput"
            />
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
