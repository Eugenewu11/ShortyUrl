import { z } from "zod";

// Esquema para registro
export const signUpSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }), 
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
});

// Esquema para login
export const signInSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});