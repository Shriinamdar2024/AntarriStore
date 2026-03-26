import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

const TrackOrder = () => {
    const [searchId, setSearchId] = useState('');
    const [foundOrder, setFoundOrder] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const containerVars = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.12 } }
    };

    const itemVars = {
        hidden: { opacity: 0, x: -8 },
        visible: { opacity: 1, x: 0 }
    };

    const performTracking = useCallback(async (id) => {
        if (!id) return;
        setLoading(true);
        setFoundOrder(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Please log in to track your acquisitions.");
                setLoading(false);
                return;
            }

            const { data } = await axios.get(`http://localhost:5000/api/orders/track/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const statusMap = {
                'Pending': 0,
                'Processing': 1,
                'Shipped': 2,
                'Out for Delivery': 3, // ADDED THIS
                'Delivered': 4,        // BUMPED THIS TO 4
                'Cancelled': -1
            };

            const currentStep = statusMap[data.status] || 0;

            setFoundOrder({
                orderId: data.orderId,
                city: data.shippingAddress.city.toUpperCase(),
                // UPDATED: Added Out for Delivery to the text logic
                expectedDelivery: data.status === 'Delivered' ? "ARRIVED" :
                    (data.status === 'Cancelled' ? "TERMINATED" :
                        (data.status === 'Out for Delivery' ? "NEAR DESTINATION" : "IN TRANSIT")),
                status: data.status,
                timeline: [
                    {
                        label: 'Confirmed',
                        date: new Date(data.createdAt).toLocaleDateString(),
                        time: new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        completed: currentStep >= 0 || data.status === 'Cancelled'
                    },
                    {
                        label: 'Shipped',
                        date: data.shippedAt ? new Date(data.shippedAt).toLocaleDateString() : '--',
                        time: '--',
                        completed: currentStep >= 2
                    },
                    {
                        label: 'Out for Delivery', // UPDATED: Logic now checks currentStep
                        date: '--',
                        time: '--',
                        completed: currentStep >= 3
                    },
                    {
                        label: 'Delivered',
                        date: data.deliveredAt ? new Date(data.deliveredAt).toLocaleDateString() : '--',
                        time: '--',
                        completed: currentStep >= 4
                    }
                ]
            });
        } catch (error) {
            console.error("Tracking Error:", error);
            const errorMsg = error.response?.data?.message || "Order Reference Not Found";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if (id) {
            setSearchId(id);
            performTracking(id);
        }
    }, [location.search, performTracking]);

    // UPDATED: Now connects to Backend to persist changes
    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) return;

        try {
            const token = localStorage.getItem('token');

            // Call the PUT route we added to orderRoutes.js
            await axios.put(
                `http://localhost:5000/api/orders/track/${foundOrder.orderId}/cancel`,
                { reason: cancelReason },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Update UI only after database confirms success
            setFoundOrder(prev => ({ ...prev, status: 'Cancelled', expectedDelivery: 'TERMINATED' }));
            setIsCancelling(false);
            setCancelReason('');
            alert("Acquisition successfully terminated in our records.");

        } catch (error) {
            console.error("Cancellation Error:", error);
            alert(error.response?.data?.message || "Could not process termination at this time.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBF9] pt-40 pb-20 px-6 text-textPrimary">
            <div className="max-w-2xl mx-auto">
                <header className="mb-20">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10 text-center">
                        <span className="text-[10px] uppercase tracking-[0.5em] text-textSecondary/60 font-bold block mb-4">Logistics Interface</span>
                        <h1 className="text-5xl font-serif">Track Acquisition</h1>
                    </motion.div>

                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="REFERENCE ID (E.G. ANT-99281)"
                            className="w-full bg-white border border-black/[0.05] px-8 py-5 text-[11px] tracking-[0.3em] outline-none focus:border-black transition-all uppercase font-bold"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && performTracking(searchId)}
                        />
                        <button
                            onClick={() => performTracking(searchId)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 group-hover:gap-3 transition-all"
                        >
                            <span className="text-[9px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">Locate</span>
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center">
                            <div className="w-10 h-[1px] bg-black mx-auto animate-pulse" />
                        </motion.div>
                    ) : foundOrder && (
                        <motion.div
                            key="results"
                            variants={containerVars}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="space-y-8"
                        >
                            <div className="bg-white border border-black/[0.03] p-10 flex flex-col md:flex-row justify-between items-start md:items-end">
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-textSecondary font-bold mb-2">Acquisition Status</p>
                                    <h2 className={`text-3xl font-serif ${foundOrder.status === 'Cancelled' ? 'text-rose-500' : ''}`}>
                                        {foundOrder.expectedDelivery}
                                    </h2>
                                    <p className="text-[10px] uppercase tracking-widest mt-2 opacity-40">Destination: {foundOrder.city}</p>
                                </div>
                                {foundOrder.status === "Pending" && (
                                    <button
                                        onClick={() => setIsCancelling(true)}
                                        className="mt-6 md:mt-0 text-[9px] uppercase tracking-widest font-bold text-rose-500/50 hover:text-rose-600 transition-colors py-2 border-b border-rose-500/10 hover:border-rose-600/30"
                                    >
                                        Terminate Order
                                    </button>
                                )}
                            </div>

                            {/* Logic to hide timeline if cancelled, or show with dimmed steps */}
                            <div className="bg-white border border-black/[0.03] p-10 md:p-16">
                                <div className="space-y-16">
                                    {foundOrder.timeline.map((step, idx) => (
                                        <motion.div key={idx} variants={itemVars} className={`flex gap-10 relative ${foundOrder.status === 'Cancelled' && idx > 0 ? 'opacity-20' : ''}`}>
                                            {idx !== foundOrder.timeline.length - 1 && (
                                                <div className="absolute left-[10px] top-8 w-[1px] h-16 bg-black/[0.03]">
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: step.completed ? '100%' : '0%' }}
                                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                                        className="bg-black/20 w-full"
                                                    />
                                                </div>
                                            )}

                                            <div className="relative z-10 flex flex-col items-center">
                                                {step.completed ? (
                                                    <CheckCircle2 className="w-5 h-5 text-black" strokeWidth={1.5} />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border border-black/10 flex items-center justify-center">
                                                        <div className="w-1 h-1 bg-black/10 rounded-full" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 flex justify-between items-start border-b border-black/[0.02] pb-8">
                                                <div>
                                                    <h3 className={`text-[11px] uppercase tracking-[0.3em] font-bold ${step.completed ? 'text-black' : 'text-black/20'}`}>
                                                        {step.label}
                                                    </h3>
                                                    <p className="text-[9px] text-textSecondary tracking-widest mt-2 uppercase">
                                                        {step.completed ? 'Verified & Scanned' : 'Awaiting Processing'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-[10px] font-bold tracking-tighter ${step.completed ? 'text-black' : 'text-black/10'}`}>
                                                        {step.time !== '--' ? step.time : ''}
                                                    </p>
                                                    <p className="text-[9px] text-textSecondary uppercase tracking-widest mt-1">
                                                        {step.date !== '--' ? step.date : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isCancelling && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-[#FBFBF9]/90 backdrop-blur-sm flex items-center justify-center p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.98, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white border border-black/5 p-12 max-w-lg w-full shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3 text-rose-500">
                                        <AlertCircle className="w-4 h-4" />
                                        <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold">Termination</h2>
                                    </div>
                                    <button onClick={() => setIsCancelling(false)} className="opacity-20 hover:opacity-100 transition-opacity"><X size={18} /></button>
                                </div>

                                <textarea
                                    className="w-full border-b border-black/10 py-4 text-[11px] uppercase tracking-[0.4em] outline-none focus:border-black transition-colors min-h-[120px] resize-none mb-10 bg-transparent placeholder:opacity-30"
                                    placeholder="STATE REASON FOR CANCELLATION..."
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />

                                <button
                                    onClick={handleCancelOrder}
                                    disabled={!cancelReason.trim()}
                                    className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-rose-600 transition-all disabled:opacity-10"
                                >
                                    Confirm Termination
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TrackOrder;