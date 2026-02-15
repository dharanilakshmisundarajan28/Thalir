import { Users, Server, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                        <Users className="text-blue-500 h-5 w-5" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">12,450</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">System Status</h3>
                        <Server className="text-green-500 h-5 w-5" />
                    </div>
                    <p className="text-lg font-bold text-green-600">Operational</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Pending Issues</h3>
                        <AlertTriangle className="text-yellow-500 h-5 w-5" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">5</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
