import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // 1. Import your Auth Hook
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Truck, ShieldCheck, ChevronRight, Info, X, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems = [], cartTotal = 0, setCartItems } = useCart();
    const { user } = useAuth(); // 2. Access the user state from Context

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [showCodAlert, setShowCodAlert] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });

    const financials = useMemo(() => {
        const gstRate = 0.18;
        const subtotal = cartTotal;
        const gstAmount = subtotal * gstRate;
        const shipping = subtotal > 5000 ? 0 : 150;
        const grandTotal = subtotal + gstAmount + shipping;

        return { subtotal, gstAmount, shipping, grandTotal };
    }, [cartTotal]);

    const generateUniqueIDs = () => {
        const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const randomStr = () => Math.random().toString(36).substring(2, 7).toUpperCase();
        const randomNum = () => Math.floor(1000 + Math.random() * 9000);

        return {
            orderId: `ANT-${timestamp}-${randomStr()}`,
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

    // 3. Auto-fill form using the central Auth User object
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

    useEffect(() => {
        let timer;
        if (showCodAlert && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (showCodAlert && timeLeft === 0) {
            completeOrder('CASH_ON_DELIVERY');
        }
        return () => clearInterval(timer);
    }, [showCodAlert, timeLeft]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (paymentMethod === 'upi') {
            initiateRazorpay();
        } else {
            setShowCodAlert(true);
            setTimeLeft(10);
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
            name: "PRECISION OBJECTS",
            description: `Payment for Order ${orderId}`,
            image: "https://res.cloudinary.com/dzf9v7nkr/image/upload/v1676451163/noise_fllvly.png",
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
                color: "#000000"
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
        // Safety Check: If cart is empty, don't even ping the server
        if (!cartItems || cartItems.length === 0) {
            alert("Your cart appears to be empty. Please add items before checkout.");
            setIsSubmitting(false);
            return;
        }

        const { orderId, trackingId } = generateUniqueIDs();

        // Map items carefully to match your Backend Schema
        const processedItems = cartItems.map(item => ({
            product: item.id || item._id || item.productId, // Ensure we get a valid ID
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
            taxPrice: financials.gstAmount,
            shippingPrice: financials.shipping,
            totalPrice: financials.grandTotal,
            paymentId: paymentId,
            trackingId: trackingId,
            orderId: orderId
        };

        try {
            const token = localStorage.getItem('token');

            // Check if token exists before trying the request
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

            // SUCCESS FLOW
            if (setCartItems) setCartItems([]);

            // Clear local storage fallback if you use it
            localStorage.removeItem('ant_orders');

            setIsSubmitting(false);
            setShowCodAlert(false);

            navigate('/order-success', {
                state: {
                    orderId: data.orderId || orderId,
                    trackingId: data.trackingId || trackingId,
                    total: data.totalPrice
                }
            });
        } catch (error) {
            // Log the actual server response to see why it says "Cart is empty"
            console.error("Server Response Error:", error.response?.data);
            setIsSubmitting(false);
            setShowCodAlert(false);
            alert(error.response?.data?.message || "Internal Server Error");
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9]">
                <div className="text-center space-y-6">
                    <h2 className="text-xs uppercase tracking-[0.5em] font-bold">Your bag is empty</h2>
                    <button onClick={() => navigate('/shop')} className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-black/20 pb-1 hover:border-black transition-colors">Return to Shop</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFBF9] pt-32 pb-24 px-6 sm:px-12 md:px-20 relative overflow-hidden text-textPrimary font-sans">
            <AnimatePresence>
                {showCodAlert && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            onClick={() => { if (!isSubmitting) setShowCodAlert(false); }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white w-full max-w-md border border-black/10 shadow-2xl"
                            style={{ borderRadius: 0 }}
                        >
                            <div className="p-10 text-center space-y-8">
                                <div className="relative w-24 h-24 mx-auto">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-slate-100" />
                                        <motion.circle
                                            cx="48" cy="48" r="44" stroke="black" strokeWidth="2" fill="transparent"
                                            strokeDasharray="276"
                                            initial={{ strokeDashoffset: 0 }}
                                            animate={{ strokeDashoffset: 276 }}
                                            transition={{ duration: 10, ease: "linear" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-bold">{timeLeft}s</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[11px] uppercase tracking-[0.5em] font-extrabold">Confirm COD Purchase</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 leading-relaxed">
                                        System will auto-confirm in {timeLeft} seconds.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => { setShowCodAlert(false); setIsSubmitting(false); }}
                                        className="py-4 border border-black text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all"
                                        style={{ borderRadius: 0 }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => completeOrder('CASH_ON_DELIVERY')}
                                        className="py-4 bg-black text-white text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-black/80 transition-all flex items-center justify-center space-x-2"
                                        style={{ borderRadius: 0 }}
                                    >
                                        <span>Confirm Now</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16">
                    <span className="text-[9px] uppercase tracking-[0.6em] text-textSecondary font-bold block mb-4 opacity-50">Secure Checkout</span>
                    <h1 className="text-4xl md:text-5xl font-light uppercase tracking-tighter">Confirmation <span className="font-bold">& Payment</span></h1>
                </header>

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7 space-y-16">
                        <section className="space-y-10">
                            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-black/10 pb-4">01. Destination Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                <input type="text" name="fullName" value={formData.fullName} placeholder="RECEIVER NAME" required onChange={handleInputChange} disabled={isSubmitting} className="checkout-input" />
                                <input type="tel" name="phone" value={formData.phone} placeholder="MOBILE NUMBER" required onChange={handleInputChange} disabled={isSubmitting} className="checkout-input" />
                                <input type="email" name="email" value={formData.email} placeholder="EMAIL IDENTIFICATION" required onChange={handleInputChange} disabled={isSubmitting} className="checkout-input md:col-span-2" />
                                <input type="text" name="address" value={formData.address} placeholder="STREET ADDRESS / BUILDING / SUITE" required onChange={handleInputChange} disabled={isSubmitting} className="checkout-input md:col-span-2" />
                                <div className="grid grid-cols-2 gap-8 md:col-span-2">
                                    <input type="text" name="city" value={formData.city} placeholder="CITY" required onChange={handleInputChange} disabled={isSubmitting} className="checkout-input" />
                                    <input type="text" name="pincode" value={formData.pincode} placeholder="ZIP CODE" required onChange={handleInputChange} disabled={isSubmitting} className="checkout-input" />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-10">
                            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-black/10 pb-4">02. Transaction Method</h2>
                            <div className="space-y-4">
                                <label className={`flex items-center justify-between p-6 border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-black bg-black/[0.02]' : 'border-black/5 hover:border-black/20'}`} style={{ borderRadius: 0 }}>
                                    <div className="flex items-center space-x-4">
                                        <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} disabled={isSubmitting} className="accent-black" />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Digital Gateway</p>
                                            <p className="text-[8px] text-textSecondary uppercase tracking-widest mt-1">UPI, Card, NetBanking via Razorpay</p>
                                        </div>
                                    </div>
                                    <Smartphone className="w-4 h-4" />
                                </label>

                                <label className={`flex items-center justify-between p-6 border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-black/[0.02]' : 'border-black/5 hover:border-black/20'}`} style={{ borderRadius: 0 }}>
                                    <div className="flex items-center space-x-4">
                                        <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} disabled={isSubmitting} className="accent-black" />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Cash on Delivery</p>
                                            <p className="text-[8px] text-textSecondary uppercase tracking-widest mt-1">Settlement upon physical arrival</p>
                                        </div>
                                    </div>
                                    <Truck className="w-4 h-4" />
                                </label>
                            </div>

                            <AnimatePresence>
                                {paymentMethod === 'cod' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black text-white p-5 flex items-start space-x-4" style={{ borderRadius: 0 }}>
                                        <Info className="w-4 h-4 mt-0.5" />
                                        <p className="text-[9px] leading-relaxed uppercase tracking-widest font-medium">
                                            Notice: Anti-fraud verification may be required for COD orders.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 lg:p-10 border border-black/10 sticky top-32 shadow-2xl shadow-black/5" style={{ borderRadius: 0 }}>
                            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-10 border-b border-black/5 pb-4">Manifest</h2>
                            <div className="space-y-8 mb-12 overflow-y-auto max-h-[300px] pr-4 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id || item._id} className="flex justify-between items-center group">
                                        <div className="flex space-x-5 items-center">
                                            <div className="w-14 h-14 bg-stone-100 border border-black/5 overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-all" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest">{item.name}</h4>
                                                <p className="text-[8px] text-textSecondary uppercase tracking-[0.2em] mt-1">QTY: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold tracking-widest">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-black/5 pt-8 mb-10 text-[9px] tracking-[0.3em] uppercase font-bold">
                                <div className="flex justify-between">
                                    <span className="opacity-40">Subtotal</span>
                                    <span>₹{financials.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-40">Tax (GST 18%)</span>
                                    <span>₹{financials.gstAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-black/5 pb-4">
                                    <span className="opacity-40">Logistics</span>
                                    <span className={financials.shipping === 0 ? 'text-black font-extrabold' : ''}>
                                        {financials.shipping === 0 ? 'GRATIS' : `₹${financials.shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-6">
                                    <span className="text-[11px] font-black tracking-[0.5em]">Grand Total</span>
                                    <span className="text-2xl font-black">₹{financials.grandTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-stone-800 transition-all flex items-center justify-center space-x-4 disabled:opacity-30"
                                style={{ borderRadius: 0 }}
                            >
                                <span>{isSubmitting ? 'Authenticating...' : paymentMethod === 'upi' ? 'Initiate Payment' : 'Confirm Order'}</span>
                                {!isSubmitting && <ChevronRight className="w-3 h-3" />}
                            </button>

                            <div className="mt-10 pt-8 border-t border-black/5 flex items-center justify-center space-x-4 opacity-20 grayscale">
                                <ShieldCheck className="w-3 h-3" />
                                <span className="text-[8px] uppercase tracking-[0.4em] font-bold">Encrypted via Razorpay SSL</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                .checkout-input {
                    width: 100%;
                    background: transparent;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    padding: 1rem 0;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    outline: none;
                    transition: all 0.4s ease;
                }
                .checkout-input:focus {
                    border-bottom-color: #000;
                    padding-left: 0.5rem;
                }
                .checkout-input:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 1px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #000;
                }
            `}</style>
        </div>
    );
};

export default Checkout;