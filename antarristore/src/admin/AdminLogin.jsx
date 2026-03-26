import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false); // Added loading state for UX

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const normalizedEmail = email.toLowerCase().trim();
            const response = await axios.post('http://localhost:5000/api/auth/admin/login', {
                email: normalizedEmail,
                password
            });

            alert(response.data.message || "OTP Sent!");
            setIsOtpSent(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed. Check console.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
                email: email.toLowerCase().trim(),
                otp
            });

            const { token, user } = response.data;

            // Check role and use the UNIFIED login function
            if (user.role === 'admin' || user.isAdmin === true) {

                // 1. First, set the persistence flag (matches App.jsx logic)
                localStorage.setItem('isAdminLoggedIn', 'true');

                // 2. Update the AuthContext (This handles userInfo and token)
                login(user, token);

                // 3. Navigate to dashboard
                // We use replace: true to remove login from browser history
                navigate('/admin/dashboard', { replace: true });
            } else {
                alert('Access Denied: Admin privileges required.');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'OTP Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[#FBFBF9]">
            <div className="p-10 bg-white shadow-2xl rounded-2xl border border-black/5 w-full max-w-sm">
                <h2 className="text-xl font-serif mb-8 text-center italic text-textPrimary">
                    {isOtpSent ? 'Verify Identity' : 'Staff Access'}
                </h2>

                {!isOtpSent ? (
                    <form onSubmit={handleLoginRequest}>
                        <input
                            type="email"
                            placeholder="ENTER ADMIN EMAIL"
                            className="w-full border-b border-black/10 py-3 mb-6 outline-none focus:border-accent text-xs tracking-[0.2em] uppercase transition-all"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="ENTER SECRET KEY"
                            className="w-full border-b border-black/10 py-3 mb-8 outline-none focus:border-accent text-xs tracking-[0.2em] uppercase transition-all"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            disabled={loading}
                            className="w-full bg-textPrimary text-white py-4 rounded-xl text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-accent transition-all shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Request OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpVerify}>
                        <p className="text-[9px] text-center mb-4 tracking-widest text-gray-400 uppercase">Code sent to {email}</p>
                        <input
                            type="text"
                            placeholder="ENTER 6-DIGIT OTP"
                            className="w-full border-b border-black/10 py-3 mb-8 text-center outline-none focus:border-accent text-xs tracking-[0.5em] font-bold transition-all"
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <button
                            disabled={loading}
                            className="w-full bg-accent text-white py-4 rounded-xl text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-textPrimary transition-all shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify & Enter'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOtpSent(false)}
                            className="w-full mt-4 text-[8px] tracking-[0.2em] uppercase text-gray-400 hover:text-textPrimary"
                        >
                            Back to Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;