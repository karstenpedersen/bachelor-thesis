declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
    NODE_ENV: "development" | "production";

    // Admin user information
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;

    // CTF
    CTF_FLAG: string;
  }
}

