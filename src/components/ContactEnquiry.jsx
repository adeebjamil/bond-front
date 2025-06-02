import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaTrash, FaReply, FaFilter, FaSearch, FaEnvelope, FaPhone, FaBuilding, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../config/api'; // Add this import

export default function ContactEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEnquiries, setTotalEnquiries] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/contacts`, {
        params: {
          page: currentPage,
          limit: 5,
          search: searchTerm,
          status: statusFilter
        }
      });
      
      setEnquiries(response.data.contacts);
      setTotalPages(response.data.totalPages);
      setTotalEnquiries(response.data.totalContacts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contact enquiries');
      toast.error('Failed to load contact enquiries');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage, statusFilter]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1); // Reset to first page when searching
        fetchContacts();
      } else if (searchTerm === '') {
        fetchContacts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleReply = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/contacts/${id}`, {
        status: 'Replied'
      });
      
      // Update local state
      setEnquiries(enquiries.map(item =>
        item._id === id ? { ...item, status: 'Replied' } : item
      ));
      
      toast.success('Contact marked as replied!');
    } catch (err) {
      console.error('Error updating contact:', err);
      toast.error('Failed to update contact status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/contacts/${id}`);
      
      // Remove from local state
      setEnquiries(enquiries.filter(item => item._id !== id));
      
      toast.info('Enquiry deleted successfully');
      
      // If we deleted the last item on a page, go back a page (except for page 1)
      if (enquiries.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchContacts();
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      toast.error('Failed to delete contact');
    }
  };

  const handleContact = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleSendEmail = () => {
    if (selectedContact) {
      // This would typically integrate with your email service
      // For now, we'll just simulate with a toast
      toast.success(`Email sent to ${selectedContact.name}`);
      setShowContactModal(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Contact Enquiries</h1>
          <p className="mt-1 text-gray-500">
            {totalEnquiries} total enquiries found
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search enquiries..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button 
              className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <FaFilter className="mr-2" />
              Filter
            </button>
            
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-xl">
                <button 
                  onClick={() => {
                    setStatusFilter('');
                    setShowFilterMenu(false);
                  }}
                  className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${statusFilter === '' ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  All Enquiries
                </button>
                <button 
                  onClick={() => {
                    setStatusFilter('New');
                    setShowFilterMenu(false);
                  }}
                  className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${statusFilter === 'New' ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  New Enquiries
                </button>
                <button 
                  onClick={() => {
                    setStatusFilter('Replied');
                    setShowFilterMenu(false);
                  }}
                  className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${statusFilter === 'Replied' ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  Replied Enquiries
                </button>
                <button 
                  onClick={() => {
                    setStatusFilter('Archived');
                    setShowFilterMenu(false);
                  }}
                  className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${statusFilter === 'Archived' ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  Archived
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="mr-2 animate-spin text-blue-500 text-2xl" />
            <span>Loading enquiries...</span>
          </div>
        ) : error ? (
          <div className="py-10 text-center">
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-500">
              {error}
            </div>
            <button 
              onClick={fetchContacts}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <FaEnvelope className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No enquiries found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter ? 
                'Try adjusting your search or filter to find what you\'re looking for.' : 
                'When customers submit enquiries, they will appear here.'}
            </p>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {enquiries.map((enquiry) => (
              <motion.div 
                key={enquiry._id}
                variants={item}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{enquiry.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <FaEnvelope className="mr-1" />
                          {enquiry.email}
                        </span>
                        {enquiry.phone && (
                          <span className="flex items-center">
                            <FaPhone className="mr-1" />
                            {enquiry.phone}
                          </span>
                        )}
                        {enquiry.company && (
                          <span className="flex items-center">
                            <FaBuilding className="mr-1" />
                            {enquiry.company}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        enquiry.status === 'New'
                          ? 'bg-blue-100 text-blue-800'
                          : enquiry.status === 'Replied'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enquiry.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(enquiry.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {enquiry.service && (
                    <div className="mb-2">
                      <span className="font-medium">Service:</span> {enquiry.service}
                    </div>
                  )}
                  <p className="text-gray-700">{enquiry.message}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2 bg-gray-50 px-6 py-3">
                  <button 
                    onClick={() => handleContact(enquiry)}
                    className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                  >
                    <FaEnvelope className="mr-2" />
                    Contact
                  </button>
                  <button 
                    onClick={() => handleReply(enquiry._id)}
                    className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    disabled={enquiry.status === 'Replied'}
                  >
                    <FaReply className="mr-2" />
                    Reply
                  </button>
                  <button 
                    onClick={() => handleDelete(enquiry._id)}
                    className="flex items-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{enquiries.length}</span> of{' '}
                  <span className="font-medium">{totalEnquiries}</span> results
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FaChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  <div className="hidden sm:flex sm:space-x-1">
                    {[...Array(totalPages).keys()].map(number => {
                      // Only show a subset of pages to avoid cluttering
                      if (
                        number + 1 === 1 ||
                        number + 1 === totalPages ||
                        (number + 1 >= currentPage - 1 && number + 1 <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={number + 1}
                            onClick={() => handlePageChange(number + 1)}
                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                              number + 1 === currentPage
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {number + 1}
                          </button>
                        );
                      } else if (
                        (number + 1 === currentPage - 2 && currentPage > 3) ||
                        (number + 1 === currentPage + 2 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <span
                            key={number + 1}
                            className="inline-flex items-center px-3 py-2 text-sm text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                    <FaChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Contact {selectedContact.name}</h2>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Email Subject</label>
              <input 
                type="text"
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" 
                defaultValue={`Re: Your Enquiry at Bondmetal`}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Message</label>
              <textarea 
                className="h-40 w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" 
                defaultValue={`Dear ${selectedContact.name},\n\nThank you for your enquiry. I'm writing in response to your message regarding ${selectedContact.service || 'our services'}.\n\n`}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                type="button" 
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowContactModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleSendEmail}
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}