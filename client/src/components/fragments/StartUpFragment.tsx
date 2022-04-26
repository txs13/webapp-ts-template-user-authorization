import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CoPresentTwoToneIcon from "@mui/icons-material/CoPresentTwoTone";
import { useSelector } from 'react-redux'
import { useNavigate, generatePath } from 'react-router-dom'

import startUpFragmentStyles from "../styles/startUpFragmentStyles";
import { LocalizedTextResources } from "../../res/textResourcesFunction";
import { RootState } from "../../app/store";
import getTextResources from "../../res/textResourcesFunction";
import emailToPath from "../../utils/emailToPath";

interface StartUpFragmentPropTypes {
  startUpActionsAreDone: boolean;
}

const StartUpFragment: React.FunctionComponent<StartUpFragmentPropTypes> = ({
  startUpActionsAreDone,
}) => {
  // get navigate function
  const navigate = useNavigate()
  // get user store state
  const user = useSelector((state: RootState) => state.user.value)

  // checking input conditions in order to navigate correctly on start up
  useEffect(() => {
    if (startUpActionsAreDone) {
      if(user.user) {
        navigate(generatePath("/:id", { id: emailToPath(user.user) }));
      } else {
        navigate('/login')
      }
    }
  }, [startUpActionsAreDone, navigate, user]);

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
    <>
      <Box sx={startUpFragmentStyles.fragmentFrame}>
        <Box sx={startUpFragmentStyles.loginBoxFrame}>
          <Box sx={startUpFragmentStyles.logoSection}>
            <Box sx={startUpFragmentStyles.logoSectionPictureBox}>
              <CoPresentTwoToneIcon
                fontSize="large"
                data-testid="applogo"
                sx={startUpFragmentStyles.logoPicture}
              />
            </Box>
            <Typography
              sx={startUpFragmentStyles.logoSectionText}
              data-testid="appName"
            >
              {textResourses.appName}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default StartUpFragment;
