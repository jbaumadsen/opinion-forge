import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Login } from './Login';
import { useAuth } from '../hooks/useAuth';

jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin.mockReset();
  });

  it('renders login form', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      isLoading: false,
    });

    render(<Login />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('calls onLogin with username and password when form is submitted', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      isLoading: false,
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('displays error message when login fails', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: 'Invalid credentials',
      isLoading: false,
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'nonexistentuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it('displays loading state when login is in progress', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      isLoading: true,
    });

    render(<Login />);
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });
});