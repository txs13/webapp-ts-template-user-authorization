import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";

import { RootState } from "../app/store";
import { AppLanguageOptions } from "../res/textResourcesFunction";
import LoginFragment from "../components/fragments/LoginFragment";
import getTextResourses from "../res/textResourcesFunction";
import { UserValue } from "../app/features/user.slice";
import getConfig from "../config/config";
import { client } from "../api/api";
import realStore from "../app/store";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUsedNavigate,
}));

const { userApi } = getConfig();

const mockAdapter = new MockAdapter(client, { delayResponse: 600 });
mockAdapter.onPost(`${userApi}/login`).reply((config) => {
  const userData = JSON.parse(config.data);
  if (
    userData.email === "fake email" &&
    userData.password === "fake password"
  ) {
    return [401, [{ message: "Invalid email or password" }]];
  }
  if (
    userData.email === "fake@user.com" &&
    userData.password === "not fake password"
  ) {
    return [
      200,
      {
        user: {
          _id: "fakeid",
          email: "fake@user.com",
          name: "Fake user",
          userrole_id: "6244bb3ed1a505b9d1a5663c",
          createdAt: "2022-04-18T08:14:56.307Z",
          updatedAt: "2022-04-18T08:14:56.307Z",
          __v: 0,
        },
        sessionTtl: 86400,
        accessToken: "Bearer fake access token",
        refreshToken: "Bearer fake refresh token",
      },
    ];
  }

  return [401, [{ message: "Invalid email or password" }]];
});

const textResourses = getTextResourses(AppLanguageOptions.EN);

