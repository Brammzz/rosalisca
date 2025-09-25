import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';

import { Building, Users, Award, Target, Eye, Heart, FileText, X, ListFilter, Loader2 } from 'lucide-react';
import { getCertificatesAPI, getCertificateImageUrl, getTypeLabel, type Certificate } from '@/services/certificateService';

import CertificateCard from '@/components/CertificateCard';

const About = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const { data: certificates = [], isLoading, isError } = useQuery<Certificate[], Error>({
    queryKey: ['certificates', 'active', 'main-company'],
    queryFn: () => getCertificatesAPI({ status: 'active', subsidiary: 'ROSALISCA GROUP' }).then(res => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Helper function to get image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/images/placeholder-certificate.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    return `http://localhost:5000/uploads/certificates/${imagePath}`;
  };

  // Handle Escape key to close certificate modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCertificate) {
        setSelectedCertificate(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedCertificate]);

  // Scroll animations
  React.useEffect(() => {
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

  const stats = [
    { icon: Building, value: '20+', label: 'Tahun Pengalaman' },
    { icon: Users, value: '100+', label: 'Proyek Selesai' },
    { icon: Award, value: '50+', label: 'Klien Puas' },
  ];

  const visionMission = {
    vision: "Menjadi perusahaan konstruksi terkemuka di Indonesia dengan jaminan mutu terbaik.",
    mission: [
      "Penyelesaian tiap proyek konstruksi tepat waktu, dengan maksimal keterlambatan 2%.",
      "Kesalahan kerja (defect list) setiap proyek kurang dari 5% dari seluruh item pekerjaan."
    ]
  };

  const qualityPolicy = [
    "Menghasilkan produk konstruksi yang memenuhi persyaratan mutu konstruksi.",
    "Menyelesaikan pekerjaan konstruksi sesuai target yang ditetapkan.",
    "Menerapkan ISO 9001:2008 secara konsisten dan melakukan perbaikan secara berkelanjutan."
  ];



  const values = [
    {
      icon: Target,
      title: 'Kualitas Terjamin',
      description: 'Setiap proyek dikerjakan dengan standar kualitas tertinggi dan pengawasan ketat untuk memastikan hasil yang memuaskan.'
    },
    {
      icon: Eye,
      title: 'Transparansi',
      description: 'Kami menjalankan bisnis dengan transparansi penuh dalam setiap aspek, mulai dari perencanaan hingga penyelesaian proyek.'
    },
    {
      icon: Heart,
      title: 'Komitmen',
      description: 'Komitmen kami terhadap kepuasan pelanggan dan ketepatan waktu menjadi prioritas utama dalam setiap pekerjaan.'
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
                  Tentang
                  <span className="block text-construction-orange-400 mt-2">
                    PT. ROSA LISCA
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/95 mb-0 max-w-4xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                  Perusahaan konstruksi terkemuka dengan dedikasi tinggi terhadap kualitas, inovasi, dan kepuasan pelanggan selama lebih dari 20 tahun.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start animate-on-scroll">
              <div className="lg:col-span-1 flex justify-center lg:justify-start">
                <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <img 
                        src="/images/foto.png" 
                        alt="KOMISARIS ROSALISCA GROUP" 
                        className="rounded-xl object-cover shadow-md border-2 border-construction-gray-100"
                        style={{ width: '163px', height: '180px' }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-heading font-bold text-construction-gray-900 mb-1">
                      Komisaris Pertama
                    </h4>
                    <p className="text-construction-gray-600 text-sm">
                      PT. ROSA LISCA GROUP
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-8">
                  Profil Rosa Lisca Group
                </h2>
                <div className="space-y-6 text-base text-construction-gray-600 leading-relaxed">
                  <p className="italic text-construction-gray-700 font-medium text-lg">
                    "sukses adalah sebuah perjalanan…"
                  </p>
                  <p>
                    PT. ROSA LISCA GROUP yang berkedudukan di DKI Jakarta merupakan Perusahaan yang bergerak dalam bidang jasa konstruksi dan pengadaan. Di mulai dengan pengalaman pendirinya Robert Pangaribuan di perusahaan konstruksi selama lebih dari 20 tahun, didukung dengan Visi Misi yang jelas dan komitmen untuk terus maju berkembang juga mengutamakan kualitas dan kepuasan pelanggan.
                  </p>
                  <p>
                    PT ROSA LISCA berdiri pada tanggal 19 Mei 1981 berdasarkan akte notaris E. Sianipar,SH No. 49 tanggal 19 Mei 1981 dan telah disahkan oleh Departemen Kehakiman Republik Indonesia Direktorat Jenderal Hukum dan Perundangundangan melalui keputusan Menteri Kehakiman Republik Indonesia No. C-4830.HT.01.04.TH.99.
                  </p>
                  <p>
                    Sesuai dengan data akte perubahan anggaran dasar tanggal 22 Juli 1998 yang dibuat oleh Notaris Soekaimi,SH yang berkedudukan di Jakarta. Selain DKI Jakarta, Jawa Barat, dan Jawa Tengah, proyek yang dikerjakan telah mencapai Medan, Riau, Batam, Banjarmasin, Kabupaten Banjar – Kalimantan Selatan, Bali, Manado, Papua serta daerah-daerah lainnya di seluruh Indonesia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-6">
                VISI dan MISI
              </h2>
            </div>

            <div className="bg-construction-gray-50 rounded-2xl shadow-lg p-8 md:p-12 animate-on-scroll">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Vision */}
                <div>
                  <h3 className="text-2xl font-heading font-bold text-construction-gray-900 mb-6">Visi :</h3>
                  <p className="text-lg leading-relaxed text-construction-gray-700">
                    {visionMission.vision}
                  </p>
                </div>

                {/* Mission */}
                <div>
                  <h3 className="text-2xl font-heading font-bold text-construction-gray-900 mb-6">Misi :</h3>
                  <ol className="space-y-4 text-lg leading-relaxed text-construction-gray-700">
                    {visionMission.mission.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="font-bold mr-3 text-construction-blue-600">{index + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Policy Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-6">
                KEBIJAKAN MUTU
              </h2>
            </div>

            <div className="bg-construction-gray-50 rounded-2xl shadow-lg p-8 md:p-12 animate-on-scroll">
              <p className="text-lg leading-relaxed text-construction-gray-700 mb-8">
                PT. ROSA LISCA menjalankan bisnis konstruksi sebagai kontraktor umum dengan tekad untuk :
              </p>
              
              <ol className="space-y-6 text-lg leading-relaxed text-construction-gray-700 mb-8">
                {qualityPolicy.map((policy, index) => (
                  <li key={index} className="flex items-start">
                    <span className="font-bold mr-3 text-construction-blue-600">{index + 1}.</span>
                    <span>{policy}</span>
                  </li>
                ))}
              </ol>

              <p className="text-lg leading-relaxed text-construction-gray-700">
                Untuk meningkatkan kinerja bisnis dan mengembangkan perusahaan, PT Rosa Lisca didukung oleh Iseki & Co., 
                Ltd yang berbasis di Tokyo,Jepang dalam memproduksi berbagai mesin yang sangat menunjang kinerja bisnis PT 
                Rosa Lisca.
              </p>
            </div>
          </div>
        </section>

        {/* Certificates Section */}
        <section id="certificates" className="py-20 bg-construction-white-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-4">
                Sertifikasi & Akreditasi
              </h2>
              <p className="text-lg text-construction-gray-600 max-w-3xl mx-auto">
                Komitmen kami terhadap kualitas dan standar profesional yang diakui secara formal.
              </p>
            </div>


            {/* Certificates Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-10 h-10 text-construction-blue-600 animate-spin" />
              </div>
            ) : isError ? (
              <div className="text-center py-16 text-red-500 bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold">Gagal memuat sertifikat.</h3>
                <p>Silakan coba muat ulang halaman nanti.</p>
              </div>
            ) : certificates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {certificates.map((cert) => (
                  <CertificateCard 
                    key={cert._id}
                    certificate={cert}
                    onClick={() => setSelectedCertificate(cert)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Sertifikat Tidak Ditemukan</h3>
                <p className="text-gray-500">Coba ubah pilihan filter Anda atau periksa kembali nanti.</p>
              </div>
            )}
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-4">
                Nilai-Nilai Perusahaan
              </h2>
              <p className="text-lg text-construction-gray-600 max-w-3xl mx-auto">
                Prinsip-prinsip yang menjadi fondasi dalam setiap aspek operasional dan budaya kerja kami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="text-center p-8 rounded-2xl bg-construction-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 animate-on-scroll"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <value.icon className="w-16 h-16 text-construction-blue-600 mx-auto mb-6" />
                  <h3 className="text-xl font-heading font-bold text-construction-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-construction-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 bg-construction-gray-900 text-white rounded-full p-2 hover:bg-construction-gray-700 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              <div className="mb-6">
                <span className="text-sm font-semibold text-construction-blue-600 bg-construction-blue-100 px-3 py-1 rounded-full">
                  {getTypeLabel(selectedCertificate.type)}
                </span>
              </div>
              
              <h2 className="text-2xl font-heading font-bold text-construction-gray-900 mb-4">
                {selectedCertificate.title}
              </h2>
              
              <p className="text-lg text-construction-gray-600 mb-6 leading-relaxed">
                {selectedCertificate.description}
              </p>
              
              <div className="rounded-xl overflow-hidden shadow-lg bg-gray-100">
                <img 
                  src={getImageUrl(selectedCertificate.image)}
                  alt={selectedCertificate.title}
                  className="w-full h-auto object-contain max-h-[70vh]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-certificate.jpg';
                  }}
                />
              </div>

              <div className="mt-6 pt-6 border-t border-construction-gray-200 flex items-center text-construction-gray-700">
                <Award className="w-5 h-5 mr-3 text-construction-orange-500 flex-shrink-0" />
                <span><strong>Penerbit:</strong> {selectedCertificate.issuer || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default About;