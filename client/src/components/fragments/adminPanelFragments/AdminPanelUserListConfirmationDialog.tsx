import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ButtonGroup,
  Button,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";

const AdminPanelUserListConfimationDialog = () => {
  return (
    <Dialog>
      <DialogTitle></DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default AdminPanelUserListConfimationDialog;
