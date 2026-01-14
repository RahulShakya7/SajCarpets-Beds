import { List, SquaresFour } from "@phosphor-icons/react";
import Helmet from "../components/shared/Helmet";
import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/shared/ProductCard";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export default function Shop() {
    const { addToast } = useToast();
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [selectedView, setSelectedView] = useState("grid");
    const [sortBy, setSortBy] = useState("");
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeTag, setActiveTag] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get("search");
        if (q) setSearchQuery(q);
    }, [location.search]);

    const tags = ["Discount", "Deal"];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('categories/');
                setCategories(res.data.results || res.data);
            } catch (err) {
                console.error("Categories Load Error:", err);
                // Don't block main UI for categories
            }
        };

        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch generic large amount to support client-side filtering
                const res = await api.get('products/?page_size=100');
                setProducts(res.data.results || res.data);
            } catch (err) {
                console.error("Products Load Error:", err);
                addToast("Failed to load products", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchProducts();
    }, []);

    // Filtering and Sorting Logic
    const filteredProducts = useMemo(() => {
        let list = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Search Filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        }

        // Category Filter
        if (activeCategory) {
            list = list.filter((p) => {
                const pCatName = p.category_name || p.category?.name || ""; // expanded safety
                // If backend returns category ID, we might need to map. 
                // Assuming backend serializer returns category name or object with name.
                // Let's allow loose matching or check if product.category matches category.id if activeCategory is ID.
                // But here activeCategory is the object or name strings from 'categories' state.

                // If categories state contains objects:
                if (typeof activeCategory === 'object') {
                    return p.category === activeCategory.id || p.category?.id === activeCategory.id || p.category_name === activeCategory.name;
                }
                // fallback if strings
                return String(pCatName).toLowerCase() === String(activeCategory).toLowerCase();
            });
        }

        // Tag Filter (Mock/Discount logic)
        if (activeTag) {
            if (activeTag === "Discount" || activeTag === "Deal") {
                list = list.filter(p => p.discount_price && Number(p.discount_price) > 0);
            }
        }

        switch (sortBy) {
            case "price-asc":
                list.sort((a, b) => Number(a.price) - Number(b.price));
                break;
            case "price-desc":
                list.sort((a, b) => Number(b.price) - Number(a.price));
                break;
            case "newest":
                list.sort((a, b) => b.id - a.id);
                break;
            case "az":
                list.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "za":
                list.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        return list;
    }, [products, priceRange, activeCategory, activeTag, sortBy, searchQuery]);

    // Price Slider Control
    const minPrice = 0;
    const maxPrice = 2000;
    const handleMinChange = (v) => setPriceRange(([_, high]) => [Math.min(v, high - 1), high]);
    const handleMaxChange = (v) => setPriceRange(([low, _]) => [low, Math.max(v, low + 1)]);

    const leftPercent = ((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100;
    const rightPercent = ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100;

    return (
        <div className="w-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
            <Helmet title="Shop" breadcrumb="Home / Shop" />
            <div className="min-h-screen bg-white dark:bg-gray-950 font-open-sans px-4 py-12 sm:px-8 md:px-12 lg:px-24 xl:px-48 2xl:px-[300px] transition-colors">

                {/* Filters and Sort Bar */}
                <div className="flex flex-col gap-4 mb-12">
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Search Input */}
                        <div className="w-full md:w-auto flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-4 self-end md:self-auto">
                            {/* View Toggle */}
                            <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                <button onClick={() => setSelectedView("grid")} className={`p-2 rounded ${selectedView === "grid" ? "bg-white dark:bg-gray-700 shadow text-primary dark:text-red-400" : "text-gray-500"}`}>
                                    <SquaresFour size={20} />
                                </button>
                                <button onClick={() => setSelectedView("list")} className={`p-2 rounded ${selectedView === "list" ? "bg-white dark:bg-gray-700 shadow text-primary dark:text-red-400" : "text-gray-500"}`}>
                                    <List size={20} />
                                </button>
                            </div>

                            {/* Sorting */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                            >
                                <option value="">Sort By</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="newest">Newest</option>
                                <option value="az">Name: A-Z</option>
                                <option value="za">Name: Z-A</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Categories</h3>
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className={`text-left px-3 py-2 rounded transition-colors ${!activeCategory ? "bg-primary-50 text-primary font-medium dark:bg-primary/10 dark:text-red-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                                >
                                    All Categories
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id || category}
                                        onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                                        className={`text-left px-3 py-2 rounded transition-colors ${activeCategory === category ? "bg-primary-50 text-primary font-medium dark:bg-primary/10 dark:text-red-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                                    >
                                        {category.name || category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Price</h3>
                            <div className="px-1">
                                <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded mb-6 mt-2">
                                    <div className="absolute h-1 bg-primary rounded" style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }} />
                                    <input
                                        type="range"
                                        min={minPrice}
                                        max={maxPrice}
                                        value={priceRange[0]}
                                        onChange={(e) => handleMinChange(Number(e.target.value))}
                                        className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
                                    />
                                    <input
                                        type="range"
                                        min={minPrice}
                                        max={maxPrice}
                                        value={priceRange[1]}
                                        onChange={(e) => handleMaxChange(Number(e.target.value))}
                                        className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
                                    />
                                    {/* Thumbs visual hack or rely on browser default for now, standard range inputs stack weirdly without custom css. 
                                        Creating a simple visual feedback below 
                                    */}
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded border dark:border-gray-700">£{priceRange[0]}</div>
                                    <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded border dark:border-gray-700">£{priceRange[1]}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Product Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                        className={`px-4 py-2 border rounded-lg text-sm ${activeTag === tag ? "border-primary text-primary dark:text-red-400" : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:text-red-400"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Products Section */}
                    <div className="flex-1">
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${selectedView === "grid" ? "3" : "1"} gap-8`}>
                            {loading ? (
                                <div className="col-span-full text-center py-20 text-gray-500">Loading shop...</div>
                            ) : filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} view={selectedView} />
                            ))}
                            {!loading && filteredProducts.length === 0 && (
                                <div className="col-span-full text-center py-12 text-gray-500">No products found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
