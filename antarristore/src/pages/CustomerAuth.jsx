import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CustomerAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Input Handler
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/users/login' : '/api/users/register'; try {
            const { data } = await API.post(endpoint, formData);

            if (isLogin) {
                // SUCCESS: Clear admin flags to prevent session cross-talk
                localStorage.removeItem('isAdminLoggedIn');

                // Store data in AuthContext (handles userInfo and token)
                login(data.user || data, data.token);

                navigate('/');
            } else {
                // REGISTRATION SUCCESS
                setIsLogin(true);
                setFormData({ name: '', email: '', password: '' });
                setError('');
                alert("Registration successful! Please login to continue.");
            }
        } catch (err) {
            console.error("Auth Error:", err);
            const message = err.response?.data?.message || err.message;
            setError(message.toUpperCase());
        } finally {
            setLoading(false);
        }
    };

    const slideFade = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div className="min-h-screen w-full flex bg-[#FBFBF9] overflow-hidden">

            {/* LEFT SIDE: THE EXPERIENCE */}
            <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
                <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.7 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000')] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000"
                />
                <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full bg-gradient-to-b from-black/40 to-black/10">
                    <h1 className="text-white text-4xl font-serif tracking-tighter uppercase leading-none">
                        Antari<span className="italic opacity-70 font-light text-2xl lowercase tracking-normal">Store</span>
                    </h1>

                    <div className="text-white">
                        <motion.p
                            key={isLogin ? "txt1" : "txt2"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl font-serif italic mb-6 leading-tight"
                        >
                            {isLogin ? "Welcome back to the collection." : "Begin your journey with us."}
                        </motion.p>
                        <div className="h-[2px] w-20 bg-white/30 mb-8" />
                        <p className="text-[10px] tracking-[0.5em] uppercase opacity-50 font-bold">Curated Luxury & Tech</p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: THE FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 relative">
                <div className="w-full max-w-md">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? "login" : "register"}
                            variants={slideFade}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.4, ease: "circOut" }}
                        >
                            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-2 block">
                                {isLogin ? "Member Portal" : "Account Creation"}
                            </span>
                            <h2 className="text-4xl font-serif uppercase tracking-tight mb-6">
                                {isLogin ? "Sign In" : "Join the Club"}
                            </h2>

                            {error && (
                                <div className="bg-red-50 border-l-2 border-red-500 p-4 mb-6">
                                    <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold leading-relaxed">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {!isLogin && (
                                    <div className="relative group">
                                        <User className="absolute left-0 bottom-3 text-slate-300 group-focus-within:text-black transition-colors" size={18} />
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="FULL NAME"
                                            required
                                            className="w-full border-b border-black/10 py-3 pl-8 outline-none focus:border-black text-[10px] tracking-widest transition-all placeholder:text-slate-300 bg-transparent"
                                            style={{ borderRadius: 0 }}
                                        />
                                    </div>
                                )}

                                <div className="relative group">
                                    <Mail className="absolute left-0 bottom-3 text-slate-300 group-focus-within:text-black transition-colors" size={18} />
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="EMAIL ADDRESS"
                                        required
                                        className="w-full border-b border-black/10 py-3 pl-8 outline-none focus:border-black text-[10px] tracking-widest transition-all placeholder:text-slate-300 bg-transparent"
                                        style={{ borderRadius: 0 }}
                                    />
                                </div>

                                <div className="relative group">
                                    <Lock className="absolute left-0 bottom-3 text-slate-300 group-focus-within:text-black transition-colors" size={18} />
                                    <input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="PASSWORD"
                                        required
                                        className="w-full border-b border-black/10 py-3 pl-8 pr-10 outline-none focus:border-black text-[10px] tracking-widest transition-all placeholder:text-slate-300 bg-transparent"
                                        style={{ borderRadius: 0 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 bottom-3 text-slate-300 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-5 flex items-center justify-center gap-3 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-zinc-800 transition-all group mt-12 disabled:bg-gray-400"
                                    style={{ borderRadius: 0 }}
                                >
                                    {loading ? "Processing..." : isLogin ? "Secure Entry" : "Create Account"}
                                    {!loading && <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />}
                                </button>
                            </form>

                            <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center">
                                <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                                    {isLogin ? "New to Antari?" : "Already a member?"}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                        setShowPassword(false);
                                    }}
                                    className="text-[10px] font-bold tracking-widest uppercase text-black hover:text-zinc-500 transition-colors"
                                >
                                    {isLogin ? "Sign Up" : "Back to Login"}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CustomerAuth;