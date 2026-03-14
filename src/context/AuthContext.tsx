import { apiUrl } from '../lib/utils';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  ownerLogin: (password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(apiUrl('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          const isOwnerAuth = localStorage.getItem('isOwnerAuthenticated') === 'true';
          if (isOwnerAuth) {
            setUser({ id: 0, email: 'owner@ac-estate.com', full_name: 'Owner', role: 'owner' });
          }
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      }
    } catch (error) {
      console.error("Login failed", error);
    }
    return false;
  };

  const ownerLogin = async (password: string): Promise<boolean> => {
    const ownerPassword = import.meta.env.VITE_OWNER_PASSWORD || 'ArneOlsen2026!';
    if (password === ownerPassword) {
      const ownerUser: User = { id: 0, email: 'owner@ac-estate.com', full_name: 'Owner', role: 'owner' };
      setUser(ownerUser);
      localStorage.setItem('isOwnerAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName })
      });
      return res.ok;
    } catch (error) {
      console.error("Registration failed", error);
    }
    return false;
  };

  const logout = async () => {
    try {
      await fetch(apiUrl('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    localStorage.removeItem('isOwnerAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isOwner: user?.role === 'owner',
      login, 
      ownerLogin,
      register,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
