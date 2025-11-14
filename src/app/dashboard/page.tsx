'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Manejo de los enlaces
import { getUserLinksAction, createShortLinkAction } from '../../../lib/link-actions';
import { EyeIcon} from '@heroicons/react/24/outline';
import type { Link } from '../../../lib/shortyService';

// Re-exportamos el tipo Link para usarlo en otros componentes
export type { Link };

// Pagina principal del dashboard
export default function DashboardPage() {
  // Hook de navegación
  const router = useRouter();
  
  // Estado para la lista de enlaces del usuario
  const [links, setLinks] = useState<Link[]>([]);
  
  // Estado del formulario
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estado para el feedback de copiado
  const [copiedId, setCopiedId] = useState<string | null>(null);


  // Cargar los enlaces al montar el componente
  useEffect(() => {
    fetchLinks();
  }, []);

  //Obtiene la lista de enlaces del usuario desde la API
  const fetchLinks = async () => {
    try {
      const userLinks = await getUserLinksAction();
      if (Array.isArray(userLinks)) {
        setLinks(userLinks);
      } else {
        setLinks([]);
      }
    } catch (err: any) {
      console.error('Error al cargar los links:', err);
      setError('Error al cargar los links. Por favor, intenta recargar la página.');
      
      // Redirigir a login si el error es de autenticación
      if (err.message.includes('No autorizado')) {
        router.push('/login');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const formData = new FormData();
      formData.append('urlOriginal', originalUrl);
      
      const response = await createShortLinkAction(formData);
      
      if (response?.error) {
        setError(response.error);
        return;
      }
      
      setSuccessMessage('¡Link creado exitosamente!');
      setOriginalUrl('');
      await fetchLinks(); // Recargar la lista de enlaces
    } catch (err: any) {
      console.error('Error al crear el enlace:', err);
      setError(err.message || 'Error al crear el enlace');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (urlCortado: string, id: string) => {
    const fullUrl = `${window.location.origin}/${urlCortado}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/*Header*/}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Acortador de Links TinyURL</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*Formulario para insertar enlaces y recortarlos */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Link</h2>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="url"
                name="urlOriginal"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Pega aquí tu enlace"
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Creando...' : 'Acortar'}
              </button>
            </div>
          </form>
        </div>

        {/*Lista de enlaces*/}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Links</h2>
          
          {links.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tienes links creados aún.</p>
              <p className="text-gray-400 text-sm mt-2">¡Crea tu primer link corto arriba!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <a 
                          href={`/${link.urlCortado}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(`/${link.urlCortado}`, '_blank');
                          }}
                        >
                          {link.urlCortado}
                        </a>
                        <button
                          onClick={() => handleCopyLink(link.urlCortado, link.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          {copiedId === link.id ? '✓ Copiado' : 'Copiar'}
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm truncate mb-2">
                        {link.urlOriginal}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                        <span>{link.clicks || 0} visitas</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}