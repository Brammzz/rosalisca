
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectsAPI, Project } from '@/services/projectService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListFilter } from 'lucide-react';



const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const { data: projects = [], isLoading, isError, error } = useQuery<Project[], Error>({
    queryKey: ['projects', 'main-company'],
    queryFn: () => getProjectsAPI('Rosalisca Group'), // Only fetch main company projects
  });

  const categories = useMemo(() => {
    if (!projects) return [];
    const uniqueCategories = [...new Set(projects.map(p => p.category))];
    return [
      { value: 'all', label: 'Semua Kategori' },
      ...uniqueCategories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))
    ];
  }, [projects]);

  const years = useMemo(() => {
    if (!projects) return [];
    const uniqueYears = [...new Set(projects.map(p => p.year))].sort((a, b) => b.localeCompare(a));
    return [
      { value: 'all', label: 'Semua Tahun' },
      ...uniqueYears.map(year => ({ value: year, label: year }))
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects?.filter(project => {
      const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;
      const yearMatch = selectedYear === 'all' || project.year === selectedYear;
      return categoryMatch && yearMatch;
    }) ?? [];
  }, [projects, selectedCategory, selectedYear]);

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
                  Proyek
                  <span className="block text-construction-orange-400 mt-2">
                    Unggulan Kami
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/95 mb-0 max-w-4xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                  Koleksi proyek konstruksi berkualitas tinggi yang telah kami selesaikan dengan standar internasional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Filter */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
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
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center text-gray-500">Memuat proyek...</div>
            ) : isError ? (
              <div className="text-center text-red-500">Gagal memuat proyek.</div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map(project => (
                  <ProjectCard 
                    key={project._id}
                    project={project}
                    detailPath={`/projects/${project._id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Proyek Tidak Ditemukan</h3>
                <p className="text-gray-500">Coba ubah pilihan filter Anda.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;