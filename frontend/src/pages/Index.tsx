import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import VideoHero from '@/components/VideoHero';
import AboutSnapshot from '@/components/AboutSnapshot';
import FeaturedProjects from '@/components/FeaturedProjects';
import ClientLogos from '@/components/ClientLogos';
import VideoProfileSection from '@/components/VideoProfileSection';

const Index = () => {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // We need to handle both static and dynamically loaded elements.
    // For static elements, we can observe them right away.
    const staticElements = document.querySelectorAll('.animate-on-scroll');
    staticElements.forEach((el) => observer.observe(el));

    // For dynamic elements (like projects), we'll use a MutationObserver
    // to watch for when they're added to the DOM.
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && (node as Element).classList.contains('animate-on-scroll')) {
            observer.observe(node as Element);
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        {/* VideoHero sebagai alternatif hero section dengan video background
        <VideoHero
          videoSrc="/videos/WT 2_VIDEO METODE JACKING_DENGAN_R01_KE KALI_GENANGAN BAJIR.mp4 (1).mp4"
          title="ROSALISCA GROUP"
          subtitle="Inovasi Teknologi Konstruksi untuk Masa Depan Indonesia"
          showControls={true}
        />
        */}
        <AboutSnapshot />
        <VideoProfileSection
          videoSrc="/videos/WT 2_VIDEO METODE JACKING_DENGAN_R01_KE KALI_GENANGAN BAJIR.mp4 (1).mp4"
          title="Inovasi Teknologi Jacking"
          description="Saksikan inovasi teknologi metode jacking yang kami gunakan untuk mengatasi masalah drainase dan pengendalian banjir. Video ini menunjukkan keahlian teknis ROSALISCA GROUP dalam menangani proyek infrastruktur kompleks."
        />
        <FeaturedProjects />
        <ClientLogos />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
