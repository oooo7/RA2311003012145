// config.ts
// Central configuration - reads from .env file
// This keeps sensitive data out of our code

import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  affordmedAPI: process.env.AFFORDMED_API!,
  clientID: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  email: process.env.EMAIL!,
  name: process.env.NAME!,
  rollNo: process.env.ROLL_NO!,
  accessCode: process.env.ACCESS_CODE!,
  authAPI: process.env.AUTH_API!,
  logAPI: process.env.LOG_API!,
};

export default config;