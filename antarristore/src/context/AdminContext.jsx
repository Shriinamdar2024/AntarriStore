import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if a session exists when the page refreshes
        const token = localStorage.getItem('adminToken');
        if (token) setIsAdmin(true);
        setLoading(false);
    }, []);

    const login = (password) => {
        // For now, we check against an ENV variable for the login
        if (password === import.meta.env.VITE_ADMIN_SECRET) {
            localStorage.setItem('adminToken', 'secure_session_active');
            setIsAdmin(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setIsAdmin(false);
    };

    return (
        <AdminContext.Provider value={{ isAdmin, login, logout, loading }}>
            {!loading && children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);