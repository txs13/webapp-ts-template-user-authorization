import { UserInput } from "../../interfaces/inputInterfaces";
import { registerApi } from '../../api/api'
import store from "../store";
import getTextResources from "../../res/textResourcesFunction";

const currentState = store.getState();

const { userExistsRegisterMessage, wrongUserDataRegisterMessage } =
  getTextResources(currentState.appSettings.value.language);

export const registerUser = async (userInput: UserInput) => {
    const response = await registerApi(userInput)
    if (response?.success) {
        return null
    }
    if (!response?.success) {
        if (response?.errorMessage === "this email is already registered") {
            return userExistsRegisterMessage;
        }
          return wrongUserDataRegisterMessage;
    }
}