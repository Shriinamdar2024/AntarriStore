import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, ChevronLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CustomerAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [otpMode, setOtpMode] = useState(false);
    const [otp, setOtp] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!otpMode) {
                if (isLogin) {
                    await API.post('/users/login', formData);
                } else {
                    await API.post('/users/register', { email: formData.email });
                }
                setOtpMode(true);
                return;
            }

            if (isLogin) {
                const { data } = await API.post('/users/verify-login', {
                    email: formData.email,
                    otp
                });
                localStorage.removeItem('isAdminLoggedIn');
                login(data.user || data, data.token);
                navigate('/');
            } else {
                const { data } = await API.post('/users/verify-register', {
                    email: formData.email,
                    otp,
                    name: formData.name,
                    password: formData.password
                });
                
                toast.success("Registration Successful! Please login.", {
                    position: "top-center",
                    autoClose: 2000
                });

                setOtpMode(false);
                setIsLogin(true);
                setOtp('');
                setFormData({ name: '', email: '', password: '' });
            }
        } catch (err) {
            console.error("Auth Error:", err);
            const message = err.response?.data?.message || err.message;
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f1f3f6] font-sans text-slate-900 p-4 md:p-8">
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row relative border border-slate-100"
            >
                {/* Left Side Showcase (Visually Stunning) */}
                <div className="hidden md:flex md:w-5/12 relative overflow-hidden bg-slate-900">
                    <motion.div 
                        animate={{ 
                            backgroundPosition: ['0% 0%', '100% 100%'],
                            scale: [1, 1.1, 1] 
                        }}
                        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                        className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/90 via-sky-900/60 to-transparent" />
                    
                    <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
                        <div>
                            <div className="flex items-center gap-2 text-white/90 mb-4">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                <span className="text-xs font-bold uppercase tracking-widest">Antari Store</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white leading-tight mt-12 mb-6">
                                {isLogin ? "Welcome Back to Premium." : "Start Your Journey."}
                            </h2>
                            <p className="text-sky-100 font-medium leading-relaxed max-w-xs">
                                {isLogin 
                                    ? "Access your dashboard, track orders, and discover new exclusive arrivals perfectly tailored for you." 
                                    : "Join thousands of members enjoying seamless shopping, fast deliveries, and secured checkouts."}
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center gap-4 mb-2">
                                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                <span className="font-bold text-white text-sm">Secure Authentication</span>
                            </div>
                            <p className="text-xs text-sky-100/70 font-medium">Your data is encrypted and completely secure. OTP verification ensures your account stays safe.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-full md:w-7/12 p-8 md:p-14 lg:p-20 relative bg-white flex flex-col justify-center">
                    
                    {(otpMode || !isLogin) && (
                        <button
                            onClick={() => {
                                if (otpMode) setOtpMode(false);
                                else setIsLogin(true);
                            }}
                            className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-slate-50 px-4 py-2 rounded-lg"
                        >
                            <ChevronLeft size={16} /> Back
                        </button>
                    )}

                    <div className="w-full max-w-md mx-auto mt-10 md:mt-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={otpMode ? "otp" : isLogin ? "login" : "register"}
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="mb-10 text-center md:text-left">
                                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                                        {otpMode ? "Verify Email" : isLogin ? "Sign In" : "Create Account"}
                                    </h2>
                                    <p className="text-sm font-medium text-slate-500">
                                        {otpMode ? `Enter the 6-digit code sent to ${formData.email}` : isLogin ? "Welcome back! Please enter your details." : "Fill in your details below to get started."}
                                    </p>
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 border border-red-100">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {!otpMode ? (
                                        <>
                                            {!isLogin && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                                                    <div className="relative group">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                                        <input
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            placeholder="John Doe"
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="you@example.com"
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                                    <input
                                                        name="password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="••••••••"
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 text-sm font-medium focus:bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 text-center block">Secure OTP Code</label>
                                            <div className="relative">
                                                <input
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    placeholder="000000"
                                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-4 text-center text-3xl font-bold tracking-[0.5em] focus:bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                    required
                                                    maxLength={6}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-6 bg-[#facc15] hover:bg-[#eab308] text-slate-900 py-4 rounded-xl font-bold shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] transition-all flex items-center justify-center gap-2 "
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {otpMode ? "Verify & Continue" : isLogin ? "Sign In Securely" : "Create My Account"}
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </motion.button>
                                </form>

                                {!otpMode && (
                                    <div className="mt-10 text-center">
                                        <p className="text-sm font-medium text-slate-500">
                                            {isLogin ? "Don't have an account?" : "Already registered?"}
                                            <button
                                                onClick={() => setIsLogin(!isLogin)}
                                                className="ml-2 font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                            >
                                                {isLogin ? "Sign up now" : "Log in here"}
                                            </button>
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    
                    {/* Bottom Links */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
                        {['Terms of Service', 'Privacy Policy'].map(item => (
                            <span key={item} className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomerAuth;