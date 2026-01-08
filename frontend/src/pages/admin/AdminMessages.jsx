import { Trash, EnvelopeOpen } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const res = await api.get('contact_messages/');
            setMessages(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`contact_messages/${id}/`);
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Messages</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Message</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                        ) : messages.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4 text-gray-500">No messages found.</td></tr>
                        ) : messages.map((msg) => (
                            <tr key={msg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200">
                                <td className="px-6 py-4">{msg.id}</td>
                                <td className="px-6 py-4 font-medium">{msg.name}</td>
                                <td className="px-6 py-4 text-blue-600 dark:text-blue-400">
                                    <a href={`mailto:${msg.email}`}>{msg.email}</a>
                                </td>
                                <td className="px-6 py-4 max-w-xs truncate" title={msg.message}>{msg.message}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(msg.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleDelete(msg.id)}
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
