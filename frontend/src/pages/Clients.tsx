
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Search, Globe, Filter, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { 
  getClientsAPI, 
  Client, 
  ClientFilters, 
  getCategoryLabel, 
  getCategoryBadgeColor 
} from '@/services/clientService';
import { useToast } from '@/hooks/use-toast';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load clients from API
  const loadClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filters: ClientFilters = {
        status: 'active' // Only show active clients on public page
      };
      
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory !== 'all') filters.category = selectedCategory;
      
      const response = await getClientsAPI(filters);
      setClients(response.data);
      setStatistics(response.statistics);
    } catch (error: any) {
      console.error('Error loading clients:', error);
      
      const errorMessage = error.response?.data?.message || 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.';
      setError(errorMessage);
      setClients([]);
      setStatistics(null);
      
      toast({
        title: 'Gagal Memuat Klien',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load clients on component mount and when filters change
  useEffect(() => {
    loadClients();
  }, [searchTerm, selectedCategory]);

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
  }, [clients]); // Re-run when clients change

  const filteredClients = clients;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

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
                  Klien
                  <span className="block text-construction-orange-400 mt-2">
                    Terpercaya
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/95 mb-0 max-w-4xl mx-auto leading-relaxed px-4 drop-shadow-lg">
                  Lebih dari {statistics?.total || clients.length}+ klien dari berbagai sektor telah mempercayakan proyek konstruksi mereka kepada kami.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Client Logos */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-construction-gray-900 mb-6">
                Klien Terpercaya Kami
              </h2>
              <p className="text-lg text-construction-gray-600 max-w-3xl mx-auto">
                Kami bangga telah melayani berbagai kementerian, lembaga pemerintah, dan perusahaan terkemuka di Indonesia dengan hasil yang memuaskan.
              </p>
            </div>

            {/* Filters */}
            <div className="bg-construction-gray-50 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-construction-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari klien..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-construction-gray-400" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      <SelectItem value="government">Pemerintah</SelectItem>
                      <SelectItem value="private">Swasta</SelectItem>
                      <SelectItem value="bumn">BUMN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(searchTerm || selectedCategory !== 'all') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-construction-gray-600">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat data klien...
                  </span>
                ) : error ? (
                  <span className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </span>
                ) : (
                  `Menampilkan ${filteredClients.length} dari ${clients.length} klien`
                )}
              </p>
              {!isLoading && !error && filteredClients.length > 0 && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-construction-gray-400" />
                  <span className="text-sm text-construction-gray-600">
                    Berbagai kategori klien
                  </span>
                </div>
              )}
            </div>

            {/* Client Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {filteredClients.map((client, index) => (
                  <Card 
                    key={client._id}
                    className="group hover:shadow-lg transition-all duration-300 animate-on-scroll"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      {/* Logo */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-24 h-24 bg-construction-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-construction-gray-200">
                          {client.logo ? (
                            <img 
                              src={client.logo.startsWith('http') ? client.logo : `http://localhost:5000${client.logo}`} 
                              alt={client.name}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                if (target.parentElement) {
                                  target.parentElement.innerHTML = `<div class="w-full h-full bg-construction-gray-300 rounded flex items-center justify-center text-construction-gray-600 text-lg font-bold">${client.name.charAt(0)}</div>`;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-construction-gray-300 rounded flex items-center justify-center text-construction-gray-600 text-lg font-bold">
                              {client.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="text-center mb-4">
                        <h3 className="font-semibold text-construction-gray-900 mb-2 text-lg">
                          {client.name}
                        </h3>
                        <p className="text-sm text-construction-gray-600 mb-3">
                          {client.description}
                        </p>
                        <Badge className={getCategoryBadgeColor(client.category)}>
                          {getCategoryLabel(client.category)}
                        </Badge>
                      </div>

                      {/* Website */}
                      {client.website && (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-construction-gray-600">
                            <Globe className="h-4 w-4" />
                            <span className="text-sm truncate">{client.website}</span>
                          </div>
                        </div>
                      )}

                      {/* Project Count */}
                      {client.projectCount > 0 && (
                        <div className="text-center mt-2">
                          <span className="text-xs text-construction-blue-600 bg-construction-blue-50 px-2 py-1 rounded">
                            {client.projectCount} proyek
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-construction-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-construction-gray-900 mb-2">
                  Tidak ada klien ditemukan
                </h3>
                <p className="text-construction-gray-600 mb-4">
                  Coba ubah kata kunci pencarian atau filter kategori
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Reset Filter
                </Button>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-construction-gray-900 mb-2">
                  Gagal Memuat Data
                </h3>
                <p className="text-construction-gray-600 mb-4">
                  {error}
                </p>
                <Button variant="outline" onClick={loadClients}>
                  Coba Lagi
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Clients;