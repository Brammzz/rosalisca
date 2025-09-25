import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectsAPI, Project } from '@/services/projectService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListFilter, Filter, Loader2, AlertTriangle } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';

const SubsidiaryProjects: React.FC = () => {
  const { companyName } = useParams<{ companyName: string }>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Mappers to get correct names from URL slug
  const companyNameMap: { [key: string]: string } = {
    'jhon-ro': 'PT John dan Ro',
    'gunung-sahid': 'PT Gunung Sahid',
    'arimada-persada': 'PT Arimada Persada',
  };

  const displayNameMap: { [key: string]: string } = {
    'jhon-ro': 'John & Ro',
    'gunung-sahid': 'Gunung Sahid',
    'arimada-persada': 'Arimada Persada',
  };

  const dbCompanyName = companyName ? companyNameMap[companyName] : '';
  const displayCompanyName = companyName ? displayNameMap[companyName] : '';

  const { data: projects, isLoading, isError } = useQuery<Project[], Error>({
    queryKey: ['projects', dbCompanyName],
    queryFn: () => getProjectsAPI(dbCompanyName),
    enabled: !!dbCompanyName,
  });

  const categories = useMemo(() => {
    if (!projects) return [];
    const uniqueCategories = [...new Set(projects.map(p => p.category))];
    return [
      { value: 'all', label: 'Semua Kategori' },
      ...uniqueCategories.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
    ];
  }, [projects]);

  const years = useMemo(() => {
    if (!projects) return [];
    const uniqueYears = [...new Set(projects.map(p => p.year.toString()))].sort((a, b) => Number(b) - Number(a));
    return [
      { value: 'all', label: 'Semua Tahun' },
      ...uniqueYears.map(y => ({ value: y, label: y }))
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects?.filter(project => {
      const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;
      const yearMatch = selectedYear === 'all' || project.year.toString() === selectedYear;
      return categoryMatch && yearMatch;
    }) ?? [];
  }, [projects, selectedCategory, selectedYear]);





  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-2xl font-bold text-construction-gray-900 mb-4">
              Loading projects for {displayCompanyName}...
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error loading projects.
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const heroDetails: { [key: string]: { title: string; subtitle: string } } = {
    'jhon-ro': {
      title: 'PT. John & Ro',
      subtitle: 'Spesialis dalam pipe jacking dan pembangunan infrastruktur air limbah.',
    },
    'gunung-sahid': {
      title: 'PT. Gunung Sahid',
      subtitle: 'Konstruksi umum dan penyedia material bangunan terpercaya.',
    },
    'arimada-persada': {
      title: 'PT. Arimada Persada',
      subtitle: 'Solusi rekayasa sipil dan manajemen proyek yang inovatif.',
    },
  };

  const currentHero = companyName ? heroDetails[companyName] : { title: '', subtitle: '' };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section with Background Slider */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
          <div className="absolute inset-0 z-10">
            <HeroSlider />
          </div>
          {/* Overlay Content */}
          <div className="relative z-30 flex flex-col items-center justify-center min-h-screen w-full text-center text-white bg-black/40 p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 md:mb-8 leading-tight drop-shadow-2xl">
                  Proyek
                  <span className="block text-blue-400 mt-2">
                    {currentHero.title}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-white/95 mb-0 max-w-4xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                  {currentHero.subtitle}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
              Proyek <span className="text-blue-600">{displayCompanyName}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Jelajahi berbagai proyek yang telah kami selesaikan untuk {displayCompanyName}.
            </p>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="flex items-center text-gray-700 font-medium flex-shrink-0">
                <ListFilter className="w-5 h-5 mr-2" />
                <span>Filter:</span>
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project._id} 
                    project={project} 
                    detailPath={`/business-units/${companyName}/projects/${project._id}`} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                <h2 className="mt-2 text-xl font-semibold text-gray-800">Proyek Tidak Ditemukan</h2>
                <p className="mt-1 text-gray-600">Tidak ada proyek yang sesuai dengan filter yang Anda pilih.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SubsidiaryProjects;
