import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Card } from '../components/ui/card';

export default function CurrentUserCard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="p-4 text-gray-500">No user is currently logged in.</Card>
    );
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Current User</h2>
      <div className="flex flex-col gap-2 text-sm">
        <div><span className="font-medium">Name:</span> {user.name}</div>
        <div><span className="font-medium">Email:</span> {user.email}</div>
        {user.phone && <div><span className="font-medium">Phone:</span> {user.phone}</div>}
        {user.role && <div><span className="font-medium">Role:</span> <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span></div>}
        {user.created_at && <div><span className="font-medium">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</div>}
      </div>
    </Card>
  );
}
