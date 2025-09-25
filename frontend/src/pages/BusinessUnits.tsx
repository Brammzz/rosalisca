import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import { Building, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BusinessUnits = () => {
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

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const subsidiaries = [
    {
      name: 'PT Jhon dan RO',
      slug: 'jhon-ro',
      foundedDate: '27 September 1982',
      description: 'Perusahaan yang bergerak dalam bidang konstruksi umum dengan fokus pada pembangunan dan konstruksi real estate, perencanaan, pelaksanaan konstruksi gedung, jembatan, jalan, pengairan, irigasi, pengadaan barang dan jasa, serta survey dan pemetaan.',
      specialization: 'General Contractor & Civil Engineering',
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      certificates: ['ISO 9001-2000', 'ISO 14001:2004', 'OHSAS 18001:2007']
    },
    {
      name: 'PT Gunung Sahid',
      slug: 'gunung-sahid',
      foundedDate: '30 Januari 2003',
      description: 'Spesialis dalam bidang kontraktor umum dengan fokus khusus pada pengadaan barang dan jasa konstruksi, pembangunan real estate, dan berbagai jenis konstruksi infrastruktur.',
      specialization: 'Procurement & General Construction',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      certificates: ['DAS CERTIFICATION']
    },
    {
      name: 'PT Arimada Persada',
      slug: 'arimada-persada',
      foundedDate: '22 Desember 2003',
      description: 'Perusahaan konstruksi inovatif yang bergerak dalam bidang kontraktor umum dengan spesialisasi pembangunan dan konstruksi real estate, serta berbagai infrastruktur pendukung.',
      specialization: 'Real Estate Construction & Infrastructure',
      image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      certificates: ['Sistem Manajemen Mutu']
    }
  ];

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
                  Anak Perusahaan
                  <span className="block text-construction-orange-400 mt-2">
                    Kami
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/95 mb-0 max-w-4xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                  Jaringan anak perusahaan yang berkomitmen memberikan solusi konstruksi terpadu dengan keahlian spesialis di berbagai bidang.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg text-construction-gray-600 leading-relaxed animate-on-scroll">
              Sebagai bagian dari PT. ROSALISCA GROUP, setiap anak perusahaan kami memiliki keahlian khusus yang saling melengkapi untuk memberikan layanan konstruksi yang komprehensif. 
              Dengan pengalaman puluhan tahun dan komitmen terhadap kualitas, kami siap menghadirkan solusi terbaik untuk setiap kebutuhan pembangunan infrastruktur Anda.
            </p>
          </div>
        </section>

        {/* Subsidiaries Overview */}
        <section className="py-20 bg-construction-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {subsidiaries.map((subsidiary, index) => (
                <div 
                  key={subsidiary.slug}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-on-scroll ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Content */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <Building className="w-8 h-8 text-construction-blue-600" />
                        <h2 className="text-3xl font-heading font-bold text-construction-gray-900">
                          {subsidiary.name}
                        </h2>
                      </div>
                      
                      <div className="flex items-center text-construction-gray-600 text-sm mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Didirikan: {subsidiary.foundedDate}</span>
                      </div>

                      <div className="bg-construction-blue-50 px-4 py-2 rounded-lg mb-4">
                        <span className="text-construction-blue-700 font-medium text-sm">
                          {subsidiary.specialization}
                        </span>
                      </div>
                      
                      <p className="text-construction-gray-600 mb-6 leading-relaxed">
                        {subsidiary.description}
                      </p>

                      <div className="mb-6">
                        <h4 className="font-semibold text-construction-gray-900 mb-3">Sertifikat:</h4>
                        <div className="flex flex-wrap gap-2">
                          {subsidiary.certificates.map((cert, certIndex) => (
                            <span 
                              key={certIndex}
                              className="bg-construction-gray-100 text-construction-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button asChild className="bg-construction-blue-600 hover:bg-construction-blue-700 text-white flex-1">
                          <Link to={`/business-units/${subsidiary.slug}/profile`}>
                            Lihat Profil
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="border-construction-blue-600 text-construction-blue-600 hover:bg-construction-blue-50 flex-1">
                          <Link to={`/business-units/${subsidiary.slug}/projects`}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Lihat Proyek
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <div className="relative">
                      <img 
                        src={subsidiary.image}
                        alt={subsidiary.name}
                        className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                      />
                      <div className="absolute inset-0 bg-construction-blue-600/10 rounded-2xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-construction-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Siap Berkolaborasi?
            </h2>
            <p className="text-xl text-construction-gray-300 mb-8">
              Hubungi kami untuk mendiskusikan kebutuhan proyek Anda dan temukan solusi terbaik dari jaringan anak perusahaan kami.
            </p>
            <Button asChild size="lg" className="bg-construction-orange-500 hover:bg-construction-orange-600 text-white">
              <Link to="/contact">
                Hubungi Kami Sekarang
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessUnits;