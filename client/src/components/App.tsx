import React from "react";
import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import store from "../app/store";
import { Provider } from "react-redux";
import { createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import Navbar from "./Navbar";
import appStyles from "./styles/appStyles";
import RouterFrame from './RouterFrame'


const appTheme = createTheme();

const App: React.FunctionComponent = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={appTheme}>
          <BrowserRouter>
            <CssBaseline />
            <Box className="app" sx={appStyles.app}>
              <Navbar />
              <Box className="appframe" sx={appStyles.appframe}>
                <RouterFrame />
              </Box>
            </Box>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
};

export default App;
