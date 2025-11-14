
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
            404
          </h1>
        </div>

        {/*Imagen*/}
        <div className="mb-6 flex justify-center">
          <img src="/errorBackground.png"/>
        </div>

        <div className="mb-8 space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">
            ¡Oops! Página no encontrada
          </h2>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            La página que buscas no existe en nuestra aplicación.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ¿Qué puedes hacer?
          </h3>
          <ul className="space-y-3 text-left max-w-md mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-purple-500 text-xl">•</span>
              <span className="text-gray-600">Verifica que la URL esté escrita correctamente</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-500 text-xl">•</span>
              <span className="text-gray-600">Regresa al inicio y navega desde allí</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-500 text-xl">•</span>
              <span className="text-gray-600">Si crees que es un error, contacta a soporte</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg border-2 border-purple-600 hover:bg-purple-50 transform hover:scale-105 transition duration-200"
          >
            Volver a Inicio
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          ¿Necesitas ayuda? Contacta a soporte
        </p>
      </div>
    </div>
  );
}