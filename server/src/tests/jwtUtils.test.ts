import {signJwt, decodeJwt, DecodedItem} from '../utils/jwt.utils'

import getEnvVars from '../config/config'

const {accessTokenTtl, refreshTokenTtl} = getEnvVars()

const testPayload = {
    userId: "some unique user id",
    sessionId: "even more unique session id"
} 


describe("JWT coding and decoding utils tests", () => {
    test("Normal JWT token generation and decoding", () => {
        
        const accesToken = signJwt(testPayload.userId, testPayload.sessionId, "accessKey")
        const refreshToken = signJwt(testPayload.userId, testPayload.sessionId, "refreshKey")

        const decodedAccessToken = decodeJwt(accesToken)
        const decodedRefreshToken = decodeJwt(refreshToken)

        expect(decodedAccessToken).toBeTruthy()
        expect(decodedRefreshToken).toBeTruthy()
        expect(decodedAccessToken?.userId).toBe(testPayload.userId)
        expect(decodedRefreshToken?.userId).toBe(testPayload.userId);
        expect(decodedAccessToken?.sessionId).toBe(testPayload.sessionId);
        expect(decodedRefreshToken?.sessionId).toBe(testPayload.sessionId);

        let accessTokenCalcTtl
        let refreshTokenCalcTtl
        
        if (decodedAccessToken && decodedRefreshToken) {
            accessTokenCalcTtl = decodedAccessToken.exp - decodedAccessToken.iat
            refreshTokenCalcTtl = decodedRefreshToken.exp - decodedRefreshToken.iat
        }

        expect(accessTokenCalcTtl).toBe(accessTokenTtl)
        expect(refreshTokenCalcTtl).toBe(refreshTokenTtl)
    })

    test("Expired JWT token generation and decoding", () => {

    })

    test("Currupted JWT token generation and decoding", () => {

    })

})