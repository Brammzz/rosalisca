
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getClientsAPI, Client, getCategoryLabel, getCategoryBadgeColor } from '@/services/clientService';

const ClientLogos = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        const response = await getClientsAPI({ status: 'active', limit: 8 });
        setClients(response.data);
      } catch (err) {
        setError('Gagal memuat data klien.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'government':
        return 'bg-blue-100 text-blue-800';
      case 'private':
        return 'bg-green-100 text-green-800';
      case 'bumn':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'government':
        return 'Pemerintah';
      case 'private':
        return 'Swasta';
      case 'bumn':
        return 'BUMN';
      default:
        return category;
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath || imagePath === '') return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    return `http://localhost:5000/uploads/${imagePath}`;
  };

  return (
    <section className="py-16 bg-construction-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-on-scroll">
          <div className="text-construction-blue-600 font-semibold text-sm uppercase tracking-wide mb-4">
            Klien Terpercaya
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-6">
            Dipercaya oleh {clients.length}+ Klien Terkemuka
          </h2>
          <p className="text-lg text-construction-gray-600 max-w-3xl mx-auto">
            Kami bangga telah melayani berbagai kementerian, lembaga pemerintah, dan perusahaan terkemuka di Indonesia dengan hasil yang memuaskan.
          </p>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-construction-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-construction-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-construction-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-construction-gray-900 mb-2">
                Gagal Memuat Data
              </h3>
              <p className="text-construction-gray-600">{error}</p>
            </div>
          ) : (
            clients.map((client, index) => (
              <div 
                key={client._id}
                className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-construction-gray-200 group-hover:border-construction-blue-300 transition-colors mb-3">
                    <img 
                      src={getImageUrl(client.logo)} 
                      alt={client.name}
                      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-construction-gray-200 rounded flex items-center justify-center text-construction-gray-500 text-xs">Logo</div>`;
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-medium text-construction-gray-900 text-center mb-1">
                    {client.name}
                  </h3>
                  <Badge className={`text-xs ${getCategoryBadgeColor(client.category)}`}>
                    {getCategoryLabel(client.category)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Clients Button */}
        <div className="text-center mt-12">
          <Link to="/clients">
            <Button className="bg-construction-blue-600 hover:bg-construction-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
              Lihat Semua Klien
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Testimonial */}
        <div className="mt-16 text-center animate-on-scroll">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <blockquote className="text-xl md:text-2xl text-construction-gray-700 italic mb-6 leading-relaxed">
              "ROSALISCA GROUP telah membuktikan komitmen mereka dalam memberikan hasil terbaik. Dengan portfolio klien yang beragam, kami selalu memberikan layanan konstruksi berkualitas tinggi untuk setiap proyek."
            </blockquote>
            <div className="text-construction-blue-600 font-semibold">
              — Tim Manajemen ROSALISCA GROUP
            </div>
            <div className="mt-4 text-sm text-construction-gray-500">
              Melayani klien terpercaya dengan tingkat kepuasan 100%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
