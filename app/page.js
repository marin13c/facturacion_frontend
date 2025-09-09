"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserCircle, FilePlus, FileText } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [token, setToken] = useState(null);
  const [isClient, setIsClient] = useState(false);
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

  if (!isClient) return null;

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Tarjeta principal */}
      <div className="bg-gradient-to-tr from-white to-gray-50 p-10 rounded-3xl shadow-2xl w-full max-w-lg">
        <div className="flex flex-col items-center gap-4">
          <UserCircle className="w-16 h-16 text-indigo-500" />
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
          {token && (
            <p className="text-gray-500">Estás logueado en tu cuenta</p>
          )}
        </div>

        {token ? (
          <div className="mt-8 flex flex-col gap-4">
            <Link
              href="/invoice/create"
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-md"
            >
              <FilePlus className="w-5 h-5" /> Crear Factura
            </Link>

            <Link
              href="/invoice/pending"
              className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold shadow-md"
            >
              <FileText className="w-5 h-5" /> Ver Facturas Pendientes
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold shadow-md"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            <p className="text-gray-500 text-center">
              No estás logueado, elige una opción:
            </p>
            <Link
              href="/login"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-md"
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
  );
}
