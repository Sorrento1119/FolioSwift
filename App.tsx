import { supabase } from './utils/supabase';
import React, { useState, useEffect } from 'react';
import { PortfolioData, AnimationType, ThemeType, SectionId, UIStyle, FontFamily } from './types';
import PortfolioForm from './components/PortfolioForm';
import PriorityEditor from './components/PriorityEditor';
import AnimationEditor from './components/AnimationEditor';
import VSLEditor from './components/VSLEditor';
import PortfolioPreview from './components/PortfolioPreview';
import TemplateTwo from './components/templates/TemplateTwo';
import { SavedSite, storage } from './utils/storage';
import { Layout, CheckCircle, Sparkles, Move, Zap, Eye, ArrowRight, LogOut, ExternalLink, Plus, AlertCircle, ShieldCheck } from 'lucide-react';

const INITIAL_DATA: PortfolioData = {
  name: '',
  subheading: '',
  badgeText: 'Available for Hire',
  photo: '',
  bio: '',
  education: '',
  educationImage: '',
  skills: '',
  softSkills: '',
  resume: '',
  projects: [],
  experiences: [],
  certifications: [],
  achievements: [],
  gallery: [],
  customLinks: [],
  linkedin: '',
  github: '',
  instagram: '',
  sectionOrder: ['vsl', 'about', 'skills', 'experience', 'projects', 'achievements', 'certifications', 'gallery', 'resume', 'contact'],
  sectionTitles: {},
  navbarEnabled: true,
  settings: {
    animation: AnimationType.SLIDE_UP,
    theme: ThemeType.LIGHT,
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#475569',
    headingColor: '#0f172a',
    uiStyle: UIStyle.GLASS,
    bentoView: true,
    headingFont: FontFamily.JAKARTA,
    bodyFont: FontFamily.INTER,
    sectionColors: {}
  },
  vslUrl: '',
  vslAutoplay: false,
  vslShowPlayer: true
};

const ensureCompleteData = (d: PortfolioData): PortfolioData => {
  const defaultOrder: SectionId[] = ['vsl', 'about', 'skills', 'experience', 'projects', 'achievements', 'certifications', 'gallery', 'resume', 'contact'];
  const currentOrder = d.sectionOrder || [];

  // For new sites or migrated sites, ensure all sections are present in the correct order
  let newOrder = [...currentOrder];

  // Add missing sections in their default positions
  defaultOrder.forEach(sec => {
    if (!newOrder.includes(sec)) {
      newOrder.push(sec);
    }
  });

  // Remove any sections that are not in the default list (in case of old data)
  newOrder = newOrder.filter(sec => defaultOrder.includes(sec));

  // Sort according to default order
  newOrder.sort((a, b) => defaultOrder.indexOf(a) - defaultOrder.indexOf(b));

  return {
    ...INITIAL_DATA,
    ...d,
    sectionOrder: newOrder as SectionId[]
  };
};

type View = 'landing' | 'builder' | 'dashboard' | 'public' | 'loading';
type Step = 'details' | 'vsl' | 'priority' | 'animations' | 'preview';

