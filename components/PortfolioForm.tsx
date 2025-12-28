
import React, { useState } from 'react';
import { PortfolioData, Project, GalleryItem, Experience, CustomLink, Certification, ProjectLink } from '../types';
import { Plus, Trash2, Github, Linkedin, Instagram, Camera, GraduationCap, Briefcase, User, Sparkles, Image as ImageIcon, X, Tag, Settings, Phone, MapPin, ExternalLink, Link as LinkIcon, Twitter, Award, FileText, Upload, Youtube } from 'lucide-react';

interface Props {
  initialData: PortfolioData;
  onSubmit: (data: PortfolioData) => void;
}

const PortfolioForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [data, setData] = useState<PortfolioData>({
    ...initialData,
    experiences: initialData.experiences || [],
    certifications: initialData.certifications || [],
    customLinks: initialData.customLinks || [],
    projects: initialData.projects || [],
    gallery: initialData.gallery || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'photo' || field === 'educationImage' || field === 'resume') {
          setData(prev => ({ ...prev, [field]: result }));
        } else if (field === 'projectImage' && typeof index === 'number') {
          const updatedProjects = [...data.projects];
          updatedProjects[index] = { ...updatedProjects[index], image: result };
          setData(prev => ({ ...prev, projects: updatedProjects }));
        } else if (field === 'certImage' && typeof index === 'number') {
          const updatedCerts = [...data.certifications];
          updatedCerts[index] = { ...updatedCerts[index], image: result };
          setData(prev => ({ ...prev, certifications: updatedCerts }));
        } else if (field === 'galleryImage') {
          setData(prev => ({
            ...prev,
            gallery: [...prev.gallery, { image: result, caption: '' }]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryItem = (index: number) => {
    setData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    const updatedProjects = [...data.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updatedExps = [...data.experiences];
    updatedExps[index] = { ...updatedExps[index], [field]: value };
    setData(prev => ({ ...prev, experiences: updatedExps }));
  };

  const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
    const updatedCerts = [...data.certifications];
    updatedCerts[index] = { ...updatedCerts[index], [field]: value };
    setData(prev => ({ ...prev, certifications: updatedCerts }));
  };

  const handleCustomLinkChange = (index: number, field: keyof CustomLink, value: string) => {
    const updatedLinks = [...data.customLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setData(prev => ({ ...prev, customLinks: updatedLinks }));
  };

  const handleProjectLinkChange = (projIndex: number, linkIndex: number, field: keyof ProjectLink, value: string) => {
    const updatedProjects = [...data.projects];
    const updatedLinks = [...(updatedProjects[projIndex].links || [])];
    updatedLinks[linkIndex] = { ...updatedLinks[linkIndex], [field]: value };
    updatedProjects[projIndex] = { ...updatedProjects[projIndex], links: updatedLinks };
    setData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const addProjectLink = (projIndex: number) => {
    const updatedProjects = [...data.projects];
    const updatedLinks = [...(updatedProjects[projIndex].links || [])];
    updatedLinks.push({ label: 'GitHub', url: '' });
    updatedProjects[projIndex] = { ...updatedProjects[projIndex], links: updatedLinks };
    setData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const removeProjectLink = (projIndex: number, linkIndex: number) => {
    const updatedProjects = [...data.projects];
    const updatedLinks = (updatedProjects[projIndex].links || []).filter((_, i) => i !== linkIndex);
    updatedProjects[projIndex] = { ...updatedProjects[projIndex], links: updatedLinks };
    setData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const addProject = () => setData(prev => ({ ...prev, projects: [...prev.projects, { title: '', description: '', links: [] }] }));
  const removeProject = (index: number) => setData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  
  const addExperience = () => setData(prev => ({ ...prev, experiences: [...prev.experiences, { role: '', company: '', period: '', description: '' }] }));
  const removeExperience = (index: number) => setData(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));

  const addCertification = () => setData(prev => ({ ...prev, certifications: [...prev.certifications, { title: '', issuer: '', date: '' }] }));
  const removeCertification = (index: number) => setData(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }));

  const addCustomLink = () => setData(prev => ({ ...prev, customLinks: [...prev.customLinks, { label: '', url: '' }] }));
  const removeCustomLink = (index: number) => setData(prev => ({ ...prev, customLinks: prev.customLinks.filter((_, i) => i !== index) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const SectionTitle = ({ icon: Icon, title, optional }: { icon: any, title: string, optional?: boolean }) => (
    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-2 mt-10">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      {optional && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border">Optional</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SectionTitle icon={User} title="Core Identity" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Display Name</label>
          <input required type="text" name="name" value={data.name} onChange={handleChange} placeholder="Jane Doe" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Professional Subheading</label>
          <input type="text" name="subheading" value={data.subheading} onChange={handleChange} placeholder="e.g. Full Stack Developer" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Hero Badge Text</label>
          <input type="text" name="badgeText" value={data.badgeText} onChange={handleChange} placeholder="e.g. Available for 2025 Internship" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-inner">
              {data.photo ? <img src={data.photo} className="w-full h-full object-cover" /> : <Camera className="text-slate-400 w-5 h-5" />}
            </div>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} className="text-xs text-slate-500 cursor-pointer" />
          </div>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-slate-700">Personal Bio</label>
          <textarea required name="bio" rows={3} value={data.bio} onChange={handleChange} placeholder="Describe yourself in 2-3 sentences..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
        </div>
      </div>

      <SectionTitle icon={FileText} title="Professional Resume" optional />
      <div className="p-8 rounded-[32px] border-2 border-dashed border-slate-200 bg-white flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h4 className="font-bold text-slate-900 mb-2">Upload your resume (PDF/Image)</h4>
        <p className="text-slate-400 text-sm mb-6">Or provide a direct link to your Google Drive / Dropbox below.</p>
        
        <div className="w-full max-w-md space-y-4">
          <label className="block w-full cursor-pointer bg-slate-900 text-white font-black py-3 rounded-xl hover:bg-slate-800 transition-all">
            {data.resume ? 'Change Resume File' : 'Choose File'}
            <input type="file" accept="application/pdf,image/*" onChange={(e) => handleFileUpload(e, 'resume')} className="hidden" />
          </label>
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-100"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase">Or link</span>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
          <input 
            type="url" name="resume" value={data.resume?.startsWith('data:') ? '' : data.resume} 
            onChange={handleChange} 
            placeholder="Direct URL to Resume" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" 
          />
        </div>
      </div>

      <SectionTitle icon={Phone} title="Contact Information" optional />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Phone className="w-3 h-3"/> Phone Number</label>
          <input type="tel" name="phone" value={data.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin className="w-3 h-3"/> Location</label>
          <input type="text" name="address" value={data.address} onChange={handleChange} placeholder="City, Country" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" />
        </div>
      </div>

      <SectionTitle icon={LinkIcon} title="Social Links & Presets" optional />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <Linkedin className="w-5 h-5 text-[#0077b5]" />
          <input type="url" name="linkedin" value={data.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="flex-1 bg-transparent border-none outline-none text-sm" />
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <Github className="w-5 h-5 text-[#333]" />
          <input type="url" name="github" value={data.github} onChange={handleChange} placeholder="GitHub URL" className="flex-1 bg-transparent border-none outline-none text-sm" />
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <Instagram className="w-5 h-5 text-[#e4405f]" />
          <input type="url" name="instagram" value={data.instagram} onChange={handleChange} placeholder="Instagram URL" className="flex-1 bg-transparent border-none outline-none text-sm" />
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <Twitter className="w-5 h-5 text-black" />
          <input type="url" name="x" value={data.x} onChange={handleChange} placeholder="X (Twitter) URL" className="flex-1 bg-transparent border-none outline-none text-sm" />
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <label className="text-sm font-bold text-slate-700">Custom Additional Links</label>
        {data.customLinks.map((link, index) => (
          <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 relative group">
            <input type="text" placeholder="Label (e.g. Portfolio)" value={link.label} onChange={(e) => handleCustomLinkChange(index, 'label', e.target.value)} className="w-1/3 px-4 py-2 rounded-lg border outline-none font-bold" />
            <input type="url" placeholder="URL" value={link.url} onChange={(e) => handleCustomLinkChange(index, 'url', e.target.value)} className="flex-1 px-4 py-2 rounded-lg border outline-none" />
            <button type="button" onClick={() => removeCustomLink(index)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button type="button" onClick={addCustomLink} className="flex items-center gap-2 text-indigo-600 font-bold text-sm px-2 py-2 hover:bg-indigo-50 rounded-lg"><Plus className="w-4 h-4" /> Add Generic Link</button>
      </div>

      <SectionTitle icon={Sparkles} title="Toolkit & Skills" />
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Technical Skills (Comma Separated)</label>
        <input required type="text" name="skills" value={data.skills} onChange={handleChange} placeholder="React, Python, Figma, UI/UX..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" />
      </div>

      <SectionTitle icon={GraduationCap} title="Education" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">University & Degree</label>
          <input required type="text" name="education" value={data.education} onChange={handleChange} placeholder="B.S. Computer Science, University of X (2025)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Education Image (Optional)</label>
          <div className="flex items-center gap-4">
            {data.educationImage && <img src={data.educationImage} className="w-10 h-10 rounded border" />}
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'educationImage')} className="text-xs text-slate-500" />
          </div>
        </div>
      </div>

      <SectionTitle icon={Award} title="Certifications & Awards" optional />
      <div className="space-y-4">
        {data.certifications.map((cert, index) => (
          <div key={index} className="p-6 rounded-3xl border border-slate-200 bg-slate-50 relative group">
            <button type="button" onClick={() => removeCertification(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Title (e.g. AWS Solutions Architect)" value={cert.title} onChange={(e) => handleCertificationChange(index, 'title', e.target.value)} className="w-full px-4 py-2 rounded-lg border outline-none font-bold" />
                <input type="text" placeholder="Issuer (e.g. Amazon Web Services)" value={cert.issuer} onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)} className="w-full px-4 py-2 rounded-lg border outline-none font-bold" />
                <input type="text" placeholder="Date / Year" value={cert.date} onChange={(e) => handleCertificationChange(index, 'date', e.target.value)} className="w-full px-4 py-2 rounded-lg border outline-none text-sm" />
                <input type="url" placeholder="Credential Link (Optional)" value={cert.link || ''} onChange={(e) => handleCertificationChange(index, 'link', e.target.value)} className="w-full px-4 py-2 rounded-lg border outline-none text-xs" />
                <textarea placeholder="Brief description (Optional)" rows={2} value={cert.description || ''} onChange={(e) => handleCertificationChange(index, 'description', e.target.value)} className="md:col-span-2 w-full px-4 py-2 rounded-lg border outline-none resize-none text-sm" />
              </div>
              
              <div className="w-full md:w-32 h-32 flex-shrink-0 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden relative group/img">
                {cert.image ? (
                  <img src={cert.image} className="w-full h-full object-cover" />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-1">
                    <Upload className="text-slate-300 w-6 h-6" />
                    <span className="text-[10px] font-black text-slate-400">UPLOAD</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'certImage', index)} className="hidden" />
                  </label>
                )}
                {cert.image && (
                   <button type="button" onClick={() => handleCertificationChange(index, 'image', '')} className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                     <Trash2 className="text-white w-5 h-5" />
                   </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addCertification} className="flex items-center gap-2 text-indigo-600 font-bold text-sm px-2 py-2 hover:bg-indigo-50 rounded-lg"><Plus className="w-4 h-4" /> Add Certification</button>
      </div>

      <SectionTitle icon={Briefcase} title="Experience" optional />
      <div className="space-y-4">
        {data.experiences.map((exp, index) => (
          <div key={index} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 relative group">
            <button type="button" onClick={() => removeExperience(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Role / Position" value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} className="w-full px-4 py-2 rounded-lg border outline-none font-bold" />
              <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} className="w-full px-4 py-2 rounded-lg border outline-none font-bold" />
              <input type="text" placeholder="Period (e.g. 2022 - 2024)" value={exp.period} onChange={(e) => handleExperienceChange(index, 'period', e.target.value)} className="w-full px-4 py-2 rounded-lg border outline-none" />
              <textarea placeholder="Briefly describe your responsibilities..." rows={2} value={exp.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} className="md:col-span-3 w-full px-4 py-2 rounded-lg border outline-none resize-none" />
            </div>
          </div>
        ))}
        <button type="button" onClick={addExperience} className="flex items-center gap-2 text-indigo-600 font-bold text-sm px-2 py-2 hover:bg-indigo-50 rounded-lg"><Plus className="w-4 h-4" /> Add Experience</button>
      </div>

      <SectionTitle icon={Briefcase} title="Projects" optional />
      <div className="grid grid-cols-1 gap-4">
        {data.projects.map((project, index) => (
          <div key={index} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 relative group">
            <button type="button" onClick={() => removeProject(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow space-y-4">
                <input type="text" placeholder="Project Name" value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} className="w-full px-4 py-2 rounded-lg border outline-none font-bold" />
                <textarea placeholder="Description" rows={2} value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} className="w-full px-4 py-2 rounded-lg border outline-none resize-none" />
                <div className="space-y-3">
                  {project.links?.map((link, linkIndex) => (
                    <div key={linkIndex} className="flex items-center gap-2">
                      <select value={link.label} onChange={(e) => handleProjectLinkChange(index, linkIndex, 'label', e.target.value)} className="px-2 py-2 rounded-lg border bg-white text-xs">
                        <option>GitHub</option>
                        <option>YouTube</option>
                        <option>Live Demo</option>
                        <option>Other</option>
                      </select>
                      <input
                        type="url"
                        placeholder="Link URL"
                        value={link.url}
                        onChange={(e) => handleProjectLinkChange(index, linkIndex, 'url', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border outline-none text-xs"
                      />
                      <button type="button" onClick={() => removeProjectLink(index, linkIndex)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addProjectLink(index)} className="flex items-center gap-2 text-indigo-600 font-bold text-sm px-2 py-1 hover:bg-indigo-50 rounded-lg"><Plus className="w-4 h-4" /> Add Link</button>
                </div>
              </div>
              <div className="w-full md:w-32 h-32 flex-shrink-0 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden relative">
                {project.image ? (
                  <img src={project.image} className="w-full h-full object-cover" />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-1">
                    <ImageIcon className="text-slate-300 w-6 h-6" />
                    <span className="text-[10px] font-black text-slate-400">UPLOAD</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'projectImage', index)} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addProject} className="flex items-center gap-2 text-indigo-600 font-bold text-sm px-2 py-2 hover:bg-indigo-50 rounded-lg"><Plus className="w-4 h-4" /> Add Project</button>
      </div>

      <SectionTitle icon={ImageIcon} title="Gallery" optional />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.gallery.map((item, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border">
            <img src={item.image} className="w-full h-full object-cover" />
            <button type="button" onClick={() => removeGalleryItem(index)} className="absolute top-1 right-1 bg-white/50 p-1 rounded-full"><X className="w-3 h-3" /></button>
          </div>
        ))}
        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
          <Plus className="text-slate-300 w-6 h-6" />
          <span className="text-[10px] font-black text-slate-400 mt-1">ADD PHOTO</span>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'galleryImage')} className="hidden" />
        </label>
      </div>

      <div className="pt-10">
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all">
          NEXT STEP
        </button>
      </div>
    </form>
  );
};

export default PortfolioForm;
