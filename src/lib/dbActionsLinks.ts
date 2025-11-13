"use server";

//Select, Insert y Update entre cliente y servidor para los links

import { auth } from "@/lib/auth";
import { db } from "@/lib/dbConfig";
import { links } from "@/../drizzle/schema";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { cookies, headers } from "next/headers";
import { eq, sql } from "drizzle-orm";

//Insert del link
export async function createLinkAction(formData: FormData) {
  const urlOriginal = formData.get("urlOriginal") as string;
  const urlCortado = (formData.get("urlCortado") as string | null)?.trim();

  const cookieStore = await cookies();
  const authCookie = cookieStore.get("better-auth.session")?.value;
  if (!authCookie) throw new Error("No autorizado: No se encontró la cookie de sesión");

  const sesion = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session=${authCookie}`,
    },
  } as any);

  if (!sesion?.user) throw new Error("No autorizado");

  const slug = urlCortado || nanoid(6);

  try {
    await db.insert(links).values({
      id: nanoid(),
      urlOriginal,
      urlCortado: slug,
      userId: sesion.user.id,
      createdAt: new Date(),
    });
    redirect("/dashboard");
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("El enlace corto ya existe");
    }
    throw new Error("Error al crear el enlace");
  }
}

//Select de los links creados
export async function getMyLinks() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: Object.fromEntries(reqHeaders.entries()) as any,
  });
  if (!session?.user) return [];

  return await db
    .select()
    .from(links)
    .where(eq(links.userId, session.user.id))
    .orderBy(sql`${links.createdAt} DESC`);
}

//Delete de links (Implementacion opcional)
export async function deleteLinkAction(formData: FormData) {
  const id = formData.get("id") as string;
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: Object.fromEntries(reqHeaders.entries()) as any,
  });
  if (!session?.user) throw new Error("No autorizado");

  await db
    .delete(links)
    .where(sql`${links.id} = ${id} AND ${links.userId} = ${session.user.id}`);
}

//Update de clicks que aumentara cada vez que se visite la pagina
export async function incrementClicks(slug: string) {
  await db
    .update(links)
    .set({ clicks: sql`${links.clicks} + 1` })
    .where(eq(links.urlCortado, slug));
}