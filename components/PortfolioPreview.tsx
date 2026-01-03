import React, { useState } from 'react';
import { PortfolioData } from '../types';
import TemplateTwo from './templates/TemplateTwo';
import { storage } from '../utils/storage';
import { Download, Laptop, Tablet, Smartphone, ArrowLeft, Globe, Rocket, Check, Copy, X, Loader2, ExternalLink, Save } from 'lucide-react';
import { generateStandaloneHTML } from '../utils/download';

interface Props {
  data: PortfolioData;
  onBack: () => void;
  isLoggedIn: boolean;
  userEmail: string;
  onOpenAuth: () => void;
  initialSlug: string | null;
  onSlugChange?: (slug: string) => void;
}

const PublishModal: React.FC<{ isOpen: boolean, onClose: () => void, data: PortfolioData, email: string, initialSlug: string | null, onSlugChange?: (slug: string) => void }> = ({ isOpen, onClose, data, email, initialSlug, onSlugChange }) => {
  const [slug, setSlug] = useState(initialSlug || data.name.replace(/\s+/g, '').toLowerCase() || 'mysite');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentHost = window.location.host;
  const currentOrigin = window.location.origin;

  const handlePublish = async () => { // Added 'async'
    setIsPublishing(true);
    setError('');

    try {
      // We 'await' the actual database call now
      await storage.saveSite(slug, data, email, initialSlug);
      setIsPublishing(false);
      setIsSuccess(true);
      onSlugChange?.(slug);
    } catch (e: any) {
      setError(e.message || "Failed to publish");
      setIsPublishing(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(`${currentOrigin}/p/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
        {!isSuccess ? (
          <>
            <h2 className="text-3xl font-black mb-2 tracking-tight text-slate-900">Claim your URL</h2>
            <p className="text-slate-500 mb-8 font-medium">Instantly available to recruiters worldwide.</p>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 mb-6">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Your address</span>
              <div className="flex items-baseline gap-1 overflow-hidden">
                <span className="text-slate-300 font-bold whitespace-nowrap">{currentHost}/p/</span>
                <input
                  type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 bg-transparent text-2xl font-black text-indigo-600 outline-none"
                  autoFocus
                />
              </div>
            </div>
            {error && <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl mb-4 text-center">{error}</div>}
            <button
              onClick={handlePublish} disabled={isPublishing}
              className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {isPublishing ? <Loader2 className="animate-spin" /> : <Rocket className="w-5 h-5" />}
              {isPublishing ? 'Launching...' : 'Go Live Now'}
            </button>
            <p className="mt-6 text-center text-xs text-slate-400 font-medium">Publishing as <span className="text-slate-900 font-bold">{email}</span></p>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10" /></div>
            <h2 className="text-4xl font-black mb-2 tracking-tight text-slate-900">You're Live!</h2>
            <p className="text-slate-500 mb-8 font-medium">Share your work with the world.</p>

            <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-8">
              <span className="flex-1 text-left font-bold text-slate-700 truncate text-sm">{currentHost}/p/{slug}</span>
              <button onClick={copyUrl} className="p-2 hover:bg-white rounded-lg transition-all text-indigo-600"><Copy className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a href={`/p/${slug}`} target="_blank" className="bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                View Site <ExternalLink className="w-4 h-4" />
              </a>
              <button onClick={onClose} className="bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all">
                Done
              </button>
            </div>
          </div>
        )}
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X /></button>
      </div>
    </div>
  );
};

const PortfolioPreview: React.FC<Props> = ({ data, onBack, isLoggedIn, userEmail, onOpenAuth, initialSlug, onSlugChange }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleDownload = () => {
    const html = generateStandaloneHTML(data);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveDraft = () => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    setIsSaving(true);
    // Use existing slug or generate one based on name + timestamp to avoid collision
    const slug = initialSlug || `${data.name.replace(/\s+/g, '').toLowerCase()}-${Date.now().toString().slice(-4)}`;

    setTimeout(() => {
      try {
        storage.saveSite(slug, data, userEmail, initialSlug);
        setIsSaving(false);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
      } catch (e) {
        setIsSaving(false);
        alert('Could not save draft. Try picking a unique name.');
      }
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PublishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
        email={userEmail}
        initialSlug={initialSlug}
        onSlugChange={onSlugChange}
      />

      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky top-24 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div className="h-6 w-px bg-slate-100" />
          <h3 className="font-black text-slate-900 text-sm tracking-tight hidden sm:block">Preview Mode</h3>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'desktop' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Laptop className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'tablet' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Tablet className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'mobile' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Smartphone className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="hidden xl:flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 px-4 py-2 transition-colors text-xs uppercase tracking-widest"
          >
            <Download className="w-4 h-4" /> Download
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className={`flex items-center gap-2 font-black px-6 py-3 rounded-2xl border transition-all text-sm ${showSaveSuccess ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : showSaveSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {showSaveSuccess ? 'Saved!' : isSaving ? 'Saving...' : 'Save Progress'}
          </button>

          <button
            onClick={() => isLoggedIn ? setIsModalOpen(true) : onOpenAuth()}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 hover:scale-105 transition-all text-sm"
          >
            <Globe className="w-4 h-4" />
            {isLoggedIn ? 'Publish Site' : 'Login to Publish'}
          </button>
        </div>
      </div>

      <div className="flex justify-center pb-12">
        <div className={`w-full transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] ${viewMode === 'mobile' ? 'max-w-[375px]' : viewMode === 'tablet' ? 'max-w-[768px]' : 'max-w-full'} bg-white rounded-[48px] shadow-2xl overflow-hidden border border-slate-200 relative`}>
          {/* Browser Top Bar */}
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-xl h-8 flex items-center px-4 overflow-hidden">
              <span className="text-[10px] font-bold text-slate-300 truncate">{window.location.host}/preview/${data.name.replace(/\s+/g, '').toLowerCase()}</span>
            </div>
          </div>
          <div id="preview-scroll-container" className={`h-[75vh] overflow-y-auto scroll-smooth custom-scrollbar ${viewMode === 'mobile' ? 'force-mobile' : viewMode === 'tablet' ? 'force-tablet' : ''}`}>
            <TemplateTwo data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;