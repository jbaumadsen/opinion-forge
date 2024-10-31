export type UserRole = 'admin' | 'user' | 'moderator';

export interface User {
  id: string | number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  isActive: boolean;
  avatarURL: string;
  preferences: {
    theme: 'light' | 'dark';
    language: 'en' | 'fr';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    }
  }
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}