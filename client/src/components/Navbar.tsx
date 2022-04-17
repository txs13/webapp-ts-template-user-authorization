import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  AppBar,
} from "@mui/material";
import CoPresentTwoToneIcon from "@mui/icons-material/CoPresentTwoTone";
import AccountCircle from "@mui/icons-material/AccountCircle";

import { RootState } from "../app/store";
import navbarStyles from "./styles/navbarStyles";
import getTextResources from "../res/textResourcesFunction";
import { LocalizedTextResources } from "../res/textResourcesFunction";

const Navbar: React.FunctionComponent = () => {
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

  // get user from app user store and form proper menu items
  const user = useSelector((state: RootState) => state.user.value);
  const [menuItems, setMenuItems] = useState<string[]>();
  useEffect(() => {
    if (user.user) {
      setMenuItems([
        textResourses.startingAppMenuItemText,
        textResourses.profileMenuItemText,
        textResourses.logoutMenuItemText,
      ]);
    } else {
      setMenuItems([
        textResourses.loginMenuItemText,
        textResourses.registerMenuItemText,
      ]);
    }
  }, [textResourses, user]);

  // menu items functions
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(null);
    const item = event.currentTarget;
    console.log(item.getAttribute("value"));
  };

  return (
    <AppBar position="static" sx={navbarStyles.appbar}>
      <Toolbar variant="dense" sx={navbarStyles.toolbar}>
        <Box sx={navbarStyles.logoSection}>
          <Box sx={navbarStyles.logoSectionPictureBox}>
            <CoPresentTwoToneIcon
              fontSize="large"
              data-testid="applogo"
              sx={navbarStyles.logoPicture}
            />
          </Box>
          <Typography sx={navbarStyles.logoSectionText}>
            {textResourses.appName}
          </Typography>
        </Box>
        <Box sx={navbarStyles.siteLinksSection}>
          <Typography sx={navbarStyles.aboutAppLink}>
            {textResourses.aboutAppLink}
          </Typography>
        </Box>
        <Box sx={navbarStyles.siteMenuBox}>
          <IconButton
            onClick={handleOpenUserMenu}
            sx={navbarStyles.menuButton}
            data-testid="nav-menu-button"
          >
            <AccountCircle fontSize="large" sx={navbarStyles.menuButtonIcon} />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-bar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {menuItems?.map((menuItem, index) => (
              <MenuItem
                data-testid={`navbar-menu-item-${
                  (menuItem || "temporary-id")
                  .toLowerCase()
                  .replace(" ", "")}`}
                key={index}
                onClick={handleCloseUserMenu}
                value={menuItem}
              >
                {menuItem}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
