import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const getEnvVars = (): {
  host: string;
  port: number;
  dbUri: string;
  dbName: string;
  saltWorkFactor: number;
  accessTokenTtl: number;
  refreshTokenTtl: number;
  privKey: string;
  pubKey: string;
} => {
  // TODO 01: implement environmental vars read depending on the app startup mode,
  // error handler reading param
  // temporarily only dev vars are read
  const devHost = process.env.HOST as string;
  const devPort = Number(process.env.PORT);
  const dbUri = process.env.DB_URI_DEV as string;
  const dbName = process.env.DB_NAME_DEV as string;
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

  return {
    host: devHost,
    port: devPort,
    dbUri: dbUri,
    dbName: dbName,
    saltWorkFactor: saltWorkFactor,
    accessTokenTtl: accessTokenTtl,
    refreshTokenTtl: refreshTokenTtl,
    privKey: privKey,
    pubKey: pubKey,
  };
};

export default getEnvVars;
