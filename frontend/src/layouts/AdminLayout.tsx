import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, Shield, Settings, Activity, LogOut, LayoutDashboard } from 'lucide-react';
import AuthService from '../services/auth.service';

const AdminLayout = () => {
    const location = useLocation();
    const user = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = '/login';
    };

    const navItems = [
        { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'System Health', path: '/admin/health', icon: <Activity size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-800">
                    <Shield className="h-8 w-8 text-green-500 mr-2" />
                    <span className="text-xl font-bold">THALIR Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-gray-800 text-green-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="mb-4 px-2">
                        <p className="text-sm font-medium text-white">{user?.username}</p>
                        <p className="text-xs text-gray-500">Super Admin</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-lg">
                        <LogOut size={16} className="mr-2" /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
