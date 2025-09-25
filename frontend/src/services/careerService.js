const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class CareerService {
  // =================== PUBLIC API ===================
  
  // Get all public careers with filters
  async getPublicCareers(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.department) params.append('department', filters.department);
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('jobType', filters.jobType);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
      if (filters.search) params.append('search', filters.search);
      if (filters.featured) params.append('featured', 'true');

      const response = await fetch(`${API_BASE_URL}/careers/public/careers?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch careers');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching public careers:', error);
      throw error;
    }
  }

  // Get career by ID (public)
  async getPublicCareerById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/public/careers/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch career details');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching career details:', error);
      throw error;
    }
  }

  // Get featured careers
  async getFeaturedCareers(limit = 6) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/public/careers/featured?limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch featured careers');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching featured careers:', error);
      throw error;
    }
  }

  // Get available filters
  async getCareerFilters() {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/public/careers/filters`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch career filters');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching career filters:', error);
      throw error;
    }
  }

  // Submit job application
  async submitApplication(careerId, applicationData, files = {}) {
    try {
      const formData = new FormData();

      // Iterate over applicationData and append to formData correctly
      for (const key in applicationData) {
        const value = applicationData[key];

        if (key === 'applicant' && typeof value === 'object' && value !== null) {
          // Flatten the 'applicant' object into 'applicant.key'
          for (const applicantKey in value) {
            if (value[applicantKey] !== null && value[applicantKey] !== undefined) {
              formData.append(`applicant.${applicantKey}`, value[applicantKey]);
            }
          }
        } else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
          // Stringify other objects and all arrays
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          // Append primitive values (string, number, boolean)
          formData.append(key, value);
        }
      }

      // Add files
      if (files.resume) formData.append('resume', files.resume);
      if (files.coverLetter) formData.append('coverLetter', files.coverLetter);
      if (files.portfolio) formData.append('portfolio', files.portfolio);
      if (files.certificates) {
        files.certificates.forEach(cert => {
          formData.append('certificates', cert);
        });
      }

      const response = await fetch(`${API_BASE_URL}/careers/public/careers/${careerId}/apply`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Provide more specific error feedback from backend if available
        if (data.errors) {
          const errorMessages = Object.values(data.errors).map(e => e.message).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        throw new Error(data.message || 'Failed to submit application');
      }

      return data;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }

  // Check application status
  async getApplicationStatus(applicationId, email) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/careers/public/applications/${applicationId}/status?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch application status');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching application status:', error);
      throw error;
    }
  }

  // =================== ADMIN API ===================
  
  // Get authentication token from localStorage
  getAuthToken() {
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  }

  // Create auth headers
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Get all careers (admin)
  async getAllCareers(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await fetch(`${API_BASE_URL}/careers/admin/careers?${params}`, {
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch careers');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching admin careers:', error);
      throw error;
    }
  }

  // Get career by ID (admin)
  async getCareerById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/careers/${id}`, {
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch career details');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching career details:', error);
      throw error;
    }
  }

  // Create new career
  async createCareer(careerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/careers`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(careerData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create career');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating career:', error);
      throw error;
    }
  }

  // Update career
  async updateCareer(id, careerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/careers/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(careerData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update career');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating career:', error);
      throw error;
    }
  }

  // Delete career
  async deleteCareer(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/careers/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete career');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting career:', error);
      throw error;
    }
  }

  // Update career status
  async updateCareerStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/careers/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update career status');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating career status:', error);
      throw error;
    }
  }

  // Get all applications (admin)
  async getAllApplications(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await fetch(`${API_BASE_URL}/careers/admin/applications?${params}`, {
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch applications');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  // Get application by ID (admin)
  async getApplicationById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/applications/${id}`, {
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch application details');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching application details:', error);
      throw error;
    }
  }

  // Update application status
  async updateApplicationStatus(id, status, note = '', rating = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/applications/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, note, rating })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update application status');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // Schedule interview
  async scheduleInterview(id, scheduleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/applications/${id}/schedule-interview`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(scheduleData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to schedule interview');
      }
      
      return data;
    } catch (error) {
      console.error('Error scheduling interview:', error);
      throw error;
    }
  }

  // Delete application
  async deleteApplication(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/applications/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete application');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }

  // Download document
  async downloadDocument(applicationId, documentType) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/careers/admin/applications/${applicationId}/documents/${documentType}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to download document');
      }
      
      return response.blob();
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/admin/dashboard/stats`, {
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get application statistics
  async getApplicationStatistics(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await fetch(`${API_BASE_URL}/careers/admin/applications/statistics?${params}`, {
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch application statistics');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching application statistics:', error);
      throw error;
    }
  }
}

export default new CareerService();
