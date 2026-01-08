import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    // Handle data structure differences between mock and real API
    // Real API: images: [{image: "url"}], discount_price, price
    // Mock: image, originalPrice, price

    const imageUrl = product.image || (product.images && product.images.length > 0 ? product.images[0].image : "/images/placeholder.png");

    // Logic for price display
    // If discount_price exists, show it as main price, and price as crossed out
    // If originalPrice exists (legacy mock), show price as main, originalPrice as crossed out

    let mainPrice = product.price;
    let crossedPrice = product.originalPrice;

    if (product.discount_price) {
        mainPrice = product.discount_price;
        crossedPrice = product.price;
    }

    return (
        <Link to={`/product/${product.id}`} className="w-full">
            <div className="flex flex-col w-full p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition cursor-pointer h-full">
                <div className="relative w-full h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden rounded-md">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full"
                    />
                </div>
                <h3 className="mt-4 text-black dark:text-gray-100 text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base line-clamp-2">{product.description}</p>

                {/* Price section */}
                <div className="mt-auto pt-2 flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-primary">£{mainPrice}</p>
                    {crossedPrice && (
                        <p className="text-lg text-gray-500 line-through">£{crossedPrice}</p>
                    )}
                </div>

                <button className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors w-full">
                    Enquire Now
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
