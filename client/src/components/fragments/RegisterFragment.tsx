import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import CoPresentTwoToneIcon from "@mui/icons-material/CoPresentTwoTone";

import { RootState } from "../../app/store";
import registerFragmentStyles from "../styles/registerFragmentStyles";
import getTextResources from "../../res/textResourcesFunction";
import { LocalizedTextResources } from "../../res/textResourcesFunction";

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
            <Typography sx={registerFragmentStyles.logoSectionText}>
              {textResourses.appName}
            </Typography>
          </Box>

          <Box sx={registerFragmentStyles.alertSection}>Alert Block</Box>

          <Box sx={registerFragmentStyles.userInputSection}>
            User Input Block
          </Box>

          <Box sx={registerFragmentStyles.buttonsSection}>Buttons Block</Box>
        </Box>
      </Box>
    </>
  );
};

export default RegisterFragment;
