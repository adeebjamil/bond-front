import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast.info('You have been logged out successfully');
    navigate('/login');
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">Bondmetal Dashboard</h1>
            <div className="flex items-center">
              <div className="mr-4 hidden items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 md:flex">
                <FaUser className="mr-2" />
                <span>Admin</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </motion.button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}