
import React, { useState, useEffect } from 'react';
import { User, Notice, Banner, SchoolLink, UserRole } from '../types';

interface AdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'notices' | 'banners' | 'links' | 'settings'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [links, setLinks] = useState<SchoolLink[]>([]);
  
  // Forms
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });
  const [bannerForm, setBannerForm] = useState({ imageUrl: '', text: '', size: 'medium' as 'small' | 'medium' | 'large' });
  const [linkForm, setLinkForm] = useState({ title: '', url: '' });
  
  // Mock Crop state
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem('school_users') || '[]'));
    setNotices(JSON.parse(localStorage.getItem('school_notices') || '[]'));
    setBanners(JSON.parse(localStorage.getItem('school_banners') || '[]'));
    setLinks(JSON.parse(localStorage.getItem('school_links') || '[]'));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmCrop = () => {
    setBannerForm({ ...bannerForm, imageUrl: tempImage || '' });
    setIsCropping(false);
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: Notice = {
      id: Date.now().toString(),
      title: noticeForm.title,
      content: noticeForm.content,
      date: new Date().toLocaleDateString('bn-BD')
    };
    const updated = [newNotice, ...notices];
    setNotices(updated);
    localStorage.setItem('school_notices', JSON.stringify(updated));
    setNoticeForm({ title: '', content: '' });
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const newBanner: Banner = {
      id: Date.now().toString(),
      imageUrl: bannerForm.imageUrl,
      text: bannerForm.text,
      size: bannerForm.size,
      createdAt: new Date().toISOString()
    };
    const updated = [newBanner, ...banners];
    setBanners(updated);
    localStorage.setItem('school_banners', JSON.stringify(updated));
    setBannerForm({ imageUrl: '', text: '', size: 'medium' });
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    const newLink: SchoolLink = {
      id: Date.now().toString(),
      title: linkForm.title,
      url: linkForm.url
    };
    const updated = [newLink, ...links];
    setLinks(updated);
    localStorage.setItem('school_links', JSON.stringify(updated));
    setLinkForm({ title: '', url: '' });
  };

  const deleteUser = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ইউজারটিকে মুছে ফেলতে চান?')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      localStorage.setItem('school_users', JSON.stringify(updated));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl shadow-sm mb-8">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">এডমিন ড্যাশবোর্ড</h1>
            <p className="text-gray-500">ম্যানেজমেন্ট প্যানেলে আপনাকে স্বাগতম</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2 rounded-xl font-bold transition-colors">
          লগআউট
        </button>
      </header>

      <nav className="flex flex-wrap gap-3 mb-8">
        {[
          { id: 'users', label: 'ইউজার মনিটর', icon: '👥' },
          { id: 'notices', label: 'নোটিশ', icon: '📢' },
          { id: 'banners', label: 'ব্যানার', icon: '🖼️' },
          { id: 'links', label: 'লিঙ্ক', icon: '🔗' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg transform scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[400px]">
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">রিয়েল টাইম ইউজার ডাটা</h2>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">মোট ছাত্র: {users.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-6 py-4">নাম</th>
                    <th className="px-6 py-4">ইউজার আইডি</th>
                    <th className="px-6 py-4">পাসওয়ার্ড</th>
                    <th className="px-6 py-4">শ্রেণী/রোল</th>
                    <th className="px-6 py-4">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{u.name}</td>
                      <td className="px-6 py-4 text-indigo-600 font-mono">{u.studentId}</td>
                      <td className="px-6 py-4 text-pink-600 font-mono font-bold">{u.password}</td>
                      <td className="px-6 py-4 text-gray-600">{u.className} (রোল: {u.roll})</td>
                      <td className="px-6 py-4">
                        <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700 font-bold underline">মুছে ফেলুন</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center py-10 text-gray-400">কোনো ইউজার নিবন্ধিত নেই</p>}
            </div>
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold mb-6 text-gray-800">নতুন নোটিশ পোস্ট করুন</h2>
              <form onSubmit={handleAddNotice} className="space-y-4">
                <input
                  type="text"
                  placeholder="নোটিশের শিরোনাম"
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  value={noticeForm.title}
                  onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                />
                <textarea
                  placeholder="নোটিশের বিস্তারিত বর্ণনা"
                  className="w-full p-3 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  value={noticeForm.content}
                  onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                />
                <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all">পাবলিশ করুন</button>
              </form>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-6 text-gray-800">সাম্প্রতিক নোটিশসমূহ</h2>
              <div className="space-y-4">
                {notices.map(n => (
                  <div key={n.id} className="p-4 border rounded-2xl bg-gray-50 relative group">
                    <h3 className="font-bold text-gray-800">{n.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">{n.date}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{n.content}</p>
                    <button 
                      onClick={() => {
                        const updated = notices.filter(x => x.id !== n.id);
                        setNotices(updated);
                        localStorage.setItem('school_notices', JSON.stringify(updated));
                      }}
                      className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >মুছুন</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold mb-6 text-gray-800">ব্যানার ইমেজ পোস্ট করুন</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center">
                  {bannerForm.imageUrl ? (
                    <img src={bannerForm.imageUrl} className="max-h-40 mx-auto rounded-xl shadow-sm mb-4" />
                  ) : (
                    <div className="py-8">
                      <p className="text-gray-400">ছবি সিলেক্ট করুন</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="banner-upload" />
                  <label htmlFor="banner-upload" className="cursor-pointer bg-blue-50 text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                    ছবি আপলোড ও ক্রপ করুন
                  </label>
                </div>
                
                <div className="flex gap-4">
                  {(['small', 'medium', 'large'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setBannerForm({...bannerForm, size: s})}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                        bannerForm.size === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'
                      }`}
                    >
                      {s === 'small' ? 'ছোট' : s === 'medium' ? 'মাঝারি' : 'বড়'} সাইজ
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="ব্যানার টেক্সট (ঐচ্ছিক)"
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={bannerForm.text}
                  onChange={e => setBannerForm({ ...bannerForm, text: e.target.value })}
                />
                <button onClick={handleAddBanner} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md">ব্যানার সেভ করুন</button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800">বর্তমান ব্যানারসমূহ</h2>
              {banners.map(b => (
                <div key={b.id} className="relative rounded-2xl overflow-hidden border">
                  <img src={b.imageUrl} className="w-full object-cover h-32" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                    <p className="text-white font-bold text-center">{b.text}</p>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = banners.filter(x => x.id !== b.id);
                      setBanners(updated);
                      localStorage.setItem('school_banners', JSON.stringify(updated));
                    }}
                    className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold mb-6 text-gray-800">লিঙ্ক শেয়ার করুন</h2>
              <form onSubmit={handleAddLink} className="space-y-4">
                <input
                  type="text"
                  placeholder="লিঙ্ক শিরোনাম (যেমন: রেজাল্ট সাইট)"
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                  required
                  value={linkForm.title}
                  onChange={e => setLinkForm({ ...linkForm, title: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="লিঙ্ক ইউআরএল (https://...)"
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                  required
                  value={linkForm.url}
                  onChange={e => setLinkForm({ ...linkForm, url: e.target.value })}
                />
                <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 shadow-md">লিঙ্ক যুক্ত করুন</button>
              </form>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-6 text-gray-800">অ্যাক্টিভ লিঙ্কসমূহ</h2>
              <div className="flex flex-wrap gap-3">
                {links.map(l => (
                  <div key={l.id} className="flex items-center space-x-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-xl border border-teal-200 group">
                    <span className="font-semibold">{l.title}</span>
                    <button 
                      onClick={() => {
                        const updated = links.filter(x => x.id !== l.id);
                        setLinks(updated);
                        localStorage.setItem('school_links', JSON.stringify(updated));
                      }}
                      className="text-teal-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Global Banner (Visible at bottom) */}
      <div className="mt-10 bg-indigo-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="z-10 flex items-center space-x-6 mb-4 md:mb-0">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur shadow-inner">
            <span className="text-4xl">🎓</span>
          </div>
          <div>
            <h3 className="text-2xl font-black">স্মার্ট স্কুল সিস্টেম</h3>
            <p className="opacity-80">সকল কার্যক্রম এখন ডিজিটাল হাতের নাগালে।</p>
          </div>
        </div>
        <div className="z-10 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 w-full md:w-auto">
          <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-1">এডমিন নোটিফিকেশন</p>
          <p className="italic">"প্রতিষ্ঠানের উন্নয়নে আমরা সর্বদা সক্রিয়।"</p>
        </div>
      </div>

      {/* Crop Modal Mockup */}
      {isCropping && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">ছবি ক্রপ করুন</h2>
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center mb-6">
              <img src={tempImage!} className="max-w-full max-h-full" />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsCropping(false)} className="px-6 py-2 text-gray-500 font-bold">বাতিল</button>
              <button onClick={confirmCrop} className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg">ক্রপ সম্পন্ন করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
