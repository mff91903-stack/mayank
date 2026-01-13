
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Play, TrendingUp, Settings, MessageSquare, 
  Shield, Send, Users, DollarSign, Heart, Hash, 
  Search, Menu, X, VolumeX, Speaker, Headset, 
  Mic, History, Trash2, ThumbsUp, Share2, Plus, Zap, Activity
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MOCK_VIDEOS } from './constants';

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
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAi?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  balance: number;
}

// --- AI SERVICE ---
const getPrideAiResponse = async (userMessage: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are 'Pride AI'.
        - LANGUAGE MATCHING: Respond exactly in the user's language (Hindi/Hinglish/English).
        - CONCISE: Max 2 sharp sentences. 
        - FRIENDSHIP: Be a true human friend (Dost).
        - IDENTITY: Soul of Pride Prime.`,
      }
    });
    return response.text || "Main sun raha hoon dost.";
  } catch (error: any) {
    return "Net issue hai dost, par main yahin hoon!";
  }
};

// --- AUTH COMPONENT ---
const AuthScreen = ({ onLogin }: { onLogin: (user: UserProfile) => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ 
      name: name || email.split('@')[0], 
      email, 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, 
      balance: 10.50 
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#000] p-6">
      <div className="w-full max-w-md bg-[#080808] border border-white/5 p-12 rounded-[48px] shadow-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-[20px] mx-auto mb-8 flex items-center justify-center font-black italic text-4xl shadow-2xl">PP</div>
        <h1 className="text-3xl font-black text-center mb-10 uppercase tracking-tighter">PRIDE<span className="text-purple-500">PRIME</span></h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && <input required type="text" placeholder="NAME" className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-xs outline-none focus:border-purple-500 font-bold uppercase" value={name} onChange={(e) => setName(e.target.value)} />}
          <input required type="email" placeholder="EMAIL" className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-xs outline-none focus:border-purple-500 font-bold uppercase" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required type="password" placeholder="PASSWORD" className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-xs outline-none focus:border-purple-500 font-bold uppercase" />
          <button type="submit" className="w-full bg-purple-600 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">CONTINUE</button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-8 w-full text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          {isSignUp ? 'ALREADY A MEMBER? LOGIN' : 'NEW USER? SIGN UP'}
        </button>
      </div>
    </div>
  );
};

// --- NAVIGATION ITEM ---
const NavItem = ({ icon: Icon, label, id, active, setActive, open }: any) => (
  <button onClick={() => setActive(id)} className={`flex items-center space-x-5 w-full p-4 rounded-2xl transition-all group ${active === id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl' : 'hover:bg-white/5 text-gray-600 hover:text-white'}`}>
    <Icon size={20} className={active === id ? 'animate-pulse' : 'group-hover:scale-110'} />
    {open && <span className="font-black text-[11px] uppercase tracking-[0.2em] italic">{label}</span>}
  </button>
);

// --- MAIN APP ---
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('pp_tab') || 'home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => JSON.parse(localStorage.getItem('pp_side') || 'true'));
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pp_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    localStorage.setItem('pp_tab', activeTab);
    localStorage.setItem('pp_side', JSON.stringify(isSidebarOpen));
    if (currentUser) localStorage.setItem('pp_user', JSON.stringify(currentUser));
  }, [activeTab, isSidebarOpen, currentUser]);

  if (!currentUser) return <AuthScreen onLogin={setCurrentUser} />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#020202] text-white font-['Outfit'] select-none">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-500 bg-[#070707] border-r border-white/5 flex flex-col z-30 shadow-2xl shrink-0`}>
        <div className="p-6 flex items-center justify-between">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-xl shadow-lg shrink-0">
            <span className="font-black italic text-xl">PP</span>
          </div>
          {isSidebarOpen && <h1 className="text-lg font-black tracking-tighter ml-3">PRIDE<span className="text-purple-500">PRIME</span></h1>}
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-4 no-scrollbar">
          <NavItem icon={Home} label="Home" id="home" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
          <NavItem icon={Play} label="Shorts" id="reels" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
          <NavItem icon={TrendingUp} label="Trending" id="trending" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
          <div className="h-px bg-white/5 my-6 mx-2"></div>
          <NavItem icon={MessageSquare} label="Pride AI" id="aichat" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
          <NavItem icon={Users} label="Global Plaza" id="global" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
          <NavItem icon={Hash} label="Hubs" id="servers" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
          <div className="h-px bg-white/5 my-6 mx-2"></div>
          <NavItem icon={Settings} label="Settings" id="settings" active={activeTab} setActive={setActiveTab} open={isSidebarOpen} />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#020202]">
        <header className="h-16 flex items-center justify-between px-8 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/5 z-20 shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-full mr-4 lg:hidden"><Menu size={20} /></button>
          <div className="flex-1 max-w-2xl bg-[#0f0f0f] border border-white/5 rounded-full px-6 py-2 flex items-center">
            <Search size={16} className="text-gray-600" />
            <input type="text" placeholder="Search Pride Prime..." className="bg-transparent border-none outline-none ml-3 w-full text-sm" />
          </div>
          <div className="flex items-center ml-4 cursor-pointer" onClick={() => setActiveTab('settings')}>
            <img src={currentUser.avatar} className="w-10 h-10 rounded-2xl border border-white/10 shadow-xl" alt="profile" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative no-scrollbar">
          {activeTab === 'home' && <div className="p-8"><HomeGrid onVideoSelect={setSelectedVideo} /></div>}
          {activeTab === 'reels' && <div className="p-8"><ReelsView /></div>}
          {activeTab === 'aichat' && <PrideAiChatInterface />}
          {activeTab === 'global' && <div className="p-8 h-full"><GlobalPlazaInterface /></div>}
          {activeTab === 'servers' && <div className="p-8"><ServersList /></div>}
          {activeTab === 'settings' && <div className="p-8"><SettingsScreen user={currentUser} onLogout={() => setCurrentUser(null)} /></div>}
          {activeTab === 'trending' && <div className="p-8"><TrendingGrid onVideoSelect={setSelectedVideo} /></div>}
        </div>
      </main>

      {selectedVideo && <VideoOverlay video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
};

// --- CHAT INTERFACE ---
const PrideAiChatInterface: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => JSON.parse(localStorage.getItem('pp_ai_sessions') || '[]'));
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(localStorage.getItem('pp_ai_current_session'));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession ? currentSession.messages : [];

  useEffect(() => {
    localStorage.setItem('pp_ai_sessions', JSON.stringify(sessions));
    if (currentSessionId) localStorage.setItem('pp_ai_current_session', currentSessionId);
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, currentSessionId]);

  const speak = (text: string) => {
    if (!isVoiceMode) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    let sid = currentSessionId;
    let upSessions = [...sessions];
    if (!sid) {
      const news = { id: Date.now().toString(), title: text.slice(0, 20), messages: [], lastUpdated: Date.now() };
      upSessions = [news, ...sessions];
      sid = news.id;
      setCurrentSessionId(sid);
    }

    const umsg = { id: Date.now().toString(), sender: 'Me', content: text, timestamp: new Date().toLocaleTimeString() };
    const idx = upSessions.findIndex(s => s.id === sid);
    upSessions[idx].messages.push(umsg);
    setSessions([...upSessions]);
    setIsTyping(true);

    const reply = await getPrideAiResponse(text);
    const aimsg = { id: (Date.now() + 1).toString(), sender: 'Pride AI', content: reply, timestamp: new Date().toLocaleTimeString(), isAi: true };
    upSessions[idx].messages.push(aimsg);
    setSessions([...upSessions]);
    setIsTyping(false);
    
    if (isVoiceMode) speak(reply);
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] rounded-[40px] overflow-hidden m-4 border border-white/5 relative">
      {isVoiceMode && (
        <div className="absolute inset-0 z-50 bg-black/98 flex flex-col items-center justify-center p-12">
          <button onClick={() => { setIsVoiceMode(false); window.speechSynthesis.cancel(); }} className="absolute top-8 right-8 text-gray-400 hover:text-white"><X size={32} /></button>
          <div className="w-48 h-48 rounded-full bg-purple-600/20 border-2 border-purple-500/30 flex items-center justify-center animate-pulse mb-8">
            <Activity size={64} className="text-purple-500" />
          </div>
          <h2 className="text-3xl font-black italic mb-12">{isSpeaking ? 'Pride is Speaking...' : 'Voice Active'}</h2>
          <button onClick={() => speak("Hello dost, main sun raha hoon.")} className="p-10 bg-purple-600 rounded-full shadow-2xl"><Mic size={48} /></button>
        </div>
      )}

      <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-black">AI</div>
          <h2 className="text-xl font-black italic">PRIDE AI</h2>
        </div>
        <button onClick={() => setIsVoiceMode(true)} className="px-6 py-2 bg-purple-600 rounded-full font-black text-[10px] uppercase flex items-center space-x-2">
          <Headset size={14} /> <span>Voice Mode</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-[#020202]">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.isAi ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-6 rounded-[32px] border ${m.isAi ? 'bg-[#0a0a0a] border-white/5 rounded-tl-none' : 'bg-purple-600 border-purple-500 rounded-tr-none'}`}>
              <p className="text-sm font-bold leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-8 border-t border-white/5 bg-[#0a0a0a] flex items-center space-x-4 shrink-0">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && (handleSend(input), setInput(''))}
          placeholder="Dost se baat karo..." 
          className="flex-1 bg-black border border-white/5 rounded-3xl py-4 px-8 text-sm outline-none" 
        />
        <button onClick={() => (handleSend(input), setInput(''))} className="p-4 bg-purple-600 rounded-2xl"><Send size={20} /></button>
      </div>
    </div>
  );
};

