import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally handle Firebase/Auth0 logic
        navigate('/');
    };

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-3xl uppercase tracking-[0.2em] mb-4">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                        {isLogin ? 'Enter your details to access your profile' : 'Join the Antarri inner circle'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <motion.input
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            type="text" placeholder="FULL NAME" required
                            className="w-full bg-secondary border border-tertiary p-4 text-[11px] font-medium tracking-widest outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-textPrimary rounded-md shadow-sm"
                        />
                    )}
                    <input type="email" placeholder="EMAIL ADDRESS" required className="w-full bg-secondary border border-tertiary p-4 text-[11px] font-medium tracking-widest outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-textPrimary rounded-md shadow-sm" />
                    <input type="password" placeholder="PASSWORD" required className="w-full bg-secondary border border-tertiary p-4 text-[11px] font-medium tracking-widest outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-textPrimary rounded-md shadow-sm" />

                    <button type="submit" className="w-full bg-accent text-white py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-accentHover transition-all shadow-md rounded-md hover:-translate-y-1">
                        {isLogin ? 'LOGIN' : 'SIGN UP'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[11px] uppercase font-bold tracking-[0.2em] text-textSecondary hover:text-accent transition-colors border-b border-transparent hover:border-accent/30 pb-1"
                    >
                        {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;