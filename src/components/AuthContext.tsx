import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiUrl } from '../assets/env-var';

// Define AuthContext properties
interface AuthContextProps {
  isAdmin: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Fetch user info from the backend
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(apiUrl + 'auth/me', {
          method: 'GET',
          credentials: 'include', // Include the cookie in the request
        });

        if (response.ok) {
          const data = await response.json();
          setToken('valid'); // Dummy token, since it's stored as a cookie
          setIsAdmin(data.role === 'admin');
        } else {
          setToken(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Failed to fetch user info', error);
        setToken(null);
        setIsAdmin(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, isAdmin }}>
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
