import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { render, screen, cleanup } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import userEvent from "@testing-library/user-event";

import { RootState } from "../app/store";
import { AppLanguageOptions } from "../res/textResourcesFunction";
import Navbar from "../components/Navbar";
import getTextResourses from "../res/textResourcesFunction";

const textResourses = getTextResourses(AppLanguageOptions.EN);

//TODO: check correct navigating after proper functionality is implemented

describe("navbar tests", () => {
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const initialStoreStateNoUser: RootState = {
    user: { value: null },
    token: { value: null },
    role: { value: null },
    appSettings: {
      value: {
        language: AppLanguageOptions.EN,
      },
    },
  };

  const initialStoreStateLoggedUser = {
    user: {
      value: {
        _id: "fdgfdsa",
        email: "a@b.com",
        name: "noname",
        userrole_id: "gfdsafv",
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
      },
    },
    token: { value: null },
    role: { value: null },
    appSettings: {
      value: {
        language: AppLanguageOptions.EN,
      },
    },
  };

  afterEach(() => {
    cleanup();
  });

  test("check that all navbar components are in place - no logged user", async () => {
    const store = mockStore(() => initialStoreStateNoUser);

    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );

    // app logo is in place
    const appLogo = await screen.findByTestId("applogo");
    expect(appLogo).toBeInTheDocument();
    expect(appLogo).toBeVisible();
    // app name next to the logo is in place with correct text
    const appName = await screen.findByText(textResourses.appName);
    expect(appName).toBeInTheDocument();
    expect(appName).toBeVisible();
    // about app link is in place with correct text
    const aboutAppLink = await screen.findByText(textResourses.aboutAppLink);
    expect(aboutAppLink).toBeInTheDocument();
    expect(aboutAppLink).toBeVisible();
    // navigation manu button is in place
    const navMenuButton = await screen.findByTestId("nav-menu-button");
    expect(navMenuButton).toBeInTheDocument();
    expect(navMenuButton).toBeVisible();
    // getting "log in" menu item by test id and ensuring right text, visibility
    const loginMenuItem = await screen.findByTestId(
      `navbar-menu-item-${textResourses.loginMenuItemText
        .toLowerCase()
        .replace(" ", "")}`
    );
    expect(loginMenuItem).toBeInTheDocument();
    expect(loginMenuItem.textContent).toBe(textResourses.loginMenuItemText);
    expect(loginMenuItem).not.toBeVisible();
    // getting "register" menu item by test id and ensuring right text, visibility
    const registerMenuItem = await screen.findByTestId(
      `navbar-menu-item-${textResourses.registerMenuItemText
        .toLowerCase()
        .replace(" ", "")}`
    );
    expect(registerMenuItem).toBeInTheDocument();
    expect(registerMenuItem.textContent).toBe(
      textResourses.registerMenuItemText
    );
    expect(registerMenuItem).not.toBeVisible();
    // click menu button to show the menu and check menu items visibility
    await userEvent.click(navMenuButton);
    expect(loginMenuItem).toBeVisible();
    expect(registerMenuItem).toBeVisible();
  });

  test("check that all navbar components are in place - user is logged", async () => {
    const store = mockStore(() => initialStoreStateLoggedUser);
    render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );

    // navigation manu button is in place
    const navMenuButton = await screen.findByTestId("nav-menu-button");
    expect(navMenuButton).toBeInTheDocument();
    expect(navMenuButton).toBeVisible();
    // getting "logout" menu item by test id and ensuring right text, visibility
    const logoutMenuItem = await screen.findByTestId(
      `navbar-menu-item-${textResourses.logoutMenuItemText
        .toLowerCase()
        .replace(" ", "")}`
    );
    expect(logoutMenuItem).toBeInTheDocument();
    expect(logoutMenuItem.textContent).toBe(textResourses.logoutMenuItemText);
    expect(logoutMenuItem).not.toBeVisible();
    // getting "profile" menu item by test id and ensuring right text, visibility
    const profileMenuItem = await screen.findByTestId(
      `navbar-menu-item-${textResourses.profileMenuItemText
        .toLowerCase()
        .replace(" ", "")}`
    );
    expect(profileMenuItem).toBeInTheDocument();
    expect(profileMenuItem.textContent).toBe(textResourses.profileMenuItemText);
    expect(profileMenuItem).not.toBeVisible();
    // getting "main app" menu item by test id and ensuring right text, visibility
    const startingAppPageMenuItem = await screen.findByTestId(
      `navbar-menu-item-${textResourses.startingAppMenuItemText
        .toLowerCase()
        .replace(" ", "")}`
    );
    expect(startingAppPageMenuItem).toBeInTheDocument();
    expect(startingAppPageMenuItem.textContent).toBe(
      textResourses.startingAppMenuItemText
    );
    expect(startingAppPageMenuItem).not.toBeVisible();
    // click menu button to show the menu and check menu items visibility
    await userEvent.click(navMenuButton);
    expect(logoutMenuItem).toBeVisible();
    expect(profileMenuItem).toBeVisible();
    expect(startingAppPageMenuItem).toBeVisible();
  });
});
