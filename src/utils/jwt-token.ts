import * as jose from "jose";
import { Role } from "../generated/prisma/client";

const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

export interface Payload extends jose.JWTPayload {
  email: string;
  userId: string;
  tenantId: string;
  expiresIn?: number;
  roles?: Role[];
}

export class JwtService {
  /**
   * Generate an access token (short-lived)
   */
  static async sign(payload: Payload): Promise<string> {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("codeverse:issuer")
      .setAudience("codeverse:user")
      .setExpirationTime("15m")
      .sign(accessSecret);
  }

  /**
   * Verify an access token
   */
  static async verify(token: string): Promise<Payload> {
    const { payload } = await jose.jwtVerify(token, accessSecret, {
      issuer: "codeverse:issuer",
      audience: "codeverse:user",
    });
    return payload as Payload;
  }

  /**
   * Generate a refresh token (long-lived)
   */
  static async refresh(
    payload: Pick<Payload, "userId" | "email">
  ): Promise<string> {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("codeverse:issuer")
      .setAudience("codeverse:refresh")
      .setExpirationTime("7d")
      .sign(refreshSecret);
  }

  /**
   * Verify a refresh token
   */
  static async refreshVerify(token: string): Promise<Payload> {
    const { payload } = await jose.jwtVerify(token, refreshSecret, {
      issuer: "codeverse:issuer",
      audience: "codeverse:refresh",
    });
    return payload as Payload;
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
