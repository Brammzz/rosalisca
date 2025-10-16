
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import { Building, Award, MapPin, Phone, Mail, Download, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCertificatesAPI, Certificate } from '@/services/certificateService';
import { useCompanyBySlug } from '@/hooks/useCompany';
import CertificateCard from '@/components/CertificateCard';

const GunungSahidProfile = () => {
  const [selectedCertificate, setSelectedCertificate] = React.useState<Certificate | null>(null);

  // Fetch company data by slug
  const { data: companyData, isLoading: isLoadingCompany, isError: isErrorCompany } = useCompanyBySlug('gunung-sahid');
  
  const { data: certificateData, isLoading: isLoadingCertificates, isError: isErrorCertificates } = useQuery({
    queryKey: ['certificates', { subsidiary: 'PT. GUNUNG SAHID' }],
    queryFn: () => getCertificatesAPI({ subsidiary: 'PT. GUNUNG SAHID', limit: 100 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const certificates = certificateData?.data || [];
  const company = companyData?.data;

  if (isLoadingCompany) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (isErrorCompany || !company) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-600">Gagal memuat data perusahaan</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
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
                  Profil
                  <span className="block text-construction-orange-400 mt-2">
                    {company.name}
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/95 mb-0 max-w-4xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                  {company.description || 'Spesialis pengadaan dan konstruksi dengan dedikasi tinggi untuk kualitas terbaik'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-4">
                Tentang {company.name}
              </h2>
              <div className="w-24 h-1 bg-construction-blue-600 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Company Image */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <img
                    src={company.logo || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={`${company.name} Office`}
                    className="w-full h-96 object-cover rounded-2xl shadow-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-construction-blue-600 bg-opacity-10 rounded-2xl"></div>
                </div>
                
                {/* Company Stats */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-construction-gray-50 p-6 rounded-xl text-center">
                    <div className="text-2xl font-bold text-construction-blue-600 mb-2">
                      {company.establishedYear || '2003'}
                    </div>
                    <div className="text-sm text-construction-gray-600">Tahun Didirikan</div>
                  </div>
                  <div className="bg-construction-gray-50 p-6 rounded-xl text-center">
                    <div className="text-2xl font-bold text-construction-blue-600 mb-2">20+</div>
                    <div className="text-sm text-construction-gray-600">Tahun Pengalaman</div>
                  </div>
                </div>
              </div>
              
              {/* Company Description */}
              <div className="order-1 lg:order-2">
                <div className="prose prose-lg text-construction-gray-700 leading-relaxed">
                  {company.history ? (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: company.history.replace(/\n/g, '</p><p class="mb-6">') 
                      }} 
                      className="space-y-6"
                    />
                  ) : (
                    <div className="space-y-6">
                      <p className="text-lg leading-relaxed">
                        <strong>{company.name}</strong> didirikan pada tahun <strong>{company.establishedYear || '2003'}</strong> sebagai perusahaan yang 
                        bergerak dalam bidang kontraktor umum dengan fokus khusus pada pengadaan barang dan jasa konstruksi.
                      </p>
                      <p className="text-lg leading-relaxed">
                        Perusahaan ini memiliki keahlian dalam pembangunan dan konstruksi real estate, perencanaan dan pelaksanaan konstruksi gedung, jembatan, jalan, sistem pengairan dan irigasi, serta survey dan pemetaan.
                      </p>
                      <p className="text-lg leading-relaxed">
                        Berkedudukan di {company.address ? company.address.split(',')[0] : 'Jakarta'} dengan jaringan cabang dan perwakilan di berbagai tempat, {company.name} berkomitmen untuk menghadirkan solusi konstruksi terbaik dengan dukungan karyawan yang unggul dan fokus pada kepuasan klien.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-construction-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {company.vision && (
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h3 className="text-2xl font-heading font-bold text-construction-blue-600 mb-6">Visi</h3>
                  <p className="text-lg text-construction-gray-700 leading-relaxed">
                    {company.vision}
                  </p>
                </div>
              )}
              {company.mission && (
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h3 className="text-2xl font-heading font-bold text-construction-blue-600 mb-6">Misi</h3>
                  <div className="text-lg text-construction-gray-700 leading-relaxed">
                    {company.mission.includes('\n') ? (
                      <ul className="space-y-3">
                        {company.mission.split('\n').filter(line => line.trim()).map((line, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-construction-blue-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                            {line.trim()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{company.mission}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Default fallback if no vision/mission */}
              {!company.vision && !company.mission && (
                <>
                  <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-heading font-bold text-construction-blue-600 mb-6">Visi</h3>
                    <p className="text-lg text-construction-gray-700 leading-relaxed">
                      Menjadi perusahaan konstruksi yang unggul dan terpercaya dalam memberikan solusi pengadaan dan konstruksi berkualitas tinggi.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-heading font-bold text-construction-blue-600 mb-6">Misi</h3>
                    <ul className="space-y-3 text-lg text-construction-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-construction-blue-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                        Mewujudkan impian konsumen terhadap jasa konstruksi berkualitas melalui keunggulan inovasi sistem manajemen dan sumber daya manusia
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-construction-blue-600 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                        Mengupayakan tingkat pengembalian yang optimal bagi mitra strategis perusahaan
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Certificates Section */}
        <section id="certificates" className="py-20 bg-construction-white-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900">
                Sertifikasi & Akreditasi
              </h2>
              <p className="mt-4 text-lg text-construction-gray-600 max-w-3xl mx-auto">
                Komitmen kami terhadap kualitas dan standar profesional yang diakui secara resmi.
              </p>
            </div>

            {isLoadingCertificates ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : isErrorCertificates ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-red-600 mb-2">Gagal Memuat Sertifikat</h3>
                <p className="text-gray-500">Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.</p>
              </div>
            ) : certificates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {certificates.map((certificate) => (
                  <CertificateCard
                    key={certificate._id}
                    certificate={certificate}
                    onClick={() => setSelectedCertificate(certificate)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Sertifikat Tidak Ditemukan</h3>
                <p className="text-gray-500">Saat ini belum ada sertifikat yang terdaftar untuk perusahaan ini.</p>
              </div>
            )}
          </div>
        </section>

        {/* Certificate Modal */}
      {selectedCertificate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedCertificate(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-auto relative transform transition-all duration-300 ease-in-out scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 bg-construction-gray-900 text-white rounded-full p-2 hover:bg-construction-gray-700 transition-colors z-10"
              aria-label="Tutup modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8">
              <div className="mb-6">
                <span className="text-sm font-semibold text-construction-blue-600 bg-construction-blue-100 px-3 py-1 rounded-full">
                  {selectedCertificate.type}
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
                  src={`http://localhost:5000${selectedCertificate.image}`}
                  alt={selectedCertificate.title}
                  className="w-full h-auto object-contain max-h-[65vh]"
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

      {/* Contact Information */}
      <section className="py-20 bg-construction-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-heading font-bold text-construction-gray-900 mb-8">
                  Informasi Kontak
                </h2>
                <div className="space-y-6">
                  {company.address && (
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 text-construction-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-construction-gray-900">Alamat</h3>
                        <div className="text-construction-gray-600">
                          {company.address.split(',').map((line, index) => (
                            <span key={index}>
                              {line.trim()}
                              {index < company.address.split(',').length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-start space-x-4">
                      <Phone className="w-6 h-6 text-construction-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-construction-gray-900">Telepon & Fax</h3>
                        <p className="text-construction-gray-600">{company.phone}</p>
                      </div>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-start space-x-4">
                      <Mail className="w-6 h-6 text-construction-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-construction-gray-900">Email</h3>
                        <p className="text-construction-gray-600">{company.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Fallback jika tidak ada data kontak */}
                  {!company.address && !company.phone && !company.email && (
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 text-construction-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-construction-gray-900">Alamat</h3>
                        <p className="text-construction-gray-600">
                          Informasi kontak belum tersedia
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-heading font-bold text-construction-gray-900 mb-6">
                  Lihat Lebih Lanjut
                </h3>
                <div className="space-y-4">
                  <Button asChild className="w-full bg-construction-blue-600 hover:bg-construction-blue-700">
                    <Link to="/business-units/gunung-sahid/projects">
                      <Building className="w-4 h-4 mr-2" />
                      Lihat Proyek Kami
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-construction-blue-600 text-construction-blue-600 hover:bg-construction-blue-50">
                    <Link to="/business-units/gunung-sahid/download">
                      <Download className="w-4 h-4 mr-2" />
                      Download Company Profile
                    </Link>
                  </Button>
                </div>
              </div> */}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default GunungSahidProfile;