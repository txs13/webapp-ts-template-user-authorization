import app from "./app";
import log from "./utils/logger";
import checkKeyPair from './utils/checkKeyPair'
import getEnvVars from "./config/config";
import dbConnect from "./utils/dbConnect";

import SessionModel from './models/session.model'

// connect database
dbConnect()

// checking keys and generating key pair when it is necessary
const keysAreOk = checkKeyPair()
if (keysAreOk) {
    log.info('Encryption keys are OK')
} else {
    log.error('Encryptions keys are currupted. Check the database before deleting/replacing them!')
    process.exit(1)
}

// checking default admin user, generates when it is necessary
// TODO 02: checking default admin, generate when it is necessary


// getting environmental variables
const { host, port } = getEnvVars();

// starting api listener
app.listen(port, host, () => {
  log.info(`Server is listening at http://${host}:${port}`);
});
