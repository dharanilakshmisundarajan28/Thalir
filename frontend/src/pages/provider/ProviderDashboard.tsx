import { TrendingUp, Package, AlertCircle } from 'lucide-react';

const ProviderDashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Provider Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
                        <TrendingUp className="text-green-500 h-5 w-5" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">₹45,230</p>
                    <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Active Inventory</h3>
                        <Package className="text-blue-500 h-5 w-5" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">124</p>
                    <p className="text-sm text-gray-500 mt-1">Products listed</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Low Stock Alerts</h3>
                        <AlertCircle className="text-orange-500 h-5 w-5" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">3</p>
                    <p className="text-sm text-orange-600 mt-1">Items need restock</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
                <div className="text-gray-500 text-center py-8">No recent orders found.</div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
