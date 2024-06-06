import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "node:crypto";

export class TokenManager {
    private static oldSecret: Buffer | null = null;
    private static currentSecret: Buffer | null = null;
    private static nextRotation: number = Date.now();

    private static getCurrent(): Buffer {
        if (Date.now() > TokenManager.nextRotation || this.currentSecret === null) {
            TokenManager.oldSecret = TokenManager.currentSecret;
            TokenManager.currentSecret = crypto.randomBytes(32);
            do {
                TokenManager.nextRotation += (1000 * 60 * 60 * 24 * 90)
            } while (Date.now() > TokenManager.nextRotation);
        }

        return TokenManager.currentSecret!;
    }

    private static getOld(): Buffer {
        if (Date.now() > TokenManager.nextRotation || this.currentSecret === null) {
            TokenManager.oldSecret = TokenManager.currentSecret;
            TokenManager.currentSecret = crypto.randomBytes(32);
            do {
                TokenManager.nextRotation += (1000 * 60 * 60 * 24 * 90)
            } while (Date.now() > TokenManager.nextRotation);
        }

        return TokenManager.oldSecret ?? TokenManager.currentSecret!;
    }

    /**
     * Signs a JWT that contains the provided payload with the current secret.
     *
     * @param payload The payload of the token.
     * @returns The signed token.
     **/
    static sign(payload: string | JwtPayload): string {
        return jwt.sign(
            payload,
            TokenManager.getCurrent(),
            {
                expiresIn: "7d"
            }
        );
    }


    /**
     * Checks if the provided token string is a valid JWT.
     *
     * @param token The token to check.
     * @returns The payload of the token if it is valid, null otherwise.
     **/
    static verify(token: string): string | JwtPayload | null {
        try {
            return jwt.verify(token, TokenManager.getCurrent());
        } catch (error) {
            try {
                // Retry with the old secret to see if the token is valid from the old secret.
                return jwt.verify(token, TokenManager.getOld());
            } catch (error) {
                return null;
            }
        }
    }
}
