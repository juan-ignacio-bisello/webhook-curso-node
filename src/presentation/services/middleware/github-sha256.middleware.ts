import { NextFunction, Request, Response } from "express";
import { envs } from "../../../config";

export class GithubSha256Middleware {

    public static encoder = new TextEncoder();

    static async verifyGithubSignature(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const signature = req.headers['x-hub-signature-256'] as string | undefined;

            if (!signature) {
                return res.status(401).json({ error: "Missing x-hub-signature-256" });
            }

            const body = JSON.stringify(req.body);
            const secret = envs.SECRET_TOKEN;

            const isValid = await GithubSha256Middleware.verifySignature(
                secret,
                signature,
                body
            );

            if (!isValid) {
                return res.status(401).json({ error: "Invalid signature" });
            }

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal verification error" });
        }
    }

    private static async verifySignature(secret: string, header: string, payload: string) {
        try {
            const parts = header.split("=");
            const sigHex = parts[1];

            const algorithm = { name: "HMAC", hash: { name: "SHA-256" } };
            const keyBytes = GithubSha256Middleware.encoder.encode(secret);

            const key = await crypto.subtle.importKey(
                "raw",
                keyBytes,
                algorithm,
                false,
                ["sign", "verify"]
            );

            const sigBytes = GithubSha256Middleware.hexToBytes(sigHex);
            const payloadBytes = GithubSha256Middleware.encoder.encode(payload);

            const equals = await crypto.subtle.verify(
                algorithm.name,
                key,
                sigBytes,
                payloadBytes
            );

            return equals;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    private static hexToBytes(hex: string) {
        const len = hex.length / 2;
        const bytes = new Uint8Array(len);

        for (let i = 0, j = 0; i < hex.length; i += 2, j++) {
            bytes[j] = parseInt(hex.substr(i, 2), 16);
        }

        return bytes;
    }
}
