import jwt from "jsonwebtoken";
import getEnvVars from "../config/config";

const {pubKey, privKey, accessTokenTtl, refreshTokenTtl} = getEnvVars()

export interface DecodedItem {
  userId: string;
  sessionId: string;
  tokenType: "accessKey" | "refreshKey";
  iat: number;
  exp: number;
}

export const signJwt = (
  userId: string,
  sessionId: string,
  tokenType: "accessKey" | "refreshKey",
  options?: jwt.SignOptions | undefined
) => {
  const ttl = tokenType === "accessKey" ? accessTokenTtl : refreshTokenTtl;
    
  const payloadObject = {
      userId: userId,
      sessionId: sessionId,
      tokenType: tokenType
  }

  return jwt.sign(payloadObject, privKey, {...options&&options, expiresIn: ttl, algorithm: "RS256"})
};

export const decodeJwt = (token: string) : DecodedItem | null => {
  try {
    return jwt.verify(token, pubKey as string) as DecodedItem
  } catch(e) {
    return null
  }
};
