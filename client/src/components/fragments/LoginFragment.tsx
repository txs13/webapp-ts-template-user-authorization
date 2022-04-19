import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, generatePath } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  ButtonGroup,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import CoPresentTwoToneIcon from "@mui/icons-material/CoPresentTwoTone";

import { RootState } from "../../app/store";
import loginFragmentStyles from "../styles/loginFragmentStyles";
import getTextResources from "../../res/textResourcesFunction";
import { LocalizedTextResources } from "../../res/textResourcesFunction";
import { LoginInput } from "../../interfaces/inputInterfaces";
import { loginDataSchema } from "../../schemas/InputValidationSchemas";
import { validateResourceAsync } from "../../utils/validateResource";
import { loginService } from "../../app/services/loginServices";
import { backToInitialState } from "../../app/features/user.slice";
import emailToPath from "../../utils/emailToPath";

const initialFormState: {
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
  alertMessage: string;
  alertType: "error" | "info";
  rememberMe: boolean;
} = {
  email: "",
  emailError: "",
  password: "",
  passwordError: "",
  alertMessage: "",
  alertType: "info",
  rememberMe: true,
};

const LoginFragment: React.FunctionComponent = () => {
  // set email and password input references
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // get dispatch function and user store
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.value);

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

  // form state variables definition
  const [formState, setFormState] = useState(initialFormState);

  // startup check to set remember me and right focus item
  useEffect(() => {
    const rememberEmail = localStorage.getItem("rememberEmail");
    if (rememberEmail) {
      setFormState({
        ...formState,
        email: rememberEmail,
      });
      passwordInputRef.current?.focus()
    } else {
      emailInputRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form state change handler
  const onInputChange: React.FormEventHandler = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    switch (e.currentTarget.name) {
      case "email":
        setFormState({
          ...formState,
          email: e.currentTarget.value,
          emailError: "",
          alertMessage: "",
        });
        break;
      case "password":
        setFormState({
          ...formState,
          password: e.currentTarget.value,
          passwordError: "",
          alertMessage: "",
        });
        break;
      case "rememberme":
        setFormState({
          ...formState,
          rememberMe: !formState.rememberMe,
          alertMessage: "",
        });
        break;
      default:
        // TODO navigate to error page
        throw new Error("wrong input element(s) name prperty");
    }
  };

  // login click handler
  const onLoginClick = async () => {
    const loginInput: LoginInput = {
      email: formState.email,
      password: formState.password,
    };
    // validate form input fields
    const errors: any[] = await validateResourceAsync(
      loginDataSchema,
      loginInput
    );
    if (errors) {
      // set error messages
      const errorMessages: {
        emailError: string;
        passwordError: string;
      } = {
        emailError: "",
        passwordError: "",
      };
      errors.forEach((error: any) => {
        if (error.path[1] === "email") {
          errorMessages.emailError = error.message;
        }
        if (error.path[1] === "password") {
          errorMessages.passwordError = error.message;
        }
      });
      setFormState({
        ...formState,
        ...errorMessages,
        alertType: "error",
        alertMessage: textResourses.wrongLoginCredentialsMessage,
      });
    } else {
      // clear error messages
      setFormState({
        ...formState,
        emailError: "",
        passwordError: "",
        alertType: "info",
        alertMessage: textResourses.successfulLoginSubmissionMessage,
      });
      // call login procedure
      await loginService(loginInput);
    }
  };

  // processing login call result
  // using useMemo here causes simaltneous rerendering of BrowserRouter and LoginFragment
  // current solution is to link this processing to rerendreing rather that pure var change
  useEffect(() => {
    if (user.loginError) {
      setFormState({
        ...formState,
        alertType: "error",
        alertMessage: user.loginError.errorMessage,
      });
      setTimeout(() => {
        dispatch(backToInitialState());
        setFormState({
          ...formState,
          alertType: "info",
          alertMessage: "",
        });
      }, 5000);
    }
    if (user.user) {
      // save "remember me" settings if selected
      if (formState.rememberMe) {
        localStorage.setItem("rememberEmail", user.user.email);
      } else {
        const oldSettings = localStorage.getItem("rememberEmail");
        if (oldSettings) {
          localStorage.removeItem("rememberEmail");
        }
      }
      // save refresh token to the local storage
      localStorage.setItem("refreshToken", user.tokens?.refreshToken as string);
      // navigate to the app starting page
      navigate(generatePath("/:id", { id: emailToPath(user.user) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // enter key detection and processing
  const onDownEnter:React.FormEventHandler = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      onLoginClick()
    } 
  }

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
              sx={{
                ...loginFragmentStyles.alert,
                display: formState.alertMessage === "" ? "none" : "",
              }}
              severity={formState.alertType}
              data-testid="loginAlert"
            >
              {formState.alertMessage}
            </Alert>
          </Box>

          <Box sx={loginFragmentStyles.userInputSection}>
            <TextField
              sx={loginFragmentStyles.emailInput}
              variant="outlined"
              margin="dense"
              label={textResourses.emailInputLabel}
              data-testid="emailInput"
              name="email"
              type="email"
              inputRef={emailInputRef}
              value={formState.email}
              onChange={onInputChange}
              helperText={formState.emailError}
              FormHelperTextProps={{ error: true }}
              error={formState.emailError === "" ? false : true}
              onKeyDown={onDownEnter}
            />
            <TextField
              sx={loginFragmentStyles.passwordInput}
              variant="outlined"
              margin="dense"
              label={textResourses.passwordInputLabel}
              data-testid="passwordInput"
              name="password"
              type="password"
              inputRef={passwordInputRef}
              value={formState.password}
              onChange={onInputChange}
              helperText={formState.passwordError}
              FormHelperTextProps={{ error: true }}
              error={formState.passwordError === "" ? false : true}
              onKeyDown={onDownEnter}
            />
            <FormControlLabel
              sx={loginFragmentStyles.rememberUserEmailChkBox}
              label={textResourses.rememberEmailChkBoxLabel}
              data-testid="rememberEmailChckBox"
              control={
                <Checkbox
                  defaultChecked
                  value={formState.rememberMe}
                  onChange={onInputChange}
                  name="rememberme"
                />
              }
            />
          </Box>

          <Box sx={loginFragmentStyles.buttonsSection}>
            <ButtonGroup sx={loginFragmentStyles.buttonGroup} variant="text">
              <Button
                sx={loginFragmentStyles.loginButton}
                fullWidth
                data-testid="loginBtn"
                disabled={formState.alertMessage ? true : false}
                onClick={onLoginClick}
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
