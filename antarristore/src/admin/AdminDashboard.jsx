import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Users, Package, IndianRupee, ArrowUpRight, ArrowDownRight, Loader2, Truck, CheckCircle } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch All Orders (Admin Route)
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const { data } = await axios.get('https://antarri-backend.onrender.com/api/orders', config);
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch dashboard data");
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Calculate Dynamic Stats
    const statsData = useMemo(() => {
        // 1. Total Revenue (Sum of all non-cancelled orders)
        const totalRevenue = orders
            .filter(order => order.status !== 'Cancelled')
            .reduce((acc, item) => acc + (item.totalPrice || 0), 0);

        // 2. Orders in Transit (Specifically 'Shipped')
        const inTransit = orders.filter(order => order.status === 'Shipped').length;

        // 3. Completed Orders (Status is 'Delivered')
        const completedOrders = orders.filter(order => order.status === 'Delivered').length;

        // 4. Customer Count
        const uniqueCustomers = new Set(orders.map(order => order.user?._id)).size;

        return [
            {
                label: 'Total Revenue',
                value: `₹${totalRevenue.toLocaleString()}`,
                icon: <IndianRupee size={20} />,
                trend: '+8.2%',
                isUp: true
            },
            {
                label: 'Orders in Transit',
                value: inTransit.toString(),
                icon: <Truck size={20} />,
                trend: 'Dispatched',
                isUp: true
            },
            {
                label: 'Completed Orders',
                value: completedOrders.toString(),
                icon: <CheckCircle size={20} />,
                trend: 'Successfully Delivered',
                isUp: true
            },
            {
                label: 'Unique Customers',
                value: uniqueCustomers.toString(),
                icon: <Users size={20} />,
                trend: 'Active Now',
                isUp: true
            },
        ];
    }, [orders]);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-50 font-bold">Synchronizing Archives...</p>
        </div>
    );

    if (error) return <div className="p-10 text-rose-500 font-bold text-center border border-rose-100 bg-rose-50 rounded-2xl">{error}</div>;

    return (
        <div className="animate-in fade-in duration-700">
            <header className="mb-10">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold font-sans">Executive Summary</span>
                <h1 className="text-4xl font-serif mt-2 text-textPrimary uppercase tracking-tight">Store <span className="italic opacity-50">Overview</span></h1>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statsData.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 rounded-xl text-accent">
                                {stat.icon}
                            </div>
                            <span className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full ${stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-textPrimary mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Recent Sales Activity */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-black/5 flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-textPrimary">Recent Sales Activity</h3>
                    <button className="text-[10px] font-bold text-accent uppercase border-b border-accent pb-0.5">View All Archives</button>
                </div>
                <div className="divide-y divide-black/5">
                    {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold uppercase">
                                    {order.user?.name ? order.user.name.substring(0, 2) : '??'}
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide">
                                        Order #{order.orderId || order._id.slice(-6).toUpperCase()}
                                    </p>
                                    <p className="text-[10px] text-slate-400 uppercase">
                                        {new Date(order.createdAt).toLocaleDateString()} • {order.paymentMethod || 'Prepaid'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold">₹{order.totalPrice?.toLocaleString()}</p>
                                <p className={`text-[9px] font-bold uppercase tracking-tighter ${order.status === 'Cancelled' ? 'text-rose-500' :
                                    order.status === 'Delivered' ? 'text-emerald-500' : 'text-orange-500'
                                    }`}>
                                    {order.status}
                                </p>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <div className="p-10 text-center text-[10px] uppercase tracking-widest opacity-30 font-bold">
                            No transaction records found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;