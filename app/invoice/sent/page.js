"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Mail,
  Calendar,
  DollarSign,
  MessageSquare,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SentInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:4000/api/invoices/sent", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        setInvoices(Array.isArray(data) ? data : data.invoices || []);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 to-indigo-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Header fijo */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Regresar</span>
          </button>

          <div className="flex items-center gap-3">
            <FileText className="w-10 h-10 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Facturas Enviadas
            </h2>
          </div>

          <span className="hidden sm:block text-gray-600 text-sm min-w-[120px] text-right">
            {loading ? "Cargando..." : `Total: ${invoices.length}`}
          </span>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando facturas...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <FileText className="w-14 h-14 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No has enviado ninguna factura ✉️
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((inv) => (
              <div
                key={inv._id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition border border-gray-100"
              >
                {/* Estado */}
                <div className="mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "Pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : inv.status === "Pagada"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {inv.status || "Pendiente"}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    <span>
                      <strong>Para:</strong> {inv.toUserEmail}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>
                      <strong>Precio:</strong> ₡
                      {inv.price?.toLocaleString() ?? 0}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>
                      <strong>Servicio:</strong> {inv.service}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>
                      <strong>Fecha:</strong>{" "}
                      {inv.date
                        ? new Date(inv.date).toLocaleDateString()
                        : "Sin fecha"}
                    </span>
                  </p>
                  {inv.comments && (
                    <p className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span>
                        <strong>Comentarios:</strong> {inv.comments}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
