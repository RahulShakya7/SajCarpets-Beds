import { List, MagnifyingGlass, User, X } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchPopup from "./SearchPopup";
import ThemeToggle from "./ThemeToggle";

import { useAuth } from "../context/AuthContext";
import AuthModal from "./auth/AuthModal";

const navLinks = [
    { label: "ABOUT US", href: "/about" },
    { label: "CONTACT US", href: "/contact" },
    { label: "BLOG", href: "/blog" },
    { label: "SHOP", href: "/shop" },
    { label: "CATALOGUE", href: "/catalogue" },
];

const Header = () => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const [searchOpen, setSearchOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <header className="sticky top-0 left-0 z-50 w-full bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
            <SearchPopup isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            <div className="flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-[300px] h-24">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img
                        className="w-[140px] sm:w-[169px] h-12 sm:h-16 object-cover"
                        alt="Sajlogo"
                        src="/sajlogo.png"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map(({ label, href }) => (
                        <Link
                            key={label}
                            to={href}
                            className={`text-lg sm:text-xl font-normal transition ${location.pathname === href
                                ? "text-primary font-semibold"
                                : "text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary"
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Icons */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={() => setSearchOpen(true)}>
                            <MagnifyingGlass
                                size={32}
                                className="text-black dark:text-white cursor-pointer hover:text-primary transition-colors"
                            />
                        </button>

                        <div className="relative group">
                            {user ? (
                                <>
                                    <Link to="/profile" className="block py-2">
                                        <User
                                            size={32}
                                            className="text-primary cursor-pointer hover:text-blue-600 transition-colors duration-200"
                                        />
                                    </Link>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.username}</p>
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button onClick={() => setIsAuthModalOpen(true)}>
                                    <User
                                        size={32}
                                        className="text-primary cursor-pointer hover:text-blue-600 transition-colors duration-200"
                                    />
                                </button>
                            )}
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Hamburger + ThemeToggle */}
                <div className="md:hidden flex items-center gap-2">
                    {/* ThemeToggle always visible */}
                    <ThemeToggle />
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? (
                            <X size={32} weight="bold" className="text-black dark:text-white" />
                        ) : (
                            <List size={32} weight="bold" className="text-black dark:text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden bg-white dark:bg-gray-800 w-full shadow-md transition-all duration-300 ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
            >
                <nav className="flex flex-col items-start gap-4 px-4 py-4">
                    {navLinks.map(({ label, href }) => (
                        <Link
                            key={label}
                            to={href}
                            className={`text-lg font-semibold w-full py-2 px-2 rounded transition ${location.pathname === href
                                ? "text-primary font-bold"
                                : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}
                    {/* Mobile Login Button (replaces Link) */}
                    {!user && (
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                setIsAuthModalOpen(true);
                            }}
                            className="text-lg font-semibold w-full py-2 px-2 rounded text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            LOGIN / REGISTER
                        </button>
                    )}
                </nav>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </header>
    );
};

export default Header;
