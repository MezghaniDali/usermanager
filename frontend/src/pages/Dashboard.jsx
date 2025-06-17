import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            <span className="text-gray-600">Welcome, {user?.name || 'User'}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">User Management</h2>
            <p className="text-gray-600 mb-4">Manage system users, roles, and permissions</p>
            <Button className="w-full" onClick={() => navigate('/users')}>
              View Users
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Statistics</h2>
            <p className="text-gray-600 mb-4">View system statistics and analytics</p>
            <Button className="w-full" variant="outline">
              View Stats
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Settings</h2>
            <p className="text-gray-600 mb-4">Configure system settings and preferences</p>
            <Button className="w-full" variant="outline">
              Open Settings
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
