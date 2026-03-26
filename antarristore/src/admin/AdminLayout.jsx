import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
// ADD ShoppingCart HERE ---------------------------vvvvvvvvvvvv
import { LayoutDashboard, PackagePlus, LogOut, ChevronRight, ShoppingCart, Package } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin-login');
    };

    const menuItems = [
        { path: '/admin/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
        { path: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
        { path: '/admin/inventory', label: 'Inventory', icon: <Package size={18} /> },
        { path: '/admin/upload', label: 'Add Product', icon: <PackagePlus size={18} /> },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-black/5 p-8 flex flex-col fixed h-full">
                <div className="mb-12">
                    <h2 className="text-xl font-serif italic font-bold tracking-tight text-textPrimary">Antarri<span className="text-accent">Admin</span></h2>
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-1 font-bold">Store Management v1.0</p>
                </div>

                <nav className="flex-grow space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-between p-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${location.pathname === item.path ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-slate-400 hover:bg-gray-50 hover:text-textPrimary'}`}
                        >
                            <div className="flex items-center gap-4">
                                {item.icon}
                                {item.label}
                            </div>
                            {location.pathname === item.path && <ChevronRight size={14} />}
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-4 p-4 text-red-400 hover:bg-red-50 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest mt-auto border-t border-black/5 pt-8">
                    <LogOut size={18} /> Logout Session
                </button>
            </aside>

            {/* Content Area */}
            <main className="flex-grow ml-72 p-12">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;