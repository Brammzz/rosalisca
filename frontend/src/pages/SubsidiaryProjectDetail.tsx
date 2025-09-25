import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectByIdAPI, Project } from '@/services/projectService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectDetailContent from '../components/ProjectDetailContent';

const SubsidiaryProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading, isError, error } = useQuery<Project, Error>({
    queryKey: ['project', id],
    queryFn: () => getProjectByIdAPI(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Memuat detail proyek...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
  }

  if (!project) {
    return <div className="flex justify-center items-center h-screen">Proyek tidak ditemukan.</div>;
  }

  return (
    <div className="bg-white">
      <Header />
      <main className="pt-16">
        <ProjectDetailContent project={project} />
      </main>
      <Footer />
    </div>
  );
};

export default SubsidiaryProjectDetail;
