import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import log from "./logger";
import genKeyPair from "./generateKeys";

export const envDefaultContent =
  "DEV_HOST=localhost" +
  "\n" +
  "DEV_PORT=1337" +
  "\n" +
  "PROD_HOST=localhost" +
  "\n" +
  "PROD_PORT=1337" +
  "\n" +
  "DB_URI_DEV=mongodb://localhost:27017" +
  "\n" +
  "DB_URI_PROD=mongodb://localhost:27017" +
  "\n" +
  "DB_URI_DOCKER=mongodb://mongo:27017" +
  "\n" +
  "DB_URI_DOCKER_PROD=mongodb://mongo:27017" +
  "\n" +
  "DB_NAME_DEV=webapp-ts-template" +
  "\n" +
  "DB_NAME_TESTS=webapp-ts-template-test" +
  "\n" +
  "SALT_WORK_FACTOR=10" +
  "\n" +
  "ACCESS_TOKEN_TTL=900" +
  "\n" +
  "REFRESH_TOKEN_TTL=86400";

const checkKeyPair = (): boolean => {
  // check .env file and create it in case there is no one
  const envPath = path.join(__dirname, "..", "..", ".env");
  try {
    const file = fs.readFileSync(envPath);
    if (file) {
      log.info(".env file is in place");
    } else {
      log.error(
        "Something is wrong with your .env file - please check manualy"
      );
    }
  } catch (e: any) {
    try {
      fs.writeFileSync(envPath, envDefaultContent);
      log.info("New .env file is generated with default values");
    } catch (e: any) {
      log.error(
        "Something is wrong with your .env file - please check manualy"
      );
    }
  }

  let pubKey: null | string;
  let privKey: null | string;

  // getting and checking keys folder path
  const keysFolder = path.join(__dirname, "..", "..", "keys");
  if (!fs.existsSync(keysFolder)) {
    fs.mkdirSync(keysFolder);
    log.info("keys folder does not exist, new keys dir is created");
  }

  // trying to read publick key
  try {
    pubKey = fs.readFileSync(path.join(keysFolder, "id_rsa_pub.pem"), "utf8");
  } catch {
    pubKey = null;
    log.info("Public key is not found");
  }

  try {
    privKey = fs.readFileSync(path.join(keysFolder, "id_rsa_priv.pem"), "utf8");
  } catch {
    privKey = null;
    log.info("Private key is not found");
  }

  if (!pubKey && !privKey) {
    genKeyPair();
    pubKey = fs.readFileSync(path.join(keysFolder, "id_rsa_pub.pem"), "utf8");
    privKey = fs.readFileSync(path.join(keysFolder, "id_rsa_priv.pem"), "utf8");
    log.info("New encryption keys are generated");
  } else if (!pubKey || !privKey) {
    return false;
  }

  // checking keys integrity - we encrypt, then decrypt the payload and check data integrity
  interface TestPayload {
    data: string;
  }
  const payload: TestPayload = { data: "very important data" };
  let token: string;
  let decodedPayload: TestPayload;

  try {
    token = jwt.sign(payload, privKey as string, { algorithm: "RS256" });
  } catch {
    log.error("Private key is corrupted");
    return false;
  }

  try {
    decodedPayload = jwt.verify(token, pubKey as string) as TestPayload;
    if (payload.data === decodedPayload.data) {
      return true;
    } else {
      return false;
    }
  } catch {
    log.error("Public key is corrupted");
    return false;
  }
};

export default checkKeyPair;
