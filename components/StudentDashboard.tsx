
import React, { useState, useEffect, useRef } from 'react';
import { User, Notice, Banner, SchoolLink, IdCardConfig } from '../types';
import AITutor from './AITutor';

interface StudentDashboardProps {
  currentUser: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ currentUser, onLogout, onUpdateUser }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [links, setLinks] = useState<SchoolLink[]>([]);
  const [view, setView] = useState<'home' | 'profile' | 'idcard' | 'aitutor'>('home');
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editFormData, setEditFormData] = useState({
    name: currentUser.name,
    className: currentUser.className || '',
    roll: currentUser.roll || '',
    phone: currentUser.phone || ''
  });

  // ID Card Default Config
  const defaultCardConfig: IdCardConfig = {
    backgroundColor: 'bg-indigo-600',
    fontFamily: 'font-sans',
    textColor: 'text-white'
  };

  const cardConfig = currentUser.idCardConfig || defaultCardConfig;

  useEffect(() => {
    setNotices(JSON.parse(localStorage.getItem('school_notices') || '[]'));
    setBanners(JSON.parse(localStorage.getItem('school_banners') || '[]'));
    setLinks(JSON.parse(localStorage.getItem('school_links') || '[]'));
  }, []);

  useEffect(() => {
    setEditFormData({
      name: currentUser.name,
      className: currentUser.className || '',
      roll: currentUser.roll || '',
      phone: currentUser.phone || ''
    });
  }, [currentUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      ...editFormData
    };
    onUpdateUser(updatedUser);
    setIsEditing(false);
    alert('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("ক্যামেরা এক্সেস করা সম্ভব হচ্ছে না।");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const savePhoto = () => {
    if (capturedImage) {
      onUpdateUser({ ...currentUser, photo: capturedImage });
      setShowPhotoModal(false);
      setCapturedImage(null);
    }
  };

  const updateCardConfig = (newConfig: Partial<IdCardConfig>) => {
    onUpdateUser({
      ...currentUser,
      idCardConfig: { ...cardConfig, ...newConfig }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-800">আসসালামু আলাইকুম,</h1>
          <p className="text-indigo-600 font-bold text-xl">{currentUser.name}</p>
        </div>
        <button onClick={onLogout} className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      {/* Hero Banners */}
      {view === 'home' && (
        <div className="mb-10 space-y-4">
          {banners.map(b => (
            <div key={b.id} className={`relative rounded-3xl overflow-hidden shadow-lg ${
              b.size === 'small' ? 'h-32' : b.size === 'large' ? 'h-64' : 'h-48'
            }`}>
              <img src={b.imageUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h2 className="text-white text-xl font-bold">{b.text}</h2>
              </div>
            </div>
          ))}
        </div>
      )}

      <nav className="flex justify-center space-x-2 mb-10 bg-white p-2 rounded-2xl shadow-sm border overflow-x-auto">
        {[
          { id: 'home', label: 'হোম', icon: '🏠' },
          { id: 'aitutor', label: 'AI টিউটর', icon: '🤖' },
          { id: 'profile', label: 'প্রোফাইল', icon: '👤' },
          { id: 'idcard', label: 'আইডি কার্ড', icon: '🪪' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setView(t.id as any);
              setIsEditing(false);
            }}
            className={`flex-1 min-w-[70px] flex flex-col items-center py-2 rounded-xl transition-all ${
              view === t.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{t.label}</span>
          </button>
        ))}
      </nav>

      {view === 'home' && (
        <div className="space-y-8 animate-fade-in">
          {/* Links */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
              প্রয়োজনীয় লিঙ্কসমূহ
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {links.map(l => (
                <a 
                  key={l.id} 
                  href={l.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md hover:border-teal-500 transition-all flex items-center justify-between group"
                >
                  <span className="font-bold text-gray-700">{l.title}</span>
                  <span className="text-teal-500 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              ))}
              {links.length === 0 && <p className="col-span-2 text-center text-gray-400 py-4">কোনো লিঙ্ক নেই</p>}
            </div>
          </section>

          {/* Notices */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
              স্কুল নোটিশ বোর্ড
            </h3>
            <div className="space-y-4">
              {notices.map(n => (
                <div key={n.id} className="bg-white p-6 rounded-3xl border-l-8 border-orange-500 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-xl text-gray-800">{n.title}</h4>
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">{n.date}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                </div>
              ))}
              {notices.length === 0 && <p className="text-center text-gray-400 py-10">আপাতত কোনো নোটিশ নেই</p>}
            </div>
          </section>
        </div>
      )}

      {view === 'aitutor' && (
        <AITutor currentUser={currentUser} />
      )}

      {view === 'profile' && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in">
          <div className="h-32 bg-indigo-600 relative">
             <div className="absolute -bottom-16 left-8 group cursor-pointer" onClick={() => setShowPhotoModal(true)}>
               <div className="w-32 h-32 bg-white rounded-3xl p-2 shadow-xl relative overflow-hidden">
                 <div className="w-full h-full bg-indigo-100 rounded-2xl flex items-center justify-center text-4xl overflow-hidden border">
                   {currentUser.photo ? (
                     <img src={currentUser.photo} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-indigo-300">👤</span>
                   )}
                 </div>
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                 </div>
               </div>
             </div>
          </div>
          <div className="pt-20 pb-8 px-8">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h2 className="text-3xl font-black text-gray-800">{currentUser.name}</h2>
                   <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">আইডি: {currentUser.studentId}</p>
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-100 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    এডিট প্রোফাইল
                  </button>
                )}
             </div>
             
             {isEditing ? (
               <form onSubmit={handleSaveProfile} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-400 uppercase font-bold mb-1">পুরো নাম</label>
                      <input 
                        type="text"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase font-bold mb-1">শ্রেণী</label>
                      <input 
                        type="text"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editFormData.className}
                        onChange={(e) => setEditFormData({...editFormData, className: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase font-bold mb-1">রোল নম্বর</label>
                      <input 
                        type="text"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editFormData.roll}
                        onChange={(e) => setEditFormData({...editFormData, roll: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase font-bold mb-1">ফোন নম্বর</label>
                      <input 
                        type="tel"
                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                        required
                      />
                    </div>
                 </div>
                 <div className="flex space-x-4">
                   <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
                   >
                     পরিবর্তন সেভ করুন
                   </button>
                   <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                   >
                     বাতিল
                   </button>
                 </div>
               </form>
             ) : (
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                     <p className="text-xs text-gray-400 uppercase font-bold mb-1">শ্রেণী</p>
                     <p className="font-bold text-gray-800">{currentUser.className || 'নির্ধারিত নয়'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                     <p className="text-xs text-gray-400 uppercase font-bold mb-1">রোল নম্বর</p>
                     <p className="font-bold text-gray-800">{currentUser.roll || 'নির্ধারিত নয়'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                     <p className="text-xs text-gray-400 uppercase font-bold mb-1">ফোন</p>
                     <p className="font-bold text-gray-800">{currentUser.phone || 'নির্ধারিত নয়'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                     <p className="text-xs text-gray-400 uppercase font-bold mb-1">যোগদানের তারিখ</p>
                     <p className="font-bold text-gray-800">{new Date(currentUser.joinDate).toLocaleDateString('bn-BD')}</p>
                  </div>
               </div>
             )}
          </div>
        </div>
      )}

      {view === 'idcard' && (
        <div className="flex flex-col items-center animate-fade-in">
           <h3 className="text-2xl font-bold mb-8">আপনার ডিজিটাল আইডি কার্ড</h3>
           
           {/* Customization Panel */}
           <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border mb-8 animate-fade-in">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">আইডি কার্ড কাস্টমাইজ করুন</h4>
              
              <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2">ব্যাকগ্রাউন্ড থিম</label>
                   <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'bg-indigo-600', color: '#4f46e5' },
                        { id: 'bg-teal-600', color: '#0d9488' },
                        { id: 'bg-rose-600', color: '#e11d48' },
                        { id: 'bg-amber-600', color: '#d97706' },
                        { id: 'bg-slate-800', color: '#1e293b' },
                        { id: 'bg-gradient-to-br from-purple-600 to-blue-700', color: 'linear-gradient(to bottom right, #9333ea, #1d4ed8)' }
                      ].map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => updateCardConfig({ backgroundColor: theme.id })}
                          className={`w-10 h-10 rounded-full border-4 transition-transform active:scale-90 ${
                            cardConfig.backgroundColor === theme.id ? 'border-white ring-2 ring-indigo-500' : 'border-transparent'
                          }`}
                          style={{ background: theme.color }}
                        />
                      ))}
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2">ফন্ট স্টাইল</label>
                   <div className="flex gap-2">
                      {[
                        { id: 'font-sans', label: 'Sans' },
                        { id: 'font-serif', label: 'Serif' },
                        { id: 'font-mono', label: 'Mono' }
                      ].map(font => (
                        <button
                          key={font.id}
                          onClick={() => updateCardConfig({ fontFamily: font.id })}
                          className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                            cardConfig.fontFamily === font.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-500 border-gray-200'
                          } ${font.id}`}
                        >
                          {font.label}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
           </div>

           <div className={`w-[350px] h-[550px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative border-8 p-8 text-center flex flex-col items-center transition-all duration-500 ${cardConfig.backgroundColor.startsWith('bg-') ? cardConfig.backgroundColor.replace('bg-', 'border-') : 'border-indigo-600'} ${cardConfig.fontFamily}`}>
              <div className={`absolute top-0 inset-x-0 h-40 clip-path-banner transition-colors duration-500 ${cardConfig.backgroundColor}`}></div>
              
              <div className="z-10 mt-10">
                <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg mx-auto overflow-hidden">
                   <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center text-4xl overflow-hidden border">
                      {currentUser.photo ? (
                        <img src={currentUser.photo} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-300">👤</span>
                      )}
                   </div>
                </div>
              </div>

              <div className="mt-8 z-10">
                 <h4 className="text-2xl font-black text-gray-800 leading-tight mb-1">{currentUser.name}</h4>
                 <p className={`font-bold text-sm uppercase mb-6 tracking-widest ${cardConfig.backgroundColor.startsWith('bg-gradient') ? 'text-indigo-600' : cardConfig.backgroundColor.replace('bg-', 'text-')}`}>Digital Student ID</p>
              </div>

              <div className="w-full space-y-4 mb-10">
                 <div className="flex flex-col border-b pb-2">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Student ID</span>
                    <span className="font-black text-gray-700">{currentUser.studentId}</span>
                 </div>
                 <div className="flex justify-between border-b pb-2">
                    <div className="flex flex-col items-start">
                       <span className="text-[10px] text-gray-400 uppercase font-bold">Class</span>
                       <span className="font-black text-gray-700">{currentUser.className || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] text-gray-400 uppercase font-bold">Roll</span>
                       <span className="font-black text-gray-700">{currentUser.roll || 'N/A'}</span>
                    </div>
                 </div>
              </div>

              <div className="mt-auto flex flex-col items-center">
                 <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                    <div className="grid grid-cols-2 gap-1 p-2 opacity-30">
                       <div className="w-3 h-3 bg-black"></div>
                       <div className="w-3 h-3 bg-black"></div>
                       <div className="w-3 h-3 bg-black"></div>
                       <div className="w-3 h-3 bg-black"></div>
                    </div>
                 </div>
                 <p className="text-[10px] text-gray-400 font-bold">SMART SCHOOL AUTHORITY</p>
              </div>

              <div className={`absolute bottom-0 inset-x-0 h-4 transition-colors duration-500 ${cardConfig.backgroundColor}`}></div>
           </div>

           <button 
             onClick={() => window.print()} 
             className="mt-10 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
             আইডি কার্ড প্রিন্ট করুন
           </button>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">আপনার ছবি পরিবর্তন করুন</h2>
            
            <div className="flex flex-col items-center space-y-6">
              {capturedImage ? (
                <div className="w-64 h-64 rounded-[40px] overflow-hidden border-4 border-indigo-100 shadow-inner">
                  <img src={capturedImage} className="w-full h-full object-cover" />
                </div>
              ) : isCameraActive ? (
                <div className="w-full aspect-square bg-black rounded-[40px] overflow-hidden relative border-4 border-indigo-100">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 inset-x-0 flex justify-center">
                    <button 
                      onClick={capturePhoto}
                      className="w-16 h-16 bg-white border-4 border-indigo-600 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <div className="w-12 h-12 bg-indigo-600 rounded-full"></div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 w-full">
                  <button 
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center p-10 bg-indigo-50 border-2 border-indigo-100 rounded-[40px] hover:bg-indigo-100 transition-colors group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-bold text-indigo-800">ক্যামেরা ব্যবহার করুন</span>
                  </button>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-10 bg-teal-50 border-2 border-teal-100 rounded-[40px] hover:bg-teal-100 transition-colors group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="font-bold text-teal-800">গ্যালারি থেকে সিলেক্ট করুন</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
              )}

              <div className="flex w-full gap-4">
                {capturedImage && (
                  <button 
                    onClick={savePhoto}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
                  >
                    ছবিটি সেভ করুন
                  </button>
                )}
                <button 
                  onClick={() => {
                    stopCamera();
                    setShowPhotoModal(false);
                    setCapturedImage(null);
                  }}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all ${capturedImage ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                >
                  {capturedImage ? 'বাতিল করুন' : 'বন্ধ করুন'}
                </button>
              </div>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Footer Banner */}
      <div className="mt-20 border-t pt-10">
         <div className="bg-white p-8 rounded-[40px] shadow-sm border flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-lg">
               🏫
            </div>
            <div>
               <h4 className="text-2xl font-black text-gray-800 mb-2">আপনার স্কুলের ভবিষ্যৎ এখন আপনার হাতে</h4>
               <p className="text-gray-500 font-medium">স্মার্ট ডিজিটাল ম্যানেজমেন্ট সিস্টেম ব্যবহারের মাধ্যমে স্কুলের সকল কার্যক্রমকে করুন আরও গতিশীল ও সহজতর।</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
