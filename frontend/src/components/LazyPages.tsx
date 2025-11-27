import { lazy } from 'react';

// Lazy load pages untuk code splitting
export const Index = lazy(() => import('@/pages/Index'));
export const About = lazy(() => import('@/pages/About'));
export const Projects = lazy(() => import('@/pages/Projects'));
export const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
export const BusinessUnits = lazy(() => import('@/pages/BusinessUnits'));
export const Clients = lazy(() => import('@/pages/Clients'));
export const Careers = lazy(() => import('@/pages/Careers'));
export const Contact = lazy(() => import('@/pages/Contact'));
export const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin pages
export const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
export const Login = lazy(() => import('@/pages/admin/Login'));

// Subsidiary pages
export const JhonRoProfile = lazy(() => import('@/pages/subsidiaries/JhonRoProfile'));
export const GunungSahidProfile = lazy(() => import('@/pages/subsidiaries/GunungSahidProfile'));
export const ArimadaPersadaProfile = lazy(() => import('@/pages/subsidiaries/ArimadaPersadaProfile'));
export const SubsidiaryProjects = lazy(() => import('@/pages/SubsidiaryProjects'));
export const SubsidiaryProjectDetail = lazy(() => import('@/pages/SubsidiaryProjectDetail'));
