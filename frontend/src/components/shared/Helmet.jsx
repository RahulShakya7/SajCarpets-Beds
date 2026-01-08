import { Link } from "react-router-dom";

const Helmet = ({ title, breadcrumb, bgImage = "/images/carpetshopnow.jpg" }) => {
    return (
        <div
            className="w-full py-12 bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: `
          linear-gradient(
            90deg,
            rgba(0,0,0,0.6) 0%,
            rgba(0,0,0,0.14) 100%
          ),
          url(${bgImage})
        `,
            }}
        >
            <div className="flex flex-col gap-4 px-6 sm:px-12 md:px-16 lg:px-24 xl:px-[300px] relative z-10">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    {title}
                </h1>

                {/* Breadcrumb */}
                <p className="text-sm md:text-base lg:text-lg text-white">
                    <span className="hover:underline cursor-pointer">{breadcrumb}</span>
                </p>
            </div>
        </div>
    );
};

export default Helmet;
