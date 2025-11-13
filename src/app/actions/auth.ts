"use server"

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {signUpSchema, signInSchema} from "@/app/schemas/auth.schemas"

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const validated = signUpSchema.safeParse({ email, password, name });
  if (!validated.success) {
    // Redirigir a register con error
    redirect("/register?error=invalid");
  }

  try {
    await auth.api.signUpEmail({
      body: validated.data,
    });
    //Si el registro es existoso redirigir al login
    redirect("/login?register=success");
  } catch (error: any) {
    console.error("Registro fallido:", error);
    redirect("/register?error=register_failed");
  }
}

//Login
export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validación con Zod
  const validated = signInSchema.safeParse({ email, password });
  if (!validated.success) {
    const error = validated.error.issues.map(issue => issue.message).join(', ');
    throw new Error(error || 'Credenciales inválidas');
  }

  try {
    await auth.api.signInEmail({
      body: validated.data,
    });
    redirect("/dashboard");
  } catch (error: any) {
    console.error("Login fallido:", error);
    throw new Error("Credenciales incorrectas");
  }
}

//Cerrar sesion
export async function signOutAction() {
  try {
    await auth.api.signOut({
        headers: await headers(),
    });
    redirect("/login");
  } catch (error) {
    console.error("Logout fallido:", error);
    throw new Error("No se pudo cerrar la sesión");
  }
}