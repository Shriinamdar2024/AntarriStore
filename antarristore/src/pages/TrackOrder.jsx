import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Package, Truck, Home, X, AlertCircle, Check, XCircle, Box } from 'lucide-react';
import axios from 'axios';

const TrackOrder = () => {
    const [searchId, setSearchId] = useState('');
    const [foundOrder, setFoundOrder] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    // Map backend status to nice UI labels
    const getStatusLabel = (status) => {
        if (status === 'Cancelled') return 'Cancelled';
        const statusMap = {
            'Pending': 'Order Placed',
            'Processing': 'Processing',
            'Shipped': 'Shipped',
            'Out for Delivery': 'Out for Delivery',
            'Delivered': 'Delivered'
        };
        return statusMap[status] || status;
    };

    const performTracking = useCallback(async (id) => {
        if (!id) return;
        setLoading(true);
        setFoundOrder(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Please log in to track your order.");
                setLoading(false);
                return;
            }

            const { data } = await axios.get(`https://antarri-backend.onrender.com/api/orders/track/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Map status logically to steps index
            let currentStepIndex = 0;
            if (data.status === 'Cancelled') {
                currentStepIndex = -1;
            } else if (data.status === 'Pending' || data.status === 'Processing') {
                currentStepIndex = 0;
            } else if (data.status === 'Shipped') {
                currentStepIndex = 1;
            } else if (data.status === 'Out for Delivery') {
                currentStepIndex = 2;
            } else if (data.status === 'Delivered') {
                currentStepIndex = 3;
            }

            setFoundOrder({
                orderId: data.orderId,
                city: data.shippingAddress.city,
                status: data.status,
                currentStepIndex,
                dates: {
                    ordered: data.createdAt,
                    shipped: data.shippedAt,
                    delivered: data.deliveredAt,
                },
                items: data.orderItems || []
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

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) return;

        try {
            const token = localStorage.getItem('token');

            await axios.put(
                `https://antarri-backend.onrender.com/api/orders/track/${foundOrder.orderId}/cancel`,
                { reason: cancelReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setFoundOrder(prev => ({ ...prev, status: 'Cancelled', currentStepIndex: -1 }));
            setIsCancelling(false);
            setCancelReason('');

        } catch (error) {
            console.error("Cancellation Error:", error);
            alert(error.response?.data?.message || "Could not process termination at this time.");
        }
    };

    const steps = [
        { label: 'Order Placed', icon: Package, description: 'We have received your order' },
        { label: 'Shipped', icon: Truck, description: 'Your package is on the way' },
        { label: 'Out for Delivery', icon: MapPin, description: 'Package is near your location' },
        { label: 'Delivered', icon: Home, description: 'Package has been delivered' }
    ];

    return (
        <div className="min-h-screen bg-[#f1f3f6] pt-16 sm:pt-24 pb-20 font-sans text-slate-900">
            
            {/* Standard White Tracking Banner */}
            <div className="bg-white border-b border-black/5 shadow-sm mb-8 relative">
                <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16 text-center">
                    <div className="w-10 h-10 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 flex items-center justify-center rounded-full mx-auto mb-3">
                        <Box className="w-8 h-8" />
                    </div>
                    <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mb-1 sm:mb-2">Track Your Package</h1>
                    <p className="text-slate-500 font-medium mb-4 sm:mb-8 text-sm">Enter your Order ID to get real-time tracking updates.</p>

                    <div className="relative max-w-xl mx-auto flex items-center bg-white border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors shadow-sm">
                        <input
                            type="text"
                            placeholder="e.g. ORD-2026..."
                            className="flex-1 bg-transparent px-3 sm:px-5 py-3 sm:py-4 text-sm font-bold text-slate-900 outline-none"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && performTracking(searchId)}
                        />
                        <button
                            onClick={() => performTracking(searchId)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-8 py-3 sm:py-4 font-bold text-sm transition-colors flex items-center gap-2 h-full"
                        >
                            Track <Search className="w-4 h-4 hidden sm:block" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Loading State */}
                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div 
                            key="loading" 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                            className="flex flex-col items-center py-20 gap-4"
                        >
                            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
                            <p className="text-slate-500 font-bold">Locating package details...</p>
                        </motion.div>
                    )}

                    {/* Results State */}
                    {foundOrder && !loading && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm border border-black/5"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 gap-4">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900">
                                        Order #{foundOrder.orderId}
                                        {foundOrder.status === 'Cancelled' ? (
                                            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-red-100">
                                                <XCircle className="w-4 h-4" /> Cancelled
                                            </span>
                                        ) : (
                                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-100">
                                                <Check className="w-4 h-4" /> Active
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-slate-500 text-sm flex items-center gap-2 mt-2 font-medium">
                                        <MapPin className="w-4 h-4 text-slate-400" /> Delivering to: <span className="text-slate-800 font-bold capitalize">{foundOrder.city}</span>
                                    </p>
                                </div>

                                {foundOrder.status === "Pending" && (
                                    <button
                                        onClick={() => setIsCancelling(true)}
                                        className="text-red-600 hover:text-white border-2 border-red-100 hover:bg-red-600 hover:border-red-600 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <X className="w-4 h-4" /> Cancel Order
                                    </button>
                                )}
                            </div>

                            {/* Tracking Stepper */}
                            <div className="py-6 sm:py-12 md:py-16">
                                <div className="relative">
                                    <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-slate-100 -translate-y-1/2 rounded-full hidden md:block" />
                                    
                                    {foundOrder.status !== 'Cancelled' && (
                                        <div 
                                            className="absolute top-1/2 left-[10%] h-1 bg-emerald-500 -translate-y-1/2 rounded-full hidden md:block transition-all duration-1000 ease-out" 
                                            style={{ width: `${Math.max(0, (foundOrder.currentStepIndex / (steps.length - 1)) * 80)}%` }} 
                                        />
                                    )}

                                    <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                                        {steps.map((step, idx) => {
                                            const isCompleted = foundOrder.status !== 'Cancelled' && idx <= foundOrder.currentStepIndex;
                                            const isCurrent = foundOrder.status !== 'Cancelled' && idx === foundOrder.currentStepIndex;
                                            const Icon = step.icon;
                                            
                                            return (
                                                <div key={idx} className="flex md:flex-col items-center gap-3 md:gap-4 md:w-1/4 relative group">
                                                    {idx < steps.length - 1 && (
                                                        <div className="absolute left-6 top-14 bottom-[-2rem] w-1 bg-slate-100 md:hidden rounded-full">
                                                            {foundOrder.status !== 'Cancelled' && idx < foundOrder.currentStepIndex && (
                                                                <div className="w-full h-full bg-emerald-500 rounded-full" />
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 border-[3px] transition-all duration-500 shadow-sm z-10 bg-white
                                                        ${foundOrder.status === 'Cancelled' ? 'border-slate-200 text-slate-300' :
                                                        isCompleted ? 'border-emerald-500 text-emerald-600 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]' : 
                                                        'border-slate-200 text-slate-300'}`}>
                                                        {isCompleted && !isCurrent ? <Check className="w-7 h-7" strokeWidth={3} /> : <Icon className="w-6 h-6" strokeWidth={isCompleted ? 2.5 : 2} />}
                                                    </div>
                                                    
                                                    <div className="text-left md:text-center">
                                                        <h3 className={`font-bold text-sm mb-1 transition-colors ${
                                                            foundOrder.status === 'Cancelled' ? 'text-slate-400' :
                                                            isCompleted ? 'text-slate-900' : 'text-slate-400'
                                                        }`}>
                                                            {step.label}
                                                        </h3>
                                                        <p className={`text-xs max-w-[140px] hidden md:block mx-auto font-medium ${
                                                            foundOrder.status === 'Cancelled' ? 'text-slate-300' :
                                                            isCompleted ? 'text-emerald-600' : 'text-slate-400'
                                                        }`}>
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information Box */}
                            {foundOrder.status !== 'Cancelled' && (
                                <div className="bg-slate-50/80 rounded-xl p-6 mt-4 border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-3">Tracking History</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600 font-bold">Order Received</span>
                                            <span className="font-bold text-slate-900">
                                                {new Date(foundOrder.dates.ordered).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                            </span>
                                        </div>
                                        {foundOrder.dates.shipped && (
                                            <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200/60">
                                                <span className="text-slate-600 font-bold">Package Dispatched</span>
                                                <span className="font-bold text-slate-900">
                                                    {new Date(foundOrder.dates.shipped).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        )}
                                        {foundOrder.dates.delivered && (
                                            <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200/60">
                                                <span className="text-slate-600 font-bold">Successfully Delivered</span>
                                                <span className="font-bold text-emerald-600">
                                                    {new Date(foundOrder.dates.delivered).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour:'2-digit', minute:'2-digit' })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Cancel Modal Window */}
            <AnimatePresence>
                {isCancelling && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3 text-red-600">
                                    <div className="bg-red-50 p-2 rounded-full">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Cancel Order</h2>
                                </div>
                                <button onClick={() => setIsCancelling(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <p className="text-slate-600 text-sm font-medium">
                                    Are you sure you want to cancel this order? This action cannot be undone. Please let us know why you are cancelling.
                                </p>
                                <textarea
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl p-4 text-sm text-slate-900 font-medium focus:border-red-500 outline-none transition-colors resize-none h-32"
                                    placeholder="Order by mistake, taking too long, etc."
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsCancelling(false)}
                                    className="flex-1 px-4 py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={!cancelReason.trim()}
                                    className="flex-1 px-4 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    Confirm Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrackOrder;