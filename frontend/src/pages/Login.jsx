import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email.trim()) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Invalid email format.';
    if (!password) return 'Password is required.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // needed for Sanctum cookie auth
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      // Store the token (Laravel returns it in data.access_token)
      if (data.data && data.data.access_token) {
        localStorage.setItem('auth_token', data.data.access_token);
      }
      
      setSuccess(true);
      
      // Pass the user data to login function (Laravel returns it in data.data.user)
      login(data.data.user);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-muted">
      <Card className="w-full max-w-xs p-8 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-2 text-center">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">Login successful!</div>}
        </form>
        <div className="mt-4 flex justify-center">
          <Link to="/">
            <Button variant="ghost" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}