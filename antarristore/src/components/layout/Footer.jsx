import React from 'react';
import { Mail, Facebook, Twitter, Instagram, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { title: "Get to Know Us", links: ["About Us", "Careers", "Press Releases", "Antari Science"] },
        { title: "Connect with Us", links: ["Facebook", "Twitter", "Instagram", "LinkedIn"] },
        { title: "Make Money with Us", links: ["Sell on Antari", "Protect and Build Your Brand", "Become an Affiliate", "Advertise Your Products"] },
        { title: "Let Us Help You", links: ["Your Account", "Returns Centre", "100% Purchase Protection", "Help"] }
    ];

    return (
        <footer className="bg-[#232F3E] font-sans text-white mt-auto">
            
            {/* Value Proposition Strip */}
            <div className="bg-[#37475A] border-b border-slate-700">
                <div className="max-w-[1500px] mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center text-center divide-y md:divide-y-0 md:divide-x divide-slate-600">
                        <div className="flex flex-col items-center px-4">
                            <Truck className="w-8 h-8 text-yellow-400 mb-3" />
                            <h4 className="font-bold mb-1">Fast & Reliable Delivery</h4>
                            <p className="text-xs text-slate-300">Free delivery on eligible orders</p>
                        </div>
                        <div className="flex flex-col items-center px-4 pt-6 md:pt-0">
                            <ShieldCheck className="w-8 h-8 text-yellow-400 mb-3" />
                            <h4 className="font-bold mb-1">100% Secure Payments</h4>
                            <p className="text-xs text-slate-300">All major payment methods accepted</p>
                        </div>
                        <div className="flex flex-col items-center px-4 pt-6 md:pt-0">
                            <CreditCard className="w-8 h-8 text-yellow-400 mb-3" />
                            <h4 className="font-bold mb-1">Easy Returns Policy</h4>
                            <p className="text-xs text-slate-300">Hassle-free replacement guarantee</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top */}
            <a href="#" className="block bg-[#485769] hover:bg-[#5b6e85] text-center py-4 text-sm font-medium transition-colors">
                Back to top
            </a>

            {/* Main Links Area */}
            <div className="max-w-[1000px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-bold mb-4 text-base">{section.title}</h3>
                            <ul className="space-y-2.5">
                                {section.links.map(link => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-slate-300 hover:text-white hover:underline transition-all">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider Logo Area */}
            <div className="border-t border-slate-700 py-8 text-center flex flex-col items-center">
                <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2 mb-4">
                    ANTARI<span className="text-yellow-400 shadow-sm">STORE</span>
                </Link>
                <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-300">
                    <span className="border border-slate-500 px-3 py-1.5 rounded flex items-center gap-2 hover:bg-slate-700 cursor-pointer transition">
                        <Mail className="w-3 h-3" /> Subscribe
                    </span>
                    <span className="border border-slate-500 px-3 py-1.5 rounded flex items-center gap-2 hover:bg-slate-700 cursor-pointer transition">
                        English
                    </span>
                    <span className="border border-slate-500 px-3 py-1.5 rounded flex items-center gap-2 hover:bg-slate-700 cursor-pointer transition">
                        ₹ INR - Indian Rupee
                    </span>
                    <span className="border border-slate-500 px-3 py-1.5 rounded flex items-center gap-2 hover:bg-slate-700 cursor-pointer transition">
                        India
                    </span>
                </div>
            </div>

            {/* Final Legal Bar */}
            <div className="bg-[#131A22] py-8 px-4 text-center">
                <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-300 mb-2">
                    <a href="#" className="hover:underline">Conditions of Use & Sale</a>
                    <a href="#" className="hover:underline">Privacy Notice</a>
                    <a href="#" className="hover:underline">Interest-Based Ads</a>
                </div>
                <p className="text-xs text-slate-400">
                    © 2016-{currentYear}, AntariStore.com, Inc. or its affiliates
                </p>
            </div>
        </footer>
    );
};

export default Footer;