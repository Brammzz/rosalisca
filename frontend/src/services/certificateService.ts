import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

const API_URL = API_ENDPOINTS.certificates;

// Define the structure of the Certificate object, matching the backend model
export interface Certificate {
  _id: string;
  title: string;
  description: string;
  type: 'Quality Management' | 'Professional Competency' | 'Safety Certification' | 'Safety' | 'Environmental' | 'ISO Certification' | 'Other';
  image: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  certificateNumber?: string;
  status: 'active' | 'expired' | 'suspended';
  subsidiary?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusBadgeColor?: string;
}

export interface CertificateFilters {
  type?: string;
  search?: string;
  status?: string;
  subsidiary?: string;
  page?: number;
  limit?: number;
}

export interface CertificateResponse {
  success: boolean;
  data: Certificate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SingleCertificateResponse {
  success: boolean;
  data: Certificate;
}

export interface NewCertificateData {
  title: string;
  description: string;
  type: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  certificateNumber?: string;
  status?: string;
  tags?: string[];
  notes?: string;
  subsidiary?: string;
}

export interface CertificateStatsResponse {
  success: boolean;
  data: {
    total: number;
    active: number;
    expired: number;
    suspended: number;
    byType: Array<{
      _id: string;
      count: number;
    }>;
    recent: Array<{
      _id: string;
      title: string;
      type: string;
      createdAt: string;
    }>;
  };
}

// Get all certificates with filtering
export const getCertificatesAPI = async (filters: CertificateFilters = {}): Promise<CertificateResponse> => {
  const params = new URLSearchParams();
  
  if (filters.type) params.append('type', filters.type);
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.subsidiary) params.append('subsidiary', filters.subsidiary);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

// Get single certificate by ID
export const getCertificateByIdAPI = async (id: string): Promise<SingleCertificateResponse> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create new certificate with file upload
export const createCertificateWithFileAPI = async (certificateData: NewCertificateData, imageFile: File): Promise<SingleCertificateResponse> => {
  const token = localStorage.getItem('admin_token');
  
  const formData = new FormData();
  formData.append('title', certificateData.title);
  formData.append('description', certificateData.description);
  formData.append('type', certificateData.type);
  formData.append('image', imageFile);
  
  if (certificateData.issuer) formData.append('issuer', certificateData.issuer);
  if (certificateData.issueDate) formData.append('issueDate', certificateData.issueDate);
  if (certificateData.expiryDate) formData.append('expiryDate', certificateData.expiryDate);
  if (certificateData.certificateNumber) formData.append('certificateNumber', certificateData.certificateNumber);
  if (certificateData.status) formData.append('status', certificateData.status);
  if (certificateData.tags && certificateData.tags.length > 0) {
    certificateData.tags.forEach(tag => formData.append('tags', tag));
  }
  if (certificateData.notes) formData.append('notes', certificateData.notes);
  if (certificateData.subsidiary) formData.append('subsidiary', certificateData.subsidiary);

  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

// Update certificate with optional file upload
export const updateCertificateWithFileAPI = async (id: string, certificateData: Partial<NewCertificateData>, imageFile?: File): Promise<SingleCertificateResponse> => {
  const token = localStorage.getItem('admin_token');
  
  const formData = new FormData();
  
  if (certificateData.title) formData.append('title', certificateData.title);
  if (certificateData.description) formData.append('description', certificateData.description);
  if (certificateData.type) formData.append('type', certificateData.type);
  if (imageFile) formData.append('image', imageFile);
  if (certificateData.issuer) formData.append('issuer', certificateData.issuer);
  if (certificateData.issueDate) formData.append('issueDate', certificateData.issueDate);
  if (certificateData.expiryDate) formData.append('expiryDate', certificateData.expiryDate);
  if (certificateData.certificateNumber) formData.append('certificateNumber', certificateData.certificateNumber);
  if (certificateData.status) formData.append('status', certificateData.status);
  if (certificateData.tags && certificateData.tags.length > 0) {
    certificateData.tags.forEach(tag => formData.append('tags', tag));
  }
  if (certificateData.notes) formData.append('notes', certificateData.notes);
  if (certificateData.subsidiary) formData.append('subsidiary', certificateData.subsidiary);

  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

// Delete certificate
export const deleteCertificateAPI = async (id: string): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem('admin_token');
  
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

// Get certificate statistics
export const getCertificateStatsAPI = async (subsidiary?: string): Promise<CertificateStatsResponse> => {
  const params = new URLSearchParams();
  if (subsidiary) {
    params.append('subsidiary', subsidiary);
  }
  const response = await axios.get(`${API_URL}/stats?${params.toString()}`);
  return response.data;
};

// Helper functions
export const getTypeLabel = (type: string): string => {
  const typeLabels: { [key: string]: string } = {
    'Quality Management': 'Manajemen Mutu',
    'Professional Competency': 'Kompetensi Profesional',
    'Safety Certification': 'Sertifikasi Keselamatan',
    'Safety': 'Keselamatan',
    'Environmental': 'Lingkungan',
    'ISO Certification': 'Sertifikasi ISO',
    'Other': 'Lainnya'
  };
  return typeLabels[type] || type;
};

export const getTypeBadgeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'Quality Management': 'bg-blue-100 text-blue-800',
    'Professional Competency': 'bg-green-100 text-green-800',
    'Safety Certification': 'bg-red-100 text-red-800',
    'Safety': 'bg-orange-100 text-orange-800',
    'Environmental': 'bg-emerald-100 text-emerald-800',
    'ISO Certification': 'bg-purple-100 text-purple-800',
    'Other': 'bg-gray-100 text-gray-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status: string): string => {
  const statusLabels: { [key: string]: string } = {
    'active': 'Aktif',
    'expired': 'Kedaluwarsa',
    'suspended': 'Ditangguhkan'
  };
  return statusLabels[status] || status;
};

export const getStatusBadgeColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'active': 'bg-green-100 text-green-800',
    'expired': 'bg-red-100 text-red-800',
    'suspended': 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Helper function to get full image URL
export const getCertificateImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/images/placeholder-certificate.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with '/', return as is
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // If it's just a filename or relative path, construct the full URL
  return `${API_BASE_URL}/uploads/certificates/${imagePath}`;
};
