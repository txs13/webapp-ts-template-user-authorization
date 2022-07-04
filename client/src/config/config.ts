const SERVER_URL = "http://localhost";
const DOCKER_SERVER_PROD_URL = "http://localhost";
const SERVER_PORT = 1337;
const USER_API = "/api/v1/user";
const ROLE_API = "/api/v1/role";
const ALERT_MESSAGE_TIMEOUT = 5000;
const OPTIONS = {
  headers: { "Content-Type": "application/json" },
};

const OPTIONS_WITH_TOKEN = (token: string) => {
  return {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  };
};

const getConfig = () => {
    const dockerEnvironment = process.env.REACT_APP_DOCKER_MODE;
    if (dockerEnvironment === "DOCKER_PROD") {
      return {
        baseApiUrl: `${DOCKER_SERVER_PROD_URL}:${SERVER_PORT}`,
        userApi: `${USER_API}`,
        roleApi: `${ROLE_API}`,
        reqOptions: OPTIONS,
        reqOptionsToken: OPTIONS_WITH_TOKEN,
        messageTimeout: ALERT_MESSAGE_TIMEOUT,
      };      
    } else {
      return {
        baseApiUrl: `${SERVER_URL}:${SERVER_PORT}`,
        userApi: `${USER_API}`,
        roleApi: `${ROLE_API}`,
        reqOptions: OPTIONS,
        reqOptionsToken: OPTIONS_WITH_TOKEN,
        messageTimeout: ALERT_MESSAGE_TIMEOUT
      };
    }
};

export default getConfig;
