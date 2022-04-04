const SERVER_URL = "http://localhost";
const SERVER_PORT = 1337;
const USER_API = "/api/v1/user";
const ROLE_API = "/api/v1/role";
const OPTIONS = {
  headers: { "content-type": "application/json" },
};

const OPTIONS_WITH_TOKEN = (token: string) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
};

const getConfig = () => {
  return {
    userApiBaseUrl: `${SERVER_URL}:${SERVER_PORT}${USER_API}`,
    roleApiBaseUrl: `${SERVER_URL}:${SERVER_PORT}${ROLE_API}`,
    reqOptions: OPTIONS,
    reqOptionsToken: OPTIONS_WITH_TOKEN
  };
};

export default getConfig;
