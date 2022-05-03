/* eslint-disable react-hooks/exhaustive-deps */
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
import { validateResourceAsync } from "../../utils/validateResource";
import {
  createUserSchema,
  CreateUserInput,
} from "../../schemas/InputValidationSchemas";
import { UserInput } from "../../interfaces/inputInterfaces";
import { registerUser } from "../../app/services/userServices";

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
  alertType: "info",
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

  // set password recommendations once at the system startup
  useEffect(() => {
    setFormState({
      ...formState,
      alertMessage: textResourses.passwordRecommendationsRegistrationMessage,
    });
  }, [textResourses]);

  // form state change handler
  // TODO: refactor switch section later on
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  // this function makes all the user input validation on this form
  // including during either submission or completion of the field
  // function takes "submit" while submitting the whole form
  // and other input for single field validation as user goes from field to field
  // main difference - during single firld validation single field error is ignored
  // both options rely on the same validation schema
  // function returns overall result, but this is used only for the whole form submission
  const validateUserInput = async (
    mode:
      | "submit"
      | "email"
      | "password"
      | "confirmPassword"
      | "name"
      | "familyname"
  ): Promise<boolean> => {
    // preparation of the object to be taken to the validation schema
    // the reason for exactly this way to create the object is the following
    // MUI text fields give empty string in case there is no input at all
    // and then ZOD validation does not recignize the absence of a particular firld
    // whith this object to be tested includes only filled by user fields
    const userInput: any = {};
    if (!(mode === "submit" && formState.email === "")) {
      userInput.email = formState.email;
    }
    if (!(mode === "submit" && formState.password === "")) {
      userInput.password = formState.password;
    }
    if (!(mode === "submit" && formState.confirmPassword === "")) {
      userInput.confirmPassword = formState.confirmPassword;
    }
    if (!(mode === "submit" && formState.name === "")) {
      userInput.name = formState.name;
    }
    if (!(mode === "submit" && formState.familyname === "")) {
      userInput.familyname = formState.familyname;
    }
    if (!(mode === "submit" && formState.role === "")) {
      userInput.userrole_id = formState.role;
    }
    // user input validation
    const errors: any[] = await validateResourceAsync(
      createUserSchema,
      userInput as CreateUserInput
    );
    // in case there are some errors, we procees with error messages generation
    if (errors) {
      // theis is the whole form submission scenario
      if (mode === "submit") {
        // prepare empty errors object
        const errorMessages: {
          emailError: string;
          passwordError: string;
          confirmPasswordError: string;
          nameError: string;
          familynameError: string;
          roleError: string;
        } = {
          emailError: "",
          passwordError: "",
          confirmPasswordError: "",
          nameError: "",
          familynameError: "",
          roleError: "",
        };
        // add only existing errors to teh errors object
        errors.forEach((error: any) => {
          if (error.path[0] === "email") {
            errorMessages.emailError = error.message;
          }
          if (error.path[0] === "password") {
            errorMessages.passwordError = error.message;
          }
          if (error.path[0] === "confirmPassword") {
            errorMessages.confirmPasswordError = error.message;
          }
          // passwords matching is checked ontop of the whole schema and does not have own path therefore
          // passwords mismatch is supposed to be shown only if password field has more that 6 chars
          if (
            error.path.length === 0 &&
            errors.filter((it) => it.path[0] === "confirmPassword").length === 0
          ) {
            errorMessages.confirmPasswordError = error.message;
          }
          if (error.path[0] === "name") {
            errorMessages.nameError = error.message;
          }
          if (error.path[0] === "familyname") {
            errorMessages.familynameError = error.message;
          }
          if (error.path[0] === "userrole_id") {
            errorMessages.roleError = error.message;
          }
        });
        // update the form and alert banner
        setFormState({
          ...formState,
          ...errorMessages,
          alertType: "error",
          alertMessage: textResourses.notSuccessfulRegisterSubmissionMessage,
        });
      }
      // filter errors just to understand whether there is something regarding enered value
      const filteredErrors = errors.filter((error) => error.path[0] === mode);
      // detect whether there is password mismatch error
      const notMatchingPasswords = errors.filter(
        (error) => error.path.length === 0
      );
      // update related error field
      // this code could be written more elegant, but for the moment I decided to leave it "as is"
      // TODO: refactor switch section if it is possible later on
      if (
        filteredErrors.length !== 0 ||
        (notMatchingPasswords && mode === "confirmPassword")
      ) {
        switch (mode) {
          case "email":
            if (formState.email !== "") {
              setFormState({
                ...formState,
                emailError: filteredErrors[0].message,
              });
            }
            break;
          case "password":
            if (formState.password !== "") {
              setFormState({
                ...formState,
                passwordError: filteredErrors[0].message,
              });
            }
            break;
          case "confirmPassword":
            if (formState.confirmPassword !== "") {
              // if there is confirm password error show it does not matter whether passwords match
              if (filteredErrors.length !== 0) {
                setFormState({
                  ...formState,
                  confirmPasswordError: filteredErrors[0].message,
                });
              } else {
                // in case passwords are entered according to the rule but do not match
                if (notMatchingPasswords.length !== 0) {
                  setFormState({
                    ...formState,
                    confirmPasswordError: notMatchingPasswords[0].message,
                  });
                }
              }
            }
            break;
          case "name":
            if (formState.name !== "") {
              setFormState({
                ...formState,
                nameError: filteredErrors[0].message,
              });
            }
            break;
          case "familyname":
            if (formState.familyname !== "") {
              setFormState({
                ...formState,
                familynameError: filteredErrors[0].message,
              });
            }
            break;
          default:
        }
      }
      // return false because there is (are) validation error(s)
      return false;
    }
    // no errors - try to submit the form
    return true;
  };

  // register button click handler
  const onRegisterClick = async () => {
    // input validation
    const validationResult = await validateUserInput("submit");
    // assemble object for register api if there are no errors
    if (validationResult) {
      const userInput: UserInput = {
        email: formState.email,
        password: formState.password,
        name: formState.name,
        userrole_id: formState.role,
      };
      if (formState.familyname !== "") {
        userInput.familyname = formState.familyname;
      }
      // sending api request
      const registrationResult = await registerUser(userInput);
      // processing either positive result or negative
      if (!registrationResult) {
        setFormState({
          ...formState,
          alertType: "info",
          alertMessage: textResourses.successfulRegistationMessage,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // processing negative response
        setFormState({
          ...formState,
          alertType: "error",
          alertMessage: registrationResult,
        });
      }
    }
  };

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
              sx={{
                ...registerFragmentStyles.alert,
                display: formState.alertMessage === "" ? "none" : "",
              }}
              severity={formState.alertType}
              data-testid="registerAlert"
            >
              {formState.alertMessage}
            </Alert>
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
              required
              autoFocus
              value={formState.email}
              onChange={onInputChange}
              helperText={formState.emailError}
              FormHelperTextProps={{ error: true }}
              error={formState.emailError === "" ? false : true}
              onBlur={() => validateUserInput("email")}
            />
            <TextField
              sx={registerFragmentStyles.passwordInput}
              variant="outlined"
              margin="dense"
              label={textResourses.passwordInputLabel}
              data-testid="passwordInputRegister"
              name="password"
              type="password"
              required
              value={formState.password}
              onChange={onInputChange}
              helperText={formState.passwordError}
              FormHelperTextProps={{ error: true }}
              error={formState.passwordError === "" ? false : true}
              onBlur={() => validateUserInput("password")}
            />
            <TextField
              sx={registerFragmentStyles.confirmPasswordInput}
              variant="outlined"
              margin="dense"
              label={textResourses.confirmPasswordInputLabel}
              data-testid="confirmPasswordInputRegister"
              name="confirmpassword"
              type="password"
              required
              value={formState.confirmPassword}
              onChange={onInputChange}
              helperText={formState.confirmPasswordError}
              FormHelperTextProps={{ error: true }}
              error={formState.confirmPasswordError === "" ? false : true}
              onBlur={() => validateUserInput("confirmPassword")}
            />
            <TextField
              sx={registerFragmentStyles.nameInput}
              variant="outlined"
              margin="dense"
              label={textResourses.nameInputLabel}
              data-testid="nameInput"
              name="name"
              required
              value={formState.name}
              onChange={onInputChange}
              helperText={formState.nameError}
              FormHelperTextProps={{ error: true }}
              error={formState.nameError === "" ? false : true}
              onBlur={() => validateUserInput("name")}
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
              FormHelperTextProps={{ error: true }}
              error={formState.familynameError === "" ? false : true}
              onBlur={() => validateUserInput("familyname")}
            />
            <TextField
              select
              sx={registerFragmentStyles.roleInput}
              variant="outlined"
              margin="dense"
              label={textResourses.roleInputLabel}
              data-testid="roleInput"
              name="role"
              required
              value={formState.role}
              onChange={onInputChange}
              helperText={formState.roleError}
              FormHelperTextProps={{ error: true }}
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
                onClick={() => onRegisterClick()}
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
