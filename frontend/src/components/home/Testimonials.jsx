import { useEffect, useState } from "react";
import TestimonialCard from "../shared/TestimonialCard";
import api from "../../services/api";

export default function Testimonials() {
    const [current, setCurrent] = useState(0);
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await api.get('testimonials/');
                // Add fallback image if backend image is null/missing (though model has image field)
                const data = (res.data.results || res.data).map(t => ({
                    ...t,
                    // Ensure fields match what TestimonialCard expects e.g. 'testimonial' vs 'content'
                    testimonial: t.content,
                    image: t.image || "https://c.animaapp.com/ypxcOp9T/img/ellipse-5@2x.png",
                    photo: "https://c.animaapp.com/ypxcOp9T/img/frame-14-1.png" // hardcoded fallback decoration
                }));
                setTestimonials(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTestimonials();
    }, []);

    useEffect(() => {
        if (testimonials.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials]);

    return (
        <div className="flex flex-col items-center gap-12 px-4 sm:px-8 md:px-16 lg:px-[300px] py-12 md:py-[72px] bg-white dark:bg-gray-950 w-full transition-colors">
            {/* Heading */}
            <div className="flex flex-col items-center gap-4 text-center max-w-3xl">
                <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white">
                    Testimonials
                </h2>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                    See what our clients have to say!
                </p>
            </div>

            {/* Testimonial Card */}
            <div className="relative w-full flex justify-center items-center">
                {testimonials.map((t, i) => (
                    <TestimonialCard
                        key={t.id}
                        testimonial={t}
                        current={current}
                        index={i}
                    />
                ))}
            </div>

            {/* Dots BELOW the card */}
            <div className="flex items-center gap-2 mt-4">
                {testimonials.map((_, dotIndex) => (
                    <div
                        key={dotIndex}
                        onClick={() => setCurrent(dotIndex)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${dotIndex === current ? "bg-blue-600" : "bg-blue-300 dark:bg-blue-900"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
