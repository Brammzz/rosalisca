import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/services/projectService';
import { 
  MapPin, Calendar, Users, ArrowLeft, Clock, X, ChevronLeft, ChevronRight, Image as ImageIcon, Building, Eye, GalleryHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

interface ProjectDetailContentProps {
  project: Project;
}

const ProjectDetailContent: React.FC<ProjectDetailContentProps> = ({ project }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);


  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const allImages = [
    ...(project.image ? [{ url: project.image, caption: 'Gambar Utama' }] : []),
    ...(project.gallery || []),
  ];

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };

  const hasImages = allImages.length > 0;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Selesai', color: 'bg-green-100 text-green-800' };
      case 'ongoing':
        return { label: 'Berjalan', color: 'bg-blue-100 text-blue-800' };
      case 'planned':
        return { label: 'Direncanakan', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <main className="bg-gray-50/50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button 
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-8 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Proyek
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium mb-4">
              {project.category}
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {project.title}
            </h1>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700 mb-8">
              <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-gray-400" /> {project.location}</div>
              <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-gray-400" /> {project.year}</div>
              <div className="flex items-center gap-3"><Users className="w-5 h-5 text-gray-400" /> {project.client}</div>
              <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-gray-400" /> {project.duration || '-'}</div>
              <div className="flex items-center gap-3"><Building className="w-5 h-5 text-gray-400" /> {project.company}</div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg group">
              <CardContent className="p-0 relative h-80">
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  {project.image ? (
                    <img 
                      src={getImageUrl(project.image)} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                      <p>Gambar tidak tersedia</p>
                    </div>
                  )}
                </div>
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusInfo(project.status).color}`}>
                  {getStatusInfo(project.status).label}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Documentation Section */}
        {hasImages && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Dokumentasi Proyek</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allImages.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-lg group cursor-pointer" onClick={() => openModal(index)}>
                  <img 
                    src={getImageUrl(image.url)} 
                    alt={image.caption || `Dokumentasi ${index + 1}`}
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {image.caption && (
                    <div className="p-4 bg-white">
                      <p className="text-sm text-gray-700 truncate">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasImages && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-none shadow-none flex flex-col items-center justify-center">
            <div className="relative w-full h-full">
              <img
                src={getImageUrl(allImages[selectedImageIndex].url)}
                alt={allImages[selectedImageIndex].caption || `Dokumentasi ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <p className="text-white text-center mt-4 bg-black/50 p-2 rounded-b-lg">
                {allImages[selectedImageIndex].caption || `Gambar ${selectedImageIndex + 1}`}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/60 hover:text-white rounded-full h-10 w-10"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </Button>

            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/60 hover:text-white rounded-full h-12 w-12"
                  onClick={showPrevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/60 hover:text-white rounded-full h-12 w-12"
                  onClick={showNextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
};

export default ProjectDetailContent;
