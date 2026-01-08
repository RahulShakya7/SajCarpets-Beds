import { useEffect, useState } from "react";
import { ArrowUUpLeft, Money, Package } from "@phosphor-icons/react";
import Button from "../Button";
import api from "../../services/api";

const iconMap = {
    Money, ArrowUUpLeft, Package
};

// Top Section (Banner)
export const TopAdvertisement = ({ slides }) => {
    return (
        <div className="w-full relative overflow-hidden">
            {slides.map((slide, idx) => (
                <div
                    key={idx}
                    className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full bg-gray-100 dark:bg-gray-800 rounded-xl p-6 sm:p-8 md:p-12 mb-8 transition-colors"
                >
                    {/* Text Content */}
                    <div className="flex flex-col flex-1 gap-4 text-center md:text-left">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black dark:text-white">
                            {slide.title}
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-black dark:text-gray-300 leading-relaxed">
                            {slide.description}
                        </p>
                        <div className="mt-2">
                            <Button size="small">{slide.buttonText}</Button>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="flex-shrink-0 w-full max-w-sm">
                        <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="rounded-xl object-cover w-full h-auto"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const AdvertisementCards = ({ data }) => {
    return (
        <div className="flex flex-col md:flex-row w-full divide-y md:divide-y-0 md:divide-x divide-gray-300 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors">
            {data.map((item, idx) => {
                const Icon = item.icon;
                return (
                    <div
                        key={idx}
                        className="flex w-full md:flex-1 items-center gap-4 md:gap-8 p-6 md:p-8 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
                    >
                        <Icon className="text-primary w-14 h-14 md:w-20 md:h-20 flex-shrink-0" />
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-black dark:text-white">
                                {item.title}
                            </h3>
                            <p className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Main Advertisements Component
const Advertisements = () => {
    const [loading, setLoading] = useState(true);
    const [topSlides, setTopSlides] = useState([]);
    const [policyAds, setPolicyAds] = useState([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await api.get('ads/');
                const allAds = res.data.results || res.data;

                // Filter Top Banner
                const banners = allAds.filter(ad => ad.is_top_banner).map(ad => ({
                    ...ad,
                    imageUrl: ad.image || "/images/pngegg.png"
                }));
                setTopSlides(banners);

                // Filter Store Policies
                const policies = ["Cash on Delivery", "Order Return", "Free Shipping"];
                const policyCards = allAds.filter(ad => policies.includes(ad.title)).map(ad => ({
                    ...ad,
                    icon: iconMap[ad.icon_name] || Package
                }));
                setPolicyAds(policyCards);

            } catch (err) {
                console.error("Failed to fetch ads", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    if (loading) return null; // or skeleton

    return (
        <section className="flex flex-col w-full gap-12 px-6 sm:px-12 md:px-16 lg:px-24 xl:px-[300px] py-[72px] bg-white dark:bg-gray-900 transition-colors">
            {topSlides.length > 0 && <TopAdvertisement slides={topSlides} />}
            {policyAds.length > 0 && <AdvertisementCards data={policyAds} />}
        </section>
    );
};

export default Advertisements;
