import { cookies } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
  
  try {
    const cookieStore = await cookies();
    
    // Crear un objeto Headers estándar
    const headers = new Headers();
    
    // Agregar todas las cookies al header 'Cookie'
    const cookieString = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    if (cookieString) {
      headers.set('Cookie', cookieString);
    }

    console.log("Cookies encontradas:", cookieStore.getAll().map(c => c.name));

    // Usar los headers correctamente
    const session = await auth.api.getSession({
      headers: headers
    });

    console.log("[auth-utils] Sesión obtenida:", {
      userId: session?.user?.id,
      email: session?.user?.email,
      hasSession: !!session
    });

    return session;
  } catch (error) {
    console.error("[auth-utils] Error al obtener sesión:", error);
    return null;
  }
}