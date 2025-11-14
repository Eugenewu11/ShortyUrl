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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Acortador de Links TinyURL</h1>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        {/*Formulario para insertar enlaces y recortarlos */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Crear Nuevo Link</h2>
          
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

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                name="urlOriginal"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Pega aquí tu enlace"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
              >
                {loading ? 'Creando...' : 'Acortar'}
              </button>
            </div>
          </form>
        </div>

        {/*Lista de enlaces*/}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Mis Links</h2>
          
          {links.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">No tienes links creados aún.</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">¡Crea tu primer link corto arriba!</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:border-indigo-300 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <div className="flex-1 min-w-0">
                          <a 
                            href={`/${link.urlCortado}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors w-full sm:w-auto truncate"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(`/${link.urlCortado}`, '_blank');
                            }}
                            title={link.urlCortado}
                          >
                            {link.urlCortado}
                          </a>
                        </div>
                        <button
                          onClick={() => handleCopyLink(link.urlCortado, link.id)}
                          className="w-full sm:w-auto text-center px-3 py-1.5 text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          {copiedId === link.id ? '✓ Copiado' : 'Copiar'}
                        </button>
                      </div>
                      
                      <p className="text-gray-600 text-xs sm:text-sm truncate mb-2 sm:mb-3" title={link.urlOriginal}>
                        {link.urlOriginal}
                      </p>
                      
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                          <span className="text-xs sm:text-sm">{link.clicks || 0} Visitas</span>
                        </span>
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