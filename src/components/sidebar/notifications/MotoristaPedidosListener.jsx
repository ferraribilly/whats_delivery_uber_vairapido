import { useEffect, useContext } from "react";
import SocketContext from "../../../context/SocketContext";

function MotoristaPedidosListener() {
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    function handleNovaOrder({ order }) {
      console.log("🚨 Pedido novo recebido pelo motorista:", order);
      alert(`🚕 Pedido de corrida recebido de ${order.name}!`);
    }

    socket.on("nova-order-recebida", handleNovaOrder);

    return () => {
      socket.off("nova-order-recebida", handleNovaOrder);
    };
  }, [socket]);

  return null; // apenas listener
}

export default MotoristaPedidosListener;
