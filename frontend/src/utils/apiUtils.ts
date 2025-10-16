// API utilities for consistent URL handling

// Get the base API URL
export const getBaseApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

// Get the base server URL (without /api)
export const getBaseServerUrl = (): string => {
  const apiUrl = getBaseApiUrl();
  return apiUrl.replace('/api', '');
};

// Helper function to get full image URL
export const getImageUrl = (imagePath: string, folder: string = ''): string => {
  if (!imagePath || imagePath === '') return '/placeholder.svg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with '/', it's already a full path from server root
  if (imagePath.startsWith('/uploads')) {
    return `${getBaseServerUrl()}${imagePath}`;
  }
  
  // If it's just a filename, construct the full path
  const baseUrl = getBaseServerUrl();
  const folderPath = folder ? `/${folder}` : '';
  return `${baseUrl}/uploads${folderPath}/${imagePath}`;
};

// Specific helpers for different image types
export const getProjectImageUrl = (imagePath: string): string => {
  return getImageUrl(imagePath, 'projects');
};

export const getCertificateImageUrl = (imagePath: string): string => {
  return getImageUrl(imagePath, 'certificates');
};

export const getClientImageUrl = (imagePath: string): string => {
  return getImageUrl(imagePath, 'clients');
};

export const getCompanyImageUrl = (imagePath: string): string => {
  return getImageUrl(imagePath, 'companies');
};
