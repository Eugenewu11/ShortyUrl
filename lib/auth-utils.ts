//Verifica la sesion del usuario
import { cookies } from "next/headers";

export async function getSession() {
    //Obtener cookies del cliente
    const cookieStore = await cookies(); 
    const authCookie = cookieStore.get("better-auth.session")?.value;

    //Si no hay, no inicia sesion
    if (!authCookie) return null;

  try {
    const response = await fetch(`${process.env.BETTER_AUTH_URL}/session`, {
      headers: {
        Cookie: `better-auth.session=${authCookie}`, //Obtiene los datos de sesion
      },
      cache: "no-store",
    });

    //Si la respuesta es valida devuelve el json con la informacion de sesion
    if (response.ok) {
      const session = await response.json();
      return session;
    }
    return null;
  } catch {
    return null;
  }
}