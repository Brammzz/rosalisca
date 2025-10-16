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
  const response = await axios.get(`${API_URL}/overview`, {
    headers: createAuthHeaders(),
  });
  return response.data;
};

export const getProjectsStatsAPI = async (): Promise<ProjectsStats> => {
  const response = await axios.get(`${API_URL}/stats/projects`, {
    headers: createAuthHeaders(),
  });
  return response.data;
};

export const getContactsStatsAPI = async (): Promise<ContactsStats> => {
  const response = await axios.get(`${API_URL}/stats/contacts`, {
    headers: createAuthHeaders(),
  });
  return response.data;
};

export const getApplicationsStatsAPI = async (): Promise<ApplicationsStats> => {
  const response = await axios.get(`${API_URL}/stats/applications`, {
    headers: createAuthHeaders(),
  });
  return response.data;
};

export const getCertificatesStatsAPI = async (): Promise<CertificatesStats> => {
  const response = await axios.get(`${API_URL}/stats/certificates`, {
    headers: createAuthHeaders(),
  });
  return response.data;
};

export const getRecentActivitiesAPI = async (): Promise<RecentActivities> => {
  const response = await axios.get(`${API_URL}/recent-activities`, {
    headers: createAuthHeaders(),
  });
  return response.data;
};
