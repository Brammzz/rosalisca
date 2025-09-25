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
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Filter,
  Eye,
  Download,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Briefcase
} from 'lucide-react';
import careerService from '@/services/careerService';

interface Application {
  _id: string;
  applicant: {
    fullName: string;
    email: string;
    phone: string;
  };
  career: {
    _id: string;
    title: string;
    department: string;
    location: string;
  };
  status: string;
  applicationDate: string;
  lastUpdated: string;
  documents: {
    resume?: { filename: string; path: string };
    coverLetter?: { filename: string; path: string };
    portfolio?: { filename: string; path: string };
  };
  experience: {
    totalYears: number;
    currentPosition?: string;
    currentCompany?: string;
  };
  reviewNotes: Array<{
    reviewer: { name: string };
    note: string;
    rating?: number;
    date: string;
  }>;
  interviewSchedule?: {
    date: string;
    time: string;
    location: string;
    interviewer: string;
    type: string;
  };
}

interface ApplicationStats {
  submitted: number;
  reviewing: number;
  shortlisted: number;
  interview: number;
  offered: number;
  accepted: number;
  rejected: number;
}

const ApplicationsManagement = () => {
  const { isAuthenticated, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCareer, setFilterCareer] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Details modal
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Status update
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  
  // Interview scheduling
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    location: '',
    interviewer: '',
    type: 'in-person' as 'phone' | 'video' | 'in-person',
    notes: ''
  });

  const statusOptions = [
    { value: 'submitted', label: 'Dikirim', color: 'bg-blue-100 text-blue-800' },
    { value: 'reviewing', label: 'Direview', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'shortlisted', label: 'Shortlist', color: 'bg-purple-100 text-purple-800' },
    { value: 'interview', label: 'Interview', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'test', label: 'Tes', color: 'bg-orange-100 text-orange-800' },
    { value: 'offered', label: 'Ditawarkan', color: 'bg-green-100 text-green-800' },
    { value: 'accepted', label: 'Diterima', color: 'bg-green-200 text-green-900' },
    { value: 'rejected', label: 'Ditolak', color: 'bg-red-100 text-red-800' },
    { value: 'withdrawn', label: 'Dibatalkan', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    loadApplications();
  }, [currentPage, searchTerm, filterStatus, filterCareer]);

  const loadApplications = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping data load');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const filters = {
        page: currentPage,
        limit: 15,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterCareer !== 'all' && { careerId: filterCareer })
      };

      const response = await careerService.getAllApplications(filters);
      
      if (response.success) {
        setApplications(response.data);
        setTotalPages(response.pagination.pages);
        
        // Calculate stats from response statistics
        if (response.statistics) {
          const statsObj: ApplicationStats = {
            submitted: 0,
            reviewing: 0,
            shortlisted: 0,
            interview: 0,
            offered: 0,
            accepted: 0,
            rejected: 0
          };
          
          response.statistics.forEach((stat: any) => {
            if (stat._id in statsObj) {
              (statsObj as any)[stat._id] = stat.count;
            }
          });
          
          setStats(statsObj);
        }
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplication) return;
    
    try {
      const response = await careerService.updateApplicationStatus(
        selectedApplication._id,
        newStatus,
        reviewNote,
        rating
      );
      
      if (response.success) {
        setShowStatusUpdate(false);
        setReviewNote('');
        setRating(null);
        loadApplications();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleScheduleInterview = async () => {
    if (!selectedApplication) return;
    
    try {
      const response = await careerService.scheduleInterview(
        selectedApplication._id,
        interviewData
      );
      
      if (response.success) {
        setShowInterviewForm(false);
        setInterviewData({
          date: '',
          time: '',
          location: '',
          interviewer: '',
          type: 'in-person',
          notes: ''
        });
        loadApplications();
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  const handleDownloadDocument = async (applicationId: string, documentType: string) => {
    try {
      const blob = await careerService.downloadDocument(applicationId, documentType);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentType}-${applicationId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const openDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDetails(true);
  };

  const openStatusUpdate = (application: Application) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setShowStatusUpdate(true);
  };

  const openInterviewSchedule = (application: Application) => {
    setSelectedApplication(application);
    if (application.interviewSchedule) {
      setInterviewData({
        date: application.interviewSchedule.date.split('T')[0],
        time: application.interviewSchedule.time,
        location: application.interviewSchedule.location,
        interviewer: application.interviewSchedule.interviewer,
        type: application.interviewSchedule.type as any,
        notes: ''
      });
    }
    setShowInterviewForm(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    if (!statusConfig) return <Badge>{status}</Badge>;
    
    return (
      <Badge className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Aplikasi</h1>
              <p className="text-gray-600">Kelola lamaran kerja dan proses rekrutmen</p>
            </div>
          </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
                <div className="text-sm text-gray-600">Dikirim</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.reviewing}</div>
                <div className="text-sm text-gray-600">Review</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.shortlisted}</div>
                <div className="text-sm text-gray-600">Shortlist</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.interview}</div>
                <div className="text-sm text-gray-600">Interview</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.offered}</div>
                <div className="text-sm text-gray-600">Ditawarkan</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{stats.accepted}</div>
                <div className="text-sm text-gray-600">Diterima</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-gray-600">Ditolak</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari berdasarkan nama atau email pelamar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Semua Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Aplikasi ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-construction-blue-600"></div>
              <p className="mt-4 text-gray-600">Memuat data...</p>
            </div>
          ) : applications.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pelamar</TableHead>
                    <TableHead>Posisi</TableHead>
                    <TableHead>Pengalaman</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{application.applicant.fullName}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {application.applicant.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {application.applicant.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{application.career?.title || 'Lowongan Dihapus'}</div>
                          <div className="text-sm text-gray-500">
                            {application.career ? `${application.career.department} • ${application.career.location}` : '-'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">
                            {application.experience.totalYears} tahun
                          </div>
                          {application.experience.currentPosition && (
                            <div className="text-sm text-gray-500">
                              {application.experience.currentPosition}
                            </div>
                          )}
                          {application.experience.currentCompany && (
                            <div className="text-sm text-gray-500">
                              di {application.experience.currentCompany}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(application.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(application.applicationDate)}</div>
                          {application.lastUpdated !== application.applicationDate && (
                            <div className="text-gray-500">
                              Update: {formatDate(application.lastUpdated)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openDetails(application)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openStatusUpdate(application)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Status
                          </Button>
                          {application.status === 'shortlisted' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openInterviewSchedule(application)}
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Interview
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada aplikasi</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Tidak ada aplikasi yang sesuai dengan filter'
                  : 'Belum ada aplikasi lamaran masuk'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Aplikasi</DialogTitle>
            <DialogDescription>
              Informasi lengkap pelamar dan dokumen yang dikirim
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informasi Pelamar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">{selectedApplication.applicant.fullName}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedApplication.applicant.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{selectedApplication.applicant.phone}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Posisi yang Dilamar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">{selectedApplication.career.title}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Departemen: </span>
                      <span>{selectedApplication.career.department}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Lokasi: </span>
                      <span>{selectedApplication.career.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dokumen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedApplication.documents.resume && (
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col"
                        onClick={() => handleDownloadDocument(selectedApplication._id, 'resume')}
                      >
                        <FileText className="w-8 h-8 mb-2" />
                        <span className="text-sm">Resume/CV</span>
                      </Button>
                    )}
                    {selectedApplication.documents.coverLetter && (
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col"
                        onClick={() => handleDownloadDocument(selectedApplication._id, 'coverLetter')}
                      >
                        <FileText className="w-8 h-8 mb-2" />
                        <span className="text-sm">Cover Letter</span>
                      </Button>
                    )}
                    {selectedApplication.documents.portfolio && (
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col"
                        onClick={() => handleDownloadDocument(selectedApplication._id, 'portfolio')}
                      >
                        <FileText className="w-8 h-8 mb-2" />
                        <span className="text-sm">Portfolio</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Review Notes */}
              {selectedApplication.reviewNotes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Catatan Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedApplication.reviewNotes.map((note, index) => (
                        <div key={index} className="border-l-4 border-gray-200 pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{note.reviewer.name}</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(note.date)}
                            </div>
                          </div>
                          {note.rating && (
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  className={`w-4 h-4 ${star <= note.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">({note.rating}/5)</span>
                            </div>
                          )}
                          <p className="text-gray-700">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status Aplikasi</DialogTitle>
            <DialogDescription>
              Ubah status aplikasi dan berikan catatan review
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Baru
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (Opsional)
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(rating === star ? null : star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`w-6 h-6 ${rating && star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Review
              </label>
              <Textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Berikan catatan tentang pelamar ini..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusUpdate(false)}>
              Batal
            </Button>
            <Button onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Schedule Modal */}
      <Dialog open={showInterviewForm} onOpenChange={setShowInterviewForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jadwalkan Interview</DialogTitle>
            <DialogDescription>
              Atur jadwal interview untuk pelamar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal
                </label>
                <Input
                  type="date"
                  value={interviewData.date}
                  onChange={(e) => setInterviewData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu
                </label>
                <Input
                  type="time"
                  value={interviewData.time}
                  onChange={(e) => setInterviewData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Interview
              </label>
              <select
                value={interviewData.type}
                onChange={(e) => setInterviewData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="in-person">Tatap Muka</option>
                <option value="video">Video Call</option>
                <option value="phone">Telepon</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi/Link
              </label>
              <Input
                value={interviewData.location}
                onChange={(e) => setInterviewData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Alamat kantor atau link meeting"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interviewer
              </label>
              <Input
                value={interviewData.interviewer}
                onChange={(e) => setInterviewData(prev => ({ ...prev, interviewer: e.target.value }))}
                placeholder="Nama interviewer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Tambahan
              </label>
              <Textarea
                value={interviewData.notes}
                onChange={(e) => setInterviewData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Instruksi khusus atau persiapan yang diperlukan"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewForm(false)}>
              Batal
            </Button>
            <Button onClick={handleScheduleInterview}>
              Jadwalkan Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
  );
};

export default ApplicationsManagement;
