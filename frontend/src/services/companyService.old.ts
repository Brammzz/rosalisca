const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  companySize?: string;
  yearlyRevenue?: string;
  
  // Metadata
  isActive: boolean;
  sortOrder: number;
  createdBy?: {
    _id: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  
  // Virtuals
  establishedYearFormatted?: string;
  typeLabel?: string;
}

export interface CompanyFilters {
  type?: 'parent' | 'subsidiary' | 'all';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: 'true' | 'false' | 'all';
}

export interface CompanyResponse {
  success: boolean;
  data: Company[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface SingleCompanyResponse {
  success: boolean;
  data: Company;
  message?: string;
}

export interface CompanyStats {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  parentCompanies: number;
  subsidiaries: number;
  companiesByType: Array<{
    _id: string;
    count: number;
  }>;
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

    const response = await fetch(`${API_BASE_URL}/companies?${params}`);
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
    const response = await fetch(`${API_BASE_URL}/companies/${id}`);
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
    const response = await fetch(`${API_BASE_URL}/companies/slug/${slug}`);
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
  }

  async getParentCompany(): Promise<SingleCompanyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/parent`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch parent company');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching parent company:', error);
      throw error;
    }
  }

  async getSubsidiaries(): Promise<CompanyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/subsidiaries`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch subsidiaries');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching subsidiaries:', error);
      throw error;
    }
  }

  // Admin methods (auth required)
  async createCompany(companyData: Partial<Company>, logoFile?: File): Promise<SingleCompanyResponse> {
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

      const response = await fetch(`${API_BASE_URL}/companies`, {
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
  }

  async updateCompany(id: string, companyData: Partial<Company>, logoFile?: File): Promise<SingleCompanyResponse> {
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

      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
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
  }

  async deleteCompany(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
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
  }

  async updateCompanyStatus(id: string, isActive: boolean): Promise<SingleCompanyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${id}/status`, {
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
  }

  async updateSortOrder(companies: Array<{ id: string; sortOrder: number }>): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/sort-order`, {
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
  }

  async getCompanyStats(): Promise<{ success: boolean; data: CompanyStats }> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/stats`);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch company stats');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching company stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const companyService = new CompanyService();

// Export commonly used functions
export const getCompaniesAPI = (filters?: CompanyFilters) => companyService.getCompanies(filters);
export const getCompanyByIdAPI = (id: string) => companyService.getCompanyById(id);
export const getCompanyBySlugAPI = (slug: string) => companyService.getCompanyBySlug(slug);
export const getParentCompanyAPI = () => companyService.getParentCompany();
export const getSubsidiariesAPI = () => companyService.getSubsidiaries();
export const createCompanyAPI = (data: Partial<Company>, logo?: File) => companyService.createCompany(data, logo);
export const updateCompanyAPI = (id: string, data: Partial<Company>, logo?: File) => companyService.updateCompany(id, data, logo);
export const deleteCompanyAPI = (id: string) => companyService.deleteCompany(id);
export const updateCompanyStatusAPI = (id: string, isActive: boolean) => companyService.updateCompanyStatus(id, isActive);
export const updateSortOrderAPI = (companies: Array<{ id: string; sortOrder: number }>) => companyService.updateSortOrder(companies);
export const getCompanyStatsAPI = () => companyService.getCompanyStats();
