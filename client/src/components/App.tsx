import React from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "../app/store";
import { Provider } from "react-redux";
import { createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import Navbar from "./Navbar";
import appStyles from "./styles/appStyles";
import StartUpFragment from "./fragments/StartUpFragment";
import AboutFragment from "./fragments/AboutFragment";
import ErrorFragment from "./fragments/ErrorFragment";
import LoginFragment from "./fragments/LoginFragment";
import NotfoundFragment from "./fragments/NotfoundFragment";
import ProfileFragment from "./fragments/ProfileFragment";
import RegisterFragment from "./fragments/RegisterFragment";
import StartingAdminFragment from "./fragments/StartingAdminFragment";
import StartingAppFragment from "./fragments/StartingAppFragment";

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
                <Routes>
                  <Route path="/" element={<StartUpFragment />} />
                  <Route path="/error" element={<ErrorFragment />} />
                  <Route path="/about" element={<AboutFragment />} />
                  <Route path="/login" element={<LoginFragment />} />
                  <Route path="/register" element={<RegisterFragment />} />
                  <Route path="/profile" element={<ProfileFragment />} />
                  <Route path="/username" element={<StartingAppFragment />} />
                  <Route
                    path="/username/admin"
                    element={<StartingAdminFragment />}
                  />
                  <Route path="*" element={<NotfoundFragment />} />
                </Routes>
              </Box>
            </Box>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
};

export default App;
