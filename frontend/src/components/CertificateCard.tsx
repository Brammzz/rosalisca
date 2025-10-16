import React from 'react';
import { Award, FileText, Calendar, Building } from 'lucide-react';
import { Certificate, getTypeLabel } from '@/services/certificateService';

interface CertificateCardProps {
  certificate: Certificate;
  onClick: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, onClick }) => {
  // Helper function to get image URL, similar to ProjectCard
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/images/placeholder-certificate.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    if (imagePath.startsWith('/uploads')) return `${baseUrl}${imagePath}`;
    return `${baseUrl}/uploads/certificates/${imagePath}`;
  };

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
          <img
            src={getImageUrl(certificate.image)}
            alt={certificate.title}
            className="max-w-full max-h-full object-contain rounded-md shadow-sm group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-certificate.jpg'; 
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-blue-600/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <FileText className="w-10 h-10 mx-auto mb-2" />
            <p className="font-semibold">Lihat Sertifikat</p>
          </div>
        </div>

        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {getTypeLabel(certificate.type)}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
          {certificate.title}
        </h3>
        
        <div className="space-y-2 text-gray-600 text-sm">
          <div className="flex items-center">
            <Award className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{certificate.issuer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
