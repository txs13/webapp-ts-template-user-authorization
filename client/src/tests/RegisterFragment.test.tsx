import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { render, screen, cleanup } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import { RootState } from "../app/store";
import { AppLanguageOptions } from "../res/textResourcesFunction";
import RegisterFragment from "../components/fragments/RegisterFragment";
import getTextResourses from "../res/textResourcesFunction";

const textResourses = getTextResourses(AppLanguageOptions.EN);

describe("register form tests", () => {
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const initialStoreStateNoUser: RootState = {
    user: { value: { user: null, tokens: null, loginError: null } },
    role: { value: [] },
    appSettings: {
      value: {
        language: AppLanguageOptions.EN,
      },
    },
    appAlertMessage: {
      value: {
        alertMessage: null,
        alertType: null,
        actionDescription: null,
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
          <RegisterFragment />
        </BrowserRouter>
      </Provider>
    );

    const logo = await screen.findByTestId("applogo");
    const appName = await screen.findByTestId("appName");
    const alarm = await screen.findByTestId("registerAlert");
    const emailInput = await screen.findByTestId("emailInputRegister");
    const passwordInput = await screen.findByTestId("passwordInputRegister");
    const confirmPasswordInput = await screen.findByTestId(
      "confirmPasswordInputRegister"
    );
    const nameInput = await screen.findByTestId("nameInput");
    const familynameInput = await screen.findByTestId("familynameInput");
    const roleInput = await screen.findByTestId("roleInput");
    const backToLoginBtn = await screen.findByTestId("backToLoginBtn");
    const registerBtn = await screen.findByTestId("registerBtn");

    expect(logo).toBeInTheDocument();

    expect(appName).toBeInTheDocument();
    expect(appName).toBeVisible();
    expect(appName.textContent).toContain(textResourses.appName);

    expect(alarm).toBeInTheDocument();
    //expect(alarm).not.toBeVisible();

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toBeVisible();
    expect(emailInput.textContent).toContain(textResourses.emailInputLabel);

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toBeVisible();
    expect(passwordInput.textContent).toContain(
      textResourses.passwordInputLabel
    );

    expect(confirmPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeVisible();
    expect(confirmPasswordInput.textContent).toContain(
      textResourses.confirmPasswordInputLabel
    );

    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toBeVisible();
    expect(nameInput.textContent).toContain(textResourses.nameInputLabel);

    expect(familynameInput).toBeInTheDocument();
    expect(familynameInput).toBeVisible();
    expect(familynameInput.textContent).toContain(
      textResourses.familynameInputLabel
    );

    expect(roleInput).toBeInTheDocument();
    expect(roleInput).toBeVisible();
    expect(roleInput.textContent).toContain(textResourses.roleInputLabel);

    expect(backToLoginBtn).toBeInTheDocument();
    expect(backToLoginBtn).toBeVisible();
    expect(backToLoginBtn.textContent).toContain(
      textResourses.backToLoginBtnLabel
    );

    expect(registerBtn).toBeInTheDocument();
    expect(registerBtn).toBeVisible();
    expect(registerBtn.textContent).toContain(textResourses.registerBtnLabel);
  });
});
