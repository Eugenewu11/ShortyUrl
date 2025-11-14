import { db } from '../db/drizzle';
import { links } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { sql } from 'drizzle-orm';

// Objeto que agrupa todas las funciones del servicio para CRUD de enlaces
export const ShortyService = {
  crearShortLink,
  incrementarClicksYRedireccion,
  getUserLinks
};

// Definir el tipo para los enlaces
export interface Link {
  id: string;
  urlCortado: string;
  urlOriginal: string;
  clicks: number | null;
  userId: string;
  createdAt: Date | null;
}

/**
    Crea un nuevo enlace corto a partir de una URL larga
    @param urlOriginal - La URL original que queremos acortar
    @param userId - ID del usuario que está creando el enlace
    @returns Objeto con el slug generado y la URL corta completa
 */
export async function crearShortLink(urlOriginal: string, userId: string): Promise<{ slug: string; shortUrl: string }> {
  // Validar que sea una URL válida
  let url: URL;
  try {
    url = new URL(urlOriginal);
  } catch (error) {
    throw new Error('URL inválida');
  }

  const urlNormalizado = url.toString();
  let slug: string;
  let existing: Link[] = [];
  
  // Generar un slug único
  do {
    slug = nanoid(7);
    existing = await db
      .select()
      .from(links)
      .where(eq(links.urlCortado, slug));
  } while (existing.length > 0);

  try {
    const [newLink] = await db.insert(links).values({
      id: nanoid(6),
      urlCortado: slug,
      urlOriginal: urlNormalizado,
      userId: userId,
      clicks: 0,
      createdAt: new Date(),
    }).returning();

    //Devolver el slug
    return { 
      slug: newLink.urlCortado, 
      shortUrl: newLink.urlCortado
    };
  } catch (error) {
    console.error('Error al crear el short link:', error);
    throw new Error('Error al crear el enlace corto');
  }
}

/**
    Busca un enlace por su slug, incrementa su contador de clics
    y devuelve la URL original para redireccionar.

    @param slug - El identificador corto del enlace
    @returns La URL original o null si no se encuentra el enlace
 */
export async function incrementarClicksYRedireccion(slug: string): Promise<string | null> {
  try {
    console.log(`Incrementando clicks para slug: ${slug}`);
    
    // Buscar el link por slug
    const linkResult: Link[] = await db
      .select()
      .from(links)
      .where(eq(links.urlCortado, slug));

    if (!linkResult || linkResult.length === 0) {
      console.log(`Link no encontrado: ${slug}`);
      return null;
    }

    const link = linkResult[0];
    const currentClicks = link.clicks !== null ? link.clicks : 0;
    const newClickCount = currentClicks + 1;

    console.log(`Actualizando clicks: ${currentClicks} -> ${newClickCount}`);

    // Incrementar contador de clicks y esperar a que se complete
    const updateResult = await db
      .update(links)
      .set({ 
        clicks: newClickCount
      })
      .where(eq(links.urlCortado, slug))
      .returning();

    console.log(`Clicks actualizados exitosamente para ${slug}`);

    return link.urlOriginal;
  } catch (error) {
    console.error('Error en incrementarClicksYRedireccion:', error);
    // Si el incremento falla siempre redireccionar
    return null;
  }
}

/**
    Obtiene todos los enlaces acortados de un usuario específico
    @param userId - ID del usuario del que queremos obtener los enlaces
    @returns Lista de enlaces ordenados por fecha de creación (más recientes primero)
 */
export async function getUserLinks(userId: string): Promise<Link[]> {
  try {
    return await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(sql`${links.createdAt} DESC`);
  } catch (error) {
    console.error('Error al obtener enlaces del usuario:', error);
    return [];
  }
}