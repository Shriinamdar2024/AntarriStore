import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, CreditCard, Settings, LogOut, Save, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileField = ({ label, value, field, type = "text", isEditing, onInputChange }) => (
    <div className="group space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold block transition-colors group-focus-within:text-black">
            {label}
        </label>
        {isEditing ? (
            <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type={type}
                value={value || ''}
                onChange={(e) => onInputChange(field, e.target.value)}
                className="w-full bg-slate-50 border-b border-slate-200 py-3 px-4 text-sm focus:border-black outline-none transition-all font-medium text-slate-900 rounded-none"
            />
        ) : (
            <p className="text-sm font-serif text-slate-800 py-3 px-1 border-b border-transparent">
                {value || <span className="italic text-slate-300">Not specified</span>}
            </p>
        )}
    </div>
);

const Profile = () => {
    const { user, updateUser, logout } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        cardName: '',
        cardNumber: '',
        expiry: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('Personal Info');
    const [showSuccess, setShowSuccess] = useState(false);

    // Sync local form state when the global user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                // Ensuring we check both fullName and name for maximum compatibility
                fullName: user.fullName || user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                pincode: user.pincode || '',
                cardName: user.cardName || '',
                cardNumber: user.cardNumber || '',
                expiry: user.expiry || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            // This sends the full formData to the backend /api/users/profile
            await updateUser(formData);
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        } catch (error) {
            console.error("Archive sync failed:", error);
        }
    };

    const handleSignOut = () => {
        logout();
        window.location.href = '/';
    };

    const updateFormData = (field, newValue) => {
        setFormData(prev => ({ ...prev, [field]: newValue }));
    };

    if (!user && !isEditing) {
        return <div className="min-h-screen flex items-center justify-center font-serif italic text-slate-400">Loading Archive...</div>;
    }

    return (
        <div className="min-h-screen bg-[#FDFDFB] pt-32 pb-20 px-6 sm:px-12 md:px-20 relative overflow-x-hidden">
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: 50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="fixed bottom-8 right-8 z-[100] w-80"
                    >
                        <div className="relative overflow-hidden bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-none shadow-2xl p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative bg-emerald-500/20 p-2 rounded-none">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-white">Archive Updated</h4>
                                        <p className="text-[11px] text-slate-400 mt-1 font-serif italic">Persistent changes saved.</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowSuccess(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 h-[3px] bg-slate-800 w-full">
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 4, ease: "linear" }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="h-[1px] w-8 bg-black" />
                            <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold">Persistence Layer</span>
                        </div>
                        <h1 className="text-6xl font-serif text-slate-900 leading-tight">
                            Personal <span className="italic font-light text-slate-400 text-5xl">Archive</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`group relative px-10 py-5 transition-all duration-500 border rounded-none ${isEditing ? 'bg-black text-white border-black' : 'bg-transparent text-black border-slate-200 hover:border-black'
                            }`}
                    >
                        <div className="relative z-10 flex items-center space-x-3">
                            {isEditing ? <Save className="w-4 h-4" /> : <Settings className="w-4 h-4 transition-transform group-hover:rotate-90" />}
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                                {isEditing ? 'Sync to Storage' : 'Modify Profile'}
                            </span>
                        </div>
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <nav className="lg:col-span-4 space-y-2">
                        {[
                            { icon: <User className="w-4 h-4" />, label: 'Personal Info' },
                            { icon: <MapPin className="w-4 h-4" />, label: 'Shipping Address' },
                            { icon: <CreditCard className="w-4 h-4" />, label: 'Billing Details' },
                            { icon: <LogOut className="w-4 h-4" />, label: 'Sign Out', action: handleSignOut },
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={() => item.action ? item.action() : setActiveTab(item.label)}
                                className={`w-full flex items-center justify-between p-6 transition-all duration-300 rounded-none ${activeTab === item.label && !item.action
                                    ? 'bg-white shadow-sm border-l-2 border-black'
                                    : 'hover:bg-slate-50 grayscale hover:grayscale-0'
                                    }`}
                            >
                                <div className="flex items-center space-x-5">
                                    <span className={activeTab === item.label ? 'text-black' : 'text-slate-400 group-hover:text-black'}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-[11px] uppercase tracking-[0.2em] font-bold ${activeTab === item.label ? 'text-black' : 'text-slate-400 group-hover:text-black'
                                        }`}>
                                        {item.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </nav>

                    <main className="lg:col-span-8">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-10 md:p-16 border border-slate-100 shadow-sm rounded-none"
                        >
                            {activeTab === 'Personal Info' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <ProfileField label="Full Legal Name" value={formData.fullName} field="fullName" isEditing={isEditing} onInputChange={updateFormData} />
                                    <ProfileField label="Contact Email" value={formData.email} field="email" type="email" isEditing={isEditing} onInputChange={updateFormData} />
                                    <ProfileField label="Mobile Number" value={formData.phone} field="phone" isEditing={isEditing} onInputChange={updateFormData} />
                                    <ProfileField label="Primary City" value={formData.city} field="city" isEditing={isEditing} onInputChange={updateFormData} />
                                </div>
                            )}

                            {activeTab === 'Shipping Address' && (
                                <div className="space-y-12">
                                    <ProfileField label="Street Address" value={formData.address} field="address" isEditing={isEditing} onInputChange={updateFormData} />
                                    <div className="grid grid-cols-2 gap-12">
                                        <ProfileField label="City" value={formData.city} field="city" isEditing={isEditing} onInputChange={updateFormData} />
                                        <ProfileField label="Pincode" value={formData.pincode} field="pincode" isEditing={isEditing} onInputChange={updateFormData} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Billing Details' && (
                                <div className="space-y-12">
                                    <ProfileField label="Name on Card" value={formData.cardName} field="cardName" isEditing={isEditing} onInputChange={updateFormData} />
                                    <ProfileField label="Card Number" value={formData.cardNumber} field="cardNumber" isEditing={isEditing} onInputChange={updateFormData} />
                                    <div className="grid grid-cols-2 gap-12">
                                        <ProfileField label="Expiry Date" value={formData.expiry} field="expiry" isEditing={isEditing} onInputChange={updateFormData} />
                                        <div className="space-y-2 opacity-50">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold block">Security Code</label>
                                            <p className="text-sm py-3 text-slate-900 font-medium font-serif">***</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;