import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import OrdersRequest from "./OrdersRequest";

export default function OrdersScreen() {
  const { user } = useSelector((state) => state.user);
  const { receiver_id: contact } = user || {};
  const [ordersRequests, setOrdersRequests] = useState([]);

  useEffect(() => {
    fetchOrdersRequests();
  }, []);

  const fetchOrdersRequests = async () => {
    try {
      const response = await axios.get(`/orders-request/${contact}`);
      if (response.status === 200) {
        const formatted = response.data.map((order) => ({
          _id: order._id,
          name: order.name,
          email: order.email,
          picture: order.picture,
          
        }));
        setOrdersRequests(formatted);
      }
    } catch (err) {
      console.log("Erro ao buscar solicitações:", err);
    }
  };

  return (
    <div className="px-4 py-6">
      {ordersRequests.length > -1 && (
        <h2 className="text-xl font-bold text-gray-800 mb-4">Solicitações Recebidas</h2>
      )}

      <ul>
        {ordersRequests.map((user) => (
          <OrdersRequest
           key={user._id}
           contact={user}
           ordersRequests={ordersRequests}
           setOrdersRequests={setOrdersRequests}
          />
        ))}
      </ul>
    </div>
  );
}
