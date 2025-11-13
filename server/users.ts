"use server"

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { redirect } from "next/navigation";
import { signUpSchema, signInSchema } from "@/app/schemas/auth.schemas"

// Types for form state
type FormState = {
  success?: boolean;
  error?: string;
};

//Registro
export async function signUpAction(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const validated = signUpSchema.safeParse({ email, password, name });
  if (!validated.success) {
    return { error: "Datos inválidos" };
  }

  try {
    await auth.api.signUpEmail({ body: validated.data });
    return { success: true };
  } catch (error: any) {
    return { error: "No se pudo crear la cuenta" };
  }
}

//Login
export async function signInAction(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validated = signInSchema.safeParse({ email, password });
  if (!validated.success) {
    return { error: "Credenciales inválidas" };
  }

  try {
    await auth.api.signInEmail({ body: validated.data });
    // Return success state - the client will handle the redirect
    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    return { error: "Credenciales incorrectas" };
  }
}

// Cerrar sesion
export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect("/login");
  } catch (error) {
    console.error("Erro al cerrar sesion:", error);
    redirect("/dashboard?error=logout_failed");
  }
}