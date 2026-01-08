import { Link } from "react-router-dom";
import { Warning } from "@phosphor-icons/react";
import Button from "../components/Button";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <Warning size={80} className="text-primary mb-6" weight="fill" />
            <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/">
                <Button>Go Back Home</Button>
            </Link>
        </div>
    );
};

export default NotFound;
