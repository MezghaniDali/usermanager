import React from 'react';
import UsersJsonTable from '../components/UsersJsonTable';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import api from '../lib/api';
import EditUserModal from '../components/EditUserModal';

export default function UsersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editUser, setEditUser] = React.useState(null);
  const [editOpen, setEditOpen] = React.useState(false);

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

  if (!user || user.role !== 'admin') {
    return (
      <Card className="p-6 text-center text-red-600">Access denied. Admins only.</Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      {loading ? (
        <Card className="p-6 text-center text-gray-500">Loading users...</Card>
      ) : (
        <>
          <UsersJsonTable users={allUsers} onUserEdit={handleUserEdit} onUserDeleted={handleUserDeleted} />
          <EditUserModal user={editUser} open={editOpen} onClose={() => setEditOpen(false)} onSave={handleUserSave} />
        </>
      )}
    </div>
  );
}
