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
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
  });

  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('calls onLogin with username and password when form is submitted', async () => {
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('displays error message when login fails', async () => {
    render(<Login />);
    
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    const errorMessage = await screen.findByText(/invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });
});