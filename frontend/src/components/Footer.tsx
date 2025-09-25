
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Printer } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Proyek', href: '/projects' },
    { name: 'Kontak', href: '/contact' },
    { name: 'Anak Perusahaan', href: '/business-units' },
    { name: 'Klien', href: '/clients' },
    { name: 'Karir', href: '/careers' },
    { name: 'Kontak', href: '/contact' },
  ];
  
  const subsidiaries = [
    { 
      name: 'PT John dan Ro',
      profile: '/business-units/jhon-ro/profile',
      projects: '/business-units/jhon-ro/projects' 
    },
    { 
      name: 'PT Gunung Sahid',
      profile: '/business-units/gunung-sahid/profile',
      projects: '/business-units/gunung-sahid/projects'
    },
    { 
      name: 'PT Arimada Persada',
      profile: '/business-units/arimada-persada/profile',
      projects: '/business-units/arimada-persada/projects'
    }
  ];

  const services = [
    'General Contractor',
    'Civil Engineering',
    'Supplier',
    'Microtunnelling',
    'Sistem Drainase',
    'Jaringan Pipa Air Limbah',
  ];

  return (
    <footer className="bg-construction-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="bg-white p-2 rounded-lg shadow-lg">
                    <img src="/logo.png" alt="Rosa Lisca Logo" className="h-12 w-auto" />
                  </div>
                </Link>
              </div>
            </div>
            <p className="text-construction-gray-300 text-sm leading-relaxed mb-4">
              Perusahaan konstruksi terkemuka di Indonesia dengan pengalaman lebih dari 20 tahun dalam bidang General Contractor, Civil Engineering, dan Supplier.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Menu Utama</h3>
            <ul className="space-y-2">
              {navigation.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-construction-gray-300 hover:text-construction-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subsidiaries Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Anak Perusahaan</h3>
            <ul className="space-y-2">
              {subsidiaries.map((subsidiary) => (
                <li key={subsidiary.name} className="mb-2">
                  <p className="text-construction-gray-300 text-sm font-medium">
                    {subsidiary.name}
                  </p>
                  <div className="mt-1 pl-2 flex flex-col space-y-1">
                    <Link
                      to={subsidiary.profile}
                      className="text-construction-gray-400 hover:text-construction-blue-400 transition-colors duration-200 text-xs"
                    >
                      Profil
                    </Link>
                    <Link
                      to={subsidiary.projects}
                      className="text-construction-gray-400 hover:text-construction-blue-400 transition-colors duration-200 text-xs"
                    >
                      Proyek
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Contact Info */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Layanan Kami</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-construction-gray-300 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Kontak Kami</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-construction-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-construction-gray-300 text-sm">
                  <p>RUKO MEGA GROSIR</p>
                  <p>CEMPAKA MAS BLOK J NO 16</p>
                  <p>JAKARTA PUSAT-10640</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-construction-blue-400 flex-shrink-0" />
                <a 
                  href="tel:+622142884684" 
                  className="text-construction-gray-300 hover:text-construction-blue-400 transition-colors text-sm"
                >
                  +6221-42884684
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Printer className="w-5 h-5 text-construction-blue-400 flex-shrink-0" />
                <span className="text-construction-gray-300 text-sm">
                  +6221-42882459
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-construction-blue-400 flex-shrink-0" />
                <a 
                  href="mailto:rosa_lisca@yahoo.com" 
                  className="text-construction-gray-300 hover:text-construction-blue-400 transition-colors text-sm"
                >
                  rosa_lisca@yahoo.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-construction-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-construction-gray-400 text-sm">
              © {currentYear} ROSALISCA GROUP. All Rights Reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {navigation.slice(4).map((link) => (
                <Link 
                  key={link.name}
                  to={link.href} 
                  className="text-construction-gray-400 hover:text-construction-blue-400 transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
