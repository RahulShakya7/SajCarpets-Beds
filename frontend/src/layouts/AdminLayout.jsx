import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import { House, Users, Package, Tag, ShoppingCart, Newspaper, UsersThree, ChatText, Megaphone, EnvelopeSimple, Gear, SignOut, User, List } from "@phosphor-icons/react";

const navItems = [
    { title: "Dashboard", path: "/admin/dashboard", icon: <House size={24} /> },
    { title: "Users", path: "/admin/users", icon: <Users size={24} /> },
    { title: "Products", path: "/admin/products", icon: <Package size={24} /> },
    { title: "Categories", path: "/admin/categories", icon: <Tag size={24} /> },
    { title: "Team", path: "/admin/team", icon: <UsersThree size={24} /> },
    { title: "Testimonials", path: "/admin/testimonials", icon: <ChatText size={24} /> },
    { title: "Blogs", path: "/admin/blogs", icon: <Newspaper size={24} /> },
    { title: "Ads", path: "/admin/ads", icon: <Megaphone size={24} /> },
    { title: "Messages", path: "/admin/messages", icon: <EnvelopeSimple size={24} /> },
    { title: "Settings", path: "/admin/settings", icon: <Gear size={24} /> },
    { title: "Profile", path: "/admin/profile", icon: <User size={24} /> },
];

const AdminLayout = () => {
    const { user, loading, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/admin/login");
            } else if (!user.is_staff) {
                // Do not redirect immediately, show unauthorized message for debugging
                console.log("User is not staff:", user);
            }
        }
    }, [user, loading, navigate]);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    if (!user) return null; // Will redirect

    if (!user.is_staff) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p>You are logged in as <strong>{user.username}</strong>, but you do not have admin permissions.</p>
                <p className="text-sm text-gray-500">Debug: is_staff = {String(user.is_staff)}</p>
                <button
                    onClick={() => { logout(); navigate("/admin/login"); }}
                    className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                    Logout & Login as Admin
                </button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
                <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        Saj Admin
                    </Link>
                </div>

                <nav className="flex flex-col p-4 gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.title}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? "bg-primary text-white"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            onClick={() => setSidebarOpen(false)} // Close on mobile value click
                        >
                            {item.icon}
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-4 left-0 w-full px-4">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/admin/login');
                        }}
                        className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <SignOut size={24} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-20 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-8 sticky top-0 z-30 transition-colors">
                    <button
                        className="md:hidden p-2 text-gray-600 dark:text-gray-200"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <List size={32} />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <ThemeToggle />
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-primary">
                            <User size={24} />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
