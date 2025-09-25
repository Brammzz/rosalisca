import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Mail, 
  MailOpen, 
  Archive, 
  Trash2, 
  Eye,
  MessageSquare,
  Clock,
  User,
  Phone,
  Building2,
  Tag,
  Reply,
  StickyNote,
  AlertTriangle,
  CheckCircle,
  Circle,
  MessageCircle,
  CalendarDays,
  Loader2,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getContactsAPI,
  getContactByIdAPI,
  updateContactStatusAPI,
  updateContactPriorityAPI,
  replyToContactAPI,
  addContactNoteAPI,
  updateContactTagsAPI,
  deleteContactAPI,
  getContactStatsAPI,
  bulkUpdateContactsAPI,
  getStatusColor,
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
  getProjectTypeLabel,
  Contact,
  ContactFilters,
  ContactStats
} from '@/services/contactService';

const ContactsManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [statistics, setStatistics] = useState<ContactStats | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedProjectType, setSelectedProjectType] = useState('all');
  const [selectedAssignedTo, setSelectedAssignedTo] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selected contact for operations
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Form states
  const [replyMessage, setReplyMessage] = useState('');
  const [noteMessage, setNoteMessage] = useState('');
  const [contactTags, setContactTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Bulk operations
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isBulkOperationOpen, setIsBulkOperationOpen] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadContacts();
    loadStatistics();
  }, [searchTerm, selectedStatus, selectedPriority, selectedProjectType, selectedAssignedTo, sortBy, sortOrder, pagination.page]);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const filters: ContactFilters = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder
      };

      if (searchTerm) filters.search = searchTerm;
      if (selectedStatus !== 'all') filters.status = selectedStatus;
      if (selectedPriority !== 'all') filters.priority = selectedPriority;
      if (selectedProjectType !== 'all') filters.projectType = selectedProjectType;
      if (selectedAssignedTo !== 'all') filters.assignedTo = selectedAssignedTo;
      
      const response = await getContactsAPI(filters, token);
      setContacts(response.data);
      setStatistics(response.statistics);
      setPagination(response.pagination);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal memuat data kontak",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        console.error('Admin token not found');
        return;
      }
      const response = await getContactStatsAPI(token);
      const statsData = response.data;
      
      const formattedStats: ContactStats = {
        total: statsData.total || 0,
        unread: statsData.byStatus?.unread || 0,
        read: statsData.byStatus?.read || 0,
        replied: statsData.byStatus?.replied || 0,
        archived: statsData.byStatus?.archived || 0,
        spam: statsData.byStatus?.spam || 0,
        priority: {
          low: statsData.byPriority?.low || 0,
          medium: statsData.byPriority?.medium || 0,
          high: statsData.byPriority?.high || 0,
          urgent: statsData.byPriority?.urgent || 0,
        },
      };

      setStatistics(formattedStats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      toast({
        title: 'Gagal Memuat Statistik',
        description: 'Tidak dapat mengambil data statistik dari server.',
        variant: 'destructive',
      });
    }
  };

  const handleViewContact = async (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);

    // Mark as read if unread
    if (contact.status === 'unread') {
      try {
        const token = localStorage.getItem('admin_token');
        if (token) {
          await updateContactStatusAPI(contact._id, { status: 'read' }, token);
          await loadContacts();
        }
      } catch (error) {
        console.error('Failed to mark contact as read:', error);
      }
    }
  };

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      await updateContactStatusAPI(contactId, { status: newStatus }, token);
      await loadContacts();
      
      toast({
        title: "Berhasil",
        description: "Status kontak berhasil diperbarui"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal mengubah status kontak",
        variant: "destructive"
      });
    }
  };

  const handlePriorityChange = async (contactId: string, newPriority: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      await updateContactPriorityAPI(contactId, newPriority, token);
      await loadContacts();
      
      toast({
        title: "Berhasil",
        description: "Prioritas kontak berhasil diperbarui"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal mengubah prioritas kontak",
        variant: "destructive"
      });
    }
  };

  const handleReplySubmit = async () => {
    if (!selectedContact || !replyMessage.trim()) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      await replyToContactAPI(selectedContact._id, replyMessage, token);
      await loadContacts();
      
      setIsReplyDialogOpen(false);
      setReplyMessage('');
      setSelectedContact(null);
      
      toast({
        title: "Berhasil",
        description: "Balasan berhasil dikirim"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal mengirim balasan",
        variant: "destructive"
      });
    }
  };

  const handleAddNote = async () => {
    if (!selectedContact || !noteMessage.trim()) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      await addContactNoteAPI(selectedContact._id, noteMessage, token);
      await loadContacts();
      
      setIsNotesDialogOpen(false);
      setNoteMessage('');
      setSelectedContact(null);
      
      toast({
        title: "Berhasil",
        description: "Catatan berhasil ditambahkan"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal menambahkan catatan",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTags = async () => {
    if (!selectedContact) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      await updateContactTagsAPI(selectedContact._id, contactTags, token);
      await loadContacts();
      
      setIsTagsDialogOpen(false);
      setContactTags([]);
      setNewTag('');
      setSelectedContact(null);
      
      toast({
        title: "Berhasil",
        description: "Tags berhasil diperbarui"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal memperbarui tags",
        variant: "destructive"
      });
    }
  };

  const confirmDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      await deleteContactAPI(contactToDelete._id, token);
      await loadContacts();
      
      setIsDeleteDialogOpen(false);
      setContactToDelete(null);
      
      toast({
        title: "Berhasil",
        description: "Kontak berhasil dihapus"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal menghapus kontak",
        variant: "destructive"
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !contactTags.includes(newTag.trim())) {
      setContactTags([...contactTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setContactTags(contactTags.filter(tag => tag !== tagToRemove));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedProjectType('all');
    setSelectedAssignedTo('all');
  };

  const getStatistics = () => {
    if (!statistics) return { unread: 0, read: 0, replied: 0, archived: 0, total: 0 };
    return statistics;
  };

  const stats = getStatistics();

  const openReplyDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setIsReplyDialogOpen(true);
  };

  const openNotesDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setIsNotesDialogOpen(true);
  };

  const openTagsDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setContactTags(contact.tags || []);
    setIsTagsDialogOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Pesan</h1>
            <p className="text-gray-600">Kelola pesan masuk dari formulir kontak website</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-construction-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Kontak</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Circle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Belum Dibaca</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MailOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sudah Dibaca</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sudah Dibalas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.replied}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Archive className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Diarsipkan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.archived}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari berdasarkan nama, email, subjek atau pesan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="unread">Belum Dibaca</SelectItem>
                    <SelectItem value="read">Sudah Dibaca</SelectItem>
                    <SelectItem value="replied">Sudah Dibalas</SelectItem>
                    <SelectItem value="archived">Diarsipkan</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Prioritas</SelectItem>
                    <SelectItem value="urgent">Mendesak</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="low">Rendah</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedProjectType} onValueChange={setSelectedProjectType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipe Proyek" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="konstruksi-umum">Konstruksi Umum</SelectItem>
                    <SelectItem value="microtunnelling">Microtunnelling</SelectItem>
                    <SelectItem value="pile-foundation">Pile Foundation</SelectItem>
                    <SelectItem value="piling-work">Piling Work</SelectItem>
                    <SelectItem value="dewatering">Dewatering</SelectItem>
                    <SelectItem value="konsultasi">Konsultasi</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={resetFilters}>
                  Reset Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Daftar Pesan ({contacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada kontak ditemukan</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all' 
                    ? "Coba ubah kriteria pencarian atau filter"
                    : "Belum ada pesan kontak yang masuk"
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama & Kontak</TableHead>
                      <TableHead>Subjek & Pesan</TableHead>
                      <TableHead>Tipe Proyek</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prioritas</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Mail className="w-3 h-3 mr-1" />
                              {contact.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {contact.phone}
                            </div>
                            {contact.company && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Building2 className="w-3 h-3 mr-1" />
                                {contact.company}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium mb-1">{contact.subject}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {contact.message.substring(0, 100)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getProjectTypeLabel(contact.projectType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(contact.status)}>
                            {getStatusLabel(contact.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(contact.priority)}>
                            {getPriorityLabel(contact.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(contact.createdAt).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(contact.createdAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewContact(contact)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Lihat Detail</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openReplyDialog(contact)}
                                >
                                  <Reply className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Balas</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openNotesDialog(contact)}
                                >
                                  <StickyNote className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Tambah Catatan</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:text-red-700"
                                  onClick={() => confirmDeleteContact(contact)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Hapus</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} kontak
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Contact Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Kontak</DialogTitle>
              <DialogDescription>
                Informasi lengkap pesan kontak
              </DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="font-semibold">Nama Lengkap</Label>
                      <p className="text-sm text-gray-700">{selectedContact.firstName} {selectedContact.lastName}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Email</Label>
                      <p className="text-sm text-gray-700">{selectedContact.email}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Telepon</Label>
                      <p className="text-sm text-gray-700">{selectedContact.phone}</p>
                    </div>
                    {selectedContact.company && (
                      <div>
                        <Label className="font-semibold">Perusahaan</Label>
                        <p className="text-sm text-gray-700">{selectedContact.company}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="font-semibold">Status</Label>
                      <div className="mt-1">
                        <Select
                          value={selectedContact.status}
                          onValueChange={(value) => handleStatusChange(selectedContact._id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unread">Belum Dibaca</SelectItem>
                            <SelectItem value="read">Sudah Dibaca</SelectItem>
                            <SelectItem value="replied">Sudah Dibalas</SelectItem>
                            <SelectItem value="archived">Diarsipkan</SelectItem>
                            <SelectItem value="spam">Spam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="font-semibold">Prioritas</Label>
                      <div className="mt-1">
                        <Select
                          value={selectedContact.priority}
                          onValueChange={(value) => handlePriorityChange(selectedContact._id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Mendesak</SelectItem>
                            <SelectItem value="high">Tinggi</SelectItem>
                            <SelectItem value="medium">Sedang</SelectItem>
                            <SelectItem value="low">Rendah</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="font-semibold">Tipe Proyek</Label>
                      <p className="text-sm text-gray-700">{getProjectTypeLabel(selectedContact.projectType)}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Tanggal</Label>
                      <p className="text-sm text-gray-700">
                        {new Date(selectedContact.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="font-semibold">Subjek</Label>
                  <p className="text-sm text-gray-700 mt-1">{selectedContact.subject}</p>
                </div>
                
                <div>
                  <Label className="font-semibold">Pesan</Label>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>

                {selectedContact.tags && selectedContact.tags.length > 0 && (
                  <div>
                    <Label className="font-semibold">Tags</Label>
                    <div className="flex gap-2 mt-1">
                      {selectedContact.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedContact.reply && (
                  <div className="border-t pt-4">
                    <Label className="font-semibold">Balasan</Label>
                    <div className="bg-blue-50 p-4 rounded-lg mt-2">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedContact.reply.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Dikirim pada {new Date(selectedContact.reply.sentAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {selectedContact.notes && selectedContact.notes.length > 0 && (
                  <div className="border-t pt-4">
                    <Label className="font-semibold">Catatan</Label>
                    <div className="space-y-2 mt-2">
                      {selectedContact.notes.map((note, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{note.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(note.createdAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={() => openReplyDialog(selectedContact)}>
                    <Reply className="w-4 h-4 mr-2" />
                    Balas
                  </Button>
                  <Button variant="outline" onClick={() => openNotesDialog(selectedContact)}>
                    <StickyNote className="w-4 h-4 mr-2" />
                    Tambah Catatan
                  </Button>
                  <Button variant="outline" onClick={() => openTagsDialog(selectedContact)}>
                    <Tag className="w-4 h-4 mr-2" />
                    Kelola Tags
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Balas Pesan</DialogTitle>
              <DialogDescription>
                Kirim balasan untuk pesan ini
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reply-message">Pesan Balasan</Label>
                <Textarea
                  id="reply-message"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Tulis balasan Anda..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleReplySubmit} disabled={!replyMessage.trim()}>
                <Reply className="w-4 h-4 mr-2" />
                Kirim Balasan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Note Dialog */}
        <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Catatan</DialogTitle>
              <DialogDescription>
                Tambahkan catatan internal untuk kontak ini
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="note-message">Catatan</Label>
                <Textarea
                  id="note-message"
                  value={noteMessage}
                  onChange={(e) => setNoteMessage(e.target.value)}
                  placeholder="Tulis catatan..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddNote} disabled={!noteMessage.trim()}>
                <StickyNote className="w-4 h-4 mr-2" />
                Tambah Catatan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Manage Tags Dialog */}
        <Dialog open={isTagsDialogOpen} onOpenChange={setIsTagsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kelola Tags</DialogTitle>
              <DialogDescription>
                Tambah atau hapus tags untuk kontak ini
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-tag">Tambah Tag Baru</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nama tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} disabled={!newTag.trim()}>
                    Tambah
                  </Button>
                </div>
              </div>
              
              {contactTags.length > 0 && (
                <div>
                  <Label>Tags Saat Ini</Label>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {contactTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100"
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTagsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleUpdateTags}>
                <Tag className="w-4 h-4 mr-2" />
                Simpan Tags
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Kontak</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus kontak dari "{contactToDelete?.firstName} {contactToDelete?.lastName}"? 
                Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteContact}>
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default ContactsManagement;