// --- SHARED COMPONENTS ---
const HomeGrid = ({ onVideoSelect }: any) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {MOCK_VIDEOS.map(v => (
      <div key={v.id} onClick={() => onVideoSelect(v)} className="group cursor-pointer">
        <div className="relative aspect-video rounded-[32px] overflow-hidden mb-4 bg-[#0f0f0f] border border-white/5 shadow-xl transition-all group-hover:-translate-y-2">
          <img src={v.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="v" />
          <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity"></div>
        </div>
        <h3 className="text-sm font-black uppercase italic truncate">{v.title}</h3>
        <p className="text-[10px] text-gray-600 mt-1 uppercase font-black">{v.author} • {v.views}</p>
      </div>
    ))}
  </div>
);

const ReelsView = () => (
  <div className="flex flex-col items-center space-y-20 pb-40">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-[80vh] w-full max-w-[400px] bg-[#0f0f0f] rounded-[64px] relative overflow-hidden shadow-2xl border border-white/5">
        <img src={`https://picsum.photos/seed/reel${i}/400/800`} className="w-full h-full object-cover" alt="reel" />
        <div className="absolute bottom-12 right-6 flex flex-col space-y-8 items-center">
          <button className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl"><Heart size={24} /></button>
          <button className="p-4 bg-purple-600 rounded-2xl shadow-xl"><DollarSign size={24} /></button>
        </div>
      </div>
    ))}
  </div>
);

const GlobalPlazaInterface = () => (
  <div className="h-full bg-[#050505] rounded-[48px] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
    <div className="p-8 border-b border-white/5 shrink-0 flex items-center justify-between">
      <h2 className="text-2xl font-black italic">GLOBAL PLAZA</h2>
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
    </div>
    <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#020202] no-scrollbar">
      <div className="flex space-x-5 animate-in slide-in-from-left">
        <div className="w-12 h-12 rounded-2xl bg-purple-600 shrink-0"></div>
        <div className="bg-[#0a0a0a] p-6 rounded-[28px] rounded-tl-none border border-white/5">
          <p className="text-sm text-gray-400 font-bold">Pride Prime is now active globally! Connect, Earn, and Share safely.</p>
        </div>
      </div>
    </div>
  </div>
);

const ServersList = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    <div className="p-16 bg-[#080808] border-2 border-dashed border-white/5 rounded-[56px] flex flex-col items-center justify-center hover:bg-purple-600/10 cursor-pointer">
      <Plus size={48} className="text-gray-700" />
      <span className="mt-4 font-black uppercase text-xs italic">Build Server</span>
    </div>
    {['CRYPTO HUB', 'PRIDE DEV'].map((n, i) => (
      <div key={i} className="p-16 bg-[#080808] border border-white/5 rounded-[64px] text-center shadow-xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-indigo-800 rounded-3xl mx-auto mb-10 flex items-center justify-center text-3xl font-black">{n[0]}</div>
        <h3 className="text-2xl font-black italic uppercase">{n}</h3>
        <button className="mt-10 w-full py-5 bg-white text-black font-black rounded-3xl text-[10px] uppercase shadow-lg">ENTER</button>
      </div>
    ))}
  </div>
);

const SettingsScreen = ({ user, onLogout }: any) => (
  <div className="max-w-4xl mx-auto space-y-12">
    <div className="bg-gradient-to-br from-purple-700 to-indigo-950 p-16 rounded-[64px] flex items-center justify-between border border-white/10 shadow-3xl">
      <div className="flex items-center space-x-10">
        <img src={user.avatar} className="w-32 h-32 rounded-[48px] border-4 border-white/10" alt="p" />
        <div><h2 className="text-4xl font-black italic uppercase">{user.name}</h2><p className="text-xs text-white/50">{user.email}</p></div>
      </div>
      <button onClick={onLogout} className="bg-black px-12 py-5 rounded-3xl font-black text-[10px] uppercase border border-white/5 shadow-xl hover:bg-red-600">Logout</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="bg-[#080808] p-12 rounded-[56px] border border-white/5 shadow-xl">
        <h3 className="text-xl font-black uppercase mb-8 italic text-green-500">WALLET</h3>
        <p className="text-6xl font-black text-white italic tracking-tighter">${user.balance.toFixed(2)}</p>
        <button className="mt-10 w-full py-5 bg-purple-600 rounded-3xl font-black uppercase text-[10px] shadow-2xl">Withdraw</button>
      </div>
      <div className="bg-[#080808] p-12 rounded-[56px] border border-white/5 shadow-xl flex flex-col items-center justify-center">
        <Shield size={48} className="text-purple-500 mb-6" />
        <h3 className="text-xl font-black uppercase italic mb-8">AI SECURITY</h3>
        <div className="w-full bg-black p-6 rounded-[32px] flex items-center justify-between">
          <span className="font-black text-[10px] italic">AUTO-FREEZE</span>
          <div className="w-12 h-7 bg-purple-600 rounded-full flex items-center px-1"><div className="w-5 h-5 bg-white rounded-full ml-auto shadow-lg"></div></div>
        </div>
      </div>
    </div>
  </div>
);

