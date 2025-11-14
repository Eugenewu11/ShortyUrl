import Link from 'next/link';

//Pagina de redireccion si el slug no existe o no se encontro
export default function SlugNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <img 
              src="/errorBackground.png" 
              alt="Error 404" 
              className="mx-auto w-64 h-64 object-contain"
            />
          </div>

          <div className="w-full max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Link No Encontrado</h1>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <p className="text-gray-600 mb-4 text-lg">
                El link que buscas no existe.
              </p>
              <p className="text-sm text-gray-500">
                Verifica que la URL esté correcta o crea un nuevo link.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition"
          >
            Regresar a Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}