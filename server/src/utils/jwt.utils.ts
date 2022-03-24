import jwt from "jsonwebtoken";
import getEnvVars from "../config/config";

const {pubKey, privKey, accessTokenTtl, refreshTokenTtl} = getEnvVars()

export const signJwt = (
  userId: string,
  sessionId: string,
  tokenType: "accessKey" | "refreshKey",
  options?: jwt.SignOptions | undefined
) => {
  const ttl = tokenType === "accessKey" ? accessTokenTtl : refreshTokenTtl;
    
  const payloadObject = {
      userId: userId,
      sessionId: sessionId
  }

  return jwt.sign(payloadObject, privKey, {...options&&options, expiresIn: ttl, algorithm: "RS256"})
};

export const verifyJwt = (token: string, tokenType: "accessKey" | "refreshKey") => {

};
