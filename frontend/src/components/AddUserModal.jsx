import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function AddUserModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      setForm({ name: '', email: '', password: '', phone: '', role: 'user' });
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email format.";
    if (!form.password || form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.phone && !/^\d{6,15}$/.test(form.phone)) return "Phone must be numbers only (6-15 digits).";
    if (!form.role) return "Role is required.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }
    await onSave(form, setError, setSaving);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <Card className="w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
        <h2 className="text-lg font-semibold mb-4">Add User</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded px-3 py-2"
            required
            type="email"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border rounded px-3 py-2"
            required
            type="password"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone (optional)"
            className="border rounded px-3 py-2"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-2 mt-4">
            <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
            <Button type="submit" variant="default" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
