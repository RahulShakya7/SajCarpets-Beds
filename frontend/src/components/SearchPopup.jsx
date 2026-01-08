import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SearchPopup({ isOpen, onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                // Placeholder API call
                // const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                // const data = await res.json();
                const data = []; // Mock empty results
                setResults(data);
            } catch (error) {
                console.error("Search error:", error);
            }
            setLoading(false);
        };

        const debounce = setTimeout(fetchResults, 300); // debounce input
        return () => clearTimeout(debounce);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start p-4 md:p-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl p-6 md:p-8 shadow-lg">
                <div className="flex items-center gap-4">
                    <MagnifyingGlass size={24} weight="bold" className="text-gray-500 dark:text-gray-400" />
                    <input
                        type="text"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="flex-1 p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
                    />
                    <button onClick={onClose}>
                        <X size={24} weight="bold" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                    </button>
                </div>

                <div className="mt-4 max-h-64 overflow-y-auto">
                    {loading && <p className="text-gray-500">Loading...</p>}
                    {!loading && results.length === 0 && query && (
                        <p className="text-gray-500">No results found.</p>
                    )}
                    <ul>
                        {results.map((item) => (
                            <li key={item.id} className="py-2 border-b border-gray-200 dark:border-gray-700">
                                <Link to={`/product/${item.id}`} className="flex flex-col" onClick={onClose}>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.description}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
