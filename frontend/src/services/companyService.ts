import { API_ENDPOINTS } from '../config/api';

const API_URL = `${API_ENDPOINTS.companies}/api/companies`;

// Helper function untuk get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function untuk get auth headers untuk multipart
const getAuthHeadersMultipart = (): HeadersInit => {
  const token = localStorage.getItem('admin_token');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export interface Company {
  _id: string;
  name: string;
  type: 'parent' | 'subsidiary';
  slug: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  establishedYear?: string;
  director?: string;
  specialization?: string;
  certifications: string[];
  logo?: string;
  
  // Content fields
  vision?: string;
  mission?: string;
  values: string[];
  history?: string;
  achievements: string[];
  services: string[];
  
  // Subsidiary specific fields
  projectTypes: string[];
  clientTypes: string[];
  expertise: string[];
  
  // Display fields
  isActive: boolean;
  sortOrder: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CompanyResponse {
  success: boolean;
  message: string;
  data: Company[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SingleCompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}

export interface CompanyStats {
  totalCompanies: number;
  parentCompanies: number;
  subsidiaries: number;
  activeCompanies: number;
}

export interface CompanyStatsResponse {
  success: boolean;
  message: string;
  data: CompanyStats;
}

export interface CompanyFilters {
  type?: 'parent' | 'subsidiary';
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Public methods (no auth required)
export const getCompanies = async (filters: CompanyFilters = {}): Promise<CompanyResponse> => {
  try {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch companies');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const getCompanyById = async (id: string): Promise<SingleCompanyResponse> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch company');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
};

export const getCompanyBySlug = async (slug: string): Promise<SingleCompanyResponse> => {
  try {
    const response = await fetch(`${API_URL}/slug/${slug}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch company');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching company by slug:', error);
    throw error;
  }
};

export const getParentCompany = async (): Promise<SingleCompanyResponse> => {
  try {
    const response = await fetch(`${API_URL}/parent`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch parent company');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching parent company:', error);
    throw error;
  }
};

export const getSubsidiaries = async (): Promise<CompanyResponse> => {
  try {
    const response = await fetch(`${API_URL}/subsidiaries`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch subsidiaries');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching subsidiaries:', error);
    throw error;
  }
};

export const getCompanyStats = async (): Promise<CompanyStatsResponse> => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch company stats');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching company stats:', error);
    throw error;
  }
};

// Admin methods (auth required)
export const createCompany = async (companyData: Partial<Company>, logoFile?: File): Promise<SingleCompanyResponse> => {
  try {
    const formData = new FormData();
    
    // Add company data
    Object.entries(companyData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add logo file if provided
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: getAuthHeadersMultipart(),
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create company');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

export const updateCompany = async (id: string, companyData: Partial<Company>, logoFile?: File): Promise<SingleCompanyResponse> => {
  try {
    const formData = new FormData();
    
    // Add company data
    Object.entries(companyData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add logo file if provided
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeadersMultipart(),
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update company');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

export const deleteCompany = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete company');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};

export const updateCompanyStatus = async (id: string, isActive: boolean): Promise<SingleCompanyResponse> => {
  try {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update company status');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating company status:', error);
    throw error;
  }
};

export const updateSortOrder = async (companies: Array<{ id: string; sortOrder: number }>): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/sort-order`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ companies })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update sort order');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating sort order:', error);
    throw error;
  }
};

// API Exports untuk backward compatibility
export const getCompaniesAPI = getCompanies;
export const getCompanyByIdAPI = getCompanyById;
export const getCompanyBySlugAPI = getCompanyBySlug;
export const getParentCompanyAPI = getParentCompany;
export const getSubsidiariesAPI = getSubsidiaries;
export const getCompanyStatsAPI = getCompanyStats;
export const createCompanyAPI = createCompany;
export const updateCompanyAPI = updateCompany;
export const deleteCompanyAPI = deleteCompany;
export const updateCompanyStatusAPI = updateCompanyStatus;
export const updateSortOrderAPI = updateSortOrder;
