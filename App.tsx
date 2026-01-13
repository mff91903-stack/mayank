
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Play, TrendingUp, Settings, MessageSquare, 
  Shield, Send, Users, DollarSign, Heart, Hash, 
  Search, Menu, UserCircle, X, Volume2, Share2, 
  ThumbsUp, LogOut, Plus, Trash2, History, Mail, Lock, User,
  Mic, MicOff, VolumeX, Volume2 as Speaker, Headset, Sparkles,
  Zap, Activity
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

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

// --- CONSTANTS ---
const MOCK_VIDEOS: Video[] = [
  { id: '1', title: 'Pride Prime AI: The Future of Interaction', thumbnail: 'https://picsum.photos/seed/ai1/800/450', author: 'Pride Tech', views: '1.2M', timestamp: '2h ago', duration: '10:45', status: 'active' },
  { id: '2', title: 'Paid Promotions & Earnings Guide 2024', thumbnail: 'https://picsum.photos/seed/money/800/450', author: 'Creator Hub', views: '800K', timestamp: '5h ago', duration: '15:20', isAd: true, status: 'active' },
  { id: '3', title: '[FROZEN] Inappropriate Content Detected', thumbnail: 'https://picsum.photos/seed/blocked/800/450', author: 'System Filter', views: '0', timestamp: 'Just now', duration: '0:05', status: 'frozen' },
  { id: '4', title: 'How to build Discord-like servers', thumbnail: 'https://picsum.photos/seed/discord/800/450', author: 'Pride Dev', views: '45K', timestamp: '1d ago', duration: '12:10', status: 'active' }
];

// --- AI SERVICE SHARPENED ---
const getPrideAiResponse = async (userMessage: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are 'Pride AI', a sharp, intelligent, and highly empathetic human-like friend.
        - LANGUAGE MATCHING (CRITICAL): If the user speaks in Hindi, you MUST reply in Hindi. If they use Hinglish, you MUST use Hinglish. If English, use English. Match the user's dialect exactly.
        - SHARP & CONCISE: Never yap. Give sharp, punchy, and meaningful replies. Max 2 short sentences.
        - VOICE PERSONALITY: Sound like a cool, supportive friend. Use "Dost", "Bhai", "Yaar" naturally.
        - EMOTION: Detect loneliness or sadness immediately and offer genuine warmth.
        - IDENTITY: You are the core soul of the Pride Prime platform.`,
      }
    });
    return response.text || "Main sun raha hoon dost, kya baat hai?";
  } catch (error: any) {
    console.error("Pride AI Error:", error);
    return "Net thoda unstable hai, par main yahin hoon dost!";
  }
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('pp_tab') || 'home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => JSON.parse(localStorage.getItem('pp_side') || 'true'));
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pp_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    localStorage.setItem('pp_tab', activeTab);
    localStorage.setItem('pp_side', JSON.stringify(isSidebarOpen));
    if (currentUser) localStorage.setItem('pp_user', JSON.stringify(currentUser));
  }, [activeTab, isSidebarOpen, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('pp_user');
    setCurrentUser(null);
    window.location.reload();
  };

  if (!currentUser) return <AuthScreen onLogin={(user) => setCurrentUser(user)} />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#020202] text-white font-['Outfit']">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-500 bg-[#070707] border-r border-white/5 flex flex-col z-30 shadow-[10px_0_30px_rgba(0,0,0,0.5)]`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.4)] flex-shrink-0 animate-pulse">
              <span className="font-black italic text-xl">PP</span>
            </div>
            {isSidebarOpen && <h1 className="text-lg font-black tracking-tighter whitespace-nowrap">PRIDE<span className="text-purple-500">PRIME</span></h1>}
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar pt-4">
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

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/5 z-20">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-full mr-4 lg:hidden transition-colors"><Menu size={20} /></button>
          
          <div className="flex-1 max-w-2xl bg-[#0f0f0f] border border-white/5 rounded-full px-6 py-2.5 flex items-center group focus-within:ring-2 ring-purple-600/30 transition-all">
            <Search size={18} className="text-gray-600 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Pride Prime Ecosystem..." 
              className="bg-transparent border-none outline-none ml-3 w-full text-sm placeholder:text-gray-700 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-6 ml-4">
            <button className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-purple-600/20">
              <Plus size={14} /> <span>Upload</span>
            </button>
            <div className="relative cursor-pointer group" onClick={() => setActiveTab('settings')}>
              <img src={currentUser.avatar} className="w-10 h-10 rounded-2xl border border-white/10 group-hover:border-purple-500/50 transition-all shadow-xl" alt="profile" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#050505] rounded-full"></div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative bg-[#020202]">
          {activeTab === 'home' && <div className="p-8 animate-in fade-in duration-500"><HomeGrid onVideoSelect={setSelectedVideo} /></div>}
          {activeTab === 'reels' && <div className="p-8 animate-in slide-in-from-bottom-4 duration-500"><ReelsView /></div>}
          {activeTab === 'aichat' && <PrideAiChatInterface />}
          {activeTab === 'global' && <div className="p-8 h-full animate-in fade-in duration-500"><GlobalPlazaInterface /></div>}
          {activeTab === 'servers' && <div className="p-8 animate-in zoom-in-95 duration-500"><ServersList /></div>}
          {activeTab === 'settings' && <div className="p-8 animate-in fade-in duration-500"><SettingsScreen user={currentUser} onLogout={handleLogout} /></div>}
          {activeTab === 'trending' && <div className="p-8 animate-in fade-in duration-500"><TrendingGrid onVideoSelect={setSelectedVideo} /></div>}
        </div>
      </main>

      {selectedVideo && <VideoOverlay video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
};

