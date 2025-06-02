import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import API_BASE_URL from '../config/api'; // Add this import
import { 
  FaEnvelope, FaNewspaper, FaChartLine, 
  FaArrowRight, FaClock, FaExternalLinkAlt, FaSpinner,
  FaBell, FaCheckCircle 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const [stats, setStats] = useState([
    { id: 1, name: 'Contact Enquiries', value: '245', icon: <FaEnvelope className="h-6 w-6 text-green-500" />, change: '+18.2%' },
    { id: 2, name: 'Newsletter Subscribers', value: '1,432', icon: <FaNewspaper className="h-6 w-6 text-purple-500" />, change: '+7.3%' },
    { id: 3, name: 'Monthly Views', value: '45.2K', icon: <FaChartLine className="h-6 w-6 text-red-500" />, change: '+32.8%' },
  ]);

  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch recent contact enquiries
  useEffect(() => {
    const fetchRecentEnquiries = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/contacts`, {
          params: {
            limit: 5,
            page: 1,
            sort: '-createdAt'
          }
        });
        
        setRecentEnquiries(response.data.contacts);
        
        // Also update the stats with real count
        setStats(prevStats => {
          return prevStats.map(stat => 
            stat.id === 1 
              ? { ...stat, value: response.data.totalContacts.toString() }
              : stat
          );
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching recent enquiries:', err);
        setError('Failed to load recent enquiries');
        setIsLoading(false);
      }
    };
    
    fetchRecentEnquiries();
    
    // Set up polling interval (every 15 seconds)
    const intervalId = setInterval(fetchRecentEnquiries, 15000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Format relative time (like "2 minutes ago")
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  // Mark as read handler
  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/contacts/${id}`, {
        status: 'Replied'
      });
      
      // Update the local state
      setRecentEnquiries(prevEnquiries => 
        prevEnquiries.map(enquiry => 
          enquiry._id === id 
            ? { ...enquiry, status: 'Replied' }
            : enquiry
        )
      );
      
      toast.success('Marked as read');
    } catch (err) {
      console.error('Error marking enquiry as read:', err);
      toast.error('Failed to mark as read');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Dashboard Overview</h1>
          <p className="mt-1 text-gray-500">Welcome back to Bondmetal Admin</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            variants={item}
            className="overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="rounded-full bg-gray-100 p-3">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <span className={`inline-flex items-center text-sm ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
                <svg 
                  className={`ml-1 h-4 w-4 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={stat.change.startsWith('+') 
                      ? "M5 15l7-7 7 7" 
                      : "M19 9l-7 7-7-7"} 
                  />
                </svg>
                <span className="ml-1 text-gray-600">from last month</span>
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Real-time Contact Enquiries */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <FaBell className="mr-2 text-xl text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Real-time Contact Enquiries</h2>
          </div>
          <Link to="/dashboard/contact-enquiry" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
            View All
            <FaArrowRight className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <FaSpinner className="animate-spin mr-2 text-blue-500" />
            <span className="text-gray-600">Loading recent enquiries...</span>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            <p>{error}</p>
          </div>
        ) : recentEnquiries.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-10 text-center">
            <FaEnvelope className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <h3 className="mb-1 text-lg font-medium text-gray-800">No Recent Enquiries</h3>
            <p className="text-gray-500">New customer enquiries will appear here in real-time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {recentEnquiries.map((enquiry, index) => (
                <motion.div
                  key={enquiry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`overflow-hidden rounded-lg border-l-4 ${
                    enquiry.status === 'New' 
                      ? 'border-l-blue-500 bg-blue-50' 
                      : 'border-l-green-500 bg-gray-50'
                  } p-4`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-800">{enquiry.name}</h3>
                        {enquiry.status === 'New' && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <FaClock className="mr-1" />
                          {formatRelativeTime(enquiry.createdAt)}
                        </span>
                        <span>{enquiry.email}</span>
                        {enquiry.service && (
                          <span className="rounded-full bg-gray-200 px-2 py-0.5">
                            {enquiry.service}
                          </span>
                        )}
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                        {enquiry.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {enquiry.status === 'New' ? (
                        <button 
                          onClick={() => handleMarkAsRead(enquiry._id)}
                          className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <span className="flex items-center rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                          <FaCheckCircle className="mr-1" />
                          Read
                        </span>
                      )}
                      <Link 
                        to={`/dashboard/contact-enquiry?id=${enquiry._id}`} 
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        <FaExternalLinkAlt className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Recent Activity</h2>
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    Jun 1, 2025
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                    New newsletter subscriber
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    May 31, 2025
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                    Contact form submission
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    May 30, 2025
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                    System maintenance
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Quick Stats</h2>
          
          <div className="space-y-6">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Website Traffic</span>
                <span className="text-sm font-bold text-green-600">+12.5%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-3/4 rounded-full bg-blue-500"></div>
              </div>
            </div>
            
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
                <span className="text-sm font-bold text-green-600">+5.2%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-1/2 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Bounce Rate</span>
                <span className="text-sm font-bold text-red-600">-3.1%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-1/4 rounded-full bg-red-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}