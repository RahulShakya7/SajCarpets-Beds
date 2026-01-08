const TeamMemberCard = ({ name, role, image }) => {
    const bgImage = image ? `url(${image})` : "url(/images/default-profile.png)";

    return (
        <div className="flex flex-col items-center justify-center gap-3 relative">
            {/* Image */}
            <div
                className="relative w-full h-64 md:h-72 lg:h-80 rounded-lg bg-cover bg-center bg-gray-200 dark:bg-gray-700"
                style={{ backgroundImage: bgImage }}
            />

            {/* Name & Role */}
            <div className="flex flex-col items-center gap-1">
                <div className="text-black dark:text-white font-semibold text-lg md:text-xl">{name}</div>
                <div className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base">{role}</div>
            </div>
        </div>
    );
};

export default TeamMemberCard;
