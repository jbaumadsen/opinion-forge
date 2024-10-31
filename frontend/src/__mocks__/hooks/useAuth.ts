export const useAuth = jest.fn();

useAuth.mockImplementation(() => ({
  isLoggedIn: false,
  user: null,
  login: jest.fn().mockImplementation(() => Promise.resolve({ success: true })),
  logout: jest.fn(),
  error: null
}));