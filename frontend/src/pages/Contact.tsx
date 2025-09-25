
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createContactAPI, NewContactData } from '@/services/contactService';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    projectType: ''
  });
  const { toast } = useToast();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const contactData: NewContactData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.subject,
        message: formData.message,
        projectType: formData.projectType || 'lainnya'
      };

      await createContactAPI(contactData);
      
      toast({
        title: "Berhasil",
        description: "Pesan Anda telah terkirim. Tim kami akan menghubungi Anda segera.",
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        projectType: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal mengirim pesan. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat Kantor',
      details: [
        'Jl. Raya Konstruksi No. 123',
        'Jakarta Selatan 12345',
        'Indonesia'
      ]
    },
    {
      icon: Phone,
      title: 'Telepon & Fax',
      details: [
        '+62 21 1234 5678',
        '+62 21 1234 5679 (Fax)',
        '+62 812 3456 7890 (Mobile)'
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        'info@rosalisca.co.id',
        'sales@rosalisca.co.id',
        'career@rosalisca.co.id'
      ]
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      details: [
        'Senin - Jumat: 08:00 - 17:00',
        'Sabtu: 08:00 - 12:00',
        'Minggu: Tutup'
      ]
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
                  Hubungi
                  <span className="block text-construction-orange-400 mt-2">
                    Kami
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/95 mb-0 max-w-4xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                  Siap membantu mewujudkan proyek konstruksi impian Anda dengan solusi terbaik dan pelayanan profesional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-4">
                Informasi Kontak
              </h2>
              <p className="text-lg text-construction-gray-600 max-w-3xl mx-auto">
                Berbagai cara untuk menghubungi tim kami yang siap membantu Anda 24/7
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="text-center p-8 rounded-2xl bg-construction-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 animate-on-scroll"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <info.icon className="w-12 h-12 text-construction-blue-600 mx-auto mb-6" />
                  <h3 className="text-lg font-heading font-bold text-construction-gray-900 mb-4">
                    {info.title}
                  </h3>
                  <div className="space-y-2">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-construction-gray-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-construction-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="animate-on-scroll">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-6">
                  Kirim Pesan
                </h2>
                <p className="text-lg text-construction-gray-600 mb-8">
                  Ceritakan kebutuhan proyek Anda dan tim ahli kami akan menghubungi Anda dalam 24 jam.
                </p>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-construction-gray-900 mb-2">
                        Nama Depan *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-construction-gray-300 rounded-lg focus:ring-2 focus:ring-construction-blue-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-construction-gray-900 mb-2">
                        Nama Belakang *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-construction-gray-300 rounded-lg focus:ring-2 focus:ring-construction-blue-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-construction-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-construction-gray-300 rounded-lg focus:ring-2 focus:ring-construction-blue-500 focus:border-transparent"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-construction-gray-900 mb-2">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-construction-gray-300 rounded-lg focus:ring-2 focus:ring-construction-blue-500 focus:border-transparent"
                      placeholder="+62 812 3456 7890"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-construction-gray-900 mb-2">
                      Perusahaan
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-construction-gray-300 rounded-lg focus:ring-2 focus:ring-construction-blue-500 focus:border-transparent"
                      placeholder="PT. Example Company"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-construction-gray-900 mb-2">
                      Subjek *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-construction-gray-300 rounded-lg focus:ring-2 focus:ring-construction-blue-500 focus:border-transparent"
                      placeholder="Konsultasi Proyek Konstruksi"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-construction-gray-900 mb-2">
                      Jenis Proyek
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-construction-gray-300 rounded-lg focus:ring-2 focus:ring-construction-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih jenis proyek</option>
                      <option value="konstruksi-umum">Konstruksi Umum</option>
                      <option value="microtunnelling">Microtunnelling</option>
                      <option value="pile-foundation">Pile Foundation</option>
                      <option value="piling-work">Piling Work</option>
                      <option value="dewatering">Dewatering</option>
                      <option value="konsultasi">Konsultasi</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-construction-gray-900 mb-2">
                      Pesan *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-construction-gray-300 rounded-lg focus:ring-2 focus:ring-construction-blue-500 focus:border-transparent resize-none"
                      placeholder="Ceritakan detail proyek Anda, timeline, budget estimasi, dan informasi lain yang relevan..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-construction-blue-600 hover:bg-construction-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Map */}
              <div className="animate-on-scroll">
                <h3 className="text-2xl font-heading font-bold text-construction-gray-900 mb-6">
                  Lokasi Kantor
                </h3>
                <div className="bg-gray-200 rounded-2xl h-96 overflow-hidden mb-6 shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.760777196004!2d106.8747304!3d-6.163252199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f50025481ccf%3A0x9c0237dc56b7152!2sPT.%20Rosa%20Lisca%20Group!5e0!3m2!1sen!2sid!4v1678886400000!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Kantor PT. ROSALISCA GROUP"
                  ></iframe>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h4 className="font-heading font-bold text-construction-gray-900 mb-4">
                    Kunjungi Kantor Kami
                  </h4>
                  <div className="space-y-3 text-construction-gray-600">
                    <div className="flex items-start">
                      <MapPin className="w-10 h-10 text-construction-blue-600 mt-1 mr-3" />
                      <div>
                        <p className="font-medium">Alamat Lengkap:</p>
                        <p>Jl. Apartemen Graha Cemp. MAS No.14, RW.8, Sumur Batu, Kec. Kemayoran, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10640<br />Indonesia</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-construction-blue-600 mt-1 mr-3" />
                      <div>
                        <p className="font-medium">Jam Buka:</p>
                        <p>Senin - Jumat: 08:00 - 17:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;