// global.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;

    // Optional: Add others as needed
    DATABASE_URL: string;
    NEXTAUTH_SECRET?: string;
    NEXT_PUBLIC_API_URL?: string;
  }
}
