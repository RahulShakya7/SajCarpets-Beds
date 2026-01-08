import { Link } from "react-router-dom";

export default function CatalogueCard({ item }) {
    const badges = (item.category || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    return (
        <article className="flex flex-col md:flex-row h-auto md:h-[340px] border border-[#c5c5c5] dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-colors">
            <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full md:w-64 h-56 md:h-full object-cover flex-shrink-0"
            />
            <div className="flex flex-col justify-center gap-4 p-6 md:p-8 flex-1">
                <header className="flex flex-col gap-2">
                    <h3 className="font-open-sans font-bold text-2xl sm:text-[25px] leading-[120%] text-black dark:text-white">
                        {item.title}
                    </h3>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        {badges.map((b, i) => (
                            <span
                                key={`${b}-${i}`}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                            >
                                {b}
                            </span>
                        ))}
                    </div>
                </header>

                <p className="font-open-sans text-[17px] sm:text-lg leading-[132%] text-black dark:text-gray-200">
                    {item.description}
                </p>

                {/* CTA row */}
                <div className="mt-2">
                    <Link
                        to={`/product/${item.id}`}
                        className="inline-flex items-center gap-2 text-[#b23017] dark:text-primary font-semibold hover:underline"
                    >
                        View details
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );
}
