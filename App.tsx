
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Play, TrendingUp, Settings, MessageSquare, 
  Shield, Send, Users, DollarSign, Heart, Hash, 
  Search, Menu, X, Trash2, ThumbsUp, Share2, Plus, Activity, Globe, ArrowLeft, Coins, Clock, Sparkles, LogIn, UserPlus, Zap, Camera, Music, Palette, Image as ImageIcon, Upload, Edit3, Check, RefreshCw, UploadCloud
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MOCK_VIDEOS, MOCK_REELS } from './constants';

// --- PRIDE COIN COMPONENT ---
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

// --- MAIN APP LOGIC ---
// Fixed component name from PrideApp to App to match export and fix line 286 error
const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  // Prevention of SSR issues
  useEffect(() => {
    setMounted(true);
    try {
      const savedUser = localStorage.getItem('pp_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      const savedVideos = localStorage.getItem('pp_user_videos');
      if (savedVideos) setUserVideos(JSON.parse(savedVideos));
      const savedTab = localStorage.getItem('pp_tab');
      if (savedTab) setActiveTab(savedTab);
    } catch (e) {
      console.error("Local storage init failed", e);
    }
  }, []);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('pp_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('pp_user');
    setCurrentUser(null);
    window.location.reload();
  };

  const handleProfileUpdate = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updated };
    setCurrentUser(newUser);
    localStorage.setItem('pp_user', JSON.stringify(newUser));
  };

  if (!mounted) return null;

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#020202] text-white font-['Outfit'] select-none">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[#070707] border-r border-white/5 flex flex-col shrink-0`}>
          <div className="p-6 flex items-center space-x-3">
            <div className="bg-purple-600 p-2.5 rounded-xl font-black italic shrink-0 shadow-lg">PP</div>
            {isSidebarOpen && <span className="font-black tracking-tighter italic text-lg">PRIDE<span className="text-purple-500">PRIME</span></span>}
          </div>
          <nav className="flex-1 px-3 space-y-1 pt-4">
            <NavItem icon={Home} label="Home" id="home" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
            <NavItem icon={Play} label="Shorts" id="reels" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
            <NavItem icon={TrendingUp} label="Trending" id="trending" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
            <div className="h-px bg-white/5 my-4 mx-2"></div>
            <NavItem icon={Globe} label="Plaza" id="global" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
            <NavItem icon={Settings} label="Settings" id="settings" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
          </nav>
        </aside>

        {/* Main Section */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between px-8 bg-[#050505] border-b border-white/5">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg"><Menu size={20} /></button>
            <div className="flex-1 max-w-xl mx-8 bg-[#0f0f0f] border border-white/5 rounded-full px-5 py-2 flex items-center">
              <Search size={16} className="text-gray-600" />
              <input type="text" placeholder="Explore Pride Prime..." className="bg-transparent border-none outline-none ml-3 w-full text-sm font-bold" />
            </div>
            <div className="flex items-center space-x-4">
               <button onClick={() => setShowUpload(true)} className="p-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-500 rounded-xl"><Upload size={18}/></button>
               <div className="bg-[#0f0f0f] px-3 py-1.5 rounded-xl flex items-center space-x-2 border border-white/5">
                  <PrideCoin size={14} />
                  <span className="text-[11px] font-black italic">{currentUser.balance.toLocaleString()} Ϸ</span>
               </div>
               <img src={currentUser.avatar} className="w-9 h-9 rounded-xl border border-white/10 cursor-pointer object-cover" onClick={() => setActiveTab('settings')} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8 bg-[#020202]">
            {activeTab === 'home' && <HomeGrid onVideoSelect={setSelectedVideo} userVideos={userVideos} />}
            {activeTab === 'reels' && <ReelsView />}
            {activeTab === 'global' && <GlobalPlaza user={currentUser} />}
            {activeTab === 'settings' && <SettingsScreen user={currentUser} onUpdate={handleProfileUpdate} onLogout={handleLogout} />}
          </main>
        </div>
      </div>

      {showUpload && <UploadModal user={currentUser} onClose={() => setShowUpload(false)} onUpload={(v) => {
        const updated = [v, ...userVideos];
        setUserVideos(updated);
        localStorage.setItem('pp_user_videos', JSON.stringify(updated));
      }} />}
      
      {selectedVideo && <VideoOverlay video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
};

const NavItem = ({ icon: Icon, label, id, active, setActive, open }: any) => (
  <button onClick={() => { setActive(id); localStorage.setItem('pp_tab', id); }} className={`flex items-center space-x-4 w-full p-4 rounded-2xl transition-all ${active === id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}>
    <Icon size={20} />
    {open && <span className="font-black text-[10px] uppercase tracking-widest italic">{label}</span>}
  </button>
);

const AuthScreen = ({ onLogin }: any) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name, email, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      balance: 1000, aiSubscriptionUntil: null, totalOnlineTime: 0, country: 'India'
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
      <form onSubmit={submit} className="w-full max-w-md bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-4">
        <h2 className="text-3xl font-black italic text-center text-purple-500 mb-8">PRIDE PRIME</h2>
        <input required placeholder="Name" className="w-full bg-black border border-white/5 rounded-2xl p-4" onChange={e => setName(e.target.value)} />
        <input required type="email" placeholder="Email" className="w-full bg-black border border-white/5 rounded-2xl p-4" onChange={e => setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" className="w-full bg-black border border-white/5 rounded-2xl p-4" onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-white shadow-xl">Enter</button>
      </form>
    </div>
  );
};

const HomeGrid = ({ onVideoSelect, userVideos }: any) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...userVideos, ...MOCK_VIDEOS].map(v => (
      <div key={v.id} onClick={() => onVideoSelect(v)} className="cursor-pointer group">
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-white/5">
          <img src={v.thumbnail} className="w-full h-full object-cover" />
        </div>
        <h4 className="font-bold text-white text-sm truncate uppercase italic">{v.title}</h4>
        <p className="text-[10px] text-gray-500 uppercase">{v.author} • {v.views} views</p>
      </div>
    ))}
  </div>
);

const ReelsView = () => (
  <div className="flex flex-col items-center space-y-10 pb-20">
    {MOCK_REELS.map((url, i) => (
      <div key={i} className="h-[70vh] aspect-[9/16] bg-[#0a0a0a] rounded-[40px] overflow-hidden border border-white/5">
        <img src={url} className="w-full h-full object-cover" />
      </div>
    ))}
  </div>
);

const GlobalPlaza = ({ user }: any) => {
  const [msg, setMsg] = useState('');
  return (
    <div className="h-[75vh] bg-[#080808] rounded-[40px] border border-white/5 flex flex-col">
       <div className="p-6 border-b border-white/5 font-black uppercase text-xs italic">Global Plaza</div>
       <div className="flex-1 p-6 text-gray-500 text-sm italic text-center flex items-center justify-center">Broadcasting is live...</div>
       <div className="p-6 border-t border-white/5 flex space-x-4">
         <input className="flex-1 bg-black rounded-2xl px-6 py-3 border border-white/5" placeholder="Say something..." />
         <button className="bg-purple-600 p-3 rounded-2xl"><Send size={18}/></button>
       </div>
    </div>
  );
};

const SettingsScreen = ({ user, onUpdate, onLogout }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
          <img src={user.avatar} className="w-32 h-32 rounded-[32px] border-4 border-purple-600 object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-[32px]"><Camera size={24}/></div>
          <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if(f) {
              const reader = new FileReader();
              reader.onload = () => onUpdate({ avatar: reader.result as string });
              reader.readAsDataURL(f);
            }
          }} />
        </div>
        <h2 className="text-2xl font-black italic uppercase">{user.name}</h2>
        <button onClick={onLogout} className="bg-red-600/20 text-red-500 px-6 py-2 rounded-xl border border-red-500/30 text-xs font-black uppercase">Logout</button>
      </div>
    </div>
  );
};

const UploadModal = ({ onClose, onUpload, user }: any) => {
  const [t, setT] = useState('');
  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center">
      <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/10 w-full max-w-md space-y-6">
        <h3 className="text-xl font-black uppercase italic">New Content</h3>
        <input className="w-full bg-black border border-white/5 p-4 rounded-2xl" placeholder="Title" value={t} onChange={e => setT(e.target.value)} />
        <button className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase" onClick={() => {
          onUpload({ id: Date.now().toString(), title: t, author: user.name, thumbnail: 'https://picsum.photos/800/450', views: '0', timestamp: 'Now', duration: '1:00', status: 'active' });
          onClose();
        }}>Upload</button>
        <button className="w-full text-gray-500 text-xs uppercase" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const VideoOverlay = ({ video, onClose }: any) => (
  <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center p-6">
    <div className="w-full max-w-5xl aspect-video bg-[#0a0a0a] rounded-[40px] relative overflow-hidden flex flex-col">
       <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-black/50 rounded-full"><X/></button>
       <div className="flex-1 flex items-center justify-center bg-black">
          <Play size={64} className="text-white opacity-20"/>
       </div>
       <div className="p-10 bg-[#080808] border-t border-white/5">
          <h2 className="text-2xl font-black uppercase italic">{video.title}</h2>
          <p className="text-gray-500">@{video.author}</p>
       </div>
    </div>
  </div>
);

export default App;
