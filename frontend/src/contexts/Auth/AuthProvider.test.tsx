import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { useAuth } from '../../hooks/useAuth';
import { ReactNode } from 'react';
import { apiConfig } from '../../config/api';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'testuser@test.com',
  firstName: 'Test',
  lastName: 'User',
  role: ['admin'],
  createdAt: '2024-10-29T20:37:59.807Z',
  updatedAt: '2024-10-29T20:37:59.807Z',
  lastLogin: '2024-10-29T20:37:59.807Z',
  isActive: true,
  avatar: 'https://example.com/avatar.png',
  preferences: {
    theme: 'light' as const,
    language: 'en' as const,
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },
};

declare global {
  interface Window {
    ENV: {
      PROD: boolean;
    };
  }
}

window.ENV = {
  PROD: false,
};
describe('AuthProvider', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    // clear any test cookies
    document.cookie.split(';').forEach(cookie => {
      const [key] = cookie.split('=');
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  describe('Initial state', () => {
    it('should start with logged out state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.user).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Authentication methods', () => {
    describe('login', () => {
      it('should successfully log in user', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ 
          success: true,
          token: 'testtoken',
          user: mockUser,
        }), {
          headers: {
            'Set-Cookie': 'session=123; HttpOnly; Secure; SameSite=Strict',
          },
        });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('testuser', 'testpassword');
      });

      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);

      expect(fetchMock).toHaveBeenCalledWith(
        `${apiConfig.baseURL}/auth/login`, 
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body : JSON.stringify({ username: 'testuser', password: 'testpassword' }),
        }),
      );
      });

      it('should handle login failure', async () => {
        const errorMessage = 'Invalid credentials';
        fetchMock.mockResponseOnce(JSON.stringify({ 
          success: false,
          error: errorMessage 
        }), { status: 401 });

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
          await result.current.login('testuser', 'wrongpassword');
        });

        expect(result.current.isLoggedIn).toBe(false);
        expect(result.current.user).toBe(null);
        expect(result.current.isLoading).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
      });

      it('should handle network errors', async () => {
        fetchMock.mockReject(new Error('Network error'));

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
          await result.current.login('testuser', 'testpassword');
        });

        expect(result.current.isLoggedIn).toBe(false);
        expect(result.current.user).toBe(null);
        expect(result.current.isLoading).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
      });
    });

    describe('logout', () => {
      it('should successfully log out user', async () => {
        // First log in
        fetchMock.mockResponseOnce(JSON.stringify({ 
          success: true,
          token: 'testtoken',
          user: mockUser,
        }));

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
          await result.current.login('testuser', 'testpassword');
        });

        expect(result.current.isLoggedIn).toBe(true);

        // Then log out
        act(() => {
          result.current.logout();
        });

        expect(result.current.isLoggedIn).toBe(false);
        expect(result.current.user).toBe(null);
      });
    });
  });
});

