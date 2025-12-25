
import React, { useState } from 'react';
import { AnimationType, ThemeType, UIStyle, FontFamily } from '../types';
import { Activity, Palette, Check, Type, Layers, Droplets, ChevronDown, ChevronRight, Settings, RotateCcw, Sun, Moon } from 'lucide-react';

interface Props {
  settings: { 
    animation: AnimationType; 
    theme: ThemeType;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    headingColor: string;
    uiStyle: UIStyle;
    headingFont: FontFamily;
    bodyFont: FontFamily;
    sectionColors?: Record<string, { bg: string; text: string; heading: string }>;
  };
  onChange: (settings: any) => void;
}

const LIGHT_PRESETS = [
  { name: 'Default Light', bg: '#f8fafc', text: '#475569', heading: '#0f172a', primary: '#6366f1' },
  { name: 'Cream Elegant', bg: '#fdfcf0', text: '#6b7280', heading: '#1f2937', primary: '#c2410c' },
  { name: 'Ocean Mist', bg: '#ecfeff', text: '#155e75', heading: '#164e63', primary: '#0ea5e9' },
];

const DARK_PRESETS = [
  { name: 'Deep Night', bg: '#020617', text: '#94a3b8', heading: '#f8fafc', primary: '#8b5cf6' },
  { name: 'Matrix Digital', bg: '#050505', text: '#22c55e', heading: '#4ade80', primary: '#22c55e' },
  { name: 'High Contrast', bg: '#000000', text: '#ffffff', heading: '#ffffff', primary: '#facc15' },
];

const SECTION_LABELS: Record<string, string> = {
  header: 'Header / Core Identity',
  about: 'About / Biography',
  resume: 'Resume Section',
  skills: 'Skills / Toolkit',
  experience: 'Experience Timeline',
  projects: 'Projects / Portfolio',
  education: 'Education Block',
  gallery: 'Visual Gallery',
  certifications: 'Awards & Honors',
  contact: 'Contact / Footer'
};

const AnimationEditor: React.FC<Props> = ({ settings, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const update = (key: string, value: any) => onChange({ ...settings, [key]: value });

  const applyPreset = (preset: typeof LIGHT_PRESETS[0]) => {
    onChange({
      ...settings,
      backgroundColor: preset.bg,
      textColor: preset.text,
      headingColor: preset.heading,
      primaryColor: preset.primary,
      theme: ThemeType.CUSTOM,
      sectionColors: {} 
    });
  };

  const updateSectionColor = (section: string, key: 'bg' | 'text' | 'heading', value: string) => {
    const currentColors = settings.sectionColors || {};
    const sectionConfig = currentColors[section] || { 
      bg: settings.backgroundColor, 
      text: settings.textColor, 
      heading: settings.headingColor 
    };
    onChange({
      ...settings,
      sectionColors: {
        ...currentColors,
        [section]: { ...sectionConfig, [key]: value }
      }
    });
  };

  const resetSection = (section: string) => {
    const currentColors = { ...settings.sectionColors };
    delete currentColors[section];
    onChange({ ...settings, sectionColors: currentColors });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Themes Segregated */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-12">
        <div>
          <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Sun className="text-orange-400 w-5 h-5" /> Light Modes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LIGHT_PRESETS.map((p) => (
              <button 
                key={p.name} onClick={() => applyPreset(p)}
                className="group p-6 rounded-3xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all flex flex-col items-center gap-4 text-center"
              >
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: p.bg }} title="Background" />
                  <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: p.primary }} title="Brand" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Moon className="text-indigo-400 w-5 h-5" /> Dark Modes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DARK_PRESETS.map((p) => (
              <button 
                key={p.name} onClick={() => applyPreset(p)}
                className="group p-6 rounded-3xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all flex flex-col items-center gap-4 text-center"
              >
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: p.bg }} />
                  <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: p.primary }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Global Colors */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Droplets className="text-indigo-600 w-5 h-5" /> Global Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Site Background', key: 'backgroundColor' },
            { label: 'Global Text', key: 'textColor' },
            { label: 'Heading Text', key: 'headingColor' },
            { label: 'Accent Color', key: 'primaryColor' }
          ].map((c) => (
            <div key={c.key} className="flex flex-col items-center gap-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">{c.label}</label>
              <div className="relative w-16 h-16 rounded-2xl shadow-inner border-2 border-slate-100 overflow-hidden ring-offset-4 hover:ring-2 hover:ring-indigo-100 transition-all">
                <input 
                  type="color" 
                  value={settings[c.key as keyof typeof settings] as string} 
                  onChange={(e) => update(c.key, e.target.value)} 
                  className="absolute inset-0 opacity-0 cursor-pointer scale-[5]" 
                />
                <div className="w-full h-full" style={{ backgroundColor: settings[c.key as keyof typeof settings] as string }} />
              </div>
            </div>
          ))}
        </div>

        {/* ADVANCED OVERRIDES */}
        <div className="mt-12 pt-10 border-t border-slate-50">
           <button 
            onClick={() => setShowAdvanced(!showAdvanced)} 
            className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:opacity-70 transition-all"
           >
             {showAdvanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
             Advanced Per-Section Overrides
             <Settings className="w-3.5 h-3.5 ml-2 opacity-50" />
           </button>

           {showAdvanced && (
             <div className="mt-8 grid grid-cols-1 gap-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {Object.keys(SECTION_LABELS).map((id) => {
                  const hasOverride = settings.sectionColors?.[id];
                  return (
                    <div key={id} className={`p-6 rounded-3xl transition-all border ${hasOverride ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-transparent'}`}>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-black text-slate-700">{SECTION_LABELS[id]}</span>
                        {hasOverride && (
                          <button onClick={() => resetSection(id)} className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-2 hover:underline">
                            <RotateCcw className="w-3.5 h-3.5" /> Sync Global
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-8">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">BG</span>
                          <input 
                            type="color" 
                            value={settings.sectionColors?.[id]?.bg || settings.backgroundColor} 
                            onChange={(e) => updateSectionColor(id, 'bg', e.target.value)}
                            className="w-10 h-10 rounded-xl border-none bg-transparent cursor-pointer shadow-sm"
                          />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">BODY</span>
                          <input 
                            type="color" 
                            value={settings.sectionColors?.[id]?.text || settings.textColor} 
                            onChange={(e) => updateSectionColor(id, 'text', e.target.value)}
                            className="w-10 h-10 rounded-xl border-none bg-transparent cursor-pointer shadow-sm"
                          />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">TITLE</span>
                          <input 
                            type="color" 
                            value={settings.sectionColors?.[id]?.heading || settings.headingColor} 
                            onChange={(e) => updateSectionColor(id, 'heading', e.target.value)}
                            className="w-10 h-10 rounded-xl border-none bg-transparent cursor-pointer shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
             </div>
           )}
        </div>
      </div>

      {/* UI Vibes */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Layers className="text-indigo-600 w-5 h-5" /> Interface Vibe</h3>
        <p className="text-slate-400 text-sm mb-8 font-medium italic">Rebuilt from scratch for maximum distinction.</p>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(UIStyle).map((style) => (
            <button 
              key={style} 
              onClick={() => update('uiStyle', style)} 
              className={`p-8 rounded-[32px] border-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex flex-col items-center gap-4 ${settings.uiStyle === style ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-white'}`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimationEditor;
