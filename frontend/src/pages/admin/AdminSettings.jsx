import { useState, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import { Plus, Trash, PencilSimple, FloppyDisk, Pencil, UploadSimple } from "@phosphor-icons/react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("hero");

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Site Settings</h1>

            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("hero")}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === "hero" ? "border-b-2 border-primary text-primary dark:text-red-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                    Hero Slider
                </button>
                <button
                    onClick={() => setActiveTab("company")}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === "company" ? "border-b-2 border-primary text-primary dark:text-red-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                    Company Info
                </button>
                <button
                    onClick={() => setActiveTab("about")}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === "about" ? "border-b-2 border-primary text-primary dark:text-red-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                    About Us
                </button>
                <button
                    onClick={() => setActiveTab("features")}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === "features" ? "border-b-2 border-primary text-primary dark:text-red-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                    Features
                </button>
                <button
                    onClick={() => setActiveTab("team")}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === "team" ? "border-b-2 border-primary text-primary dark:text-red-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                    Team Members
                </button>
                <button
                    onClick={() => setActiveTab("catalogue")}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === "catalogue" ? "border-b-2 border-primary text-primary dark:text-red-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                    Catalogue
                </button>
                <button
                    onClick={() => setActiveTab("selling_points")}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === "selling_points" ? "border-b-2 border-primary text-primary dark:text-red-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                    Selling Points
                </button>
                <button
                    onClick={() => setActiveTab("pages")}
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === "pages" ? "border-b-2 border-primary text-primary dark:text-red-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                    Pages (Legal)
                </button>
            </div>

            {activeTab === "hero" && <HeroSettings />}
            {activeTab === "company" && <CompanySettings />}
            {activeTab === "about" && <AboutSettings />}
            {activeTab === "features" && <AboutFeaturesSettings />}
            {activeTab === "team" && <TeamSettings />}
            {activeTab === "catalogue" && <CatalogueSettings />}
            {activeTab === "selling_points" && <SellingPointsSettings />}
            {activeTab === "pages" && <PagesSettings />}

        </div>
    );
}

