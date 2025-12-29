import { PortfolioData, ThemeType, AnimationType, UIStyle } from '../types';

export const generateStandaloneHTML = (data: PortfolioData): string => {
  const isDark = data.settings.theme === ThemeType.DARK;
  const primaryColor = data.settings.primaryColor;
  const skillsList = data.skills.split(',').map(s => s.trim()).filter(Boolean);
  const softSkillsList = data.softSkills.split(',').map(s => s.trim()).filter(Boolean);
  // Fix: data.settings contains headingFont and bodyFont instead of fontFamily
  const bodyFont = data.settings.bodyFont;
  const headingFont = data.settings.headingFont;

  const getAnimationCSS = () => {
    switch (data.settings.animation) {
      case AnimationType.FADE: return '.reveal { opacity: 0; }';
      // Fix: Changed non-existent 'SLIDE' to 'SLIDE_UP'
      case AnimationType.SLIDE_UP: return '.reveal { opacity: 0; transform: translateY(40px); }';
      // Fix: Changed non-existent 'ZOOM' to 'SCALE_IN'
      case AnimationType.SCALE_IN: return '.reveal { opacity: 0; transform: scale(0.95); }';
      default: return '';
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} | Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Space+Grotesk:wght@400;700&family=Playfair+Display:ital,wght@0,700;1,400&family=Inter:wght@400;700;900&family=Outfit:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: '${bodyFont}', sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4, h5, h6 { font-family: '${headingFont}', sans-serif; }
        ${getAnimationCSS()}
        .reveal.visible { opacity: 1; transform: none; transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .glass { background: ${isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,1)'}; border: 1px solid ${isDark ? 'rgba(51,65,85,1)' : 'rgba(226,232,240,1)'}; border-radius: 40px; }
        .minimal { background: transparent; border: 0; border-radius: 0; box-shadow: none; }
        .neobrutal { background: white; border: 4px solid black; box-shadow: 8px 8px 0px 0px black; border-radius: 0; }
        .elegant { background: ${isDark ? '#0f172a' : '#f8fafc'}; border: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; border-radius: 32px; }
    </style>
</head>
<body class="${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors">
    <div class="max-w-5xl mx-auto py-24 px-6 space-y-12">
        <header class="reveal ${data.settings.uiStyle === UIStyle.GLASS ? 'glass' : data.settings.uiStyle === UIStyle.MINIMAL ? 'minimal' : data.settings.uiStyle === UIStyle.NEOBRUTAL ? 'neobrutal' : 'elegant'} p-12 shadow-2xl flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
            <div class="absolute top-0 right-0 w-80 h-80 blur-[140px] rounded-full opacity-20 pointer-events-none" style="background: ${primaryColor}"></div>
            ${data.photo ? `<img src="${data.photo}" class="w-48 h-48 rounded-[40px] object-cover border-4 border-white dark:border-slate-800 shadow-xl relative z-10">` : ''}
            <div class="relative z-10 text-center md:text-left">
                ${data.badgeText ? `<span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-800 mb-6 inline-block">${data.badgeText}</span>` : ''}
                <h1 class="text-6xl font-black tracking-tighter mb-2 leading-none" style="color: ${primaryColor}">${data.name}</h1>
                ${data.subheading ? `<p class="text-2xl font-bold opacity-60">${data.subheading}</p>` : ''}
            </div>
        </header>

        <main class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${data.sectionOrder.map(id => {
    if (id === 'vsl') {
      const videoId = data.vslUrl?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];
      return data.vslUrl && videoId ? `
                  <div class="reveal glass col-span-1 md:col-span-2 p-10 overflow-hidden mb-8">
                    <span class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-10 block">Video Introduction</span>
                    <div class="aspect-video w-full rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/20">
                       <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=${data.vslAutoplay ? '1' : '0'}&controls=${data.vslShowPlayer ? '1' : '0'}" class="w-full h-full border-0" allowfullscreen></iframe>
                    </div>
                  </div>
                ` : '';
    }
    if (id === 'about') return `
                <div class="reveal glass col-span-1 md:col-span-2 p-10">
                   <span class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6 block">Biography</span>
                   <p class="text-3xl font-black tracking-tight leading-tight">${data.bio}</p>
                </div>
              `;
    if (id === 'skills') return `
                <div class="reveal glass p-10">
                   <span class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6 block">Toolkit</span>
                   ${skillsList.length > 0 ? `
                   <div class="mb-6">
                      <h4 class="text-sm font-black uppercase tracking-widest opacity-60 mb-3">Technical Skills</h4>
                      <div class="flex flex-wrap gap-2">
                         ${skillsList.map(s => `<span class="px-4 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800' : 'bg-slate-50 border'}">${s}</span>`).join('')}
                      </div>
                   </div>
                   ` : ''}
                   ${softSkillsList.length > 0 ? `
                   <div>
                      <h4 class="text-sm font-black uppercase tracking-widest opacity-60 mb-3">Soft Skills</h4>
                      <div class="flex flex-wrap gap-2">
                         ${softSkillsList.map(s => `<span class="px-4 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800' : 'bg-slate-50 border'}">${s}</span>`).join('')}
                      </div>
                   </div>
                   ` : ''}
                </div>
              `;
    if (id === 'projects') return `
                <div class="reveal glass col-span-1 md:col-span-2 p-10">
                   <span class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-8 block">Works</span>
                   <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      ${data.projects.map(p => `
                        <div class="flex items-start gap-4">
                           ${p.image ? `<div class="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0"><img src="${p.image}" class="w-full h-full object-cover"></div>` : ''}
                           <div><h4 class="text-lg font-bold">${p.title}</h4><p class="text-xs opacity-60">${p.description}</p></div>
                        </div>
                      `).join('')}
                   </div>
                </div>
              `;
    return '';
  }).join('')}
        </main>
    </div>
    <script>
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    </script>
</body>
</html>
  `;
};