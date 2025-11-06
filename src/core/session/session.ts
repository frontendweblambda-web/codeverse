import "server-only";
import { JwtService, Payload } from "@/src/utils/jwt-token";
import { cookies } from "next/headers";
import { appConfig } from "../config";

/**
 * Generate session
 * @param payload
 */
export const session = async (payload: Payload) => {
  // Access token lifetime (15 minutes)
  const accessTokenTTL = 15 * 60; // seconds
  const token = await JwtService.signAccessToken({
    ...payload,
    expiresIn: "15m",
  });

  const cookieStore = await cookies();
  // access token
  cookieStore.set({
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    name: appConfig.accessSessionKey,
    value: token,
    maxAge: accessTokenTTL,
  });

  return token;
};

/**
 * Get user session
 * @returns
 */
export const getSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(appConfig.accessSessionKey)?.value;
  if (!token) return null;

  const verified = await JwtService.verifyAccessToken(token!);
  if (!verified.valid || verified.expired) return null;

  return verified;
};
