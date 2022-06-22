// before making any changes, ALWAYS check that exact property is used only once!!!!!

import { TextResources } from "./textResourcesFunction";

export const textResourcesMultilang: TextResources = {
  // general purposes text resourses
  appName: {
    EN: "Webapp template",
    DE: "Webapp Vorlage",
    UA: "Webapp шаблон",
    RU: "Webapp шаблон",
  },
  // navbar text resorses
  aboutAppLink: {
    EN: "About app",
    DE: "Über app",
    UA: "Про aплiкaцiю",
    RU: "Про приложение",
  },
  loginMenuItemText: {
    EN: "log in",
  },
  logoutMenuItemText: {
    EN: "log out",
  },
  registerMenuItemText: {
    EN: "register",
  },
  profileMenuItemText: {
    EN: "profile",
  },
  startingAppMenuItemText: {
    EN: "starting page",
  },
  startingAdminMenuItemText: {
    EN: "admin panel",
  },
  // login fragment text resources
  emailInputLabel: {
    EN: "email",
  },
  passwordInputLabel: {
    EN: "password",
  },
  rememberEmailChkBoxLabel: {
    EN: "remember my email",
  },
  loginBtnLabel: {
    EN: "log in",
  },
  toRegisterBtnLabel: {
    EN: "register",
  },
  // login form alert messages
  successfulLoginSubmissionMessage: {
    EN: "please wait, user credentials were successfully submitted...",
  },
  wrongLoginCredentialsMessage: {
    EN: "please enter your credentials",
  },
  wrongUserNamePasswordMessage: {
    EN: "Email or password are not correct",
  },
  wrongStoredTokenMessage: {
    EN: "Wrong stored token, please log in",
  },
  accountIsNotConfirmedMessage: {
    EN: "Your accout is not confirmed yet",
  },
  wrongNetworkSettingsMessage: {
    EN: "Wrong network settings. Please contact admin",
  },
  unknownErrorMessage: {
    EN: "Unknown error. Please contact admin",
  },
  // login input validation messages
  minOneCharEmailMessage: {
    EN: "please enter your email",
  },
  minOneCharPasswordMessage: {
    EN: "please enter your password",
  },
  // register fragment text resources
  backToLoginBtnLabel: {
    EN: "to login",
  },
  registerBtnLabel: {
    EN: "register",
  },
  confirmPasswordInputLabel: {
    EN: "confirm password",
  },
  nameInputLabel: {
    EN: "name",
  },
  familynameInputLabel: {
    EN: "family name",
  },
  roleInputLabel: {
    EN: "role",
  },
  // user validation messages
  emailIsRequiredMessage: {
    EN: "please enter your email",
  },
  emailNotValidMessage: {
    EN: "entered email is not valid",
  },
  passwordIsRequiredMessage: {
    EN: "please enter password",
  },
  passwordMin6CharsMessage: {
    EN: "plassword should be at least 6 chars",
  },
  nameIsRequiredMessage: {
    EN: "please enter your name",
  },
  nameMin2CharsMessage: {
    EN: "entered name should be at least 2 chars",
  },
  nameWrongFormatMessage: {
    EN: "name contains wrong symbol(s)",
  },
  familynameMin2CharsMessage: {
    EN: "entered familyname should be at least 2 chars",
  },
  familynameWrongFormatMessage: {
    EN: "familyname contains wrong symbol(s)",
  },
  phoneMin6CharsMessage: {
    EN: "entered phone number should be at least 6 chars",
  },
  phoneWrongFormatMessage: {
    EN: "phone number contains wrong symbol(s)",
  },
  addressMin6CharsMessage: {
    EN: "entered address should be at least 6 chars",
  },
  addressWrongFormatMessage: {
    EN: "address contains wrong symbol(s)",
  },
  companyMin2CharsMessage: {
    EN: "entered company name should be at least 6 chars",
  },
  companyWrongFormatMessage: {
    EN: "company name contains wrong symbol(s)",
  },
  positionMin2CharsMessage: {
    EN: "entered position should be at least 6 chars",
  },
  positionWrongFormatMessage: {
    EN: "position contains wrong symbol(s)",
  },
  descriptionMin6CharsMessage: {
    EN: "entered description should be at least 6 chars",
  },
  descriptionWrongFormatMessage: {
    EN: "description contains wrong symbol(s)",
  },
  roleIsRequiredMessage: {
    EN: "please enter your role",
  },
  roleIsWrongMessage: {
    EN: "selected role is wrong. please contact admin",
  },
  passwordsDoNotMatchMessage: {
    EN: "entered passwords do not match",
  },
  userIdIsRequiredMessage: {
    EN: "user id is required",
  },
  userIdIsNotValidMessage: {
    EN: "user id is not valid",
  },
  isConfirmedIsRequiredMessage: {
    EN: "missing user confirmation",
  },
  oldAndNewPasswordsMatchMessage: {
    EN: "new password cannot be the same as new one",
  },
  // register form alert messages
  successfulRegisterSubmissionMessage: {
    EN: "please wait, user credentials were successfully submitted...",
  },
  userExistsRegisterMessage: {
    EN: "user with this email is already registered",
  },
  notSuccessfulRegisterSubmissionMessage: {
    EN: "please enter all the requested data",
  },
  wrongUserDataRegisterMessage: {
    EN: "submitted data is not correct - please contact admin",
  },
  successfulRegistationMessage: {
    EN: "You are successfully registered and will be forwarded to login soon",
  },
  passwordRecommendationsRegistrationMessage: {
    EN: "please consider password not less than 6 chars including numbers, letters upper and lower case, special symbols",
  },
  // admin panel navigation labels
  startingPageNavLabel: {
    EN: "admin main",
  },
  userListNavLabel: {
    EN: "users",
  },
  roleListNavLabel: {
    EN: "roles",
  },
  // admin panel user list search panel
  searchFieldLabel: {
    EN: "search by",
  },
  searchWhatlabel: {
    EN: "search what",
  },
  toBeConfirmedSwitchLabel: {
    EN: "only not confirmed",
  },
  // admin panel user list labels
  userNameLabel: {
    EN: "name",
  },
  userEmailLabel: {
    EN: "email",
  },
  userCompanyLabel: {
    EN: "company",
  },
  userPortalRoleLabel: {
    EN: "portal role",
  },
  userYStatusLabel: {
    EN: "is confirmed",
  },
  userNStatusLabel: {
    EN: "is NOT confirmed",
  },
  confirmBtnLabel: {
    EN: "confirm",
  },
  editBtnLabel: {
    EN: "edit",
  },
  deleteBtnLabel: {
    EN: "delete",
  },
  confirmUserCardMessage: {
    EN: "You are going to grant access to the web-portal for the user",
  },
  saveUserUpdatesMessage: {
    EN: "Please cinfirm you would like to save these changes",
  },
  deleteUserCardMessage: {
    EN: "You are going to delete the user",
  },
  userConfirmSuccessMessage: {
    EN: "User was confirmed successfully",
  },
  userConfirmFailureMessage: {
    EN: "User was NOT confirmed",
  },
  userUpdateSuccessMessage: {
    EN: "User data was updated successfully",
  },
  userUpdateFailureMessage: {
    EN: "User data was NOT updated",
  },
  userDeleteSuccessMessage: {
    EN: "User was successfully deleted",
  },
  userDeleteFailureMessage: {
    EN: "User was NOT deleted",
  },
  userDataIsInClipboardMessage: {
    EN: "User data successfully copied to the clipboard",
  },
  userDataIsNotInClipboardMessage: {
    EN: "User data was NOT copied to the clipboard",
  },
  // admin panel user details dialog window labels
  headerDialogBoxLabel: {
    EN: "user details",
  },
  idDialogBoxlabel: {
    EN: "id",
  },
  nameDialogBoxlabel: {
    EN: "name",
  },
  familynameDialogBoxlabel: {
    EN: "familyname",
  },
  emailDialogBoxlabel: {
    EN: "email",
  },
  phoneDialogBoxlabel: {
    EN: "phone",
  },
  addressDialogBoxlabel: {
    EN: "address",
  },
  companyDialogBoxlabel: {
    EN: "company",
  },
  positionDialogBoxlabel: {
    EN: "position",
  },
  descriptionDialogBoxlabel: {
    EN: "description",
  },
  userRoleDialogBoxlabel: {
    EN: "portal role",
  },
  isconfirmedDialogBoxlabel: {
    EN: "is confirmed",
  },
  createdAtDialogBoxlabel: {
    EN: "created at",
  },
  updatedAtDialogBoxlabel: {
    EN: "updated at",
  },
  clipboardBtnDialogBoxLabel: {
    EN: "clipboard",
  },
  editBtnDialogBoxLabel: {
    EN: "edit",
  },
  cancelBtnDialogBoxLabel: {
    EN: "cancel",
  },
  deleteBtnDialogBoxLabel: {
    EN: "delete",
  },
  saveBtnDialogBoxLabel: {
    EN: "save",
  },
  closeBtnDialogBoxLabel: {
    EN: "close",
  },
  passwordBtnDialogBoxLabel: {
    EN: "password",
  },
  // confirmation dialog box labels
  headerConfimationDialogLabel: {
    EN: "please confirm",
  },
  btnYesConfimationDialogLabel: {
    EN: "confirm",
  },
  btnNoConfimationDialogLabel: {
    EN: "cancel",
  },
  // user profile settings
  profileCardHeader: {
    EN: "profile settings",
  },
  // admin panel roles list labels
  roleNameCardlabel: {
    EN: "role name",
  },
  roleDescriptionCardlabel: {
    EN: "description",
  },
  usersListCardlabel: {
    EN: "users",
  },
  usersNumberWithRolelabel: {
    EN: "role users",
  },
  roleIsPubliclabel: {
    EN: "is public",
  },
  roleIsNotPubliclabel: {
    EN: "is NOT public",
  },
  addRoleBtnLabel: {
    EN: "add role",
  },
  refreshRolesBtnLabel: {
    EN: "refresh",
  },
  onlyPublicSwitchLabel: {
    EN: "public only",
  },
  // role details dialog labels
  roleEditDetailsDialogHeader: {
    EN: "role details",
  },
  roleCreateDetailsDialogHeader: {
    EN: "create new role",
  },
  roleIdInputLabel: {
    EN: "role id",
  },
  roleNameInputLabel: {
    EN: "role name",
  },
  roleDescriptionLabel: {
    EN: "description",
  },
  createdAtInputLabel: {
    EN: "created",
  },
  updatedAtInputLabel: {
    EN: "updated",
  },
  roleDetailsCloseBtnLabel: {
    EN: "close",
  },
  roleDetailsSaveBtnLabel: {
    EN: "save",
  },
  roleDetailsDeleteBtnLabel: {
    EN: "delete",
  },
  roleDetailsEditBtnLabel: {
    EN: "edit",
  },
  roleDetailsCancelBtnLabel: {
    EN: "cancel",
  },
  roleDetailsCreateBtnLabel: {
    EN: "create",
  },
  roleDetailsShowUsersLabel: {
    EN: "users",
  },
  roleDetailsUsersWithRoleHeader: {
    EN: "users with this role",
  },
  // role validation messages
  roleNameIsRequiredMessage: {
    EN: "role name is required",
  },
  roleNameMin4CharsMessage: {
    EN: "role name should be at least 4 chars",
  },
  roleNameWrongFormatMessage: {
    EN: "role name contains wrong symbols",
  },
  roleDescMin6CharsMessage: {
    EN: "role description should be at least 6 chars",
  },
  roleDescWrongFormatMessage: {
    EN: "role description contains wrong symbols",
  },
  // role api messages
  successCreateRoleMessage: {
    EN: "new role is successfully created",
  },
  errorCreateRoleMessage: {
    EN: "something went wrong, new role was NOT created",
  },
  roleUpdateSuccessMessage: {
    EN: "Role data was updated successfully",
  },
  roleUpdateFailureMessage: {
    EN: "Role data was NOT updated",
  },
  roleDeleteSuccessMessage: {
    EN: "Role was successfully deleted",
  },
  roleDeleteFailureMessage: {
    EN: "Role was NOT deleted",
  },
  // role related confirmation messages
  saveRoleUpdatesMessage: {
    EN: "Please cinfirm you would like to save these changes",
  },
  deleteRoleCardMessage: {
    EN: "You are going to delete the role",
  },
  // new password dialog labels
  newPasswordDialogHeader: {
    EN: "set new password",
  },
  newPasswordDialogText: {
    EN: "please enter new password for the user",
  },
  newPasswordProfileDialogText: {
    EN: "please enter your new password",
  },
  oldPasswordInputLabel: {
    EN: "old password",
  },
  cancelNewPasswordDialogBtnLabel: {
    EN: "cancel",
  },
  setNewPasswordDialogBtnLabel: {
    EN: "set password",
  },
  generateNewPasswordDialogBtnLabel: {
    EN: "generate",
  },
  passwordCheckFailureMessage: {
    EN: "password check has failed - please contact administrator",
  },
  wrongPasswordValidationMessage: {
    EN: "wrong password",
  },
};
