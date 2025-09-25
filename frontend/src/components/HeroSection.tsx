
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSlider from './HeroSlider';

const HeroSection = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20">
      {/* Hero Slider as Background */}
      <div className="absolute inset-0 z-10 mt-20">
        <HeroSlider />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-20 flex items-center justify-center min-h-screen pb-12 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            {/* Main Headline with proper spacing */}
            <div className="mb-8 md:mb-12">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 md:mb-8 leading-tight drop-shadow-2xl">
                Membangun Masa Depan dengan
                <span className="block text-construction-orange-400 mt-2">
                  Kualitas & Inovasi
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/95 mb-0 max-w-4xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                PT. ROSA LISCA adalah perusahaan konstruksi terkemuka dengan pengalaman lebih dari 20 tahun dalam General Contractor, Civil Engineering, dan Supplier.
              </p>
            </div>

            {/* CTA Buttons with proper spacing */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 md:mb-20">
              <Button 
                asChild
                size="lg" 
                className="bg-construction-orange-500 hover:bg-construction-orange-600 text-white px-8 py-4 text-lg font-semibold group shadow-xl border-2 border-construction-orange-500 hover:border-construction-orange-600"
              >
                <Link to="/projects">
                  Lihat Proyek Kami
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-construction-blue-900 px-8 py-4 text-lg font-semibold shadow-xl backdrop-blur-sm bg-white/10"
              >
                <Link to="/contact">
                  Konsultasi Proyek
                </Link>
              </Button>
            </div>


          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;