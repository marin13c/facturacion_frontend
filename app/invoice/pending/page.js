"use client";

import { useEffect, useState } from "react";
import { FileText, User } from "lucide-react";

export default function PendingInvoices() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:4000/api/invoices/pending", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        // Si el backend devuelve un objeto con invoices
        setInvoices(Array.isArray(data) ? data : data.invoices || []);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-200 to-blue-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-10 h-10 text-indigo-500" />
          <h2 className="text-3xl font-bold text-gray-800">
            Facturas Pendientes
          </h2>
        </div>

        {invoices.length === 0 && (
          <p className="text-gray-600 text-center py-10 bg-white rounded-2xl shadow">
            No tienes facturas pendientes
          </p>
        )}

        <div className="flex flex-col gap-4">
          {invoices.map((inv) => (
            <div
              key={inv._id}
              className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-3 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-700 font-medium">
                  Enviado por: {inv.createdBy} ({inv.createdByEmail})
                </span>
              </div>

              <p>
                <strong>Para:</strong> {inv.toUserEmail}
              </p>
              <p>
                <strong>Precio:</strong> ₡{inv.price}
              </p>
              <p>
                <strong>Servicio:</strong> {inv.service}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(inv.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Comentarios:</strong> {inv.comments}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
