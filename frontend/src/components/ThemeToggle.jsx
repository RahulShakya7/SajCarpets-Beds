import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-white dark:bg-gray-700 transition-colors"
            aria-label="Toggle Dark Mode"
        >
            {theme === "dark" ? (
                <Sun size={32} className="text-yellow-400 cursor-pointer hover:text-primary transition-colors duration-200" />
            ) : (
                <Moon size={32} className="text-gray-900 cursor-pointer hover:text-primary transition-colors duration-200" />
            )}
        </button>
    );
}

export default ThemeToggle;
