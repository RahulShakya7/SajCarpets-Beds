import { useEffect, useState } from "react";
import { Package, ArrowUUpLeft, CurrencyGbp, SealCheck, Smiley } from "@phosphor-icons/react"; // Added CurrencyGbp as Money replacement or alias
import api from "../../services/api";

const iconMap = {
    Package,
    ArrowUUpLeft,
    Money: CurrencyGbp, // Mapping 'Money' string to CurrencyGbp icon
    CurrencyGbp,
    SealCheck,
    Smiley
};

export default function SellingPoints() {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const res = await api.get('selling_points/');
                // Ensure we sort by order if backend doesn't, though Model Meta does
                const data = res.data.results || res.data;
                setPoints(data);
            } catch (err) {
                console.error("Failed to fetch selling points", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPoints();
    }, []);

    if (loading) return null;

    if (points.length === 0) return null;

    return (
        <section className="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-[300px] py-12 bg-white dark:bg-gray-900 transition-colors">
            <div className="flex flex-col md:flex-row w-full divide-y md:divide-y-0 md:divide-x divide-gray-300 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors border border-gray-100 dark:border-gray-700">
                {points.map((item) => {
                    const Icon = iconMap[item.icon_name] || Package;
                    return (
                        <div
                            key={item.id}
                            className="flex w-full md:flex-1 items-center gap-4 md:gap-8 p-6 md:p-8 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                            <Icon className="text-primary w-14 h-14 md:w-20 md:h-20 flex-shrink-0" weight="light" />
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
        </section>
    );
}
