import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Package, ArrowRight, ShieldCheck, Truck, Clipboard } from 'lucide-react';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract dynamic data passed from Checkout.jsx
    // Fallback provided to prevent errors if page is accessed directly
    const { orderId, trackingId, total } = location.state || {
        orderId: "PENDING",
        trackingId: "GENERATING...",
        total: 0
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        // Redirect if no order data exists (security/UX best practice)
        if (!location.state) {
            const timer = setTimeout(() => navigate('/shop'), 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state, navigate]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You could add a small toast notification here if you have one
    };

    return (
        <div className="min-h-screen bg-[#FBFBF9] pt-32 pb-20 px-6 relative overflow-hidden flex items-center justify-center">
            {/* Background Textures */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://res.cloudinary.com/dzf9v7nkr/image/upload/v1676451163/noise_fllvly.png')] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl w-full relative z-10 text-center"
            >
                {/* Success Icon Badge */}
                <div className="mb-10 flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 rounded-full bg-black flex items-center justify-center shadow-2xl shadow-black/20"
                    >
                        <Check className="w-10 h-10 text-white stroke-[3]" />
                    </motion.div>
                </div>

                {/* Header Section */}
                <header className="mb-12">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-textPrimary font-bold block mb-4">
                        Transaction Verified
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-textPrimary leading-none mb-6">
                        Thank <span className="italic font-light text-textSecondary/60">You</span>
                    </h1>
                    <div className="w-12 h-[1px] bg-black mx-auto mb-6" />
                    <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-textPrimary">
                        Acquisition Confirmed & Processing
                    </p>
                </header>

                {/* Information Card */}
                <div className="bg-white border border-black/5 p-8 md:p-12 mb-12 shadow-sm relative" style={{ borderRadius: 0 }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FBFBF9] px-4">
                        <Package className="w-5 h-5 text-textSecondary/40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="space-y-2 border-b md:border-b-0 md:border-r border-black/5 pb-6 md:pb-0 md:pr-8">
                            <span className="text-[9px] uppercase tracking-widest text-textSecondary block">Order Reference</span>
                            <p className="font-serif text-xl text-textPrimary break-all">{orderId}</p>
                            <button
                                onClick={() => copyToClipboard(orderId)}
                                className="flex items-center space-x-2 text-[8px] uppercase tracking-tighter opacity-40 hover:opacity-100 transition-opacity"
                            >
                                <Clipboard className="w-3 h-3" />
                                <span>Copy ID</span>
                            </button>
                        </div>

                        <div className="space-y-2 md:pl-8">
                            <span className="text-[9px] uppercase tracking-widest text-textSecondary block">Logistics Tracking</span>
                            <p className="font-serif text-xl text-textPrimary break-all">{trackingId}</p>
                            <span className="text-[8px] uppercase tracking-widest text-green-600 font-bold">Status: Active</span>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-black/5 text-center">
                        <p className="text-[11px] font-light leading-relaxed text-textSecondary max-w-sm mx-auto">
                            A formal confirmation has been dispatched to your registered email. Your assets are currently being prepared for transit.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <button
                        onClick={() => navigate(`/track-order?id=${orderId}`)}
                        className="group flex items-center space-x-3 text-[11px] font-bold uppercase tracking-[0.3em] text-black hover:opacity-70 transition-all duration-300"
                    >
                        <Truck className="w-4 h-4" />
                        <span>Track Acquisition</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="hidden md:block w-px h-4 bg-black/10" />

                    <Link
                        to="/shop"
                        className="text-[11px] font-bold uppercase tracking-[0.3em] text-textSecondary/60 hover:text-textPrimary transition-colors"
                    >
                        Continue Browsing
                    </Link>
                </div>

                {/* Security Badge */}
                <div className="mt-20 flex items-center justify-center space-x-2 text-[9px] uppercase tracking-widest text-textSecondary/40 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure Authenticated Purchase</span>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;