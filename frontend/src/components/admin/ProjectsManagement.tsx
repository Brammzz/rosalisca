import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin,
  Calendar,
  Eye,
  Upload,
  X,
  Image as ImageIcon,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectsAPI, createProjectWithFilesAPI, updateProjectAPI, deleteProjectAPI, NewProjectData, Project } from '@/services/projectService';

const ProjectsManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  
  // State for project detail modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const companies = ['Rosalisca Group', 'PT John dan Ro', 'PT Gunung Sahid', 'PT Arimada Persada'];
  const [activeTab, setActiveTab] = useState(companies[0]);

  // State for the new project form, matching the backend model
  const initialNewProjectState: Partial<NewProjectData> = {
    company: 'Rosalisca Group',
    title: '',
    category: 'general-contractor',
    year: new Date().getFullYear().toString(),
    location: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    status: 'planned',
    client: '',
    duration: '',
  };
  const [newProject, setNewProject] = useState<Partial<NewProjectData>>(initialNewProjectState);
  
  // State for file uploads
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');

  // Fetch projects from the backend with company filter
  const { data: projects, isLoading, isError, error } = useQuery<Project[], Error>({ 
    queryKey: ['projects', activeTab], 
    queryFn: () => getProjectsAPI(activeTab) 
  });

  // Debug: Log projects data when it changes
  React.useEffect(() => {
    if (projects) {
      console.log('Projects loaded:', projects);
      console.log('First project image:', projects[0]?.image);
    }
  }, [projects]);

    // Calculate statistics
  const getProjectStats = () => {
    if (!projects || projects.length === 0) {
      return { total: 0, active: 0, completed: 0, pendingReview: 0, ongoing: 0, planned: 0, completionRate: 0 };
    }

    const stats = {
      total: projects.length,
      active: projects.filter(p => p.status === 'ongoing').length,
      completed: projects.filter(p => p.status === 'completed').length,
      pendingReview: projects.filter(p => p.status === 'pending-review').length,
      ongoing: projects.filter(p => p.status === 'ongoing').length,
      planned: projects.filter(p => p.status === 'planned').length,
      completionRate: projects.length > 0 ? Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100) : 0
    };

    return stats;
  };

  const stats = getProjectStats();

  // Handle statistics card click to filter projects
  const handleStatClick = (filterType: string) => {
    setActiveFilter(filterType);
    
    switch (filterType) {
      case 'total':
        setFilterStatus('all');
        break;
      case 'active':
      case 'ongoing':
        setFilterStatus('ongoing');
        break;
      case 'completed':
        setFilterStatus('completed');
        break;
      case 'pending':
        setFilterStatus('pending-review');
        break;
      case 'planned':
        setFilterStatus('planned');
        break;
      default:
        setFilterStatus('all');
    }
  };

  // Get filter label for display
  const getFilterLabel = (filterType: string) => {
    switch (filterType) {
      case 'total':
        return 'Semua Proyek';
      case 'active':
      case 'ongoing':
        return 'Proyek Aktif';
      case 'completed':
        return 'Proyek Selesai';
      case 'pending':
        return 'Menunggu Review';
      case 'planned':
        return 'Proyek Direncanakan';
      default:
        return 'Semua Proyek';
    }
  };

    // Mutation to create a new project
  const createProjectMutation = useMutation({
    mutationFn: (formData: FormData) => {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error('Not authenticated');
      return createProjectWithFilesAPI(formData, token);
    },
    onSuccess: () => {
      toast({ title: 'Berhasil', description: 'Proyek baru berhasil ditambahkan.' });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Gagal menambahkan proyek.',
        variant: 'destructive'
      });
    },
  });

  // Mutation to update a project
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, projectData }: { id: string; projectData: Partial<Project> }) => {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error('Not authenticated');
      return updateProjectAPI(id, projectData, token);
    },
    onSuccess: () => {
      toast({ title: 'Berhasil', description: 'Proyek berhasil diperbarui.' });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Gagal memperbarui proyek.',
        variant: 'destructive'
      });
    },
  });

  // Mutation to delete a project
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error('Not authenticated');
      return deleteProjectAPI(id, token);
    },
    onSuccess: () => {
      toast({ title: 'Berhasil', description: 'Proyek berhasil dihapus.' });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Gagal menghapus proyek.',
        variant: 'destructive'
      });
    },
  });

  // Helper function to reset form
  const resetForm = () => {
    setNewProject(initialNewProjectState);
    setMainImageFile(null);
    setGalleryFiles([]);
    setMainImagePreview('');
    setGalleryPreviews([]);
    setIsEditMode(false);
    setEditingProject(null);
  };

  // Handle main image file selection
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle gallery images selection
  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles(prev => [...prev, ...files]);
      
      // Create previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setGalleryPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove gallery image preview
  const removeGalleryPreview = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // When the dialog is opening, set the company based on the active tab (only for new projects)
      if (!isEditMode) {
        setNewProject(prev => ({ ...initialNewProjectState, company: activeTab }));
      }
    } else {
      // When closing, reset the form
      resetForm();
    }
    setIsAddDialogOpen(isOpen);
  };

  const handleSaveProject = () => {
    if (!newProject.title || !newProject.category || !newProject.location) {
      toast({
        title: 'Gagal Menyimpan',
        description: 'Harap lengkapi field yang wajib diisi (Judul, Kategori, Lokasi).',
        variant: 'destructive',
      });
      return;
    }

    if (isEditMode && editingProject) {
      // Update existing project
      const projectData = {
        ...newProject
      };
      updateProjectMutation.mutate({ 
        id: editingProject._id, 
        projectData: projectData as Partial<NewProjectData>
      });
    } else {
      // Create new project
      const formData = new FormData();
      
      // Add text fields
      Object.entries(newProject).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add main image if selected
      if (mainImageFile) {
        formData.append('mainImage', mainImageFile);
      }

      // Add gallery images if selected
      galleryFiles.forEach((file, index) => {
        formData.append('galleryImages', file);
        formData.append(`galleryCaption_${index}`, `Gallery image ${index + 1}`);
      });

      createProjectMutation.mutate(formData);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planned: { label: 'Direncanakan', variant: 'outline' as const, color: 'text-gray-600 bg-gray-100' },
      ongoing: { label: 'Berjalan', variant: 'default' as const, color: 'text-blue-600 bg-blue-100' },
      completed: { label: 'Selesai', variant: 'secondary' as const, color: 'text-green-600 bg-green-100' },
      'pending-review': { label: 'Review', variant: 'outline' as const, color: 'text-orange-600 bg-orange-100' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ongoing;
    return (
      <Badge 
        variant={config.variant} 
        className={`${config.color} font-medium`}
      >
        {config.label}
      </Badge>
    );
  };

// Helper function to get full image URL
const getImageUrl = (imagePath: string) => {
  if (!imagePath || imagePath === '') return '/placeholder.svg';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  if (imagePath.startsWith('/uploads')) return `${baseUrl}${imagePath}`;
  return `${baseUrl}/uploads/projects/${imagePath}`;
};  const getCategoryLabel = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      'general-contractor': 'General Contractor',
      'civil-engineering': 'Civil Engineering',
      'supplier': 'Supplier',
      'microtunnelling': 'Microtunnelling',
      'drainage-system': 'Sistem Drainase',
      'wastewater-pipeline': 'Jaringan Pipa Air Limbah',
    };
    return categoryLabels[category] || category;
  };

  const getStatusBadgeColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'planned': 'bg-blue-100 text-blue-800',
      'ongoing': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'pending-review': 'bg-yellow-100 text-yellow-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      'planned': 'Direncanakan',
      'ongoing': 'Berjalan',
      'completed': 'Selesai',
      'pending-review': 'Menunggu Review'
    };
    return statusLabels[status] || status;
  };

  const filteredProjects = (projects || [])
    .filter(p => p.company === activeTab)
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => filterStatus === 'all' || p.status === filterStatus);

  // Debug: Log filtered projects when activeTab changes
  React.useEffect(() => {
    console.log('Active tab:', activeTab);
    console.log('Filtered projects:', filteredProjects);
  }, [activeTab, filteredProjects]);

  const handleEditProject = (project: Project) => {
    setIsEditMode(true);
    setEditingProject(project);
    setNewProject({
      company: project.company,
      title: project.title,
      category: project.category,
      year: project.year,
      location: project.location,
      description: project.description,
      image: project.image,
      status: project.status,
      client: project.client,
      duration: project.duration,
      gallery: project.gallery || []
    });

    // Set preview for the main image
    setMainImagePreview(getImageUrl(project.image));

    // Set previews for existing gallery images
    if (project.gallery && project.gallery.length > 0) {
      const existingGalleryPreviews = project.gallery.map(img => getImageUrl(img.url));
      setGalleryPreviews(existingGalleryPreviews);
    } else {
      setGalleryPreviews([]);
    }

    // Clear any selected gallery files from previous operations
    setGalleryFiles([]);

    setIsAddDialogOpen(true);
  };



  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      deleteProjectMutation.mutate(projectToDelete._id, {
        onSuccess: () => {
          toast({
            title: "Proyek Dihapus",
            description: `Proyek "${projectToDelete.title}" telah berhasil dihapus.`,
          });
          setIsDeleteDialogOpen(false);
          setProjectToDelete(null);
        }
      });
    }
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Proyek</h1>
                <p className="text-gray-600">Kelola proyek untuk {company}.</p>
              </div>
              <Button 
                onClick={() => {
                  setNewProject({...initialNewProjectState, company: activeTab});
                  setIsEditMode(false);
                  setIsAddDialogOpen(true);
                }}
                className="bg-construction-blue-600 hover:bg-construction-blue-700"
              > 
                <Plus className="mr-2 h-4 w-4" />
                Tambah Proyek Baru
              </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              {/* Total Proyek */}
              <Card
                className={`cursor-pointer transition-all ${activeFilter === 'total' ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleStatClick('total')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Proyek</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.total}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Proyek Selesai */}
              <Card
                className={`cursor-pointer transition-all ${activeFilter === 'completed' ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => handleStatClick('completed')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Selesai</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.completed}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Proyek Berjalan */}
              <Card
                className={`cursor-pointer transition-all ${activeFilter === 'ongoing' ? 'ring-2 ring-orange-500' : ''}`}
                onClick={() => handleStatClick('ongoing')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Berjalan</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.ongoing}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Proyek Direncanakan */}
              <Card
                className={`cursor-pointer transition-all ${activeFilter === 'planned' ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleStatClick('planned')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Direncanakan</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.planned}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project List Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Daftar Proyek untuk {company} ({filteredProjects.length})</CardTitle>
                    <p className="text-sm text-gray-500">Filter aktif: {getFilterLabel(activeFilter)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Cari berdasarkan judul atau lokasi"
                        className="pl-8 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Semua Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="planned">Direncanakan</SelectItem>
                        <SelectItem value="ongoing">Berjalan</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
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
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada proyek yang ditemukan.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gambar</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tahun</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project._id}>
                          <TableCell>
                            <img 
                              src={getImageUrl(project.image)} 
                              alt={project.title}
                              className="h-10 w-16 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getCategoryLabel(project.category)}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                              {project.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(project.status)}>
                              {getStatusLabel(project.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                              {project.year}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleViewProject(project)} title="Lihat Detail">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)} title="Edit Proyek">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteProject(project)} title="Hapus Proyek">
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
          </TabsContent>
        ))}
      </Tabs>
      
      {/* DIALOGS OUTSIDE TABS */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Proyek' : 'Tambah Proyek Baru'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? `Mengedit detail untuk proyek ${editingProject?.title}`
                  : 'Isi detail proyek baru di bawah ini.'}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto p-1">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Perusahaan / Anak Perusahaan</Label>
                    <Select value={newProject.company} onValueChange={value => setNewProject({...newProject, company: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="title">Judul Proyek</Label>
                    <Input id="title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={newProject.category} onValueChange={value => setNewProject({...newProject, category: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general-contractor">General Contractor</SelectItem>
                        <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="microtunnelling">Microtunnelling</SelectItem>
                        <SelectItem value="drainage-system">Sistem Drainase</SelectItem>
                        <SelectItem value="wastewater-pipeline">Jaringan Pipa Air Limbah</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Lokasi</Label>
                    <Input id="location" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client">Klien</Label>
                    <Input id="client" value={newProject.client} onChange={e => setNewProject({...newProject, client: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="year">Tahun</Label>
                    <Input id="year" type="number" value={newProject.year} onChange={e => setNewProject({...newProject, year: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Durasi</Label>
                    <Input id="duration" value={newProject.duration} onChange={e => setNewProject({...newProject, duration: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newProject.status} onValueChange={value => setNewProject({...newProject, status: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Direncanakan</SelectItem>
                        <SelectItem value="ongoing">Berjalan</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea id="description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                </div>

                <div className="space-y-4">
                  {/* Main Image Upload */}
                  <div>
                    <Label htmlFor="mainImage">Gambar Utama</Label>
                    <div className="mt-2">
                      <input
                        id="mainImage"
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {mainImagePreview && (
                        <div className="mt-2 relative inline-block">
                          <img 
                            src={mainImagePreview} 
                            alt="Preview" 
                            className="w-32 h-20 object-cover rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setMainImageFile(null);
                              setMainImagePreview('');
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Images Upload */}
                  <div>
                    <Label htmlFor="galleryImages">Galeri Gambar (Maksimal 10)</Label>
                    <div className="mt-2">
                      <input
                        id="galleryImages"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImagesChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {galleryPreviews.length > 0 && (
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {galleryPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img 
                                src={preview} 
                                alt={`Gallery ${index + 1}`} 
                                className="w-20 h-16 object-cover rounded border"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryPreview(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>


              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" 
                onClick={handleSaveProject} 
                disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
              >
                {(createProjectMutation.isPending || updateProjectMutation.isPending) 
                  ? 'Menyimpan...' 
                  : isEditMode ? 'Update' : 'Simpan'
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Proyek</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus proyek "{projectToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteProject}
                disabled={deleteProjectMutation.isPending}
              >
                {deleteProjectMutation.isPending ? 'Menghapus...' : 'Hapus'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Project Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Detail Proyek</DialogTitle>
            </DialogHeader>
            
            {selectedProject && (
              <div className="grid gap-6">
                {/* Main Image */}
                <div className="w-full">
                  <img 
                    src={getImageUrl(selectedProject.image)} 
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-lg border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>

                {/* Project Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Judul Proyek</label>
                      <p className="text-lg font-semibold">{selectedProject.title}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Perusahaan</label>
                      <p className="text-base">{selectedProject.company}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Kategori</label>
                      <Badge variant="outline" className="mt-1">
                        {getCategoryLabel(selectedProject.category)}
                      </Badge>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <br />
                      <Badge className={`mt-1 ${getStatusBadgeColor(selectedProject.status)}`}>
                        {getStatusLabel(selectedProject.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Lokasi</label>
                      <div className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <p className="text-base">{selectedProject.location}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tahun</label>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <p className="text-base">{selectedProject.year}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Klien</label>
                      <div className="flex items-center mt-1">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        <p className="text-base">{selectedProject.client}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Durasi</label>
                      <div className="flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <p className="text-base">{selectedProject.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                  <p className="text-base mt-2 text-justify leading-relaxed">{selectedProject.description}</p>
                </div>

                {/* Gallery */}
                {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-3 block">Galeri Gambar</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedProject.gallery.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={getImageUrl(image.url)} 
                            alt={image.caption || `Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                          {image.caption && (
                            <p className="text-xs text-gray-600 mt-1 text-center truncate">
                              {image.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dibuat</label>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedProject.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Terakhir Diupdate</label>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedProject.updatedAt).toLocaleDateString('id-ID', {
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
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Tutup
              </Button>
              {selectedProject && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700" 
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEditProject(selectedProject);
                  }}
                >
                  Edit Proyek
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default ProjectsManagement;
