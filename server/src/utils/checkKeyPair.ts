import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import log from "./logger";
import genKeyPair from "./generateKeys";

const checkKeyPair = (): boolean => {
  let pubKey: null | string;
  let privKey: null | string;

  // getting and checking keys folder path
  const keysFolder = path.join(__dirname, "..", "..", "keys");
  if (!fs.existsSync(keysFolder)) {
    log.error("keys folder does not exist, please create one");
    return false;
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

// TODO 03: check that keys match database - using known default admin credentials 



export default checkKeyPair;
