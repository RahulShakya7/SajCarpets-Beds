import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/shared/ProductCard";
import Button from "../components/Button";

export default function Wishlist() {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors py-12 px-4 sm:px-8 md:px-16 lg:px-[300px]">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-open-sans font-bold text-gray-900 dark:text-white">
                    My Wishlist
                </h1>
                {wishlist.length > 0 && (
                    <Button
                        onClick={clearWishlist}
                        className="mt-4 sm:mt-0 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition tracking-wide text-sm font-semibold"
                    >
                        Clear Wishlist
                    </Button>
                )}
            </div>

            {wishlist.length === 0 ? (
                <div className="text-center flex flex-col items-center justify-center min-h-[40vh] bg-gray-50 dark:bg-gray-800 rounded-lg p-8 shadow-sm">
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 font-montserrat">
                        Your wishlist is completely empty.
                    </p>
                    <Link to="/shop">
                        <Button className="px-8 py-3 bg-primary text-white rounded-md font-semibold text-lg shadow-md hover:bg-primary-dark transition">
                            Return to Shop
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {wishlist.map((item) => (
                        <div key={item.id} className="relative group">
                            <ProductCard product={item} />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeFromWishlist(item.id);
                                }}
                                className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-50 dark:hover:bg-gray-700 z-10 hidden group-hover:flex transition-all transform hover:scale-110"
                                title="Remove from wishlist"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
