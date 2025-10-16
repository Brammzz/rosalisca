import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiBox, FiUsers, FiMessageSquare, FiFileText, FiUserCheck, FiAward, FiBriefcase, FiTrendingUp, FiActivity } from 'react-icons/fi';
import {
  getDashboardOverviewAPI,
  getProjectsStatsAPI,
  getContactsStatsAPI,
  getApplicationsStatsAPI,
  getCertificatesStatsAPI,
  getRecentActivitiesAPI,
  type DashboardOverview,
  type ProjectsStats,
  type ContactsStats,
  type ApplicationsStats,
  type CertificatesStats,
  type RecentActivities
} from '@/services/dashboardService';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const StatCard = ({ icon, title, value, colorClass, trend, trendValue }: { 
  icon: React.ReactNode, 
  title: string, 
  value: number, 
  colorClass: string,
  trend?: 'up' | 'down' | 'stable',
  trendValue?: string
}) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`mr-4 text-4xl ${colorClass}`}>{icon}</div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            {trend && trendValue && (
              <div className="flex items-center mt-2 text-sm">
                <FiTrendingUp className={`mr-1 w-3 h-3 ${
                  trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
                }`} />
                <span className={`${
                  trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Helper function to format category labels
const getCategoryLabel = (category: string) => {
  const categoryLabels: Record<string, string> = {
    'general-contractor': 'Kontraktor Umum',
    'civil-engineering': 'Teknik Sipil',
    'supplier': 'Pemasok',
    'microtunnelling': 'Mikro Terowongan',
    'drainage-system': 'Sistem Drainase',
    'wastewater-pipeline': 'Pipa Air Limbah'
  };
  return categoryLabels[category] || category;
};

// Helper function to format status labels
const getStatusLabel = (status: string) => {
  const statusLabels: Record<string, string> = {
    'completed': 'Selesai',
    'ongoing': 'Berlangsung',
    'planned': 'Direncanakan',
    'pending': 'Menunggu',
    'reviewed': 'Direview',
    'rejected': 'Ditolak'
  };
  return statusLabels[status] || status;
};

const DashboardOverview: React.FC = () => {
  // Fetch dashboard data using React Query
  const { data: overviewData, isLoading: overviewLoading, error: overviewError } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: getDashboardOverviewAPI,
  });

  const { data: projectsStats, isLoading: projectsLoading } = useQuery({
    queryKey: ['dashboard-projects-stats'],
    queryFn: getProjectsStatsAPI,
  });

  const { data: contactsStats, isLoading: contactsLoading } = useQuery({
    queryKey: ['dashboard-contacts-stats'],
    queryFn: getContactsStatsAPI,
  });

  const { data: applicationsStats, isLoading: applicationsLoading } = useQuery({
    queryKey: ['dashboard-applications-stats'],
    queryFn: getApplicationsStatsAPI,
  });

  const { data: certificatesStats, isLoading: certificatesLoading } = useQuery({
    queryKey: ['dashboard-certificates-stats'],
    queryFn: getCertificatesStatsAPI,
  });

  const { data: recentActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['dashboard-recent-activities'],
    queryFn: getRecentActivitiesAPI,
  });

  if (overviewLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (overviewError) {
    return (
      <div className="text-center p-10">
        <div className="text-red-500 mb-4">Gagal memuat data dashboard</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center text-sm text-gray-500">
          <FiActivity className="mr-2" />
          Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
        </div>
      </div>

      {/* Overview Stats Cards */}
      {overviewData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard 
            icon={<FiBox />} 
            title="Total Proyek" 
            value={overviewData.totalProjects} 
            colorClass="text-blue-500"
            trend="up"
            trendValue="+12% dari bulan lalu"
          />
          <StatCard 
            icon={<FiUsers />} 
            title="Total Klien" 
            value={overviewData.totalClients} 
            colorClass="text-green-500"
            trend="up"
            trendValue="+8% dari bulan lalu"
          />
          <StatCard 
            icon={<FiMessageSquare />} 
            title="Pesan Kontak" 
            value={overviewData.totalContacts} 
            colorClass="text-yellow-500"
            trend="up"
            trendValue="+15% dari bulan lalu"
          />
          <StatCard 
            icon={<FiFileText />} 
            title="Lamaran Kerja" 
            value={overviewData.totalApplications} 
            colorClass="text-purple-500"
            trend="stable"
            trendValue="Stabil"
          />
          <StatCard 
            icon={<FiUserCheck />} 
            title="User Terdaftar" 
            value={overviewData.totalUsers} 
            colorClass="text-red-500"
            trend="up"
            trendValue="+5% dari bulan lalu"
          />
          <StatCard 
            icon={<FiAward />} 
            title="Total Sertifikat" 
            value={overviewData.totalCertificates} 
            colorClass="text-cyan-500"
            trend="up"
            trendValue="+3% dari bulan lalu"
          />
          <StatCard 
            icon={<FiBriefcase />} 
            title="Lowongan Kerja" 
            value={overviewData.totalCareers} 
            colorClass="text-pink-500"
            trend="stable"
            trendValue="Stabil"
          />
        </div>
      )}

      {/* Charts Section */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Proyek</TabsTrigger>
          <TabsTrigger value="contacts">Kontak</TabsTrigger>
          <TabsTrigger value="applications">Lamaran</TabsTrigger>
          <TabsTrigger value="certificates">Sertifikat</TabsTrigger>
        </TabsList>

        {/* Projects Statistics */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Projects by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Proyek Berdasarkan Status</CardTitle>
                <CardDescription>Distribusi status proyek saat ini</CardDescription>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : projectsStats?.projectsByStatus ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={projectsStats.projectsByStatus.map(item => ({
                          ...item,
                          status: getStatusLabel(item.status)
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {projectsStats.projectsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Tidak ada data tersedia
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Projects by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Proyek Berdasarkan Kategori</CardTitle>
                <CardDescription>Distribusi kategori proyek</CardDescription>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : projectsStats?.projectsByCategory ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectsStats.projectsByCategory.map(item => ({
                      ...item,
                      category: getCategoryLabel(item.category)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="category" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Tidak ada data tersedia
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Projects by Company */}
            <Card>
              <CardHeader>
                <CardTitle>Proyek Berdasarkan Perusahaan</CardTitle>
                <CardDescription>Distribusi proyek per perusahaan</CardDescription>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : projectsStats?.projectsByCompany ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectsStats.projectsByCompany}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="company" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Tidak ada data tersedia
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Projects by Year */}
            <Card>
              <CardHeader>
                <CardTitle>Proyek Berdasarkan Tahun</CardTitle>
                <CardDescription>Tren proyek 5 tahun terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : projectsStats?.projectsByYear ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={projectsStats.projectsByYear}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#FFBB28" 
                        strokeWidth={2}
                        name="Jumlah Proyek"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Tidak ada data tersedia
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contacts Statistics */}
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pesan Kontak per Bulan</CardTitle>
              <CardDescription>Tren pesan kontak 12 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              {contactsLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : contactsStats?.contactsByMonth ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={contactsStats.contactsByMonth.map(item => ({
                    ...item,
                    month: new Date(item.month).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#0088FE" 
                      fill="#0088FE" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Tidak ada data tersedia
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Statistics */}
        <TabsContent value="applications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Applications by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Lamaran Berdasarkan Status</CardTitle>
                <CardDescription>Distribusi status lamaran kerja</CardDescription>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : applicationsStats?.applicationsByStatus ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={applicationsStats.applicationsByStatus.map(item => ({
                          ...item,
                          status: getStatusLabel(item.status)
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {applicationsStats.applicationsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Tidak ada data tersedia
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Applications by Month */}
            <Card>
              <CardHeader>
                <CardTitle>Lamaran per Bulan</CardTitle>
                <CardDescription>Tren lamaran 12 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : applicationsStats?.applicationsByMonth ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={applicationsStats.applicationsByMonth.map(item => ({
                      ...item,
                      month: new Date(item.month).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#FF8042" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Tidak ada data tersedia
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Certificates Statistics */}
        <TabsContent value="certificates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Certificates by Company */}
            <Card>
              <CardHeader>
                <CardTitle>Sertifikat Berdasarkan Perusahaan</CardTitle>
                <CardDescription>Distribusi sertifikat per perusahaan</CardDescription>
              </CardHeader>
              <CardContent>
                {certificatesLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : certificatesStats?.certificatesByCompany ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={certificatesStats.certificatesByCompany}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="company" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82CA9D" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Tidak ada data tersedia
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certificates by Year */}
            <Card>
              <CardHeader>
                <CardTitle>Sertifikat Berdasarkan Tahun</CardTitle>
                <CardDescription>Tren sertifikat per tahun</CardDescription>
              </CardHeader>
              <CardContent>
                {certificatesLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : certificatesStats?.certificatesByYear ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={certificatesStats.certificatesByYear}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#FFC658" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Tidak ada data tersedia
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Aktivitas terbaru dalam sistem</CardDescription>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : recentActivities ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recent Projects */}
              <div className="min-w-0">
                <h4 className="font-medium mb-3 text-gray-900">Proyek Terbaru</h4>
                <div className="space-y-2">
                  {recentActivities.recentProjects.map((project) => (
                    <div key={project._id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={project.title}>
                          {project.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate" title={project.company}>
                          {project.company}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(project.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Contacts */}
              <div className="min-w-0">
                <h4 className="font-medium mb-3 text-gray-900">Kontak Terbaru</h4>
                <div className="space-y-2">
                  {recentActivities.recentContacts.map((contact) => (
                    <div key={contact._id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={contact.name}>
                          {contact.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate" title={contact.subject}>
                          {contact.subject}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(contact.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Applications */}
              <div className="min-w-0">
                <h4 className="font-medium mb-3 text-gray-900">Lamaran Terbaru</h4>
                <div className="space-y-2">
                  {recentActivities.recentApplications.map((application) => (
                    <div key={application._id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={application.name}>
                          {application.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate" title={application.position}>
                          {application.position}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs font-medium text-blue-600 whitespace-nowrap">
                          {getStatusLabel(application.status)}
                        </p>
                        <p className="text-xs text-gray-400 whitespace-nowrap mt-1">
                          {new Date(application.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500">
              Tidak ada aktivitas terbaru
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
