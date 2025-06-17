import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    console.log('Token from localStorage:', token); // Debug: Check if token exists
    
    if (token) {
      api.get('/auth/profile')
        .then(res => {
          console.log('Full API Response:', res); // Debug: Full response object
          console.log('API Response Data:', res.data); // Debug: Response data
          
          if (res.data && res.data.status === 'success') {
            console.log('User data being set:', res.data.data); // Debug: User data
            console.log('User name specifically:', res.data.data?.name); // Debug: Name field
            setUser(res.data.data);
            setIsAuthenticated(true);
          } else {
            console.log('API response status not success:', res.data?.status); // Debug: Failed status
            setUser(null);
            setIsAuthenticated(false);
          }
        })
        .catch(error => {
          console.log('API Error:', error); // Debug: API errors
          console.log('Error response:', error.response?.data); // Debug: Error details
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      console.log('No token found, skipping profile fetch'); // Debug: No token
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    console.log('Login called with userData:', userData); // Debug: Login data
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logout called'); // Debug: Logout
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};