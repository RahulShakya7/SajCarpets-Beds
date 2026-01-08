import { Package, Users, CurrencyDollar, EnvelopeSimple, ShoppingCart, Tag } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
    const [stats, setStats] = useState([
        { title: "Total Users", value: "...", icon: <Users size={32} />, color: "bg-blue-500", key: "users" },
        { title: "Total Products", value: "...", icon: <Package size={32} />, color: "bg-green-500", key: "products" },
        { title: "Total Categories", value: "...", icon: <Tag size={32} />, color: "bg-teal-500", key: "categories" },
        { title: "Total Orders", value: "...", icon: <ShoppingCart size={32} />, color: "bg-orange-500", key: "orders" },
        { title: "Total Messages", value: "...", icon: <EnvelopeSimple size={32} />, color: "bg-purple-500", key: "messages" },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('dashboard/stats/');
                const data = res.data;

                setStats(prev => prev.map(stat => ({
                    ...stat,
                    value: data[stat.key] !== undefined ? data[stat.key] : "0"
                })));
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center gap-4 transition-colors">
                        <div className={`p-4 rounded-full text-white ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
