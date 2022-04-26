import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import store from "../app/store";
import { Provider } from "react-redux";
import { createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import Navbar from "./Navbar";
import appStyles from "./styles/appStyles";
import RouterFrame from "./RouterFrame";
import { fetchPublicRolesService } from "../app/services/publicRoles";
import { loginWithRefreshTokenService } from '../app/services/loginServices'

const appTheme = createTheme(); 

const App: React.FunctionComponent = () => {
  // procedure to get all the initial values
  const startUpActions = async () => {
    // fetch portal roles
    await fetchPublicRolesService();
    // check refresh token stored in local storage
    const storageRefreshToken = localStorage.getItem("refreshinfo");
    if (storageRefreshToken){
      const refreshToken: {
        refreshToken: string;
        sessionTtl: number;
        expires: number;
      } = JSON.parse(storageRefreshToken);
      // login using refresh token
      const now = new Date()
      if (now.getTime() > refreshToken.expires) {
        localStorage.removeItem("refreshinfo");
      } else {
        await loginWithRefreshTokenService(refreshToken.refreshToken, refreshToken.sessionTtl);
      }
    } 
    setStartUpActionsAreDone(true);
  };

  const [startUpActionsAreDone, setStartUpActionsAreDone] = useState(false);

  useEffect(() => {
    startUpActions().then(() => {
      setStartUpActionsAreDone(true);
    });
  }, []);

  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={appTheme}>
          <BrowserRouter>
            <CssBaseline />
            <Box className="app" sx={appStyles.app}>
              <Navbar />
              <Box className="appframe" sx={appStyles.appframe}>
                <RouterFrame startUpActionsAreDone={startUpActionsAreDone} />
              </Box>
            </Box>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </>
  );
};

export default App;
