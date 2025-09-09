"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus } from "lucide-react";

export default function CreateInvoice() {
  const [toEmail, setToEmail] = useState("");
  const [price, setPrice] = useState("");
  const [service, setService] = useState("");
  const [comments, setComments] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) return setError("No autorizado");

    try {
      const res = await fetch("http://localhost:4000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({
          toUserEmail: toEmail,
          price,
          service,
          comments,
          date,
        }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Error al crear factura");

      setSuccess("Factura creada correctamente");
      setToEmail("");
      setPrice("");
      setService("");
      setComments("");
      setDate("");
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg">
        <div className="flex flex-col items-center gap-4 mb-6">
          <FilePlus className="w-16 h-16 text-indigo-500" />
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Crear Factura
          </h2>
          <p className="text-gray-500 text-center">
            Rellena los datos para generar una nueva factura
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo destinatario"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />

          <input
            type="number"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />

          <input
            type="text"
            placeholder="Servicio / Detalle"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />

          <textarea
            placeholder="Comentarios"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition resize-none"
            rows={3}
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-md"
          >
            <FilePlus className="w-5 h-5" /> Crear Factura
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 mt-4 text-center">{success}</p>
        )}
      </div>
    </div>
  );
}
