import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome';
import ContactEnquiry from './components/ContactEnquiry';
import NewsletterEnquiry from './components/NewsletterEnquiry';
import Analytics from './components/Analytics';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="contact-enquiry" element={<ContactEnquiry />} />
          <Route path="newsletter-enquiry" element={<NewsletterEnquiry />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}