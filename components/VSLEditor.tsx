
import React, { useState, useEffect } from 'react';
import { Youtube, Play, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { PortfolioData } from '../types';

interface Props {
    data: PortfolioData;
    onChange: (data: PortfolioData) => void;
    onNext: () => void;
    onBack: () => void;
}

const VSLEditor: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
    const [youtubeUrl, setYoutubeUrl] = useState(data.vslUrl || '');

    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return null;
        let videoId = '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            videoId = match[2];
        } else {
            return null;
        }

        let embedUrl = `https://www.youtube.com/embed/${videoId}`;
        const params = [];
        if (data.vslAutoplay) params.push('autoplay=1');
        if (!data.vslShowPlayer) params.push('controls=0');
        if (params.length > 0) embedUrl += `?${params.join('&')}`;

        return embedUrl;
    };

    const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setYoutubeUrl(url);
        onChange({ ...data, vslUrl: url });
    };

    const toggleSetting = (field: 'vslAutoplay' | 'vslShowPlayer') => {
        onChange({ ...data, [field]: !data[field] });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-indigo-600 rounded-[40px] p-8 md:p-12 mb-12 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md border border-white/20">
                            <Youtube className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Video Introduction</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Stand Out with Video.</h2>
                        <p className="text-indigo-100 text-lg font-medium leading-relaxed opacity-90">
                            Recruiters spend seconds on a resume. Give them a reason to stay. A quick <span className="text-white font-bold underline decoration-yellow-400 underline-offset-4">intro video</span> humanizes your application and makes you memorable.
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="w-5 h-5 text-yellow-300" />
                            <span className="font-bold text-sm">Quick Pro-Tip</span>
                        </div>
                        <p className="text-xs text-indigo-50 leading-relaxed">
                            Record a 60-second clip of yourself, upload it to YouTube as "Unlisted", and paste the link here. Be yourself!
                        </p>
                    </div>
                </div>
                {/* Abstract shapes for design */}
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Youtube className="w-4 h-4 text-red-500" /> YouTube Video Link
                        </label>
                        <input
                            type="url"
                            value={youtubeUrl}
                            onChange={handleUrlChange}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium"
                        />
                        <p className="text-[10px] text-slate-400 font-bold ml-1 italic">We support standard and shortened YouTube URLs</p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-400">Video Preferences</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => toggleSetting('vslAutoplay')}
                                className={`flex flex-col items-start p-5 rounded-3xl border-2 transition-all text-left ${data.vslAutoplay ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className={`p-2 rounded-xl mb-3 ${data.vslAutoplay ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <Play className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-slate-900 text-sm mb-1">Auto-Play</span>
                                <span className="text-[10px] text-slate-400 font-medium">Video starts when page loads</span>
                            </button>

                            <button
                                onClick={() => toggleSetting('vslShowPlayer')}
                                className={`flex flex-col items-start p-5 rounded-3xl border-2 transition-all text-left ${data.vslShowPlayer ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className={`p-2 rounded-xl mb-3 ${data.vslShowPlayer ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <Settings className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-slate-900 text-sm mb-1">Video Controls</span>
                                <span className="text-[10px] text-slate-400 font-medium">Show YouTube player controls</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <label className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3 block">Live Preview</label>
                    <div className="aspect-video bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl flex items-center justify-center border-8 border-white group relative">
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Play className="text-white/20 w-8 h-8" />
                                </div>
                                <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em]">Preview will appear here</p>
                            </div>
                        )}

                        {/* Glossy overlay */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent"></div>
                    </div>
                    {!embedUrl && youtubeUrl && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-red-100">
                            <Info className="w-3 h-3" /> Please enter a valid YouTube URL
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mt-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back: Details
                </button>
                <button
                    onClick={onNext}
                    disabled={!youtubeUrl && youtubeUrl !== ''} // Allow empty but can't be invalid if entered
                    className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    Next: Priority <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const Settings = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export default VSLEditor;
