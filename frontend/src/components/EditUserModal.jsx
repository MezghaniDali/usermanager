import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function EditUserModal({ user, open, onClose, onSave }) {
  const [form, setForm] = useState(user || {});
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setForm(user || {});
  }, [user]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <Card className="w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
        <h2 className="text-lg font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="email"
            value={form.email || ''}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded px-3 py-2"
            required
            type="email"
          />
          <input
            name="phone"
            value={form.phone || ''}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded px-3 py-2"
          />
          <select
            name="role"
            value={form.role || ''}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <div className="flex gap-2 mt-4">
            <Button type="button" onClick={onClose} className="bg-gray-300 text-gray-800">Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
