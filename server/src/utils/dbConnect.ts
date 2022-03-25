import mongoose from "mongoose";
import log from "./logger";
import getEnvVars from "../config/config";
import checkCreateDefaultEntities from "./checkCreateDefaultEntities";

const dbConnect = async () => {
  const { dbUri, dbName } = getEnvVars();

  try {
    await mongoose.connect(dbUri, { dbName: dbName });
    log.info(`DB "${dbName}" is connected on the host ${dbUri}`);
    await checkCreateDefaultEntities();
  } catch (e: any) {
    log.error(`Could not connect DB with the error: ${e}`);
    process.exit(1);
  }
};

export default dbConnect;
