import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  DialogActions,
  ButtonGroup,
  Button,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import {
  RoleDocument,
  UserDocument,
  RoleInput,
} from "../../../interfaces/inputInterfaces";
import { OpenRoleDetailsStatus } from "./AdminPanelRoleListFragment";
import styles from "../../styles/adminPanelStyles/adminPanelRoleDetailsDialogStyles";
import {
  RoleInputSchemaType,
  roleSchema,
} from "../../../schemas/InputValidationSchemas";
import { validateResourceAsync } from "../../../utils/validateResource";
import {
  createRoleService,
  deleteRoleService,
  putRoleService,
} from "../../../app/services/roleServices";

interface AdminPanelRoleDetailDialogPropsTypes {
  openStatus: OpenRoleDetailsStatus;
  roles: RoleDocument[] | undefined;
  users: UserDocument[] | undefined;
  closeRoleDetails: Function;
  openConfirmationDialog: Function;
}

interface RoleDocumentForm extends RoleDocument {
  roleError: string;
  descriptionError: string;
}

interface ValidationErrors {
  roleError?: string;
  descriptionError?: string;
}

const initialRoleValue: RoleDocumentForm = {
  _id: "",
  role: "",
  description: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  roleError: "",
  descriptionError: "",
  __v: 0,
};

const AdminPanelRoleDetailsDialog: React.FunctionComponent<
  AdminPanelRoleDetailDialogPropsTypes
