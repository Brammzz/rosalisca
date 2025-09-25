import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Briefcase, Clock, Users, DollarSign, Calendar } from 'lucide-react';
import CareerApplicationForm from './CareerApplicationForm';

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
  featured: boolean;
  status: string;
  openDate: string;
  closeDate: string;
  applicationCount?: number;
}

interface CareerCardProps {
  career: Career;
  onApplySuccess?: () => void;
}

const CareerCard: React.FC<CareerCardProps> = ({ career, onApplySuccess }) => {

  const formatSalary = (salary: { min: number; max: number }) => {
    if (!salary) return null;
    
    const formatNumber = (num: number) => {
      if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}M`;
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}Jt`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
      return num.toString();
    };

    return `Rp ${formatNumber(salary.min)} - ${formatNumber(salary.max)}`;
  };

  const daysUntilClose = Math.ceil(
    (new Date(career.closeDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isUrgent = daysUntilClose <= 7;
  const isExpired = daysUntilClose < 0;

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-construction-gray-200">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-heading font-bold text-construction-gray-900 mb-2 line-clamp-2">
                {career.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {career.featured && (
                  <Badge className="bg-construction-orange-500 text-white">
                    Unggulan
                  </Badge>
                )}
                {isUrgent && !isExpired && (
                  <Badge className="bg-red-500 text-white">
                    Segera Tutup
                  </Badge>
                )}
                {isExpired && (
                  <Badge variant="secondary" className="bg-gray-500 text-white">
                    Expired
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-3 mb-4 flex-1">
            <div className="flex items-center text-sm text-construction-gray-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{career.location}</span>
            </div>
            
            <div className="flex items-center text-sm text-construction-gray-600">
              <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Pengalaman: {career.experienceLevel}</span>
            </div>

            {career.salaryRange && (
              <div className="flex items-center text-sm text-construction-gray-600">
                <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{formatSalary(career.salaryRange)}</span>
              </div>
            )}

            <div className="flex items-center text-sm text-construction-gray-600">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className={isUrgent ? 'text-red-600 font-medium' : ''}>
                Tutup: {new Date(career.closeDate).toLocaleDateString('id-ID')}
                {!isExpired && ` (${daysUntilClose} hari lagi)`}
              </span>
            </div>

            {career.applicationCount !== undefined && (
              <div className="flex items-center text-sm text-construction-gray-600">
                <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{career.applicationCount} pelamar</span>
              </div>
            )}

            <div className="flex items-center text-sm text-construction-gray-600">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Dibuka: {new Date(career.openDate).toLocaleDateString('id-ID')}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-construction-gray-600 mb-4 leading-relaxed line-clamp-3 flex-1">
            {career.description}
          </p>



          {/* Actions */}
          <div className="mt-auto pt-4 border-t border-construction-gray-100">
            <CareerApplicationForm 
              career={career} 
              onSuccess={onApplySuccess} 
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default React.memo(CareerCard);
