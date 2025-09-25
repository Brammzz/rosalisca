
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideData {
  id: number;
  image: string;
  title: string;
  description: string;
  alt: string;
}

const HeroSlider = () => {
  const slides: SlideData[] = [
    {
      id: 1,
      image: '/images/photos/photoslide.jpg',
      title: 'Proyek Arsitektur Modern',
      description: 'Membangun masa depan dengan desain yang ikonik dan fungsional.',
      alt: 'Modern architectural building facade'
    },
    {
      id: 2,
      image: '/images/photos/photoslide4.jpg',
      title: 'Teknologi Pipe Jacking',
      description: 'Instalasi pipa canggih dengan gangguan minimal pada lingkungan sekitar.',
      alt: 'Advanced pipe jacking technology in tunnel'
    },
    {
      id: 3,
      image: '/images/photos/photoslide2.jpg',
      title: 'Infrastruktur Air & Industri',
      description: 'Membangun sistem perpipaan yang efisien dan berkelanjutan.',
      alt: 'Industrial piping infrastructure'
    },
    {
      id: 4,
      image: '/images/photos/photoslide5.jpg',
      title: 'Infrastruktur Air & Industri',
      description: 'Membangun sistem perpipaan yang efisien dan berkelanjutan.',
      alt: 'Industrial piping infrastructure'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds interval

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative w-full h-full overflow-hidden group">
      {/* Slider Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div
              className={`w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[6000ms] ease-in-out ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
              style={{
                backgroundImage: `url('${slide.image}')`,
              }}
              role="img"
              aria-label={slide.alt}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Always visible on hover */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 opacity-70 hover:opacity-100 group-hover:opacity-100 z-40"
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 opacity-70 hover:opacity-100 group-hover:opacity-100 z-40"
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </section>
  );
};

export default HeroSlider;