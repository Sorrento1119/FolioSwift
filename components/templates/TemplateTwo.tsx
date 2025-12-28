
import React, { useEffect, useRef, useState } from 'react';
import { PortfolioData, SectionId, UIStyle } from '../../types';
import { Github, Linkedin, Instagram, GraduationCap, Briefcase, Camera, Sparkles, User, History, Phone, MapPin, ExternalLink, Twitter, Award, FileText, X, Maximize2, Youtube, Link } from 'lucide-react';

const TemplateTwo: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const primaryColor = data.settings.primaryColor;
  const bgColor = data.settings.backgroundColor;
  const globalBodyTextColor = data.settings.textColor;
  const globalHeadingColor = data.settings.headingColor;
  const skillsList = data.skills.split(',').map(s => s.trim()).filter(Boolean);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const scrollContainer = document.getElementById('preview-scroll-container');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, root: scrollContainer || null });

    containerRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [data.sectionOrder, data.settings.animation, data.settings.uiStyle, data.settings.backgroundColor, data.settings.sectionColors]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const { uiStyle } = data.settings;

  const getVibeConfig = () => {
    switch (uiStyle) {
      case UIStyle.MINIMAL:
        return {
          container: "max-w-4xl mx-auto space-y-32 py-24 px-8",
          card: "bg-transparent p-0 border-0 shadow-none",
          header: "mb-32 flex flex-col items-start text-left border-b border-black/5 pb-20",
          badge: "text-indigo-600 font-black uppercase text-[10px] tracking-widest block mb-8",
          grid: "flex flex-col gap-24",
          itemSpan: () => "w-full"
        };
      case UIStyle.NEOBRUTAL:
        return {
          container: "max-w-6xl mx-auto p-12 space-y-12",
          card: "bg-white border-[4px] border-black shadow-[10px_10px_0_0_rgba(0,0,0,1)] p-12 rounded-none",
          header: "bg-white border-[4px] border-black shadow-[15px_15px_0_0_rgba(0,0,0,1)] p-16 rounded-none flex flex-col md:flex-row items-center gap-12 mb-12",
          badge: "bg-yellow-400 text-black border-2 border-black px-4 py-1.5 font-black uppercase text-[12px] mb-6 inline-block",
          grid: "grid grid-cols-1 md:grid-cols-2 gap-12",
          itemSpan: (id: string) => (id === 'about' || id === 'experience' || id === 'projects') ? 'md:col-span-2' : ''
        };
      case UIStyle.SWISS:
        return {
          container: "max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-0 border-t border-l border-black/10",
          card: "p-16 border-b border-r border-black/10 rounded-none",
          header: "md:col-span-12 p-24 border-b border-r border-black/10 flex flex-col md:flex-row items-start gap-12 mb-0",
          badge: "bg-black text-white px-3 py-1 font-black uppercase text-[10px] mb-6 inline-block",
          grid: "grid grid-cols-1 md:grid-cols-12 md:col-span-12",
          itemSpan: (id: string) => {
            if (id === 'about' || id === 'experience' || id === 'projects') return 'md:col-span-8';
            return 'md:col-span-4';
          }
        };
      default: // GLASS
        return {
          container: "max-w-5xl mx-auto p-12 space-y-12",
          card: "backdrop-blur-2xl bg-white/30 border border-white/50 shadow-2xl rounded-[64px] p-16",
          header: "backdrop-blur-3xl bg-white/40 border border-white/60 shadow-2xl rounded-[80px] p-20 flex flex-col md:flex-row items-center gap-16 mb-12",
          badge: "bg-white/40 border border-white/40 px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] mb-8 inline-block",
          grid: "grid grid-cols-1 md:grid-cols-2 gap-12",
          itemSpan: (id: string) => id === 'about' ? 'md:col-span-2' : ''
        };
    }
  };

  const vibe = getVibeConfig();

  const getSectionStyles = (id: string) => {
    const override = data.settings.sectionColors?.[id];
    return {
      backgroundColor: override?.bg || 'transparent',
      color: override?.text || globalBodyTextColor,
      fontFamily: data.settings.bodyFont
    };
  };

  const getHeadingColor = (id: string) => {
    const override = data.settings.sectionColors?.[id];
    return override?.heading || globalHeadingColor;
  };

  const getSectionTitle = (id: SectionId, defaultLabel: string) => {
    return data.sectionTitles?.[id] || defaultLabel;
  };

  const Title = ({ label, icon: Icon, color }: { label: string, icon: any, color?: string }) => (
    <div className={`flex items-center gap-4 mb-10`}>
      <Icon className="w-6 h-6" style={{ color: primaryColor }} />
      <span className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40" style={{ color: color }}>{label}</span>
    </div>
  );

  const renderSection = (id: SectionId) => {
    const sStyle = getSectionStyles(id);
    const sHeadingColor = getHeadingColor(id);
    const span = vibe.itemSpan(id);

    switch (id) {
      case 'about':
        return (
          <div key={id} id="about" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('about', 'Biography')} icon={User} color={sHeadingColor} />
            <p className={`${uiStyle === UIStyle.MINIMAL ? 'text-5xl md:text-7xl leading-tight' : 'text-4xl font-black'} tracking-tighter`} style={{ color: sHeadingColor, fontFamily: data.settings.headingFont }}>{data.bio}</p>
          </div>
        );
      case 'resume':
        return data.resume && (
          <div key={id} id="resume" style={sStyle} className={`reveal ${span} transition-all ${vibe.card} flex flex-col items-center justify-center text-center`}>
            <FileText className="w-16 h-16 mb-8" style={{ color: primaryColor }} />
            <h3 className="text-2xl font-black mb-10" style={{ color: sHeadingColor }}>{getSectionTitle('resume', 'Technical Record')}</h3>
            <a href={data.resume} download target="_blank" className={`px-12 py-5 font-black text-xs uppercase tracking-widest text-white shadow-2xl hover:scale-105 transition-all ${uiStyle === UIStyle.NEOBRUTAL || uiStyle === UIStyle.SWISS ? 'rounded-none' : 'rounded-full'}`} style={{ backgroundColor: primaryColor }}>Get Full Resume</a>
          </div>
        );
      case 'skills':
        return (
          <div key={id} id="skills" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('skills', 'Toolbox')} icon={Sparkles} color={sHeadingColor} />
            <div className="flex flex-wrap gap-4">
              {skillsList.map((skill, i) => (
                <span key={i} className={`px-6 py-4 text-xs font-black border transition-all ${uiStyle === UIStyle.NEOBRUTAL || uiStyle === UIStyle.SWISS ? 'rounded-none border-[3px] border-black' : 'rounded-3xl'}`} style={{ color: sStyle.color, borderColor: `${primaryColor}40` }}>{skill}</span>
              ))}
            </div>
          </div>
        );
      case 'experience':
        return data.experiences?.length > 0 && (
          <div key={id} id="experience" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('experience', 'Timeline')} icon={History} color={sHeadingColor} />
            <div className="space-y-20">
              {data.experiences.map((exp, i) => (
                <div key={i} className="flex flex-col md:flex-row justify-between gap-8 border-l-[4px] pl-10" style={{ borderColor: primaryColor }}>
                  <div className="flex-1">
                    <h4 className="text-3xl font-black mb-2" style={{ color: sHeadingColor }}>{exp.role}</h4>
                    <p className="text-sm font-black uppercase tracking-widest opacity-60 mb-6">{exp.company}</p>
                    <p className="text-base leading-relaxed opacity-80" style={{ color: sStyle.color }}>{exp.description}</p>
                  </div>
                  <span className="text-[11px] font-black uppercase opacity-40 whitespace-nowrap pt-2">{exp.period}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return data.projects.length > 0 && (
          <div key={id} id="projects" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('projects', 'Creations')} icon={Briefcase} color={sHeadingColor} />
            <div className="grid grid-cols-1 gap-16">
              {data.projects.map((p, i) => (
                <div key={i} className="group flex flex-col md:flex-row gap-10 items-start">
                  {p.image && <div className={`w-full md:w-64 h-44 flex-shrink-0 overflow-hidden shadow-xl ${uiStyle === UIStyle.GLASS ? 'rounded-[40px]' : 'rounded-none'}`}><img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" /></div>}
                  <div className="flex-1">
                    <h4 className="text-3xl font-black mb-4 flex items-center gap-4" style={{ color: sHeadingColor }}>{p.title}</h4>
                    <p className="text-base opacity-70 leading-relaxed mb-4" style={{ color: sStyle.color }}>{p.description}</p>
                    <div className="flex items-center gap-4 mt-4">
                      {p.links?.map((link, linkIndex) => (
                        <a key={linkIndex} href={link.url} target="_blank" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                          {link.label.toLowerCase() === 'github' && <Github className="w-5 h-5" />}
                          {link.label.toLowerCase() === 'youtube' && <Youtube className="w-5 h-5" />}
                          {link.label.toLowerCase() !== 'github' && link.label.toLowerCase() !== 'youtube' && <Link className="w-5 h-5" />}
                          <span className="text-xs font-bold">{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        return (
          <div key={id} id="education" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('education', 'Foundation')} icon={GraduationCap} color={sHeadingColor} />
            <h3 className="text-2xl font-black mb-6" style={{ color: sHeadingColor }}>{data.education}</h3>
            {data.educationImage && <img src={data.educationImage} className={`w-full h-48 object-cover opacity-90 shadow-lg ${uiStyle === UIStyle.GLASS ? 'rounded-[40px]' : 'rounded-none'}`} />}
          </div>
        );
      case 'gallery':
        return data.gallery.length > 0 && (
          <div key={id} id="gallery" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('gallery', 'Artifacts')} icon={Camera} color={sHeadingColor} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.gallery.map((g, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(g.image)}
                  className={`aspect-square overflow-hidden shadow-lg cursor-pointer group relative ${uiStyle === UIStyle.GLASS ? 'rounded-3xl' : 'rounded-none'}`}
                >
                  <img src={g.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Maximize2 className="text-white w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        return data.certifications?.length > 0 && (
          <div key={id} id="certifications" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('certifications', 'Excellence')} icon={Award} color={sHeadingColor} />
            <div className="space-y-8">
              {data.certifications.map((c, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="p-4 rounded-2xl bg-black/5 group-hover:bg-black/10 transition-colors"><Award className="w-8 h-8 opacity-40" /></div>
                  <div><h4 className="text-lg font-black" style={{ color: sHeadingColor }}>{c.title}</h4><p className="text-[10px] font-black uppercase opacity-40 tracking-widest">{c.issuer} • {c.date}</p></div>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const headerStyles = getSectionStyles('header');
  const headerHeadingColor = getHeadingColor('header');
  const contactStyles = getSectionStyles('contact');
  const contactHeadingColor = getHeadingColor('contact');

  return (
    <div ref={containerRef} className="min-h-full transition-colors duration-700 relative overflow-y-auto" style={{ backgroundColor: bgColor, fontFamily: data.settings.bodyFont }}>
      
      {/* Lightbox / Full Image Viewer */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-20"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
            <X className="w-10 h-10" />
          </button>
          <img 
            src={selectedImage} 
            className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        .reveal { opacity: 0; transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .visible { opacity: 1 !important; transform: none !important; }
        ${data.settings.animation === 'fade' ? '.reveal { opacity: 0; }' : ''}
        ${data.settings.animation === 'slide-up' ? '.reveal { transform: translateY(80px); opacity: 0; }' : ''}
      `}</style>

      {/* STICKY NAVBAR FIXED WITHIN SCROLLABLE CONTAINER */}
      {data.navbarEnabled && (
        <nav className="sticky top-8 mx-auto z-[100] w-max px-8 py-4 bg-white/90 backdrop-blur-3xl border border-slate-200 rounded-full shadow-2xl flex items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          {['about', 'resume', 'experience', 'projects', 'skills'].map((sec) => (
             <button key={sec} onClick={() => scrollTo(sec)} className="p-2.5 rounded-full hover:bg-black/5 text-slate-500 hover:text-indigo-600 transition-all group relative">
                {sec === 'about' && <User className="w-5 h-5" />}
                {sec === 'resume' && <FileText className="w-5 h-5" />}
                {sec === 'experience' && <History className="w-5 h-5" />}
                {sec === 'projects' && <Briefcase className="w-5 h-5" />}
                {sec === 'skills' && <Sparkles className="w-5 h-5" />}
                <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{sec}</span>
             </button>
          ))}
          {data.photo && <img src={data.photo} className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-md object-cover" />}
        </nav>
      )}

      <div className={`${uiStyle === UIStyle.SWISS ? 'max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-0 border-t border-l border-black/10' : vibe.container}`}>
        <header className={`reveal ${vibe.header} relative ${uiStyle === UIStyle.SWISS ? 'md:col-span-12' : ''}`} style={headerStyles}>
          {data.photo && (
            <div className="relative group flex-shrink-0">
               <img src={data.photo} className={`w-56 h-56 object-cover border-[6px] border-white shadow-2xl relative z-10 transition-transform group-hover:rotate-1 ${uiStyle === UIStyle.GLASS ? 'rounded-[72px]' : 'rounded-none'}`} />
            </div>
          )}
          <div className="flex-grow">
            {data.badgeText && <div className={vibe.badge}>{data.badgeText}</div>}
            <h1 className="text-7xl md:text-9xl font-[1000] tracking-[-0.07em] mb-4 leading-none" style={{ color: headerHeadingColor, fontFamily: data.settings.headingFont }}>{data.name || 'Site Identity'}</h1>
            {data.subheading && <p className="text-2xl md:text-3xl font-black opacity-40 leading-tight" style={{ color: headerStyles.color }}>{data.subheading}</p>}
          </div>
        </header>

        {/* Flat list for Swiss grid to handle spans correctly */}
        {uiStyle === UIStyle.SWISS ? (
          <>
            {data.sectionOrder.map(renderSection)}
            <div className="reveal md:col-span-12 transition-all p-16 border-b border-r border-black/10 rounded-none" style={contactStyles}>
               <Title label={getSectionTitle('resume', 'Connection')} icon={Phone} color={contactHeadingColor} />
               <div className="flex flex-wrap gap-6 mb-12">
                  {[
                    { id: 'linkedin', icon: Linkedin, link: data.linkedin, color: '#0077b5' }, 
                    { id: 'github', icon: Github, link: data.github, color: '#171515' }, 
                    { id: 'instagram', icon: Instagram, link: data.instagram, color: '#e4405f' }, 
                    { id: 'x', icon: Twitter, link: data.x, color: '#000' }
                  ].filter(s => s.link).map(s => (
                    <a key={s.id} href={s.link} target="_blank" className="w-16 h-16 flex items-center justify-center border-[3px] border-black bg-white shadow-xl transition-all hover:scale-110 hover:-rotate-2">
                      <s.icon className="w-7 h-7" style={{ color: s.color }} />
                    </a>
                  ))}
               </div>
               <div className="text-[11px] font-[1000] uppercase tracking-[0.5em] opacity-30 leading-loose" style={{ color: contactStyles.color }}>{data.phone} <br /> {data.address}</div>
            </div>
          </>
        ) : (
          <div className={vibe.grid}>
            {data.sectionOrder.map(renderSection)}
            <div className={`reveal ${vibe.card}`} style={contactStyles}>
               <Title label="Connection" icon={Phone} color={contactHeadingColor} />
               <div className="flex flex-wrap gap-6 mb-12">
                  {[
                    { id: 'linkedin', icon: Linkedin, link: data.linkedin, color: '#0077b5' }, 
                    { id: 'github', icon: Github, link: data.github, color: '#171515' }, 
                    { id: 'instagram', icon: Instagram, link: data.instagram, color: '#e4405f' }, 
                    { id: 'x', icon: Twitter, link: data.x, color: '#000' }
                  ].filter(s => s.link).map(s => (
                    <a key={s.id} href={s.link} target="_blank" className={`w-16 h-16 flex items-center justify-center border bg-white shadow-xl transition-all hover:scale-110 hover:-rotate-2 ${uiStyle === UIStyle.GLASS ? 'rounded-[24px]' : 'rounded-none border-[3px] border-black'}`}>
                      <s.icon className="w-7 h-7" style={{ color: s.color }} />
                    </a>
                  ))}
               </div>
               <div className="text-[11px] font-[1000] uppercase tracking-[0.5em] opacity-30 leading-loose" style={{ color: contactStyles.color }}>{data.phone} <br /> {data.address}</div>
            </div>
          </div>
        )}

        <footer className={`reveal py-40 text-center opacity-20 ${uiStyle === UIStyle.SWISS ? 'md:col-span-12 border-r border-b border-black/10' : ''}`} style={{ color: globalBodyTextColor }}>
           <p className="text-[11px] font-black uppercase tracking-[0.6em]">Powered by FolioSwift • 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default TemplateTwo;
