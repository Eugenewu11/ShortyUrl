import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./dbConfig";
import { nextCookies } from "better-auth/next-js";

//Configuracion de Better Auth

export const auth = betterAuth({
  adapter: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
    redirectURL: "/dashboard",
  },
  plugins: [nextCookies()], 
});