import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Check hardcoded credentials
      if (username === 'adeeb' && password === '123') {
        // Set auth in localStorage for persistence
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Successfully logged in! Welcome back, Adeeb.');
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
        toast.error('Login failed. Please check your credentials.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <img 
            src="/logo1.png" 
            alt="Bondmetal Logo" 
            className="mx-auto h-24 w-auto"
          />
          <h2 className="mt-4 text-3xl font-bold text-gray-800">Bondmetal Admin</h2>
          <p className="mt-2 text-gray-600">Enter your credentials to continue</p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 rounded-lg bg-red-50 p-4 text-red-500"
          >
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
          >
            {isLoading ? (
              <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <FaSignInAlt className="mr-2" />
                Sign In
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}