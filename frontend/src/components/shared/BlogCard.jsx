import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
    return (
        <Link to={`/blog/${blog.id}`}>
            <div className="cursor-pointer bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-56 object-cover"
                />
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-black dark:text-gray-100">{blog.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{blog.date}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">{blog.likes} Likes</p>
                </div>
            </div>
        </Link>
    );
}
