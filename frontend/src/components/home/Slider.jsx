import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "../Button";
import api from "../../services/api";

const Slider = () => {
    const [current, setCurrent] = useState(0);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await api.get("hero/");
                setSlides(res.data);
            } catch (err) {
                console.error("Failed to fetch slides", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides]);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (slides.length === 0) return null; // Or placeholder

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <AnimatePresence mode="sync">
                {slides.map(
                    (slide, index) =>
                        index === current && (
                            <motion.div
                                key={slide.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-[300px] gap-12 py-12 bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            >
                                {/* Gradient Overlay */}
                                <div
                                    className="absolute inset-0 z-0 pointer-events-none"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 35%, rgba(255,255,255,0.1) 65%, rgba(255,255,255,0) 100%)",
                                    }}
                                />
                                {/* Dark mode overlay override if needed, or keeping design as is */}
                                <div className="absolute inset-0 z-0 bg-black/10 dark:bg-black/40 pointer-events-none" />


                                {/* Text Content */}
                                <div className="relative z-10 max-w-3xl flex flex-col gap-4">
                                    <motion.div
                                        initial={{ y: -30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8 }}
                                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-orange-700 dark:text-orange-500 tracking-tight"
                                    >
                                        {slide.title}
                                    </motion.div>

                                    <motion.h2
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-gray-100 tracking-tight"
                                    >
                                        {slide.subtitle}
                                    </motion.h2>

                                    <motion.p
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        className="text-lg sm:text-xl md:text-2xl text-black dark:text-gray-200 leading-relaxed"
                                    >
                                        {slide.description}
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                    >
                                        <Button size="large">Enquire Now</Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )
                )}
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === current ? "bg-primary" : "bg-orange-300"
                            }`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
