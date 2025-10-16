import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/dashboard`;

// Create axios instance with auth token
const createAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Types for dashboard data
export interface DashboardOverview {
  totalProjects: number;
  totalClients: number;
  totalContacts: number;
  totalApplications: number;
  totalUsers: number;
  totalCareers: number;
  totalCertificates: number;
}

export interface ProjectsStats {
  projectsByStatus: Array<{ status: string; count: number }>;
  projectsByCategory: Array<{ category: string; count: number }>;
  projectsByCompany: Array<{ company: string; count: number }>;
  projectsByYear: Array<{ year: string; count: number }>;
}

export interface ContactsStats {
  contactsByMonth: Array<{ month: Date; count: number }>;
}

export interface ApplicationsStats {
  applicationsByStatus: Array<{ status: string; count: number }>;
  applicationsByMonth: Array<{ month: Date; count: number }>;
}

export interface CertificatesStats {
  certificatesByCompany: Array<{ company: string; count: number }>;
  certificatesByYear: Array<{ year: string; count: number }>;
}

export interface RecentActivities {
  recentProjects: Array<{ _id: string; title: string; company: string; createdAt: string }>;
  recentContacts: Array<{ _id: string; name: string; subject: string; createdAt: string }>;
  recentApplications: Array<{ _id: string; name: string; position: string; status: string; createdAt: string }>;
}

// API functions
export const getDashboardOverviewAPI = async (): Promise<DashboardOverview> => {
  try {
    const response = await axios.get(`${API_URL}/overview`, {
      headers: createAuthHeaders(),
    });
    
    // Ensure all numeric fields have fallback values
    return {
      totalProjects: response.data?.totalProjects || 0,
      totalClients: response.data?.totalClients || 0,
      totalContacts: response.data?.totalContacts || 0,
      totalApplications: response.data?.totalApplications || 0,
      totalUsers: response.data?.totalUsers || 0,
      totalCareers: response.data?.totalCareers || 0,
      totalCertificates: response.data?.totalCertificates || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    // Return fallback data
    return {
      totalProjects: 0,
      totalClients: 0,
      totalContacts: 0,
      totalApplications: 0,
      totalUsers: 0,
      totalCareers: 0,
      totalCertificates: 0,
    };
  }
};

export const getProjectsStatsAPI = async (): Promise<ProjectsStats> => {
  try {
    const response = await axios.get(`${API_URL}/stats/projects`, {
      headers: createAuthHeaders(),
    });
    return response.data || {
      projectsByStatus: [],
      projectsByCategory: [],
      projectsByCompany: [],
      projectsByYear: [],
    };
  } catch (error) {
    console.error('Error fetching projects stats:', error);
    return {
      projectsByStatus: [],
      projectsByCategory: [],
      projectsByCompany: [],
      projectsByYear: [],
    };
  }
};

export const getContactsStatsAPI = async (): Promise<ContactsStats> => {
  try {
    const response = await axios.get(`${API_URL}/stats/contacts`, {
      headers: createAuthHeaders(),
    });
    return response.data || { contactsByMonth: [] };
  } catch (error) {
    console.error('Error fetching contacts stats:', error);
    return { contactsByMonth: [] };
  }
};

export const getApplicationsStatsAPI = async (): Promise<ApplicationsStats> => {
  try {
    const response = await axios.get(`${API_URL}/stats/applications`, {
      headers: createAuthHeaders(),
    });
    return response.data || {
      applicationsByStatus: [],
      applicationsByMonth: [],
    };
  } catch (error) {
    console.error('Error fetching applications stats:', error);
    return {
      applicationsByStatus: [],
      applicationsByMonth: [],
    };
  }
};

export const getCertificatesStatsAPI = async (): Promise<CertificatesStats> => {
  try {
    const response = await axios.get(`${API_URL}/stats/certificates`, {
      headers: createAuthHeaders(),
    });
    return response.data || {
      certificatesByCompany: [],
      certificatesByYear: [],
    };
  } catch (error) {
    console.error('Error fetching certificates stats:', error);
    return {
      certificatesByCompany: [],
      certificatesByYear: [],
    };
  }
};

export const getRecentActivitiesAPI = async (): Promise<RecentActivities> => {
  try {
    const response = await axios.get(`${API_URL}/recent-activities`, {
      headers: createAuthHeaders(),
    });
    return response.data || {
      recentProjects: [],
      recentContacts: [],
      recentApplications: [],
    };
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return {
      recentProjects: [],
      recentContacts: [],
      recentApplications: [],
    };
  }
};
