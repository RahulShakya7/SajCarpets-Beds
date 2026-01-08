import { EnvelopeSimple, Phone, FacebookLogo, InstagramLogo, TwitterLogo } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const defaultFooterData = {
    logo: "/sajlogo.png",
    externalLogo: "https://c.animaapp.com/ypxcOp9T/img/sajlogo-1-1@2x.png",
    address: "28C Monument Road, Woking, UK, GU21 5LT",
    phone: "07976839153",
    email: "woking@sajcarpets.com",
    mapUrl: "https://c.animaapp.com/ypxcOp9T/img/map.png",
    links: {
        myAccount: [
            { label: "About Us", href: "/about" },
            { label: "Shopping Guide", href: "/guide" },
            { label: "Delivery Information", href: "/delivery" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Our Store", href: "/store" },
        ],
        openingHours: [
            "Mon to Fri - 9:00 AM to 6:00 PM",
            "Weekends - 10:00 AM to 2:00 PM",
            "Open during holidays",
        ],
    },
    poweredBy: "-------------",
    paymentImage: "https://c.animaapp.com/ypxcOp9T/img/cards-1@2x.png",
    facebook_link: "",
    instagram_link: "",
    twitter_link: ""
};

const Footer = () => {
    const [footerData, setFooterData] = useState(defaultFooterData);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await api.get("company_info/");
                if (res.data && res.data.length > 0) {
                    const info = res.data[0];
                    setFooterData(prev => ({
                        ...prev,
                        address: info.address || prev.address,
                        phone: info.phone || prev.phone,
                        email: info.email || prev.email,
                        facebook_link: info.facebook_link,
                        instagram_link: info.instagram_link,
                        twitter_link: info.twitter_link,
                        // Could also sync opening hours if added to backend
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch company info", err);
            }
        };
        fetchInfo();
    }, []);

    return (
        <footer className="w-full bg-white dark:bg-gray-900 py-12 px-6 sm:px-8 md:px-12 lg:px-24 xl:px-32 2xl:px-[300px] transition-colors duration-300">
            <div className="flex flex-col gap-12">
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                    {/* Logo & Contact */}
                    <div className="flex flex-col gap-6 flex-1">
                        <img
                            src={footerData.externalLogo}
                            alt="Logo"
                            className="w-40 sm:w-52 md:w-60 object-cover"
                        />
                        <p className="text-2xl sm:text-3xl font-semibold text-black dark:text-white">
                            {footerData.address}
                        </p>
                        <div className="flex items-center gap-2">
                            <Phone size={32} className="text-primary" />
                            <span className="text-black dark:text-gray-200 text-xl sm:text-lg">
                                {footerData.phone}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <EnvelopeSimple size={32} className="text-primary" />
                            <span className="text-black dark:text-gray-200 text-xl sm:text-lg">
                                {footerData.email}
                            </span>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-2">
                            {footerData.facebook_link && (
                                <a href={footerData.facebook_link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary dark:text-gray-400">
                                    <FacebookLogo size={32} weight="fill" />
                                </a>
                            )}
                            {footerData.instagram_link && (
                                <a href={footerData.instagram_link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary dark:text-gray-400">
                                    <InstagramLogo size={32} weight="fill" />
                                </a>
                            )}
                            {footerData.twitter_link && (
                                <a href={footerData.twitter_link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary dark:text-gray-400">
                                    <TwitterLogo size={32} weight="fill" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Links & Opening Hours */}
                    <div className="flex flex-col sm:flex-row gap-12 flex-1">
                        {/* My Account Links */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-semibold text-lg sm:text-xl text-black dark:text-white">
                                My Account
                            </h4>
                            {footerData.links.myAccount.map((link, idx) => (
                                <Link
                                    key={idx}
                                    to={link.href}
                                    className="text-black dark:text-gray-300 text-base sm:text-lg hover:text-primary hover:underline cursor-pointer transition"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Opening Hours */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-semibold text-lg sm:text-xl text-black dark:text-white">
                                Opening Hours
                            </h4>
                            {footerData.links.openingHours.map((time, idx) => (
                                <p key={idx} className="text-black dark:text-gray-300 text-base sm:text-lg">
                                    {time}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Map */}
                    <div className="flex-1 w-full">
                        <h4 className="font-semibold text-lg sm:text-xl text-black dark:text-white mb-4">
                            Where to Find Us
                        </h4>
                        <div
                            className="w-full h-52 sm:h-64 md:h-72 lg:h-80 bg-cover bg-center rounded-lg"
                            style={{ backgroundImage: `url(${footerData.mapUrl})` }}
                        />
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-t border-gray-300 dark:border-gray-700" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-black dark:text-gray-400 text-base sm:text-lg">
                        {`Powered by: ${footerData.poweredBy}`}
                    </span>
                    <img
                        src={footerData.paymentImage}
                        alt="Payments"
                        className="w-64 sm:w-72 md:w-80 object-contain"
                    />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