const steps: { id: Step; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'vsl', label: 'Video Intro' },
  { id: 'priority', label: 'Priority' },
  { id: 'animations', label: 'Style' },
  { id: 'preview', label: 'Preview' },
];

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        {/* Simple loading spinner */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Loading Portfolio</h2>
          <p className="text-slate-500 font-medium">Preparing your professional story...</p>
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthModal: React.FC<{ isOpen: boolean, initialMode: 'login' | 'signup', onClose: () => void, onAuth: (user: User) => void }> = ({ isOpen, initialMode, onClose, onAuth }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Both email and password are required');
      return;
    }

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (data.user) {
          localStorage.setItem('folioswift_session', email);
          onAuth({ email });
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (data.user) {
          localStorage.setItem('folioswift_session', email);
          onAuth({ email });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An authentication error occurred');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join FolioSwift'}
          </h2>
          <p className="text-slate-500 mb-8 font-medium">Building your career starts with a great landing page.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all mt-4">
              {mode === 'login' ? 'Continue to Dashboard' : 'Create My Account'}
            </button>
          </form>

          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="w-full mt-6 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
            {mode === 'login' ? "Don't have an account? Sign up" : "Already registered? Sign in"}
          </button>
        </div>
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors">
          <LogOut className="w-5 h-5 rotate-180" />
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [userSites, setUserSites] = useState<SavedSite[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(false);
  const [view, setView] = useState<View>('landing');
  const [publicData, setPublicData] = useState<PortfolioData | null>(null);
  const [isLoadingPublic, setIsLoadingPublic] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('details');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const initApp = async () => { // Create an async function inside
      const path = window.location.pathname;
      if (path.startsWith('/p/')) {
        setIsLoadingPublic(true);
        setView('loading');
        const slug = path.split('/p/')[1];
        const saved = await storage.getSite(slug); // Added 'await'
        if (saved) {
          setPublicData(ensureCompleteData(saved));
          setView('public');
        } else {
          setView('landing'); // If not found, go to landing
        }
        setIsLoadingPublic(false);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (user && view === 'dashboard') {
      setIsLoadingSites(true);
      storage.getUserSites(user.email).then(sites => {
        setUserSites(sites);
        setIsLoadingSites(false);
      });
    }
  }, [user, view]);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuth = (u: User) => {
    setUser(u);
    setIsAuthOpen(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('folioswift_session');
    setUser(null);
    setView('landing');
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this site? This action cannot be undone.')) {
      try {
        await storage.deleteSite(slug);
        setUserSites(prevSites => prevSites.filter(site => site.slug !== slug));
      } catch (error) {
        console.error("Error deleting site:", error);
        alert("Failed to delete the site. Please try again.");
      }
    }
  };

  const currentHost = window.location.host;

  if (view === 'loading') return <LoadingScreen />;

  if (view === 'public' && publicData) return <TemplateTwo data={publicData} />;

  if (view === 'landing') return (
    <div className="min-h-screen bg-white flex flex-col font-['Plus_Jakarta_Sans']">
      <AuthModal isOpen={isAuthOpen} initialMode={authMode} onClose={() => setIsAuthOpen(false)} onAuth={handleAuth} />

      <header className="px-8 md:px-12 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#6366f1] p-2 rounded-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">FolioSwift</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => openAuth('login')} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Login</button>
          <button onClick={() => openAuth('signup')} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Get Started</button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-5xl space-y-8 animate-in fade-in zoom-in duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#f0f2ff] px-5 py-1.5 rounded-full border border-[#e0e4ff] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#6366f1]" />
            <span className="text-[#6366f1] font-black uppercase tracking-[0.1em] text-[10px]">Resume to website within minutes</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-[52px] md:text-[88px] font-[1000] text-slate-900 tracking-[-0.04em] leading-[0.95] max-w-5xl mx-auto">
            Stop Sending Boring Resumes.<br />
            Share a <span className="text-[#6366f1]">Website</span> Instead.
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Built for students who want to stand out without wasting hours on code. <br className="hidden md:block" />
            Your professional story, instantly beautiful.
          </p>

          {/* Main CTA */}
          <div className="pt-8">
            <button
              onClick={() => user ? setView('builder') : openAuth('signup')}
              className="bg-[#6366f1] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-[0_20px_50px_-12px_rgba(99,102,241,0.5)] hover:scale-105 hover:bg-[#5558e6] transition-all flex items-center gap-3 mx-auto"
            >
              Start Building Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Features */}
      <footer className="py-16 flex justify-center items-center gap-12 md:gap-32">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">No Coding</span>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">Mobile Ready</span>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">Fully Personalized</span>
      </footer>
    </div>
  );

  if (view === 'dashboard' && user) {
    //const userSites = storage.getUserSites(user.email);
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Sparkles className="text-indigo-600 w-6 h-6" />
            <span className="text-xl font-black tracking-tighter">FolioSwift</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 font-bold hover:text-red-500 transition-colors">
            Log Out <LogOut className="w-4 h-4" />
          </button>
        </header>
        <main className="max-w-5xl mx-auto py-12 px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Dashboard</h1>
              <p className="text-slate-400 font-medium">Logged in as {user.email}</p>
            </div>
            <div className="flex gap-4">
              {userSites.length === 0 && (
                <button
                  onClick={() => { setData(INITIAL_DATA); setCurrentSlug(null); setView('builder'); setStep('details'); }}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 shadow-lg hover:bg-indigo-700"
                >
                  <Plus className="w-5 h-5" /> New Portfolio
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userSites.length === 0 ? (
              <div className="col-span-2 py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center">
                <p className="text-slate-400 font-bold mb-4">You haven't published any sites yet.</p>
                <button onClick={() => { setData(INITIAL_DATA); setCurrentSlug(null); setView('builder'); setStep('details'); }} className="text-indigo-600 font-black flex items-center gap-2">Build your first one <ArrowRight className="w-4 h-4" /></button>
              </div>
            ) : userSites.map(site => (
              <div key={site.slug} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">{site.slug.charAt(0).toUpperCase()}</div>
                  <a href={`/p/${site.slug}`} target="_blank" className="text-slate-300 hover:text-indigo-600"><ExternalLink className="w-5 h-5" /></a>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{site.data.name}</h3>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest truncate">{currentHost}/p/{site.slug}</p>
                <div className="flex gap-2 mt-8">
                  <button
                    onClick={() => { setData(ensureCompleteData(site.data)); setCurrentSlug(site.slug); setView('builder'); setStep('preview'); }}
                    className="w-full bg-slate-50 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                  >
                    Edit Portfolio
                  </button>
                  <button
                    onClick={() => handleDelete(site.slug)}
                    className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <AuthModal isOpen={isAuthOpen} initialMode={authMode} onClose={() => setIsAuthOpen(false)} onAuth={handleAuth} />
      <header className="bg-white border-b sticky top-0 z-50 px-4 md:px-12 h-24 flex items-center justify-between shadow-sm">
        <button onClick={() => setView(user ? 'dashboard' : 'landing')} className="flex items-center gap-3">
          <div className="bg-[#6366f1] p-2.5 rounded-xl"><Sparkles className="text-white w-5 h-5" /></div>
          <span className="text-2xl font-black tracking-tighter">FolioSwift</span>
        </button>
        <nav className="flex items-center bg-slate-50 px-2 py-2 rounded-2xl border border-slate-200/50">
          {steps.map((s, idx) => {
            const currentIdx = steps.findIndex(st => st.id === step);
            const isActive = s.id === step;
            const isPast = currentIdx > idx;
            return (
              <React.Fragment key={s.id}>
                <button onClick={() => setStep(s.id)} className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-white shadow-md text-indigo-700' : isPast ? 'text-green-600' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${isActive ? 'bg-indigo-600 text-white' : isPast ? 'bg-green-100' : 'bg-slate-200 text-slate-400'}`}>
                    {isPast ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest hidden md:block`}>{s.label}</span>
                </button>
                {idx < steps.length - 1 && <div className="w-6 h-px bg-slate-200 mx-1 hidden sm:block" />}
              </React.Fragment>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <button onClick={() => setView('dashboard')} className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">{user.email.charAt(0).toUpperCase()}</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hidden lg:block">My Profile</span>
            </button>
          ) : (
            <button onClick={() => openAuth('login')} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest">Login</button>
          )}
        </div>
      </header>
      <main className="flex-grow max-w-5xl mx-auto py-12 px-4 md:px-6 w-full">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {step === 'details' && <PortfolioForm initialData={data} onSubmit={(d) => { setData(d); setStep('vsl'); }} />}
          {step === 'vsl' && <VSLEditor data={data} onChange={setData} onNext={() => setStep('priority')} onBack={() => setStep('details')} />}
          {step === 'priority' && <div className="max-w-2xl mx-auto"><PriorityEditor order={data.sectionOrder} titles={data.sectionTitles || {}} onChange={(o, t) => setData(p => ({ ...p, sectionOrder: o, sectionTitles: t }))} /><div className="flex justify-between mt-16"><button onClick={() => setStep('vsl')} className="font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest text-xs">Back</button><button onClick={() => setStep('animations')} className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black shadow-lg hover:bg-indigo-700">Next: Style It</button></div></div>}
          {step === 'animations' && <div><AnimationEditor settings={data.settings} navbarEnabled={data.navbarEnabled} onNavbarChange={(val) => setData(p => ({ ...p, navbarEnabled: val }))} onChange={(s) => setData(p => ({ ...p, settings: s }))} /><div className="flex justify-between mt-16"><button onClick={() => setStep('priority')} className="font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest text-xs">Back</button><button onClick={() => setStep('preview')} className="bg-indigo-600 text-white px-12 py-5 rounded-[24px] font-black shadow-lg hover:bg-indigo-700">Go to Preview</button></div></div>}
          {step === 'preview' && <PortfolioPreview data={data} onBack={() => setStep('animations')} isLoggedIn={!!user} userEmail={user?.email || ''} onOpenAuth={() => openAuth('login')} initialSlug={currentSlug} />}
        </div>
      </main>
    </div>
  );
};

export default App;