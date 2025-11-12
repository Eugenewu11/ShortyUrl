import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});