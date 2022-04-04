import React from "react";

import { AppBar } from '@mui/material'
import navbarStyles from './styles/navbarStyles'


const Navbar: React.FunctionComponent = () => {
  return (
  <>
    <AppBar position="static" className="navbar" sx={navbarStyles.navbar}>
      AppBar
    </AppBar>
  </>
  );
};

export default Navbar;
