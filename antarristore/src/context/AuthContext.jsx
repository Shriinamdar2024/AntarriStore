import React, { createContext, useContext, useState, useEffect } from 'react';
// UPDATED: Import the API utility instead of raw axios to use the live Render URL
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // UNIFIED: Use 'userInfo' to match your Admin setup
        const savedUser = localStorage.getItem('userInfo');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                localStorage.removeItem('userInfo');
                localStorage.removeItem('token');
                localStorage.removeItem('isAdminLoggedIn');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        // Create a unified object containing both user info and the token
        const userInfo = { ...userData, token };
        setUser(userInfo);

        // Save to one single source of truth
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('token', token);

        // SYNC FIX: If the user is an admin, set the flag the ProtectedRoute expects
        if (userData.role === 'admin' || userData.isAdmin === true) {
            localStorage.setItem('isAdminLoggedIn', 'true');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        localStorage.removeItem('isAdminLoggedIn'); // Ensure this is cleared
        // Clear any old keys to prevent future conflicts
        localStorage.removeItem('customerUser');
    };

    const updateUser = async (updatedData) => {
        try {
            // UPDATED: Replaced hardcoded localhost with the dynamic API utility
            const { data } = await API.put('/users/profile', updatedData);

            const updatedUser = data.user || data;
            // Maintain the token in the user object
            const token = localStorage.getItem('token');
            const newUserInfo = { ...updatedUser, token };

            setUser(newUserInfo);
            localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
            return true;
        } catch (error) {
            console.error("Profile Update Error:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);