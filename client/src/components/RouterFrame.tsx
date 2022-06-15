import React, { useEffect } from "react";
import {
  Routes,
  Route,
  generatePath,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
  // getting current path and current user in order to redirect
  // the request website path after a silent logoff
  // this approach has a side effect that "not found" fragment is
  // not goging to be reached ever
  // it declaration is a kind of "just in case"
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    if (
      !user.user &&
      // basically here should be listed all the not protected routes
      location.pathname !== "/login" &&
      location.pathname !== "/register" &&
      location.pathname !== "/about" &&
      location.pathname !== "/"
    ) {
      navigate("/")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, user.user]);

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    isAuthenticated: user.user ? true : false,
    authenticationPath: "/login",
  };

  const defaultAdminProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    isAuthenticated: user.user && user.tokens?.isAdmin === true ? true : false,
    authenticationPath: "/",
  };

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
        path={`${generatePath("/:id/adminpanel", {
          id: emailToPath(user.user),
        })}/*`}
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
