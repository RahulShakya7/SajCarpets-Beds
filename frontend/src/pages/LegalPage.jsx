import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Helmet from "../components/shared/Helmet";

export default function LegalPage({ defaultSlug }) {
    const { slug: paramSlug } = useParams();
    const slug = defaultSlug || paramSlug; // Use prop if available, else param
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                // Fetch all info pages and filter for ease (slug lookup endpoint would be better but list is small)
                const res = await api.get(`infopages/`);
                // Backend filter by slug would be cleaner -> api.get('infopages/?slug=${slug}') if implemented
                // For now, client side find or if lookup_field works: api.get(`infopages/${slug}/`)
                const found = res.data.find(p => p.slug === slug);
                if (found) {
                    setPageData(found);
                } else {
                    // Try direct lookup if list didn't work or find
                    try {
                        const directRes = await api.get(`infopages/${slug}/`);
                        setPageData(directRes.data);
                    } catch (e) {
                        // Page not found
                        setPageData(null);
                    }
                }
            } catch (err) {
                console.error("Failed to load page content", err);
                addToast("Failed to load content", "error");
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPage();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
                <p className="text-xl text-gray-500">Page not found</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
            <Helmet title={pageData.title} breadcrumb={`Home / ${pageData.title}`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 sm:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                        {pageData.title}
                    </h1>

                    <div className="prose dark:prose-invert max-w-none">
                        {/* Simple rendering for text content. For HTML/Markdown, would need a parser */}
                        <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                            {/* Assuming content is stored as JSON or simple text for now based on model */}
                            {typeof pageData.content === 'object'
                                ? JSON.stringify(pageData.content, null, 2)
                                : pageData.content
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
