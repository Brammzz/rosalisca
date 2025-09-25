import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload,
  Eye,
  X,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Award,
  Calendar,
  Clock,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  getCertificatesAPI,
  createCertificateWithFileAPI,
  updateCertificateWithFileAPI,
  deleteCertificateAPI,
  getCertificateStatsAPI,
  getTypeLabel,
  getTypeBadgeColor,
  getStatusLabel,
  getStatusBadgeColor,
  Certificate,
  CertificateFilters,
  NewCertificateData
} from '@/services/certificateService';

const CertificateManagement = () => {
  const companies = ['Rosalisca Group', 'PT John dan Ro', 'PT Gunung Sahid', 'PT Arimada Persada'];
  const [activeTab, setActiveTab] = useState(companies[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    expiringSoon: 0
  });

  const { toast } = useToast();

  const companyToSubsidiary = (companyName: string) => {
    switch (companyName) {
      case 'PT John dan Ro': return 'PT. JOHN DAN RO';
      case 'PT Gunung Sahid': return 'PT. GUNUNG SAHID';
      case 'PT Arimada Persada': return 'PT. ARIMADA PERSADA';
      default: return 'ROSALISCA GROUP';
    }
  };

  const subsidiaryToCompany = (subsidiary: string | undefined) => {
    switch (subsidiary) {
      case 'PT. JOHN DAN RO': return 'PT John dan Ro';
      case 'PT. GUNUNG SAHID': return 'PT Gunung Sahid';
      case 'PT. ARIMADA PERSADA': return 'PT Arimada Persada';
      default: return 'Rosalisca Group';
    }
  };
  
  const addFileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath || imagePath === '') return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    return `http://localhost:5000/uploads/certificates/${imagePath}`;
  };

  const [newCertificate, setNewCertificate] = useState<Partial<NewCertificateData>>({
    title: '',
    description: '',
    type: 'Other',
    issuer: '',
    certificateNumber: '',
    status: 'active',
    notes: '',
    subsidiary: 'ROSALISCA GROUP'
  });

  useEffect(() => {
    loadCertificates();
    loadStatistics();
  }, [activeTab]);

  const loadCertificates = async (page = 1) => {
    try {
      setIsLoading(true);
      const filters: CertificateFilters = { page };
      if (searchTerm) filters.search = searchTerm;
      if (selectedType !== 'all') filters.type = selectedType;
      if (selectedStatus !== 'all') filters.status = selectedStatus;
      filters.subsidiary = companyToSubsidiary(activeTab);
      
      const response = await getCertificatesAPI(filters);
      setCertificates(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat sertifikat.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const subsidiary = companyToSubsidiary(activeTab);
      const statsData = await getCertificateStatsAPI(subsidiary);
      setStatistics(statsData);
      // Update stats state for the cards
      setStats({
        total: statsData.data.total || 0,
        active: statsData.data.active || 0,
        expired: statsData.data.expired || 0,
        expiringSoon: statsData.data.suspended || 0 // Using suspended as expiringSoon for now
      });
    } catch (error) {
      console.error("Failed to load statistics", error);
      toast({ title: 'Error', description: 'Gagal memuat statistik.', variant: 'destructive' });
    }
  };

  const handleStatClick = (filterType: string) => {
    setActiveFilter(filterType);
    // You can add additional filtering logic here if needed
    // For now, it just updates the active filter state for visual feedback
  };

  const getFilterLabel = (filter: string) => {
    const labels: { [key: string]: string } = {
      'all': 'Semua Sertifikat',
      'total': 'Semua Sertifikat', 
      'active': 'Sertifikat Aktif',
      'expired': 'Sertifikat Kadaluarsa',
      'expiring': 'Segera Berakhir'
    };
    return labels[filter] || 'Semua Sertifikat';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCertificates();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedStatus('all');
    loadCertificates(1);
  };

  const handleCreateCertificate = async () => {
    if (!selectedFile || !newCertificate.title) {
      toast({ title: 'Error', description: 'Judul dan file gambar wajib diisi.', variant: 'destructive' });
      return;
    }

    try {
      setIsUploading(true);
      await createCertificateWithFileAPI(newCertificate as NewCertificateData, selectedFile);
      toast({ title: 'Sukses', description: 'Sertifikat berhasil ditambahkan.' });
      setIsAddDialogOpen(false);
      resetNewCertificateForm();
      loadCertificates();
      loadStatistics();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menambahkan sertifikat.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateCertificate = async () => {
    if (!editingCertificate) return;

    // Create certificate data object excluding _id and image
    const certificateData: Partial<NewCertificateData> = {};
    Object.entries(editingCertificate).forEach(([key, value]) => {
      if (key !== '_id' && key !== 'image' && value !== null && value !== undefined) {
        (certificateData as any)[key] = value;
      }
    });

    try {
      setIsUploading(true);
      await updateCertificateWithFileAPI(editingCertificate._id, certificateData, editSelectedFile || undefined);
      toast({ title: 'Sukses', description: 'Sertifikat berhasil diperbarui.' });
      setIsEditDialogOpen(false);
      loadCertificates();
      loadStatistics();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memperbarui sertifikat.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCertificate = async () => {
    if (!certificateToDelete) return;

    try {
      await deleteCertificateAPI(certificateToDelete._id);
      toast({ title: 'Sukses', description: 'Sertifikat berhasil dihapus.' });
      setIsDeleteDialogOpen(false);
      setCertificateToDelete(null);
      loadCertificates();
      loadStatistics();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menghapus sertifikat.', variant: 'destructive' });
    }
  };

  const resetNewCertificateForm = () => {
    setNewCertificate({
      title: '', description: '', type: 'Other', issuer: '', certificateNumber: '', status: 'active', notes: '', subsidiary: companyToSubsidiary(activeTab)
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      if (isEdit) {
        setEditSelectedFile(file);
        reader.onload = (e) => {
          setEditImagePreview(e.target?.result as string);
        };
      } else {
        setSelectedFile(file);
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
      }
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setEditImagePreview(null);
    setEditSelectedFile(null);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (certificate: Certificate) => {
    setCertificateToDelete(certificate);
    setIsDeleteDialogOpen(true);
  };

  const handleViewClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsViewDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    resetNewCertificateForm();
    // Set default subsidiary based on the active tab
    setNewCertificate(prev => ({ ...prev, subsidiary: companyToSubsidiary(activeTab) }));
    setIsAddDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          {companies.map(company => (
            <TabsTrigger key={company} value={company}>{company}</TabsTrigger>
          ))}
        </TabsList>
        {companies.map(company => (
          <TabsContent key={company} value={company}>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Sertifikat</h1>
                <p className="text-gray-600">Kelola sertifikat untuk {company}.</p>
              </div>
              <Button 
                onClick={handleOpenAddDialog}
                className="bg-construction-blue-600 hover:bg-construction-blue-700"
              > 
                <Plus className="mr-2 h-4 w-4" />
                Tambah Sertifikat Baru
              </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              {/* Total Sertifikat */}
              <Card
                className={`cursor-pointer transition-all ${activeFilter === 'total' ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleStatClick('total')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Sertifikat</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.total}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sertifikat Aktif */}
              <Card
                className={`cursor-pointer transition-all ${activeFilter === 'active' ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => handleStatClick('active')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aktif</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.active}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sertifikat Kadaluarsa */}
              <Card
                className={`cursor-pointer transition-all ${activeFilter === 'expired' ? 'ring-2 ring-red-500' : ''}`}
                onClick={() => handleStatClick('expired')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Kadaluarsa</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.expired}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sertifikat Segera Berakhir */}
              <Card
                className={`cursor-pointer transition-all ${activeFilter === 'expiring' ? 'ring-2 ring-yellow-500' : ''}`}
                onClick={() => handleStatClick('expiring')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Segera Berakhir</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.expiringSoon}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>



            {/* Certificate List Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Daftar Sertifikat untuk {company} ({certificates.length})</CardTitle>
                    <p className="text-sm text-gray-500">Filter aktif: {getFilterLabel(activeFilter)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Cari berdasarkan judul atau deskripsi"
                        className="pl-8 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Semua Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="expired">Kadaluarsa</SelectItem>
                        <SelectItem value="suspended">Ditangguhkan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                  </div>
                ) : certificates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada sertifikat yang ditemukan.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gambar</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Penerbit</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certificates.map((certificate) => (
                        <TableRow key={certificate._id}>
                          <TableCell>
                            <img src={getImageUrl(certificate.image)} alt={certificate.title} className="h-10 w-16 object-cover rounded" />
                          </TableCell>
                          <TableCell className="font-medium">{certificate.title}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(certificate.status)}>
                              {getStatusLabel(certificate.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeBadgeColor(certificate.type)}>
                              {getTypeLabel(certificate.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>{certificate.issuer}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="icon" onClick={() => handleViewClick(certificate)}><Eye className="w-4 h-4" /></Button>
                              <Button variant="outline" size="icon" onClick={() => handleEditClick(certificate)}><Edit className="w-4 h-4" /></Button>
                              <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(certificate)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* DIALOGS OUTSIDE TABS */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Sertifikat Baru</DialogTitle>
            <DialogDescription>Isi detail sertifikat. Klik simpan jika sudah selesai.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subsidiary" className="text-right">Perusahaan</Label>
                <Select 
                  value={newCertificate.subsidiary}
                  onValueChange={(value) => setNewCertificate({ ...newCertificate, subsidiary: value as any })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih Perusahaan" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(c => (
                      <SelectItem key={c} value={companyToSubsidiary(c)}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Judul</Label>
              <Input id="title" value={newCertificate.title} onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Deskripsi</Label>
              <Textarea id="description" value={newCertificate.description} onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issuer" className="text-right">Penerbit</Label>
              <Input id="issuer" value={newCertificate.issuer} onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Tipe</Label>
              <Select value={newCertificate.type} onValueChange={(value) => setNewCertificate({ ...newCertificate, type: value as any })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Quality Management">Kualitas Manajemen</SelectItem>
                    <SelectItem value="Professional Competency">Profesional Kompetisi</SelectItem>
                    <SelectItem value="Safety Certification">Keamanan</SelectItem>
                    <SelectItem value="Environmental">Enviromental</SelectItem>
                    <SelectItem value="ISO Certification">ISO</SelectItem>
                    <SelectItem value="Other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select value={newCertificate.status} onValueChange={(value) => setNewCertificate({ ...newCertificate, status: value as any })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="expired">Kadaluarsa</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Gambar</Label>
              <div className="col-span-3 flex items-center gap-4">
                  <Button type="button" variant="outline" onClick={() => addFileRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Pilih File</Button>
                  {imagePreview && <img src={imagePreview} alt="preview" className="h-10 w-10 object-cover rounded"/>}
                  <input ref={addFileRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden"/>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
            <Button onClick={handleCreateCertificate} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700">
              {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Sertifikat</DialogTitle>
            <DialogDescription>Lakukan perubahan pada detail sertifikat.</DialogDescription>
          </DialogHeader>
          {editingCertificate && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-subsidiary" className="text-right">Perusahaan</Label>
                  <Select 
                    value={editingCertificate.subsidiary}
                    onValueChange={(value) => setEditingCertificate({ ...editingCertificate, subsidiary: value as any })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih Perusahaan" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(c => (
                        <SelectItem key={c} value={companyToSubsidiary(c)}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">Judul</Label>
                <Input id="edit-title" value={editingCertificate.title} onChange={(e) => setEditingCertificate({ ...editingCertificate, title: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Deskripsi</Label>
                <Textarea id="edit-description" value={editingCertificate.description} onChange={(e) => setEditingCertificate({ ...editingCertificate, description: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-issuer" className="text-right">Penerbit</Label>
                <Input id="edit-issuer" value={editingCertificate.issuer} onChange={(e) => setEditingCertificate({ ...editingCertificate, issuer: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">Tipe</Label>
                <Select value={editingCertificate.type} onValueChange={(value) => setEditingCertificate({ ...editingCertificate, type: value as any })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quality Management">Kualitas Manajemen</SelectItem>
                    <SelectItem value="Professional Competency">Profesional Kompetisi</SelectItem>
                    <SelectItem value="Safety Certification">Keamanan</SelectItem>
                    <SelectItem value="Environmental">Enviromental</SelectItem>
                    <SelectItem value="ISO Certification">ISO</SelectItem>
                    <SelectItem value="Other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Status</Label>
                <Select value={editingCertificate.status} onValueChange={(value) => setEditingCertificate({ ...editingCertificate, status: value as any })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="expired">Kadaluarsa</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">Gambar</Label>
                <div className="col-span-3 flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={() => editFileRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Ganti File</Button>
                    {editImagePreview ? (
                      <img src={editImagePreview} alt="preview" className="h-10 w-10 object-cover rounded"/>
                    ) : (
                      <img src={getImageUrl(editingCertificate.image)} alt="current" className="h-10 w-10 object-cover rounded"/>
                    )}
                    <input ref={editFileRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden"/>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
            <Button onClick={handleUpdateCertificate} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700">
              {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCertificate?.title}</DialogTitle>
            <DialogDescription>Detail lengkap sertifikat</DialogDescription>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4 py-4">
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                <img 
                  src={getImageUrl(selectedCertificate.image)} 
                  alt={selectedCertificate.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">{selectedCertificate.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getTypeBadgeColor(selectedCertificate.type)}>
                    {getTypeLabel(selectedCertificate.type)}
                  </Badge>
                  <Badge className={getStatusBadgeColor(selectedCertificate.status)}>
                    {getStatusLabel(selectedCertificate.status)}
                  </Badge>
                  <Badge variant="outline">{subsidiaryToCompany(selectedCertificate.subsidiary)}</Badge>
                </div>
                {selectedCertificate.issuer && (
                  <p><strong>Penerbit:</strong> {selectedCertificate.issuer}</p>
                )}
                {selectedCertificate.certificateNumber && (
                  <p><strong>No. Sertifikat:</strong> {selectedCertificate.certificateNumber}</p>
                )}
              </div>
            </div>
          )}
           <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Sertifikat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus sertifikat "{certificateToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCertificate} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CertificateManagement;
