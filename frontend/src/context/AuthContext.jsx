import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const isExpired = decoded.exp * 1000 < Date.now();

                    if (isExpired && refreshToken) {
                        // Access expired, try refresh
                        try {
                            const response = await api.post('token/refresh/', { refresh: refreshToken });
                            const { access } = response.data;

                            localStorage.setItem('access_token', access);
                            // If refresh token is rotated, update it too (depends on backend config, usually safe to keep old if not returned)
                            if (response.data.refresh) {
                                localStorage.setItem('refresh_token', response.data.refresh);
                            }

                            const newDecoded = jwtDecode(access);
                            setUser({ username: newDecoded.username || 'User', ...newDecoded });
                        } catch (refreshErr) {
                            console.error("Refresh failed", refreshErr);
                            logout();
                        }
                    } else if (isExpired && !refreshToken) {
                        logout();
                    } else {
                        // Valid
                        setUser({ username: decoded.username || 'User', ...decoded });
                    }
                } catch (e) {
                    console.error("Token decode failed", e);
                    logout();
                }
            } else if (refreshToken) {
                // No access token but have refresh token (unlikely but possible)
                try {
                    const response = await api.post('token/refresh/', { refresh: refreshToken });
                    const { access } = response.data;
                    localStorage.setItem('access_token', access);
                    const newDecoded = jwtDecode(access);
                    setUser({ username: newDecoded.username || 'User', ...newDecoded });
                } catch (e) {
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('token/', { username, password });
            const { access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            const decoded = jwtDecode(access);
            setUser({ username: decoded.username || username, ...decoded });

            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return {
                success: false,
                error: error.response?.data?.detail || "Login failed"
            };
        }
    };

    const register = async (username, email, password) => {
        // Implement registration logic if backend supports it
        // Standard SimpleJWT doesn't have a register endpoint by default
        // You might need a custom view for this
        console.log("Registration not yet fully implemented on backend");
        return { success: false, error: "Registration endpoint not configured" };
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-500">
                    Loading Application...
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
