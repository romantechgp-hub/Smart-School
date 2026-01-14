
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('school_user_session');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('school_user_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('school_user_session');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('school_user_session', JSON.stringify(updatedUser));
    
    // Also update in the global users list to persist permanently
    const users: User[] = JSON.parse(localStorage.getItem('school_users') || '[]');
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('school_users', JSON.stringify(updatedUsers));
  };

  if (!currentUser) {
    return isRegistering ? (
      <Register 
        onSwitchToLogin={() => setIsRegistering(false)} 
        onRegisterSuccess={() => setIsRegistering(false)} 
      />
    ) : (
      <Login 
        onSwitchToRegister={() => setIsRegistering(true)} 
        onLoginSuccess={handleLogin} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {currentUser.role === UserRole.ADMIN ? (
        <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <StudentDashboard 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default App;
