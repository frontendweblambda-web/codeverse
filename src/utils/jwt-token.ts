import * as jose from "jose";
import { Role } from "../generated/prisma/client";
import { appConfig } from "../core/config";

const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

export interface Payload extends jose.JWTPayload {
  email: string;
  userId: string;
  tenantId: string;
  expiresIn?: number;
  token_type?: "access" | "refresh";
  roles?: { name: string; permissions: string[] }[];
}

/**
 * Safe decode result type.
 */
export type VerifiedToken = {
  valid: boolean;
  expired: boolean;
  payload?: Payload;
  error?: string;
};

export class JwtService {
  /**
   * Generate an access token (short-lived)
   */
  static async signAccessToken(payload: Payload): Promise<string> {
    try {
      const now = Math.floor(Date.now() / 1000); // current time in seconds
      // If payload.expiresIn is duration in seconds, calculate exact exp
      const exp = now + appConfig.accessTokenTTL;
      return await new jose.SignJWT({
        ...payload,
        token_type: "access",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer(appConfig.issuer)
        .setAudience(appConfig.audience)
        .setExpirationTime(exp)
        .sign(accessSecret);
    } catch (error) {
      console.log("signAccessToken", error);
      throw error;
    }
  }

  /**
   * Generate a refresh token (long-lived)
   */
  static async signRefreshToken(
    payload: Pick<Payload, "userId" | "email">
  ): Promise<string> {
    try {
      const now = Math.floor(Date.now() / 1000); // current time in seconds
      const exp = now + appConfig.refreshTokenTTL;
      return await new jose.SignJWT({
        ...payload,
        token_type: "refresh",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer(appConfig.issuer)
        .setAudience(appConfig.audienceRefresh)
        .setExpirationTime(exp)
        .sign(refreshSecret);
    } catch (error) {
      console.log("signRefreshToken", error);
      throw error;
    }
  }

  /**
   * Verify an access token
   */
  static async verifyAccessToken(token: string): Promise<VerifiedToken> {
    try {
      const { payload } = await jose.jwtVerify(token, accessSecret, {
        issuer: appConfig.issuer,
        audience: appConfig.audience,
      });

      if (payload.token_type !== "access") {
        throw new Error("Invalid token type");
      }

      return { valid: true, expired: false, payload: payload as Payload };
    } catch (error: any) {
      return {
        valid: false,
        expired: error.code === "ERR_JWT_EXPIRED",
        error: error.message,
      };
    }
  }

  /**
   * Verify a refresh token
   */
  static async verifyRefreshToken(token: string): Promise<VerifiedToken> {
    try {
      const { payload } = await jose.jwtVerify(token, refreshSecret, {
        issuer: appConfig.issuer,
        audience: appConfig.audienceRefresh,
      });

      if (payload.token_type !== "refresh") {
        throw new Error("Invalid token type");
      }

      return { valid: true, expired: false, payload: payload as Payload };
    } catch (error: any) {
      return {
        valid: false,
        expired: error.code === "ERR_JWT_EXPIRED",
        error: error.message,
      };
    }
  }

  /**
   * Decode a token (without verifying)
   */
  static async decodeToken(token: string): Promise<Payload | null> {
    try {
      const payload = jose.decodeJwt(token) as Payload;
      return payload;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }
}
