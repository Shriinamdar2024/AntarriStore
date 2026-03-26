import React, { useState } from 'react';
import { Search, Filter, Mail, MapPin, Calendar, MoreVertical, UserCheck, UserMinus } from 'lucide-react';

const AdminUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const users = [
        { id: 'USR-001', name: 'Shrirup', email: 'shrirup@example.com', location: 'Pune, MH', joined: 'Jan 2026', orders: 12, status: 'Active' },
        { id: 'USR-002', name: 'Aditi Sharma', email: 'aditi.s@gmail.com', location: 'Mumbai, MH', joined: 'Feb 2026', orders: 5, status: 'Active' },
        { id: 'USR-003', name: 'Rahul V.', email: 'rahulv@outlook.com', location: 'Bangalore, KA', joined: 'Mar 2026', orders: 0, status: 'Inactive' },
    ];

    return (
        <div className="animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Community Management</span>
                    <h1 className="text-4xl font-serif mt-2 uppercase tracking-tight">User <span className="italic opacity-50">Directory</span></h1>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH USERS BY NAME OR EMAIL..."
                        className="pl-12 pr-6 py-4 bg-white border border-black/5 rounded-2xl outline-none text-[10px] tracking-widest w-full md:w-80 focus:border-black transition-all font-bold"
                    />
                </div>
            </header>

            <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-black/5">
                        <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                            <th className="p-6">User Profile</th>
                            <th className="p-6">Location</th>
                            <th className="p-6">Engagement</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-textPrimary uppercase tracking-tight">{user.name}</p>
                                            <p className="text-[9px] text-slate-400 font-mono flex items-center gap-1 mt-1"><Mail size={10} /> {user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-slate-600">
                                        <MapPin size={12} className="text-slate-300" /> {user.location}
                                    </p>
                                </td>
                                <td className="p-6">
                                    <p className="text-[10px] font-bold uppercase tracking-widest">{user.orders} Orders</p>
                                    <p className="text-[9px] text-slate-300 uppercase mt-1">Joined {user.joined}</p>
                                </td>
                                <td className="p-6">
                                    <span className={`text-[8px] font-bold uppercase px-3 py-1 rounded-full ${user.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="p-2 hover:bg-black hover:text-white rounded-lg transition-all">
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;