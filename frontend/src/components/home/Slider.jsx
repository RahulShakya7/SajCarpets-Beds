import { useEffect, useState } from "react";
import Button from "../Button";
import api from "../../services/api";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Slider = () => {
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

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (slides.length === 0) return null;

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                effect={'fade'}
                speed={1000}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-24 xl:px-48 2xl:px-[300px] gap-12 py-12 bg-cover bg-center"
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
                            <div className="absolute inset-0 z-0 bg-black/10 dark:bg-black/40 pointer-events-none" />

                            {/* Text Content */}
                            <div className="relative z-10 max-w-3xl flex flex-col gap-4">
                                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-orange-700 dark:text-orange-500 tracking-tight animate-fade-in-up">
                                    {slide.title}
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-gray-100 tracking-tight animate-fade-in-up delay-100">
                                    {slide.subtitle}
                                </h2>
                                <p className="text-lg sm:text-xl md:text-2xl text-black dark:text-gray-200 leading-relaxed animate-fade-in-up delay-200">
                                    {slide.description}
                                </p>
                                <div className="animate-fade-in-up delay-300">
                                    <Button size="large">Enquire Now</Button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Global styles override for pagination dots if needed */}
            <style>{`
                .swiper-pagination-bullet {
                    background: #fb923c;
                    opacity: 0.5;
                    width: 12px;
                    height: 12px;
                }
                .swiper-pagination-bullet-active {
                    background: #ea580c;
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default Slider;
