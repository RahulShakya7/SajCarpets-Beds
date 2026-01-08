import Helmet from "../shared/Helmet";
import { useEffect, useState } from "react";
import api from "../../services/api";

const CategoryOptions = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('categories/');
                setCategories(res.data.results || res.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    // Fallback if no categories or loading
    if (categories.length === 0) {
        // Retain mock for visual if API empty, or show nothing
        // For now, let's just show a message or keep silent
        // But to satisfy "working", we should try to render what we get
        // If we simply rely on API and it's empty, user sees nothing. 
        // Let's add hardcoded fallback ONLY if list is empty for demo purposes if needed, 
        // but "implement all endpoints" means use API.
    }

    return (
        <div className="w-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
            <Helmet title="Our Catalogue" breadcrumb="Home / Our Catalogue" />
            <div className="w-full py-12 px-4 sm:px-8 md:px-16 lg:px-[300px] md:py-[72px] bg-white dark:bg-gray-950 transition-colors">
                <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8 text-center transition-colors">
                    Shop by Category
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="relative flex flex-col items-center justify-end h-80 sm:h-96 rounded-xl overflow-hidden cursor-pointer group"
                            style={{
                                // Use a placeholder if image field missing in serializer/model
                                backgroundImage: `url(${category.image || "https://c.animaapp.com/ypxcOp9T/img/carpets.png"})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-40 transition duration-300" />
                            <div className="relative z-10 flex flex-col items-center gap-2 p-6 text-center">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                    {category.name}
                                </h2>
                                <a
                                    href={`/shop/${category.slug || category.id}`}
                                    className="text-lg sm:text-xl md:text-2xl text-secondary underline mt-2 hover:text-white transition-colors"
                                >
                                    Shop Now
                                </a>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">
                            Loading categories or no categories found...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryOptions;
