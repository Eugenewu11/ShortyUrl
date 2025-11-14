"use server";

import { ShortyService } from "./shortyService";
import { getSession } from "./auth-utils";
import { cookies } from "next/headers";

/*
  // Importaciones para la base de datos
  import { db } from '../db/drizzle';
  import { links } from '../db/schema';
  import { nanoid } from 'nanoid';
  import { and, eq } from 'drizzle-orm';
*/

/** 
  Crea un nuevo enlace corto a partir de una URL larga.
  Verifica la sesión del usuario y valida la URL antes de crear el enlace. 
  @param formData - Datos del formulario que deben incluir 'urlOriginal'
  @returns Objeto con el resultado de la operación
 */
export async function createShortLinkAction(formData: FormData) {
  try {
    const urlOriginal = formData.get("urlOriginal") as string;
    
    if (!urlOriginal) {
      return { success: false, error: "URL es requerida" };
    }

    console.log(" [link-actions] Creando enlace para URL:", urlOriginal);

    // Obtener sesión del usuario
    const session = await getSession();
    
    //Debug
    console.log(" [link-actions] Información de sesión:", {
      userId: session?.user?.id,
      isAuthenticated: !!session?.user
    });

    //Debug
    if (!session?.user?.id) {
      console.log(" [link-actions] Usuario no autenticado");
      return { success: false, error: "No autorizado: Usuario no autenticado" };
    }

    // Crear el enlace corto
    console.log(" [link-actions] Creando enlace acortado");
    const { slug, shortUrl } = await ShortyService.crearShortLink(urlOriginal, session.user.id);
    
    return { 
      success: true, 
      data: { 
        slug, 
        shortUrl,
        urlOriginal
      },
      message: 'Enlace creado exitosamente' 
    };
  } catch (error) {
    console.error("Error en createShortLinkAction:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al crear el enlace";
    return { success: false, error: errorMessage };
  }
}

/*
  Obtiene todos los enlaces del usuario actual
  @returns Array de enlaces del usuario o array vacío si no hay sesión
 */
export async function getUserLinksAction() {
  const session = await getSession();
  
  //Debug
  console.log(" [link-actions] Información de sesión:", {
    userId: session?.user?.id,
    isAuthenticated: !!session?.user
  });

  if (!session?.user) return [];

  return await ShortyService.getUserLinks(session.user.id);
}

/*
  Incrementa el contador de clics para un enlace específico
  @param slug - Identificador corto del enlace
  @returns Objeto indicando si la operación fue exitosa
 */
export async function incrementClicksAction(slug: string) {
  return await ShortyService.incrementarClicksYRedireccion(slug);
}