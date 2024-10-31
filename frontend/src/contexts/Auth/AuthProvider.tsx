import React, { createContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from './types';
import { apiConfig } from '../../config/api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${apiConfig.baseURL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('login response not ok', data);
        setError(data.error);
        return;
      }

      if (data.success) {
        setIsLoggedIn(true);
        setUser(data.user);
      } else {
        console.error('login failed', data);
        setError(data.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};