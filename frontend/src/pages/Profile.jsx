import { useEffect, useState } from "react";
import api from "../services/api";
import Button from "../components/Button";
import { useToast } from "../context/ToastContext";

export default function Profile() {
    const { addToast, removeToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Fetch profile
    const fetchProfile = async () => {
        try {
            const res = await api.get('customers/');
            let data = null;
            if (res.data && res.data.length > 0) {
                data = res.data[0];
            } else if (res.data.results && res.data.results.length > 0) {
                data = res.data.results[0];
            }
            if (data) {
                setProfile(data);
                setFormData({
                    username: data.user?.username || "",
                    email: data.user?.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    profile_image: null
                });
            }
        } catch (err) {
            console.error(err);
            // addToast("Failed to load profile", "error"); // Optional: don't annoy user on load
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profile_image: e.target.files[0] });
    };

    const handleSave = async () => {
        if (!profile) return;

        const toastId = addToast("Saving profile...", "loading", false);

        const data = new FormData();
        data.append("phone", formData.phone);
        data.append("address", formData.address);
        // Using bracket notation for nested serializer update
        data.append("user[username]", formData.username);
        data.append("user[email]", formData.email);

        if (formData.profile_image) {
            data.append("profile_image", formData.profile_image);
        }

        try {
            await api.patch(`customers/${profile.id}/`, data, { headers: { "Content-Type": "multipart/form-data" } });
            // Handle Password Change if fields are filled
            if (formData.oldPassword && formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    removeToast(toastId);
                    addToast("New passwords do not match", "error");
                    return;
                }
                await api.post('change-password/', {
                    old_password: formData.oldPassword,
                    new_password: formData.newPassword
                });
                removeToast(toastId);
                addToast("Profile and password updated successfully!", "success");
            } else {
                removeToast(toastId);
                addToast("Profile updated successfully!", "success");
            }

            setIsEditing(false);
            setFormData(prev => ({ ...prev, oldPassword: "", newPassword: "", confirmPassword: "" })); // Clear password fields
            fetchProfile();
        } catch (err) {
            console.error("Failed to update profile", err);
            removeToast(toastId);
            addToast(err.response?.data?.error || "Failed to update profile", "error");
        }
    };

    if (loading) return <div className="p-8 text-center bg-white dark:bg-gray-950 min-h-screen text-gray-500">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">My Profile</h1>

                {profile ? (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            {profile.profile_image ? (
                                <img
                                    src={profile.profile_image}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-transparent">
                                    {(profile.user?.username || "U")[0].toUpperCase()}
                                </div>
                            )}

                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                                    {profile.user?.username || "User"}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">{profile.user?.email || "No Email"}</p>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-2">
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Change Profile Image</label>
                                <input type="file" onChange={handleFileChange} accept="image/*" className="text-sm dark:text-gray-300" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm text-gray-500 dark:text-gray-400">Username</label>
                                {isEditing ? (
                                    <input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-800 dark:text-gray-200">{profile.user?.username || "N/A"}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 dark:text-gray-400">Email</label>
                                {isEditing ? (
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-800 dark:text-gray-200">{profile.user?.email || "N/A"}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 dark:text-gray-400">Phone</label>
                                {isEditing ? (
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-800 dark:text-gray-200">{profile.phone || "N/A"}</p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-500 dark:text-gray-400">Address</label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-800 dark:text-gray-200">{profile.address || "N/A"}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            {isEditing ? (
                                <>
                                    <Button onClick={handleSave}>Save Changes</Button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">You do not have a customer profile yet.</p>
                        {/* Create logic could be added here similar to edit */}
                    </div>
                )}
            </div>
        </div>
    );
}
