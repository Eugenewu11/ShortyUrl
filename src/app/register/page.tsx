"use client";

import { signUpAction } from "@/../server/users";
import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(signUpAction, null, 'register-form');

  useEffect(() => {
    if (state?.success) {
      router.push("/login?register=success");
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Crea tu cuenta</h2>
              <p className="text-gray-600 mt-2">Únete a nuestra plataforma</p>
            </div>

            <form action={formAction} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Tu nombre"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tucorreo@ejemplo.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mínimo 6 caracteres
                </p>
              </div>

              {state?.error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {state.error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Crear cuenta
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <a 
                  href="/login" 
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Inicia sesión
                </a>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-6 rounded-b-2xl text-center">
            <p className="text-sm text-gray-500">
              Al registrarte, aceptas nuestros{" "}
              <a href="#" className="text-purple-600 hover:underline">Términos de servicio</a>{" "}
              y{" "}
              <a href="#" className="text-purple-600 hover:underline">Política de privacidad</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}