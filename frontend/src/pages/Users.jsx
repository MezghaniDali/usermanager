import React from 'react';
import UsersTable from '../components/UsersTable';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import api from '../lib/api';
import EditUserModal from '../components/EditUserModal';
import AddUserModal from '../components/AddUserModal';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function UsersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editUser, setEditUser] = React.useState(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAllUsers();
  }, [user]);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      let all = [];
      let page = 1;
      let lastPage = 1;
      do {
        const response = await api.get('/users', { params: { page, per_page: 50 } });
        if (response.data && response.data.status === 'success') {
          const users = response.data.data.users || [];
          all = all.concat(users);
          if (response.data.data.pagination) {
            lastPage = response.data.data.pagination.last_page || 1;
            page++;
          } else {
            break;
          }
        } else {
          break;
        }
      } while (page <= lastPage);
      setAllUsers(all);
    } catch (error) {
      setAllUsers([{ error: 'Failed to fetch users' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserEdit = (user) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleUserSave = async (updatedUser) => {
    try {
      await api.put(`/users/${updatedUser.id || updatedUser._id}`, updatedUser);
      setAllUsers(prev => prev.map(u => (u.id || u._id) === (updatedUser.id || updatedUser._id) ? updatedUser : u));
      setEditOpen(false);
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleUserDeleted = (userId) => {
    setAllUsers(prev => prev.filter(u => (u.id || u._id) !== userId));
  };

  const handleUserAdd = async (form, setError, setSaving) => {
    try {
      const res = await api.post('/users', form);
      if (res.data && res.data.status === 'success') {
        setAllUsers(prev => [res.data.data.user, ...prev]);
        setAddOpen(false);
      } else {
        setError(res.data.message || 'Failed to add user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <Card className="p-6 text-center text-red-600">Access denied. Admins only.</Card>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground flex-1 text-left">Manage Users</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            <span className="text-sm text-muted-foreground order-1 w-full sm:w-auto text-left sm:text-right">
              {user?.name ? `Admin: ${user.name}` : ''}
            </span>
            <Button size="sm" onClick={() => navigate(-1)} className="order-2 w-full sm:w-auto bg-black text-white hover:bg-gray-800">
              &#8592; Back
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {loading ? (
          <Card className="p-6 text-center text-gray-500">Loading users...</Card>
        ) : (
          <>
            <UsersTable users={allUsers} onUserEdit={handleUserEdit} onUserDeleted={handleUserDeleted} addUserButton={<Button onClick={() => setAddOpen(true)} variant="default">Add User</Button>} />
            <EditUserModal user={editUser} open={editOpen} onClose={() => setEditOpen(false)} onSave={handleUserSave} />
            <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} onSave={handleUserAdd} />
          </>
        )}
      </div>
    </div>
  );
}
