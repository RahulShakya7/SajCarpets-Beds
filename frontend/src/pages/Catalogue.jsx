import Helmet from "../components/shared/Helmet";
import CatalogueCard from "../components/CatalogueCard";
import { useMemo, useState, useEffect } from "react";
import api from "../services/api";
import { X } from "@phosphor-icons/react";
import Button from "../components/Button";

export default function Catalogue() {
    const [q, setQ] = useState("");
    const [cat, setCat] = useState("all");
    const [sortBy, setSortBy] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchCatalogue = async () => {
            try {
                const res = await api.get("catalogue/");
                setItems(res.data.results || res.data);
            } catch (err) {
                console.error("Failed to fetch catalogue", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCatalogue();
    }, []);

    const allCategories = useMemo(() => {
        const set = new Set();
        items.forEach((it) => {
            (it.category || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .forEach((c) => set.add(c));
        });
        return ["all", ...Array.from(set)];
    }, [items]);

    const filtered = useMemo(() => {
        let list = items.slice();

        if (q.trim()) {
            const needle = q.toLowerCase();
            list = list.filter(
                (it) =>
                    it.title.toLowerCase().includes(needle) ||
                    (it.description || "").toLowerCase().includes(needle)
            );
        }

        if (cat !== "all") {
            list = list.filter((it) =>
                (it.category || "")
                    .split(",")
                    .map((s) => s.trim())
                    .includes(cat)
            );
        }

        if (sortBy === "az") list.sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === "za") list.sort((a, b) => b.title.localeCompare(a.title));

        return list;
    }, [q, cat, sortBy, items]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <Helmet title="Product Catalogue" breadcrumb="Home / Catalogue" />
            <div className="px-6 py-16 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-[300px]">
                <header className="mb-8 sm:mb-10">
                    <div className="flex flex-wrap items-end gap-3">
                        <h1 className="font-open-sans font-bold text-4xl sm:text-5xl lg:text-[49px] leading-[120%] text-[#b23017] dark:text-primary">
                            Product Catalogue
                        </h1>
                        <span className="font-open-sans text-2xl sm:text-3xl lg:text-[31px] leading-[120%] text-[#c5c5c5]">
                            ({items.length} {items.length === 1 ? "Product" : "Products"})
                        </span>
                    </div>
                    <p className="mt-4 text-[#444] dark:text-gray-300 text-lg sm:text-xl leading-[132%]">
                        Explore our exclusive collection of beds, carpets, and accessories.
                    </p>
                </header>

                <div className="flex flex-col gap-8">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

                        {/* Search */}
                        <div className="flex-1">
                            <label className="sr-only" htmlFor="catalogue-search">Search</label>
                            <input
                                id="catalogue-search"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search by name or description…"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base outline-none focus:border-[#b23017] dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Category:</label>
                            <select
                                value={cat}
                                onChange={(e) => setCat(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm dark:text-white"
                            >
                                {allCategories.map((c) => (
                                    <option key={c} value={c}>
                                        {c === "all" ? "All" : c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 dark:text-gray-400">Sort:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm dark:text-white"
                            >
                                <option value="">Default</option>
                                <option value="az">A → Z</option>
                                <option value="za">Z → A</option>
                            </select>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid gap-6 md:gap-8 grid-cols-1">
                        {loading ? (
                            <div className="text-center py-20 text-gray-500">Loading catalogue...</div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                {filtered.map((item) => (
                                    <CatalogueCard
                                        key={item.id}
                                        item={item}
                                        onViewDetails={setSelectedItem}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && filtered.length === 0 && (
                            <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                                <p className="text-gray-700 dark:text-gray-400">No items match your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in">

                        {/* Modal Header (Image handled in body for responsive) */}
                        <div className="relative">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full shadow-lg transition-all"
                            >
                                <X size={24} className="text-gray-800 dark:text-white" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto overflow-x-hidden flex-1 flex flex-col">
                            {/* Image Section */}
                            <div className="w-full h-64 md:h-96 relative bg-gray-100 dark:bg-gray-900 flex-shrink-0">
                                <img
                                    src={selectedItem.image}
                                    alt={selectedItem.title}
                                    className="w-full h-full object-cover absolute inset-0"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="w-full p-6 md:p-10 flex flex-col gap-6">
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {(selectedItem.category || "").split(",").map(c => c.trim()).filter(Boolean).map((badge, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-primary-50 dark:bg-primary/10 text-primary dark:text-red-400 text-xs font-bold uppercase tracking-wider rounded-full">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                                        {selectedItem.title}
                                    </h2>
                                </div>

                                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                    {selectedItem.description.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="mb-4">{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-800/50">
                            <Button onClick={() => setSelectedItem(null)} className="w-full md:w-auto">
                                Close Details
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
