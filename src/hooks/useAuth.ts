import { useState, useEffect } from 'react';
import { User, currentUser } from '../data/mockData';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    setTimeout(() => {
      setUser(currentUser);
      setLoading(false);
    }, 1000);
  }, []);

  const login = (email: string, password: string) => {
    // Mock login logic
    setUser(currentUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: User['role']) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    switchRole
  };
};