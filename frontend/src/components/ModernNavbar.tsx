import { Search, Bell, LogOut, User, Settings, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const ModernNavbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/');
        window.location.reload(); // Ensure clean state re-evaluation
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40 transition-all">
            {/* Search Section */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search users, vendors, orders..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-[14px] font-medium placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-5">
                {/* Notifications */}
                <button className="relative text-gray-500 hover:text-emerald-600 transition-all p-2.5 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Vertical Divider */}
                <div className="w-[1px] h-8 bg-gray-100 mx-1"></div>

                {/* Profile Avatar & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50 transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 overflow-hidden border border-indigo-400">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=6366F1&color=fff&bold=true`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="hidden md:block text-left mr-1">
                            <p className="text-[14px] font-bold text-gray-900 leading-none capitalize">{user?.username || 'Farmer'}</p>
                            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-tight mt-1">
                                {user?.roles?.[0]?.replace('ROLE_', '') || 'PRO USER'}
                            </p>
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/50 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-5 py-4 border-b border-gray-50 mb-2">
                                <p className="text-[15px] font-bold text-gray-900 capitalize">{user?.username}</p>
                                <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{user?.email || 'farmer@thalir.com'}</p>
                            </div>

                            <div className="px-2 space-y-0.5">
                                <button className="flex items-center gap-3.5 px-4 py-3 text-[14px] font-semibold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 w-full text-left rounded-xl transition-all group">
                                    <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                                        <User size={16} />
                                    </div>
                                    My Profile
                                </button>
                                <button className="flex items-center gap-3.5 px-4 py-3 text-[14px] font-semibold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 w-full text-left rounded-xl transition-all group">
                                    <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                                        <Shield size={16} />
                                    </div>
                                    Security
                                </button>
                                <button className="flex items-center gap-3.5 px-4 py-3 text-[14px] font-semibold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 w-full text-left rounded-xl transition-all group">
                                    <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                                        <Settings size={16} />
                                    </div>
                                    Account Settings
                                </button>
                            </div>

                            <div className="h-px bg-gray-50 my-2 mx-3"></div>

                            <div className="px-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3.5 px-4 py-3 text-[14px] font-bold text-rose-500 hover:bg-rose-50 w-full text-left rounded-xl transition-all"
                                >
                                    <div className="p-1.5 bg-rose-50 rounded-lg">
                                        <LogOut size={16} />
                                    </div>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ModernNavbar;
