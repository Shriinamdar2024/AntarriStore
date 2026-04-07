import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Truck, Copy } from 'lucide-react';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract dynamic data passed from Checkout.jsx
    const { orderId, trackingId, total } = location.state || {
        orderId: "ORD-PENDING",
        trackingId: "TRK-PENDING",
        total: 0
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!location.state) {
            const timer = setTimeout(() => navigate('/shop'), 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state, navigate]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert(`Copied: ${text}`);
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] pt-24 pb-20 px-4 sm:px-6 flex items-center justify-center font-sans text-slate-900">
            
            <div className="max-w-2xl w-full">
                
                {/* Main Success Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-8 md:p-12 mb-6 text-center">
                    
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Order Placed Successfully!</h1>
                    <p className="text-slate-500 font-medium mb-8">Thank you for your purchase. We've sent a confirmation email to you.</p>

                    {/* Order Details Box */}
                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 text-left mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order Ref</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-slate-800">{orderId}</p>
                                    <button onClick={() => copyToClipboard(orderId)} className="text-slate-400 hover:text-blue-600 transition-colors">
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                <p className="text-sm font-bold text-slate-800">₹{total ? total.toLocaleString() : '---'}</p>
                            </div>
                            <div className="md:col-span-2 pt-4 border-t border-slate-200">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tracking ID</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-blue-600 font-mono">{trackingId}</p>
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Processing</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate(`/track-order?id=${orderId}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm w-full sm:w-auto"
                        >
                            <Truck className="w-5 h-5" />
                            Track Order
                        </button>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 px-8 py-3.5 rounded-xl font-bold transition-all w-full sm:w-auto"
                        >
                            Continue Shopping
                        </button>
                    </div>

                </div>

                {/* Footer Security Badge */}
                <div className="flex items-center justify-center gap-2 text-slate-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wide">100% Safe & Secure Delivery</span>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccess;