
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Play, TrendingUp, Settings, MessageSquare, 
  Shield, Send, Users, DollarSign, Heart, Hash, 
  Search, Menu, X, Trash2, ThumbsUp, Share2, Plus, Activity, Globe, ArrowLeft, Coins, Clock, Sparkles, LogIn, UserPlus, Zap, Camera, Music, Palette, Image as ImageIcon, Upload, Edit3, Check, RefreshCw, UploadCloud
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MOCK_VIDEOS, MOCK_REELS } from './constants';

// --- PRIDE COIN LOGO COMPONENT ---
const PrideCoin = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <div className={`inline-flex items-center justify-center bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full font-black text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] ${className}`} style={{ width: size, height: size, fontSize: size * 0.7 }}>
    Ϸ
  </div>
);

// --- TYPES ---
export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  author: string;
  views: string;
  timestamp: string;
  duration: string;
  isAd?: boolean;
  status: 'active' | 'frozen';
  category?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  password?: string;
  avatar: string;
  bio?: string;
  balance: number;
  aiSubscriptionUntil: number | null; 
  totalOnlineTime: number; 
  country: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAi?: boolean;
  avatar?: string;
}

// --- AI SERVICE ---
const getPrideAiResponse = async (userMessage: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Pride AI maintenance (Key missing).";
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are 'Pride AI', built by Pride Prime Team. Identity: No Google/Gemini mention. Friendly professional. Rules: Ϸ is currency. Illegal content gets FROZEN. Respond in the user's language.`,
      }
    });
    return response.text || "Neural link active.";
  } catch (error) {
    return "Pride AI core refreshing...";
  }
};

