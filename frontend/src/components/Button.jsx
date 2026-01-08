import React from 'react';

const Button = ({
    children = "ENQUIRE NOW",
    onClick,
    className = "",
    textColor = "text-white",
    size = "large",
    type = "button"
}) => {
    const sizeClasses = {
        large: "gap-4 px-8 py-4 text-2xl leading-7 rounded-[8px]",
        small: "gap-2 px-4 py-2 text-lg leading-6 rounded-[4px]",
    };

    return (
        <button
            className={`
        inline-flex items-center justify-center
        w-max
        ${sizeClasses[size]}
        bg-[#B23017] hover:bg-[#8e2411]
        shadow-md hover:shadow-xl transition-all duration-300
        font-bold tracking-wide
        transform hover:-translate-y-1 hover:scale-105
        ${textColor} ${className}
      `}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
};

export default Button;
