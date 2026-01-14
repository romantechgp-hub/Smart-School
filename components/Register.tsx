
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingUsers: User[] = JSON.parse(localStorage.getItem('school_users') || '[]');
    
    if (existingUsers.some(u => u.studentId === formData.studentId)) {
      setError('এই ইউজার আইডিটি ইতিমধ্যে নিবন্ধিত!');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      role: UserRole.STUDENT,
      joinDate: new Date().toISOString(),
      name: formData.name,
      studentId: formData.studentId,
      password: formData.password,
      className: '',
      roll: '',
      phone: ''
    };

    localStorage.setItem('school_users', JSON.stringify([...existingUsers, newUser]));
    alert('নিবন্ধন সফল হয়েছে!');
    onRegisterSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-600 to-emerald-800 font-['Hind_Siliguri']">
      <div className="bg-white/95 backdrop-blur shadow-2xl rounded-[40px] p-10 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-green-500 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">নতুন প্রোফাইল</h1>
          <p className="text-gray-500 font-medium">নিবন্ধন করতে নিচের তথ্যগুলো দিন</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
            <p className="text-red-700 text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">আপনার পুরো নাম</label>
            <input
              type="text"
              required
              placeholder="যেমন: আরিয়ান আহমেদ"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ইউজার আইডি</label>
            <input
              type="text"
              required
              placeholder="ইউনিক আইডি লিখুন"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-mono"
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              placeholder="গোপন পাসওয়ার্ড দিন"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-mono"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-900/20 transform active:scale-95 transition-all text-lg"
          >
            নিবন্ধন করুন
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 font-medium">
            ইতিমধ্যে অ্যাকাউন্ট আছে? {' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-700 font-black hover:underline"
            >
              লগইন করুন
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
