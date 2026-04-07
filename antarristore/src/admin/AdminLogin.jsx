import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, KeyRound, Mail, ArrowRight, Lock } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const normalizedEmail = email.toLowerCase().trim();
            const response = await axios.post('https://antarri-backend.onrender.com/api/auth/admin/login', {
                email: normalizedEmail,
                password
            });

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
            const response = await axios.post('https://antarri-backend.onrender.com/api/auth/verify-otp', {
                email: email.toLowerCase().trim(),
                otp
            });

            const { token, user } = response.data;

            if (user.role === 'admin' || user.isAdmin === true) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                login(user, token);
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
        <div className="min-h-screen flex items-center justify-center bg-[#f1f3f6] font-sans p-4 relative overflow-hidden">
            
            {/* Animated Grid Background for Tech/Admin feel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" 
            />
            <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" 
            />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative z-10"
            >
                {/* Header Strip */}
                <div className="bg-slate-900 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-4 relative z-10">
                        <ShieldAlert className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-white relative z-10">Admin Portal</h2>
                    <p className="text-indigo-200 text-sm font-medium mt-1 relative z-10">Authorized Personnel Only</p>
                </div>

                <div className="p-8 pb-10">
                    <AnimatePresence mode="wait">
                        {!isOtpSent ? (
                            <motion.form 
                                key="request-otp"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleLoginRequest} 
                                className="space-y-5"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Admin Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="admin@antaristore.com"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900"
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Master Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="password"
                                            placeholder="••••••••••"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-slate-900"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Request Authorization <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form 
                                key="verify-otp"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleOtpVerify}
                                className="space-y-6"
                            >
                                <div className="text-center bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-2">
                                    <KeyRound className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Verification Required</p>
                                    <p className="text-xs text-indigo-600 font-medium mt-1">Code dispatched to <span className="font-bold">{email}</span></p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 text-center block">Enter 6-Digit OTP</label>
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-4 text-center text-3xl font-bold tracking-[0.5em] focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-900"
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        disabled={loading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? 'Verifying Identity...' : 'Access Dashboard'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsOtpSent(false)}
                                        className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-colors text-sm"
                                    >
                                        Return to Login
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;