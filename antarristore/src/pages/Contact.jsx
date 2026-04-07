import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Message Sent:", formData);
        alert("Thank you. Our customer support team will contact you shortly.");
    };

    return (
        <div className="bg-[#f1f3f6] min-h-screen pt-16 sm:pt-24 pb-20 font-sans text-slate-900">
            
            {/* Header */}
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="bg-white rounded-xl border border-black/5 p-5 sm:p-8 text-center shadow-sm">
                    <div className="w-10 h-10 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mb-1 sm:mb-2">Help Center & Support</h1>
                    <p className="text-slate-500 font-medium">We're here to assist you with any questions or concerns.</p>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Details Grid */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        
                        <div className="bg-white rounded-xl shadow-sm border border-black/5 p-6 md:p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Contact Information</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Email Support</p>
                                        <p className="text-sm font-medium text-slate-500 mt-0.5">help@antaristore.com</p>
                                        <p className="text-xs text-slate-400 mt-1">Typical response within 24 hours</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Phone Support</p>
                                        <p className="text-sm font-medium text-slate-500 mt-0.5">+91 1800 123 4567</p>
                                        <p className="text-xs text-slate-400 mt-1">Mon-Sat, 9:00 AM to 6:00 PM</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Headquarters</p>
                                        <p className="text-sm font-medium text-slate-500 mt-0.5 leading-relaxed">
                                            Suite 402, Business Park,<br />
                                            Bandra West, Mumbai,<br />
                                            Maharashtra 400050
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Form */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-sm border border-black/5 p-4 sm:p-6 md:p-10">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Send Us a Message</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Your Message</label>
                                    <textarea
                                        rows="5"
                                        required
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none"
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-8 py-3.5 bg-[#facc15] hover:bg-[#eab308] text-slate-900 rounded-xl font-bold text-base shadow-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    Submit Request
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;