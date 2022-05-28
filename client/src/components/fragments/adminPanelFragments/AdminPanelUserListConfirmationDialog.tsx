import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonGroup,
  Button,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import { OpenConfimationStatus } from "./AdminPanelUserListFragment";

interface AdminPanelUserListConfirmationPropsTypes {
  openStatus: OpenConfimationStatus;
  submitConfirmationDecision: Function;
}

const AdminPanelUserListConfimationDialog: React.FunctionComponent<
  AdminPanelUserListConfirmationPropsTypes
> = ({ openStatus, submitConfirmationDecision }) => {
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
  return (
    <Dialog open={openStatus.open}>
      <DialogTitle>{textResourses.headerConfimationDialogLabel}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{openStatus.message}</Typography>
      </DialogContent>
      <DialogActions>
        <ButtonGroup fullWidth>
          <Button onClick={() => submitConfirmationDecision("no")}>
            {textResourses.btnNoConfimationDialogLabel}
          </Button>
          <Button onClick={() => submitConfirmationDecision("yes", openStatus.successCBFunction)}>
            {textResourses.btnYesConfimationDialogLabel}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanelUserListConfimationDialog;
