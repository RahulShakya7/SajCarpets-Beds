import { useEffect, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { Copy, Image as ImageIcon } from "@phosphor-icons/react";

export default function AdminMedia() {
    const { addToast } = useToast();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchMedia = async () => {
        try {
            const res = await api.get('media/gallery/');
            setFiles(res.data);
        } catch (err) {
            console.error("Failed to fetch media", err);
            addToast("Failed to load media gallery", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        addToast("URL copied to clipboard", "success");
    };

    // Group files by folder for filtering
    const folders = ["all", ...new Set(files.map(f => f.folder))];

    const filteredFiles = filter === "all"
        ? files
        : files.filter(f => f.folder === filter);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Media Library...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Media Library</h1>
                <select
                    className="p-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 hover:border-primary focus:ring-2 focus:ring-primary outline-none"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    {folders.map(folder => (
                        <option key={folder} value={folder}>{folder === 'all' ? 'All Folders' : folder}</option>
                    ))}
                </select>
            </div>

            {filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No images found in this folder.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredFiles.map((file, idx) => (
                        <div key={idx} className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => window.open(file.url, '_blank')}
                                        className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white"
                                        title="View Full Size"
                                    >
                                        <ImageIcon size={20} />
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(file.url)}
                                        className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white"
                                        title="Copy URL"
                                    >
                                        <Copy size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate" title={file.name}>
                                    {file.name}
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 truncate">
                                    {file.folder}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
