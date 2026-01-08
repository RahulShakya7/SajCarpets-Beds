import { useEffect, useState } from "react";
import IntroSection from "../components/IntroSection";
import TeamMemberCard from "../components/TeamMemberCard";
import Testimonials from "../components/home/Testimonials";
import { PiggyBank, SealCheck, Smiley, Money, ArrowUUpLeft, Package } from "@phosphor-icons/react";
import Advertisements, { AdvertisementCards } from "../components/home/Advertisements";
import Helmet from "../components/shared/Helmet";
import api from "../services/api";

// Map icon names from backend to React components
const iconMap = {
    PiggyBank, SealCheck, Smiley, Money, ArrowUUpLeft, Package
};

export default function About() {
    const [introData, setIntroData] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [featuresData, setFeaturesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [infoRes, teamRes, featuresRes] = await Promise.all([
                    api.get('company_info/').catch(() => null),
                    api.get('team/'),
                    api.get('about_features/')
                ]);

                if (infoRes && infoRes.data && infoRes.data.length > 0) {
                    const info = infoRes.data[0];
                    setIntroData({
                        title: "About Us",
                        description: info.about_us_content || "Welcome to Saj Carpets.",
                        secondaryText: "",
                        imageUrl: info.about_image || "https://c.animaapp.com/ypxcOp9T/img/image-12.svg"
                    });
                } else {
                    setIntroData({
                        title: "About Us",
                        description: "At Saj Carpets, we believe in comfort and style.",
                        secondaryText: "",
                        imageUrl: "https://c.animaapp.com/ypxcOp9T/img/image-12.svg"
                    });
                }

                if (teamRes.data) {
                    setTeamMembers(teamRes.data.results || teamRes.data);
                }

                if (featuresRes.data) {
                    const features = featuresRes.data.results || featuresRes.data;
                    const mapped = features.map(f => ({
                        ...f,
                        icon: iconMap[f.icon_name] || Smiley
                    }));
                    setFeaturesData(mapped);
                }

            } catch (err) {
                console.error("Failed to load about data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="w-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
            <Helmet title="About Us" breadcrumb="Home / About Us" />

            {introData && (
                <section className="w-full flex flex-col items-center text-center gap-6 py-16">
                    <IntroSection {...introData} />
                </section>
            )}

            <section className="w-full flex flex-col items-center text-center gap-6 py-16">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
                    Why Choose Us?
                </h2>
                <div className="flex flex-col w-full gap-12 px-6 sm:px-12 md:px-16 lg:px-24 xl:px-[300px] py-[72px] bg-white dark:bg-gray-800">
                    <AdvertisementCards data={featuresData} />
                </div>
                <Advertisements />
            </section>

            <section className="flex flex-col items-center gap-12 py-16">
                <div className="text-center max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
                        Meet Our Team
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-3 text-base md:text-lg">
                        Our dedicated team of professionals works together to bring innovation,
                        expertise, and creativity to everything we do.
                    </p>
                </div>
                <div
                    className="grid gap-8 sm:gap-10 lg:gap-14 w-full max-w-7xl mx-auto px-4"
                    style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    }}
                >
                    {teamMembers.map((member) => (
                        <TeamMemberCard key={member.id} {...member} />
                    ))}
                </div>
            </section>
            <section>
                <Testimonials />
            </section>
        </div>
    );
}
