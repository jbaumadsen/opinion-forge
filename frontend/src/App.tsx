import React from 'react';
import { Login } from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

const AppContent = () => {
  const { isLoggedIn, username, logout } = useAuth();
  return (
    <div className="App">
      <header className="App-header">
        <h1>Opinion Forge</h1>
      </header>
      <main>
        {isLoggedIn ? (
          <div>
            <h2>Welcome, {username}!</h2>
            <p>You are now logged in.</p>
            <button onClick={logout}>Log out</button>
            {/* TODO: Add more components for the logged-in state */}
          </div>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;