import Helmet from "../components/shared/Helmet";
import CatalogueCard from "../components/CatalogueCard";
import { useMemo, useState } from "react";

// Fallback data as API currently has no public catalogue endpoint (concept distinct from products?)
// The reference project used local data.
const initialItems = [
    {
        id: 1,
        title: "The Emerald Grass",
        category: "Artificial Grass, Outdoor",
        description:
            "Low-maintenance, year-round green space with a lush natural look. Durable & weather-resistant.",
        image: "https://c.animaapp.com/ypxcOp9T/img/image-8.svg",
    },
    {
        id: 2,
        title: "The Kensington Loop",
        category: "Loop Pile, High-Traffic",
        description:
            "Durable and elegant. Tightly woven loop pile resists wear—great for hallways and living rooms.",
        image: "https://c.animaapp.com/ypxcOp9T/img/image-9.svg",
    },
    {
        id: 3,
        title: "The Mayfair Saxony",
        category: "Cut Pile, Luxury",
        description:
            "Deep, plush Saxony comfort—perfect for bedrooms. Rich, luxurious colors.",
        image: "https://c.animaapp.com/ypxcOp9T/img/image-10.svg",
    },
    {
        id: 4,
        title: "The Hampshire Weave",
        category: "Wool, Natural Fibre",
        description:
            "Classic wool softness, resilience, and insulation. Naturally stain-resistant; timeless look.",
        image: "https://c.animaapp.com/ypxcOp9T/img/image-8.svg",
    },
    {
        id: 5,
        title: "The Regent Flatweave",
        category: "Flatweave, Natural Fibre",
        description:
            "Low-profile texture ideal for busy rooms; easy to clean and beautifully understated.",
        image: "https://c.animaapp.com/ypxcOp9T/img/image-9.svg",
    },
    {
        id: 6,
        title: "The Camden Pattern",
        category: "Pattern, Statement",
        description:
            "Bold geometric pattern that pulls a room together and adds visual interest.",
        image: "https://c.animaapp.com/ypxcOp9T/img/image-10.svg",
    },
];

export default function Catalogue() {
    const [q, setQ] = useState("");
    const [cat, setCat] = useState("all");
    const [sortBy, setSortBy] = useState("");

    const allCategories = useMemo(() => {
        const set = new Set();
        initialItems.forEach((it) => {
            (it.category || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .forEach((c) => set.add(c));
        });
        return ["all", ...Array.from(set)];
    }, []);

    const filtered = useMemo(() => {
        let list = initialItems.slice();

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
    }, [q, cat, sortBy]);

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
                            ({initialItems.length} {initialItems.length === 1 ? "Product" : "Products"})
                        </span>
                    </div>
                    <p className="mt-4 text-[#444] dark:text-gray-300 text-lg sm:text-xl leading-[132%]">
                        Explore durable loop piles, plush Saxonies, natural wool weaves, and bold patterned rugs.
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            {filtered.map((item) => (
                                <CatalogueCard key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Empty state */}
                        {filtered.length === 0 && (
                            <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                                <p className="text-gray-700 dark:text-gray-400">No items match your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
