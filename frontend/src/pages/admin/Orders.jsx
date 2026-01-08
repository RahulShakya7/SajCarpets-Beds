import { Trash, Eye } from "@phosphor-icons/react";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('orders/');
                setOrders(res.data.results || res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Simplified delete/archive
    const handleDelete = async (id) => {
        if (!window.confirm("Delete order?")) return;
        try {
            await api.delete(`orders/${id}/`);
            setOrders(prev => prev.filter(o => o.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Orders</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4">No orders found.</td></tr>
                        ) : orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200">
                                <td className="px-6 py-4">{order.id}</td>
                                <td className="px-6 py-4">{order.customer || "Guest"}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
                                        {order.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">£{order.total_amount || 0}</td>
                                <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 flex justify-end gap-2">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:hover:bg-blue-900/30">
                                        <Eye size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(order.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full dark:hover:bg-red-900/30"
                                    >
                                        <Trash size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
