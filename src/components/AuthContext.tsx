import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiUrl } from '../assets/env-var';

// Define AuthContext properties
interface AuthContextProps {
  isAdmin: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to login
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log(`Attempting to login to ${apiUrl}/auth/login`);
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Important for cookies
      });

      if (response.ok) {
        console.log('Login successful');
        setToken('valid'); // Dummy token, since it's stored as a cookie
        setIsAdmin(true); // Assuming successful login means admin
        return true;
      } else {
        console.error('Login failed:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Function to logout
  const logout = async (): Promise<void> => {
    try {
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Fetch user info from the backend
    const fetchUserInfo = async () => {
      try {
        console.log(`Fetching user info from ${apiUrl}/auth/me`);
        const response = await fetch(`${apiUrl}/auth/me`, {
          method: 'GET',
          credentials: 'include', // Include the cookie in the request
        });

        if (response.ok) {
          const data = await response.json();
          console.log('User info:', data);
          setToken('valid'); // Dummy token, since it's stored as a cookie
          setIsAdmin(data.role === 'admin');
        } else {
          console.log('Not authenticated:', response.status);
          setToken(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Failed to fetch user info', error);
        setToken(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, isAdmin, login, logout, loading }}>
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
