// Utility untuk handle file uploads di production (Vercel)
// Karena Vercel serverless functions tidak support file system writes,
// kita perlu menggunakan cloud storage atau alternatif lain

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

// Untuk sementara, kita akan disable file upload di production
// dan return placeholder URLs
export const handleFileUpload = (req, res, next) => {
  if (isProduction) {
    // Di production, kita akan skip file upload dan return placeholder
    console.log('File upload disabled in production environment');
    req.skipFileUpload = true;
  }
  next();
};

// Generate placeholder image URL
export const generatePlaceholderImage = (type = 'project') => {
  const placeholders = {
    project: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
    certificate: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=800&fit=crop',
    client: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop'
  };
  
  return placeholders[type] || placeholders.project;
};

// Check if file path is local upload
export const isLocalUpload = (filePath) => {
  return filePath && filePath.startsWith('/uploads');
};

// Convert local upload path to production placeholder
export const getProductionImageUrl = (localPath, type = 'project') => {
  if (isProduction && isLocalUpload(localPath)) {
    return generatePlaceholderImage(type);
  }
  return localPath;
};
