
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import CareerCard from '@/components/CareerCard';
import { Users, Award, TrendingUp, MapPin, Clock, Briefcase, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import careerService from '@/services/careerService';
import CareerApplicationForm from '@/components/CareerApplicationForm';

interface Career {
  _id: string;
  title: string;
  location: string;
  experienceLevel: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  description: string;
  benefits: string[];
  status: string;
  openDate: string;
  closeDate: string;
  publishDate: string;
  applicationCount: number;
  featured: boolean;
}

interface CareerFilters {
  locations: string[];
  experienceLevels: string[];
}

const Careers = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [filters, setFilters] = useState<CareerFilters>({
    locations: [],
    experienceLevels: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCareers, setTotalCareers] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load careers when filters change
  useEffect(() => {
    loadCareers();
  }, [searchTerm, selectedLocation, selectedExperience, currentPage]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load filters
      const filtersResponse = await careerService.getCareerFilters();

      if (filtersResponse.success) {
        setFilters(filtersResponse.data);
      }

      // Load regular careers
      await loadCareers();
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Gagal memuat data lowongan. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  };

  const loadCareers = async () => {
    try {
      const filterParams = {
        page: currentPage,
        limit: 9,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedLocation && { location: selectedLocation }),
        ...(selectedExperience && { experienceLevel: selectedExperience })
      };

      const response = await careerService.getPublicCareers(filterParams);
      
      if (response.success) {
        setCareers(response.data || []);
        setTotalCareers(response.total || 0);
        if (response.pagination) {
          setTotalPages(response.pagination.pages || 1);
        }
        setError(null);
      } else {
        setError('Gagal memuat lowongan kerja. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error loading careers:', error);
      setError('Terjadi kesalahan saat memuat data. Silakan refresh halaman.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadCareers();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedExperience('');
    setCurrentPage(1);
    // Trigger reload after clearing filters
    loadCareers();
  };

  const hasActiveFilters = searchTerm || selectedLocation || selectedExperience;
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: Award,
      title: 'Pengembangan Karir',
      description: 'Program pelatihan berkelanjutan dan jalur karir yang jelas untuk setiap karyawan'
    },
    {
      icon: Users,
      title: 'Lingkungan Kerja Positif',
      description: 'Budaya kerja yang mendukung kolaborasi, inovasi, dan keseimbangan hidup'
    },
    {
      icon: TrendingUp,
      title: 'Kompensasi Kompetitif',
      description: 'Gaji yang kompetitif dengan benefit tambahan dan bonus performa'
    }
  ];



  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        {/* Hero Section with Slider */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
          {/* Hero Slider as Background */}
          <div className="absolute inset-0 z-10">
            <HeroSlider />
          </div>
          
          {/* Content Overlay */}
          <div className="relative z-20 flex items-center justify-center min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 md:mb-8 leading-tight drop-shadow-2xl">
                  Karir Bersama
                  <span className="block text-construction-orange-400 mt-2">
                    PT. ROSA LISCA
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/95 mb-0 max-w-4xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                  Bergabunglah dengan tim profesional kami dan kembangkan karir di industri konstruksi terkemuka.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-4">
                Mengapa Bergabung dengan Kami?
              </h2>
              <p className="text-lg text-construction-gray-600 max-w-3xl mx-auto">
                Kami menawarkan lingkungan kerja yang mendukung pertumbuhan profesional dan personal setiap karyawan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="text-center p-8 rounded-2xl bg-construction-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 animate-on-scroll"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <benefit.icon className="w-16 h-16 text-construction-blue-600 mx-auto mb-6" />
                  <h3 className="text-xl font-heading font-bold text-construction-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-construction-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Search and Filters */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="text"
                        placeholder="Cari posisi, kata kunci..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-construction-blue-500"
                    >
                      <option value="">Semua Lokasi</option>
                      {filters.locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.target.value)}
                      className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-construction-blue-500"
                    >
                      <option value="">Semua Pengalaman</option>
                      {filters.experienceLevels.map((exp) => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={clearFilters}
                  >
                    Reset Filter
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-construction-blue-600 hover:bg-construction-blue-700 text-white"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Cari
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Job List */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {careers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {careers.map((career) => (
                  <CareerCard 
                    key={career._id} 
                    career={career}
                    onApplySuccess={loadCareers}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 rounded-2xl bg-construction-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 animate-on-scroll">
                <h3 className="text-xl font-medium text-construction-gray-900 mb-2">
                  Tidak ada lowongan ditemukan
                </h3>
                <p className="text-construction-gray-600 mb-6">
                  Coba ubah kriteria pencarian atau hapus filter
                </p>
                <Button 
                  onClick={clearFilters}
                  variant="outline"
                  className="border-construction-blue-600 text-construction-blue-600 hover:bg-construction-blue-50"
                >
                  Reset Pencarian
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                }}
                disabled={currentPage === 1}
                className="px-3 py-2"
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum <= totalPages) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      className="px-3 py-2"
                    >
                      {pageNum}
                    </Button>
                  );
                }
                return null;
              })}
              
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-2"
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;