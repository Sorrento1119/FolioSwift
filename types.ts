
export enum AnimationType {
  NONE = 'none',
  FADE = 'fade',
  SLIDE_UP = 'slide-up',
  SCALE_IN = 'scale-in',
  BLUR_IN = 'blur-in',
  BOUNCE = 'bounce',
  SKEW_IN = 'skew-in',
  FLIP = 'flip'
}

export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
  CUSTOM = 'custom'
}

export enum UIStyle {
  GLASS = 'Glassmorphism',
  MINIMAL = 'Minimalist',
  NEOBRUTAL = 'Neobrutalism',
  SWISS = 'Swiss Grid',
  NEON = 'Neon Cyber',
  EDITORIAL = 'Editorial Serif'
}

export enum FontFamily {
  JAKARTA = 'Plus Jakarta Sans',
  SPACE = 'Space Grotesk',
  PLAYFAIR = 'Playfair Display',
  INTER = 'Inter',
  OUTFIT = 'Outfit',
  MONTSERRAT = 'Montserrat',
  SYNE = 'Syne',
  DM_SANS = 'DM Sans'
}

export type SectionId = 'vsl' | 'about' | 'skills' | 'projects' | 'gallery' | 'education' | 'experience' | 'certifications' | 'resume' | 'achievements' | 'contact';

export interface GalleryItem {
  image: string;
  caption?: string;
}


export interface AchievementLink {
  label: string;
  url: string;
}

export interface Achievement {
  title: string;
  description: string;
  image?: string;
  links?: AchievementLink[];
}
export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  image?: string;
  link?: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  description: string;
  image?: string;
  links?: ProjectLink[];
  techStack?: string[];
}

export interface CustomLink {
  label: string;
  url: string;
}

export interface SectionColor {
  bg: string;
  text: string;
  heading: string;
}

export interface PortfolioData {
  name: string;
  subheading?: string;
  badgeText?: string;
  photo: string;
  bio: string;
  education: string;
  educationImage?: string;
  skills: string;
  phone?: string;
  address?: string;
  email?: string;
  whatsapp?: string;
  resume?: string;
  projects: Project[];
  achievements: Achievement[];
  experiences: Experience[];
  certifications: Certification[];
  gallery: GalleryItem[];
  customLinks: CustomLink[];
  linkedin?: string;
  github?: string;
  instagram?: string;
  x?: string;
  vslUrl?: string;
  vslAutoplay?: boolean;
  vslShowPlayer?: boolean;
  sectionOrder: SectionId[];
  sectionTitles?: Partial<Record<SectionId, string>>;
  navbarEnabled: boolean;
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
    sectionColors?: Record<string, SectionColor>;
    bentoView?: boolean;
  };
}
