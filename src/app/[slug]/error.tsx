'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error en redirección:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-6">
          <svg className="w-24 h-24 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Error al Redirigir</h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <p className="text-gray-600 mb-4">
            Ocurrió un error al intentar redirigirte al enlace original.
          </p>
          <p className="text-sm text-gray-500">
            El enlace podría estar malformado o el servicio no está disponible.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
          >
            Reintentar
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-white text-red-600 font-medium rounded-lg border-2 border-red-600 hover:bg-red-50 transition"
          >
            Ir a Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}