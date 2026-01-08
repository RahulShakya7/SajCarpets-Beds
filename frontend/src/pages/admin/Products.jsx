import { Pencil, Trash, Plus, UploadSimple, X } from "@phosphor-icons/react";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "../../components/Modal";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category: "",
        description: "",
        price: "",
        discount_price: "",
        stock: 0,
        is_active: true,
        images: []
    });

    const fetchProducts = async () => {
        try {
            const res = await api.get('productscrud/');
            setProducts(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('categories/');
            setCategories(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`productscrud/${id}/`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            // Convert FileList to Array
            const files = Array.from(e.target.files);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...files]
            }));
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Auto-generate slug from name
    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        setFormData(prev => ({ ...prev, name, slug }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const data = new FormData();
        data.append("name", formData.name);
        data.append("slug", formData.slug);
        data.append("category", formData.category);
        data.append("description", formData.description);
        data.append("price", formData.price);
        if (formData.discount_price) data.append("discount_price", formData.discount_price);
        data.append("stock", formData.stock);
        data.append("is_active", formData.is_active);

        // Append images
        formData.images.forEach((file) => {
            if (file instanceof File) {
                data.append("uploaded_images", file);
            }
        });

        try {
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            if (editId) {
                await api.patch(`productscrud/${editId}/`, data, config);
            } else {
                await api.post('productscrud/', data, config);
            }
            setIsEditing(false);
            setEditId(null);
            resetForm();
            fetchProducts();
        } catch (err) {
            console.error(err);
            setError("Failed to save product. Check inputs (slug must be unique).");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            slug: "",
            category: "",
            description: "",
            price: "",
            discount_price: "",
            stock: 0,
            is_active: true,
            images: []
        });
        setError("");
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            slug: product.slug,
            category: product.category, // This interacts with the Select value
            description: product.description,
            price: product.price,
            discount_price: product.discount_price || "",
            stock: product.stock,
            is_active: product.is_active,
            images: [] // We don't preload existing images into 'files' array for now
        });
        setEditId(product.id);
        setIsEditing(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Products</h1>
                <Button size="small" className="gap-2" onClick={() => {
                    resetForm();
                    setEditId(null);
                    setIsEditing(true);
                }}>
                    <Plus size={20} /> Add Product
                </Button>
            </div>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={editId ? "Edit Product" : "New Product"}>
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                            <input
                                type="number"
                                className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount Price</label>
                            <input
                                type="number"
                                step="0.01"
                                className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none"
                                value={formData.discount_price}
                                onChange={e => setFormData({ ...formData, discount_price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Images</label>
                        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative cursor-pointer">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-2">
                                <UploadSimple size={24} />
                                <span className="text-sm">Click to upload multiple images</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.images.map((file, i) => (
                                <div key={i} className="relative w-16 h-16 rounded overflow-hidden group">
                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
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
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                        ) : products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200">
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    {product.images && product.images.length > 0 ? (
                                        <img src={product.images[0].image} alt="" className="w-10 h-10 rounded-md object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
                                    )}
                                    {product.name}
                                </td>
                                <td className="px-6 py-4">{product.category_name || product.category}</td>
                                <td className="px-6 py-4">£{product.price}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4 flex justify-end gap-2">
                                    <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:hover:bg-blue-900/30">
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
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
