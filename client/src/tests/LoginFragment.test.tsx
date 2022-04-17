import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { render, screen, cleanup } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import { RootState } from "../app/store";
import { AppLanguageOptions } from "../res/textResourcesFunction";
import LoginFragment from "../components/fragments/LoginFragment";
import getTextResourses from "../res/textResourcesFunction";
import { UserValue } from "../app/features/user.slice";

const textResourses = getTextResourses(AppLanguageOptions.EN);

describe("login form tests", () => {
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const initialStoreStateNoUser: RootState = {
    user: {
      value: { user: null, tokens: null, loginError: null } as UserValue,
    },
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

  test("check that all form components are in place", async () => {
    const store = mockStore(() => initialStoreStateNoUser);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginFragment />
        </BrowserRouter>
      </Provider>
    );

    const logo = await screen.findByTestId("applogo");
    const appName = await screen.findByTestId("appName");
    const alarm = await screen.findByTestId("loginAlert");
    const emailInput = await screen.findByTestId("emailInput");
    const passwordInput = await screen.findByTestId("passwordInput");
    const rememberEmailChkBox = await screen.findByTestId("rememberEmailChckBox");
    const loginBtn = await screen.findByTestId("loginBtn");
    const registerBtn = await screen.findByTestId("registerBtn");

    expect(logo).toBeInTheDocument();

    expect(appName).toBeInTheDocument();
    expect(appName).toBeVisible();
    expect(appName.textContent).toContain(textResourses.appName);

    expect(alarm).toBeInTheDocument();
    expect(alarm).not.toBeVisible();

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toBeVisible();
    expect(emailInput.textContent).toContain(textResourses.emailInputLabel);


    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toBeVisible();
    expect(passwordInput.textContent).toContain(
      textResourses.passwordInputLabel
    );

    expect(rememberEmailChkBox).toBeInTheDocument();
    expect(rememberEmailChkBox).toBeVisible();
    expect(rememberEmailChkBox.textContent).toContain(
      textResourses.rememberEmailChkBoxLabel
    );

    expect(loginBtn).toBeInTheDocument();
    expect(loginBtn).toBeVisible();
    expect(loginBtn.textContent).toContain(textResourses.loginBtnLabel);

    expect(registerBtn).toBeInTheDocument();
    expect(registerBtn).toBeVisible();
    expect(registerBtn.textContent).toContain(textResourses.toRegisterBtnLabel);

  });
});
