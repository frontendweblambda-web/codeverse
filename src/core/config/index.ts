export const appConfig = {
  root: "/",
  sidebarWidth: "250px",

  // session settings
  issuer: "codeverse",
  audience: "codeverse-client",
  audienceRefresh: "codeverse-refresh-client",

  // session name
  cookieSettings: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
  accessSessionKey: "access_token",
  refreshSessionKey: "refresh_token",

  // upload image
  maxImageSize: 1 * 1024 * 1024, // 1 MB
  maxImages: 5,

  // device id
  deviceIdKey: "codeverse_id",

  // 🧩 Client behavior toggles
  useClientLogout: process.env.NEXT_PUBLIC_USE_CLIENT_LOGOUT === "true",
};
