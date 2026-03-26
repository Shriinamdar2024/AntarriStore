import React, { useState, useMemo, useEffect } from 'react';
import {
    Eye, Truck, CheckCircle, XCircle, Search, Download, Package
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AdminInvoice from './AdminInvoice';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // Helper to consistently get token
    const getAuthToken = () => {
        const storedData = localStorage.getItem('userInfo');
        const userData = storedData ? JSON.parse(storedData) : null;
        return userData?.token || localStorage.getItem('token');
    };

    // 1. Fetch all orders from backend on mount
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();

            if (!token) {
                console.error("Access Denied: No Token Found");
                return;
            }

            const { data } = await axios.get('http://localhost:5000/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOrders(data);
        } catch (error) {
            console.error("Fetch Error Status:", error.response?.status);

            if (error.response?.status === 401) {
                alert("Session Expired or Unauthorized. Please log in as Admin.");
            } else if (error.response?.status === 403) {
                alert("Access Denied: You do not have Administrative privileges.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 2. Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                (order.orderId || order._id).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderItems?.[0]?.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesDate = filterDate ? order.createdAt.startsWith(filterDate) : true;
            return matchesSearch && matchesDate;
        });
    }, [orders, searchTerm, filterDate]);

    // 3. Dynamic Update Function
    const updateStatus = async (id, newStatus) => {
        try {
            const token = getAuthToken();

            if (!token) {
                alert("Auth token missing. Please log in again.");
                return;
            }

            await axios.put(
                `http://localhost:5000/api/orders/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state instantly
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));

        } catch (error) {
            console.error("Failed to update status:", error.response || error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("Unauthorized: Your admin session may have expired or you lack permissions.");
            } else {
                alert("Logistics synchronization failed.");
            }
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        XLSX.writeFile(workbook, `Antaristore_Report_${new Date().toLocaleDateString()}.xlsx`);
    };

    if (loading) return <div className="p-20 text-center font-serif opacity-50 uppercase tracking-[0.5em]">Syncing Archives...</div>;

    if (selectedOrder) {
        return <AdminInvoice order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.5em] text-slate-400 font-bold block mb-2">Management Console</span>
                    <h1 className="text-5xl font-serif tracking-tight">Order Archives</h1>
                </div>
                <button onClick={exportToExcel} className="flex items-center gap-2 bg-black text-white px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-800 transition-all">
                    <Download size={14} /> Export Manifest
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-black/5 p-4 mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="REF ID, CUSTOMER, OR ITEM..."
                        className="w-full bg-stone-50 py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <input
                    type="month"
                    className="bg-stone-50 py-4 px-4 text-[10px] uppercase tracking-widest outline-none"
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-black/5 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-stone-50 border-b border-black/5 text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                        <tr>
                            <th className="p-6">Reference</th>
                            <th className="p-6">Customer</th>
                            <th className="p-6">Product</th>
                            <th className="p-6">Total</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="group hover:bg-stone-50/50 transition-colors">
                                <td className="p-6">
                                    <p className="font-bold text-sm tracking-tighter">{order.orderId || order._id.slice(-6).toUpperCase()}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="p-6">
                                    <p className="text-[11px] font-bold uppercase">{order.user?.name || "Guest"}</p>
                                    <p className="text-[10px] text-slate-400 lowercase">{order.user?.email}</p>
                                </td>
                                <td className="p-6">
                                    <p className="text-[11px] font-medium uppercase truncate max-w-[150px]">{order.orderItems?.[0]?.name}</p>
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Qty: {order.orderItems?.[0]?.qty}</p>
                                </td>
                                <td className="p-6 text-[10px] font-bold">₹{order.totalPrice?.toLocaleString()}</td>
                                <td className="p-6">
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border ${order.status === 'Delivered' ? 'border-green-200 text-green-600 bg-green-50' :
                                            order.status === 'Shipped' ? 'border-blue-200 text-blue-600 bg-blue-50' :
                                                order.status === 'Out for Delivery' ? 'border-purple-200 text-purple-600 bg-purple-50' :
                                                    'border-orange-200 text-orange-600 bg-orange-50'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setSelectedOrder(order)} title="View Detail" className="p-2 hover:bg-black hover:text-white transition-all"><Eye size={14} /></button>
                                        <button onClick={() => updateStatus(order._id, 'Shipped')} title="Ship" className="p-2 hover:bg-blue-500 hover:text-white transition-all"><Truck size={14} /></button>
                                        <button onClick={() => updateStatus(order._id, 'Out for Delivery')} title="Out for Delivery" className="p-2 hover:bg-purple-500 hover:text-white transition-all"><Package size={14} /></button>
                                        <button onClick={() => updateStatus(order._id, 'Delivered')} title="Deliver" className="p-2 hover:bg-green-500 hover:text-white transition-all"><CheckCircle size={14} /></button>
                                        <button onClick={() => updateStatus(order._id, 'Cancelled')} title="Cancel" className="p-2 hover:bg-red-500 hover:text-white transition-all"><XCircle size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;