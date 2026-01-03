
import React, { useEffect, useRef, useState } from 'react';
import { PortfolioData, SectionId, UIStyle } from '../../types';
import { Github, Linkedin, Instagram, GraduationCap, Briefcase, Camera, Sparkles, User, History, Phone, MapPin, ExternalLink, Twitter, Award, FileText, X, Maximize2, Youtube, Link, Star, Facebook, Mail, MessageCircle, ArrowRight } from 'lucide-react';

const TemplateTwo: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const primaryColor = data.settings.primaryColor;
  const bgColor = data.settings.backgroundColor;
  const isDark = data.settings.theme === 'dark';
  const globalBodyTextColor = data.settings.textColor;
  const globalHeadingColor = data.settings.headingColor;
  const skillsList = data.skills.split(',').map(s => s.trim()).filter(Boolean);
  const softSkillsList = data.softSkills.split(',').map(s => s.trim()).filter(Boolean);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      case UIStyle.NEON:
        return {
          container: "max-w-6xl mx-auto p-4 sm:p-8 lg:p-12 space-y-12 lg:space-y-20 bg-black/50 backdrop-blur-3xl",
          card: `bg-black/80 backdrop-blur-xl border-2 border-[${primaryColor}] p-6 sm:p-8 lg:p-12 rounded-none shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-[${primaryColor}] before:to-transparent`,
          header: `border-b-2 border-[${primaryColor}] pb-12 lg:pb-20 mb-12 lg:mb-20 flex flex-col items-center text-center gap-8 lg:gap-12`,
          badge: `bg-[${primaryColor}] text-black font-black uppercase text-[10px] lg:text-[12px] tracking-widest px-4 lg:px-6 py-2 mb-6 lg:mb-8 inline-block shadow-[0_0_15px_${primaryColor}]`,
          grid: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12",
          itemSpan: (id: string) => (id === 'vsl' || id === 'about' || id === 'experience' || id === 'projects') ? 'lg:col-span-2' : ''
        };
      case UIStyle.EDITORIAL:
        return {
          container: `max-w-5xl mx-auto p-4 sm:p-8 lg:p-24 space-y-16 lg:space-y-32 ${isDark ? 'bg-zinc-950' : 'bg-white'}`,
          card: `p-6 sm:p-12 lg:p-20 border-l-4 lg:border-l-8 border-current shadow-none rounded-none transition-all ${isDark ? 'bg-zinc-900/50 hover:bg-zinc-900' : 'bg-white hover:bg-zinc-50'}`,
          header: `mb-16 lg:mb-32 flex flex-col items-start text-left border-b-4 lg:border-b-8 border-current pb-12 lg:pb-24 gap-8 lg:gap-12`,
          badge: `font-serif italic text-xl lg:text-2xl mb-6 lg:mb-8 block border-b border-current/10 pb-4 w-full`,
          grid: "flex flex-col gap-16 lg:gap-32",
          itemSpan: (id: string) => "w-full"
        };
      case UIStyle.MINIMAL:
        return {
          container: "max-w-4xl mx-auto space-y-16 lg:space-y-32 py-12 lg:py-24 px-4 sm:px-8",
          card: "bg-transparent p-0 border-0 shadow-none",
          header: `mb-16 lg:mb-32 flex flex-col items-start text-left border-b border-current/10 pb-10 lg:pb-20`,
          badge: "text-indigo-600 font-black uppercase text-[10px] tracking-widest block mb-6 lg:mb-8",
          grid: "flex flex-col gap-12 lg:gap-24",
          itemSpan: (id: string) => "w-full"
        };
      case UIStyle.NEOBRUTAL:
        return {
          container: "max-w-6xl mx-auto p-4 sm:p-8 lg:p-12 space-y-8 lg:space-y-12",
          card: `${isDark ? 'bg-zinc-900' : 'bg-white'} border-[3px] lg:border-[4px] border-current shadow-[6px_6px_0_0_rgba(0,0,0,1)] lg:shadow-[10px_10px_0_0_rgba(0,0,0,1)] p-6 sm:p-8 lg:p-12 rounded-none`,
          header: `${isDark ? 'bg-zinc-900' : 'bg-white'} border-[3px] lg:border-[4px] border-current shadow-[10px_10px_0_0_rgba(0,0,0,1)] lg:shadow-[15px_15px_0_0_rgba(0,0,0,1)] p-8 lg:p-16 rounded-none flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-8 lg:mb-12`,
          badge: "bg-yellow-400 text-black border-2 border-current px-4 py-1.5 font-black uppercase text-[10px] lg:text-[12px] mb-4 lg:mb-6 inline-block",
          grid: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12",
          itemSpan: (id: string) => (id === 'vsl' || id === 'about' || id === 'experience' || id === 'projects') ? 'lg:col-span-2' : ''
        };
      case UIStyle.SWISS:
        return {
          container: "max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-l border-black/10",
          card: "p-6 sm:p-10 lg:p-16 border-b border-r border-black/10 rounded-none overflow-hidden",
          header: "lg:col-span-12 p-8 lg:p-24 border-b border-r border-black/10 flex flex-col lg:flex-row items-start gap-8 lg:gap-12 mb-0 overflow-hidden",
          badge: "bg-black text-white px-3 py-1 font-black uppercase text-[10px] mb-4 lg:mb-6 inline-block",
          grid: "grid grid-cols-1 lg:grid-cols-12 lg:col-span-12",
          itemSpan: (id: string) => {
            if (id === 'vsl' || id === 'about' || id === 'experience' || id === 'projects') return 'lg:col-span-12';
            return 'lg:col-span-4';
          }
        };
      default: // GLASS
        return {
          container: "max-w-5xl mx-auto p-4 sm:p-8 lg:p-12 space-y-8 lg:space-y-12",
          card: `${isDark ? 'backdrop-blur-2xl bg-black/40 border border-white/10' : 'backdrop-blur-2xl bg-white/30 border border-white/50'} shadow-2xl rounded-[32px] lg:rounded-[64px] p-6 sm:p-10 lg:p-16 overflow-hidden`,
          header: `${isDark ? 'backdrop-blur-3xl bg-black/50 border border-white/10' : 'backdrop-blur-3xl bg-white/40 border border-white/60'} shadow-2xl rounded-[40px] lg:rounded-[80px] p-8 lg:p-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-8 lg:mb-12`,
          badge: `${isDark ? 'bg-white/10' : 'bg-white/40'} border border-white/40 px-6 py-2.5 rounded-full font-black text-[10px] lg:text-[11px] uppercase tracking-[0.3em] mb-6 lg:mb-8 inline-block`,
          grid: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12",
          itemSpan: (id: string) => (id === 'vsl' || id === 'about') ? 'lg:col-span-2' : ''
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
      <div className={`p-4 ${uiStyle === UIStyle.NEON ? 'bg-black/50 border border-white/20' : ''}`}>
        <Icon className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: primaryColor }} />
      </div>
      <span className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.5em] opacity-40 ${uiStyle === UIStyle.EDITORIAL ? 'serif italic text-base lg:text-lg' : ''}`} style={{ color: color }}>{label}</span>
    </div>
  );

  const renderSection = (id: SectionId) => {
    const sStyle = getSectionStyles(id);
    const sHeadingColor = getHeadingColor(id);
    const span = vibe.itemSpan(id);

    switch (id) {
      case 'vsl':
        const videoId = data.vslUrl?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];
        return data.vslUrl && videoId && (
          <div key={id} id="vsl" style={sStyle} className={`reveal ${span} transition-all ${vibe.card} ${uiStyle === UIStyle.MINIMAL ? 'py-8 lg:py-12' : ''}`}>
            <div className="mb-8 lg:mb-10">
              <Title label={getSectionTitle('vsl', 'Video Introduction')} icon={Youtube} color={sHeadingColor} />
            </div>
            <div className={`aspect-video w-full overflow-hidden shadow-2xl ${uiStyle === UIStyle.GLASS ? 'rounded-[32px] lg:rounded-[40px]' : (uiStyle === UIStyle.NEOBRUTAL || uiStyle === UIStyle.SWISS || uiStyle === UIStyle.NEON || uiStyle === UIStyle.EDITORIAL) ? 'border-[3px] lg:border-[4px] border-black rounded-none shadow-[6px_6px_0_0_rgba(0,0,0,1)] lg:shadow-[10px_10px_0_0_rgba(0,0,0,1)]' : 'rounded-2xl lg:rounded-3xl'} ${uiStyle === UIStyle.NEON ? `border-[${primaryColor}] shadow-[0_0_20px_${primaryColor}]` : ''}`}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=${data.vslAutoplay ? '1' : '0'}&controls=${data.vslShowPlayer ? '1' : '0'}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );
      case 'about':
        return (
          <div key={id} id="about" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('about', 'About Me')} icon={User} color={sHeadingColor} />
            <p className={`break-words max-w-4xl ${uiStyle === UIStyle.MINIMAL ? 'text-lg sm:text-2xl lg:text-3xl leading-[1.3]' : uiStyle === UIStyle.EDITORIAL ? 'serif text-xl sm:text-2xl lg:text-3xl leading-[1.4] italic font-light' : 'text-base sm:text-xl lg:text-2xl font-black'} tracking-tight`} style={{ color: sHeadingColor, fontFamily: data.settings.headingFont }}>{data.bio}</p>
          </div>
        );
      case 'resume':
        return data.resume && (
          <div key={id} id="resume" style={sStyle} className={`reveal ${span} transition-all ${vibe.card} flex flex-col items-center justify-center text-center`}>
            <FileText className="w-12 h-12 lg:w-16 lg:h-16 mb-6 lg:mb-8" style={{ color: primaryColor }} />
            <h3 className={`text-xl lg:text-2xl font-black mb-8 lg:mb-10 ${uiStyle === UIStyle.EDITORIAL ? 'serif italic text-3xl lg:text-4xl' : ''}`} style={{ color: sHeadingColor }}>{getSectionTitle('resume', 'Technical Record')}</h3>
            <a href={data.resume} download target="_blank" className={`px-8 lg:px-12 py-4 lg:py-5 font-black text-[10px] lg:text-xs uppercase tracking-widest text-white shadow-2xl hover:scale-105 transition-all w-full lg:w-auto text-center ${uiStyle === UIStyle.NEOBRUTAL || uiStyle === UIStyle.SWISS || uiStyle === UIStyle.NEON || uiStyle === UIStyle.EDITORIAL ? 'rounded-none' : 'rounded-full'}`} style={{ backgroundColor: primaryColor }}>Get Full Resume</a>
          </div>
        );
      case 'skills':
        return (
          <div key={id} id="skills" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('skills', 'Technical Skills')} icon={Sparkles} color={sHeadingColor} />
            {skillsList.length > 0 && (
              <div className="mb-6 lg:mb-8">
                <h4 className="text-[10px] lg:text-sm font-black uppercase tracking-widest text-slate-400 mb-3 lg:mb-4">Technical Skills</h4>
                <div className="flex flex-row flex-wrap gap-2 lg:gap-4">
                  {skillsList.map((skill, i) => (
                    <span key={i} className={`px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-black border transition-all ${uiStyle === UIStyle.NEOBRUTAL || uiStyle === UIStyle.SWISS ? 'rounded-none border-[2px] lg:border-[3px] border-black' : 'rounded-2xl lg:rounded-3xl'}`} style={{ color: sStyle.color, borderColor: `${primaryColor}40` }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {softSkillsList.length > 0 && (
              <div>
                <h4 className="text-[10px] lg:text-sm font-black uppercase tracking-widest text-slate-400 mb-3 lg:mb-4">Soft Skills</h4>
                <div className="flex flex-row flex-wrap gap-2 lg:gap-4">
                  {softSkillsList.map((skill, i) => (
                    <span key={i} className={`px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-black border transition-all ${uiStyle === UIStyle.NEOBRUTAL || uiStyle === UIStyle.SWISS ? 'rounded-none border-[2px] lg:border-[3px] border-black' : 'rounded-2xl lg:rounded-3xl'}`} style={{ color: sStyle.color, borderColor: `${primaryColor}40` }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'experience':
        return data.experiences?.length > 0 && (
          <div key={id} id="experience" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('experience', 'Timeline')} icon={History} color={sHeadingColor} />
            <div className="space-y-10 lg:space-y-20">
              {data.experiences.map((exp, i) => (
                <div key={i} className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-8 border-l-[3px] lg:border-l-[4px] pl-5 lg:pl-10" style={{ borderColor: primaryColor }}>
                  <div className="flex-1">
                    <h4 className="text-lg lg:text-3xl font-black mb-2" style={{ color: sHeadingColor }}>{exp.role}</h4>
                    <p className="text-[9px] lg:text-sm font-black uppercase tracking-widest opacity-60 mb-3 lg:mb-6">{exp.company}</p>
                    <p className="text-xs lg:text-base leading-relaxed opacity-80" style={{ color: sStyle.color }}>{exp.description}</p>
                  </div>
                  <span className="text-[9px] lg:text-[11px] font-black uppercase opacity-40 whitespace-nowrap pt-1 lg:pt-2">{exp.period}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return data.projects.length > 0 && (
          <div key={id} id="projects" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('projects', 'Creations')} icon={Briefcase} color={sHeadingColor} />
            <div className="grid grid-cols-1 gap-12 lg:gap-16">
              {data.projects.map((p, i) => (
                <div key={i} className="group flex flex-col gap-6 lg:gap-10 items-start">
                  {p.image && <div className={`w-full h-40 lg:h-56 flex-shrink-0 overflow-hidden shadow-xl ${uiStyle === UIStyle.GLASS ? 'rounded-[32px] lg:rounded-[40px]' : 'rounded-none'}`}><img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" /></div>}
                  <div className="flex-1 w-full">
                    <h4 className="text-xl lg:text-3xl font-black mb-3 lg:mb-4 flex items-center gap-4" style={{ color: sHeadingColor }}>{p.title}</h4>
                    <p className="text-sm lg:text-base opacity-70 leading-relaxed mb-4" style={{ color: sStyle.color }}>{p.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.techStack?.map((tech, i) => (
                        <span key={i} className={`px-3 py-1 text-[10px] lg:text-xs font-bold rounded-full border ${uiStyle === UIStyle.NEOBRUTAL || uiStyle === UIStyle.SWISS ? 'border-2 border-black' : ''}`} style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>{tech}</span>
                      ))}
                    </div>
                    <div className="flex flex-row flex-wrap items-center gap-4 lg:gap-6 mt-4">
                      {p.links?.map((link, linkIndex) => (
                        <a key={linkIndex} href={link.url} target="_blank" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                          {link.label.toLowerCase() === 'github' && <Github className="w-4 h-4" />}
                          {link.label.toLowerCase() === 'youtube' && <Youtube className="w-4 h-4" />}
                          {link.label.toLowerCase() !== 'github' && link.label.toLowerCase() !== 'youtube' && <Link className="w-4 h-4" />}
                          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider">{link.label}</span>
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
            <h3 className="text-xl lg:text-2xl font-black mb-6" style={{ color: sHeadingColor }}>{data.education}</h3>
            {data.educationImage && <div className={`w-full h-48 lg:h-64 overflow-hidden shadow-lg ${uiStyle === UIStyle.GLASS ? 'rounded-[32px] lg:rounded-[40px]' : 'rounded-none'}`}><img src={data.educationImage} className="w-full h-full object-cover opacity-90 transition-transform hover:scale-105" /></div>}
          </div>
        );
      case 'gallery':
        return data.gallery.length > 0 && (
          <div key={id} id="gallery" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('gallery', 'Artifacts')} icon={Camera} color={sHeadingColor} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {data.gallery.map((g, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(g.image)}
                  className={`aspect-square overflow-hidden shadow-lg cursor-pointer group relative ${uiStyle === UIStyle.GLASS ? 'rounded-2xl lg:rounded-3xl' : 'rounded-none'}`}
                >
                  <img src={g.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Maximize2 className="text-white w-5 h-5 lg:w-6 lg:h-6" />
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
            <div className="space-y-8 lg:space-y-12">
              {data.certifications.map((c, i) => (
                <div key={i} className="flex flex-col items-start gap-4 lg:gap-8 group">
                  {c.image && (
                    <img
                      src={c.image}
                      className="w-full lg:w-[200px] h-auto object-cover rounded-2xl border border-slate-100 shadow-sm cursor-pointer"
                      onClick={() => setSelectedImage(c.image)}
                    />
                  )}
                  <div className="flex items-center gap-4 lg:gap-6">
                    {!c.image && <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-black/5 group-hover:bg-black/10 transition-colors"><Award className="w-6 h-6 lg:w-8 lg:h-8 opacity-40" /></div>}
                    <div>
                      <h4 className="text-base lg:text-lg font-black" style={{ color: sHeadingColor }}>{c.title}</h4>
                      <p className="text-[9px] lg:text-[10px] font-black uppercase opacity-40 tracking-widest">{c.issuer} • {c.date}</p>
                      {c.description && <p className="text-xs lg:text-sm opacity-70 mt-2">{c.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'achievements':
        return data.achievements?.length > 0 && (
          <div key={id} id="achievements" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('achievements', 'Achievements')} icon={Star} color={sHeadingColor} />
            <div className="space-y-8 lg:space-y-12">
              {data.achievements.map((a, i) => (
                <div key={i} className="flex flex-col items-start gap-4 lg:gap-8 group">
                  {a.image && (
                    <img
                      src={a.image}
                      className="w-full lg:w-[200px] h-auto object-cover rounded-2xl border border-slate-100 shadow-sm cursor-pointer"
                      onClick={() => setSelectedImage(a.image)}
                    />
                  )}
                  <div className="flex items-center gap-4 lg:gap-6">
                    {!a.image && <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-black/5 group-hover:bg-black/10 transition-colors"><Star className="w-6 h-6 lg:w-8 lg:h-8 opacity-40" /></div>}
                    <div>
                      <h4 className="text-base lg:text-lg font-black" style={{ color: sHeadingColor }}>{a.title}</h4>
                      {a.description && <p className="text-xs lg:text-sm opacity-70 mt-2">{a.description}</p>}
                      <div className="flex items-center gap-4 mt-4">
                        {a.links?.map((link, linkIndex) => (
                          <a key={linkIndex} href={link.url} target="_blank" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                            {link.label.toLowerCase() === 'youtube' && <Youtube className="w-4 h-4" />}
                            {link.label.toLowerCase() === 'instagram' && <Instagram className="w-4 h-4" />}
                            {link.label.toLowerCase() === 'facebook' && <Facebook className="w-4 h-4" />}
                            {link.label.toLowerCase() !== 'youtube' && link.label.toLowerCase() !== 'instagram' && link.label.toLowerCase() !== 'facebook' && <Link className="w-4 h-4" />}
                            <span className="text-[10px] font-bold uppercase tracking-wider">{link.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div key={id} id="contact" style={sStyle} className={`reveal ${span} transition-all ${vibe.card}`}>
            <Title label={getSectionTitle('contact', 'Contact')} icon={Phone} color={sHeadingColor} />
            <div className="flex flex-row flex-wrap lg:flex-row justify-start lg:justify-start gap-3 lg:gap-6 mb-8 lg:mb-12">
              {[
                { id: 'linkedin', icon: Linkedin, link: data.linkedin, color: '#0077b5' },
                { id: 'github', icon: Github, link: data.github, color: '#171515' },
                { id: 'instagram', icon: Instagram, link: data.instagram, color: '#e4405f' },
                { id: 'x', icon: Twitter, link: data.x, color: '#000' },
                { id: 'whatsapp', icon: MessageCircle, link: data.whatsapp ? `https://wa.me/${data.whatsapp.replace(/\D/g, '')}` : '', color: '#25D366' }
              ].filter(s => s.link).map(s => (
                <a key={s.id} href={s.link} target="_blank" className={`w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center border bg-white shadow-xl transition-all hover:scale-110 active:scale-95 ${uiStyle === UIStyle.GLASS ? 'rounded-xl lg:rounded-[24px]' : uiStyle === UIStyle.SWISS ? 'border-[2px] lg:border-[3px] border-black' : 'rounded-none border-[2px] lg:border-[3px] border-black'}`}>
                  <s.icon className="w-5 h-5 lg:w-7 lg:h-7" style={{ color: s.color }} />
                </a>
              ))}
            </div>
            <div className="space-y-4 lg:space-y-6">
              {data.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 opacity-50 flex-shrink-0" style={{ color: sStyle.color }} />
                  <div className="text-[10px] lg:text-[11px] font-[1000] uppercase tracking-[0.3em] lg:tracking-[0.5em] opacity-70 leading-loose break-all" style={{ color: sStyle.color }}>{data.phone}</div>
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 opacity-50 flex-shrink-0" style={{ color: sStyle.color }} />
                  <div className="text-[10px] lg:text-[11px] font-[1000] uppercase tracking-[0.3em] lg:tracking-[0.5em] opacity-70 leading-loose break-all" style={{ color: sStyle.color }}>{data.email}</div>
                </div>
              )}
              {data.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 opacity-50 flex-shrink-0" style={{ color: sStyle.color }} />
                  <div className="text-[10px] lg:text-[11px] font-[1000] uppercase tracking-[0.3em] lg:tracking-[0.5em] opacity-70 leading-loose break-all" style={{ color: sStyle.color }}>{data.address}</div>
                </div>
              )}
            </div>
            {data.customLinks.length > 0 && (
              <div className="flex flex-row flex-wrap gap-3 mt-8">
                {data.customLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all hover:scale-110 ${vibe.card.includes('bg-slate-900') ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-50 text-slate-500 hover:text-white'}`}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    <Link className="w-5 h-5 lg:w-6 lg:h-6" />
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  const headerStyles = getSectionStyles('header');
  const headerHeadingColor = getHeadingColor('header');

  return (
    <div ref={containerRef} className="min-h-full transition-colors duration-700 relative" style={{ backgroundColor: bgColor, fontFamily: data.settings.bodyFont }}>

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
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Outfit:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');

          .serif { font-family: 'Playfair Display', serif; }
          .reveal { opacity: 0; transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
          .visible { opacity: 1 !important; transform: none !important; }
          
          @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slide-up { from { opacity: 0; transform: translateY(80px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          @keyframes blur-in { from { opacity: 0; filter: blur(20px); transform: translateY(20px); } to { opacity: 1; filter: blur(0); transform: translateY(0); } }
          @keyframes bounce { 
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 
            40% {transform: translateY(-30px);} 
            60% {transform: translateY(-15px);} 
          }
          @keyframes skew-in { from { opacity: 0; transform: skewX(-10deg) translateY(40px); } to { opacity: 1; transform: skewX(0) translateY(0); } }
          @keyframes flip { from { opacity: 0; transform: perspective(1000px) rotateX(-30deg); } to { opacity: 1; transform: perspective(1000px) rotateX(0); } }

          ${data.settings.animation === 'fade' ? '.reveal { animation: fade 1s forwards; }' : ''}
          ${data.settings.animation === 'slide-up' ? '.reveal { transform: translateY(80px); opacity: 0; } .visible { animation: slide-up 1s forwards; }' : ''}
          ${data.settings.animation === 'scale-in' ? '.reveal { transform: scale(0.9); opacity: 0; } .visible { animation: scale-in 1s forwards; }' : ''}
          ${data.settings.animation === 'blur-in' ? '.reveal { filter: blur(20px); opacity: 0; } .visible { animation: blur-in 1s forwards; }' : ''}
          ${data.settings.animation === 'bounce' ? '.visible { animation: bounce 1s forwards; }' : ''}
          ${data.settings.animation === 'skew-in' ? '.reveal { transform: skewX(-10deg); opacity: 0; } .visible { animation: skew-in 1s forwards; }' : ''}
          ${data.settings.animation === 'flip' ? '.reveal { transform: perspective(1000px) rotateX(-30deg); opacity: 0; } .visible { animation: flip 1s forwards; }' : ''}
          
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

          /* New Mobile Nav Base Styles */
          .mobile-nav-top, .mobile-nav-bottom { display: none; }

          @media (max-width: 1024px) {
            .desktop-nav { display: none !important; }
            .mobile-nav-top { 
              display: flex !important;
              position: sticky !important;
              top: 0;
              z-index: 150;
            }
            .mobile-nav-bottom {
              display: flex !important;
              position: fixed !important;
              bottom: 1.5rem;
              left: 50%;
              transform: translateX(-50%);
              z-index: 150;
              width: max-content;
              min-width: 280px;
            }
          }

          /* Force Mobile Styles for Preview Mode */
          .force-mobile .grid, .force-mobile .lg\\:grid-cols-12, .force-mobile .lg\\:grid-cols-2 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
          .force-mobile .lg\\:col-span-12, .force-mobile .lg\\:col-span-4, .force-mobile .lg\\:col-span-2 {
            grid-column: span 1 / span 1 !important;
          }
          .force-mobile .flex-row, .force-mobile .lg\\:flex-row {
            flex-direction: column !important;
          }
          .force-mobile .lg\\:w-1\\/2 { width: 100% !important; }

          .force-mobile .lg\\:text-9xl, .force-mobile .text-9xl { font-size: 2rem !important; line-height: 1 !important; }
          .force-mobile .lg\\:text-7xl, .force-mobile .text-7xl { font-size: 1.5rem !important; line-height: 1.1 !important; }
          .force-mobile .lg\\:text-6xl, .force-mobile .text-6xl { font-size: 1.35rem !important; line-height: 1.1 !important; }
          .force-mobile .lg\\:text-4xl, .force-mobile .text-4xl { font-size: 1.25rem !important; line-height: 1.2 !important; }
          .force-mobile .lg\\:text-3xl, .force-mobile .text-3xl { font-size: 1.1rem !important; }
          
          .force-mobile .lg\\:p-24, .force-mobile .lg\\:p-20, .force-mobile .lg\\:p-16, .force-mobile .lg\\:p-12 { padding: 1.25rem !important; }
          
          .force-mobile h1, .force-mobile p { 
            overflow-wrap: break-word !important; 
            word-break: normal !important; 
            hyphens: none !important;
            text-align: left !important;
          }
          
          .force-mobile .desktop-nav { display: none !important; }
          .force-mobile .mobile-nav-top { 
            display: flex !important; 
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            z-index: 150;
          }
          .force-mobile .mobile-nav-bottom { 
            display: flex !important;
            position: sticky !important;
            bottom: 1.5rem !important;
            margin-top: -5rem !important;
            left: 0 !important;
            right: 0 !important;
            margin-left: auto !important;
            margin-right: auto !important;
            transform: none !important;
            z-index: 150;
            width: 85% !important;
            max-width: 320px !important;
            min-width: unset !important;
            justify-content: center !important;
          }
          .force-mobile .mobile-menu-overlay { position: absolute !important; }

          /* Force Tablet Styles for Preview Mode */
          .force-tablet .lg\\:text-9xl, .force-tablet .text-9xl { font-size: 4rem !important; line-height: 1 !important; }
          .force-tablet .lg\\:text-7xl, .force-tablet .text-7xl { font-size: 3rem !important; line-height: 1.1 !important; }
          .force-tablet .lg\\:text-6xl, .force-tablet .text-6xl { font-size: 2.5rem !important; line-height: 1.1 !important; }
          .force-tablet .lg\\:text-4xl, .force-tablet .text-4xl { font-size: 2rem !important; line-height: 1.2 !important; }
          .force-tablet .lg\\:p-24, .force-tablet .lg\\:p-20, .force-tablet .lg\\:p-16 { padding: 3rem !important; }
          .force-tablet h1, .force-tablet p { 
            overflow-wrap: break-word !important; 
            word-break: normal !important; 
            hyphens: none !important;
          }
          
          /* Better Nav Hover Styles */
          .mobile-nav-bottom button .nav-label {
            opacity: 0;
            height: 0;
            overflow: hidden;
            transition: all 0.3s ease;
            font-size: 0;
          }
          @media (hover: hover) {
            .mobile-nav-bottom button:hover .nav-label {
              opacity: 1;
              height: auto;
              margin-top: 4px;
              font-size: 10px;
            }
          }
        `}</style>

      {data.navbarEnabled && (
        <>
          {/* DESKTOP NAVBAR */}
          <nav className="desktop-nav sticky top-8 mx-auto z-[100] w-max px-8 py-4 bg-white/90 backdrop-blur-3xl border border-slate-200 rounded-full shadow-2xl flex items-center justify-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            {data.sectionOrder.filter(sec => {
              if (sec === 'vsl') return data.vslUrl;
              if (sec === 'about') return data.bio;
              if (sec === 'resume') return data.resume;
              if (sec === 'experience') return data.experiences?.length > 0;
              if (sec === 'projects') return data.projects?.length > 0;
              if (sec === 'skills') return data.skills?.split(',').filter(s => s.trim()).length > 0;
              if (sec === 'achievements') return data.achievements?.length > 0;
              if (sec === 'certifications') return data.certifications?.length > 0;
              if (sec === 'gallery') return data.gallery?.length > 0;
              if (sec === 'education') return data.education;
              if (sec === 'contact') return data.phone || data.email || data.address || data.whatsapp || data.linkedin || data.github || data.instagram || data.x || data.customLinks.length > 0;
              return false;
            }).slice(0, 9).map((sec) => (
              <button key={sec} onClick={() => scrollTo(sec)} className="p-2.5 rounded-full hover:bg-black/5 text-slate-500 hover:text-indigo-600 transition-all group relative">
                {sec === 'vsl' && <Youtube className="w-5 h-5" />}
                {sec === 'about' && <User className="w-5 h-5" />}
                {sec === 'resume' && <FileText className="w-5 h-5" />}
                {sec === 'experience' && <History className="w-5 h-5" />}
                {sec === 'projects' && <Briefcase className="w-5 h-5" />}
                {sec === 'skills' && <Sparkles className="w-5 h-5" />}
                {sec === 'achievements' && <Star className="w-5 h-5" />}
                {sec === 'certifications' && <Award className="w-5 h-5" />}
                {sec === 'gallery' && <Camera className="w-5 h-5" />}
                {sec === 'education' && <GraduationCap className="w-5 h-5" />}
                {sec === 'contact' && <Phone className="w-5 h-5" />}
                <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{getSectionTitle(sec as SectionId, sec)}</span>
              </button>
            ))}
            {data.photo && <img src={data.photo} className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-md object-cover flex-shrink-0" />}
          </nav>

          {/* MOBILE TOP HEADER */}
          <div className="mobile-nav-top w-full px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3">
              {data.photo && <img src={data.photo} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100" />}
              <span className="font-bold text-sm tracking-tighter truncate max-w-[150px]">{data.name}</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 active:scale-90 transition-transform"
            >
              <div className="flex flex-col gap-1.5 items-end">
                <div className="w-6 h-0.5 bg-current rounded-full" />
                <div className="w-4 h-0.5 bg-current rounded-full" />
                <div className="w-5 h-0.5 bg-current rounded-full" />
              </div>
            </button>
          </div>


          {/* MOBILE FULL SCREEN MENU */}
          {isMobileMenuOpen && (
            <div className="mobile-menu-overlay fixed inset-0 z-[200] bg-white/95 backdrop-blur-2xl p-8 flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-16">
                <span className="text-2xl font-black tracking-tighter uppercase" style={{ color: primaryColor }}>{data.name || 'Navigation'}</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6 overflow-y-auto pb-20 no-scrollbar">
                {data.sectionOrder.map((id) => {
                  const label = getSectionTitle(id, id === 'vsl' ? 'Video Introduction' : id);
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        scrollTo(id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left py-4 border-b border-slate-100 group flex items-center justify-between"
                    >
                      <span className="text-4xl font-black tracking-tighter opacity-90 group-hover:translate-x-4 transition-transform group-hover:text-indigo-600 uppercase">{label}</span>
                      <ArrowRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <div className={`${uiStyle === UIStyle.SWISS ? 'max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-l border-black/10' : vibe.container}`}>
        <header className={`reveal ${vibe.header} relative ${uiStyle === UIStyle.SWISS ? 'lg:col-span-12' : ''}`} style={headerStyles}>
          {data.photo && (
            <div className="relative group flex-shrink-0">
              <img src={data.photo} className={`w-32 h-32 lg:w-56 lg:h-56 object-cover border-[3px] lg:border-[6px] border-white shadow-2xl relative z-10 transition-transform group-hover:rotate-1 ${uiStyle === UIStyle.GLASS ? 'rounded-[32px] lg:rounded-[72px]' : 'rounded-none'}`} />
            </div>
          )}
          <div className="flex-grow w-full overflow-hidden">
            {data.badgeText && <div className={vibe.badge}>{data.badgeText}</div>}
            <h1 className="text-2xl sm:text-6xl lg:text-9xl font-[1000] tracking-[-0.07em] mb-4 leading-[0.9] lg:leading-none break-words" style={{ color: headerHeadingColor, fontFamily: data.settings.headingFont }}>{data.name || 'Site Identity'}</h1>
            {data.subheading && <p className="text-base sm:text-xl lg:text-3xl font-black opacity-40 leading-tight" style={{ color: headerStyles.color }}>{data.subheading}</p>}
          </div>
        </header>

        {/* Flat list for Swiss grid to handle spans correctly */}
        {uiStyle === UIStyle.SWISS ? (
          <>
            {data.sectionOrder.map(renderSection)}
          </>
        ) : (
          data.settings.bentoView && (uiStyle === UIStyle.GLASS || uiStyle === UIStyle.NEOBRUTAL) ? (
            <>
              {data.sectionOrder.includes('vsl') && renderSection('vsl')}
              {data.sectionOrder.includes('about') && renderSection('about')}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div className="w-full lg:w-1/2 space-y-8 lg:space-y-12">
                  {data.sectionOrder.filter(id => id !== 'about' && id !== 'vsl').filter((_, i) => i % 2 === 0).map(id => renderSection(id))}
                </div>
                <div className="w-full lg:w-1/2 space-y-8 lg:space-y-12">
                  {data.sectionOrder.filter(id => id !== 'about' && id !== 'vsl').filter((_, i) => i % 2 !== 0).map(id => renderSection(id))}
                </div>
              </div>
            </>
          ) : (
            <div className={`${vibe.grid} ${data.settings.bentoView ? 'items-start' : ''}`}>
              {data.sectionOrder.map(renderSection)}
            </div>
          )
        )}

        <footer className={`reveal py-16 lg:py-40 text-center opacity-20 ${uiStyle === UIStyle.SWISS ? 'lg:col-span-12 border-r border-b border-black/10' : ''}`} style={{ color: globalBodyTextColor }}>
          <p className="text-[8px] lg:text-[11px] font-black uppercase tracking-[0.6em]">Powered by FolioSwift • 2025</p>
        </footer>
        {data.navbarEnabled && (
          <div className="mobile-nav-bottom p-2 bg-white/90 backdrop-blur-3xl border border-slate-200 rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex items-center gap-2 animate-in slide-in-from-bottom-8 duration-700">
            {/* 1. Video (if available, else About) */}
            {data.vslUrl ? (
              <button
                onClick={() => scrollTo('vsl')}
                className={`group flex-1 flex flex-col items-center justify-center p-3 rounded-2xl transition-all active:scale-95 ${uiStyle === UIStyle.GLASS ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50'}`}
              >
                <Youtube className="w-5 h-5" />
                <span className="nav-label font-black uppercase tracking-tight truncate max-w-[80px] text-center">{getSectionTitle('vsl', 'Video Introduction')}</span>
              </button>
            ) : (
              <button
                onClick={() => scrollTo('about')}
                className="group flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 transition-all active:scale-95"
              >
                <User className="w-5 h-5" />
                <span className="nav-label font-black uppercase tracking-tight truncate max-w-[80px] text-center">{getSectionTitle('about', 'About Me')}</span>
              </button>
            )}

            {/* 2. Projects > Experience > Awards > Certifications (Priority Pick) */}
            {(() => {
              let config = { id: 'projects', icon: Briefcase, label: getSectionTitle('projects', 'Projects') };
              if (data.projects?.length > 0) config = { id: 'projects', icon: Briefcase, label: getSectionTitle('projects', 'Projects') };
              else if (data.experiences?.length > 0) config = { id: 'experience', icon: History, label: getSectionTitle('experience', 'Experience') };
              else if (data.achievements?.length > 0) config = { id: 'achievements', icon: Star, label: getSectionTitle('achievements', 'Achievements') };
              else if (data.certifications?.length > 0) config = { id: 'certifications', icon: Award, label: getSectionTitle('certifications', 'Certifications') };

              const Icon = config.icon;
              return (
                <button
                  onClick={() => scrollTo(config.id as SectionId)}
                  className="group flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 transition-all active:scale-95"
                >
                  <Icon className="w-5 h-5" />
                  <span className="nav-label font-black uppercase tracking-tight truncate max-w-[80px] text-center">{config.label}</span>
                </button>
              );
            })()}

            {/* 3. Contact */}
            <button
              onClick={() => scrollTo('contact')}
              className="group flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 text-white transition-all active:scale-95"
            >
              <Phone className="w-5 h-5" />
              <span className="nav-label font-black uppercase tracking-tight truncate max-w-[80px] text-center">{getSectionTitle('contact', 'Contact')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateTwo;
