import React from "react";
import { Routes, Route, generatePath } from "react-router-dom";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";

import StartUpFragment from "./fragments/StartUpFragment";
import AboutFragment from "./fragments/AboutFragment";
import ErrorFragment from "./fragments/ErrorFragment";
import LoginFragment from "./fragments/LoginFragment";
import NotfoundFragment from "./fragments/NotfoundFragment";
import ProfileFragment from "./fragments/ProfileFragment";
import RegisterFragment from "./fragments/RegisterFragment";
import StartingAdminFragment from "./fragments/StartingAdminFragment";
import StartingAppFragment from "./fragments/StartingAppFragment";
import ProtectedRoute, { ProtectedRouteProps } from "./ProtectedRoute";
import emailToPath from "../utils/emailToPath";

interface RouterFramePropTypes {
  startUpActionsAreDone: boolean;
}

const RouterFrame: React.FunctionComponent<RouterFramePropTypes> = ({
  startUpActionsAreDone,
}) => {
  const user = useSelector((state: RootState) => state.user.value);

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    isAuthenticated: user.user ? true : false,
    authenticationPath: "/login",
  };

  const defaultAdminProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    isAuthenticated: user.user && user.tokens?.isAdmin === true ? true : false,
    authenticationPath: "/"
  }

  return !startUpActionsAreDone ? (
    <StartUpFragment startUpActionsAreDone={startUpActionsAreDone} />
  ) : (
    <Routes>
      <Route
        path="/"
        element={
          <StartUpFragment startUpActionsAreDone={startUpActionsAreDone} />
        }
      />
      <Route path="/error" element={<ErrorFragment />} />
      <Route path="/about" element={<AboutFragment />} />
      <Route path="/login" element={<LoginFragment />} />
      <Route path="/register" element={<RegisterFragment />} />
      <Route
        path={generatePath("/:id", { id: emailToPath(user.user) })}
        element={
          <ProtectedRoute
            {...defaultProtectedRouteProps}
            outlet={<StartingAppFragment />}
          />
        }
      />
      <Route
        path={generatePath("/:id/profile", { id: emailToPath(user.user) })}
        element={
          <ProtectedRoute
            {...defaultProtectedRouteProps}
            outlet={<ProfileFragment />}
          />
        }
      />
      <Route
        path={`${generatePath("/:id/adminpanel", { id: emailToPath(user.user) })}/*`}
        element={
          <ProtectedRoute
            {...defaultAdminProtectedRouteProps}
            outlet={<StartingAdminFragment />}
          />
        }
      />
      <Route path="*" element={<NotfoundFragment />} />
    </Routes>
  );
};

export default RouterFrame;
