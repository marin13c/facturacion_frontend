"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";

export default function Home() {
  const [token, setToken] = useState(null);
  const [isClient, setIsClient] = useState(false); // detecta cliente
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setToken(localStorage.getItem("token"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login");
  }

  // Evita render prematuro en SSR
  if (!isClient) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center">
        <div className="flex flex-col items-center gap-3">
          <UserCircle className="w-16 h-16 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
        </div>

        <div className="mt-6">
          {token ? (
            <>
              <p className="mb-6 text-gray-600">
                ✅ Estás logueado en tu cuenta.
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold shadow-md"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-gray-100">
                No estás logueado, elige una opción:
              </p>
              <Link
                href="/login"
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold shadow-md"
              >
                Registro
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
