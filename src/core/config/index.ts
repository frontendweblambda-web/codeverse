export const appConfig = {
  root: "/",
  sidebarWidth: "250px",

  // session settings
  issuer: "codeverse",
  audience: "codeverse-client",
  audienceRefresh: "codeverse-refresh-client",

  // session name
  beforeExpiration: 5 * 60,
  refreshTokenTTL: 7 * 24 * 60 * 60, // 7 days in seconds
  accessTokenTTL: 15 * 60, // 15 minutes in seconds
  accessSessionKey: "access_token",
  refreshSessionKey: "refresh_token",
  cookieSettings: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },

  // upload image
  maxImageSize: 1 * 1024 * 1024, // 1 MB
  maxImages: 5,

  // device id
  deviceIdKey: "codeverse_id",

  // 🧩 Client behavior toggles
  useClientLogout: process.env.NEXT_PUBLIC_USE_CLIENT_LOGOUT === "true",
};
