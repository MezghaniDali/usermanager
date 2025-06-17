import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  console.log('Dashboard - User object:', user);
  console.log('Dashboard - User type:', typeof user);
  console.log('Dashboard - User name:', user?.name);
  console.log('Dashboard - User keys:', user ? Object.keys(user) : 'No user');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome{user && user.name ? `, ${user.name}` : ''}
            </span>
            <Button className="bg-red-600 text-white hover:bg-red-700 border-none" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Content removed as requested */}
        <Card className="p-8 text-center text-gray-500">No dashboard widgets yet.</Card>
      </main>
    </div>
  );
}