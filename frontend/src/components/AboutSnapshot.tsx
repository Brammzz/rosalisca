
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSnapshot = () => {
  const highlights = [
    'Pengalaman 20+ tahun dengan kepemimpinan Robert Pangaribuan',
    'Spesialisasi General Contractor, Civil Engineering & Supplier',
    'Kolaborasi dengan Iseki & Co., Ltd. dari Tokyo, Jepang',
    'Jangkauan proyek di seluruh Indonesia',
    'Komitmen pada kualitas dan kepuasan pelanggan',
    'Penerapan ISO 9001:2008 secara konsisten'
  ];

  return (
    <section className="py-20 bg-construction-white-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-on-scroll">
            <div className="text-construction-blue-600 font-semibold text-sm uppercase tracking-wide mb-4">
              Tentang ROSALISCA GROUP
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-6">
              Solusi Konstruksi Terdepan untuk Indonesia
            </h2>
            
            <p className="text-lg text-construction-gray-600 mb-8 leading-relaxed">
              Didirikan pada 19 Mei 1981, PT. ROSA LISCA telah berkembang menjadi perusahaan konstruksi terkemuka yang berkomitmen memberikan layanan berkualitas tinggi dengan standar internasional.
            </p>

            <div className="space-y-4 mb-8">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-construction-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-construction-gray-700">{highlight}</span>
                </div>
              ))}
            </div>

            <Button 
              asChild
              size="lg" 
              className="bg-construction-blue-600 hover:bg-construction-blue-700 text-white group"
            >
              <Link to="/about">
                Pelajari Lebih Lanjut
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Image */}
          <div className="animate-on-scroll">
            <div className="relative">
              <img 
                src="images/Logo-Rosa-Lisca.jpg"
                alt="Construction Bridge"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              
              {/* Overlay Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                <div className="text-3xl font-heading font-bold text-construction-blue-600 mb-2">
                  40+ Tahun
                </div>
                <div className="text-construction-gray-600">
                  Pengalaman dalam industri konstruksi dan engineering
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSnapshot;
