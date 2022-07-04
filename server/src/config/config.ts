import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const getEnvVars = (): {
  host: string;
  port: number;
  dbUri: string;
  dbName: string;
  testDbName: string;
  saltWorkFactor: number;
  accessTokenTtl: number;
  refreshTokenTtl: number;
  privKey: string;
  pubKey: string;
  prodMode: boolean
} => {
  // TODO 01: implement environmental vars read depending on the app startup mode,
  // error handler reading param
  // temporarily only dev vars are read
  const devHost = process.env.DEV_HOST as string;
  const devPort = Number(process.env.DEV_PORT);
  const prodHost = process.env.PROD_HOST as string;
  const prodPort = Number(process.env.PROD_PORT);
  const nodeProdMode = process.env.APP_MODE as string;
  let dbUri = process.env.DB_URI_DEV as string;
  const dbName = process.env.DB_NAME_DEV as string;
  const testDbName = process.env.DB_NAME_TESTS as string;
  const saltWorkFactor = Number(process.env.SALT_WORK_FACTOR);
  const accessTokenTtl = Number(process.env.ACCESS_TOKEN_TTL);
  const refreshTokenTtl = Number(process.env.REFRESH_TOKEN_TTL);
  const keysFolder = path.join(__dirname, "..", "..", "keys");
  const privKey = fs.readFileSync(
    path.join(keysFolder, "id_rsa_priv.pem"),
    "utf8"
  ) as string;
  const pubKey = fs.readFileSync(
    path.join(keysFolder, "id_rsa_pub.pem"),
    "utf8"
  ) as string;

  const dockerEnvironment = process.env.NODE_ENV;
  const dockerProdEnvironment = process.env.MODE_ENV;
  if (
    dockerEnvironment === "docker" &&
    dockerProdEnvironment !== "docker_prod"
  ) {
    dbUri = process.env.DB_URI_DOCKER as string;
  }
  if (
    dockerEnvironment === "docker" &&
    dockerProdEnvironment == "docker_prod"
  ) {
    dbUri = process.env.DB_URI_DOCKER_PROD as string;
  }

  let host = devHost
  let port = devPort

  if (dockerProdEnvironment === "docker_prod" || nodeProdMode === "PROD") {
    host = prodHost;
    port = prodPort;
  }

    return {
      host: host,
      port: port,
      dbUri: dbUri,
      dbName: dbName,
      testDbName: testDbName,
      saltWorkFactor: saltWorkFactor,
      accessTokenTtl: accessTokenTtl,
      refreshTokenTtl: refreshTokenTtl,
      privKey: privKey,
      pubKey: pubKey,
      prodMode:
        dockerProdEnvironment === "docker_prod" || nodeProdMode === "PROD",
    };
};

export default getEnvVars;
