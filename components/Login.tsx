
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check for hardcoded Admin Login
    if (userId === '1' && password === '1') {
      const admin: User = {
        id: 'admin-1',
        name: 'প্রধান এডমিন',
        studentId: '1',
        password: '1',
        role: UserRole.ADMIN,
        joinDate: new Date().toISOString()
      };
      onLoginSuccess(admin);
      return;
    }

    // Check regular users from local storage
    const users: User[] = JSON.parse(localStorage.getItem('school_users') || '[]');
    const user = users.find(u => u.studentId === userId && u.password === password);

    if (user) {
      onLoginSuccess(user);
    } else {
      setError('ভুল হয়েছে! সঠিক ইউজার আইডি ও পাসওয়ার্ড দিন।');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <div className="bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-500 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">স্মার্ট স্কুল লগইন</h1>
          <p className="text-gray-500">আপনার তথ্য দিয়ে প্রবেশ করুন</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 animate-pulse">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ইউজার আইডি</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="আপনার আইডি লিখুন"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform active:scale-95 transition-all"
          >
            প্রবেশ করুন
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            অ্যাকাউন্ট নেই? {' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 font-semibold hover:underline"
            >
              নতুন অ্যাকাউন্ট তৈরি করুন
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