describe("login form tests", () => {
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);
  const initialStateNoUserStore: RootState = {
    user: {
      value: { user: null, tokens: null, loginError: null } as UserValue,
    },
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
    const store = mockStore(() => initialStateNoUserStore);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginFragment />
        </BrowserRouter>
      </Provider>
    );

    const logo = await screen.findByTestId("applogo");
    const appName = await screen.findByTestId("appName");
    const alert = await screen.findByTestId("loginAlert");
    const emailInput = await screen.findByTestId("emailInput");
    const passwordInput = await screen.findByTestId("passwordInput");
    const rememberEmailChkBox = await screen.findByTestId(
      "rememberEmailChckBox"
    );
    const loginBtn = await screen.findByTestId("loginBtn");
    const registerBtn = await screen.findByTestId("registerBtn");

    expect(logo).toBeInTheDocument();

    expect(appName).toBeInTheDocument();
    expect(appName).toBeVisible();
    expect(appName.textContent).toContain(textResourses.appName);

    expect(alert).toBeInTheDocument();
    expect(alert).not.toBeVisible();

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

  test("helper messages and alert message behavior check", async () => {
    const store = mockStore(() => initialStateNoUserStore);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginFragment />
        </BrowserRouter>
      </Provider>
    );

    //const emailInput = await screen.findByTestId("emailInput");
    const emailInput = await screen.findByLabelText("email");
    //const passwordInput = await screen.findByTestId("passwordInput");
    const passwordInput = await screen.findByLabelText("password");
    const loginBtn = await screen.findByTestId("loginBtn");
    const registerBtn = await screen.findByTestId("registerBtn");

    await userEvent.click(loginBtn);

    // alarm banner appeared with proper text
    const alert = await screen.findByText(
      textResourses.wrongLoginCredentialsMessage
    );
    expect(alert).toBeVisible();

    // input fields helper text appeared with proper text
    let emailInputHelper = await screen.findByText(
      textResourses.minOneCharEmailMessage
    );
    let passwordInputHelper = await screen.findByText(
      textResourses.minOneCharPasswordMessage
    );
    expect(emailInputHelper).toBeVisible();
    expect(passwordInputHelper).toBeVisible();
    // login button to be disablend and registered to be enabled as long as no
    // changes to inputs is done
    expect(loginBtn).toBeDisabled();
    expect(registerBtn).toBeEnabled();

    // helper text for email input and alert message should disappear
    await userEvent.click(emailInput);
    await userEvent.type(emailInput, "ag");
    await userEvent.click(passwordInput);
    expect(alert).not.toBeVisible();
    expect(alert.textContent).toBe("");
    expect(emailInputHelper).not.toBeInTheDocument();
    expect(passwordInputHelper).toBeVisible();
    expect(loginBtn).toBeEnabled();

    // clear inputs and submit emty form usin "Enter key"
    await userEvent.click(emailInput);
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "{enter}");
    emailInputHelper = await screen.findByText(
      textResourses.minOneCharEmailMessage
    );
    passwordInputHelper = await screen.findByText(
      textResourses.minOneCharPasswordMessage
    );
    expect(emailInputHelper).toBeVisible();
    expect(passwordInputHelper).toBeVisible();

    // helper text for password input and alert message should disappear
    await userEvent.click(passwordInput);
    await userEvent.type(passwordInput, "ag");
    await userEvent.click(emailInput);
    expect(alert).not.toBeVisible();
    expect(alert.textContent).toBe("");
    expect(passwordInputHelper).not.toBeInTheDocument();
    expect(emailInputHelper).toBeVisible();
    expect(loginBtn).toBeEnabled();
  });

  test("login integration test with wrong login data", async () => {
    render(
      <Provider store={realStore}>
        <BrowserRouter>
          <LoginFragment />
        </BrowserRouter>
      </Provider>
    );

    //const emailInput = await screen.findByTestId("emailInput");
    const emailInput = await screen.findByLabelText("email");
    //const passwordInput = await screen.findByTestId("passwordInput");
    const passwordInput = await screen.findByLabelText("password");
    const loginBtn = await screen.findByTestId("loginBtn");

    await userEvent.click(emailInput);
    await userEvent.type(emailInput, "fake email");
    await userEvent.click(passwordInput);
    await userEvent.type(passwordInput, "fake password");
    await userEvent.click(loginBtn);

    // waiting alarm banner appeared with proper text
    let alert = await screen.findByText(
      textResourses.successfulLoginSubmissionMessage
    );
    expect(alert).toBeVisible();
    await waitFor(() => {
      expect(mockAdapter.history.post[0].data).toBe(
        JSON.stringify({ email: "fake email", password: "fake password" })
      );
    });
    // wrong email password alarm banner appeared with proper text
    alert = await screen.findByText(textResourses.wrongUserNamePasswordMessage);
    expect(alert).toBeVisible();
  });

  test("register button test", async () => {
    const store = mockStore(() => initialStateNoUserStore);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginFragment />
        </BrowserRouter>
      </Provider>
    );

    const registerBtn = await screen.findByTestId("registerBtn");
    await userEvent.click(registerBtn);

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/register");
  });

  test("login integration test with correct login data", async () => {
    render(
      <Provider store={realStore}>
        <BrowserRouter>
          <LoginFragment />
        </BrowserRouter>
      </Provider>
    );

    //const emailInput = await screen.findByTestId("emailInput");
    const emailInput = await screen.findByLabelText("email");
    //const passwordInput = await screen.findByTestId("passwordInput");
    const passwordInput = await screen.findByLabelText("password");
    const loginBtn = await screen.findByTestId("loginBtn");

    await userEvent.click(emailInput);
    await userEvent.type(emailInput, "fake@user.com");
    await userEvent.click(passwordInput);
    await userEvent.type(passwordInput, "not fake password");
    await userEvent.click(loginBtn);

    // waiting alarm banner appeared with proper text
    let alert = await screen.findByText(
      textResourses.successfulLoginSubmissionMessage
    );
    expect(alert).toBeVisible();
    await waitFor(() => {
      expect(mockAdapter.history.post[1].data).toBe(
        JSON.stringify({
          email: "fake@user.com",
          password: "not fake password",
        })
      );
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/fake");
    });
  });
});
