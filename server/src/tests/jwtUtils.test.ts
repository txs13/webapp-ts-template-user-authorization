import jwt from "jsonwebtoken";
import { signJwt, decodeJwt, DecodedItem } from "../utils/jwt.utils";

import getEnvVars from "../config/config";

const { privKey, accessTokenTtl, refreshTokenTtl } = getEnvVars();

const wrongToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzb21lIHVuaXF1ZSB1c2VyIGlkIiwic2Vzc2lvbklkIjoiZXZlbiBtb3JlIHVuaXF1ZSBzZXNzaW9uIGlkIiwiZXhwIjoiMTUxNjI0OTAyMiIsImlhdCI6MTUxNjIzOTAyMn0.I4PxR_7mqUbyM6QXvvlK6d-DehmJGHFIAMUqS77bWII";

const testPayload = {
  userId: "some unique user id",
  sessionId: "even more unique session id",
};

describe("JWT coding and decoding utils tests", () => {
  test("Normal JWT token generation and decoding", () => {
    const accesToken = signJwt(
      testPayload.userId,
      testPayload.sessionId,
      "accessKey"
    );
    const refreshToken = signJwt(
      testPayload.userId,
      testPayload.sessionId,
      "refreshKey"
    );

    const decodedAccessToken = decodeJwt(accesToken);
    const decodedRefreshToken = decodeJwt(refreshToken);

    expect(decodedAccessToken).toBeTruthy();
    expect(decodedRefreshToken).toBeTruthy();
    expect(decodedAccessToken?.userId).toBe(testPayload.userId);
    expect(decodedRefreshToken?.userId).toBe(testPayload.userId);
    expect(decodedAccessToken?.sessionId).toBe(testPayload.sessionId);
    expect(decodedRefreshToken?.sessionId).toBe(testPayload.sessionId);
    expect(decodedRefreshToken?.tokenType).toBe("refreshKey");
    expect(decodedAccessToken?.tokenType).toBe("accessKey");

    let accessTokenCalcTtl;
    let refreshTokenCalcTtl;

    if (decodedAccessToken && decodedRefreshToken) {
      accessTokenCalcTtl = decodedAccessToken.exp - decodedAccessToken.iat;
      refreshTokenCalcTtl = decodedRefreshToken.exp - decodedRefreshToken.iat;
    }

    expect(accessTokenCalcTtl).toBe(accessTokenTtl);
    expect(refreshTokenCalcTtl).toBe(refreshTokenTtl);
  });

  test("Expired JWT token generation and decoding", () => {
    const expiredToken = jwt.sign(testPayload, privKey, {
      expiresIn: -1000,
      algorithm: "RS256",
    });
    const decoded = decodeJwt(expiredToken);
    expect(decoded).toBeNull();
  });

  test("Currupted JWT token generation and decoding", () => {
    const decoded = decodeJwt(wrongToken);
    expect(decoded).toBeNull();
  });
});
