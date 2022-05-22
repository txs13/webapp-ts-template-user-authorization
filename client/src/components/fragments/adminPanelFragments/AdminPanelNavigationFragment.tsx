import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material"

import styles from "../../styles/adminPanelStyles/adminPanelNavigationStyles";
import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";

type navBtnValues = "main" | "userlist" | "rolelist";

const AdminPanelNavigationFragment: React.FunctionComponent = () => {
  // get navigate function
  const navigate = useNavigate();
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

  // button state handling
  const [alignment, setAlignment] = useState<navBtnValues>("main");
  const handleBtnClickChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: navBtnValues
  ) => {
    setAlignment(newAlignment);
    if (newAlignment !== alignment) {
      switch(newAlignment) {
        case "main": 
          navigate("")
          break;
        case "rolelist":
          navigate("rolelist");
          break;
        case "userlist":
          navigate("userlist");
          break;
        default:
          console.log("wrong menu identifier. please contact developers")      
      }
    }
  };

  // handle screen size change
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")) 

  return (
    <Box sx={styles.fragmentFrame}>
      <ToggleButtonGroup
        sx={styles.btnGroup}
        orientation={isSmallScreen ? "horizontal" : "vertical"}
        value={alignment}
        exclusive
        onChange={handleBtnClickChange}
      >
        <ToggleButton
          sx={styles.startingPageNavBtn}
          value={"main" as navBtnValues}
        >
          {textResourses.startingPageNavLabel}
        </ToggleButton>
        <ToggleButton
          sx={styles.userListNavBtn}
          value={"userlist" as navBtnValues}
        >
          {textResourses.userListNavLabel}
        </ToggleButton>
        <ToggleButton
          sx={styles.roleListNavBtn}
          value={"rolelist" as navBtnValues}
        >
          {textResourses.roleListNavLabel}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default AdminPanelNavigationFragment;
