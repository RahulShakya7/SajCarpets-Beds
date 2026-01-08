import { Pencil, Trash, Plus } from "@phosphor-icons/react";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "../../components/Modal";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        is_superuser: false,
        is_staff: false
    });

    const fetchUsers = async () => {
        try {
            const res = await api.get('users/');
            setUsers(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`users/${id}/`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Only send password if it's provided (for updates)
            const data = { ...formData };
            if (editId && !data.password) {
                delete data.password;
            }

            if (editId) {
                await api.patch(`users/${editId}/`, data);
            } else {
                await api.post('users/', data);
            }
            setIsEditing(false);
            setEditId(null);
            resetForm();
            fetchUsers();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.username?.[0] || "Failed to save user.");
        }
    };

    const resetForm = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
            is_superuser: false,
            is_staff: false
        });
        setError("");
    }

    const handleEdit = (user) => {
        setFormData({
            username: user.username,
            email: user.email,
            password: "", // Don't preload hash
            is_superuser: user.is_superuser,
            is_staff: user.is_staff || user.is_superuser // Ensure synchronization if needed
        });
        setEditId(user.id);
        setIsEditing(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Users</h1>
                <Button size="small" className="gap-2" onClick={() => {
                    resetForm();
                    setEditId(null);
                    setIsEditing(true);
                }}>
                    <Plus size={20} /> Add User
                </Button>
            </div>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={editId ? "Edit User" : "New User"}>
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input
                            type="text"
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password {editId && "(Leave blank to keep current)"}</label>
                        <input
                            type="password"
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required={!editId}
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="is_superuser"
                            checked={formData.is_superuser}
                            onChange={e => {
                                const checked = e.target.checked;
                                setFormData(prev => ({
                                    ...prev,
                                    is_superuser: checked,
                                    is_staff: checked // Automatically make superusers staff
                                }));
                            }}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="is_superuser" className="text-sm text-gray-700 dark:text-gray-300">Admin Access (Superuser)</label>
                    </div>

                    <div className="flex gap-3 justify-end mt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <Button size="small" type="submit">Save Changes</Button>
                    </div>
                </form>
            </Modal>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Username</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                        ) : users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200">
                                <td className="px-6 py-4">{user.id}</td>
                                <td className="px-6 py-4 font-medium">{user.username}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.is_superuser ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                        }`}>
                                        {user.is_superuser ? 'Admin' : 'Customer'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex justify-end gap-2">
                                    <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:hover:bg-blue-900/30">
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
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
