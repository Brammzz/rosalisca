import React, { useState, useEffect } from 'react';

import { FiBox, FiUsers, FiMessageSquare, FiFileText, FiUserCheck, FiAward, FiBriefcase } from 'react-icons/fi';

interface OverviewData {
  totalProjects: number;
  totalClients: number;
  totalContacts: number;
  totalApplications: number;
  totalUsers: number;
  totalCareers: number;
  totalCertificates: number;
}

const StatCard = ({ icon, title, value, colorClass }: { icon: React.ReactNode, title: string, value: number, colorClass: string }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md flex items-center`}>
    <div className={`mr-4 text-4xl ${colorClass}`}>{icon}</div>
    <div>
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

const DashboardOverview: React.FC = () => {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/overview', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setOverviewData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>
      {overviewData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard icon={<FiBox />} title="Total Projects" value={overviewData.totalProjects} colorClass="text-blue-500" />
          <StatCard icon={<FiUsers />} title="Total Clients" value={overviewData.totalClients} colorClass="text-green-500" />
          <StatCard icon={<FiMessageSquare />} title="Contact Messages" value={overviewData.totalContacts} colorClass="text-yellow-500" />
          <StatCard icon={<FiFileText />} title="Job Applications" value={overviewData.totalApplications} colorClass="text-purple-500" />
          <StatCard icon={<FiUserCheck />} title="Registered Users" value={overviewData.totalUsers} colorClass="text-red-500" />
          <StatCard icon={<FiAward />} title="Total Certificates" value={overviewData.totalCertificates} colorClass="text-cyan-500" />
          <StatCard icon={<FiBriefcase />} title="Career Postings" value={overviewData.totalCareers} colorClass="text-pink-500" />
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