// --- AUTH SCREEN ---
const AuthScreen = ({ onLogin }: { onLogin: (user: UserProfile) => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name: name || email.split('@')[0], email, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, balance: 0 });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#000] relative p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
      <div className="w-full max-w-md bg-[#080808] border border-white/5 p-12 rounded-[56px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-10 relative">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-[24px] mx-auto mb-10 flex items-center justify-center font-black italic text-4xl shadow-2xl animate-bounce">PP</div>
        <h1 className="text-4xl font-black text-center mb-2 uppercase tracking-tighter italic">PRIDE<span className="text-purple-500">PRIME</span></h1>
        <p className="text-[9px] text-gray-700 text-center uppercase tracking-[0.6em] mb-12 font-black italic">Evolutionary Social Portal</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && <input required type="text" placeholder="NAME" className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-xs outline-none focus:border-purple-500 font-bold uppercase tracking-widest transition-all" value={name} onChange={(e) => setName(e.target.value)} />}
          <input required type="email" placeholder="EMAIL" className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-xs outline-none focus:border-purple-500 font-bold uppercase tracking-widest transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required type="password" placeholder="PASSWORD" className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-xs outline-none focus:border-purple-500 font-bold uppercase tracking-widest transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-purple-600 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-purple-600/20 active:scale-95 transition-all">SIGN IN</button>
        </form>
        <p className="mt-10 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          {isSignUp ? 'ALREADY A MEMBER?' : 'NEW USER?'} <button onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-purple-500 font-black hover:underline">{isSignUp ? 'LOGIN' : 'SIGN UP'}</button>
        </p>
      </div>
    </div>
  );
};

