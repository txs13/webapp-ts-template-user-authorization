// please scroll to the bottom of the file in order to get short manual
// regarding how to use the component as well as code to be inserted to
// the target fragment
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

export interface OpenConfimationStatus {
  open: boolean;
  message: string;
  successCBFunction: Function;
}

export const openConfimationInitialState: OpenConfimationStatus = {
  open: false,
  message: "",
  successCBFunction: () => {},
};

interface AdminPanelUserListConfirmationPropsTypes {
  openStatus: OpenConfimationStatus;
  submitConfirmationDecision: Function;
}

const ConfimationDialog: React.FunctionComponent<
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
          <Button
            onClick={() =>
              submitConfirmationDecision("yes", openStatus.successCBFunction)
            }
          >
            {textResourses.btnYesConfimationDialogLabel}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default ConfimationDialog;

// all the logic is kept in the fragment itself
// to open the confirmation window you should call "openConfirmationDialog"
// function, passing in two things: message to show, callback function
// to call if user confirms
// another thing to pass is the function submitConfirmationDecision,
// which either closes the window or calls the function and then
// closes the window in case user has confirmed the action

// this block is needed for the universal model / confimation window
// const [openConfirmationStatus, setOpenConfirmationStatus] =
//   useState<OpenConfimationStatus>(openConfimationInitialState);
// const openConfirmationDialog = (
//   message: string,
//   successCBFunction: Function
// ) => {
//   setOpenConfirmationStatus({
//     open: true,
//     message: message,
//     successCBFunction: successCBFunction,
//   });
// };
// const submitConfirmationDecision = (
//   decision: "yes" | "no",
//   successCBFunction?: Function
// ) => {
//   if (decision === "yes" && successCBFunction) {
//     successCBFunction();
//   }
//   setOpenConfirmationStatus(openConfimationInitialState);
// };

/* <ConfirmationDialog
  openStatus={openConfirmationStatus}
  submitConfirmationDecision={submitConfirmationDecision}
/>; */

