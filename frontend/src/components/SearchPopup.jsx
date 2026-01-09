import api from "../services/api";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SearchPopup({ isOpen, onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await api.get('products/?limit=100');
                const products = res.data.results || res.data;
                const filtered = products.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
                ).slice(0, 5);
                setResults(filtered);
            } catch (error) {
                console.error("Search error:", error);
            }
            setLoading(false);
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onClose();
        navigate(`/shop?search=${encodeURIComponent(query)}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start p-4 md:p-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl p-6 md:p-8 shadow-lg">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
                    <MagnifyingGlass size={24} weight="bold" className="text-gray-500 dark:text-gray-400" />
                    <input
                        type="text"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
                    />
                    <button type="button" onClick={onClose}>
                        <X size={24} weight="bold" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                    </button>
                    <button type="submit" className="hidden">Submit</button>
                </form>

                <div className="mt-4 max-h-64 overflow-y-auto">
                    {loading && <p className="text-gray-500">Loading...</p>}
                    {!loading && results.length === 0 && query && (
                        <p className="text-gray-500">No results found.</p>
                    )}
                    <ul>
                        {results.map((item) => (
                            <li key={item.id} className="py-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded">
                                <Link to={`/product/${item.slug || item.id}`} className="flex flex-col" onClick={onClose}>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</span>
                                    {item.price && <span className="text-primary font-bold">£{item.price}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {query && results.length > 0 && (
                        <div className="mt-4 text-center">
                            <button onClick={handleSearchSubmit} className="text-primary font-bold hover:underline">
                                View all results for "{query}"
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