function HeroSettings() {
    const { addToast, removeToast } = useToast();
    const { confirm } = useConfirm();
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
            removeToast(toastId);
            addToast("Slide saved successfully!", "success");
        } catch (err) {
            console.error(err);
            removeToast(toastId);
            addToast("Failed to save slide", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!await confirm("Are you sure you want to delete this slide?", "Delete Slide")) return;
        const toastId = addToast("Deleting...", "loading", false);
        try {
            await api.delete(`hero/${id}/`);
            fetchSlides();
            removeToast(toastId);
            addToast("Slide deleted", "success");
        } catch (err) {
            removeToast(toastId);
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
                className="mb-4 bg-primary text-white outline-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
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
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function CompanySettings() {
    const { addToast, removeToast } = useToast();
    const [data, setData] = useState({
        name: "", email: "", phone: "", address: "",
        facebook_link: "", instagram_link: "", twitter_link: "",
        map_url: "", opening_hours: "", map_image: null, payment_image: null
    });
    const [loading, setLoading] = useState(true);
    const [infoId, setInfoId] = useState(null);
    const [previews, setPreviews] = useState({ map: null, payment: null });

    const fetchInfo = async () => {
        try {
            const res = await api.get("company_info/");
            if (res.data && res.data.length > 0) {
                const info = res.data[0];
                setData({
                    name: info.name,
                    email: info.email,
                    phone: info.phone,
                    address: info.address,
                    facebook_link: info.facebook_link,
                    instagram_link: info.instagram_link,
                    twitter_link: info.twitter_link,
                    map_url: info.map_url || "",
                    opening_hours: info.opening_hours || "",
                    map_image: null,
                    payment_image: null
                });
                setPreviews({ map: info.map_image, payment: info.payment_image });
                setInfoId(info.id);
            }
        } catch (err) {
            console.error("Failed to fetch info", err);
            addToast("Failed to fetch company info", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const handleCancel = () => {
        addToast("Changes discarded", "info");
        fetchInfo();
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const toastId = addToast("Saving...", "loading", false);

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null) {
                if ((key === 'map_image' || key === 'payment_image') && !(data[key] instanceof File)) {
                    // Skip if not a new file (retaining old)
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        try {
            if (infoId) {
                await api.patch(`company_info/${infoId}/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            } else {
                await api.post("company_info/", formData, { headers: { "Content-Type": "multipart/form-data" } });
            }
            fetchInfo(); // Refresh to get new image URLs
            removeToast(toastId);
            addToast("Company info saved successfully!", "success");
        } catch (err) {
            console.error(err);
            removeToast(toastId);
            addToast("Failed to save info.", "error");
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
                <div>
                    <label className="block text-sm font-medium mb-1">Map URL</label>
                    <input name="map_url" value={data.map_url} onChange={handleChange} placeholder="Google Maps Embed URL or Link" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Opening Hours (Line Separated)</label>
                    <textarea name="opening_hours" value={data.opening_hours} onChange={handleChange} rows={3} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Map Image (Fallback)</label>
                    <input type="file" onChange={e => setData({ ...data, map_image: e.target.files[0] })} className="w-full text-sm" accept="image/*" />
                    {previews.map && !data.map_image && <img src={previews.map} alt="Map" className="h-20 mt-2 object-cover rounded" />}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Payment Icons Image</label>
                    <input type="file" onChange={e => setData({ ...data, payment_image: e.target.files[0] })} className="w-full text-sm" accept="image/*" />
                    {previews.payment && !data.payment_image && <img src={previews.payment} alt="Payments" className="h-10 mt-2 object-contain" />}
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors mr-2"
                >
                    Cancel
                </button>
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
                    Save Changes
                </button>
            </div>
        </form>
    );
}

function AboutSettings() {
    const { addToast, removeToast } = useToast();
    const [data, setData] = useState({ about_us_content: "", about_image: null });
    const [loading, setLoading] = useState(true);
    const [infoId, setInfoId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const fetchInfo = async () => {
        try {
            const res = await api.get("company_info/");
            if (res.data && res.data.length > 0) {
                const info = res.data[0];
                setData({
                    about_us_content: info.about_us_content,
                    about_image: null
                });
                setPreviewImage(info.about_image);
                setInfoId(info.id);
            }
        } catch (err) {
            console.error("Failed to fetch info", err);
            addToast("Failed to fetch company info", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const handleCancel = () => {
        addToast("Changes discarded", "info");
        fetchInfo();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const toastId = addToast("Saving...", "loading", false);

        const formData = new FormData();
        formData.append("about_us_content", data.about_us_content);
        if (data.about_image instanceof File) {
            formData.append("about_image", data.about_image);
        }

        try {
            if (infoId) {
                await api.patch(`company_info/${infoId}/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            } else {
                await api.post("company_info/", formData, { headers: { "Content-Type": "multipart/form-data" } });
            }
            removeToast(toastId);
            addToast("About Us content saved successfully!", "success");
        } catch (err) {
            console.error(err);
            removeToast(toastId);
            addToast("Failed to save info.", "error");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow max-w-3xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FloppyDisk /> About Us Page Content</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Introduction Text</label>
                    <textarea
                        value={data.about_us_content}
                        onChange={e => setData({ ...data, about_us_content: e.target.value })}
                        rows={6}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Welcome to Saj Carpets. We believe in comfort and style..."
                    />
                    <p className="text-gray-500 text-sm mt-1">This text appears in the main intro section of the About Us page.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">About Image</label>
                    <input
                        type="file"
                        onChange={e => setData({ ...data, about_image: e.target.files[0] })}
                        className="w-full text-sm"
                        accept="image/*"
                    />
                    {previewImage && !data.about_image && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                            <img src={previewImage} alt="About Us" className="h-32 rounded object-cover" />
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors mr-2"
                >
                    Cancel
                </button>
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
                    Save Changes
                </button>
            </div>
        </form>
    );
}

function AboutFeaturesSettings() {
    const { addToast, removeToast } = useToast();
    const { confirm } = useConfirm();
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
            removeToast(toastId);
            addToast("Feature saved successfully!", "success");
        } catch (err) {
            console.error(err);
            removeToast(toastId);
            addToast("Failed to save feature", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!await confirm("Are you sure you want to delete this feature?", "Delete Feature")) return;
        const toastId = addToast("Deleting...", "loading", false);
        try {
            await api.delete(`about_features/${id}/`);
            fetchFeatures();
            removeToast(toastId);
            addToast("Feature deleted", "success");
        } catch (err) {
            removeToast(toastId);
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
                className="mb-4 bg-primary text-white outline-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
            >
                <Plus size={20} /> Add Feature
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map(feature => (
                    <div key={feature.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 relative group border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 dark:bg-primary/20 dark:text-red-400 rounded-lg flex items-center justify-center font-bold">
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
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function TeamSettings() {
    const { addToast, removeToast } = useToast();
    const { confirm } = useConfirm();
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
            addToast("Failed to fetch team members", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleDelete = async (id) => {
        if (!await confirm("Are you sure you want to remove this team member?", "Remove Team Member")) return;
        const toastId = addToast("Removing team member...", "loading", false);
        try {
            await api.delete(`team/${id}/`);
            setTeam(prev => prev.filter(t => t.id !== id));
            removeToast(toastId);
            addToast("Team member removed", "success");
        } catch (err) {
            console.error(err);
            removeToast(toastId);
            addToast("Failed to remove team member", "error");
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
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            const toastId = addToast("Saving team member...", "loading", false);

            if (editId) {
                await api.patch(`team/${editId}/`, data, config);
            } else {
                await api.post('team/', data, config);
            }
            setIsEditing(false);
            setEditId(null);
            setFormData({ name: "", role: "", bio: "", image: null });
            fetchTeam();
            removeToast(toastId);
            addToast("Team member saved successfully", "success");
        } catch (err) {
            console.error(err);
            setError("Failed to save team member. Please check your inputs.");
            removeToast(toastId);
            addToast("Failed to save team member", "error");
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
                <h2 className="text-xl font-bold flex items-center gap-2"> Manage Team Members</h2>
                <button
                    onClick={() => {
                        setFormData({ name: "", role: "", bio: "", image: null });
                        setError("");
                        setEditId(null);
                        setIsEditing(true);
                    }}
                    className="bg-primary text-white outline-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 font-medium text-sm"
                >
                    <Plus size={20} /> Add Member
                </button>
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

function CatalogueSettings() {
    const { addToast, removeToast } = useToast();
    const { confirm } = useConfirm();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "", category: "", order: 0, image: null });
    const [editId, setEditId] = useState(null);

    const fetchItems = async () => {
        try {
            const res = await api.get('catalogue/');
            setItems(res.data.results || res.data);
        } catch (err) {
            console.error(err);
            addToast("Failed to fetch catalogue items", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (!await confirm("Are you sure you want to remove this item?", "Remove Catalogue Item")) return;
        const toastId = addToast("Removing item...", "loading", false);
        try {
            await api.delete(`catalogue/${id}/`);
            setItems(prev => prev.filter(i => i.id !== id));
            removeToast(toastId);
            addToast("Item removed", "success");
        } catch (err) {
            removeToast(toastId);
            addToast("Failed to remove item", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("order", formData.order);
        if (formData.image instanceof File) {
            data.append("image", formData.image);
        }

        const toastId = addToast("Saving item...", "loading", false);
        try {
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            if (editId) {
                await api.patch(`catalogue/${editId}/`, data, config);
            } else {
                await api.post('catalogue/', data, config);
            }
            setIsEditing(false);
            setEditId(null);
            setFormData({ title: "", description: "", category: "", order: 0, image: null });
            fetchItems();
            removeToast(toastId);
            addToast("Item saved successfully", "success");
        } catch (err) {
            console.error(err);
            removeToast(toastId);
            addToast("Failed to save item", "error");
        }
    };

    const openEdit = (item) => {
        setFormData({
            title: item.title,
            description: item.description,
            category: item.category,
            order: item.order,
            image: null
        });
        setEditId(item.id);
        setIsEditing(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"> Manage Catalogue</h2>
                <button
                    onClick={() => {
                        setFormData({ title: "", description: "", category: "", order: 0, image: null });
                        setEditId(null);
                        setIsEditing(true);
                    }}
                    className="bg-primary text-white outline-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 font-medium text-sm"
                >
                    <Plus size={20} /> Add Item
                </button>
            </div>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={editId ? "Edit Item" : "New Item"}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category (comma separated)</label>
                        <input
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g. Beds, Luxury"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Order</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                            value={formData.order}
                            onChange={e => setFormData({ ...formData, order: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                        <input
                            type="file"
                            onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                            className="w-full text-sm text-gray-500 dark:text-gray-400"
                        />
                    </div>
                    <div className="flex gap-3 justify-end mt-4">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <Button size="small" type="submit">Save</Button>
                    </div>
                </form>
            </Modal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 relative group border border-gray-100 dark:border-gray-700">
                        {item.image && <img src={item.image} alt="" className="w-full h-40 object-cover rounded-lg mb-4" />}
                        <h3 className="font-bold text-lg dark:text-white">{item.title}</h3>
                        <p className="text-xs text-brand-red dark:text-brand-red-light mb-2">{item.category}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{item.description}</p>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(item)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-blue-600"><PencilSimple /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-red-600"><Trash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SellingPointsSettings() {
    const { addToast, removeToast } = useToast();
    const { confirm } = useConfirm();
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPoint, setEditingPoint] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", icon_name: "", order: 0 });

    const fetchPoints = async () => {
        try {
            const res = await api.get("selling_points/");
            setPoints(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to fetch selling points", err);
            addToast("Failed to fetch selling points", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = addToast("Saving...", "loading", false);
        try {
            if (editingPoint) {
                await api.patch(`selling_points/${editingPoint.id}/`, formData);
            } else {
                await api.post("selling_points/", formData);
            }
            setIsModalOpen(false);
            setEditingPoint(null);
            setFormData({ title: "", description: "", icon_name: "", order: 0 });
            fetchPoints();
            removeToast(toastId);
            addToast("Saved successfully!", "success");
        } catch (err) {
            console.error(err);
            removeToast(toastId);
            addToast("Failed to save.", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!await confirm("Are you sure you want to delete this item?", "Delete Selling Point")) return;
        const toastId = addToast("Deleting...", "loading", false);
        try {
            await api.delete(`selling_points/${id}/`);
            fetchPoints();
            removeToast(toastId);
            addToast("Deleted", "success");
        } catch (err) {
            removeToast(toastId);
            addToast("Failed to delete", "error");
        }
    };

    const openEdit = (point) => {
        setEditingPoint(point);
        setFormData({
            title: point.title,
            description: point.description,
            icon_name: point.icon_name,
            order: point.order
        });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">Selling Points (Service Guarantees)</h2>
                <button
                    onClick={() => { setEditingPoint(null); setFormData({ title: "", description: "", icon_name: "", order: 0 }); setIsModalOpen(true); }}
                    className="bg-primary text-white outline-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
                >
                    <Plus size={20} /> Add Point
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {points.map(point => (
                    <div key={point.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 relative group border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 dark:bg-primary/20 dark:text-red-400 rounded-lg flex items-center justify-center font-bold">
                                {(point.icon_name || "X").substring(0, 2)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{point.title}</h3>
                                <p className="text-xs text-gray-400">Icon: {point.icon_name} | Order: {point.order}</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">{point.description}</p>

                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(point)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-blue-600"><PencilSimple /></button>
                            <button onClick={() => handleDelete(point.id)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-red-600"><Trash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{editingPoint ? "Edit Point" : "New Point"}</h2>
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
                                <label className="block text-sm font-medium mb-1">Icon Name</label>
                                <input type="text" value={formData.icon_name} onChange={e => setFormData({ ...formData, icon_name: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                                <p className="text-xs text-gray-400 mt-1">Available: Package (Free Delivery), ArrowUUpLeft (Return), Money (Shipping/Currency)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Order</label>
                                <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function PagesSettings() {
    const { addToast, removeToast } = useToast();
    const { confirm } = useConfirm();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [formData, setFormData] = useState({ title: "", slug: "", content: "" });

    const fetchPages = async () => {
        try {
            const res = await api.get("infopages/");
            setPages(res.data);
        } catch (err) {
            console.error("Failed to fetch pages", err);
            addToast("Failed to fetch pages", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = addToast("Saving page...", "loading", false);
        try {
            if (editingPage) {
                await api.patch(`infopages/${editingPage.slug}/`, formData);
            } else {
                await api.post("infopages/", formData);
            }
            setIsModalOpen(false);
            setEditingPage(null);
            setFormData({ title: "", content: "" });
            fetchPages();
            removeToast(toastId);
            addToast("Page saved successfully!", "success");
        } catch (err) {
            console.error(err);
            removeToast(toastId);
            addToast("Failed to save page", "error");
        }
    };

    const handleDelete = async (slug) => {
        if (!await confirm("Are you sure you want to delete this page?", "Delete Page")) return;
        const toastId = addToast("Deleting...", "loading", false);
        try {
            await api.delete(`infopages/${slug}/`);
            fetchPages();
            removeToast(toastId);
            addToast("Page deleted", "success");
        } catch (err) {
            removeToast(toastId);
            addToast("Failed to delete page", "error");
        }
    };

    const openEdit = (page) => {
        setEditingPage(page);
        setFormData({
            title: page.title,
            slug: page.slug,
            content: typeof page.content === 'object' ? JSON.stringify(page.content, null, 2) : page.content
        });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><FloppyDisk /> Legal & Info Pages</h2>
                <button
                    onClick={() => { setEditingPage(null); setFormData({ title: "", content: "" }); setIsModalOpen(true); }}
                    className="bg-primary text-white outline-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 font-medium text-sm"
                >
                    <Plus size={20} /> Create Page
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map(page => (
                    <div key={page.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 relative group border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-lg">{page.title}</h3>
                        <p className="text-gray-500 text-sm mb-2">/{page.slug}</p>
                        <p className="text-xs text-gray-400 line-clamp-3">{String(page.content)}</p>

                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(page)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-blue-600"><PencilSimple /></button>
                            <button onClick={() => handleDelete(page.slug)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-red-600"><Trash /></button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editingPage ? "Edit Page" : "New Page"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Content (Text or JSON)</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                                    rows={15}
                                    required
                                    placeholder="Enter page content here..."
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
