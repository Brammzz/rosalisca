import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import BusinessUnits from "./pages/BusinessUnits";
import Clients from "./pages/Clients";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";

// Subsidiary profile pages
import JhonRoProfile from "./pages/subsidiaries/JhonRoProfile";
import GunungSahidProfile from "./pages/subsidiaries/GunungSahidProfile";
import ArimadaPersadaProfile from "./pages/subsidiaries/ArimadaPersadaProfile";

// Subsidiary project pages
import SubsidiaryProjects from "./pages/SubsidiaryProjects";

// Subsidiary project detail pages
import SubsidiaryProjectDetail from "@/pages/SubsidiaryProjectDetail";

import ScrollToTop from "@/components/helpers/ScrollToTop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Force fresh data
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  },
});

// Clear cache on app start to ensure fresh data
queryClient.clear();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ContentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/business-units" element={<BusinessUnits />} />
            
            {/* Subsidiary Routes */}
            <Route path="/business-units/jhon-ro/profile" element={<JhonRoProfile />} />
            <Route path="/business-units/:companyName/projects" element={<SubsidiaryProjects />} />
            <Route path="/business-units/:companyName/projects/:id" element={<SubsidiaryProjectDetail />} />
            <Route path="/business-units/gunung-sahid/profile" element={<GunungSahidProfile />} />
            <Route path="/business-units/arimada-persada/profile" element={<ArimadaPersadaProfile />} />
            
            <Route path="/clients" element={<Clients />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Authentication Routes */}
            <Route path="/admin/login" element={<Login />} />
            
            {/* Protected Admin Dashboard Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ContentProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
