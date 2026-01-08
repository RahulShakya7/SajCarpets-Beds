import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/Button";

export default function AdminProfile() {
    const { user } = useAuth();
    const { addToast, removeToast } = useToast();
    const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (formData.newPassword !== formData.confirmPassword) {
            addToast("New passwords do not match", "error");
            setLoading(false);
            return;
        }

        const toastId = addToast("Updating password...", "loading", false);

        try {
            await api.post('change-password/', {
                old_password: formData.oldPassword,
                new_password: formData.newPassword
            });
            removeToast(toastId);
            addToast("Password updated successfully!", "success");
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error(err);
            removeToast(toastId);
            addToast(err.response?.data?.error || "Failed to update password", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Profile</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 max-w-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {(user?.username || "A")[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold dark:text-white">{user?.username}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Admin</span>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="border-t border-gray-100 dark:border-gray-700 pt-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Change Password</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300 mb-1">Current Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300 mb-1">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-700 transition disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
