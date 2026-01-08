import { Pencil, Trash, Plus, UploadSimple } from "@phosphor-icons/react";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "../../components/Modal";

export default function AdminTeam() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", role: "", bio: "", image: null });
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");

    const fetchTeam = async () => {
        try {
            const res = await api.get('team/');
            setTeam(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`team/${id}/`);
            setTeam(prev => prev.filter(t => t.id !== id));
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
        data.append("name", formData.name);
        data.append("role", formData.role);
        data.append("bio", formData.bio);
        if (formData.image instanceof File) {
            data.append("image", formData.image);
        }

        try {
            // Force multipart header for this request
            const config = { headers: { "Content-Type": "multipart/form-data" } };

            if (editId) {
                await api.patch(`team/${editId}/`, data, config);
            } else {
                await api.post('team/', data, config);
            }
            setIsEditing(false);
            setEditId(null);
            setFormData({ name: "", role: "", bio: "", image: null });
            fetchTeam();
        } catch (err) {
            console.error(err);
            setError("Failed to save team member. Please check your inputs.");
        }
    };

    const handleEdit = (member) => {
        setFormData({
            name: member.name,
            role: member.role,
            bio: member.bio,
            image: null
        });
        setEditId(member.id);
        setIsEditing(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Team Members</h1>
                <Button size="small" className="gap-2" onClick={() => {
                    setFormData({ name: "", role: "", bio: "", image: null });
                    setError("");
                    setEditId(null);
                    setIsEditing(true);
                }}>
                    <Plus size={20} /> Add Member
                </Button>
            </div>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={editId ? "Edit Member" : "New Member"}>
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
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <input
                            type="text"
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image</label>
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
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        <textarea
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none transition-all min-h-[100px]"
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
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
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="3" className="text-center py-4">Loading...</td></tr>
                        ) : team.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200">
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-full object-cover" />}
                                    {item.name}
                                </td>
                                <td className="px-6 py-4">{item.role}</td>
                                <td className="px-6 py-4 flex justify-end gap-2">
                                    <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:hover:bg-blue-900/30">
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
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
