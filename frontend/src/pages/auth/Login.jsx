import { useState } from "react";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState(""); // Using email as username per backend generally, but SimpleJWT uses 'username' field by default
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        // Assuming backend actually expects 'username' but user might type email
        // Or if User model uses email as username. Standard Django uses username.
        const res = await login(email, password);
        if (res.success) {
            navigate("/");
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-primary mb-6">Login</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username / Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full mt-4 justify-center">Sign In</Button>
                </form>
                <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                    Don't have an account? <Link to="/auth/register" className="text-primary hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
