import { FilterQuery } from 'mongoose'
import SessionModel, {
  SessionDocument,
  SessionInput,
} from "../models/session.model";

// create session record within the login procedure 
export const createSession = async (
  input: SessionInput
): Promise<SessionDocument> => {
  try {
    const newSession = await SessionModel.create(input);
    return newSession;
  } catch (e: any) {
    throw new Error(e);
  }
};

// get session by Id
export const getSessionById = async (
  sessionId: string
): Promise<SessionDocument> => {
  try {
    const dbSession = await SessionModel.findById(sessionId);
    if (dbSession) {
      return dbSession;
    } else {
      throw new Error("wrong session id");
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

// get session by filter
export const findSession = async(query: FilterQuery<SessionDocument>) => {
  try {
    return await SessionModel.findOne(query)
  } catch (e: any) {
    throw new Error(e);
  }
}