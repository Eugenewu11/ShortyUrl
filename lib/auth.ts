import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/drizzle";
import { nextCookies } from "better-auth/next-js";

//Configuracion de Better Auth

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    redirectURL: "/dashboard",
  },
  database: drizzleAdapter(db, {
    provider: "pg", 
  }),
  plugins: [nextCookies()], 
});