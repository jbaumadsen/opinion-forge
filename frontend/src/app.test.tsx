import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { useAuth } from './hooks/useAuth';

jest.mock('./hooks/useAuth', () => ({
  ...jest.requireActual('./hooks/useAuth'),
  useAuth: jest.fn().mockReturnValue({
    isLoggedIn: false,
    user: null,
    logout: jest.fn(),
    error: null,
    isLoading: false,
    login: jest.fn(),
  }),
}));

describe('App Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form when not logged in', () => {
    render(<App />);
    expect(screen.getByText(/Opinion Forge/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  it('shows welcome message after successful login', async () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      isLoggedIn: true,
      user: { username: 'testuser' },
      logout: jest.fn(),
      error: null,
    }));

    render(<App />);
    expect(screen.getByText(/Welcome, testuser!/i)).toBeInTheDocument();
    expect(screen.getByText(/You are now logged in./i)).toBeInTheDocument();
  });

  it('handles logout', async () => {
    const mockLogout = jest.fn();

    (useAuth as jest.Mock).mockImplementation(() => ({
      isLoggedIn: true,
      user: { username: 'testuser' },
      logout: mockLogout,
      error: null,
    }));

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Log Out/i }));
    expect(mockLogout).toHaveBeenCalled();
  });
});