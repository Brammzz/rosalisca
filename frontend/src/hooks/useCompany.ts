import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { 
  getCompaniesAPI,
  getCompanyByIdAPI,
  getCompanyBySlugAPI,
  getParentCompanyAPI,
  getSubsidiariesAPI,
  getCompanyStatsAPI,
  createCompanyAPI,
  updateCompanyAPI,
  deleteCompanyAPI,
  updateCompanyStatusAPI,
  updateSortOrderAPI,
  Company, 
  CompanyFilters,
  CompanyStats,
  SingleCompanyResponse
} from '@/services/companyService';

// Query Keys
export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (filters: CompanyFilters) => [...companyKeys.lists(), filters] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
  slug: (slug: string) => [...companyKeys.all, 'slug', slug] as const,
  parent: () => [...companyKeys.all, 'parent'] as const,
  subsidiaries: () => [...companyKeys.all, 'subsidiaries'] as const,
  stats: () => [...companyKeys.all, 'stats'] as const,
};

// Query Hooks
export function useCompanies(filters: CompanyFilters = {}) {
  return useQuery({
    queryKey: companyKeys.list(filters),
    queryFn: () => getCompaniesAPI(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCompany(id: string, enabled = true) {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => getCompanyByIdAPI(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompanyBySlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: companyKeys.slug(slug),
    queryFn: () => getCompanyBySlugAPI(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useParentCompany() {
  return useQuery({
    queryKey: companyKeys.parent(),
    queryFn: () => getParentCompanyAPI(),
    staleTime: 10 * 60 * 1000, // 10 minutes - parent company changes less frequently
  });
}

export function useSubsidiaries() {
  return useQuery({
    queryKey: companyKeys.subsidiaries(),
    queryFn: () => getSubsidiariesAPI(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompanyStats() {
  return useQuery({
    queryKey: companyKeys.stats(),
    queryFn: () => getCompanyStatsAPI(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Mutation Hooks
export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, logo }: { data: Partial<Company>; logo?: File }) =>
      createCompanyAPI(data, logo),
    onSuccess: (response: SingleCompanyResponse) => {
      // Invalidate and refetch company queries
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
      
      toast({
        title: "Success",
        description: response.message || "Company created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create company",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      data, 
      logo 
    }: { 
      id: string; 
      data: Partial<Company>; 
      logo?: File 
    }) => updateCompanyAPI(id, data, logo),
    onSuccess: (response: SingleCompanyResponse, variables) => {
      // Update specific company in cache
      queryClient.setQueryData(
        companyKeys.detail(variables.id),
        response
      );
      
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: companyKeys.stats() });
      
      toast({
        title: "Success",
        description: response.message || "Company updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update company",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCompanyAPI(id),
    onSuccess: (response: { success: boolean; message: string }) => {
      // Invalidate all company queries
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
      
      toast({
        title: "Success",
        description: response.message || "Company deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete company",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCompanyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateCompanyStatusAPI(id, isActive),
    onSuccess: (response: SingleCompanyResponse, variables) => {
      // Update specific company in cache
      queryClient.setQueryData(
        companyKeys.detail(variables.id),
        response
      );
      
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: companyKeys.stats() });
      
      toast({
        title: "Success",
        description: response.message || "Company status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update company status",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSortOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companies: Array<{ id: string; sortOrder: number }>) =>
      updateSortOrderAPI(companies),
    onSuccess: (response: { success: boolean; message: string }) => {
      // Invalidate all company lists to reflect new order
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      
      toast({
        title: "Success",
        description: response.message || "Sort order updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update sort order",
        variant: "destructive",
      });
    },
  });
}

// Utility hooks for common patterns
export function useCompanyForm(companyId?: string) {
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  
  const isEditing = !!companyId;
  const mutation = isEditing ? updateMutation : createMutation;
  
  const onSubmit = (data: Partial<Company>, logo?: File) => {
    if (isEditing && companyId) {
      updateMutation.mutate({ id: companyId, data, logo });
    } else {
      createMutation.mutate({ data, logo });
    }
  };
  
  return {
    onSubmit,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
    isEditing,
  };
}

export function useCompanyManagement() {
  const queryClient = useQueryClient();
  
  const deleteMutation = useDeleteCompany();
  const statusMutation = useUpdateCompanyStatus();
  const sortMutation = useUpdateSortOrder();
  
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  
  const handleStatusToggle = (id: string, isActive: boolean) => {
    statusMutation.mutate({ id, isActive });
  };
  
  const handleSortUpdate = (companies: Array<{ id: string; sortOrder: number }>) => {
    sortMutation.mutate(companies);
  };
  
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: companyKeys.all });
  };
  
  return {
    handleDelete,
    handleStatusToggle,
    handleSortUpdate,
    refreshData,
    isDeleting: deleteMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
    isUpdatingSort: sortMutation.isPending,
  };
}
