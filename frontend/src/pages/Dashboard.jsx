import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import api from '../lib/api';
import CurrentUserCard from '../components/CurrentUserCard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_users: 0,
    admin_users: 0,
    regular_users: 0,
    users_this_month: 0,
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
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground flex-1 text-left">Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            <span className="text-sm text-muted-foreground order-2 sm:order-1 w-full sm:w-auto text-left sm:text-right">
              Welcome{user?.name ? `, ${user.name}` : ''}
            </span>
            {user?.role === 'admin' && (
              <Button variant="default" className="order-1 sm:order-2 w-full sm:w-auto" onClick={() => navigate('/users')}>
                Manage Users
              </Button>
            )}
            <Button variant="destructive" className="order-3 w-full sm:w-auto" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {user?.role === 'admin' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {statsLoading ? '...' : stats.total_users}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Admin Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">
                    {statsLoading ? '...' : stats.admin_users}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Regular Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {statsLoading ? '...' : stats.regular_users}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-500">
                    {statsLoading ? '...' : stats.users_this_month}
                  </p>
                </CardContent>
              </Card>
            </div>
            <CurrentUserCard />
          </>
        ) : (
          <CurrentUserCard />
        )}
      </main>
    </div>
  );
}
