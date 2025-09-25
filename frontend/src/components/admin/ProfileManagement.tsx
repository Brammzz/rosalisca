import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Edit, 
  Building, 
  Phone,
  Mail,
  Award,
  Eye,
  Target,
  Star,
  Briefcase,
  TrendingUp,
  Search,
  RefreshCw,
  Loader2,
  X,
  Save,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useCompanies, 
  useUpdateCompany, 
  useCompanyStats
} from '@/hooks/useCompany';
import { Company, CompanyFilters } from '@/services/companyService';

const ProfileManagement = () => {
  const { toast } = useToast();
  
  // State for UI
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'sortOrder',
    sortOrder: 'asc'
  });
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'about'>('basic');
  
  // Form data state
  const [formData, setFormData] = useState<Partial<Company>>({});
  
  // Hooks
  const { data: companiesData, isLoading: companiesLoading, refetch: refetchCompanies } = useCompanies(filters);
  const { data: statsData, isLoading: statsLoading } = useCompanyStats();
  const updateCompanyMutation = useUpdateCompany();
  
  const companies = companiesData?.data || [];
  const stats = statsData?.data || {
    totalCompanies: 0,
    parentCompanies: 0,
    subsidiaries: 0,
    activeCompanies: 0
  };

  // Handlers
  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      description: company.description,
      address: company.address,
      phone: company.phone,
      email: company.email,
      establishedYear: company.establishedYear,
      specialization: company.specialization,
      vision: company.vision,
      mission: company.mission,
      history: company.history,
      achievements: company.achievements || []
    });
    setIsEditDialogOpen(true);
  };

  const handleView = (company: Company) => {
    setSelectedCompany(company);
    setIsViewDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    updateCompanyMutation.mutate({
      id: editingCompany._id,
      data: formData
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setEditingCompany(null);
        setFormData({});
        refetchCompanies();
      }
    });
  };

  const resetForm = () => {
    setFormData({});
    setEditingCompany(null);
  };

  // Array field handlers
  const addArrayItem = (field: keyof Company, value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value.trim()]
    }));
  };

  const removeArrayItem = (field: keyof Company, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  // Array field component
  const ArrayFieldInput = ({ field, label, placeholder }: {
    field: keyof Company;
    label: string;
    placeholder: string;
  }) => {
    const [inputValue, setInputValue] = useState('');
    const items = (formData[field] as string[]) || [];

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArrayItem(field, inputValue);
                setInputValue('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addArrayItem(field, inputValue);
              setInputValue('');
            }}
            disabled={!inputValue.trim()}
          >
            Tambah
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {item}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeArrayItem(field, index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  if (companiesLoading || statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Profil</h1>
          <p className="text-gray-600 mt-1">Kelola profil dan informasi perusahaan</p>
        </div>
        <Button 
          onClick={() => refetchCompanies()}
          disabled={companiesLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${companiesLoading ? 'animate-spin' : ''}`} />
          Perbarui
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCompanies}</p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktif</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCompanies}</p>
              </div>
              <Star className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tidak Aktif</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalCompanies - stats.activeCompanies}</p>
              </div>
              <X className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Induk</p>
                <p className="text-2xl font-bold text-purple-600">{stats.parentCompanies}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Perusahaan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari perusahaan..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perusahaan</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {company.logo ? (
                          <img 
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${company.logo}`}
                            alt={company.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-muted-foreground">{company.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.type === 'parent' ? 'default' : 'secondary'}>
                      {company.type === 'parent' ? 'Induk' : 'Anak Perusahaan'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {company.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{company.phone}</span>
                        </div>
                      )}
                      {company.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{company.email}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.isActive ? 'default' : 'destructive'}>
                      {company.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(company)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Lihat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(company)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {companies.length === 0 && (
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Tidak ada perusahaan yang ditemukan</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Perusahaan - {editingCompany?.name}
            </DialogTitle>
            <DialogDescription>
              Perbarui informasi dan detail profil perusahaan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basic' | 'about')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Info Dasar</TabsTrigger>
                <TabsTrigger value="about">Tentang</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Perusahaan *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Masukkan nama perusahaan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telepon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Masukkan nomor telepon"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Masukkan alamat email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Masukkan alamat perusahaan"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Masukkan deskripsi perusahaan"
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="about" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vision">Visi</Label>
                  <Textarea
                    id="vision"
                    value={formData.vision || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
                    placeholder="Masukkan visi perusahaan"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mission">Misi</Label>
                  <Textarea
                    id="mission"
                    value={formData.mission || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                    placeholder="Masukkan misi perusahaan"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="history">Sejarah</Label>
                  <Textarea
                    id="history"
                    value={formData.history || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, history: e.target.value }))}
                    placeholder="Masukkan sejarah perusahaan"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Tahun Didirikan</Label>
                    <Input
                      id="establishedYear"
                      type="text"
                      value={formData.establishedYear || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
                      placeholder="Masukkan tahun didirikan"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Spesialisasi</Label>
                    <Input
                      id="specialization"
                      type="text"
                      value={formData.specialization || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                      placeholder="Masukkan spesialisasi"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <ArrayFieldInput 
                    field="achievements" 
                    label="Pencapaian" 
                    placeholder="Pencapaian" 
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={updateCompanyMutation.isPending}
                className="flex items-center gap-2"
              >
                {updateCompanyMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Company Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {selectedCompany?.name}
            </DialogTitle>
            <DialogDescription>
              Profil perusahaan dan informasi detail
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informasi Dasar</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Tipe:</span>
                      <Badge variant={selectedCompany.type === 'parent' ? 'default' : 'secondary'}>
                        {selectedCompany.type === 'parent' ? 'Perusahaan Induk' : 'Anak Perusahaan'}
                      </Badge>
                    </div>
                    
                    {selectedCompany.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Telepon:</span>
                        <span>{selectedCompany.phone}</span>
                      </div>
                    )}
                    
                    {selectedCompany.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span>{selectedCompany.email}</span>
                      </div>
                    )}
                    
                    {selectedCompany.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium">Alamat:</span>
                          <p className="text-sm text-muted-foreground mt-1">{selectedCompany.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedCompany.logo && (
                    <div>
                      <h3 className="font-semibold mb-2">Logo</h3>
                      <div className="w-32 h-32 border rounded-lg overflow-hidden">
                        <img 
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${selectedCompany.logo}`}
                          alt={selectedCompany.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedCompany.description && (
                <>
                  <hr />
                  <div>
                    <h3 className="font-semibold mb-2">Deskripsi</h3>
                    <p className="text-sm text-muted-foreground">{selectedCompany.description}</p>
                  </div>
                </>
              )}

              {/* Profile specific fields */}
              {(selectedCompany.director || selectedCompany.specialization || selectedCompany.establishedYear) && (
                <>
                  <hr />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCompany.director && (
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Direktur
                        </h3>
                        <p className="text-sm text-muted-foreground">{selectedCompany.director}</p>
                      </div>
                    )}
                    {selectedCompany.specialization && (
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Spesialisasi
                        </h3>
                        <p className="text-sm text-muted-foreground">{selectedCompany.specialization}</p>
                      </div>
                    )}
                    {selectedCompany.establishedYear && (
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Tahun Didirikan
                        </h3>
                        <p className="text-sm text-muted-foreground">{selectedCompany.establishedYear}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Vision & Mission */}
              {(selectedCompany.vision || selectedCompany.mission) && (
                <>
                  <hr />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedCompany.vision && (
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          Visi
                        </h3>
                        <p className="text-sm text-muted-foreground">{selectedCompany.vision}</p>
                      </div>
                    )}
                    {selectedCompany.mission && (
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          Misi
                        </h3>
                        <p className="text-sm text-muted-foreground">{selectedCompany.mission}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedCompany.history && (
                <>
                  <hr />
                  <div>
                    <h3 className="font-semibold mb-2">Sejarah</h3>
                    <p className="text-sm text-muted-foreground">{selectedCompany.history}</p>
                  </div>
                </>
              )}

              {selectedCompany.achievements && selectedCompany.achievements.length > 0 && (
                <>
                  <hr />
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Pencapaian
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.achievements.map((achievement, index) => (
                        <Badge key={index} variant="default">{achievement}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Subsidiary specific fields */}
              {selectedCompany.type === 'subsidiary' && (
                <>
                  {selectedCompany.projectTypes && selectedCompany.projectTypes.length > 0 && (
                    <>
                      <hr />
                      <div>
                        <h3 className="font-semibold mb-2">Tipe Proyek</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCompany.projectTypes.map((type, index) => (
                            <Badge key={index} variant="outline">{type}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedCompany.clientTypes && selectedCompany.clientTypes.length > 0 && (
                    <>
                      <hr />
                      <div>
                        <h3 className="font-semibold mb-2">Tipe Klien</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCompany.clientTypes.map((type, index) => (
                            <Badge key={index} variant="secondary">{type}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedCompany.expertise && selectedCompany.expertise.length > 0 && (
                    <>
                      <hr />
                      <div>
                        <h3 className="font-semibold mb-2">Bidang Keahlian</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCompany.expertise.map((area, index) => (
                            <Badge key={index} variant="default">{area}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {selectedCompany.certifications && selectedCompany.certifications.length > 0 && (
                <>
                  <hr />
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Sertifikasi
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileManagement;
