import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface ContentSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'video' | 'gallery' | 'stats' | 'testimonial' | 'cta' | 'faq' | 'timeline';
  title: string;
  content: any;
  order: number;
  visible: boolean;
}

export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: ContentSection[];
  seo: SEOData;
  status: 'published' | 'draft' | 'archived';
  lastModified: string;
  author: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  canonical: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadDate: string;
  alt?: string;
  caption?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  active: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  googleAnalytics: string;
  maintenanceMode: boolean;
}

interface ContentContextType {
  // Pages
  pages: ContentPage[];
  currentPage: ContentPage | null;
  setCurrentPage: (pageId: string) => void;
  updatePage: (page: ContentPage) => void;
  createPage: (page: Omit<ContentPage, 'id' | 'lastModified'>) => void;
  deletePage: (pageId: string) => void;

  // Content Sections
  addSection: (pageId: string, section: Omit<ContentSection, 'id'>) => void;
  updateSection: (pageId: string, section: ContentSection) => void;
  deleteSection: (pageId: string, sectionId: string) => void;
  toggleSectionVisibility: (pageId: string, sectionId: string) => void;
  reorderSections: (pageId: string, sections: ContentSection[]) => void;

  // Hero Slides
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  updateHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (slideId: string) => void;
  toggleSlideActive: (slideId: string) => void;

  // Media
  mediaFiles: MediaFile[];
  uploadMedia: (file: File) => Promise<MediaFile>;
  deleteMedia: (fileId: string) => void;
  updateMedia: (file: MediaFile) => void;

  // Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Utility
  loading: boolean;
  error: string | null;
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPageState] = useState<ContentPage | null>(null);

  // Initialize with sample data
  const [pages, setPages] = useState<ContentPage[]>([
    {
      id: 'home',
      title: 'Beranda',
      slug: '/',
      content: [
        {
          id: 'hero-1',
          type: 'hero',
          title: 'Hero Section',
          content: {
            title: 'Solusi Konstruksi Terpercaya',
            subtitle: 'PT. ROSALISCA GROUP',
            description: 'Menghadirkan inovasi dalam setiap proyek konstruksi dengan teknologi terdepan dan tim profesional berpengalaman.',
            image: '/images/hero-bg.jpg',
            buttonText: 'Lihat Proyek Kami',
            buttonLink: '/projects'
          },
          order: 1,
          visible: true
        },
        {
          id: 'stats-1',
          type: 'stats',
          title: 'Statistik Perusahaan',
          content: {
            stats: [
              { label: 'Proyek Selesai', value: '150+', icon: 'briefcase' },
              { label: 'Klien Puas', value: '95%', icon: 'users' },
              { label: 'Tahun Pengalaman', value: '15+', icon: 'calendar' },
              { label: 'Tim Profesional', value: '200+', icon: 'award' }
            ]
          },
          order: 2,
          visible: true
        }
      ],
      seo: {
        title: 'PT. ROSALISCA GROUP - Solusi Konstruksi Terpercaya',
        description: 'Perusahaan konstruksi terkemuka dengan pengalaman 15+ tahun dalam bidang infrastruktur dan bangunan komersial.',
        keywords: ['konstruksi', 'infrastruktur', 'bangunan', 'kontraktor'],
        image: '/images/og-home.jpg',
        canonical: 'https://rosaliscagroup.com'
      },
      status: 'published',
      lastModified: '2024-01-15T10:30:00Z',
      author: 'Admin'
    },
    {
      id: 'about',
      title: 'Tentang Kami',
      slug: '/about',
      content: [
        {
          id: 'about-intro',
          type: 'text',
          title: 'Profil Perusahaan',
          content: {
            title: 'Tentang PT. ROSALISCA GROUP',
            content: 'PT. ROSALISCA GROUP adalah perusahaan konstruksi yang telah berpengalaman lebih dari 15 tahun dalam industri konstruksi Indonesia. Kami mengkhususkan diri dalam proyek-proyek infrastruktur, bangunan komersial, dan teknologi pipe jacking.',
            image: '/images/about-profile.jpg'
          },
          order: 1,
          visible: true
        }
      ],
      seo: {
        title: 'Tentang Kami - PT. ROSALISCA GROUP',
        description: 'Pelajari lebih lanjut tentang sejarah, visi, misi, dan nilai-nilai PT. ROSALISCA GROUP.',
        keywords: ['tentang', 'profil perusahaan', 'sejarah', 'visi misi'],
        image: '/images/og-about.jpg',
        canonical: 'https://rosaliscagroup.com/about'
      },
      status: 'published',
      lastModified: '2024-01-10T14:20:00Z',
      author: 'Admin'
    },
    {
      id: 'contact',
      title: 'Kontak',
      slug: '/contact',
      content: [
        {
          id: 'contact-info',
          type: 'text',
          title: 'Informasi Kontak',
          content: {
            title: 'Hubungi Kami',
            content: 'Kami siap membantu Anda dengan segala kebutuhan konstruksi. Silakan hubungi kami melalui informasi kontak di bawah ini.',
            contactInfo: {
              address: 'Jakarta, Indonesia',
              phone: '+62 21 1234567',
              email: 'info@rosaliscagroup.com',
              workingHours: 'Senin - Jumat: 08:00 - 17:00'
            }
          },
          order: 1,
          visible: true
        }
      ],
      seo: {
        title: 'Kontak - PT. ROSALISCA GROUP',
        description: 'Hubungi PT. ROSALISCA GROUP untuk konsultasi dan informasi lebih lanjut tentang layanan konstruksi kami.',
        keywords: ['kontak', 'hubungi', 'alamat', 'telepon'],
        image: '/images/og-contact.jpg',
        canonical: 'https://rosaliscagroup.com/contact'
      },
      status: 'published',
      lastModified: '2024-01-08T09:15:00Z',
      author: 'Admin'
    }
  ]);

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      id: 'slide-1',
      title: 'Konstruksi Berkualitas Tinggi',
      subtitle: 'Solusi Terpercaya untuk Proyek Anda',
      description: 'Dengan pengalaman lebih dari 15 tahun, kami menghadirkan solusi konstruksi yang inovatif dan berkualitas tinggi.',
      image: '/images/hero-1.jpg',
      buttonText: 'Lihat Proyek',
      buttonLink: '/projects',
      order: 1,
      active: true
    },
    {
      id: 'slide-2',
      title: 'Teknologi Terdepan',
      subtitle: 'Pipe Jacking & Microtunnelling',
      description: 'Spesialis dalam teknologi pipe jacking dan microtunnelling untuk proyek infrastruktur bawah tanah.',
      image: '/images/hero-2.jpg',
      buttonText: 'Pelajari Teknologi',
      buttonLink: '/business-units',
      order: 2,
      active: true
    }
  ]);

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: 'media-1',
      name: 'hero-background.jpg',
      url: '/images/hero-bg.jpg',
      type: 'image',
      size: 2048000,
      uploadDate: '2024-01-15T09:00:00Z',
      alt: 'Hero Background',
      caption: 'Main hero background image'
    },
    {
      id: 'media-2',
      name: 'company-profile.mp4',
      url: '/videos/company-profile.mp4',
      type: 'video',
      size: 50000000,
      uploadDate: '2024-01-14T16:30:00Z',
      caption: 'Company profile video'
    }
  ]);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'PT. ROSALISCA GROUP',
    siteDescription: 'Perusahaan konstruksi terkemuka dengan teknologi terdepan',
    logo: '/images/logo.png',
    favicon: '/favicon.ico',
    primaryColor: '#1e40af',
    secondaryColor: '#f97316',
    contactEmail: 'info@rosaliscagroup.com',
    contactPhone: '+62 21 1234567',
    address: 'Jakarta, Indonesia',
    socialMedia: {
      facebook: 'https://facebook.com/rosaliscagroup',
      twitter: 'https://twitter.com/rosaliscagroup',
      instagram: 'https://instagram.com/rosaliscagroup',
      linkedin: 'https://linkedin.com/company/rosaliscagroup',
      youtube: 'https://youtube.com/rosaliscagroup'
    },
    googleAnalytics: 'GA-XXXXX-X',
    maintenanceMode: false
  });

  // Set current page
  const setCurrentPage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    setCurrentPageState(page || null);
  };

  // Page operations
  const updatePage = (page: ContentPage) => {
    setPages(pages.map(p => p.id === page.id ? { ...page, lastModified: new Date().toISOString() } : p));
  };

  const createPage = (pageData: Omit<ContentPage, 'id' | 'lastModified'>) => {
    const newPage: ContentPage = {
      ...pageData,
      id: `page-${Date.now()}`,
      lastModified: new Date().toISOString()
    };
    setPages([...pages, newPage]);
  };

  const deletePage = (pageId: string) => {
    setPages(pages.filter(p => p.id !== pageId));
    if (currentPage?.id === pageId) {
      setCurrentPageState(null);
    }
  };

  // Section operations
  const addSection = (pageId: string, sectionData: Omit<ContentSection, 'id'>) => {
    const newSection: ContentSection = {
      ...sectionData,
      id: `section-${Date.now()}`
    };
    
    setPages(pages.map(page => 
      page.id === pageId 
        ? {
            ...page,
            content: [...page.content, newSection],
            lastModified: new Date().toISOString()
          }
        : page
    ));
  };

  const updateSection = (pageId: string, section: ContentSection) => {
    setPages(pages.map(page => 
      page.id === pageId 
        ? {
            ...page,
            content: page.content.map(s => s.id === section.id ? section : s),
            lastModified: new Date().toISOString()
          }
        : page
    ));
  };

  const deleteSection = (pageId: string, sectionId: string) => {
    setPages(pages.map(page => 
      page.id === pageId 
        ? {
            ...page,
            content: page.content.filter(s => s.id !== sectionId),
            lastModified: new Date().toISOString()
          }
        : page
    ));
  };

  const toggleSectionVisibility = (pageId: string, sectionId: string) => {
    setPages(pages.map(page => 
      page.id === pageId 
        ? {
            ...page,
            content: page.content.map(s => 
              s.id === sectionId ? { ...s, visible: !s.visible } : s
            ),
            lastModified: new Date().toISOString()
          }
        : page
    ));
  };

  const reorderSections = (pageId: string, sections: ContentSection[]) => {
    setPages(pages.map(page => 
      page.id === pageId 
        ? {
            ...page,
            content: sections,
            lastModified: new Date().toISOString()
          }
        : page
    ));
  };

  // Hero slide operations
  const addHeroSlide = (slideData: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = {
      ...slideData,
      id: `slide-${Date.now()}`
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const updateHeroSlide = (slide: HeroSlide) => {
    setHeroSlides(heroSlides.map(s => s.id === slide.id ? slide : s));
  };

  const deleteHeroSlide = (slideId: string) => {
    setHeroSlides(heroSlides.filter(s => s.id !== slideId));
  };

  const toggleSlideActive = (slideId: string) => {
    setHeroSlides(heroSlides.map(s => 
      s.id === slideId ? { ...s, active: !s.active } : s
    ));
  };

  // Media operations
  const uploadMedia = async (file: File): Promise<MediaFile> => {
    setLoading(true);
    try {
      // Simulate upload
      const url = URL.createObjectURL(file);
      const newFile: MediaFile = {
        id: `media-${Date.now()}`,
        name: file.name,
        url,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        size: file.size,
        uploadDate: new Date().toISOString()
      };
      
      setMediaFiles([...mediaFiles, newFile]);
      return newFile;
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = (fileId: string) => {
    setMediaFiles(mediaFiles.filter(f => f.id !== fileId));
  };

  const updateMedia = (file: MediaFile) => {
    setMediaFiles(mediaFiles.map(f => f.id === file.id ? file : f));
  };

  // Settings operations
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings({ ...siteSettings, ...settings });
  };

  // Utility functions
  const saveChanges = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, would save to backend
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const resetChanges = () => {
    // Reset to initial state
    setError(null);
  };

  const value: ContentContextType = {
    pages,
    currentPage,
    setCurrentPage,
    updatePage,
    createPage,
    deletePage,
    addSection,
    updateSection,
    deleteSection,
    toggleSectionVisibility,
    reorderSections,
    heroSlides,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    toggleSlideActive,
    mediaFiles,
    uploadMedia,
    deleteMedia,
    updateMedia,
    siteSettings,
    updateSiteSettings,
    loading,
    error,
    saveChanges,
    resetChanges
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentProvider;
