import SessionModel, {
  SessionDocument,
  SessionInput,
} from "../models/session.model";

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
