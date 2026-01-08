import { useEffect, useState } from "react";
import ProductCard from "../shared/ProductCard";
import api from "../../services/api";

const tabs = ["all", "rugs", "beds"];

export default function ProductList() {
    const [activeTab, setActiveTab] = useState("all");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = 'products/';
                if (activeTab !== 'all') {
                    url += `?category__slug=${activeTab}`;
                }
                const res = await api.get(url);
                // Handle pagination result from DRF
                const results = res.data.results ? res.data.results : res.data;
                setProducts(results);
            } catch (err) {
                console.error("Failed to fetch products", err);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [activeTab]);

    return (
        <div className="bg-blue-50 dark:bg-gray-950 px-4 sm:px-8 md:px-16 lg:px-[200px] xl:px-[300px] py-12 md:py-[72px] transition-colors">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl text-black dark:text-white font-bold text-center mb-8">
                Featured Products
            </h2>

            {/* Tabs */}
            <div className="flex justify-center gap-6 mb-12">
                {tabs.map((tab, index) => (
                    <div key={tab} className="flex items-center">
                        <button
                            onClick={() => setActiveTab(tab)}
                            className={`uppercase text-xl transition ${activeTab === tab ? "text-primary font-bold" : "text-gray-400 dark:text-gray-500"
                                }`}
                        >
                            {tab}
                        </button>
                        {index < tabs.length - 1 && (
                            <span className="mx-6 text-gray-200 dark:text-gray-700">•</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 lg:gap-12">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-gray-500">Loading products...</div>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="flex items-center justify-center h-[350px] col-span-full">
                        <p className="text-gray-500 text-xl font-semibold text-center">
                            No products found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