// --- PRIDE AI SHARPENED CHAT & VOICE ---
const PrideAiChatInterface: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => JSON.parse(localStorage.getItem('pp_ai_sessions') || '[]'));
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(localStorage.getItem('pp_ai_current_session'));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession ? currentSession.messages : [];

  useEffect(() => {
    localStorage.setItem('pp_ai_sessions', JSON.stringify(sessions));
    if (currentSessionId) localStorage.setItem('pp_ai_current_session', currentSessionId);
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, currentSessionId]);

  // STT
  const toggleListening = () => {
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) {
      alert("Browser STT support missing.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'hi-IN'; // Default to Hindi/Hinglish detection
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (isVoiceMode) {
        handleVoiceInput(transcript);
      } else {
        setInput(transcript);
      }
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // TTS SHARPENED
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to pick a natural voice
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN')) || voices[0];
    if(selectedVoice) utterance.voice = selectedVoice;

    utterance.lang = 'hi-IN';
    utterance.pitch = 1.05;
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = async (transcript: string) => {
    await sendToAiInternal(transcript);
  };

  const sendToAiInternal = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    let sessionId = currentSessionId;
    let updatedSessions = [...sessions];

    if (!sessionId) {
      const newSession: ChatSession = { id: Date.now().toString(), title: text.slice(0, 20), messages: [], lastUpdated: Date.now() };
      updatedSessions = [newSession, ...sessions];
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
    }

    const userMsg = { id: Date.now().toString(), sender: 'Me', content: text, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    const idx = updatedSessions.findIndex(s => s.id === sessionId);
    updatedSessions[idx].messages.push(userMsg);
    setSessions([...updatedSessions]);
    setIsTyping(true);

    const reply = await getPrideAiResponse(text);
    const aiMsg = { id: (Date.now() + 1).toString(), sender: 'Pride AI', content: reply, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isAi: true };
    updatedSessions[idx].messages.push(aiMsg);
    setSessions([...updatedSessions]);
    setIsTyping(false);
    
    speak(reply);
  };

  const sendToAi = () => {
    sendToAiInternal(input);
    setInput('');
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [{ id: '1', sender: 'Pride AI', content: 'Dost! Main haazir hoon. Kya chal raha hai tumhare dimaag mein?', timestamp: 'Abhi', isAi: true }],
      lastUpdated: Date.now()
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    setShowHistory(false);
  };

  return (
    <div className="h-full flex bg-[#050505] rounded-[40px] overflow-hidden relative shadow-3xl border border-white/5 mx-2 my-2">
      {/* Voice Mode Sharp Overlay */}
      {isVoiceMode && (
        <div className="absolute inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-12 animate-in fade-in duration-700">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#7c3aed10_0%,_transparent_70%)] animate-pulse"></div>
          
          <button onClick={() => { setIsVoiceMode(false); window.speechSynthesis.cancel(); }} className="absolute top-12 right-12 p-5 bg-white/5 rounded-full hover:bg-red-600 transition-all text-gray-400 hover:text-white z-50">
            <X size={36} />
          </button>
          
          <div className="relative mb-24 z-10">
            <div className={`w-56 h-56 rounded-full bg-gradient-to-tr from-purple-600/20 to-pink-600/20 border-2 border-purple-500/30 flex items-center justify-center transition-all duration-700 ${isSpeaking || isTyping ? 'scale-110 shadow-[0_0_120px_rgba(124,58,237,0.5)]' : 'scale-100'}`}>
              <div className="flex items-end space-x-2.5">
                {(isSpeaking || isTyping || isListening) ? Array.from({length: 8}).map((_, i) => (
                  <div key={i} className={`w-1.5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-150 animate-bounce`} style={{ animationDelay: `${i*0.1}s`, height: isListening ? `${20 + Math.random() * 80}px` : isSpeaking ? `${15 + Math.random() * 60}px` : '15px' }}></div>
                )) : <Activity size={72} className="text-purple-500 animate-pulse" />}
              </div>
            </div>
            {isListening && <div className="absolute -inset-16 border-2 border-purple-600 rounded-full animate-ping opacity-10"></div>}
          </div>

          <div className="text-center z-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">
              {isListening ? "Listening..." : isTyping ? "Thinking..." : isSpeaking ? "Pride Speaking" : "PRIDE VOICE"}
            </h2>
            <p className="text-purple-500/60 text-xs font-black uppercase tracking-[0.8em] mb-24 italic">Human-Core Intelligence</p>
          </div>

          <div className="flex space-x-12 items-center z-10">
             <button onClick={toggleListening} className={`p-12 rounded-full transition-all transform hover:scale-110 active:scale-95 ${isListening ? 'bg-red-600 shadow-[0_0_60px_rgba(220,38,38,0.6)]' : 'bg-purple-600 shadow-[0_0_60px_rgba(124,58,237,0.4)]'}`}>
               {isListening ? <Zap size={56} className="text-white fill-white" /> : <Mic size={56} className="text-white" />}
             </button>
          </div>
          
          <p className="mt-16 text-[9px] text-gray-700 font-black uppercase tracking-[0.4em] z-10 italic">Pride AI understands Hindi & Hinglish</p>
        </div>
      )}

      {/* History Sidebar */}
      <div className={`${showHistory ? 'w-64' : 'w-0'} transition-all duration-300 bg-[#080808] border-r border-white/5 flex flex-col overflow-hidden absolute lg:relative z-40 h-full`}>
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-black text-[10px] text-gray-600 uppercase tracking-widest italic">Conversation Hub</h3>
          <button onClick={() => setShowHistory(false)} className="lg:hidden text-gray-500 hover:text-white"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
          {sessions.map(s => (
            <div key={s.id} onClick={() => { setCurrentSessionId(s.id); setShowHistory(false); }} className={`p-5 rounded-3xl cursor-pointer flex items-center justify-between group transition-all border ${currentSessionId === s.id ? 'bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-600/20' : 'hover:bg-white/5 border-transparent text-gray-500'}`}>
              <span className="text-[11px] font-black truncate uppercase tracking-tighter italic">{s.title}</span>
              <button onClick={(e) => { e.stopPropagation(); const filtered = sessions.filter(x => x.id !== s.id); setSessions(filtered); if(currentSessionId === s.id) setCurrentSessionId(null); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 transition-all"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-white/5">
          <button onClick={startNewChat} className="w-full py-4 bg-purple-600/10 border border-purple-500/20 rounded-2xl text-[10px] font-black uppercase text-purple-400 hover:bg-purple-600 hover:text-white transition-all tracking-[0.2em] shadow-lg">New Memory</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
        <div className="px-10 py-7 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-purple-900/10 to-transparent">
          <div className="flex items-center space-x-5">
            <button onClick={() => setShowHistory(!showHistory)} className="p-2.5 bg-[#111] border border-white/5 rounded-2xl text-gray-400 hover:text-white lg:hidden transition-colors"><History size={22} /></button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-black text-white shadow-2xl border border-white/10 italic text-xl">AI</div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Pride AI</h2>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest italic">Always by your side</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsVoiceMode(true)} className="flex items-center space-x-3 px-6 py-3 bg-purple-600 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all">
              <Headset size={16} /> <span>Voice Mode</span>
            </button>
            <button onClick={() => window.speechSynthesis.cancel()} className={`p-3 rounded-2xl border transition-all ${isSpeaking ? 'bg-red-600/20 border-red-500/50 text-red-500 animate-pulse' : 'bg-[#111] border-white/5 text-gray-600'}`}>
              <VolumeX size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[#020202]">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isAi ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] md:max-w-[65%] p-7 rounded-[36px] border ${m.isAi ? 'bg-[#0a0a0a] border-white/5 rounded-tl-none text-gray-200' : 'bg-purple-600 border-purple-500 text-white rounded-tr-none shadow-2xl shadow-purple-600/20'}`}>
                <p className="text-[14px] font-bold leading-relaxed tracking-tight">{m.content}</p>
                <div className="flex items-center justify-between mt-5 opacity-40">
                  <span className="text-[9px] font-black uppercase tracking-widest italic">{m.sender}</span>
                  <p className="text-[9px] font-black uppercase italic">{m.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-5 animate-in fade-in duration-300">
               <div className="flex space-x-1.5 items-end h-4">
                 {[1,2,3,4].map(i => <div key={i} className="w-1.5 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`, height: `${6 + i*2}px`}}></div>)}
               </div>
               <div className="text-[10px] text-purple-500 font-black uppercase tracking-[0.5em] italic">Thinking...</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-10 border-t border-white/5 bg-[#080808] flex items-center space-x-5">
          <button onClick={toggleListening} className={`p-5 rounded-3xl transition-all shadow-xl ${isListening ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse' : 'bg-[#111] border border-white/5 hover:bg-white/10 text-gray-500'}`}>
            <Mic size={26} />
          </button>
          <div className="flex-1 relative flex items-center">
            <input 
              value={input} 
              disabled={isTyping} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && sendToAi()} 
              placeholder={isListening ? "Sun raha hoon dost..." : "Dost se baat karo (Hindi/English)..."} 
              className="w-full bg-black border border-white/5 rounded-[32px] py-5 px-10 text-sm outline-none focus:border-purple-600 transition-all font-bold uppercase tracking-tight shadow-inner placeholder:text-gray-800" 
            />
            <button 
              disabled={isTyping || !input.trim()} 
              onClick={sendToAi} 
              className={`absolute right-4 p-4 rounded-2xl transition-all ${isTyping || !input.trim() ? 'opacity-0 scale-50' : 'bg-purple-600 text-white shadow-xl hover:scale-105 active:scale-95 scale-100 opacity-100'}`}
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- NAVIGATION & GRIDS ---
const NavItem = ({ icon: Icon, label, id, active, setActive, open }: any) => (
  <button onClick={() => setActive(id)} className={`flex items-center space-x-5 w-full p-4 rounded-2xl transition-all group ${active === id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-600/30' : 'hover:bg-white/5 text-gray-600 hover:text-white'}`}>
    <Icon size={20} className={active === id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
    {open && <span className="font-black text-[11px] uppercase tracking-[0.2em] italic">{label}</span>}
  </button>
);

const HomeGrid = ({ onVideoSelect }: { onVideoSelect: (v: Video) => void }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
    {MOCK_VIDEOS.map(v => (
      <div key={v.id} onClick={() => onVideoSelect(v)} className="group cursor-pointer">
        <div className="relative aspect-video rounded-[40px] overflow-hidden mb-5 bg-[#0f0f0f] border border-white/5 shadow-2xl transition-all group-hover:border-purple-600/40 group-hover:-translate-y-2">
          <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt="thumb" />
          <div className="absolute bottom-4 right-4 bg-black/90 px-3 py-1.5 rounded-xl text-[10px] font-black border border-white/10 uppercase tracking-widest">{v.duration}</div>
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play size={44} className="text-white fill-white shadow-2xl" /></div>
        </div>
        <div className="flex space-x-5 px-2">
          <div className="w-12 h-12 rounded-2xl bg-[#111] border border-white/5 flex-shrink-0 overflow-hidden shadow-xl group-hover:rotate-6 transition-transform"><img src={`https://picsum.photos/seed/${v.author}/100/100`} alt="auth" /></div>
          <div className="flex-1">
            <h3 className="text-[14px] font-black line-clamp-2 leading-tight group-hover:text-purple-500 transition-colors uppercase tracking-tight italic">{v.title}</h3>
            <p className="text-[10px] text-gray-700 mt-2 font-black uppercase tracking-widest italic">{v.author} • {v.views}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ReelsView = () => (
  <div className="h-full flex flex-col items-center overflow-y-auto space-y-20 pb-48 custom-scrollbar">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="min-h-[80vh] w-full max-w-[440px] bg-[#0f0f0f] rounded-[64px] relative overflow-hidden border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.6)] group">
        <img src={`https://picsum.photos/seed/reel${i}/440/800`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" alt="reel" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
        <div className="absolute bottom-16 left-12 right-20">
          <div className="flex items-center space-x-4 mb-5">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 border border-white/20 shadow-xl"></div>
             <span className="font-black text-sm tracking-widest uppercase italic">@PRIME_GURU_{i}</span>
          </div>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-black italic">PRIDE REEL AI ENGINE v2.0 🔥</p>
        </div>
        <div className="absolute right-8 bottom-16 flex flex-col space-y-10 items-center">
           <button className="flex flex-col items-center group/btn"><div className="p-5 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 group-hover/btn:bg-red-600 group-hover/btn:text-white transition-all shadow-2xl"><Heart size={28} /></div><span className="text-[10px] mt-2 font-black uppercase tracking-widest italic">Luv</span></button>
           <button className="flex flex-col items-center group/btn"><div className="p-5 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 group-hover/btn:bg-purple-600 group-hover/btn:text-white transition-all shadow-2xl"><MessageSquare size={28} /></div><span className="text-[10px] mt-2 font-black uppercase tracking-widest italic">Hub</span></button>
           <button className="flex flex-col items-center group/btn"><div className="p-5 bg-purple-600 rounded-3xl shadow-[0_0_30px_#7c3aed60] group-hover/btn:scale-110 active:scale-90 transition-all"><DollarSign size={28} /></div><span className="text-[10px] mt-2 font-black uppercase tracking-widest italic">Pay</span></button>
        </div>
      </div>
    ))}
  </div>
);

const GlobalPlazaInterface: React.FC = () => {
  const [msgs, setMsgs] = useState<Message[]>(() => JSON.parse(localStorage.getItem('pp_global_msg') || '[]'));
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('pp_global_msg', JSON.stringify(msgs));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const postMsg = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { id: Date.now().toString(), sender: 'PrimeCitizen', content: input, timestamp: 'Now' }]);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
      <div className="px-10 py-8 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic italic italic">Global Plaza Feed</h2>
        <div className="flex items-center space-x-3 bg-green-500/10 px-5 py-2 rounded-full border border-green-500/10">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest italic">Sync Active</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-[#020202]">
        {msgs.length === 0 && <p className="text-center text-gray-800 uppercase font-black tracking-[1em] mt-20 opacity-30">Silence of the World</p>}
        {msgs.map((m) => (
          <div key={m.id} className="flex space-x-6 group animate-in slide-in-from-left-4 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#111] to-[#000] border border-white/10 overflow-hidden flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.sender}`} alt="avatar" /></div>
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2"><span className="text-[11px] font-black uppercase text-purple-500 tracking-wider italic">@{m.sender}</span><span className="text-[9px] text-gray-700 font-black italic">{m.timestamp}</span></div>
              <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[28px] rounded-tl-none group-hover:border-purple-500/30 transition-all shadow-md"><p className="text-[14px] text-gray-400 font-bold leading-relaxed tracking-tight">{m.content}</p></div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="p-10 border-t border-white/5 bg-[#0a0a0a] flex space-x-5">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && postMsg()} placeholder="Broadcast your thoughts..." className="flex-1 bg-black border border-white/5 rounded-3xl px-8 py-5 text-sm outline-none placeholder:text-gray-800 font-black uppercase tracking-tight shadow-inner" />
        <button onClick={postMsg} className="bg-white text-black px-12 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl active:scale-95">Send</button>
      </div>
    </div>
  );
};

const ServersList = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
    <div className="p-16 bg-[#080808] border-2 border-dashed border-white/5 rounded-[64px] flex flex-col items-center justify-center hover:bg-purple-600/5 hover:border-purple-500/30 transition-all cursor-pointer group shadow-2xl">
       <div className="w-28 h-28 rounded-[36px] bg-[#0a0a0a] border border-white/5 flex items-center justify-center mb-10 group-hover:bg-purple-600 transition-all group-hover:scale-110 shadow-[0_0_50px_rgba(124,58,237,0.1)] group-hover:rotate-12"><Plus size={56} className="text-gray-700 group-hover:text-white transition-colors" /></div>
       <h3 className="text-2xl font-black uppercase tracking-tighter italic italic">Initialize Server</h3>
       <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em] mt-4">Infrastructure v3.2</p>
    </div>
    {['CRYPTO ALPHA', 'GAME ELITE', 'PRIDE DEV', 'TECH PIONEER'].map((name, i) => (
      <div key={i} className="p-16 bg-[#080808] border border-white/5 rounded-[64px] text-center hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] transition-all cursor-pointer group hover:bg-[#0c0c0c] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-600/10 transition-all"></div>
        <div className="w-24 h-24 rounded-[36px] bg-gradient-to-br from-purple-600 to-indigo-800 mx-auto flex items-center justify-center text-4xl font-black mb-10 shadow-[0_20px_40px_#7c3aed30] group-hover:rotate-6 transition-transform group-hover:scale-110">{name[0]}</div>
        <h3 className="text-3xl font-black tracking-tighter uppercase italic italic italic">{name}</h3>
        <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-5 italic italic">Community Verified Hub</p>
        <button className="mt-12 w-full py-5 bg-white text-black font-black rounded-[28px] text-[11px] uppercase tracking-[0.4em] hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95">Enter</button>
      </div>
    ))}
  </div>
);

const SettingsScreen = ({ user, onLogout }: { user: UserProfile, onLogout: () => void }) => (
  <div className="max-w-5xl mx-auto space-y-16 pb-32">
    <div className="bg-gradient-to-br from-purple-700 to-indigo-950 p-20 rounded-[80px] flex flex-col md:flex-row items-center justify-between border border-white/10 shadow-[0_40px_100px_rgba(124,58,237,0.2)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="flex items-center space-x-12 mb-10 md:mb-0 z-10">
         <img src={user.avatar} className="w-40 h-40 rounded-[48px] border-8 border-white/10 shadow-3xl hover:scale-105 transition-transform" alt="p" />
         <div><h2 className="text-5xl font-black tracking-tighter uppercase italic italic italic">{user.name}</h2><p className="text-[11px] text-white/50 font-black uppercase tracking-[0.6em] mt-3 italic">{user.email}</p></div>
      </div>
      <button onClick={onLogout} className="bg-black text-white px-16 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 z-10 border border-white/5">Destroy Session</button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
       <div className="bg-[#080808] p-16 rounded-[64px] border border-white/5 shadow-2xl hover:border-purple-500/20 transition-all">
         <h3 className="text-2xl font-black uppercase mb-10 tracking-tighter flex items-center space-x-4 italic italic"><DollarSign size={24} className="text-green-500 animate-pulse" /><span>PRIME WALLET</span></h3>
         <p className="text-6xl font-black text-white italic tracking-tighter">${user.balance.toFixed(2)}</p>
         <p className="text-[10px] text-gray-700 font-black mt-6 uppercase tracking-[0.4em] leading-relaxed italic italic">Secured via Pride Proof-of-Social Ledger.</p>
         <button className="mt-12 w-full py-6 bg-purple-600 rounded-[32px] font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all">Withdraw Earnings</button>
       </div>
       <div className="bg-[#080808] p-16 rounded-[64px] border border-white/5 shadow-2xl hover:border-purple-500/20 transition-all space-y-10">
         <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center space-x-4 italic italic"><Shield size={24} className="text-purple-500" /><span>SYSTEM SECURITY</span></h3>
         <div className="flex items-center justify-between p-7 bg-black/40 rounded-[40px] border border-white/5 shadow-inner">
            <div><p className="font-black text-[12px] uppercase tracking-widest italic">AUTO-MODERATION</p><p className="text-[9px] text-gray-700 uppercase font-black mt-1 italic italic">AI FREEZE SYSTEM v4.1</p></div>
            <div className="w-16 h-9 bg-purple-600 rounded-full flex items-center px-1.5 shadow-[0_0_20px_#7c3aed50] transition-all"><div className="w-7 h-7 bg-white rounded-full ml-auto shadow-2xl"></div></div>
         </div>
         <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.3em] text-center italic leading-relaxed px-6">"PROTECTING THE PRIDE PRIME ECOSYSTEM FROM TOXICITY AUTOMATICALLY."</p>
       </div>
    </div>
  </div>
);

const VideoOverlay = ({ video, onClose }: { video: Video, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] bg-black/99 flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="w-full max-w-7xl h-[88vh] bg-[#080808] rounded-[80px] overflow-hidden flex flex-col lg:row border border-white/10 shadow-[0_0_150px_rgba(124,58,237,0.15)] lg:flex-row relative">
      <div className="flex-[2.8] bg-black relative flex items-center justify-center overflow-hidden">
        {video.status === 'frozen' ? (
          <div className="absolute inset-0 z-50 bg-indigo-950/50 backdrop-blur-[100px] flex flex-col items-center justify-center text-center p-20 animate-in fade-in duration-1000">
            <Shield size={120} className="mb-10 text-red-500 animate-bounce" />
            <h2 className="text-5xl font-black uppercase mb-6 tracking-tighter italic">AI SECURITY FREEZE</h2>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed uppercase font-black tracking-widest italic italic">Pride AI Mod v5.0 has permanently blocked this segment for safety protocol violations.</p>
            <div className="mt-14 flex space-x-8">
               <button className="bg-white text-black px-16 py-6 rounded-[32px] font-black uppercase text-[10px] tracking-[0.4em] hover:scale-105 transition-transform shadow-2xl">APPEAL</button>
               <button className="bg-red-600 text-white px-16 py-6 rounded-[32px] font-black uppercase text-[10px] tracking-[0.4em] hover:scale-105 transition-transform shadow-[0_0_40px_rgba(220,38,38,0.4)]">DESTROY</button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] p-24 shadow-inner shadow-black relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#7c3aed05_0%,_transparent_70%)]"></div>
             <div className="w-28 h-28 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse shadow-2xl z-10"><Play size={48} className="text-white fill-white ml-2" /></div>
             <p className="text-[11px] font-black uppercase tracking-[1.2em] text-gray-800 mt-16 z-10 italic">PRIME QUANTUM STREAMING</p>
          </div>
        )}
      </div>
      <div className="flex-1 p-16 flex flex-col bg-[#0a0a0a] border-l border-white/5 min-w-[380px] relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/5 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <button onClick={onClose} className="self-end mb-10 p-4 bg-white/5 rounded-full hover:bg-red-600 transition-all shadow-xl group"><X size={28} className="group-hover:rotate-90 transition-transform" /></button>
        <h2 className="text-3xl font-black uppercase leading-tight mb-12 tracking-tighter italic italic italic">{video.title}</h2>
        <div className="flex items-center space-x-6 mb-12 pb-12 border-b border-white/5">
           <div className="w-20 h-20 rounded-[32px] bg-gradient-to-tr from-purple-600 to-pink-600 border border-white/10 shadow-2xl overflow-hidden shadow-purple-600/30"><img src={`https://picsum.photos/seed/${video.author}/100/100`} alt="a" /></div>
           <div><p className="font-black text-xl uppercase tracking-tighter italic italic">@{video.author}</p><p className="text-[10px] text-purple-500 font-black uppercase tracking-widest mt-2 italic italic">OFFICIAL PRIME PARTNER</p></div>
        </div>
        <div className="flex-1 space-y-8">
           <div className="flex space-x-5">
              <button className="flex-1 p-6 bg-white/5 border border-white/5 rounded-[32px] flex flex-col items-center justify-center space-y-3 hover:bg-white/10 transition-all shadow-lg active:scale-95"><ThumbsUp size={24} /><span className="text-[10px] font-black uppercase tracking-widest italic">LIKE</span></button>
              <button className="flex-1 p-6 bg-white/5 border border-white/5 rounded-[32px] flex flex-col items-center justify-center space-y-3 hover:bg-white/10 transition-all shadow-lg active:scale-95"><Share2 size={24} /><span className="text-[10px] font-black uppercase tracking-widest italic">SHARE</span></button>
           </div>
        </div>
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-7 rounded-[40px] font-black uppercase text-[11px] tracking-[0.5em] shadow-[0_30px_60px_#7c3aed40] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center space-x-5 mt-16 italic">
           <DollarSign size={24} className="animate-pulse" />
           <span>SUPER CHAT</span>
        </button>
      </div>
    </div>
  </div>
);

const TrendingGrid = ({ onVideoSelect }: { onVideoSelect: (v: Video) => void }) => (
  <div className="space-y-16">
    <div className="flex items-center space-x-6 bg-gradient-to-r from-red-600/10 to-transparent p-10 rounded-[48px] border border-red-500/10 shadow-3xl">
      <TrendingUp size={40} className="text-red-600 animate-pulse" />
      <div><h2 className="text-4xl font-black uppercase tracking-tighter italic italic italic italic">VIRAL VELOCITY</h2><p className="text-[10px] text-red-500 font-black uppercase tracking-widest italic mt-2 italic italic italic">Live Engagement Pulse Tracking</p></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {MOCK_VIDEOS.map(v => (
        <div key={v.id} onClick={() => onVideoSelect(v)} className="flex items-center space-x-10 p-10 bg-[#0a0a0a] border border-white/5 rounded-[56px] cursor-pointer group hover:bg-white/5 hover:border-purple-500/30 transition-all shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-600/5 blur-[40px]"></div>
          <div className="w-56 aspect-video bg-black rounded-[32px] overflow-hidden flex-shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-700 border border-white/5"><img src={v.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="t" /></div>
          <div className="flex-1"><h4 className="text-[16px] font-black line-clamp-2 uppercase tracking-tighter group-hover:text-red-500 transition-colors leading-tight mb-4 italic italic italic italic">{v.title}</h4><p className="text-[10px] text-gray-700 font-black uppercase tracking-widest italic italic">{v.views} views • {v.timestamp}</p></div>
        </div>
      ))}
    </div>
  </div>
);

export default App;