> = ({
  openStatus,
  roles,
  users,
  closeRoleDetails,
  openConfirmationDialog,
}) => {
  // get data from app settings store and get text resources in proper language
  const appSettings = useSelector(
    (state: RootState) => state.appSettings.value
  );
  const [textResources, setTextResources] = useState<LocalizedTextResources>(
    {}
  );
  useEffect(() => {
    setTextResources(getTextResources(appSettings.language));
  }, [appSettings]);

  // user card state variable
  const [cardState, setCardState] = useState<"view" | "edit">("view");
  // users number calculation / update
  const [usersNum, setUsersNum] = useState(0);
  useEffect(() => {
    if (users && openStatus.currentRole) {
      const usersNumber = users.filter(
        (it) => it.userrole_id === openStatus.currentRole?._id
      ).length;
      setUsersNum(usersNumber);
    }
  }, [users, openStatus]);

  // variable to store user input / role data changes
  const [currentRole, setCurrentRole] =
    useState<RoleDocumentForm>(initialRoleValue);
  useEffect(() => {
    if (openStatus.currentRole) {
      // to set initial form value based on received role data
      setCurrentRole({ ...initialRoleValue, ...openStatus.currentRole });
      setCardState("view");
    } else {
      // to set "empty" form state as a starting point to crete new role
      setCurrentRole({ ...initialRoleValue });
      setCardState("edit");
    }
  }, [openStatus.currentRole]);
  // this function clears the form input after dialog window is closed
  // the reason to do so is because setup function above would not work for the case when
  // user creates several roles in a row
  const clearForm = () => {
    setCurrentRole(initialRoleValue)
  }

  // variable to store edits / changes status
  const [edits, setEdits] = useState(false);
  useEffect(() => {
    if (
      (currentRole.role === openStatus.currentRole?.role) &&
      ((currentRole.description === openStatus.currentRole?.description ||
        (!openStatus.currentRole?.description &&
          currentRole.description === "")))
    ) {
      setEdits(false);
    } else {
      setEdits(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole]);

  // input validation
  const validateInputs = async (
    callType: "fill" | "submit"
  ): Promise<boolean> => {
    // assembling create role object
    let roleInput: RoleInputSchemaType = {
      role: currentRole.role,
    };
    if (currentRole.description) {
      roleInput.description = currentRole.description;
    }
    // passing scheme validation
    const errors: any[] = await validateResourceAsync(roleSchema, roleInput);
    if (!errors) {
      return true;
    } else {
      let errorsToShow: ValidationErrors = {};
      errors.forEach((it) => {
        switch (it.path[0]) {
          case "role":
            if (!errorsToShow.roleError) {
              if (callType === "fill" && currentRole.role === "") {
              } else {
                errorsToShow.roleError = it.message;
              }
            }
            break;
          case "description":
            if (!errorsToShow.descriptionError) {
              errorsToShow.descriptionError = it.message;
            }
            break;
        }
      });
      setCurrentRole({ ...currentRole, ...errorsToShow });
      return false;
    }
  };

  // input change handler
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "role":
        setCurrentRole({ ...currentRole, role: e.target.value, roleError: "" });
        break;
      case "description":
        setCurrentRole({
          ...currentRole,
          description: e.target.value,
          descriptionError: "",
        });
        break;
    }
  };

  // api service calls
  const deleteApiServiceCall = async () => {
    const result = await deleteRoleService(
      openStatus.currentRole?._id as string
    );
    if (result) {
      closeRoleDetails();
    }
  };
  const putApiServiceCall = async () => {
    let updatedRole: RoleDocument = {
      _id: currentRole._id,
      __v: currentRole.__v,
      role: currentRole.role,
      createdAt: currentRole.createdAt,
      updatedAt: currentRole.updatedAt,
    };
    if (currentRole.description !== "") {
      updatedRole.description = currentRole.description;
    }
    const result = await putRoleService(updatedRole);
    if (result) {
      closeRoleDetails();
    }
  };

  // click handlers
  const closeDialogClickHandler = () => {
    clearForm();
    closeRoleDetails();
  };
  const saveClickHandler = async () => {
    // validating inputs
    const inputsAreOk = await validateInputs("submit");
    if (inputsAreOk) {
      openConfirmationDialog(textResources.saveRoleUpdatesMessage, () =>
        putApiServiceCall()
      );
    }
  };
  const editClickHandler = () => {
    setCardState("edit");
  };
  const cancelClickHandler = () => {
    setCardState("view");
    setCurrentRole({ ...initialRoleValue, ...openStatus.currentRole });
  };
  const deleteClickHandler = () => {
    openConfirmationDialog(
      `${textResources.deleteRoleCardMessage} ${openStatus.currentRole?.role}`,
      () => deleteApiServiceCall()
    );
  };
  const createClickHandler = async () => {
    // validating inputs
    const inputsAreOk = await validateInputs("submit");
    if (inputsAreOk) {
      // assembling object for create role api call
      let roleInput: RoleInput = {
        role: currentRole.role,
      };
      if (currentRole.description !== "") {
        roleInput.description = currentRole.description;
      }
      // calling create role api service
      const result = await createRoleService(roleInput);
      // if role is created - close the dialog window
      if (result) {
        clearForm()
        closeRoleDetails();
      }
    }
  };
  const showUsersClickHandler = () => {
    // TODO: show users with current role
  };
  return (
    <Dialog open={openStatus.open} sx={styles.mainFrame}>
      <DialogTitle>
        <Typography>
          {openStatus.currentRole
            ? textResources.roleEditDetailsDialogHeader
            : textResources.roleCreateDetailsDialogHeader}
        </Typography>
        {openStatus.currentRole ? (
          <Typography>
            {`${usersNum} ` + textResources.roleDetailsUsersWithRoleHeader}
          </Typography>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          disabled={true}
          sx={{
            ...styles.inputField,
            display: openStatus.currentRole ? "" : "none",
          }}
          variant="outlined"
          label={textResources.roleIdInputLabel}
          name="id"
          value={currentRole._id}
        />
        <TextField
          fullWidth
          required
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="role"
          type="text"
          label={textResources.roleNameInputLabel}
          value={currentRole.role}
          onChange={changeHandler}
          helperText={currentRole.roleError}
          FormHelperTextProps={{ error: true }}
          error={currentRole.roleError === "" ? false : true}
          onBlur={() => validateInputs("fill")}
        />
        <TextField
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="description"
          type="text"
          label={textResources.roleDescriptionLabel}
          value={currentRole.description}
          onChange={changeHandler}
          helperText={currentRole.descriptionError}
          FormHelperTextProps={{ error: true }}
          error={currentRole.descriptionError === "" ? false : true}
          onBlur={() => validateInputs("fill")}
        />
        <TextField
          fullWidth
          disabled={true}
          sx={{
            ...styles.inputField,
            display: openStatus.currentRole ? "" : "none",
          }}
          variant="outlined"
          label={textResources.createdAtInputLabel}
          name="createdAt"
          value={currentRole.createdAt}
        />
        <TextField
          fullWidth
          disabled={true}
          sx={{
            ...styles.inputField,
            display: openStatus.currentRole ? "" : "none",
          }}
          variant="outlined"
          label={textResources.updatedAtInputLabel}
          name="updatedAt"
          value={currentRole.updatedAt}
        />
      </DialogContent>
      <DialogActions>
        <ButtonGroup fullWidth>
          <Button
            sx={{ display: openStatus.currentRole ? "" : "none" }}
            onClick={showUsersClickHandler}
          >
            {textResources.roleDetailsShowUsersLabel}
          </Button>
          <Button
            sx={{
              display:
                openStatus.currentRole || cardState === "view" ? "none" : "",
            }}
            variant="contained"
            color="success"
            onClick={createClickHandler}
          >
            {textResources.roleDetailsCreateBtnLabel}
          </Button>
          <Button
            sx={{
              display:
                !openStatus.currentRole || cardState === "view" ? "none" : "",
            }}
            disabled={usersNum > 0}
            variant="contained"
            color="error"
            onClick={deleteClickHandler}
          >
            {textResources.roleDetailsDeleteBtnLabel}
          </Button>
          <Button
            sx={{
              display:
                !openStatus.currentRole || cardState === "view" ? "none" : "",
            }}
            disabled={!edits}
            variant="contained"
            color="success"
            onClick={saveClickHandler}
          >
            {textResources.roleDetailsSaveBtnLabel}
          </Button>
          <Button
            sx={{ display: cardState === "view" ? "" : "none" }}
            onClick={editClickHandler}
          >
            {textResources.roleDetailsEditBtnLabel}
          </Button>
          <Button
            sx={{
              display:
                !openStatus.currentRole || cardState === "view" ? "none" : "",
            }}
            onClick={cancelClickHandler}
          >
            {textResources.roleDetailsCancelBtnLabel}
          </Button>
          <Button onClick={closeDialogClickHandler}>
            {textResources.roleDetailsCloseBtnLabel}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanelRoleDetailsDialog;
