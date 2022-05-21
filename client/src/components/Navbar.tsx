import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, generatePath } from "react-router-dom";
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
import emailToPath from "../utils/emailToPath";
import { logoutService } from "../app/services/logoutService";

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

  // get navigate function
  const navigate = useNavigate();

  // get user from app user store and form proper menu items
  const user = useSelector((state: RootState) => state.user.value);
  const [menuItems, setMenuItems] = useState<string[]>();
  useEffect(() => {
    if (user.user) {
      if (user.tokens?.isAdmin === true) {
        setMenuItems([
          textResourses.startingAppMenuItemText,
          textResourses.profileMenuItemText,
          textResourses.startingAdminMenuItemText,
          textResourses.logoutMenuItemText,
        ]);
      } else {
        setMenuItems([
          textResourses.startingAppMenuItemText,
          textResourses.profileMenuItemText,
          textResourses.logoutMenuItemText,
        ]);
      }
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

  const handleCloseUserMenu = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(null);
    const item = event.currentTarget;
    //console.log(item.getAttribute("value"));
    switch (item.getAttribute("value")) {
      case textResourses.startingAppMenuItemText:
        navigate(generatePath("/:id", { id: emailToPath(user.user) }));
        break;
      case textResourses.profileMenuItemText:
        navigate(generatePath("/:id/profile", { id: emailToPath(user.user) }));
        break;
      case textResourses.logoutMenuItemText:
        await logoutService();
        navigate("/");
        break;
      case textResourses.loginMenuItemText:
        navigate("/login");
        break;
      case textResourses.registerMenuItemText:
        navigate("/register");
        break;
      case textResourses.startingAdminMenuItemText:
        navigate(
          generatePath("/:id/adminpanel", { id: emailToPath(user.user) })
        );
        break;
      default:
        console.log("something went wrong with menu items selection");
    }
  };

  return (
    <AppBar position="static" sx={navbarStyles.appbar}>
      <Toolbar variant="dense" sx={navbarStyles.toolbar}>
        <Box
          sx={navbarStyles.logoSection}
          onClick={() => {
            if (user.user) {
              navigate(generatePath("/:id", { id: emailToPath(user.user) }));
            } else {
              navigate("/login");
            }
          }}
        >
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
          <Typography
            sx={navbarStyles.aboutAppLink}
            onClick={() => {
              navigate("/about");
            }}
          >
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
                data-testid={`navbar-menu-item-${(menuItem || "temporary-id")
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
