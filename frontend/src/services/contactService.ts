import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/contacts`;

// Types
export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  projectType: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'replied' | 'archived' | 'spam';
  source: string;
  isFollowUpRequired: boolean;
  followUpDate?: string;
  assignedTo?: {
    _id: string;
    email: string;
  };
  reply?: {
    message: string;
    sentAt: string;
    sentBy: {
      _id: string;
      email: string;
    };
  };
  notes: Array<{
    _id: string;
    message: string;
    createdBy: {
      _id: string;
      email: string;
    };
    createdAt: string;
  }>;
  tags: string[];
  ipAddress?: string;
  userAgent?: string;
  readAt?: string;
  readBy?: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilters {
  status?: string;
  priority?: string;
  projectType?: string;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ContactStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
  spam: number;
  priority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

export interface NewContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  projectType?: string;
}

export interface ContactResponse {
  success: boolean;
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  statistics: ContactStats;
}

// API Functions
export const getContactsAPI = async (filters: ContactFilters = {}, token?: string) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.projectType) params.append('projectType', filters.projectType);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const config = token ? {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    } : {};

    const response = await axios.get(`${API_URL}?${params}`, config);
    return response.data as ContactResponse;
  } catch (error: any) {
    throw error;
  }
};

export const getContactByIdAPI = async (id: string, token: string) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createContactAPI = async (contactData: NewContactData) => {
  try {
    const response = await axios.post(API_URL, contactData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateContactStatusAPI = async (
  id: string, 
  statusData: { status?: string; assignedTo?: string; followUpDate?: string }, 
  token: string
) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.put(`${API_URL}/${id}/status`, statusData, config);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateContactPriorityAPI = async (
  id: string, 
  priority: string, 
  token: string
) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.put(`${API_URL}/${id}/priority`, { priority }, config);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const replyToContactAPI = async (
  id: string, 
  message: string, 
  token: string
) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(`${API_URL}/${id}/reply`, { message }, config);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const addContactNoteAPI = async (
  id: string, 
  message: string, 
  token: string
) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(`${API_URL}/${id}/notes`, { message }, config);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateContactTagsAPI = async (
  id: string, 
  tags: string[], 
  token: string
) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.put(`${API_URL}/${id}/tags`, { tags }, config);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteContactAPI = async (id: string, token: string) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getContactStatsAPI = async (token: string) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.get(`${API_URL}/stats`, config);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const bulkUpdateContactsAPI = async (
  contactIds: string[], 
  updateData: { status?: string; priority?: string; assignedTo?: string },
  token: string
) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.put(`${API_URL}/bulk-update`, { contactIds, ...updateData }, config);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Helper functions
export const getStatusColor = (status: string): string => {
  const colors = {
    unread: 'bg-red-100 text-red-800 border-red-200',
    read: 'bg-blue-100 text-blue-800 border-blue-200',
    replied: 'bg-green-100 text-green-800 border-green-200',
    archived: 'bg-gray-100 text-gray-800 border-gray-200',
    spam: 'bg-orange-100 text-orange-800 border-orange-200'
  };
  return colors[status as keyof typeof colors] || colors.unread;
};

export const getPriorityColor = (priority: string): string => {
  const colors = {
    low: 'bg-gray-100 text-gray-800 border-gray-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};

export const getStatusLabel = (status: string): string => {
  const labels = {
    unread: 'Belum Dibaca',
    read: 'Sudah Dibaca',
    replied: 'Sudah Dibalas',
    archived: 'Diarsipkan',
    spam: 'Spam'
  };
  return labels[status as keyof typeof labels] || 'Belum Dibaca';
};

export const getPriorityLabel = (priority: string): string => {
  const labels = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    urgent: 'Mendesak'
  };
  return labels[priority as keyof typeof labels] || 'Sedang';
};

export const getProjectTypeLabel = (projectType: string): string => {
  const labels = {
    'konstruksi-umum': 'Konstruksi Umum',
    'microtunnelling': 'Microtunnelling',
    'pile-foundation': 'Pile Foundation',
    'piling-work': 'Piling Work',
    'dewatering': 'Dewatering',
    'konsultasi': 'Konsultasi',
    'lainnya': 'Lainnya'
  };
  return labels[projectType as keyof typeof labels] || 'Lainnya';
};
