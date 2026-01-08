import { List, SquaresFour } from "@phosphor-icons/react";
import Helmet from "../components/shared/Helmet";
import { useMemo, useState, useEffect } from "react";
import ProductCard from "../components/shared/ProductCard";
import api from "../services/api";

export default function Shop() {
    const [priceRange, setPriceRange] = useState([50, 1200]);
    const [selectedView, setSelectedView] = useState("grid");
    const [sortBy, setSortBy] = useState("");
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeTag, setActiveTag] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ["beds", "carpets", "rugs"]; // Removed "By Fabric" etc for now to match backend category slugs
    const tags = ["Pattern", "Discount", "Price Drop", "Student Discount", "Deal"];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('products/');
                setProducts(res.data.results || res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filtering and Sorting Logic
    const filteredProducts = useMemo(() => {
        let list = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

        if (activeCategory) {
            // Backend categories might be objects or strings. Assuming we map to slug or name.
            // For simple match:
            list = list.filter((p) => {
                const catName = p.category_name || p.category; // Handle various serializations
                return String(catName).toLowerCase() === activeCategory.toLowerCase();
            });
        }

        if (activeTag) {
            // No tag field in backend currently, so this is just client-side filtering on mock tags if they existed
            // For now, we skip or filter randomly for demo
            // list = list.filter((p) => p.id % 3 === (tags.indexOf(activeTag) % 3));
        }

        switch (sortBy) {
            case "price-asc":
                list.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                list.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                list.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }

        return list;
    }, [products, priceRange, activeCategory, activeTag, sortBy]);

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
            <div className="min-h-screen bg-white dark:bg-gray-950 font-open-sans px-6 py-12 sm:px-12 lg:px-24 xl:px-48 transition-colors">

                {/* Filters and Sort Bar */}
                <div className="flex flex-col gap-4 mb-12">
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {/* View Toggle */}
                        <div className="flex items-center gap-6">
                            <button onClick={() => setSelectedView("grid")} className={`transition ${selectedView === "grid" ? "opacity-100 text-primary" : "opacity-50 text-gray-500"}`}>
                                <SquaresFour size={24} />
                            </button>
                            <button onClick={() => setSelectedView("list")} className={`transition ${selectedView === "list" ? "opacity-100 text-primary" : "opacity-50 text-gray-500"}`}>
                                <List size={24} />
                            </button>
                        </div>

                        {/* Sorting */}
                        <div className="flex items-center gap-4">
                            <span className="text-base text-gray-700 dark:text-gray-300">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                            >
                                <option value="">Select</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Product Categories</h3>
                            <div className="flex flex-col gap-2">
                                {categories.map((category, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                                        className={`text-left px-3 py-2 rounded capitalize ${activeCategory === category ? "bg-gray-100 dark:bg-gray-800 font-bold text-primary" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Price Filter</h3>
                            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded mb-4">
                                <div className="absolute h-2 bg-primary rounded" style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }} />
                            </div>
                            <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300">
                                <span>£{priceRange[0]}</span> - <span>£{priceRange[1]}</span>
                            </div>
                            <input type="range" min={minPrice} max={maxPrice} value={priceRange[0]} onChange={(e) => handleMinChange(Number(e.target.value))} className="w-full" />
                            <input type="range" min={minPrice} max={maxPrice} value={priceRange[1]} onChange={(e) => handleMaxChange(Number(e.target.value))} className="w-full" />
                        </div>

                        {/* Tags */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Product Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                        className={`px-4 py-2 border rounded-lg text-sm ${activeTag === tag ? "border-primary text-primary" : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary"
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
