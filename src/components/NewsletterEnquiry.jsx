import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaSearch, FaUserPlus, FaFileExport, FaTrash } from 'react-icons/fa';

export default function NewsletterEnquiry() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample subscribers data
  const [subscribers, setSubscribers] = useState([
    { id: 1, email: 'john@example.com', subscribed: '2025-06-01', status: 'Active' },
    { id: 2, email: 'jane@example.com', subscribed: '2025-05-30', status: 'Active' },
    { id: 3, email: 'robert@example.com', subscribed: '2025-05-29', status: 'Inactive' },
    { id: 4, email: 'emily@example.com', subscribed: '2025-05-28', status: 'Active' },
    { id: 5, email: 'michael@example.com', subscribed: '2025-05-27', status: 'Active' },
    { id: 6, email: 'sarah@example.com', subscribed: '2025-05-26', status: 'Inactive' },
    { id: 7, email: 'david@example.com', subscribed: '2025-05-25', status: 'Active' },
    { id: 8, email: 'lisa@example.com', subscribed: '2025-05-24', status: 'Active' },
  ]);

  const handleAddSubscriber = () => {
    toast.info('Feature coming soon: Add new subscriber');
  };

  const handleExport = () => {
    toast.success('Newsletter subscribers exported successfully!');
  };

  const handleDeleteSubscriber = (id) => {
    setSubscribers(subscribers.filter(sub => sub.id !== id));
    toast.info('Subscriber removed successfully');
  };

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(item => 
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Newsletter Subscribers</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-grow md:flex-grow-0">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search subscribers..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddSubscriber}
            className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <FaUserPlus className="mr-2" />
            Add New
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            <FaFileExport className="mr-2" />
            Export
          </motion.button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date Subscribed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredSubscribers.map((subscriber, index) => (
                <motion.tr 
                  key={subscriber.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {subscriber.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(subscriber.subscribed).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      subscriber.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => handleDeleteSubscriber(subscriber.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSubscribers.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500">No subscribers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}