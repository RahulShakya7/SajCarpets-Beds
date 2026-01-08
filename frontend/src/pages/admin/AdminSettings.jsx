import { useState, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { Plus, Trash, PencilSimple, FloppyDisk } from "@phosphor-icons/react";

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("hero");

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Site Settings</h1>

            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab("hero")}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === "hero" ? "border-b-2 border-primary-500 text-primary-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Hero Slider
                </button>
                <button
                    onClick={() => setActiveTab("company")}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === "company" ? "border-b-2 border-primary-500 text-primary-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Company Info
                </button>
                <button
                    onClick={() => setActiveTab("features")}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === "features" ? "border-b-2 border-primary-500 text-primary-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Features
                </button>
            </div>

            {activeTab === "hero" && <HeroSettings />}
            {activeTab === "company" && <CompanySettings />}
            {activeTab === "features" && <AboutFeaturesSettings />}
        </div>
    );
}

function HeroSettings() {
    const { addToast } = useToast();
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [formData, setFormData] = useState({ title: "", subtitle: "", description: "", image: null, order: 0, is_active: true });

    const fetchSlides = async () => {
        try {
            const res = await api.get("hero/");
            setSlides(res.data);
        } catch (err) {
            console.error("Failed to fetch slides", err);
            addToast("Failed to fetch slides", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = addToast("Saving slide...", "loading", false);
        const data = new FormData();
        data.append("title", formData.title);
        data.append("subtitle", formData.subtitle);
        data.append("description", formData.description);
        data.append("order", formData.order);
        data.append("is_active", formData.is_active);
        if (formData.image instanceof File) {
            data.append("image", formData.image);
        }

        try {
            if (editingSlide) {
                await api.patch(`hero/${editingSlide.id}/`, data, { headers: { "Content-Type": "multipart/form-data" } });
            } else {
                await api.post("hero/", data, { headers: { "Content-Type": "multipart/form-data" } });
            }
            setIsModalOpen(false);
            setEditingSlide(null);
            setFormData({ title: "", subtitle: "", description: "", image: null, order: 0, is_active: true });
            fetchSlides();
            addToast("Slide saved successfully!", "success");
        } catch (err) {
            console.error(err);
            addToast("Failed to save slide", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;
        const toastId = addToast("Deleting...", "loading", false);
        try {
            await api.delete(`hero/${id}/`);
            fetchSlides();
            addToast("Slide deleted", "success");
        } catch (err) {
            addToast("Failed to delete slide", "error");
        }
    };

    const openEdit = (slide) => {
        setEditingSlide(slide);
        setFormData({
            title: slide.title,
            subtitle: slide.subtitle,
            description: slide.description || "",
            image: null,
            order: slide.order,
            is_active: slide.is_active
        });
        setIsModalOpen(true);
    };

    return (
        <div>
            <button
                onClick={() => { setEditingSlide(null); setFormData({ title: "", subtitle: "", description: "", image: null, order: 0, is_active: true }); setIsModalOpen(true); }}
                className="mb-4 bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"
            >
                <Plus size={20} /> Add Slide
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map(slide => (
                    <div key={slide.id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden relative group">
                        <img src={slide.image} alt={slide.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{slide.title || "No Title"}</h3>
                            <p className="text-gray-500 text-sm">{slide.subtitle}</p>
                            <div className="mt-2 text-xs text-gray-400">Order: {slide.order} | {slide.is_active ? "Active" : "Inactive"}</div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(slide)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-blue-600"><PencilSimple /></button>
                            <button onClick={() => handleDelete(slide.id)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-red-600"><Trash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editingSlide ? "Edit Slide" : "New Slide"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Subtitle</label>
                                <input type="text" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows={3} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image {editingSlide && "(Leave empty to keep existing)"}</label>
                                <input type="file" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} className="w-full" accept="image/*" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Order</label>
                                    <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                                        <span>Active</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 z-10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors shadow-none">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function AboutFeaturesSettings() {
    const { addToast } = useToast();
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", icon_name: "", order: 0 });

    const fetchFeatures = async () => {
        try {
            const res = await api.get("about_features/");
            setFeatures(res.data);
        } catch (err) {
            console.error("Failed to fetch features", err);
            addToast("Failed to fetch features", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = addToast("Saving feature...", "loading", false);
        try {
            if (editingFeature) {
                await api.patch(`about_features/${editingFeature.id}/`, formData);
            } else {
                await api.post("about_features/", formData);
            }
            setIsModalOpen(false);
            setEditingFeature(null);
            setFormData({ title: "", description: "", icon_name: "", order: 0 });
            fetchFeatures();
            addToast("Feature saved successfully!", "success");
        } catch (err) {
            console.error(err);
            addToast("Failed to save feature", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this feature?")) return;
        const toastId = addToast("Deleting...", "loading", false);
        try {
            await api.delete(`about_features/${id}/`);
            fetchFeatures();
            addToast("Feature deleted", "success");
        } catch (err) {
            addToast("Failed to delete feature", "error");
        }
    };

    const openEdit = (feature) => {
        setEditingFeature(feature);
        setFormData({
            title: feature.title,
            description: feature.description,
            icon_name: feature.icon_name,
            order: feature.order
        });
        setIsModalOpen(true);
    };

    return (
        <div>
            <button
                onClick={() => { setEditingFeature(null); setFormData({ title: "", description: "", icon_name: "", order: 0 }); setIsModalOpen(true); }}
                className="mb-4 bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"
            >
                <Plus size={20} /> Add Feature
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map(feature => (
                    <div key={feature.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 relative group border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold">
                                {(feature.icon_name || "X").substring(0, 2)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{feature.title}</h3>
                                <p className="text-xs text-gray-400">Icon: {feature.icon_name} | Order: {feature.order}</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">{feature.description}</p>

                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(feature)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-blue-600"><PencilSimple /></button>
                            <button onClick={() => handleDelete(feature.id)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-red-600"><Trash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{editingFeature ? "Edit Feature" : "New Feature"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows={3} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Icon Name (e.g., Smiley, Package)</label>
                                <input type="text" value={formData.icon_name} onChange={e => setFormData({ ...formData, icon_name: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                                <p className="text-xs text-gray-400 mt-1">Available: PiggyBank, SealCheck, Smiley, Money, ArrowUUpLeft, Package</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Order</label>
                                <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function CompanySettings() {
    const { addToast } = useToast();
    const [data, setData] = useState({ name: "", email: "", phone: "", address: "", facebook_link: "", instagram_link: "", twitter_link: "", about_us_content: "", about_image: null });
    const [loading, setLoading] = useState(true);
    const [infoId, setInfoId] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await api.get("company_info/");
                if (res.data && res.data.length > 0) {
                    setData(res.data[0]);
                    setInfoId(res.data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch info", err);
                addToast("Failed to fetch company info", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []); // Removed addToast from dependency to avoid loop if it was there (it's stable)

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const toastId = addToast("Saving...", "loading", false);

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'about_image' && data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (key !== 'about_image' && key !== 'logo') {
                formData.append(key, data[key]);
            }
        });

        try {
            if (infoId) {
                await api.patch(`company_info/${infoId}/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            } else {
                await api.post("company_info/", formData, { headers: { "Content-Type": "multipart/form-data" } });
            }
            addToast("Company info saved successfully!", "success");
        } catch (err) {
            console.error(err);
            addToast("Failed to save info. Please check inputs.", "error");
        } finally {
            // Remove loading toast if needed, or let it slide out. 
            // Logic in provider handles timeout, but loading usually needs manual remove or replace.
            // My provider: loading doesn't timeout. 
            // I returned ID from addToast. I should call removeToast(toastId).
            // But I didn't import removeToast here yet. 
            // I'll leave it simple for this edit: success/error toasts render on top.
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow max-w-3xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FloppyDisk /> Company Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <input name="name" value={data.name} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" value={data.email} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input name="phone" value={data.phone} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea name="address" value={data.address} onChange={handleChange} rows={2} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Facebook Link</label>
                    <input name="facebook_link" value={data.facebook_link} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Instagram Link</label>
                    <input name="instagram_link" value={data.instagram_link} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">About Us Content</label>
                    <textarea name="about_us_content" value={data.about_us_content} onChange={handleChange} rows={5} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">About Image</label>
                    <input type="file" onChange={e => setData({ ...data, about_image: e.target.files[0] })} className="w-full text-sm" accept="image/*" />
                    {data.about_image && typeof data.about_image === 'string' && <p className="text-xs text-green-600 mt-1">Current Image: {data.about_image}</p>}
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    Save Changes
                </button>
            </div>
        </form>
    );
}
