import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

// Servicio para manejar la lógica de redirección
import { incrementarClicksYRedireccion } from '../../../lib/shortyService';

// Definición de tipos para los parámetros de la ruta
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Página dinámica que maneja las redirecciones de URLs cortas
export default async function RedirectPage({ params }: PageProps) {
  // Extraemos el slug de los parámetros de la ruta
  const { slug } = await params;

  // Intentamos obtener la URL original y registrar el click
  const urlOriginal = await incrementarClicksYRedireccion(slug);

  // Si no encontramos la URL, mostramos página 404 personalizada
  if (!urlOriginal) {
    console.log(`Error: No se encontró el slug: ${slug}`);
    notFound();
  }

  console.log(`Redireccionando ${slug} -> ${urlOriginal}`);
  
  // Aseguramos que la URL tenga protocolo para evitar errores de redirección
  let redirectUrl = urlOriginal;
  if (!/^https?:\/\//i.test(urlOriginal)) {
    redirectUrl = 'https://' + urlOriginal;
  }
  
  // Redirigimos al usuario a la URL original
  redirect(redirectUrl);
}