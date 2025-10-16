// File upload utility untuk Vercel serverless environment

export const isVercelEnvironment = () => {
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
};

export const handleFileUpload = (file, category = 'general') => {
  if (!file) return null;

  // Untuk Vercel, kita akan encode file sebagai base64 dan return URL data
  if (isVercelEnvironment()) {
    // Convert buffer to base64
    const base64 = file.buffer.toString('base64');
    const mimeType = file.mimetype;
    
    // Return data URL yang bisa digunakan langsung
    return `data:${mimeType};base64,${base64}`;
  }

  // Untuk development local, return path biasa
  return `/uploads/${category}/${file.filename}`;
};

export const createUploadDirectory = (dirPath) => {
  // Di Vercel, kita tidak perlu membuat direktori
  if (isVercelEnvironment()) {
    return true;
  }

  // Untuk development local
  const fs = require('fs');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return true;
};

export const saveFileToStorage = (file, category = 'general') => {
  if (isVercelEnvironment()) {
    // Untuk production, kita akan store sebagai base64 di database
    return handleFileUpload(file, category);
  }

  // Untuk development, save ke file system
  return handleFileUpload(file, category);
};
