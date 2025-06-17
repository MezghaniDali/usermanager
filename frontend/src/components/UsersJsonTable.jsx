import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import api from '../lib/api';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '../components/ui/table';

// Simple SVG icons
const EditIcon = () => (
  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6v-2a2 2 0 012-2h2a2 2 0 012 2v2h6"/>
  </svg>
);
const DeleteIcon = () => (
  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

export default function UsersJsonTable({ users, onUserDeleted, onUserEdit, addUserButton }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  if (!Array.isArray(users) || users.length === 0) {
    return (
      <Card className="p-4 text-gray-500">No users found.</Card>
    );
  }

  // Get all unique keys from all users for table headers
  const allKeys = Array.from(
    users.reduce((keys, user) => {
      Object.keys(user).forEach(key => keys.add(key));
      return keys;
    }, new Set())
  );

  // Filter users by search term (name, email, or role)
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.role && user.role.toLowerCase().includes(term))
    );
  });

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeletingId(userId);
    try {
      await api.delete(`/users/${userId}`);
      if (onUserDeleted) onUserDeleted(userId);
    } catch (err) {
      alert('Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex gap-2 items-center justify-between">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full max-w-xs text-sm"
        />
        {addUserButton}
      </div>
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        <Table>
          <TableHeader>
            <TableRow>
              {allKeys.map(key => (
                <TableHead key={key}>{key}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={allKeys.length + 1} className="text-center text-gray-500 py-4">No users found.</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user, idx) => (
                <TableRow key={user.id || user._id || idx}>
                  {allKeys.map(key => (
                    <TableCell key={key}>{String(user[key] ?? '')}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs"
                        onClick={() => onUserEdit ? onUserEdit(user) : alert('Edit not implemented')}
                        title="Edit"
                      >
                        <EditIcon />
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs"
                        onClick={() => handleDelete(user.id || user._id)}
                        disabled={deletingId === (user.id || user._id)}
                        title="Delete"
                      >
                        {deletingId === (user.id || user._id) ? '...' : <DeleteIcon />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
