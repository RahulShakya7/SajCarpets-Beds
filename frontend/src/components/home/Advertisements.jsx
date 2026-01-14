import { useEffect, useState } from "react";
import Button from "../Button";
import api from "../../services/api";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Top Section (Banner Slider)
export const TopAdvertisement = ({ slides }) => {
    if (slides.length === 0) return null;

    return (
        <div className="w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors min-h-[400px]">
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="h-full w-full"
            >
                {slides.map((slide, idx) => (
                    <SwiperSlide key={idx} className="h-full">
                        <div className="w-full h-full flex flex-col md:flex-row items-center gap-8 md:gap-12 p-6 sm:p-8 md:p-12">
                            {/* Text Content */}
                            <div className="flex flex-col flex-1 gap-4 text-left z-20 items-start justify-center">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white leading-tight max-w-3xl">
                                    {slide.title}
                                </h2>
                                <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto line-clamp-3">
                                    {slide.description}
                                </p>
                                <div className="mt-4">
                                    <Button size="large">{slide.buttonText || "Shop Now"}</Button>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="flex-shrink-0 w-full md:w-1/2 h-64 md:h-full relative z-10 flex items-center justify-center">
                                <img
                                    src={slide.imageUrl}
                                    alt={slide.title}
                                    className="w-full h-full object-contain md:object-cover rounded-xl"
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Swiper Pagination Styles Override */}
            <style>{`
                .swiper-pagination-bullet {
                    background: #9ca3af; 
                    opacity: 0.5;
                }
                .swiper-pagination-bullet-active {
                    background: #ea580c; /* Primary Color */
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

const Advertisements = () => {
    const [loading, setLoading] = useState(true);
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await api.get('ads/');
                const allAds = res.data.results || res.data;
                const banners = allAds.map(ad => ({
                    ...ad,
                    imageUrl: ad.image || "/images/banner-placeholder.png"
                }));
                // Use a default image if seed image is None/Null
                const enrichedBanners = banners.map(b => ({
                    ...b,
                    imageUrl: b.image ? b.image : "https://images.unsplash.com/photo-1505693416388-334372aac988?q=80&w=1000&auto=format&fit=crop"
                }));
                setSlides(enrichedBanners);
            } catch (err) {
                console.error("Failed to fetch ads", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    if (loading) return null;
    if (slides.length === 0) return null;

    return (
        <section className="flex flex-col w-full gap-12 px-6 sm:px-12 md:px-16 lg:px-24 xl:px-[300px] pt-[72px] pb-[36px] bg-white dark:bg-gray-900 transition-colors">
            <TopAdvertisement slides={slides} />
        </section>
    );
};

export default Advertisements;
