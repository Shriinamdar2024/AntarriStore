import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Smartphone, Truck, ShieldCheck } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems = [], cartTotal = 0, setCartItems } = useCart();
    const { user } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });

    const financials = useMemo(() => {
        const cgstRate = 0.01; // 1% CGST
        const sgstRate = 0.01; // 1% SGST
        const subtotal = cartTotal;
        const cgstAmount = subtotal * cgstRate;
        const sgstAmount = subtotal * sgstRate;
        const shipping = subtotal > 5000 ? 0 : 150;
        const grandTotal = subtotal + cgstAmount + sgstAmount + shipping;

        return { subtotal, cgstAmount, sgstAmount, shipping, grandTotal };
    }, [cartTotal]);

    const generateUniqueIDs = () => {
        const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const randomStr = () => Math.random().toString(36).substring(2, 7).toUpperCase();
        const randomNum = () => Math.floor(1000 + Math.random() * 9000);

        return {
            orderId: `ORD-${timestamp}-${randomStr()}`,
            trackingId: `TRK-${randomNum()}-${randomStr()}-${randomNum()}`
        };
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.name || user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                pincode: user.pincode || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Immediate checkout logic matching standard platforms (no delay/timers)
        if (paymentMethod === 'upi') {
            initiateRazorpay();
        } else {
            completeOrder('CASH_ON_DELIVERY');
        }
    };

    const initiateRazorpay = () => {
        if (!window.Razorpay) {
            alert("Razorpay SDK failed to load. Please check your connection.");
            setIsSubmitting(false);
            return;
        }

        const { orderId } = generateUniqueIDs();

        const options = {
            key: "rzp_test_RLjgtAspFkp1Hy",
            amount: Math.round(financials.grandTotal * 100),
            currency: "INR",
            name: "Antari Store",
            description: `Payment for Order ${orderId}`,
            image: "https://cdn-icons-png.flaticon.com/512/3144/3144456.png",
            handler: function (response) {
                completeOrder(response.razorpay_payment_id);
            },
            prefill: {
                name: formData.fullName,
                email: formData.email,
                contact: formData.phone
            },
            notes: {
                address: formData.address,
                merchant_order_id: orderId
            },
            theme: {
                color: "#2563eb"
            },
            modal: {
                ondismiss: function () {
                    setIsSubmitting(false);
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const completeOrder = async (paymentId) => {
        if (!cartItems || cartItems.length === 0) {
            alert("Your cart appears to be empty. Please add items before checkout.");
            setIsSubmitting(false);
            return;
        }

        const { orderId, trackingId } = generateUniqueIDs();

        const processedItems = cartItems.map(item => ({
            product: item.id || item._id || item.productId,
            name: item.name,
            qty: Number(item.quantity),
            price: Number(item.price),
            image: item.image
        }));

        const orderPayload = {
            orderItems: processedItems,
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode
            },
            paymentMethod: paymentMethod === 'upi' ? 'Digital' : 'COD',
            itemsPrice: financials.subtotal,
            taxPrice: financials.cgstAmount + financials.sgstAmount,
            shippingPrice: financials.shipping,
            totalPrice: financials.grandTotal,
            paymentId: paymentId,
            trackingId: trackingId,
            orderId: orderId
        };

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Session expired. Please log in again.");
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/orders', orderPayload, config);

            if (setCartItems) setCartItems([]);
            localStorage.removeItem('ant_orders');

            setIsSubmitting(false);

            navigate('/order-success', {
                state: {
                    orderId: data.orderId || orderId,
                    trackingId: data.trackingId || trackingId,
                    total: data.totalPrice
                }
            });
        } catch (error) {
            console.error("Server Response Error:", error.response?.data);
            setIsSubmitting(false);
            alert(error.response?.data?.message || "Internal Server Error");
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f3f6]">
                <div className="bg-white p-10 rounded-2xl shadow-sm text-center max-w-md w-full border border-black/5">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" className="w-24 h-24 mx-auto mb-6 opacity-80" alt="Empty Cart" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Cart is empty</h2>
                    <p className="text-sm text-slate-500 mb-8 font-medium">Please add items to your cart before proceeding to checkout.</p>
                    <button onClick={() => navigate('/shop')} className="w-full bg-[#facc15] text-slate-900 py-3 rounded-xl font-bold text-lg hover:bg-[#eab308] shadow-sm transition-colors">Return to Shop</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-textPrimary">
            
            {/* Safe/Secure Header Wrapper */}
            <div className="max-w-[1280px] mx-auto mb-6">
                <div className="bg-white p-4 rounded-xl border border-black/5 shadow-sm flex items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">Checkout Process</h1>
                    <div className="flex items-center gap-2 text-emerald-600">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wide">100% Secure</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto">
                <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* Main Forms */}
                    <div className="w-full lg:w-[65%] space-y-6">
                        {/* Delivery Address Section */}
                        <section className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                                <span className="bg-slate-800 text-white w-6 h-6 rounded flex items-center justify-center font-bold text-sm">1</span>
                                <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                                    <input type="text" name="fullName" value={formData.fullName} required onChange={handleInputChange} disabled={isSubmitting} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number</label>
                                    <input type="tel" name="phone" value={formData.phone} required onChange={handleInputChange} disabled={isSubmitting} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                                    <input type="email" name="email" value={formData.email} required onChange={handleInputChange} disabled={isSubmitting} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Street Address</label>
                                    <input type="text" name="address" value={formData.address} required onChange={handleInputChange} disabled={isSubmitting} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">City</label>
                                    <input type="text" name="city" value={formData.city} required onChange={handleInputChange} disabled={isSubmitting} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Pincode</label>
                                    <input type="text" name="pincode" value={formData.pincode} required onChange={handleInputChange} disabled={isSubmitting} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                            </div>
                        </section>

                        {/* Payment Method Section */}
                        <section className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                                <span className="bg-slate-800 text-white w-6 h-6 rounded flex items-center justify-center font-bold text-sm">2</span>
                                <h2 className="text-lg font-bold text-slate-900">Payment Options</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <label className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-blue-600' : 'border-slate-300'}`}>
                                            {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Pay Online (Secure)</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5 whitespace-normal">UPI, Cards, EMI, Netbanking via Razorpay</p>
                                        </div>
                                    </div>
                                    <Smartphone className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-blue-600' : 'text-slate-400'}`} />
                                </label>

                                <label className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-blue-600' : 'border-slate-300'}`}>
                                            {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Cash on Delivery</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5 whitespace-normal">Pay when you receive the package</p>
                                        </div>
                                    </div>
                                    <Truck className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-blue-600' : 'text-slate-400'}`} />
                                </label>
                            </div>
                        </section>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[35%] lg:sticky lg:top-28">
                        <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto no-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id || item._id} className="flex gap-4 items-start">
                                        <div className="w-16 h-20 rounded-lg bg-slate-50 border border-slate-100 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <h4 className="text-sm font-bold text-slate-800 line-clamp-1 truncate">{item.name}</h4>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-slate-900 mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-slate-100 text-sm font-medium text-slate-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-800">₹{financials.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (CGST + SGST)</span>
                                    <span className="font-bold text-slate-800">₹{(financials.cgstAmount + financials.sgstAmount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between pb-4 border-b border-slate-100">
                                    <span>Delivery Charges</span>
                                    <span className={`font-bold ${financials.shipping === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                                        {financials.shipping === 0 ? 'FREE' : `₹${financials.shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-base font-bold text-slate-900">Total Payable</span>
                                    <span className="text-2xl font-extrabold text-slate-900">₹{financials.grandTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-6 bg-[#facc15] hover:bg-[#eab308] text-slate-900 py-4 rounded-xl font-bold text-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : paymentMethod === 'upi' ? 'Pay Securely' : 'Place Order'}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-xs font-medium">Safe & Secure Payments</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;