// --- AUTH COMPONENT ---
const AuthScreen = ({ onLogin }: { onLogin: (user: UserProfile) => void }) => {
  const [activeMode, setActiveMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('India');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let storedUsers = [];
    try {
      storedUsers = JSON.parse(localStorage.getItem('pp_registered_users') || '[]');
    } catch (e) { storedUsers = []; }

    if (activeMode === 'signup') {
      const newUser: UserProfile = { 
        name, email, password, country,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || Date.now()}`, 
        balance: 1000, aiSubscriptionUntil: null, totalOnlineTime: 0 
      };
      storedUsers.push(newUser);
      localStorage.setItem('pp_registered_users', JSON.stringify(storedUsers));
      localStorage.setItem('pp_user', JSON.stringify(newUser));
      onLogin(newUser);
    } else {
      const user = storedUsers.find((u: any) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('pp_user', JSON.stringify(user));
        onLogin(user);
      } else {
        alert("Invalid credentials! Sign Up first.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020202] text-white p-6 app-entry">
      <div className="w-full max-w-md bg-[#080808] border border-white/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl mx-auto mb-6 flex items-center justify-center font-black italic text-4xl shadow-xl">PP</div>
        <h1 className="text-2xl font-black text-center mb-8 uppercase italic tracking-tighter">PRIDE<span className="text-purple-500">PRIME</span></h1>
        
        <div className="flex bg-black rounded-2xl p-1 mb-8">
          <button onClick={() => setActiveMode('login')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeMode === 'login' ? 'bg-[#151515] text-white shadow-lg' : 'text-gray-500'}`}>Login</button>
          <button onClick={() => setActiveMode('signup')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeMode === 'signup' ? 'bg-[#151515] text-white shadow-lg' : 'text-gray-500'}`}>Join Now</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeMode === 'signup' && (
            <>
              <input required type="text" placeholder="FULL NAME" className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-purple-500 font-bold uppercase" value={name} onChange={e => setName(e.target.value)} />
              <select className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-purple-500 font-bold uppercase text-gray-400" value={country} onChange={e => setCountry(e.target.value)}>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Japan">Japan</option>
              </select>
            </>
          )}
          <input required type="email" placeholder="EMAIL" className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-purple-500 font-bold uppercase" value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" placeholder="PASSWORD" className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-purple-500 font-bold uppercase" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-purple-600 py-4 rounded-2xl font-black text-sm uppercase shadow-xl transform active:scale-95 text-white">
             <Zap size={16} className="inline mr-2" />
             {activeMode === 'login' ? 'Enter Realm' : 'Create Legacy'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const PrideApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState(() => {
    try { return localStorage.getItem('pp_tab') || 'home'; } catch { return 'home'; }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('pp_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [userVideos, setUserVideos] = useState<Video[]>(() => {
    try { return JSON.parse(localStorage.getItem('pp_user_videos') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      setCurrentUser(prev => {
        if (!prev) return null;
        const newTime = (prev.totalOnlineTime || 0) + 1;
        let newBalance = prev.balance;
        if (newTime > 0 && newTime % 7200 === 0) {
          newBalance += 200;
          alert("PRIDE PRIME: Dedication reward 200Ϸ added! 🎉");
        }
        const updated = { ...prev, totalOnlineTime: newTime, balance: newBalance };
        try { localStorage.setItem('pp_user', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentUser?.email]);

  const handleProfileUpdate = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updated };
    setCurrentUser(newUser);
    try {
      localStorage.setItem('pp_user', JSON.stringify(newUser));
      let stored = JSON.parse(localStorage.getItem('pp_registered_users') || '[]');
      const newStored = stored.map((u: any) => u.email === newUser.email ? newUser : u);
      localStorage.setItem('pp_registered_users', JSON.stringify(newStored));
    } catch (e) {}
  };

  const handleUpload = (v: Video) => {
    const updated = [v, ...userVideos];
    setUserVideos(updated);
    try { localStorage.setItem('pp_user_videos', JSON.stringify(updated)); } catch (e) {}
  };

  if (!currentUser) return <AuthScreen onLogin={setCurrentUser} />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#020202] text-white font-['Outfit'] select-none app-entry">
      <div className="flex h-full w-full">
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[#070707] border-r border-white/5 flex flex-col shrink-0`}>
          <div className="p-6 flex items-center space-x-3">
            <div className="bg-purple-600 p-2.5 rounded-xl font-black italic shrink-0 shadow-lg">PP</div>
            {isSidebarOpen && <span className="font-black tracking-tighter italic text-lg">PRIDE<span className="text-purple-500">PRIME</span></span>}
          </div>
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar pt-4">
            <NavItem icon={Home} label="Home" id="home" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
            <NavItem icon={Play} label="Shorts" id="reels" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
            <NavItem icon={TrendingUp} label="Trending" id="trending" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
            <div className="h-px bg-white/5 my-4 mx-2"></div>
            <NavItem icon={MessageSquare} label="Pride AI" id="aichat" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
            <NavItem icon={Globe} label="Plaza" id="global" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
            <NavItem icon={Hash} label="Hubs" id="servers" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
            <div className="h-px bg-white/5 my-4 mx-2"></div>
            <NavItem icon={Settings} label="Settings" id="settings" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between px-8 bg-[#050505] border-b border-white/5 shrink-0">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Menu size={20} /></button>
            <div className="flex-1 max-w-xl mx-8 bg-[#0f0f0f] border border-white/5 rounded-full px-5 py-2 flex items-center">
              <Search size={16} className="text-gray-600" />
              <input type="text" placeholder="Explore Pride Prime..." className="bg-transparent border-none outline-none ml-3 w-full text-sm font-bold placeholder:text-gray-700" />
            </div>
            <div className="flex items-center space-x-4">
               <button onClick={() => setShowUpload(true)} className="p-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-500 rounded-xl border border-purple-500/20 transition-all"><Upload size={18}/></button>
               <div className="bg-[#0f0f0f] px-3 py-1.5 rounded-xl flex items-center space-x-2 border border-white/5 shadow-inner">
                  <PrideCoin size={14} />
                  <span className="text-[11px] font-black italic">{(currentUser.balance || 0).toLocaleString()} Ϸ</span>
               </div>
               <img src={currentUser.avatar} className="w-9 h-9 rounded-xl border border-white/10 cursor-pointer shadow-lg object-cover hover:scale-105 transition-transform" alt="p" onClick={() => setActiveTab('settings')} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#020202]">
            {activeTab === 'home' && <HomeGrid onVideoSelect={setSelectedVideo} userVideos={userVideos} />}
            {activeTab === 'reels' && <ReelsView />}
            {activeTab === 'aichat' && <PrideAiChat user={currentUser} setUser={setCurrentUser} />}
            {activeTab === 'global' && <GlobalPlaza user={currentUser} />}
            {activeTab === 'servers' && <ServersList user={currentUser} setUser={setCurrentUser} />}
            {activeTab === 'trending' && <TrendingGrid onVideoSelect={setSelectedVideo} />}
            {activeTab === 'settings' && <SettingsScreen user={currentUser} onUpdate={handleProfileUpdate} onLogout={() => { localStorage.removeItem('pp_user'); window.location.reload(); }} />}
          </main>
        </div>
      </div>
      {selectedVideo && <VideoOverlay video={selectedVideo} user={currentUser} setUser={setCurrentUser} onClose={() => setSelectedVideo(null)} />}
      {showUpload && <UploadModal user={currentUser} onClose={() => setShowUpload(false)} onUpload={handleUpload} />}
    </div>
  );
};

