
import React, { useEffect, useRef, useState } from 'react';
import { PortfolioData, ThemeType, AnimationType, SectionId } from '../../types';
import { Github, Linkedin, Instagram, ArrowRight, Sparkles, Youtube, Link, X, Mail, MessageCircle } from 'lucide-react';

const TemplateOne: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const isDark = data.settings.theme === ThemeType.DARK;
  const primaryColor = data.settings.primaryColor;
  const globalBodyTextColor = data.settings.textColor;
  const globalHeadingColor = data.settings.headingColor;
  const skillsList = data.skills.split(',').map(s => s.trim()).filter(Boolean);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const scrollContainer = document.getElementById('preview-scroll-container');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else if (entry.boundingClientRect.top > (scrollContainer?.clientHeight || window.innerHeight)) {
          entry.target.classList.remove('visible');
        }
      });
    }, { 
      threshold: 0.1,
      root: scrollContainer || null,
      rootMargin: '0px 0px -50px 0px' 
    });

    const animatedElements = containerRef.current?.querySelectorAll('.reveal');
    animatedElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [data.sectionOrder, data.settings.animation, data.settings.theme, data.settings.primaryColor]);
  const getSectionStyles = (id: string) => {
    const override = data.settings.sectionColors?.[id];
    return {
      backgroundColor: override?.bg || 'transparent',
      color: override?.text || globalBodyTextColor,
    };
  };

  const getHeadingColor = (id: string) => {
    const override = data.settings.sectionColors?.[id];
    return override?.heading || globalHeadingColor;
  };

  const getSectionTitle = (id: SectionId, defaultLabel: string) => {
    return data.sectionTitles?.[id] || defaultLabel;
  };

  const renderSection = (id: SectionId) => {
    const sStyle = getSectionStyles(id);
    const sHeadingColor = getHeadingColor(id);

    switch (id) {
      case 'about':
        return (
          <section key={id} style={sStyle} className="reveal grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40 p-10 rounded-[40px]">
            <div className="lg:col-span-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8" style={{ color: primaryColor }}>{getSectionTitle('about', 'About')}</h2>
              <p className={`text-4xl leading-tight font-black tracking-tighter`} style={{ color: sHeadingColor }}>{data.bio}</p>
            </div>
          </section>
        );
      case 'skills':
        return (
          <section key={id} style={sStyle} className="reveal mb-40 p-10 rounded-[40px]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-12 flex items-center gap-4" style={{ color: primaryColor }}>
               {getSectionTitle('skills', 'Toolkit')} <div className={`h-px flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
            </h2>
            <div className="flex flex-wrap gap-4">
              {skillsList.map((skill, i) => (
                <span key={i} className={`px-8 py-4 rounded-[24px] font-black text-sm border transition-all duration-300 hover:scale-110 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`} style={{ color: sStyle.color }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        );
      case 'projects':
        return data.projects.length > 0 && (
          <section key={id} style={sStyle} className="reveal mb-40 p-10 rounded-[40px]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-16" style={{ color: primaryColor }}>{getSectionTitle('projects', 'Selected Works')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {data.projects.map((project, i) => (
                <div key={i} className="group flex flex-col">
                  <div 
                    className={`mb-8 overflow-hidden rounded-[40px] aspect-[16/10] relative border transition-all duration-700 group-hover:shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}
                  >
                    {project.image ? (
                      <img src={project.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}08` }}>
                        <div className="w-16 h-1 rounded-full animate-pulse" style={{ backgroundColor: `${primaryColor}20` }} />
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to top, ${primaryColor}30, transparent)` }} />
                  </div>
                  <h3 className="text-3xl font-black mb-4 flex items-center gap-4 tracking-tighter" style={{ color: sHeadingColor }}>
                    {project.title} <ArrowRight className="w-8 h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: primaryColor }} />
                  </h3>
                  <p className={`text-xl leading-relaxed font-medium mb-4`} style={{ color: sStyle.color }}>{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack?.map((tech, i) => (
                      <span key={i} className={`px-3 py-1 text-xs font-bold rounded-full border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>{tech}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    {project.links?.map((link, linkIndex) => (
                      <a key={linkIndex} href={link.url} target="_blank" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                        {link.label.toLowerCase() === 'github' && <Github className="w-5 h-5" />}
                        {link.label.toLowerCase() === 'youtube' && <Youtube className="w-5 h-5" />}
                        {link.label.toLowerCase() !== 'github' && link.label.toLowerCase() !== 'youtube' && <Link className="w-5 h-5" />}
                        <span className="text-xs font-bold">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return (
          <section key={id} style={sStyle} className="reveal mb-40 p-10 rounded-[40px]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10" style={{ color: primaryColor }}>{getSectionTitle('education', 'Education')}</h2>
            <div 
              className={`p-10 rounded-[48px] border relative overflow-hidden flex flex-col lg:flex-row gap-12 items-center transition-all duration-500 ${isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-indigo-50/10 border-indigo-100'}`}
              style={{ borderColor: `${primaryColor}20` }}
            >
               <div className="flex-1 z-10">
                  <div className="inline-flex items-center gap-2 mb-4" style={{ color: primaryColor }}>
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Scholar</span>
                  </div>
                  <h3 className="text-4xl font-black mb-6 tracking-tight leading-tight" style={{ color: sHeadingColor }}>{data.education}</h3>
               </div>
               {data.educationImage && (
                  <div className="w-full lg:w-[350px] h-[250px] rounded-[32px] overflow-hidden border-4 border-white shadow-xl hover:rotate-1 transition-transform">
                     <img src={data.educationImage} className="w-full h-full object-cover" />
                  </div>
               )}
            </div>
          </section>
        );
      case 'gallery':
        return data.gallery.length > 0 && (
          <section key={id} style={sStyle} className="reveal mb-40 p-10 rounded-[40px]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-16 text-center" style={{ color: primaryColor }}>{getSectionTitle('gallery', 'Gallery')}</h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
               {data.gallery.map((item, i) => (
                  <div key={i} className={`relative rounded-[32px] overflow-hidden border break-inside-avoid shadow-lg hover:shadow-2xl transition-all duration-500 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                     <img src={item.image} className="w-full object-cover" />
                     {item.caption && (
                        <div 
                          className="p-6 backdrop-blur-xl absolute bottom-0 inset-x-0 border-t border-white/10 opacity-0 hover:opacity-100 transition-all transform translate-y-2 hover:translate-y-0"
                          style={{ backgroundColor: `${primaryColor}cc` }}
                        >
                           <p className="text-white text-[10px] font-black uppercase tracking-widest">{item.caption}</p>
                        </div>
                     )}
                  </div>
               ))}
            </div>
          </section>
        );
      case 'certifications':
        return data.certifications?.length > 0 && (
          <section key={id} style={sStyle} className="reveal mb-40 p-10 rounded-[40px]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-12 flex items-center gap-4" style={{ color: primaryColor }}>
               {getSectionTitle('certifications', 'Certifications')} <div className={`h-px flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.certifications.map((certification, i) => (
                <div key={i} className="flex items-start gap-6">
                  {certification.image && <img src={certification.image} className="w-24 h-24 object-cover rounded-2xl border border-slate-100 shadow-sm cursor-pointer" onClick={() => setSelectedImage(certification.image)} />}
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: sHeadingColor }}>{certification.title}</h3>
                    <p className="text-sm opacity-70 mb-2">{certification.issuer}</p>
                    <p className="text-xs opacity-50">{certification.date}</p>
                    {certification.description && <p className="text-sm opacity-70 mt-2">{certification.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'contact':
        return (
          <section key={id} style={sStyle} className="reveal mb-40 p-10 rounded-[40px]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-12 flex items-center gap-4" style={{ color: primaryColor }}>
               {getSectionTitle('contact', 'Contact')} <div className={`h-px flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.phone && (
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6" style={{ color: primaryColor }} />
                  <span className="text-lg font-bold" style={{ color: sHeadingColor }}>{data.phone}</span>
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6" style={{ color: primaryColor }} />
                  <span className="text-lg font-bold" style={{ color: sHeadingColor }}>{data.email}</span>
                </div>
              )}
              {data.address && (
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6" style={{ color: primaryColor }} />
                  <span className="text-lg font-bold" style={{ color: sHeadingColor }}>{data.address}</span>
                </div>
              )}
            </div>
            <div className="flex gap-6 mt-8">
              {[
                { id: 'linkedin', icon: Linkedin, link: data.linkedin },
                { id: 'github', icon: Github, link: data.github },
                { id: 'instagram', icon: Instagram, link: data.instagram },
                { id: 'x', icon: Twitter, link: data.x },
                { id: 'whatsapp', icon: MessageCircle, link: data.whatsapp ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}` : '' }
              ].filter(s => s.link).map(social => (
                <a 
                  key={social.id} 
                  href={social.link} 
                  target="_blank" 
                  className={`p-4 rounded-[20px] transition-all hover:scale-110 ${isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-50 text-slate-500 hover:text-white'}`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                >
                  <social.icon className="w-6 h-6" style={social.id === 'whatsapp' ? { color: '#25D366' } : {}} />
                </a>
              ))}
              {data.customLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  className={`p-4 rounded-[20px] transition-all hover:scale-110 ${isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-50 text-slate-500 hover:text-white'}`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                >
                  <Link className="w-6 h-6" />
                </a>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const headerStyles = getSectionStyles('header');
  const headerHeadingColor = getHeadingColor('header');
  const contactStyles = getSectionStyles('contact');
  const contactHeadingColor = getHeadingColor('contact');

  return (
    <div ref={containerRef} className={`min-h-full transition-colors duration-1000 relative overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} font-sans`}>
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
        .reveal { 
          opacity: 0; 
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .visible { opacity: 1 !important; transform: none !important; }
        
        ${data.settings.animation === AnimationType.FADE ? '.reveal { opacity: 0; }' : ''}
        ${data.settings.animation === AnimationType.SLIDE_UP ? '.reveal { transform: translateY(80px); }' : ''}
        ${data.settings.animation === AnimationType.SCALE_IN ? '.reveal { transform: scale(0.9); }' : ''}
        
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .float { animation: float 6s ease-in-out infinite; }
      `}</style>

      <div className="relative z-10 max-w-5xl mx-auto py-32 px-6 md:px-12">
        <header className="reveal text-center mb-40 p-12 rounded-[48px]" style={headerStyles}>
          {data.photo && (
            <div className="relative inline-block mb-12 float">
              <div className="absolute inset-0 rounded-full blur-[80px] opacity-20 scale-150" style={{ backgroundColor: primaryColor }}></div>
              <img src={data.photo} className="relative w-56 h-56 rounded-full mx-auto object-cover ring-[20px] ring-black/5 border-4 border-white shadow-2xl" />
            </div>
          )}
          <h1 className="text-7xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.8]" style={{ color: headerHeadingColor }}>{data.name}</h1>
          <p className="text-2xl font-black tracking-tight opacity-60 max-w-2xl mx-auto uppercase tracking-widest">{data.education}</p>
        </header>

        {data.sectionOrder.map(renderSection)}

        <footer className={`reveal pt-32 border-t flex flex-col md:flex-row justify-between items-center gap-12 p-12 rounded-[48px] ${isDark ? 'border-slate-800' : 'border-slate-100'}`} style={contactStyles}>
          {!data.sectionOrder.includes('contact') && (
            <div className="flex gap-6">
              {[
                { id: 'linkedin', icon: Linkedin, link: data.linkedin },
                { id: 'github', icon: Github, link: data.github },
                { id: 'instagram', icon: Instagram, link: data.instagram }
              ].filter(s => s.link).map(social => (
                <a 
                  key={social.id} 
                  href={social.link} 
                  target="_blank" 
                  className={`p-5 rounded-[24px] transition-all hover:scale-110 ${isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-50 text-slate-500 hover:text-white'}`}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                >
                  <social.icon className="w-8 h-8" />
                </a>
              ))}
            </div>
          )}
          <div className="text-center md:text-right opacity-60">
            <p className="text-2xl font-black mb-2 tracking-tighter" style={{ color: contactHeadingColor }}>{data.name}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: primaryColor }}>© {new Date().getFullYear()} FOLIOSWIFT</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TemplateOne;
