import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ChevronRight,
    ArrowLeft,
    Download,
    Truck,
    HelpCircle,
    XCircle,
    Clipboard,
    Clock,
    CheckCircle2
} from 'lucide-react';
import axios from 'axios';

const Orders = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionModal, setActionModal] = useState({ show: false, type: '', orderId: null });
    const [reason, setReason] = useState('');

    // Dynamic State
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders from Backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:5000/api/orders/myorders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setMyOrders(data);
                }
            } catch (error) {
                console.error("Archive Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const canReturn = (date) => {
        if (!date) return false;
        const orderDate = new Date(date);
        const today = new Date();
        const diffDays = Math.ceil(Math.abs(today - orderDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 4;
    };

    const filteredOrders = useMemo(() => {
        if (activeFilter === 'All') return myOrders;
        return myOrders.filter(o => o.status?.toLowerCase() === activeFilter.toLowerCase());
    }, [activeFilter, myOrders]);

    // UPDATED handleActionSubmit
    const handleActionSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const isCancel = actionModal.type === 'Cancel';

            // Find the full order object from state
            const orderToUpdate = myOrders.find(o => o._id === actionModal.orderId);

            // Determine the identifier to send to the URL (prefers custom orderId)
            const identifier = orderToUpdate?.orderId || actionModal.orderId;

            if (!identifier) {
                alert("Reference identifier not found.");
                return;
            }

            // Determine endpoint based on action type
            const endpoint = isCancel ? 'cancel' : 'return';

            const response = await axios.put(
                `http://localhost:5000/api/orders/${identifier}/${endpoint}`,
                { reason: reason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                const newStatus = isCancel ? 'Cancelled' : 'Returned';

                // Update local list state
                const updatedOrders = myOrders.map(order =>
                    order._id === actionModal.orderId ? { ...order, status: newStatus } : order
                );
                setMyOrders(updatedOrders);

                // Update detail view if open
                if (selectedOrder?._id === actionModal.orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }

                // Reset Modal
                setActionModal({ show: false, type: '', orderId: null });
                setReason('');
            }
        } catch (error) {
            console.error("Action Error:", error);
            alert(error.response?.data?.message || "Communication with server failed.");
        }
    };

    const getStatusStyles = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'pending':
            case 'processing': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'cancelled': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'returned': return 'text-slate-600 bg-slate-50 border-slate-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    const OrderDetailView = ({ order }) => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <button onClick={() => setSelectedOrder(null)} className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 hover:text-black transition-all mb-4">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Archives
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-serif">Order {order.orderId || order._id.slice(-8).toUpperCase()}</h1>
                        <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold border ${getStatusStyles(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 border border-black/10 text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all">
                        <Download size={14} /> Download Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border border-black/[0.05]">
                        <div className="p-6 border-b border-black/[0.05] bg-stone-50/50">
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Shipment Manifest</p>
                        </div>
                        {(order.orderItems || []).map((item, idx) => (
                            <div key={idx} className="p-8 flex gap-8 items-center border-b border-black/[0.03] last:border-0">
                                <div className="w-20 aspect-[3/4] bg-stone-100 overflow-hidden">
                                    <img src={item.image || "https://via.placeholder.com/400"} className="w-full h-full object-cover grayscale" alt="" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold uppercase tracking-wider">{item.name}</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Qty: {item.qty}</p>
                                </div>
                                <p className="font-serif text-lg">₹{item.price?.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        {(order.status === 'Pending' || order.status === 'Processing') && (
                            <button onClick={() => setActionModal({ show: true, type: 'Cancel', orderId: order._id })} className="flex-1 border border-rose-100 text-rose-600 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-rose-600 hover:text-white transition-all">
                                Request Cancellation
                            </button>
                        )}
                        {order.status === 'Delivered' && canReturn(order.createdAt) && (
                            <button onClick={() => setActionModal({ show: true, type: 'Return', orderId: order._id })} className="flex-1 border border-black/10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all">
                                Initialize Return
                            </button>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-black/[0.05] p-8 space-y-8">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-3">Destination</p>
                            <p className="text-[11px] uppercase tracking-widest font-medium leading-relaxed">
                                {order.shippingAddress
                                    ? `${order.shippingAddress.address}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}`
                                    : "Address not provided"}
                            </p>
                        </div>
                        <div className="pt-6 border-t border-black/[0.05]">
                            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-3">Billing Info</p>
                            <p className="text-[11px] uppercase tracking-widest font-medium">{order.email}</p>
                        </div>
                    </div>

                    <div className="bg-black text-white p-8">
                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-50"><span>Subtotal</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
                            <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-50"><span>Logistics</span><span>{order.shippingPrice > 0 ? `₹${order.shippingPrice}` : 'Complimentary'}</span></div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Grand Total</span>
                                <span className="text-2xl font-serif">₹{order.totalPrice?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    if (loading) return <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center font-serif uppercase tracking-widest opacity-50">Fetching Archives...</div>;

    return (
        <div className="min-h-screen bg-[#FBFBF9] pt-40 pb-20 px-6 md:px-20">
            <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {!selectedOrder ? (
                        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <header className="mb-16 flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.5em] text-slate-500 font-bold block mb-4">Account Archives</span>
                                    <h1 className="text-5xl md:text-6xl font-serif">Order History</h1>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-[10px] uppercase tracking-widest font-bold">{myOrders.length} Total Records</p>
                                </div>
                            </header>

                            <div className="flex gap-8 mb-12 border-b border-black/5 pb-6 overflow-x-auto no-scrollbar">
                                {filters.map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`text-[11px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all relative ${activeFilter === f ? 'text-black' : 'text-slate-400 hover:text-black/60'}`}
                                    >
                                        {f}
                                        {activeFilter === f && <motion.div layoutId="tab-underline" className="absolute -bottom-6 left-0 w-full h-[2px] bg-black" />}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                    <div key={order._id} className="bg-white border border-black/[0.03] hover:border-black/10 transition-all p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                            <div className="md:col-span-1 aspect-[3/4] bg-stone-50">
                                                <img src={order.orderItems?.[0]?.image || "https://via.placeholder.com/400"} className="w-full h-full object-cover grayscale opacity-80" alt="" />
                                            </div>
                                            <div className="md:col-span-4">
                                                <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 mb-1">{order.orderId}</p>
                                                <h3 className="text-sm font-bold uppercase tracking-wider">{order.orderItems?.[0]?.name || "Antaristore Shipment"}</h3>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Processed: {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="md:col-span-3">
                                                <span className={`inline-block px-3 py-1 text-[8px] uppercase tracking-widest font-bold border ${getStatusStyles(order.status)} mb-2`}>
                                                    {order.status}
                                                </span>
                                                <p className="text-lg font-serif">₹{order.totalPrice?.toLocaleString()}</p>
                                            </div>
                                            <div className="md:col-span-4 flex justify-end">
                                                <button onClick={() => setSelectedOrder(order)} className="px-8 py-3 border border-black/10 text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all">
                                                    View Archival Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center border border-dashed border-black/10">
                                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-20">No matching archives found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <OrderDetailView key="detail" order={selectedOrder} />
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {actionModal.show && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#FBFBF9]/95 backdrop-blur-sm flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-black/10 p-12 max-w-lg w-full relative">
                            <button onClick={() => setActionModal({ show: false, type: '', orderId: null })} className="absolute top-8 right-8 p-2 opacity-20 hover:opacity-100 transition-opacity"><XCircle size={18} /></button>
                            <h2 className="text-[13px] uppercase tracking-[0.4em] font-bold mb-6">{actionModal.type} Request</h2>
                            <textarea
                                className="w-full border-b border-black/10 py-4 text-[11px] uppercase tracking-widest outline-none focus:border-black min-h-[140px] resize-none mb-10 bg-transparent"
                                placeholder={`SPECIFY REASON FOR ${actionModal.type.toUpperCase()}...`}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                            <button onClick={handleActionSubmit} disabled={!reason.trim()} className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 transition-all disabled:opacity-10">
                                Transmit Request
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;