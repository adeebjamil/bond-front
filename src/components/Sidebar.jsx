import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaEnvelope, FaNewspaper, FaChartLine, FaTimes, FaBars } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api'; // Add this import

export default function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    contactEnquiries: 0,
    newsletterEnquiries: 0
  });
  
  // Fetch notification counts from backend
  useEffect(() => {
    // Function to fetch notifications
    const fetchNotificationCounts = async () => {
      try {
        // Contact enquiry notifications (unread/new)
        const contactResponse = await axios.get(`${API_BASE_URL}/api/contacts`, {
          params: { status: 'New', limit: 1 } // Just get count, not actual data
        });
        
        // Set notification counts
        setNotifications(prev => ({
          ...prev,
          contactEnquiries: contactResponse.data.totalContacts || 0
        }));
        
      } catch (error) {
        console.error('Error fetching notification counts:', error);
      }
    };
    
    // Initial fetch
    fetchNotificationCounts();
    
    // Set up polling interval (every 30 seconds)
    const intervalId = setInterval(fetchNotificationCounts, 30000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Menu items with icons and notification badges
  const menuItems = [
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      icon: <FaHome /> 
    },
    { 
      path: '/dashboard/contact-enquiry', 
      name: 'Contact Enquiry', 
      icon: <FaEnvelope />,
      notificationCount: notifications.contactEnquiries
    },
    { 
      path: '/dashboard/newsletter-enquiry', 
      name: 'Newsletter Enquiry', 
      icon: <FaNewspaper />,
      notificationCount: notifications.newsletterEnquiries
    },
    { 
      path: '/dashboard/analytics', 
      name: 'Analytics Data', 
      icon: <FaChartLine /> 
    },
  ];
  
  // Helper to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Animation for notification badge
  const pulseAnimation = {
    scale: [1, 1.1, 1],
    transition: { 
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" 
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed left-4 top-4 z-50 block md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-full bg-blue-600 p-3 text-white shadow-lg focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden h-screen w-64 bg-gray-900 shadow-xl md:block">
        <div className="p-6 text-center">
          <img 
            src="/logo1.png" 
            alt="Bondmetal Logo" 
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-4 text-2xl font-bold text-white">Bondmetal</h2>
          <p className="mt-1 text-sm text-gray-400">Admin Dashboard</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`relative flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                  
                  {/* Notification badge */}
                  {item.notificationCount > 0 && (
                    <motion.div
                      animate={pulseAnimation}
                      className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                    >
                      {item.notificationCount > 9 ? '9+' : item.notificationCount}
                    </motion.div>
                  )}
                  
                  {/* Active indicator */}
                  {isActive(item.path) && !item.notificationCount && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="ml-auto h-2 w-2 rounded-full bg-white"
                      initial={false}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-40 h-screen w-64 bg-gray-900 shadow-xl md:hidden"
        >
          <div className="p-6 text-center">
            <img 
              src="/logo1.png" 
              alt="Bondmetal Logo" 
              className="mx-auto h-16 w-auto"
            />
            <h2 className="mt-4 text-2xl font-bold text-white">Bondmetal</h2>
            <p className="mt-1 text-sm text-gray-400">Admin Dashboard</p>
          </div>
          <nav className="mt-6">
            <ul className="space-y-2 px-4">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                    
                    {/* Notification badge for mobile */}
                    {item.notificationCount > 0 && (
                      <motion.div
                        animate={pulseAnimation}
                        className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                      >
                        {item.notificationCount > 9 ? '9+' : item.notificationCount}
                      </motion.div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </>
  );
}