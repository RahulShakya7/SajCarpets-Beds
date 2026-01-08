const IntroSection = ({ title, description, secondaryText, imageUrl }) => {
    return (
        <section className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full px-6 md:px-[300px] py-12">
            {/* Left Image */}
            <div
                className="flex-1 h-80 md:h-[372px] rounded-xl bg-cover bg-center w-full"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Right Text Content */}
            <div className="flex flex-col flex-1 gap-4 items-start">
                {/* Date Badge */}
                <div className="flex flex-col items-start gap-2">
                    <span className="text-primary font-semibold text-lg md:text-xl">
                        Since 1998
                    </span>
                    <div className="w-16 h-0.5 bg-primary" />
                </div>

                {/* Heading */}
                <h1 className="text-left text-3xl md:text-4xl lg:text-5xl font-semibold text-black dark:text-white">
                    {title}
                </h1>

                {/* Descriptions */}
                <p className="!text-left text-base md:text-lg text-gray-800 dark:text-gray-200">
                    {description}
                </p>
                <p className="!text-left text-base md:text-lg text-gray-800 dark:text-gray-200">
                    {secondaryText}
                </p>
            </div>
        </section>
    );
};

export default IntroSection;
