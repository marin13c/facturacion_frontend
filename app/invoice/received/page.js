"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  User,
  Mail,
  Calendar,
  DollarSign,
  MessageSquare,
  Loader2,
  ArrowLeft,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReceivedInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:4000/api/invoices/pending", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        setInvoices(Array.isArray(data) ? data : data.invoices || []);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleUploadProof = () => {
    if (!selectedInvoice || !imageFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(imageFile); // convierte a Base64
    reader.onload = async () => {
      const imageBase64 = reader.result;
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `http://localhost:4000/api/invoices/${selectedInvoice._id}/upload-proof`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ imageBase64 }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          // Actualizar estado local
          setInvoices((prev) =>
            prev.map((inv) =>
              inv._id === selectedInvoice._id ? data.invoice : inv
            )
          );
          setSelectedInvoice(null);
          setImageFile(null);
        } else {
          alert(data.message || "Error al subir comprobante");
        }
      } catch (err) {
        console.error(err);
        alert("Error al subir comprobante");
      }
    };
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-indigo-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Regresar</span>
          </button>

          <div className="flex items-center gap-3">
            <FileText className="w-10 h-10 text-indigo-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Facturas Recibidas
            </h2>
          </div>

          <span className="hidden sm:block text-gray-600 text-sm min-w-[120px] text-right">
            {loading ? "Cargando..." : `Total: ${invoices.length}`}
          </span>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando facturas...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <FileText className="w-14 h-14 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No tienes facturas pendientes 🚀
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
                {/* Estado */}
                <div className="mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "Pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : inv.status === "Comprobante Subido"
                        ? "bg-blue-100 text-blue-700"
                        : inv.status === "Pagada"
                        ? "bg-green-100 text-green-700"
                        : inv.status === "Rechazada"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                {/* Enviado por */}
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm text-gray-700 font-medium">
                    <strong>De:</strong> {inv.createdBy} ({inv.createdByEmail})
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

      {/* Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={() => {
                setSelectedInvoice(null);
                setImageFile(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold mb-4">Detalles de la Factura</h3>

            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>De:</strong> {selectedInvoice.createdBy} (
                {selectedInvoice.createdByEmail})
              </p>
              <p>
                <strong>Para:</strong> {selectedInvoice.toUserEmail}
              </p>
              <p>
                <strong>Precio:</strong> ₡
                {selectedInvoice.price?.toLocaleString() ?? 0}
              </p>
              <p>
                <strong>Servicio:</strong> {selectedInvoice.service}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {selectedInvoice.date
                  ? new Date(selectedInvoice.date).toLocaleDateString()
                  : "Sin fecha"}
              </p>
              {selectedInvoice.comments && (
                <p>
                  <strong>Comentarios:</strong> {selectedInvoice.comments}
                </p>
              )}
            </div>

            {/* Subir comprobante */}
            <div className="mt-4">
              <label className="block mb-1 font-medium">
                Subir Comprobante:
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2 bg-white hover:border-indigo-500 transition">
                  <span>
                    {imageFile ? imageFile.name : "Selecciona un archivo"}
                  </span>
                  <button
                    type="button"
                    className="text-indigo-600 font-semibold hover:text-indigo-800"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleUploadProof}
              disabled={!imageFile}
              className={`mt-4 w-full py-3 rounded-xl font-semibold text-white transition ${
                imageFile
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Subir Comprobante
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
