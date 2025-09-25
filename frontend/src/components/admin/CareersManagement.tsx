import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Clock
} from 'lucide-react';
import careerService from '@/services/careerService';

interface Career {
  _id: string;
  title: string;
  location: string;
  experienceLevel: string;
  description: string;
  status: string;
  applicationCount: number;
  publishDate: string;
  closeDate: string;
  featured: boolean;
}

interface DashboardStats {
  overview: {
    totalCareers: number;
    activeCareers: number;
    totalApplications: number;
    pendingApplications: number;
  };
}

interface CareerFormData {
  title: string;
  location: string;
  experienceLevel: string;
  description: string;
  closeDate: string;
  featured: boolean;
  status: string;
}

const experienceLevels = ['Lulus SMA', 'Fresh Graduate', '1-2 tahun', '3-5 tahun', '5+ tahun', '10+ tahun'];
const statusOptions = [
  { value: 'draft', label: 'Draft', description: 'Belum dipublikasi' },
  { value: 'active', label: 'Aktif', description: 'Dipublikasi dan bisa dilamar' },
  { value: 'closed', label: 'Tutup', description: 'Tidak menerima lamaran baru' },
  { value: 'archived', label: 'Arsip', description: 'Lowongan lama yang diarsipkan' }
];

// Career Form Component - Extracted to prevent re-creation on each render
const CareerForm = React.memo(({ 
  formData, 
  setFormData, 
  experienceLevels,
  isEdit = false 
}: { 
  formData: CareerFormData;
  setFormData: React.Dispatch<React.SetStateAction<CareerFormData>>;
  experienceLevels: string[];
  isEdit?: boolean;
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Judul Posisi
        </label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Masukkan judul posisi"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lokasi
        </label>
        <Input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Jakarta, Surabaya, dll"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Level Pengalaman
        </label>
        <select
          value={formData.experienceLevel}
          onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-construction-blue-500"
          required
        >
          <option value="">Pilih Level Pengalaman</option>
          {experienceLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status Lowongan
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-construction-blue-500"
          required
        >
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>
              {status.label} - {status.description}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Hanya lowongan dengan status "Aktif" yang akan muncul di halaman publik
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal Tutup
        </label>
        <Input
          type="date"
          value={formData.closeDate}
          onChange={(e) => setFormData(prev => ({ ...prev, closeDate: e.target.value }))}
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Deskripsi Pekerjaan
      </label>
      <Textarea
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Deskripsikan posisi ini secara detail..."
        rows={4}
        required
      />
    </div>

    <div className="flex items-center">
      <input
        type="checkbox"
        id="featured"
        checked={formData.featured}
        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
        className="mr-2"
      />
      <label htmlFor="featured" className="text-sm font-medium text-gray-700">
        Jadikan lowongan unggulan
      </label>
    </div>
  </div>
));

const CareersManagement = () => {
  const { isAuthenticated, user } = useAuth();
  const [careers, setCareers] = useState<Career[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState<Career | null>(null);
  const [formData, setFormData] = useState<CareerFormData>({
    title: '',
    location: '',
    experienceLevel: '',
    description: '',
    closeDate: '',
    featured: false,
    status: 'draft'
  });

  useEffect(() => {
    loadData();
  }, [currentPage, searchTerm, filterStatus]);

  const loadData = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping data load');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Load careers and stats in parallel
      const [careersResponse, statsResponse] = await Promise.all([
        careerService.getAllCareers({
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
          status: filterStatus === 'all' ? undefined : filterStatus,
        }),
        careerService.getDashboardStats()
      ]);

      if (careersResponse.success) {
        setCareers(careersResponse.data);
        setTotalPages(careersResponse.pagination.pages);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCareer = async () => {
    try {
      const response = await careerService.createCareer(formData);
      if (response.success) {
        setShowCreateForm(false);
        resetForm();
        loadData();
      }
    } catch (error) {
      console.error('Error creating career:', error);
    }
  };

  const handleUpdateCareer = async () => {
    if (!editingCareer) return;
    
    try {
      const response = await careerService.updateCareer(editingCareer._id, formData);
      if (response.success) {
        setEditingCareer(null);
        resetForm();
        loadData();
      }
    } catch (error) {
      console.error('Error updating career:', error);
    }
  };

  const handleDeleteCareer = (career: Career) => {
    setCareerToDelete(career);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCareer = async () => {
    if (careerToDelete) {
      try {
        await careerService.deleteCareer(careerToDelete._id);
        loadData(); // Refresh list
        setIsDeleteDialogOpen(false);
        setCareerToDelete(null);
      } catch (error) {
        console.error('Failed to delete career:', error);
        // Optionally, show a toast notification for the error
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      experienceLevel: '',
      description: '',
      closeDate: '',
      featured: false,
      status: 'draft'
    });
  };

  const openEditForm = (career: Career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title,
      location: career.location,
      experienceLevel: career.experienceLevel,
      description: career.description,
      closeDate: career.closeDate.split('T')[0],
      featured: career.featured,
      status: career.status
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Aktif' },
      draft: { variant: 'secondary' as const, label: 'Draft' },
      closed: { variant: 'destructive' as const, label: 'Tutup' },
      archived: { variant: 'outline' as const, label: 'Arsip' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {!isAuthenticated ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Akses Terbatas</h2>
            <p className="text-gray-600">Anda harus login sebagai admin untuk mengakses halaman ini.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Karir</h1>
              <p className="text-gray-600">Kelola lowongan pekerjaan dan aplikasi pelamar</p>
            </div>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button className="bg-construction-blue-600 hover:bg-construction-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Lowongan Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Lowongan Baru</DialogTitle>
                  <DialogDescription>
                    Isi form di bawah untuk membuat lowongan pekerjaan baru
                  </DialogDescription>
                </DialogHeader>
                <CareerForm 
                  formData={formData}
                  setFormData={setFormData}
                  experienceLevels={experienceLevels}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Batal
                  </Button>
                  <Button className="bg-construction-blue-600 hover:bg-construction-blue-700" onClick={handleCreateCareer}>
                    Simpan Lowongan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Dashboard Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Briefcase className="w-8 h-8 text-construction-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Lowongan</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.overview.totalCareers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Lowongan Aktif</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.overview.activeCareers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-construction-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Aplikasi</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.overview.totalApplications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Menunggu Review</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.overview.pendingApplications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari lowongan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Tutup</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Careers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Lowongan
                ({careers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-construction-blue-600"></div>
                  <p className="mt-4 text-gray-600">Memuat data...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul Posisi</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aplikasi</TableHead>
                      <TableHead>Tanggal Tutup</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {careers.map((career) => (
                      <TableRow key={career._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{career.title}</div>
                            {career.featured && (
                              <Badge variant="outline" className="mt-1 bg-construction-orange-50 text-construction-orange-700">
                                Unggulan
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                            {career.location}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(career.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-1" />
                            {career.applicationCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                            {new Date(career.closeDate).toLocaleDateString('id-ID')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditForm(career)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteCareer(career)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={!!editingCareer} onOpenChange={() => setEditingCareer(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Lowongan</DialogTitle>
                <DialogDescription>
                  Update informasi lowongan pekerjaan
                </DialogDescription>
              </DialogHeader>
              <CareerForm 
                formData={formData}
                setFormData={setFormData}
                experienceLevels={experienceLevels}
                isEdit 
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingCareer(null)}>
                  Batal
                </Button>
                <Button onClick={handleUpdateCareer}>
                  Update Lowongan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus Lowongan</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menghapus lowongan "{careerToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteCareer}
                >
                  Hapus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default CareersManagement;
