import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";

const ClientLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Newsletter />
            <Footer />
        </div>
    );
};

export default ClientLayout;
