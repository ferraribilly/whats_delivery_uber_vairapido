import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ConfirmarPagamento() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, placa, valorKm, valorFixo } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!userId) {
    navigate("/login");
    return null;
  }

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError("");

    try {
      
      const response = await axios.post("/api/pagamentos/create-payment", {
        userId,
        placa,
      });

      const { paymentUrl } = response.data;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("URL de pagamento não retornada pelo backend");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao iniciar o pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Confirmar Pagamento</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <p><strong>User ID:</strong> {userId}</p>
        <p><strong>Placa:</strong> {placa}</p>
       

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        <button
          onClick={handleConfirmPayment}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          } transition`}
        >
          {loading ? "Iniciando pagamento..." : "Confirmar Pagamento"}
        </button>
      </div>
    </div>
  );
}