const VideoOverlay = ({ video, onClose }: any) => (
  <div className="fixed inset-0 z-[100] bg-black/99 flex items-center justify-center p-8 animate-in fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="w-full max-w-7xl h-[85vh] bg-[#080808] rounded-[64px] overflow-hidden flex flex-col lg:flex-row border border-white/10 shadow-3xl relative">
      <div className="flex-[3] bg-black flex items-center justify-center relative">
        {video.status === 'frozen' ? (
          <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-[100px] flex flex-col items-center justify-center text-center p-20 z-50">
            <Shield size={100} className="text-red-500 mb-10 animate-pulse" />
            <h2 className="text-4xl font-black uppercase italic mb-4">SECURITY FREEZE</h2>
            <p className="text-gray-400 max-w-sm font-black italic">Pride AI has blocked this content for community safety violations.</p>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse shadow-2xl"><Play size={40} className="fill-white" /></div>
        )}
      </div>
      <div className="flex-1 p-12 bg-[#0a0a0a] border-l border-white/5 flex flex-col relative overflow-y-auto no-scrollbar">
        <button onClick={onClose} className="self-end mb-8 p-3 bg-white/5 rounded-full hover:bg-red-600 transition-all shadow-xl"><X size={24} /></button>
        <h2 className="text-3xl font-black uppercase italic mb-8 leading-tight">{video.title}</h2>
        <div className="flex items-center space-x-6 mb-12 pb-12 border-b border-white/5">
           <div className="w-20 h-20 rounded-[32px] bg-purple-600 border border-white/10 overflow-hidden shadow-2xl"><img src={`https://picsum.photos/seed/${video.author}/100/100`} alt="a" /></div>
           <div><p className="font-black text-xl uppercase italic">@{video.author}</p><p className="text-[10px] text-purple-500 font-black uppercase mt-1 italic">OFFICIAL PARTNER</p></div>
        </div>
        <div className="flex-1 space-y-8">
           <div className="flex space-x-5">
              <button className="flex-1 p-6 bg-white/5 border border-white/5 rounded-[32px] flex flex-col items-center justify-center space-y-3 hover:bg-white/10 transition-all shadow-lg active:scale-95"><ThumbsUp size={24} /><span className="text-[10px] font-black uppercase italic">LIKE</span></button>
              <button className="flex-1 p-6 bg-white/5 border border-white/5 rounded-[32px] flex flex-col items-center justify-center space-y-3 hover:bg-white/10 transition-all shadow-lg active:scale-95"><Share2 size={24} /><span className="text-[10px] font-black uppercase italic">SHARE</span></button>
           </div>
        </div>
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-7 rounded-[40px] font-black uppercase text-[11px] tracking-[0.5em] shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center space-x-5 mt-16 italic">
           <DollarSign size={24} className="animate-pulse" />
           <span>SUPER CHAT</span>
        </button>
      </div>
    </div>
  </div>
);

const TrendingGrid = ({ onVideoSelect }: any) => (
  <div className="space-y-16">
    <div className="flex items-center space-x-6 bg-gradient-to-r from-red-600/10 to-transparent p-10 rounded-[48px] border border-red-500/10 shadow-3xl">
      <TrendingUp size={40} className="text-red-600 animate-pulse" />
      <div><h2 className="text-4xl font-black uppercase italic">VIRAL VELOCITY</h2><p className="text-[10px] text-red-500 font-black uppercase mt-2">Live Engagement Pulse Tracking</p></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {MOCK_VIDEOS.map(v => (
        <div key={v.id} onClick={() => onVideoSelect(v)} className="flex items-center space-x-10 p-10 bg-[#0a0a0a] border border-white/5 rounded-[56px] cursor-pointer group hover:bg-white/5 transition-all shadow-2xl">
          <div className="w-56 aspect-video bg-black rounded-[32px] overflow-hidden shrink-0 shadow-2xl group-hover:scale-105 transition-all duration-700 border border-white/5"><img src={v.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="t" /></div>
          <div className="flex-1"><h4 className="text-[16px] font-black line-clamp-2 uppercase italic group-hover:text-red-500 transition-all mb-4 leading-tight">{v.title}</h4><p className="text-[10px] text-gray-700 font-black uppercase italic">{v.views} views • {v.timestamp}</p></div>
        </div>
      ))}
    </div>
  </div>
);

export default App;
