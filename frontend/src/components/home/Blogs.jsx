import BlogCard from "../shared/BlogCard";

const blogs = [
    {
        id: 1,
        title: "The Ultimate Guide to Choosing Your Perfect Bed",
        date: "8th August, 2025",
        likes: 25,
        image: "https://c.animaapp.com/ypxcOp9T/img/image-8.svg",
    },
    {
        id: 2,
        title: "Top 10 Carpets to Elevate Your Living Room",
        date: "10th August, 2025",
        likes: 18,
        image: "https://c.animaapp.com/ypxcOp9T/img/image-9.svg",
    },
    {
        id: 3,
        title: "How to Pick the Right Rug for Your Space",
        date: "12th August, 2025",
        likes: 32,
        image: "https://c.animaapp.com/ypxcOp9T/img/image-10.svg",
    },
];

export default function Blogs() {
    return (
        <div className="bg-blue-50 dark:bg-gray-900 px-4 sm:px-8 md:px-16 lg:px-[300px] py-12 md:py-[72px] transition-colors">
            {/* Heading */}
            <div className="flex flex-col items-center gap-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">Blogs</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">Our Blog Posts</p>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>
        </div>
    );
}