// Safety Wrapper to prevent Blackout on Vercel
const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure browser environment is stable
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div className="h-screen w-screen bg-[#050505] flex items-center justify-center"><div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return <PrideApp />;
};

const NavItem = ({ icon: Icon, label, id, active, setActive, open }: any) => (
  <button onClick={() => { setActive(id); localStorage.setItem('pp_tab', id); }} className={`flex items-center space-x-4 w-full p-4 rounded-2xl transition-all ${active === id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-[1.02]' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}>
    <Icon size={20} />
    {open && <span className="font-black text-[10px] uppercase tracking-widest italic">{label}</span>}
  </button>
);

// --- MODAL: VIDEO UPLOAD (YOUTUBE STYLE) ---
const UploadModal = ({ user, onClose, onUpload }: any) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [isUploading, setIsUploading] = useState(false);

  const startUpload = () => {
    if (!title) return alert("Title is required!");
    setIsUploading(true);
    setTimeout(() => {
      const newVid: Video = {
        id: Date.now().toString(),
        title: title,
        thumbnail: `https://picsum.photos/seed/${Math.random()}/800/450`,
        author: user.name,
        views: '0',
        timestamp: 'Just now',
        duration: '3:45',
        status: 'active',
        category
      };
      onUpload(newVid);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden shadow-3xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase italic">Create Prime Content</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="p-8 space-y-8">
          {isUploading ? (
            <div className="py-20 flex flex-col items-center space-y-6">
               <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="font-black uppercase italic text-xs animate-pulse">Publishing to Realm...</p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-6">
               <div className="aspect-video bg-black border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center space-y-4 hover:border-purple-600 transition-all cursor-pointer">
                  <ImageIcon size={32} className="text-gray-600" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Drop nodes or select file</p>
               </div>
               <input placeholder="VIDEO TITLE" className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold outline-none focus:border-purple-600 uppercase text-white" value={title} onChange={e => setTitle(e.target.value)} />
               <button onClick={() => setStep(2)} className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-[10px] shadow-xl text-white">CONTINUE</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <label className="text-[9px] font-black text-gray-500 uppercase mb-2 block italic">Studio Tools</label>
                    <div className="flex space-x-3 text-purple-500"><Palette size={18}/><Music size={18}/><Camera size={18}/></div>
                 </div>
                 <select className="w-full bg-black border border-white/5 rounded-2xl p-4 text-xs font-bold text-gray-400 uppercase" value={category} onChange={e => setCategory(e.target.value)}>
                    <option>Entertainment</option>
                    <option>Gaming</option>
                    <option>Education</option>
                    <option>Pride Tech</option>
                 </select>
              </div>
              <div className="space-y-4">
                 <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/5 relative shadow-inner">
                   <div className="absolute inset-0 bg-purple-600/5 flex items-center justify-center font-black text-[10px] uppercase text-gray-600 italic">Preview Render</div>
                 </div>
                 <button onClick={startUpload} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-2xl font-black uppercase text-[10px] shadow-xl text-white">PUBLISH</button>
                 <button onClick={() => setStep(1)} className="w-full py-4 border border-white/5 rounded-2xl font-black uppercase text-[10px] text-white">BACK</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- SETTINGS: PROFILE EDIT ---
const SettingsScreen = ({ user, onUpdate, onLogout }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedBio, setEditedBio] = useState(user.bio || 'Pride Prime Elite Citizen');
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedName(user.name);
    setEditedBio(user.bio || 'Pride Prime Elite Citizen');
    setCurrentAvatar(user.avatar);
  }, [user]);

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCurrentAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateNewAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`;
    setCurrentAvatar(newAvatar);
  };

  const save = () => {
    onUpdate({ 
      name: editedName, 
      bio: editedBio, 
      avatar: currentAvatar 
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="relative rounded-[60px] overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-3xl">
        <div className="h-48 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 relative">
           <button onClick={() => setIsEditing(!isEditing)} className={`absolute bottom-4 right-8 p-3 rounded-xl transition-all shadow-xl flex items-center space-x-2 ${isEditing ? 'bg-green-600 text-white' : 'bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black'}`}>
             {isEditing ? <><Check size={18}/> <span className="text-[10px] font-black uppercase">Finish</span></> : <><Edit3 size={18}/> <span className="text-[10px] font-black uppercase">Edit Profile</span></>}
           </button>
        </div>
        <div className="px-16 pb-16 -mt-16 flex flex-col md:flex-row items-end justify-between space-y-8 md:space-y-0">
           <div className="flex flex-col md:flex-row items-end space-y-6 md:space-y-0 md:space-x-10">
              <div className="relative group">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <img 
                  src={currentAvatar} 
                  className={`w-40 h-40 rounded-[48px] border-8 border-[#0a0a0a] shadow-2xl transition-all object-cover ${isEditing ? 'brightness-75 scale-105 ring-4 ring-purple-600/50' : ''}`} 
                  alt="Profile" 
                />
                {isEditing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-[48px] opacity-100 transition-opacity cursor-pointer text-white">
                    <button 
                      onClick={handleAvatarClick}
                      className="flex flex-col items-center justify-center p-2 hover:text-purple-400 transition-colors"
                    >
                      <UploadCloud size={32} />
                      <span className="text-[9px] font-black uppercase mt-1">Upload Photo</span>
                    </button>
                    <div className="h-px w-12 bg-white/20 my-2"></div>
                    <button 
                      onClick={generateNewAvatar}
                      className="flex flex-col items-center justify-center p-2 hover:text-pink-400 transition-colors"
                    >
                      <RefreshCw size={24} className="animate-spin-slow" />
                      <span className="text-[9px] font-black uppercase mt-1">Randomize</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="pb-4 flex-1">
                 {isEditing ? (
                   <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                     <div className="space-y-1">
                       <label className="text-[9px] font-black text-purple-500 uppercase ml-1">Display Name</label>
                       <input className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-2 font-black text-2xl uppercase italic outline-none text-white focus:border-purple-500 transition-colors" value={editedName} onChange={e => setEditedName(e.target.value)} />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[9px] font-black text-purple-500 uppercase ml-1">Bio / Status</label>
                       <input className="bg-white/5 border border-purple-500/30 rounded-xl px-4 py-2 font-bold text-xs uppercase block w-full outline-none text-gray-300 focus:border-purple-500 transition-colors" value={editedBio} onChange={e => setEditedBio(e.target.value)} />
                     </div>
                     <button onClick={save} className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all active:scale-95 text-white">Save Profile</button>
                   </div>
                 ) : (
                   <div className="animate-in fade-in duration-500">
                     <h2 className="text-4xl font-black italic uppercase tracking-tighter">{user.name}</h2>
                     <p className="text-[11px] text-purple-500 font-black uppercase tracking-[0.3em] mt-2 italic">{user.country?.toUpperCase() || 'PRIDE'} REALM CITIZEN</p>
                     <p className="text-gray-500 font-bold text-xs mt-4 uppercase italic tracking-wide">{user.bio || 'Pride Prime Elite Citizen'}</p>
                   </div>
                 )}
              </div>
           </div>
           {!isEditing && (
             <button onClick={onLogout} className="bg-red-600/10 text-red-500 border border-red-500/20 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg">Terminate Access</button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-[#080808] p-10 rounded-[48px] border border-white/5 shadow-3xl">
           <h3 className="text-xs font-black uppercase mb-6 italic text-green-500 flex items-center tracking-widest"><PrideCoin size={14} className="mr-3 shadow-none"/> ASSETS</h3>
           <p className="text-5xl font-black italic tracking-tighter">{(user.balance || 0).toLocaleString()} Ϸ</p>
           <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-gray-600 uppercase">Engagement Log</p>
                 <p className="text-xs font-bold italic text-white">{Math.floor((user.totalOnlineTime || 0) / 3600)}h {Math.floor(((user.totalOnlineTime || 0) % 3600) / 60)}m</p>
              </div>
              <button className="bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-[9px] shadow-xl hover:scale-105 transition-transform">Top Up</button>
           </div>
        </div>
        <div className="bg-[#080808] p-10 rounded-[48px] border border-white/5 flex flex-col items-center justify-center text-center shadow-3xl">
           <Shield size={40} className="text-purple-500 mb-6" />
           <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 italic">Safety Matrix</p>
           <p className="text-[9px] text-gray-500 font-bold uppercase italic max-w-[200px]">Node monitoring active. Rule violations lead to permanent node freeze.</p>
        </div>
      </div>
    </div>
  );
};

// --- GLOBAL PLAZA ---
const GlobalPlaza = ({user}: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { setMessages(JSON.parse(localStorage.getItem(`pp_msgs_${user.country}`) || '[]')); } catch { setMessages([]); }
  }, [user.country]);

  useEffect(() => {
    localStorage.setItem(`pp_msgs_${user.country}`, JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, user.country]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = { id: Date.now().toString(), sender: user.name, content: input, timestamp: new Date().toLocaleTimeString(), avatar: user.avatar };
    setMessages([...messages, msg]);
    setInput('');
  };

  return (
    <div className="h-full bg-[#050505] rounded-[48px] border border-white/5 overflow-hidden flex flex-col shadow-3xl">
      <div className="p-8 bg-[#080808] border-b border-white/5 flex items-center justify-between shrink-0">
        <div>
           <h2 className="text-sm font-black italic uppercase tracking-[0.3em] flex items-center text-white">
             <Globe size={18} className="mr-4 text-purple-500" /> {user.country?.toUpperCase() || 'GLOBAL'} PLAZA
           </h2>
           <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Regional Citizen Feed</p>
        </div>
        <div className="flex items-center space-x-3 bg-green-500/5 px-4 py-2 rounded-2xl border border-green-500/10">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[9px] font-black text-green-500 uppercase">Live Transmission</span>
        </div>
      </div>
      <div className="flex-1 p-10 overflow-y-auto space-y-6 no-scrollbar bg-[#020202]">
        {messages.map(m => (
          <div key={m.id} className="flex items-start space-x-4 animate-in slide-in-from-bottom-2">
            <img src={m.avatar} className="w-10 h-10 rounded-2xl border border-white/5 shadow-md object-cover" alt="a" />
            <div className="flex-1">
               <div className="flex items-baseline space-x-3">
                  <span className="text-xs font-black text-purple-400 uppercase italic">{m.sender}</span>
                  <span className="text-[9px] text-gray-600 uppercase font-bold">{m.timestamp}</span>
               </div>
               <p className="text-sm font-bold text-gray-300 mt-2 leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center opacity-20 flex-col space-y-4">
             <Globe size={48} />
             <p className="text-[10px] font-black uppercase tracking-widest italic">Broadcast the first message to the realm</p>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="p-8 bg-[#080808] border-t border-white/5 flex items-center space-x-4">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Communicate with citizens..." className="flex-1 bg-black border border-white/5 rounded-3xl py-4 px-8 text-sm font-bold outline-none focus:border-purple-600 transition-all text-white" />
        <button onClick={handleSend} className="p-4 bg-purple-600 rounded-2xl shadow-xl active:scale-95 text-white transition-all hover:brightness-110"><Send size={20} /></button>
      </div>
    </div>
  );
};

// --- GRID: HOME ---
const HomeGrid = ({ onVideoSelect, userVideos }: any) => {
  const allVideos = [...userVideos, ...MOCK_VIDEOS];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {allVideos.map(v => (
        <div key={v.id} onClick={() => onVideoSelect(v)} className="group cursor-pointer">
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 bg-[#0f0f0f] border border-white/5 shadow-2xl group-hover:scale-[1.02] transition-all">
            <img src={v.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt="v" />
            <div className="absolute bottom-3 right-3 bg-black/80 px-3 py-1.5 rounded-xl text-[10px] font-black border border-white/5 text-white">{v.duration}</div>
            {v.isAd && <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1.5 rounded-xl text-[9px] font-black uppercase italic shadow-xl">PROMOTED</div>}
          </div>
          <h3 className="text-sm font-black uppercase italic truncate group-hover:text-purple-500 transition-colors tracking-tight text-white">{v.title}</h3>
          <p className="text-[11px] text-gray-600 mt-2 uppercase italic font-bold">{v.author} • {v.views} VIEWS</p>
        </div>
      ))}
    </div>
  );
};

// --- REELS ---
const ReelsView = () => (
  <div className="flex flex-col items-center space-y-16 pb-40 no-scrollbar">
    {MOCK_REELS.map((url, i) => (
      <div key={i} className="h-[80vh] w-full max-w-[380px] bg-[#0f0f0f] rounded-[56px] relative overflow-hidden shadow-3xl border border-white/5 group">
        <img src={url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="reel" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 right-6 flex flex-col space-y-8">
          <button className="p-5 bg-white/10 backdrop-blur-xl rounded-[24px] hover:bg-red-600 transition-all border border-white/10 shadow-2xl text-white"><Heart size={22} /></button>
          <button className="p-5 bg-purple-600 rounded-[24px] shadow-2xl border border-purple-400/20 text-white hover:scale-110 transition-transform"><PrideCoin size={22} /></button>
          <button className="p-5 bg-white/10 backdrop-blur-xl rounded-[24px] hover:bg-white/20 transition-all border border-white/10 shadow-2xl text-white"><Share2 size={22} /></button>
        </div>
        <div className="absolute bottom-10 left-8">
          <p className="font-black text-sm italic tracking-[0.2em] uppercase text-white shadow-md">@PRIME_CREATOR_{i}</p>
          <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest italic">Pride Prime Reels: Peak Creativity. #AI #Prime</p>
        </div>
      </div>
    ))}
  </div>
);

// --- AI CHAT ---
const PrideAiChat = ({user, setUser}: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const hasSub = user.aiSubscriptionUntil && user.aiSubscriptionUntil > Date.now();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buySub = () => {
    if ((user.balance || 0) < 200) { alert("200 Ϸ required!"); return; }
    const expiry = Date.now() + (3 * 24 * 60 * 60 * 1000); 
    setUser({ ...user, balance: user.balance - 200, aiSubscriptionUntil: expiry });
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || !hasSub) return;
    const text = input; setInput('');
    const umsg = { id: Date.now().toString(), sender: user.name, content: text, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, umsg]);
    setIsTyping(true);
    const reply = await getPrideAiResponse(text);
    const aimsg = { id: (Date.now() + 1).toString(), sender: 'Pride AI', content: reply, timestamp: new Date().toLocaleTimeString(), isAi: true };
    setMessages(prev => [...prev, aimsg]);
    setIsTyping(false);
  };

  if (!hasSub) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#050505] rounded-[48px] border border-white/5 shadow-3xl">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mb-10 shadow-2xl animate-bounce"><Sparkles size={48} className="text-white" /></div>
        <h2 className="text-4xl font-black italic uppercase mb-4 tracking-tighter text-white">Pride AI</h2>
        <p className="text-gray-500 font-bold uppercase text-[11px] tracking-[0.3em] max-w-md mb-12 italic leading-relaxed">Unlock your private companion created by the Pride Prime Team. 200 Ϸ for 3 solar cycles.</p>
        <button onClick={buySub} className="bg-gradient-to-r from-purple-600 to-pink-600 px-16 py-6 rounded-[30px] font-black uppercase text-sm tracking-[0.25em] shadow-2xl hover:scale-105 transition-all flex items-center space-x-4 text-white"><PrideCoin size={22} /> <span>AUTHORIZE 200 Ϸ</span></button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#050505] rounded-[48px] overflow-hidden border border-white/5 shadow-3xl">
      <div className="p-8 bg-[#080808] border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4"><div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-black text-sm text-white">AI</div><div><h2 className="text-sm font-black italic uppercase tracking-widest text-white">Pride AI Companion</h2><p className="text-[9px] text-green-500 font-black uppercase tracking-[0.2em] italic">Neural Link: Active</p></div></div>
        <div className="flex items-center space-x-6"><div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 text-gray-400"><Clock size={14} className="text-purple-500" /><span className="text-[10px] font-black uppercase italic">{Math.ceil((user.aiSubscriptionUntil! - Date.now()) / (1000 * 60 * 60 * 24))} Cycles Left</span></div><button onClick={() => setMessages([])} className="p-2.5 text-gray-600 hover:text-red-500 transition-all"><Trash2 size={20} /></button></div>
      </div>
      <div className="flex-1 overflow-y-auto p-10 space-y-6 no-scrollbar bg-[#020202]">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.isAi ? 'justify-start' : 'justify-end'}`}><div className={`max-w-[80%] p-5 rounded-[28px] border ${m.isAi ? 'bg-[#0a0a0a] border-white/5 rounded-tl-none shadow-xl' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500 rounded-tr-none shadow-2xl'}`}><p className="text-sm font-bold leading-relaxed tracking-wide text-white">{m.content}</p></div></div>
        ))}
        {isTyping && <div className="flex items-center space-x-3 animate-pulse px-2"><Activity size={16} className="text-purple-500" /><p className="text-[11px] font-black uppercase text-purple-500 italic tracking-[0.25em]">Neural Processing...</p></div>}
        <div ref={endRef} />
      </div>
      <div className="p-8 bg-[#080808] border-t border-white/5 flex items-center space-x-4 shrink-0">
        <input value={input} disabled={isTyping} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Communicate with AI..." className="flex-1 bg-black border border-white/5 rounded-[24px] py-5 px-8 text-sm font-bold text-white outline-none focus:border-purple-600 transition-colors" />
        <button disabled={isTyping || !input.trim()} onClick={handleSend} className="p-5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl active:scale-95 text-white transition-all"><Send size={22} /></button>
      </div>
    </div>
  );
};

// --- SERVERS ---
const ServersList = ({user, setUser}: any) => {
  const [isCreating, setIsCreating] = useState(false);
  const [hubs, setHubs] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('pp_hubs') || '[]'); } catch { return []; }
  });
  const [name, setName] = useState('');

  const create = () => {
    if (!name.trim()) return;
    if (user.balance < 5000) return alert("5000 Ϸ required!");
    const hub = { id: Date.now().toString(), name: name, icon: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`, owner: user.name, members: 1 };
    const newHubs = [...hubs, hub];
    setHubs(newHubs);
    localStorage.setItem('pp_hubs', JSON.stringify(newHubs));
    setUser({...user, balance: user.balance - 5000});
    setIsCreating(false);
    setName('');
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div><h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Community Hubs</h2><p className="text-[10px] text-gray-500 font-bold uppercase italic mt-1">Authorized Professional Networks</p></div>
        <button onClick={() => setIsCreating(true)} className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-[20px] font-black text-xs uppercase shadow-2xl active:scale-95 text-white">FOUND HUB (5000 Ϸ)</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {hubs.map(h => (
          <div key={h.id} className="p-10 bg-[#080808] border border-white/5 rounded-[48px] shadow-2xl group flex flex-col relative overflow-hidden transition-all hover:border-purple-500/30">
             <img src={h.icon} className="w-20 h-20 rounded-[30px] mb-8 shadow-2xl border border-white/5 group-hover:scale-110 transition-transform" alt="h" />
             <h3 className="text-2xl font-black italic uppercase tracking-tight mb-3 text-white">{h.name}</h3>
             <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                <span className="text-xs font-black text-purple-500 uppercase">{h.members} Citizens</span>
                <button className="px-7 py-3 bg-white text-black font-black rounded-2xl text-[10px] uppercase shadow-xl hover:bg-purple-600 hover:text-white transition-all">ENTER</button>
             </div>
          </div>
        ))}
      </div>
      {isCreating && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl animate-in zoom-in duration-200">
           <div className="w-full max-w-xl bg-[#0a0a0a] border border-white/10 p-12 rounded-[56px] shadow-3xl text-white">
              <div className="flex justify-between items-center mb-10"><h3 className="text-2xl font-black italic uppercase tracking-tighter">Foundation Charter</h3><button onClick={() => setIsCreating(false)}><X size={28}/></button></div>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="HUB NAME" className="w-full bg-black border border-white/5 rounded-[24px] py-5 px-8 text-sm font-bold uppercase outline-none focus:border-purple-600 text-white" />
              <button onClick={create} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-6 rounded-[28px] font-black uppercase text-sm mt-8 shadow-2xl text-white active:scale-95 transition-all">AUTHORIZE</button>
           </div>
        </div>
      )}
    </div>
  );
};

const TrendingGrid = ({ onVideoSelect }: any) => (
  <div className="space-y-12">
    <div className="flex items-center space-x-6 bg-purple-600/10 p-10 rounded-[40px] border border-white/5 shadow-inner">
       <TrendingUp size={40} className="text-purple-500 animate-pulse"/>
       <div><h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Prime Pulse</h2><p className="text-[10px] text-purple-500 font-black uppercase tracking-widest mt-1">Trending Globally</p></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {MOCK_VIDEOS.map(v => (
        <div key={v.id} onClick={() => onVideoSelect(v)} className="flex items-center space-x-8 p-8 bg-[#0a0a0a] border border-white/5 rounded-[40px] cursor-pointer hover:bg-white/5 transition-all shadow-xl group">
          <img src={v.thumbnail} className="w-48 aspect-video rounded-2xl object-cover shrink-0 shadow-xl group-hover:scale-105 transition-transform" alt="t" />
          <div className="min-w-0">
             <h4 className="text-base font-black truncate uppercase italic mb-3 tracking-tight group-hover:text-purple-500 text-white transition-colors">{v.title}</h4>
             <p className="text-[11px] text-gray-500 font-bold italic uppercase tracking-widest">{v.views} VIEWS • {v.timestamp.toUpperCase()}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const VideoOverlay = ({ video, user, setUser, onClose }: any) => {
  const handleSuperChat = () => {
     if ((user.balance || 0) < 50) return alert("50 Ϸ required!");
     setUser({ ...user, balance: user.balance - 50 }); alert("SUPER CHAT AUTHORIZED! Legacy support active. 🎉");
  };
  return (
    <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-6 animate-in fade-in duration-500 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-7xl h-[90vh] bg-[#080808] rounded-[64px] overflow-hidden flex flex-col lg:flex-row border border-white/10 shadow-3xl relative">
        <div className="flex-[3] bg-black flex items-center justify-center relative shadow-inner overflow-hidden">
          {video.status === 'frozen' ? (
            <div className="absolute inset-0 bg-red-950/40 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-16 z-50 animate-in zoom-in-110 text-white"><Shield size={48} className="text-red-500 mb-6" /><h2 className="text-4xl font-black uppercase italic mb-6 tracking-tighter text-red-500">NODE FROZEN</h2><p className="text-gray-400 font-black uppercase text-xs tracking-[0.3em] max-w-md mb-12 leading-relaxed italic">Pride AI logic detects violation. Purged from realm.</p></div>
          ) : (
            <>
              <img src={video.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-3xl scale-125" alt="bg" />
              <div className="relative z-10 w-24 h-24 rounded-[40px] bg-white/5 backdrop-blur-2xl flex items-center justify-center border border-white/20 animate-pulse shadow-3xl text-white"><Play size={36} className="fill-white ml-2" /></div>
            </>
          )}
        </div>
        <div className="flex-1 p-12 bg-[#0a0a0a] border-l border-white/5 flex flex-col relative overflow-y-auto no-scrollbar min-w-[380px] shadow-3xl">
          <button onClick={onClose} className="self-end mb-8 p-3 bg-white/5 rounded-2xl hover:bg-red-600 transition-all text-white hover:rotate-90"><X size={24}/></button>
          <h2 className="text-3xl font-black uppercase italic mb-10 leading-tight tracking-tighter text-white">{video.title}</h2>
          <div className="flex items-center space-x-5 mb-10 pb-10 border-b border-white/5"><div className="w-16 h-16 rounded-[28px] bg-gradient-to-br from-purple-600 to-pink-600 border border-white/10 shrink-0 shadow-2xl flex items-center justify-center font-black italic text-xl uppercase text-white">{video.author[0]}</div><div><p className="font-black text-lg uppercase italic tracking-tighter text-white">@{video.author}</p><p className="text-[10px] text-purple-500 font-black uppercase italic tracking-[0.4em] mt-1.5">Elite Verified Partner</p></div></div>
          <div className="flex-1 space-y-8"><div className="flex space-x-5"><button className="flex-1 p-6 bg-white/5 border border-white/5 rounded-3xl flex flex-col items-center justify-center space-y-3 hover:bg-white/10 transition-all shadow-xl group/act text-white"><ThumbsUp size={24} className="group-hover/act:text-purple-500 transition-colors" /><span className="text-[10px] font-black uppercase italic tracking-widest">Endorse</span></button><button className="flex-1 p-6 bg-white/5 border border-white/5 rounded-3xl flex flex-col items-center justify-center space-y-3 hover:bg-white/10 transition-all shadow-xl group/act text-white"><Share2 size={24} className="group-hover/act:text-purple-500 transition-colors" /><span className="text-[10px] font-black uppercase italic tracking-widest">Relay</span></button></div><button onClick={handleSuperChat} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 py-7 rounded-[36px] font-black uppercase text-xs tracking-[0.5em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-4 italic text-white"><PrideCoin size={24} /><span>SUPER TRANSMIT (50 Ϸ)</span></button></div>
        </div>
      </div>
    </div>
  );
};

export default App;
