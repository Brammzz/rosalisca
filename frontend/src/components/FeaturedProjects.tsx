
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Calendar, Building, CheckCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectsAPI, Project } from '@/services/projectService';

const FeaturedProjects = () => {
  const { data: projects, isLoading, isError, error } = useQuery<Project[], Error>({
    queryKey: ['featured-projects', 'main-company'],
    queryFn: () => getProjectsAPI('Rosalisca Group'), // Only fetch main company projects
  });

  // Helper function to get image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };



  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      infrastructure: 'Infrastruktur',
      commercial: 'Komersial',
      residential: 'Perumahan',
      educational: 'Pendidikan',
    };
    return labels[category] || 'Lainnya';
  };

  const getStatusComponent = (status: string) => {
    if (status === 'completed') {
      return (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" />
          Selesai
        </div>
      );
    }
    // You can add other statuses here if needed
    return null;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="text-construction-blue-600 font-semibold text-sm uppercase tracking-wide mb-4">
            Proyek Unggulan
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-6">
            Karya Terbaik Kami
          </h2>
          <p className="text-lg text-construction-gray-600 max-w-3xl mx-auto">
            Kami bangga telah menyelesaikan berbagai proyek infrastruktur penting yang berkontribusi terhadap pembangunan Indonesia.
          </p>
        </div>

        {isLoading && <div className="text-center">Loading projects...</div>}
        {isError && <div className="text-center text-red-500">Gagal memuat proyek.</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects && projects.slice(0, 3).map((project, index) => (
            <div 
              key={project._id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-on-scroll"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden">
                <div className="w-full h-64 overflow-hidden">
                  {project.image ? (
                    <img
                      src={getImageUrl(project.image)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-construction-gray-100 to-construction-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ${project.image ? 'hidden' : ''}`}>
                    <div className="text-center p-6">
                      <Building className="w-12 h-12 text-construction-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-construction-gray-500 font-medium">
                        Dokumentasi Proyek
                      </p>
                      <p className="text-xs text-construction-gray-400 mt-1">
                        {getCategoryLabel(project.category)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 left-4 bg-construction-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {getCategoryLabel(project.category)}
                </div>
                
                {getStatusComponent(project.status)}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-heading font-bold text-construction-gray-900 mb-3 group-hover:text-construction-blue-600 transition-colors leading-tight">
                  {project.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-construction-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{project.location}</span>
                  </div>
                  
                  <div className="flex items-center text-construction-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{project.year} • {project.duration}</span>
                  </div>
                  
                  <div className="flex items-center text-construction-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{project.client}</span>
                  </div>
                </div>
                
                <p className="text-construction-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-construction-blue-600 text-construction-blue-600 hover:bg-construction-blue-50 group-hover:bg-construction-blue-600 group-hover:text-white transition-all duration-300"
                  asChild
                >
                  <Link to={`/projects/${project._id}`}>
                    <Building className="w-4 h-4 mr-2" />
                    Lihat Detail
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center animate-on-scroll">
          <Button 
            asChild
            size="lg" 
            className="bg-construction-blue-600 hover:bg-construction-blue-700 text-white group"
          >
            <Link to="/projects">
              Lihat Semua Proyek
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
