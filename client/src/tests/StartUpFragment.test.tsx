import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { render, screen, cleanup } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { BrowserRouter } from "react-router-dom";

import { RootState } from "../app/store";
import { AppLanguageOptions } from "../res/textResourcesFunction";
import StartUpFragment from "../components/fragments/StartUpFragment";
import getTextResourses from "../res/textResourcesFunction";
import { UserValue } from "../app/features/user.slice";

const textResourses = getTextResourses(AppLanguageOptions.EN);

describe("start up fragment tests", () => {
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
  test("visual components check", async () => {
    const store = mockStore(() => initialStateNoUserStore);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <StartUpFragment startUpActionsAreDone={false} />
        </BrowserRouter>
      </Provider>
    );

    const logo = await screen.findByTestId("applogo");
    const appName = await screen.findByTestId("appName");

    expect(logo).toBeInTheDocument();

    expect(appName).toBeInTheDocument();
    expect(appName).toBeVisible();
    expect(appName.textContent).toContain(textResourses.appName);
  });
});
