import mongoose, { Types } from "mongoose";

// data type and DB schema for the session tokens history input
export interface SessionAccessTokenInput {
  tokenType: "loginAccessToken" | "refreshAccessToken";
  tokenTTL: number;
}
const SessionAccessTokenSchema =
  new mongoose.Schema<SessionAccessTokenDocument>(
    {
      tokenType: { type: String, required: true },
      tokenTTL: { type: Number, required: true },
    },
    {
      timestamps: true,
    }
  );
export interface SessionAccessTokenDocument
  extends SessionAccessTokenInput,
    mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
const SessionAccessTokenModel = mongoose.model<SessionAccessTokenDocument>(
  "SessionAccessToken",
  SessionAccessTokenSchema
);

// data type and DB schema for the session actions history input
export interface SessionActionInput {
  apiRoute: string;
  apiMethod: string;
  successful: boolean;
}

const SessionActionSchema = new mongoose.Schema<SessionActionDocument>(
  {
    apiRoute: { type: String, required: true },
    apiMethod: { type: String, required: true },
    successful: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);
export interface SessionActionDocument
  extends SessionActionInput,
    mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
const SessionActionModel = mongoose.model<SessionActionDocument>(
  "SessionAction",
  SessionActionSchema
);

// data type, DB schema for the session creation / input
export interface SessionInput {
  userId: Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  sessionTTL: number;
}
const SessionSchema = new mongoose.Schema<SessionDocument>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    sessionTTL: { type: Number, required: true },
    closedAt: { type: Date },
    accessTokens: [SessionAccessTokenSchema],
    userActions: [SessionActionSchema],
  },
  {
    timestamps: true,
  }
);
export interface SessionDocument extends SessionInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date;
  accessTokens: [SessionAccessTokenDocument];
  userActions: [SessionActionDocument];
  addToken(
    tokenType: "loginAccessToken" | "refreshAccessToken",
    tokenTTL: number
  ): void;
  addUserAction(apiRoute: string, apiMethod: string, successful: boolean): void;
}

// method to add issued access token records
SessionSchema.methods.addToken = function (
  tokenType: "loginAccessToken" | "refreshAccessToken",
  tokenTTL: number
) {
  const session = this as SessionDocument;
  const newTokenRecord = new SessionAccessTokenModel({
    tokenType,
    tokenTTL,
  } as SessionAccessTokenInput);
  session.accessTokens.push(newTokenRecord);
};

//method to add user action record
SessionSchema.methods.addUserAction = function (
  apiRoute: string,
  apiMethod: string,
  successful: boolean
) {
  const session = this as SessionDocument;
  const newUserActionRecord = new SessionActionModel({
    apiRoute,
    apiMethod,
    successful,
  } as SessionActionInput);
  session.userActions.push(newUserActionRecord);
};

const SessionModel = mongoose.model<SessionDocument>("Session", SessionSchema);

export default SessionModel;
