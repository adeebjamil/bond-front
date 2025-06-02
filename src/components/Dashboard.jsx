
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };
  
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bondmetal Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-lg">Welcome to the admin dashboard!</p>
        <p className="mt-2 text-gray-600">This is where you can manage your application.</p>
      </div>
    </div>
  );
}