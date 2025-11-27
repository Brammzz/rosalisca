import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ScrollToTop from "@/components/helpers/ScrollToTop";
import {
  Index, About, Projects, ProjectDetail, BusinessUnits, Clients, Careers, Contact, NotFound,
  Dashboard, Login, JhonRoProfile, GunungSahidProfile, ArimadaPersadaProfile,
  SubsidiaryProjects, SubsidiaryProjectDetail
} from "@/components/LazyPages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnMount: 'always',
      refetchOnWindowFocus: false, // Disable untuk performance
      retry: 1, // Reduce retry untuk faster failure handling
    },
  },
});

// Loading component untuk suspense
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Memuat halaman...</span>
  </div>
);

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
            <Route path="/" element={<Suspense fallback={<PageLoading />}><Index /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<PageLoading />}><About /></Suspense>} />
            <Route path="/projects" element={<Suspense fallback={<PageLoading />}><Projects /></Suspense>} />
            <Route path="/projects/:id" element={<Suspense fallback={<PageLoading />}><ProjectDetail /></Suspense>} />
            <Route path="/business-units" element={<Suspense fallback={<PageLoading />}><BusinessUnits /></Suspense>} />
            
            {/* Subsidiary Routes */}
            <Route path="/business-units/jhon-ro/profile" element={<Suspense fallback={<PageLoading />}><JhonRoProfile /></Suspense>} />
            <Route path="/business-units/:companyName/projects" element={<Suspense fallback={<PageLoading />}><SubsidiaryProjects /></Suspense>} />
            <Route path="/business-units/:companyName/projects/:id" element={<Suspense fallback={<PageLoading />}><SubsidiaryProjectDetail /></Suspense>} />
            <Route path="/business-units/gunung-sahid/profile" element={<Suspense fallback={<PageLoading />}><GunungSahidProfile /></Suspense>} />
            <Route path="/business-units/arimada-persada/profile" element={<Suspense fallback={<PageLoading />}><ArimadaPersadaProfile /></Suspense>} />
            
            <Route path="/clients" element={<Suspense fallback={<PageLoading />}><Clients /></Suspense>} />
            <Route path="/careers" element={<Suspense fallback={<PageLoading />}><Careers /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageLoading />}><Contact /></Suspense>} />
            
            {/* Admin Authentication Routes */}
            <Route path="/admin/login" element={<Suspense fallback={<PageLoading />}><Login /></Suspense>} />
            
            {/* Protected Admin Dashboard Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoading />}><Dashboard /></Suspense>
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Suspense fallback={<PageLoading />}><NotFound /></Suspense>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ContentProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
