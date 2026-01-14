import { Link } from "react-router-dom";
import Helmet from "../components/shared/Helmet";

export default function ComingSoon() {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors flex flex-col">
            <Helmet title="Coming Soon" breadcrumb="Home / Coming Soon" />

            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg max-w-lg w-full border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🚀</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Coming Soon!
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        We're working hard to bring you this feature. Check back soon for updates!
                    </p>

                    <Link
                        to="/"
                        className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 hover:shadow-lg transition-all"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
