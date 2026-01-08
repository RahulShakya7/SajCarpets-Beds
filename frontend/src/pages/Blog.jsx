import { useEffect, useState } from "react";
import Helmet from "../components/shared/Helmet";
import BlogCard from "../components/shared/BlogCard";
import api from "../services/api";

export default function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await api.get('blogs/');
                setBlogs(res.data.results || res.data);
            } catch (err) {
                console.error("Failed to load blogs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="w-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
            <Helmet title="Blog" breadcrumb="Home / Blogs" />
            <div className="bg-blue-50 dark:bg-gray-950 px-4 sm:px-8 md:px-16 lg:px-[300px] py-12 md:py-[72px] transition-colors">
                <div className="flex flex-col items-center gap-4 mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">Blogs</h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300">Get the latest insights and trends</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading blogs...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                        {blogs.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">No blogs found.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
