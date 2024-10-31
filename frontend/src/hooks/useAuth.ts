import { useContext } from 'react';
import { AuthContext } from '../contexts/Auth/AuthProvider';
import { AuthContextType } from '../contexts/Auth/types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};