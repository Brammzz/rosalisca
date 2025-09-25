import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ContactsManagement from '@/components/admin/ContactsManagement';
import ProjectsManagement from '@/components/admin/ProjectsManagement';
import ProfileManagement from '@/components/admin/ProfileManagement';
import ClientsManagement from '@/components/admin/ClientsManagement';
import CareersManagement from '@/components/admin/CareersManagement';
import ApplicationsManagement from '@/components/admin/ApplicationsManagement';
import CertificateManagement from '@/components/admin/CertificateManagement';

const Dashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/contacts" element={<ContactsManagement />} />
        <Route path="/projects" element={<ProjectsManagement />} />
        <Route path="/subsidiaries" element={<ProfileManagement />} />
        <Route path="/clients" element={<ClientsManagement />} />
        <Route path="/certificates" element={<CertificateManagement />} />
        <Route path="/careers" element={<CareersManagement />} />
        <Route path="/careers/applications" element={<ApplicationsManagement />} />
      </Routes>
    </AdminLayout>
  );
};

export default Dashboard;
