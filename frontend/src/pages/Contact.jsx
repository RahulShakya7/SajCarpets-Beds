import { useState } from "react";
import Button from "../components/Button";
import Helmet from "../components/shared/Helmet";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const InputField = ({ label, name, value, onChange, type = "text", placeholder = "" }) => (
    <div className="flex flex-col">
        <label
            htmlFor={name}
            className="text-gray-800 dark:text-gray-200 font-open-sans text-base sm:text-lg font-medium mb-2"
        >
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 font-open-sans text-base outline-none focus:border-primary transition-colors"
        />
    </div>
);

export default function Contact() {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = addToast("Sending message...", "loading", false);

        try {
            await api.post("contact_messages/", formData);
            addToast("Message sent successfully!", "success");
            setFormData({ name: "", email: "", message: "" });
        } catch (err) {
            let errorMsg = "Something went wrong!";
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                errorMsg = Object.keys(errorData).map(key => {
                    const messages = Array.isArray(errorData[key]) ? errorData[key].join(", ") : errorData[key];
                    return `${key}: ${messages}`;
                }).join(" | ");
            } else {
                errorMsg = err.message || errorMsg;
            }
            addToast(errorMsg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
            <Helmet title="Contact Us" breadcrumb="Home / Contact Us" />

            <div className="w-full max-w-7xl mt-10 sm:mt-14 lg:mt-16 mb-12 sm:mb-14 lg:mb-16 px-4 sm:px-6 lg:px-12 mx-auto">
                <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 lg:p-10 transition-colors">
                    {/* Title */}
                    <h1 className="text-left text-2xl sm:text-3xl lg:text-[40px] font-bold leading-tight text-gray-900 dark:text-white mb-6 sm:mb-8">
                        Write Us
                    </h1>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 sm:gap-8">
                        {/* --- TWO-COLUMN AREA --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                            {/* Left column: two inputs stacked */}
                            <div className="flex flex-col gap-6">
                                <InputField
                                    label="Name"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Right column: textarea */}
                            <div className="flex flex-col">
                                <label
                                    htmlFor="message"
                                    className="text-gray-800 dark:text-gray-200 font-open-sans text-base sm:text-lg font-medium mb-2"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Type your message here..."
                                    className="
                    w-full flex-1 h-48 sm:h-56
                    lg:h-full lg:min-h-0
                    p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                    text-gray-800 dark:text-white bg-white dark:bg-gray-700
                    font-open-sans text-base placeholder:text-gray-400
                    outline-none focus:border-primary transition-colors resize-none
                  "
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-start lg:justify-end">
                            <Button
                                type="submit"
                                size="large"
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Map Section */}
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-12 mx-auto mb-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Find Us</h2>
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md relative group">
                    {/* Logic to show interactive map or image fallback, reusing logic similar to footer but bigger */}
                    <MapDisplay />
                </div>
            </div>
        </div >
    );
}

const MapDisplay = () => {
    const [mapData, setMapData] = useState({ image: null, url: "" });

    useState(() => {
        const fetchMap = async () => {
            try {
                const res = await api.get("company_info/");
                if (res.data && res.data.length > 0) {
                    setMapData({ image: res.data[0].map_image, url: res.data[0].map_url });
                }
            } catch (e) { console.error(e); }
        };
        fetchMap();
    }, []);

    if (mapData.image) {
        return (
            <a href={mapData.url || "#"} target="_blank" rel="noreferrer" className="block w-full h-full">
                <img src={mapData.image} alt="Location Map" className="w-full h-full object-cover" />
            </a>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-500">
            <p>Map Loading or Not Available</p>
        </div>
    );
};
