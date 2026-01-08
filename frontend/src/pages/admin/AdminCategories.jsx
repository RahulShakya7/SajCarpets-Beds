import { Pencil, Trash, Plus } from "@phosphor-icons/react";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "../../components/Modal";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        slug: ""
    });

    const fetchCategories = async () => {
        try {
            const res = await api.get('categoriescrud/');
            setCategories(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`categoriescrud/${id}/`);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete. It might be linked to products.");
        }
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setFormData(prev => ({ ...prev, name, slug }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editId) {
                await api.patch(`categoriescrud/${editId}/`, formData);
            } else {
                await api.post('categoriescrud/', formData);
            }
            setIsEditing(false);
            setEditId(null);
            setFormData({ name: "", slug: "" });
            fetchCategories();
        } catch (err) {
            console.error(err);
            setError("Failed to save category. Slug name must be unique.");
        }
    };

    const handleEdit = (cat) => {
        setFormData({
            name: cat.name,
            slug: cat.slug
        });
        setEditId(cat.id);
        setIsEditing(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Categories</h1>
                <Button size="small" className="gap-2" onClick={() => {
                    setFormData({ name: "", slug: "" });
                    setEditId(null);
                    setError("");
                    setIsEditing(true);
                }}>
                    <Plus size={20} /> Add Category
                </Button>
            </div>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={editId ? "Edit Category" : "New Category"}>
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
                        <input
                            type="text"
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                            value={formData.slug}
                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            required
                        />
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
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                        ) : categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200">
                                <td className="px-6 py-4">{cat.id}</td>
                                <td className="px-6 py-4 font-medium">{cat.name}</td>
                                <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                                <td className="px-6 py-4 flex justify-end gap-2">
                                    <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:hover:bg-blue-900/30">
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
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
