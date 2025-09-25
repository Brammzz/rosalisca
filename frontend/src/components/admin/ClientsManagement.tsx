import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Users,
  Star,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getClientsAPI,
  createClientWithFileAPI,
  updateClientWithFileAPI,
  deleteClientAPI,
  getClientStatsAPI,
  getCategoryLabel,
  getCategoryBadgeColor,
  formatProjectCount,
  Client,
  ClientFilters,
  NewClientData
} from '@/services/clientService';

const ClientsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  
  const { toast } = useToast();
  
  const addFileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath || imagePath === '') return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    return `http://localhost:5000/uploads/clients/${imagePath}`;
  };

  const [newClient, setNewClient] = useState<Partial<NewClientData>>({
    name: '',
    description: '',
    category: 'government',
    website: '',
    status: 'active',
  });

  useEffect(() => {
    loadClients();
    loadStatistics();
  }, []);

  const loadClients = async (page = 1) => {
    try {
      setIsLoading(true);
      const filters: ClientFilters = { page };
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory !== 'all') filters.category = selectedCategory;
      
      const response = await getClientsAPI(filters);
      setClients(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Gagal memuat data klien", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    try {
      const response = await getClientStatsAPI();
      setStatistics(response.data);
    } catch (error: any) {
      console.error("Failed to load statistics", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadClients();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    loadClients(1);
  };

  const handleCreateClient = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      toast({ title: "Error", description: "Anda harus login sebagai admin", variant: "destructive" });
      return;
    }
    if (!newClient.name?.trim() || !newClient.description?.trim()) {
      toast({ title: "Error", description: "Nama dan deskripsi klien harus diisi", variant: "destructive" });
      return;
    }

    try {
      setIsUploading(true);
      const response = await createClientWithFileAPI(newClient, selectedFile, token);
      toast({ title: "Berhasil", description: response.message });
      setIsAddDialogOpen(false);
      resetNewClientForm();
      loadClients();
      loadStatistics();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Gagal menambah klien", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateClient = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token || !editingClient) return;

    if (!editingClient.name?.trim() || !editingClient.description?.trim()) {
      toast({ title: "Error", description: "Nama dan deskripsi klien harus diisi", variant: "destructive" });
      return;
    }

    try {
      setIsUploading(true);
      const response = await updateClientWithFileAPI(editingClient._id, editingClient, editSelectedFile, token);
      toast({ title: "Berhasil", description: response.message });
      setIsEditDialogOpen(false);
      setEditingClient(null);
      setEditImagePreview(null);
      setEditSelectedFile(null);
      loadClients();
      loadStatistics();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Gagal mengupdate klien", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClient = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token || !clientToDelete) return;

    try {
      const response = await deleteClientAPI(clientToDelete._id, token);
      toast({ title: "Berhasil", description: response.message });
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
      loadClients();
      loadStatistics();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Gagal menghapus klien", variant: "destructive" });
    }
  };

  const resetNewClientForm = () => {
    setNewClient({ name: '', description: '', category: 'government', website: '', status: 'active' });
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Error", description: "File harus berupa gambar", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Error", description: "Ukuran file maksimal 5MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (isEdit) {
          setEditImagePreview(result);
          setEditSelectedFile(file);
        } else {
          setImagePreview(result);
          setSelectedFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (client: Client) => {
    setEditingClient({ ...client });
    setEditImagePreview(client.logo ? getImageUrl(client.logo) : null);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const handleViewClick = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const topCategory = statistics && statistics.byCategory && Object.keys(statistics.byCategory).length > 0
    ? getCategoryLabel(Object.keys(statistics.byCategory).reduce((a, b) => statistics.byCategory[a] > statistics.byCategory[b] ? a : b))
    : '-';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Klien</h1>
          <p className="text-gray-600">Kelola klien dan data klien</p>
        </div>
        <Button onClick={() => { resetNewClientForm(); setIsAddDialogOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Tambah Klien
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-construction-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Klien</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : statistics?.total ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Klien Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : statistics?.active ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Klien Inaktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : statistics?.inactive ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kategori Teratas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : topCategory}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <form onSubmit={handleSearch} className="flex items-center justify-between">
            <CardTitle>Daftar Klien
              ({clients.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Cari klien..."
                  className="pl-8 sm:w-[200px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={(value) => { setSelectedCategory(value); loadClients(1); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="government">Pemerintahan</SelectItem>
                  <SelectItem value="private">Swasta</SelectItem>
                  <SelectItem value="international">Internasional</SelectItem>
                  <SelectItem value="state-owned">BUMN</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Logo</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Nama</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Kategori</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Proyek</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Aksi</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center p-4"><Loader2 className="w-6 h-6 mx-auto animate-spin" /></td></tr>
                ) : clients.length > 0 ? (
                  clients.map((client) => (
                    <tr key={client._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        <img src={getImageUrl(client.logo)} alt={client.name} className="h-10 w-10 object-cover rounded-full" />
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">{client.name}</td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        <Badge className={getCategoryBadgeColor(client.category)} >{getCategoryLabel(client.category)}</Badge>
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        <Badge variant={client.status === 'active' ? 'default' : 'destructive'}>{client.status === 'active' ? 'Aktif' : 'Inaktif'}</Badge>
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{formatProjectCount(client.projectCount)}</td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleViewClick(client)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="outline" size="icon" onClick={() => handleEditClick(client)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(client)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="text-center p-4">Tidak ada data klien.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tambah Klien Baru</DialogTitle>
            <DialogDescription>Isi detail klien baru di bawah ini.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nama</Label>
              <Input id="name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="col-span-3" placeholder="Nama Klien" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Deskripsi</Label>
              <Textarea id="description" value={newClient.description} onChange={(e) => setNewClient({ ...newClient, description: e.target.value })} className="col-span-3" placeholder="Deskripsi singkat" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Kategori</Label>
              <Select value={newClient.category} onValueChange={(value) => setNewClient({ ...newClient, category: value as any })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Pemerintahan</SelectItem>
                  <SelectItem value="private">Swasta</SelectItem>
                  <SelectItem value="international">Internasional</SelectItem>
                  <SelectItem value="state-owned">BUMN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logo" className="text-right">Logo</Label>
                <div className="col-span-3 flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={() => addFileRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Pilih File</Button>
                    {imagePreview && <img src={imagePreview} alt="preview" className="h-10 w-10 object-cover rounded-full"/>}
                    <input ref={addFileRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden"/>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
            <Button onClick={handleCreateClient} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700">
              {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Tambah Klien
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Klien</DialogTitle>
            <DialogDescription>Perbarui detail klien di bawah ini.</DialogDescription>
          </DialogHeader>
          {editingClient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Nama</Label>
                <Input id="edit-name" value={editingClient.name} onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Deskripsi</Label>
                <Textarea id="edit-description" value={editingClient.description} onChange={(e) => setEditingClient({ ...editingClient, description: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Kategori</Label>
                <Select value={editingClient.category} onValueChange={(value) => setEditingClient({ ...editingClient, category: value as any })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Pemerintahan</SelectItem>
                    <SelectItem value="private">Swasta</SelectItem>
                    <SelectItem value="international">Internasional</SelectItem>
                    <SelectItem value="state-owned">BUMN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-logo" className="text-right">Logo</Label>
                <div className="col-span-3 flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={() => editFileRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Ganti File</Button>
                    {editImagePreview && <img src={editImagePreview} alt="preview" className="h-10 w-10 object-cover rounded-full"/>}
                    <input ref={editFileRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden"/>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
            <Button onClick={handleUpdateClient} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700">
              {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedClient?.name}</DialogTitle>
            <DialogDescription>Detail lengkap untuk {selectedClient?.name}</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 py-4">
              <img src={getImageUrl(selectedClient.logo)} alt={selectedClient.name} className="w-24 h-24 rounded-full mx-auto object-cover"/>
              <p className="text-center text-gray-600">{selectedClient.description}</p>
              <div className="text-sm text-gray-500 space-y-2">
                  <p><Badge className={getCategoryBadgeColor(selectedClient.category)}>{getCategoryLabel(selectedClient.category)}</Badge></p>
                  <p><strong>Status:</strong> <Badge variant={selectedClient.status === 'active' ? 'default' : 'destructive'}>{selectedClient.status === 'active' ? 'Aktif' : 'Inaktif'}</Badge></p>
                  <p><strong>Jumlah Proyek:</strong> {formatProjectCount(selectedClient.projectCount)}</p>
                  {selectedClient.website && <p><strong>Website:</strong> <a href={selectedClient.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedClient.website}</a></p>}
              </div>
            </div>
          )}
           <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Klien</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus klien "{clientToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsManagement;
