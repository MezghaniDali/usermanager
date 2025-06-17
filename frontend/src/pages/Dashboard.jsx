import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import api from '../lib/api';
import UsersJsonTable from '../components/UsersJsonTable';

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
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchAllUsers();
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

  const fetchAllUsers = async () => {
    try {
      let all = [];
      let page = 1;
      let lastPage = 1;
      do {
        const response = await api.get('/users', { params: { page, per_page: 50 } });
        if (response.data && response.data.status === 'success') {
          const users = response.data.data.users || [];
          all = all.concat(users);
          // Laravel-style pagination
          if (response.data.data.pagination) {
            lastPage = response.data.data.pagination.last_page || 1;
            page++;
          } else {
            // If no pagination info, break
            break;
          }
        } else {
          break;
        }
      } while (page <= lastPage);
      setAllUsers(all);
    } catch (error) {
      setAllUsers([{ error: 'Failed to fetch users' }]);
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome{user && user.name ? `, ${user.name}` : ''}
              {user && user.role && (
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              )}
            </span>
            <Button className="bg-red-600 text-white hover:bg-red-700 border-none" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Quick Stats */}
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

          {/* Test table showing all users */}
          <UsersJsonTable users={allUsers} />
        </div>
      </main>
    </div>
  );
}