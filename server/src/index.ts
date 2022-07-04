import log from "./utils/logger";
import checkKeyPair from './utils/checkKeyPair'

// the purpose of this function is to call app modules import and the app itself only
// after keys are checked / generated 
const systemStart = async () => {
  //import modules 
  const getEnvVars = (await import("./config/config")).default;
  const app = (await import("./app")).default;
  const dbConnect = (await import("./utils/dbConnect")).default;

  // connect database and check default entities
  dbConnect();

  // getting environmental variables
  const { host, port, prodMode } = getEnvVars();

  // console info if production mode
  if(prodMode) {
    log.info("Production Mode is ON")
  }

  // starting api listener
  app.listen(port, host, () => {
    log.info(`Server is listening at http://${host}:${port}`);
  });
};

// checking keys and generating key pair when it is necessary
const keysAreOk = checkKeyPair()
if (keysAreOk) {
  log.info("Encryption keys are OK");
  systemStart()
} else {
    log.error('Encryptions keys are currupted. Check the database before deleting/replacing them!')
    process.exit(1)
}
