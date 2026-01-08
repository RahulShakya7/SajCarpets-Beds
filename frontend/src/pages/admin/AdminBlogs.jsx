import { Pencil, Trash, Plus, UploadSimple } from "@phosphor-icons/react";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "../../components/Modal";

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", author: "Saj Team", date: new Date().toISOString().split('T')[0], image: null });
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");

    const fetchBlogs = async () => {
        try {
            const res = await api.get('blogs/');
            setBlogs(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`blogs/${id}/`);
            setBlogs(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("author", formData.author);
        data.append("date", formData.date);
        if (formData.image instanceof File) {
            data.append("image", formData.image);
        }

        try {
            // Force multipart header for this request
            const config = { headers: { "Content-Type": "multipart/form-data" } };

            if (editId) {
                await api.patch(`blogs/${editId}/`, data, config);
            } else {
                await api.post('blogs/', data, config);
            }
            setIsEditing(false);
            setEditId(null);
            setFormData({ title: "", content: "", author: "Saj Team", date: new Date().toISOString().split('T')[0], image: null });
            fetchBlogs();
        } catch (err) {
            console.error(err);
            setError("Failed to save blog post. Please check your inputs.");
        }
    };

    const handleEdit = (blog) => {
        setFormData({
            title: blog.title,
            content: blog.content,
            author: blog.author,
            date: blog.date,
            image: null // Reset image on edit init, user uploads new if they want change
        });
        setEditId(blog.id);
        setIsEditing(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Blogs</h1>
                <Button size="small" className="gap-2" onClick={() => {
                    setFormData({ title: "", content: "", author: "Saj Team", date: new Date().toISOString().split('T')[0], image: null });
                    setError("");
                    setEditId(null);
                    setIsEditing(true);
                }}>
                    <Plus size={20} /> Add Blog
                </Button>
            </div>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={editId ? "Edit Blog" : "New Blog"}>
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish Date</label>
                        <input
                            type="date"
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                        <input
                            type="text"
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.author}
                            onChange={e => setFormData({ ...formData, author: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image</label>
                        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative cursor-pointer">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-2">
                                <UploadSimple size={24} />
                                <span className="text-sm">{formData.image ? formData.image.name : "Click to upload image"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                        <textarea
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none transition-all min-h-[150px]"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
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
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Author</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                        ) : blogs.map((blog) => (
                            <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200">
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    {blog.image && <img src={blog.image} alt="" className="w-10 h-10 rounded-md object-cover" />}
                                    {blog.title}
                                </td>
                                <td className="px-6 py-4">{blog.date}</td>
                                <td className="px-6 py-4">{blog.author}</td>
                                <td className="px-6 py-4 flex justify-end gap-2">
                                    <button onClick={() => handleEdit(blog)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:hover:bg-blue-900/30">
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
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
