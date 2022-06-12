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
import { useSelector, useDispatch } from "react-redux";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";
import { OpenRoleDetailsStatus } from "./AdminPanelRoleListFragment";
import styles from "../../styles/adminPanelStyles/adminPanelRoleDetailsDialogStyles";

interface AdminPanelRoleDetailDialogPropsTypes {
  openStatus: OpenRoleDetailsStatus;
  roles: RoleDocument[] | undefined;
  users: UserDocument[] | undefined;
  closeRoleDetails: Function;
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
> = ({ openStatus, roles, users, closeRoleDetails }) => {
  const dispatch = useDispatch();
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

  // user card state variable
  const [cardState, setCardState] = useState<"view" | "edit">("view");

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

  // click handlers
  const closeDialogClickHandler = () => {
    closeRoleDetails();
  };
  const saveClickHandler = () => {
    // TODO: initiate put api call
  };
  const editClickHandler = () => {
    setCardState("edit");
  };
  const cancelClickHandler = () => {
    setCardState("view");
    setCurrentRole({ ...initialRoleValue, ...openStatus.currentRole });
  };
  const deleteClickHandler = () => {
    // TODO: initiate delete api call
  };
  const createClickHandler = () => {
    // TODO: initiate create api call
  };
  return (
    <Dialog open={openStatus.open} sx={styles.mainFrame}>
      <DialogTitle>
        <Typography>
          {openStatus.currentRole
            ? textResourses.roleEditDetailsDialogHeader
            : textResourses.roleCreateDetailsDialogHeader}
        </Typography>
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
          label={textResourses.roleIdInputLabel}
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
          label={textResourses.roleNameInputLabel}
          value={currentRole.role}
          onChange={changeHandler}
          helperText={currentRole.roleError}
          FormHelperTextProps={{ error: true }}
          error={currentRole.roleError === "" ? false : true}
        />
        <TextField
          fullWidth
          disabled={cardState === "view" ? true : false}
          sx={styles.inputField}
          variant="outlined"
          name="description"
          type="text"
          label={textResourses.roleDescriptionLabel}
          value={currentRole.description}
          onChange={changeHandler}
          helperText={currentRole.descriptionError}
          FormHelperTextProps={{ error: true }}
          error={currentRole.descriptionError === "" ? false : true}
        />
        <TextField
          fullWidth
          disabled={true}
          sx={{
            ...styles.inputField,
            display: openStatus.currentRole ? "" : "none",
          }}
          variant="outlined"
          label={textResourses.createdAtInputLabel}
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
          label={textResourses.updatedAtInputLabel}
          name="updatedAt"
          value={currentRole.updatedAt}
        />
      </DialogContent>
      <DialogActions>
        <ButtonGroup fullWidth>
          <Button
            sx={{
              display:
                openStatus.currentRole || cardState === "view" ? "none" : "",
            }}
            variant="contained"
            color="success"
            onClick={createClickHandler}
          >
            {textResourses.roleDetailsCreateBtnLabel}
          </Button>
          <Button
            sx={{
              display:
                !openStatus.currentRole || cardState === "view" ? "none" : "",
            }}
            variant="contained"
            color="error"
            onClick={deleteClickHandler}
          >
            {textResourses.roleDetailsDeleteBtnLabel}
          </Button>
          <Button
            sx={{
              display:
                !openStatus.currentRole || cardState === "view" ? "none" : "",
            }}
            variant="contained"
            color="success"
            onClick={saveClickHandler}
          >
            {textResourses.roleDetailsSaveBtnLabel}
          </Button>
          <Button
            sx={{ display: cardState === "view" ? "" : "none" }}
            onClick={editClickHandler}
          >
            {textResourses.roleDetailsEditBtnLabel}
          </Button>
          <Button
            sx={{ display: !openStatus.currentRole || cardState === "view" ? "none" : "" }}
            onClick={cancelClickHandler}
          >
            {textResourses.roleDetailsCancelBtnLabel}
          </Button>
          <Button onClick={closeDialogClickHandler}>
            {textResourses.roleDetailsCloseBtnLabel}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanelRoleDetailsDialog;
