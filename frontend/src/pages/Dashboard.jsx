import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import api from '../lib/api';
import CurrentUserCard from '../components/CurrentUserCard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_users: 0,
    admin_users: 0,
    regular_users: 0,
    users_this_month: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.get('/users/stats');
      
      if (response.data.status === 'success') {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API to revoke token
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state and redirect
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome{user && user.name ? `, ${user.name}` : ''}
            </span>
            {user && user.role === 'admin' && (
              <Button className="bg-blue-600 text-white hover:bg-blue-700 border-none" onClick={() => navigate('/users')}>
                Manage Users
              </Button>
            )}
            <Button className="bg-red-600 text-white hover:bg-red-700 border-none" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {user && user.role === 'admin' ? (
            <>
              {/* Admin dashboard content: stats cards and personal info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {statsLoading ? '...' : stats.total_users}
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">Admin Users</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {statsLoading ? '...' : stats.admin_users}
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">Regular Users</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {statsLoading ? '...' : stats.regular_users}
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">This Month</h3>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {statsLoading ? '...' : stats.users_this_month}
                  </p>
                </Card>
              </div>
              <CurrentUserCard />
            </>
          ) : (
            <CurrentUserCard />
          )}
        </div>
      </main>
    </div>
  );
}