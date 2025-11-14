//Conexion a base de datos en la nube Neon junto con los esquemas de Drizzle
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

//Configuracion de path de las variables de entorno
config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql,{ schema });

/*
Notas de estudio:

Drizzle: Usa .env
Better-Auth: Usa .env.local

Si ambos hash "BETTER_AUTH_SECRET" no coinciden no se podra iniciar sesion porque sus hash no coinciden
en el momento que fueron creados
*/