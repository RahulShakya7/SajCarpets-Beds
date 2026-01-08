import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Calendar, User as UserIcon } from "@phosphor-icons/react";
import Placeholder from "../components/shared/Placeholder";

export default function BlogDetails() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await api.get(`blogs/${id}/`);
                setBlog(res.data);
            } catch (err) {
                console.error("Failed to fetch blog", err);
                setError("Blog post not found.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error || !blog) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{error || "Blog not found"}</h2>
            <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
                <ArrowLeft /> Back to Blogs
            </Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 lg:px-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Blogs</span>
            </Link>

            <article className="flex flex-col gap-6">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    {blog.title}
                </h1>

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                    {blog.author && (
                        <div className="flex items-center gap-2">
                            <UserIcon size={18} />
                            <span>{blog.author}</span>
                        </div>
                    )}
                </div>

                <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 my-4">
                    {blog.image ? (
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Placeholder className="w-full h-full text-gray-300" />
                    )}
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                    {/* Render content appropriately - standard text or HTML if needed */}
                    <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
                </div>
            </article>
        </div>
    );
}
