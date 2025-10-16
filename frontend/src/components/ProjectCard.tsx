import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Building, CheckCircle, Users } from 'lucide-react';
import { Project } from '@/services/projectService';

import { getProjectImageUrl } from '@/utils/apiUtils';

interface ProjectCardProps {
  project: Project;
  detailPath: string;
}

const getCategoryLabel = (category: string) => {
  const labels: { [key: string]: string } = {
    infrastructure: 'Infrastruktur',
    commercial: 'Komersial',
    residential: 'Perumahan',
    construction: 'Konstruksi',
    development: 'Pengembangan',
  };
  return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
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
  return null;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, detailPath }) => {
// Helper function to get full image URL
const getImageUrl = (imagePath: string) => {
  return getProjectImageUrl(imagePath);
};  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
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
          <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ${project.image ? 'hidden' : ''}`}>
            <div className="text-center p-6">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">
                Dokumentasi Proyek
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {getCategoryLabel(project.category)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {getCategoryLabel(project.category)}
        </div>
        
        {getStatusComponent(project.status)}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
          {project.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{project.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{project.year} • {project.duration}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{project.client}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>
        
        <Button 
          variant="outline" 
          size="sm"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
          asChild
        >
          <Link to={detailPath}>
            <Building className="w-4 h-4 mr-2" />
            Lihat Detail
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
