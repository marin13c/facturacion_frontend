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
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SentInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
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
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedInvoice) return;
    setUpdating(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:4000/api/invoices/${selectedInvoice._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv._id === selectedInvoice._id ? data.invoice : inv
          )
        );
        setSelectedInvoice(data.invoice);
      } else {
        alert(data.message || "Error al actualizar estado");
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar estado");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!isClient || !dateStr) return "Sin fecha";
    return new Date(dateStr).toLocaleDateString("es-CR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 to-indigo-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
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
                onClick={() => setSelectedInvoice(inv)}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition border border-gray-100 cursor-pointer"
              >
                <div className="mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "Pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : inv.status === "Pagada"
                        ? "bg-green-100 text-green-700"
                        : inv.status === "Comprobante Subido"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {inv.status || "Pendiente"}
                  </span>
                </div>

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
                      <strong>Fecha:</strong> {formatDate(inv.date)}
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

      {selectedInvoice && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              Detalles de Factura
            </h3>

            <p>
              <strong>Para:</strong> {selectedInvoice.toUserEmail}
            </p>
            <p>
              <strong>Servicio:</strong> {selectedInvoice.service}
            </p>
            <p>
              <strong>Precio:</strong> ₡
              {selectedInvoice.price?.toLocaleString() ?? 0}
            </p>
            <p>
              <strong>Fecha:</strong> {formatDate(selectedInvoice.date)}
            </p>
            {selectedInvoice.comments && (
              <p>
                <strong>Comentarios:</strong> {selectedInvoice.comments}
              </p>
            )}

            {selectedInvoice.paymentImage ? (
              <div className="mt-4">
                <p className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-500" />
                  Comprobante de Pago
                </p>
                <img
                  src={selectedInvoice.paymentImage}
                  alt="Comprobante"
                  className="rounded-lg border shadow max-h-80 object-contain mx-auto"
                />
              </div>
            ) : (
              <p className="text-gray-500 italic mt-4">
                No se ha adjuntado comprobante todavía.
              </p>
            )}

            {/* Botones solo cuando el estado sea "Comprobante Subido" */}
            {selectedInvoice.status === "Comprobante Subido" && (
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => handleUpdateStatus("Pagada")}
                  disabled={updating}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl disabled:bg-gray-300"
                >
                  {updating ? "Actualizando..." : "Marcar como Pagada ✅"}
                </button>
                <button
                  onClick={() => handleUpdateStatus("Rechazada")}
                  disabled={updating}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl disabled:bg-gray-300"
                >
                  {updating ? "Actualizando..." : "Rechazar Pago ❌"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
