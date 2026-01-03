
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
    bentoView?: boolean;
  };
  navbarEnabled: boolean;
  onNavbarChange: (enabled: boolean) => void;
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
  vsl: 'Video Introduction',
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

const AnimationEditor: React.FC<Props> = ({ settings, navbarEnabled, onNavbarChange, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const update = (key: string, value: any) => onChange({ ...settings, [key]: value });

  const applyPreset = (preset: typeof LIGHT_PRESETS[0], isDark: boolean) => {
    onChange({
      ...settings,
      backgroundColor: preset.bg,
      textColor: preset.text,
      headingColor: preset.heading,
      primaryColor: preset.primary,
      theme: isDark ? ThemeType.DARK : ThemeType.LIGHT,
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
      {/* Global Colors */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Droplets className="text-indigo-600 w-5 h-5" /> Color Palette</h3>

        <div className="space-y-12">
          {/* Presets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daylight Themes</label>
              <div className="flex flex-wrap gap-3">
                {LIGHT_PRESETS.map((p) => (
                  <button
                    key={p.name} onClick={() => applyPreset(p, false)}
                    className="w-12 h-12 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 transition-all overflow-hidden p-1 bg-white shadow-sm"
                  >
                    <div className="w-full h-full rounded-xl flex" title={p.name}>
                      <div className="w-1/2 h-full" style={{ backgroundColor: p.bg }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: p.primary }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Midnight Themes</label>
              <div className="flex flex-wrap gap-3">
                {DARK_PRESETS.map((p) => (
                  <button
                    key={p.name} onClick={() => applyPreset(p, true)}
                    className="w-12 h-12 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 transition-all overflow-hidden p-1 bg-white shadow-sm"
                  >
                    <div className="w-full h-full rounded-xl flex" title={p.name}>
                      <div className="w-1/2 h-full" style={{ backgroundColor: p.bg }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: p.primary }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Pickers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-slate-50">
            {[
              { label: 'Site BG', key: 'backgroundColor' },
              { label: 'Accent', key: 'primaryColor' },
              { label: 'Body Text', key: 'textColor' },
              { label: 'Headings', key: 'headingColor' }
            ].map((c) => (
              <div key={c.key} className="flex flex-col items-center gap-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">{c.label}</label>
                <div className="relative w-14 h-14 rounded-2xl shadow-inner border-2 border-slate-100 overflow-hidden ring-offset-4 hover:ring-2 hover:ring-indigo-100 transition-all">
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

      {/* Interface Vibe */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Layers className="text-indigo-600 w-5 h-5" /> Interface Vibe</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(UIStyle).map((style) => (
            <button
              key={style}
              onClick={() => update('uiStyle', style)}
              className={`p-10 rounded-[40px] border-2 text-[10px] font-[1000] uppercase tracking-[0.2em] transition-all flex flex-col items-center gap-5 ${settings.uiStyle === style ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xl' : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-white'}`}
            >
              <div className={`w-12 h-1 bg-current opacity-20 rounded-full`} />
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Layout & Features */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Sun className="text-indigo-600 w-5 h-5" /> Layout & Features</h3>
        <div className="space-y-6">
          <label className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl cursor-pointer group hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm"><Layers className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-black text-slate-700 uppercase tracking-wider">Dynamic Bento View</p>
                <p className="text-xs text-slate-400 font-bold">Split-grid layout for secondary sections</p>
              </div>
            </div>
            <div className="relative">
              <input type="checkbox" checked={settings.bentoView} onChange={(e) => update('bentoView', e.target.checked)} className="sr-only" />
              <div className={`w-14 h-8 rounded-full transition-colors ${settings.bentoView ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.bentoView ? 'translate-x-6' : ''}`}></div>
            </div>
          </label>

          <label className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl cursor-pointer group hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm"><Sun className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-black text-slate-700 uppercase tracking-wider">Sticky Navigation Bar</p>
                <p className="text-xs text-slate-400 font-bold">Floating menu for easy section jumping</p>
              </div>
            </div>
            <div className="relative">
              <input type="checkbox" checked={navbarEnabled} onChange={(e) => onNavbarChange(e.target.checked)} className="sr-only" />
              <div className={`w-14 h-8 rounded-full transition-colors ${navbarEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${navbarEnabled ? 'translate-x-6' : ''}`}></div>
            </div>
          </label>
        </div>
      </div>

      {/* Scroll Animations */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Activity className="text-indigo-600 w-5 h-5" /> Motion Effects</h3>
        <p className="text-slate-400 text-sm mb-8 font-medium italic italic">How elements reveal as you scroll down.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(AnimationType).map((anim) => (
            <button
              key={anim}
              onClick={() => update('animation', anim)}
              className={`p-6 rounded-3xl border-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex flex-col items-center gap-3 ${settings.animation === anim ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-slate-50 bg-slate-50 text-slate-400 hover:bg-white'}`}
            >
              {anim.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimationEditor;
