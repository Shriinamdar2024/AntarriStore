import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, CreditCard, Settings, LogOut, Save, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileField = ({ label, value, field, type = "text", isEditing, onInputChange }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700 block">
            {label}
        </label>
        {isEditing ? (
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onInputChange(field, e.target.value)}
                className="w-full bg-white border border-slate-300 py-2.5 px-4 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm"
            />
        ) : (
            <p className="text-sm font-medium text-slate-900 bg-slate-50 py-2.5 px-4 rounded-lg border border-slate-200">
                {value || <span className="text-slate-400 italic">Not provided</span>}
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

    useEffect(() => {
        if (user) {
            setFormData({
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
            await updateUser(formData);
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Profile update failed:", error);
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
        return (
            <div className="min-h-[60vh] bg-[#f1f3f6] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 relative">
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: 50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="fixed bottom-8 right-8 z-[100] w-80"
                    >
                        <div className="bg-emerald-600 rounded-xl shadow-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                                <div>
                                    <h4 className="text-sm font-bold text-white leading-tight">Profile Updated</h4>
                                    <p className="text-xs text-emerald-100 font-medium">Your changes have been saved.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowSuccess(false)} className="text-emerald-200 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-[1280px] mx-auto">
                {/* Header Container */}
                <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Your Account</h1>
                        <p className="text-sm font-medium text-slate-500">Manage your profile securely</p>
                    </div>

                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm w-full sm:w-auto ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                    >
                        {isEditing ? <Save className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Navigation Sidebar */}
                    <nav className="lg:col-span-3 space-y-2">
                        <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden p-2">
                            {[
                                { icon: <User className="w-5 h-5" />, label: 'Personal Info' },
                                { icon: <MapPin className="w-5 h-5" />, label: 'Shipping Address' },
                                { icon: <CreditCard className="w-5 h-5" />, label: 'Billing Details' },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => setActiveTab(item.label)}
                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors text-left ${activeTab === item.label ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 font-medium hover:bg-slate-50'}`}
                                >
                                    <span className={activeTab === item.label ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                            
                            <div className="h-px bg-slate-100 my-2 mx-4" />
                            
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors text-left text-slate-600 font-medium hover:bg-red-50 hover:text-red-600 group"
                            >
                                <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </nav>

                    {/* Content Box */}
                    <main className="lg:col-span-9">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl shadow-sm border border-black/5 p-6 md:p-8"
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">{activeTab}</h2>

                            {activeTab === 'Personal Info' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileField label="Full Name" value={formData.fullName} field="fullName" isEditing={isEditing} onInputChange={updateFormData} />
                                    <ProfileField label="Email Address" value={formData.email} field="email" type="email" isEditing={isEditing} onInputChange={updateFormData} />
                                    <ProfileField label="Mobile Number" value={formData.phone} field="phone" isEditing={isEditing} onInputChange={updateFormData} />
                                </div>
                            )}

                            {activeTab === 'Shipping Address' && (
                                <div className="space-y-6">
                                    <ProfileField label="Street Address" value={formData.address} field="address" isEditing={isEditing} onInputChange={updateFormData} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <ProfileField label="City" value={formData.city} field="city" isEditing={isEditing} onInputChange={updateFormData} />
                                        <ProfileField label="Pincode" value={formData.pincode} field="pincode" isEditing={isEditing} onInputChange={updateFormData} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Billing Details' && (
                                <div className="space-y-6">
                                    <ProfileField label="Name on Card" value={formData.cardName} field="cardName" isEditing={isEditing} onInputChange={updateFormData} />
                                    <ProfileField label="Card Number" value={formData.cardNumber} field="cardNumber" isEditing={isEditing} onInputChange={updateFormData} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <ProfileField label="Expiry Date" value={formData.expiry} field="expiry" isEditing={isEditing} onInputChange={updateFormData} />
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 block">CVV</label>
                                            <p className="text-sm font-medium text-slate-500 bg-slate-50 py-2.5 px-4 rounded-lg border border-slate-200 cursor-not-allowed">***</p>
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