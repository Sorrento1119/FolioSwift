
import React from 'react';
import { SectionId } from '../types';
import { ChevronUp, ChevronDown, User, Sparkles, Briefcase, GraduationCap, Image as ImageIcon, History, Award, FileText, Pencil } from 'lucide-react';

interface Props {
  order: SectionId[];
  titles: Partial<Record<SectionId, string>>;
  onChange: (newOrder: SectionId[], newTitles: Partial<Record<SectionId, string>>) => void;
}

const sectionInfo: Record<SectionId, { label: string; icon: any; desc: string }> = {
  about: { label: 'Biography', icon: User, desc: 'Your personal story and manifesto' },
  resume: { label: 'Professional Resume', icon: FileText, desc: 'Direct download or link to your CV' },
  skills: { label: 'Expertise', icon: Sparkles, desc: 'Your technical toolkit and soft skills' },
  experience: { label: 'Experience', icon: History, desc: 'Your professional history and internships' },
  projects: { label: 'Portfolio', icon: Briefcase, desc: 'Your best projects and works' },
  education: { label: 'Academic Path', icon: GraduationCap, desc: 'Universities and educational context' },
  gallery: { label: 'Visual Gallery', icon: ImageIcon, desc: 'Life photos and visual artifacts' },
  certifications: { label: 'Honors & Awards', icon: Award, desc: 'Certifications, trophies, and recognition' },
};

const PriorityEditor: React.FC<Props> = ({ order, titles, onChange }) => {
  // Ensure all sections are present in order
  const allSections: SectionId[] = ['about', 'resume', 'skills', 'experience', 'projects', 'education', 'gallery', 'certifications'];
  const currentOrder: SectionId[] = order.filter(id => allSections.includes(id));
  
  // Add missing sections if any
  allSections.forEach(id => {
    if (!currentOrder.includes(id)) currentOrder.push(id);
  });

  const move = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentOrder.length) return;
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    onChange(newOrder, titles);
  };

  const handleTitleChange = (id: SectionId, value: string) => {
    onChange(currentOrder, { ...titles, [id]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Structure & Hierarchy</h2>
        <p className="text-slate-500 font-medium">Drag-and-drop hierarchy (using arrows) and rename sections to match your personal brand.</p>
      </div>

      {currentOrder.map((id, index) => {
        const info = sectionInfo[id];
        const Icon = info.icon;
        const customTitle = titles[id];
        return (
          <div key={id} className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 transition-all hover:border-indigo-200">
            <div className="flex flex-row md:flex-col gap-1">
              <button onClick={() => move(index, 'up')} disabled={index === 0} className="text-slate-300 hover:text-indigo-600 disabled:opacity-30 p-1"><ChevronUp className="w-6 h-6" /></button>
              <button onClick={() => move(index, 'down')} disabled={index === currentOrder.length - 1} className="text-slate-300 hover:text-indigo-600 disabled:opacity-30 p-1"><ChevronDown className="w-6 h-6" /></button>
            </div>
            
            <div className={`p-4 rounded-2xl flex-shrink-0 ${index === 0 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors'}`}><Icon className="w-6 h-6" /></div>
            
            <div className="flex-grow w-full">
              <div className="flex items-center gap-2 mb-1">
                <input 
                  type="text" 
                  value={customTitle || ''} 
                  onChange={(e) => handleTitleChange(id, e.target.value)}
                  placeholder={info.label}
                  className="bg-transparent border-b border-dashed border-slate-200 text-lg font-black text-slate-800 tracking-tight focus:border-indigo-500 outline-none w-full"
                />
                <Pencil className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <p className="text-slate-400 text-xs font-medium">{info.desc}</p>
            </div>

            <div className="hidden lg:flex flex-col items-end text-[10px] font-black uppercase tracking-widest text-slate-300">
               <span>Position</span>
               <span className="text-2xl text-slate-100 font-black leading-none">{index + 1}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriorityEditor;
