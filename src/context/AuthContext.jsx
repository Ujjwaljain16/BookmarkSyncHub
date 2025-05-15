import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import config from '../config';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`${config.authBaseUrl}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const sendTokenToExtension = async (token) => {
    if (window.chrome && window.chrome.runtime && window.chrome.runtime.sendMessage) {
      try {
        // Get all installed extensions
        const extensions = await window.chrome.management.getAll();
        // Find our extension by name
        const ourExtension = extensions.find(ext => ext.name === 'BookmarkSyncHub');
        
        if (ourExtension) {
          await window.chrome.runtime.sendMessage(
            ourExtension.id,
            { type: 'SET_JWT_TOKEN', token }
          );
          console.log('Token sent to extension successfully');
        } else {
          console.log('BookmarkSyncHub extension not found');
        }
      } catch (error) {
        console.log('Could not send token to extension:', error);
      }
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${config.authBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      // Send token to Chrome extension
      await sendTokenToExtension(data.token);
      
      toast.success('Logged in successfully');
      return data.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await fetch(`${config.authBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      // Send token to Chrome extension
      await sendTokenToExtension(data.token);
      
      toast.success('Registered successfully');
      return data.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 