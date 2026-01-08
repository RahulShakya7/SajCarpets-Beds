import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Button from "../components/Button";
import CountdownTimer from "../components/Countdown";
import StarRating from "../components/StarRating";
import ProductCard from "../components/shared/ProductCard";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await api.get(`products/${id}/`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    const productImages = product.images && product.images.length > 0 ? product.images.map(i => i.image) : [product.image || "/images/placeholder.png"];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-open-sans transition-colors">
            <div className="px-4 sm:px-8 md:px-16 lg:px-[300px] py-12 md:py-16">
                <div className="flex flex-col lg:flex-row items-start gap-12">
                    {/* Product Images */}
                    <div className="w-full lg:w-[596px] flex flex-col gap-6">
                        <div className="relative">
                            <img
                                src={productImages[selectedImage]}
                                alt={product.name}
                                className="w-full h-[400px] lg:h-[717px] object-cover rounded-lg"
                            />
                        </div>

                        {/* Thumbnails */}
                        {productImages.length > 1 && (
                            <div className="flex gap-6 overflow-x-auto">
                                {productImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`w-32 h-44 object-cover rounded cursor-pointer transition-opacity ${selectedImage === index ? "border-2 border-primary" : "hover:opacity-80"}`}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 w-full flex flex-col gap-4 text-left">
                        <h1 className="text-2xl font-open-sans font-bold text-gray-900 dark:text-white leading-8">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-3">
                            <StarRating rating={4.5} /> {/* Mock rating for now */}
                            <span className="text-base font-montserrat text-gray-600 dark:text-gray-400">
                                (0 customer reviews)
                            </span>
                        </div>

                        <div className="mb-4">
                            <div className="text-2xl font-montserrat text-primary">
                                <span className="font-normal">£{product.discount_price || product.price} </span>
                                {product.discount_price && (
                                    <span className="line-through text-gray-400 text-lg ml-2">£{product.price}</span>
                                )}
                            </div>
                        </div>

                        <p className="text-base font-montserrat text-gray-700 dark:text-gray-300 leading-6 mb-6">
                            {product.description}
                        </p>

                        <div className="mb-6">
                            <CountdownTimer />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="text-xl font-open-sans font-bold text-gray-400">
                                In Stock
                            </span>

                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-28 px-3 py-3 text-center text-xl font-montserrat border-0 bg-transparent outline-none text-gray-900 dark:text-white"
                                    min="1"
                                />
                            </div>

                            <Button className="bg-primary text-white px-6 py-3 rounded-lg text-xl font-open-sans font-bold uppercase hover:bg-opacity-90 transition-colors">
                                Enquire Now
                            </Button>
                        </div>

                        <div className="flex gap-6 mb-6">
                            <Button className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-lg text-base text-gray-400">
                                Wishlist
                            </Button>
                            <Button className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-lg text-base text-gray-400">
                                Compare
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-12 border-t border-b border-gray-200 dark:border-gray-700">
                    <div className="py-6">
                        <div className="flex justify-center mb-8 gap-12">
                            <button onClick={() => setActiveTab("description")} className={`text-xl font-medium ${activeTab === "description" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}>Description</button>
                            <button onClick={() => setActiveTab("reviews")} className={`text-xl font-medium ${activeTab === "reviews" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}>Reviews</button>
                        </div>

                        <div className="pb-8 text-gray-700 dark:text-gray-300">
                            {activeTab === "description" && <p>{product.description}</p>}
                            {activeTab === "reviews" && <p>No reviews yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
