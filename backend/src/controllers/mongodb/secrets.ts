import crypto from "node:crypto";

export class TokenSecretManager {
    private static oldSecret: Buffer | null = null;
    private static currentSecret: Buffer | null = null;
    private static nextRotation: number = Date.now();

    static getCurrent(): Buffer {
        if (Date.now() > TokenSecretManager.nextRotation || this.currentSecret === null) {
            TokenSecretManager.oldSecret = TokenSecretManager.currentSecret;
            TokenSecretManager.currentSecret = crypto.randomBytes(32);
            do {
                TokenSecretManager.nextRotation += (1000 * 60 * 60 * 24 * 90)
            } while (Date.now() > TokenSecretManager.nextRotation);
        }

        return TokenSecretManager.currentSecret!;
    }

    static getOld(): Buffer {
        if (Date.now() > TokenSecretManager.nextRotation || this.currentSecret === null) {
            TokenSecretManager.oldSecret = TokenSecretManager.currentSecret;
            TokenSecretManager.currentSecret = crypto.randomBytes(32);
            do {
                TokenSecretManager.nextRotation += (1000 * 60 * 60 * 24 * 90)
            } while (Date.now() > TokenSecretManager.nextRotation);
        }

        return TokenSecretManager.oldSecret ?? TokenSecretManager.currentSecret!;
    }
}
