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
    CheckCircle2,
    MapPin,
    AlertCircle,
    RefreshCw,
    Search
} from 'lucide-react';
import axios from 'axios';

const Orders = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionModal, setActionModal] = useState({ show: false, type: '', orderId: null });
    const [reason, setReason] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

    const canReturn = (date) => {
        if (!date) return false;
        const orderDate = new Date(date);
        const today = new Date();
        const diffDays = Math.ceil(Math.abs(today - orderDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 4;
    };

    const filteredOrders = useMemo(() => {
        let list = myOrders;

        if (activeFilter !== 'All') {
            list = list.filter(o => o.status?.toLowerCase() === activeFilter.toLowerCase());
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            list = list.filter(o => 
                (o.orderId && o.orderId.toLowerCase().includes(query)) ||
                o.orderItems?.some(item => item.name?.toLowerCase().includes(query))
            );
        }

        return list;
    }, [activeFilter, searchQuery, myOrders]);

    const handleActionSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const isCancel = actionModal.type === 'Cancel';
            const orderToUpdate = myOrders.find(o => o._id === actionModal.orderId);
            const identifier = orderToUpdate?.orderId || actionModal.orderId;

            if (!identifier) {
                alert("Reference identifier not found.");
                return;
            }

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
                
                const updatedOrders = myOrders.map(order =>
                    order._id === actionModal.orderId ? { ...order, status: newStatus } : order
                );
                setMyOrders(updatedOrders);

                if (selectedOrder?._id === actionModal.orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }

                setActionModal({ show: false, type: '', orderId: null });
                setReason('');
            }
        } catch (error) {
            console.error("Action Error:", error);
            alert(error.response?.data?.message || "Communication with server failed.");
        }
    };

    const getStatusInfo = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'delivered': 
                return { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2, label: 'Delivered' };
            case 'pending':
            case 'processing': 
                return { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock, label: 'In Progress' };
            case 'shipped': 
                return { color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Truck, label: 'Shipped' };
            case 'cancelled': 
                return { color: 'text-rose-700 bg-rose-50 border-rose-200', icon: XCircle, label: 'Cancelled' };
            case 'returned': 
                return { color: 'text-slate-700 bg-slate-100 border-slate-300', icon: RefreshCw, label: 'Returned' };
            default: 
                return { color: 'text-slate-700 bg-slate-50 border-slate-200', icon: HelpCircle, label: status || 'Unknown' };
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    const OrderDetailView = ({ order }) => {
        const statusInfo = getStatusInfo(order.status);
        const StatusIcon = statusInfo.icon;

        return (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                
                {/* Clean Navigation Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-textSecondary font-medium mb-2">
                            <span onClick={() => setSelectedOrder(null)} className="hover:text-accent cursor-pointer">Your Orders</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-textPrimary font-semibold">Order Details</span>
                        </div>
                        <h1 className="text-2xl font-bold text-textPrimary">
                            Order Details
                        </h1>
                        <p className="text-textSecondary mt-1 text-sm font-medium">Order ID: <span className="text-textPrimary font-bold">{order.orderId || order._id.slice(-8).toUpperCase()}</span></p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-textPrimary hover:bg-slate-50 transition-colors shadow-sm">
                            <Download size={16} /> Download Invoice
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Items */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Status Card (Amazon Style Alert) */}
                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.color.replace('text-', 'bg-').replace(/[0-9]+/, '100')} bg-opacity-50`}>
                                    <StatusIcon className={`w-5 h-5 ${statusInfo.color.split(' ')[0]}`} />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-bold ${statusInfo.color.split(' ')[0]}`}>{statusInfo.label}</h3>
                                    <p className="text-xs font-medium text-textSecondary mt-0.5">
                                        Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="hidden sm:block text-right">
                                <button
                                    onClick={() => {}} // Could link to tracking
                                    className="text-sm font-bold text-accent hover:underline"
                                >
                                    View Tracking History
                                </button>
                            </div>
                        </div>

                        {/* Items Card */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-textPrimary text-sm uppercase tracking-wide">
                                    Items ordered
                                </h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {(order.orderItems || []).map((item, idx) => (
                                    <div key={idx} className="p-5 flex gap-5 items-center hover:bg-slate-50 transition-colors">
                                        <div className="w-16 h-16 bg-white rounded-lg border border-slate-100 p-1 shrink-0 flex items-center justify-center">
                                            <img src={item.image || "https://via.placeholder.com/400"} className="max-w-full max-h-full object-contain" alt={item.name} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-textPrimary line-clamp-2 hover:text-accent cursor-pointer">{item.name}</h4>
                                            <p className="text-xs font-medium text-textSecondary mt-1">Quantity: <span className="font-bold text-textPrimary">{item.qty}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-textPrimary">{formatCurrency(item.price)}</p>
                                            <button className="mt-2 px-3 py-1 bg-[#facc15] hover:bg-[#eab308] text-zinc-900 rounded-md text-xs font-bold transition-all shadow-sm">
                                                Buy it again
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {(order.status === 'Pending' || order.status === 'Processing') && (
                                <button 
                                    onClick={() => setActionModal({ show: true, type: 'Cancel', orderId: order._id })} 
                                    className="flex-1 py-3 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-lg text-sm font-bold text-textPrimary transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <XCircle size={16} /> Cancel Order
                                </button>
                            )}
                            {order.status === 'Delivered' && canReturn(order.createdAt) && (
                                <button 
                                    onClick={() => setActionModal({ show: true, type: 'Return', orderId: order._id })} 
                                    className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-bold text-textPrimary transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <RefreshCw size={16} /> Return or Replace Items
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Summaries */}
                    <div className="space-y-6">
                        
                        {/* Structure matches Amazon's tight right sidebar */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <h3 className="font-bold text-textPrimary text-sm uppercase tracking-wide border-b border-slate-100 pb-3">Order Summary</h3>
                            
                            <div className="flex justify-between text-sm">
                                <span className="text-textSecondary font-medium">Item(s) Subtotal:</span>
                                <span className="font-medium text-textPrimary">{formatCurrency(order.itemsPrice)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-textSecondary font-medium">Shipping & Handling:</span>
                                <span className="font-medium text-textPrimary">{order.shippingPrice > 0 ? formatCurrency(order.shippingPrice) : 'Free'}</span>
                            </div>
                            
                            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-textPrimary text-base">Grand Total:</span>
                                <span className="text-lg font-extrabold text-red-700">{formatCurrency(order.totalPrice)}</span>
                            </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-textPrimary text-sm uppercase tracking-wide">
                                    Shipping Information
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <p className="font-bold text-textPrimary text-sm mb-1">{order.user?.name || "Customer"}</p>
                                    <p className="text-sm font-medium text-textSecondary leading-relaxed">
                                        {order.shippingAddress?.address}<br/>
                                        {order.shippingAddress?.city}, {order.shippingAddress?.pincode}<br/>
                                        {order.shippingAddress?.country || "India"}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-textSecondary uppercase mb-1">Contact Email</h4>
                                    <p className="text-sm font-medium text-textPrimary">{order.email || "No email provided"}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-accent animate-spin" />
                <p className="text-textSecondary font-medium animate-pulse">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] pt-24 pb-20 font-sans text-textPrimary">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    {!selectedOrder ? (
                        <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                            
                            <div className="flex items-center gap-2 text-xs text-textSecondary font-medium mb-4">
                                <span className="hover:text-accent cursor-pointer">Home</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="hover:text-accent cursor-pointer">Your Account</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-textPrimary font-semibold">Your Orders</span>
                            </div>

                            <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-black/5 pb-4">
                                <h1 className="text-3xl font-bold text-textPrimary">Your Orders</h1>
                                
                                {/* Professional Search within Orders */}
                                <div className="relative w-full md:w-80">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-shadow shadow-sm font-medium"
                                        placeholder="Search all orders"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="absolute inset-y-0 right-0 px-4 bg-slate-800 text-white font-bold text-xs rounded-r-lg hover:bg-slate-700 transition-colors">
                                        Search Orders
                                    </button>
                                </div>
                            </header>

                            {/* Clean Text-based Filters (Amazon Style) */}
                            <div className="flex gap-6 mb-6 overflow-x-auto no-scrollbar border-b border-slate-200">
                                {filters.map(f => {
                                    const isActive = activeFilter === f;
                                    return (
                                        <button
                                            key={f}
                                            onClick={() => setActiveFilter(f)}
                                            className={`pb-2 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                                                isActive 
                                                ? 'border-accent text-textPrimary' 
                                                : 'border-transparent text-accent hover:text-accentHover hover:border-slate-300 font-medium'
                                            }`}
                                        >
                                            {f === 'All' ? 'Orders' : f}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-bold text-textPrimary">
                                    {filteredOrders.length} orders <span className="font-medium text-textSecondary">placed in</span> {activeFilter}
                                </p>
                            </div>

                            {/* Orders List */}
                            <div className="space-y-4">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => {
                                        const statusInfo = getStatusInfo(order.status);
                                        const StatusIcon = statusInfo.icon;

                                        return (
                                            <motion.div 
                                                layout
                                                key={order._id} 
                                                className="bg-white border rounded-xl border-slate-200 shadow-sm overflow-hidden"
                                            >
                                                {/* Amazon Style Order Header Block */}
                                                <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap gap-x-8 gap-y-4 text-sm text-textSecondary">
                                                    <div>
                                                        <p className="font-medium uppercase text-xs mb-0.5">Order Placed</p>
                                                        <p className="font-bold text-textPrimary">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium uppercase text-xs mb-0.5">Total</p>
                                                        <p className="font-bold text-textPrimary">{formatCurrency(order.totalPrice)}</p>
                                                    </div>
                                                    <div className="flex-1 text-right">
                                                        <p className="font-medium uppercase text-xs mb-0.5">Order # {order.orderId || order._id.slice(-8).toUpperCase()}</p>
                                                        <button 
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="font-bold text-accent hover:text-accentHover hover:underline"
                                                        >
                                                            View order details
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Content Part */}
                                                <div className="p-5">
                                                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${statusInfo.color.split(' ')[0]}`}>
                                                        {statusInfo.label}
                                                    </h3>
                                                    
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        {/* Thumbnail */}
                                                        <div className="w-24 h-24 shrink-0 border border-slate-100 rounded bg-white p-1">
                                                            <img 
                                                                src={order.orderItems?.[0]?.image || "https://via.placeholder.com/400"} 
                                                                className="w-full h-full object-contain" 
                                                                alt={order.orderItems?.[0]?.name} 
                                                            />
                                                        </div>

                                                        {/* Product Strings */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-accent hover:text-orange-700 hover:underline cursor-pointer line-clamp-2 mb-1">
                                                                {order.orderItems?.[0]?.name}
                                                            </h4>
                                                            {order.orderItems?.length > 1 && (
                                                                <p className="text-sm font-medium text-textSecondary">
                                                                    and {order.orderItems.length - 1} more items...
                                                                </p>
                                                            )}
                                                            
                                                            <div className="flex flex-wrap gap-3 mt-4">
                                                                <button 
                                                                    className="px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-zinc-900 rounded-lg text-sm font-bold transition-all shadow-sm"
                                                                >
                                                                    Buy it again
                                                                </button>
                                                                <button 
                                                                    onClick={() => setSelectedOrder(order)}
                                                                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-textPrimary rounded-lg text-sm font-bold transition-all shadow-sm"
                                                                >
                                                                    Track package
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                                        className="py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm"
                                    >
                                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package className="w-8 h-8 text-textSecondary" />
                                        </div>
                                        <h3 className="text-lg font-bold text-textPrimary mb-1">Looks like you don't have any orders here</h3>
                                        <p className="text-textSecondary text-sm font-medium">
                                            {activeFilter === 'All' ? "Checkout our latest products and place your first order." : `There are no ${activeFilter.toLowerCase()} orders.`}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <OrderDetailView key="detail" order={selectedOrder} />
                    )}
                </AnimatePresence>
            </div>

            {/* Action Modal */}
            <AnimatePresence>
                {actionModal.show && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${actionModal.type === 'Cancel' ? 'bg-red-500' : 'bg-slate-800'}`} />
                            
                            <div className="flex justify-between items-center mb-6 mt-2">
                                <div className={`flex items-center gap-3 ${actionModal.type === 'Cancel' ? 'text-red-500' : 'text-slate-800'}`}>
                                    <div className={`${actionModal.type === 'Cancel' ? 'bg-red-50' : 'bg-slate-100'} p-2 rounded-lg border ${actionModal.type === 'Cancel' ? 'border-red-100' : 'border-slate-200'}`}>
                                        {actionModal.type === 'Cancel' ? <AlertCircle className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
                                    </div>
                                    <h2 className="text-xl font-bold text-textPrimary">{actionModal.type} Order</h2>
                                </div>
                                <button onClick={() => setActionModal({ show: false, type: '', orderId: null })} className="text-textSecondary hover:text-textPrimary hover:bg-slate-100 p-2 rounded-lg transition-colors">
                                    <XCircle size={20} />
                                </button>
                            </div>
                            
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-textPrimary placeholder:text-textSecondary/70 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 outline-none transition-all resize-none h-32 mb-6"
                                placeholder={`Please provide a reason to ${actionModal.type.toLowerCase()}...`}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setActionModal({ show: false, type: '', orderId: null })} 
                                    className="flex-1 px-4 py-3 rounded-lg font-bold text-textSecondary hover:text-textPrimary bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    Dismiss
                                </button>
                                <button 
                                    onClick={handleActionSubmit} 
                                    disabled={!reason.trim()} 
                                    className={`flex-1 px-4 py-3 rounded-lg font-bold text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                                        actionModal.type === 'Cancel' ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-800 hover:bg-slate-900'
                                    }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;