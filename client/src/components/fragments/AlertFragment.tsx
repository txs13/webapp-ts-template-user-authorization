import React, { useMemo } from "react";
import { Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../app/store";
import { clearMessage } from "../../app/features/appAlertMessage.slice";
import getConfig from "../../config/config";

const { messageTimeout } = getConfig();

const AlertFragment: React.FunctionComponent = () => {
  // get data from app message store
  const appAlertMessage = useSelector(
    (state: RootState) => state.appAlertMessage.value
  );
  // get store
  const dispatch = useDispatch();

  useMemo(() => {
    if (appAlertMessage.alertType) {
      setTimeout(() => {
        dispatch(clearMessage());
      }, messageTimeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appAlertMessage]);

  return (
    <Alert
      sx={{ display: appAlertMessage.alertType ? "" : "none" }}
      severity={appAlertMessage.alertType || "info"}
    >
      {appAlertMessage.actionDescription
        ? `${appAlertMessage.actionDescription}: ${appAlertMessage.alertMessage}`
        : `${appAlertMessage.alertMessage}`}
    </Alert>
  );
};
export default AlertFragment;
