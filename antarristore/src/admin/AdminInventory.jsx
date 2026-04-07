import React, { useState, useEffect } from 'react';
import { Shirt, Smartphone, Search, Filter, Plus, ChevronRight, ArrowLeft, Trash2, Power, PowerOff } from 'lucide-react';
import API from '../utils/api';

const AdminInventory = () => {
    const [view, setView] = useState('hub');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [inventory, setInventory] = useState([]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            // Using the public endpoint as verified in your route structure
            const { data } = await API.get('/products/public');
            setInventory(data);
        } catch (err) {
            console.error("Failed to fetch inventory", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const toggleStatus = async (id) => {
        try {
            await API.patch(`/products/${id}/toggle`);
            setInventory(prev => prev.map(item =>
                item._id === id ? { ...item, isActive: !item.isActive } : item
            ));
        } catch (err) {
            alert("Status update failed");
        }
    };

    const removeItem = async (id) => {
        if (window.confirm("ARE YOU SURE YOU WANT TO REMOVE THIS PRODUCT?")) {
            try {
                await API.delete(`/products/${id}`);
                setInventory(prev => prev.filter(item => item._id !== id));
            } catch (err) {
                alert("Removal failed");
            }
        }
    };

    // SEPARATE LOADING LOGIC
    const currentData = inventory.filter(item => {
        const itemCategory = item.category?.toLowerCase() || '';

        const matchesCategory = view === 'clothing'
            ? itemCategory === 'clothing'
            : itemCategory === 'mobile accessories';

        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (view === 'hub') {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="mb-12">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Catalog Management</span>
                    <h1 className="text-4xl font-serif mt-2 uppercase tracking-tight">Select <span className="italic opacity-50">Department</span></h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button onClick={() => setView('clothing')} className="group bg-white p-10 border border-black/5 shadow-sm hover:shadow-2xl hover:border-black transition-all text-left relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                                <Shirt size={28} />
                            </div>
                            <h3 className="text-2xl font-serif uppercase tracking-tight">Clothing <span className="italic opacity-40">Line</span></h3>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Manage Apparel, Sizes & Fabrics</p>
                        </div>
                        <ChevronRight className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-200 group-hover:text-black group-hover:translate-x-2 transition-all" size={40} />
                    </button>

                    <button onClick={() => setView('mobile')} className="group bg-white p-10 border border-black/5 shadow-sm hover:shadow-2xl hover:border-black transition-all text-left relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                                <Smartphone size={28} />
                            </div>
                            <h3 className="text-2xl font-serif uppercase tracking-tight">Accessories <span className="italic opacity-40">Line</span></h3>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Manage Cases, Brands & Compatibility</p>
                        </div>
                        <ChevronRight className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-200 group-hover:text-black group-hover:translate-x-2 transition-all" size={40} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <button onClick={() => setView('hub')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black mb-8 transition-colors">
                <ArrowLeft size={14} /> Back to Departments
            </button>

            <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
                        {view === 'clothing' ? 'Apparel Division' : 'Tech Accessories'}
                    </span>
                    <h1 className="text-4xl font-serif mt-2 uppercase tracking-tight">
                        {view === 'clothing' ? 'Clothing' : 'Mobile'} <span className="italic opacity-50">Stock</span>
                    </h1>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`SEARCH ${view.toUpperCase()}...`}
                        className="pl-12 pr-6 py-4 bg-white border border-black/5 outline-none text-[10px] tracking-widest w-full md:w-80 focus:border-black transition-all"
                    />
                </div>
            </header>

            <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center text-[10px] tracking-[0.3em] uppercase opacity-50">Syncing with database...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-black/5">
                            <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                                <th className="p-6">Product Details</th>
                                <th className="p-6">{view === 'clothing' ? 'Details' : 'Brand/Model'}</th>
                                <th className="p-6">Pricing</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {currentData.map((item) => (
                                <tr key={item._id} className={`hover:bg-gray-50/50 transition-colors group ${!item.isActive ? 'opacity-50' : ''}`}>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            {item.images && item.images.length > 0 && (
                                                <img src={item.images[0]} alt="" className="w-10 h-12 object-cover grayscale group-hover:grayscale-0 border border-black/5 transition-all" />
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-textPrimary uppercase tracking-tight group-hover:text-accent transition-colors">{item.name}</p>
                                                <p className="text-[9px] text-slate-400 font-mono mt-1">{item._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-gray-100 text-[9px] font-bold uppercase tracking-tighter text-black">
                                                {view === 'clothing' ? (item.subCategory || 'Standard') : item.brand}
                                            </span>
                                            <span className="px-2 py-1 border border-gray-100 text-[9px] font-bold uppercase tracking-tighter text-slate-400">
                                                {view === 'clothing' ? (item.fit || 'Cotton') : item.model}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6 font-bold text-xs">₹{item.price}</td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <button
                                                onClick={() => toggleStatus(item._id)}
                                                className="p-2 hover:bg-black hover:text-white transition-all text-slate-400 flex items-center gap-2 group/btn"
                                            >
                                                {item.isActive ? <Power size={14} /> : <PowerOff size={14} className="text-red-400" />}
                                            </button>
                                            <button
                                                onClick={() => removeItem(item._id)}
                                                className="p-2 hover:bg-red-500 hover:text-white transition-all text-slate-400 flex items-center gap-2 group/btn"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && currentData.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">No products found in this department</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminInventory;