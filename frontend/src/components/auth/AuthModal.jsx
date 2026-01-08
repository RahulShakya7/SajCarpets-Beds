import { useState } from "react";
import { Eye, EyeSlash, X } from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import Button from "../Button";

export default function AuthModal({ isOpen, onClose, initialTab = "login" }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { addToast, removeToast } = useToast();

    // Form States
    const [loginData, setLoginData] = useState({ identifier: "", password: "" });
    const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });

    if (!isOpen) return null;

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const toastId = addToast("Logging in...", "loading", false);
        const res = await login(loginData.identifier, loginData.password);

        removeToast(toastId); // Remove loading toast

        if (res.success) {
            addToast("Welcome back!", "success");
            onClose();
            setLoginData({ identifier: "", password: "" }); // Clear form
        } else {
            addToast(res.error || "Login failed", "error");
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const toastId = addToast("Creating account...", "loading", false);
        try {
            await api.post('register/', registerData);
            removeToast(toastId); // Remove loading toast
            addToast("Registration successful! Please login.", "success");
            setActiveTab("login");
            setRegisterData({ username: "", email: "", password: "" });
        } catch (err) {
            removeToast(toastId); // Remove loading toast
            const errorMsg = err.response?.data?.username ? "Username taken" : (err.response?.data?.email ? "Email already registered" : "Registration failed");
            addToast(errorMsg, "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                {/* Tabs HEADER */}
                <div className="flex border-b border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab("login")}
                        className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === "login"
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setActiveTab("register")}
                        className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === "register"
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            }`}
                    >
                        Register
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    {activeTab === "login" ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username / Email</label>
                                <input
                                    type="text"
                                    name="identifier"
                                    value={loginData.identifier}
                                    onChange={handleLoginChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <Button type="submit" className="w-full justify-center py-3 mt-2">Sign In</Button>

                            <div className="text-center mt-4 text-sm text-gray-500">
                                Need an account? <button type="button" onClick={() => setActiveTab("register")} className="text-primary hover:underline font-medium">Register here</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={registerData.username}
                                    onChange={handleRegisterChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <Button type="submit" className="w-full justify-center py-3 mt-2">Sign Up</Button>

                            <div className="text-center mt-4 text-sm text-gray-500">
                                Already have an account? <button type="button" onClick={() => setActiveTab("login")} className="text-primary hover:underline font-medium">Login here</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
