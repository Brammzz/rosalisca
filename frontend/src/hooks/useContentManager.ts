import { useState, useCallback } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useToast } from '@/hooks/use-toast';

export const useContentManager = () => {
  const contentContext = useContent();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error: Error, message: string) => {
    console.error(error);
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  }, [toast]);

  const handleSuccess = useCallback((message: string) => {
    toast({
      title: "Berhasil",
      description: message,
    });
  }, [toast]);

  // Page management
  const createPage = useCallback(async (pageData: any) => {
    setIsLoading(true);
    try {
      contentContext.createPage(pageData);
      handleSuccess("Halaman baru berhasil dibuat");
    } catch (error) {
      handleError(error as Error, "Gagal membuat halaman baru");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  const updatePage = useCallback(async (page: any) => {
    setIsLoading(true);
    try {
      contentContext.updatePage(page);
      handleSuccess("Halaman berhasil diperbarui");
    } catch (error) {
      handleError(error as Error, "Gagal memperbarui halaman");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  const deletePage = useCallback(async (pageId: string) => {
    setIsLoading(true);
    try {
      contentContext.deletePage(pageId);
      handleSuccess("Halaman berhasil dihapus");
    } catch (error) {
      handleError(error as Error, "Gagal menghapus halaman");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  // Section management
  const addSection = useCallback(async (pageId: string, sectionData: any) => {
    setIsLoading(true);
    try {
      contentContext.addSection(pageId, sectionData);
      handleSuccess("Konten berhasil ditambahkan");
    } catch (error) {
      handleError(error as Error, "Gagal menambahkan konten");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  const updateSection = useCallback(async (pageId: string, section: any) => {
    setIsLoading(true);
    try {
      contentContext.updateSection(pageId, section);
      handleSuccess("Konten berhasil diperbarui");
    } catch (error) {
      handleError(error as Error, "Gagal memperbarui konten");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  const deleteSection = useCallback(async (pageId: string, sectionId: string) => {
    setIsLoading(true);
    try {
      contentContext.deleteSection(pageId, sectionId);
      handleSuccess("Konten berhasil dihapus");
    } catch (error) {
      handleError(error as Error, "Gagal menghapus konten");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  const toggleSectionVisibility = useCallback(async (pageId: string, sectionId: string) => {
    try {
      contentContext.toggleSectionVisibility(pageId, sectionId);
      handleSuccess("Visibilitas konten berhasil diubah");
    } catch (error) {
      handleError(error as Error, "Gagal mengubah visibilitas konten");
    }
  }, [contentContext, handleSuccess, handleError]);

  // Hero slide management
  const addHeroSlide = useCallback(async (slideData: any) => {
    setIsLoading(true);
    try {
      contentContext.addHeroSlide(slideData);
      handleSuccess("Slide berhasil ditambahkan");
    } catch (error) {
      handleError(error as Error, "Gagal menambahkan slide");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  const updateHeroSlide = useCallback(async (slide: any) => {
    setIsLoading(true);
    try {
      contentContext.updateHeroSlide(slide);
      handleSuccess("Slide berhasil diperbarui");
    } catch (error) {
      handleError(error as Error, "Gagal memperbarui slide");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  const deleteHeroSlide = useCallback(async (slideId: string) => {
    setIsLoading(true);
    try {
      contentContext.deleteHeroSlide(slideId);
      handleSuccess("Slide berhasil dihapus");
    } catch (error) {
      handleError(error as Error, "Gagal menghapus slide");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  // Media management
  const uploadMedia = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const mediaFile = await contentContext.uploadMedia(file);
      handleSuccess("File berhasil diupload");
      return mediaFile;
    } catch (error) {
      handleError(error as Error, "Gagal mengupload file");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  const deleteMedia = useCallback(async (fileId: string) => {
    setIsLoading(true);
    try {
      contentContext.deleteMedia(fileId);
      handleSuccess("File berhasil dihapus");
    } catch (error) {
      handleError(error as Error, "Gagal menghapus file");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  // Settings management
  const updateSiteSettings = useCallback(async (settings: any) => {
    setIsLoading(true);
    try {
      contentContext.updateSiteSettings(settings);
      handleSuccess("Pengaturan berhasil diperbarui");
    } catch (error) {
      handleError(error as Error, "Gagal memperbarui pengaturan");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  // Utility functions
  const saveAllChanges = useCallback(async () => {
    setIsLoading(true);
    try {
      await contentContext.saveChanges();
      handleSuccess("Semua perubahan berhasil disimpan");
    } catch (error) {
      handleError(error as Error, "Gagal menyimpan perubahan");
    } finally {
      setIsLoading(false);
    }
  }, [contentContext, handleSuccess, handleError]);

  const resetAllChanges = useCallback(() => {
    try {
      contentContext.resetChanges();
      handleSuccess("Semua perubahan berhasil direset");
    } catch (error) {
      handleError(error as Error, "Gagal mereset perubahan");
    }
  }, [contentContext, handleSuccess, handleError]);

  return {
    // Context data
    ...contentContext,
    
    // Loading state
    isLoading: isLoading || contentContext.loading,
    
    // Management functions
    createPage,
    updatePage,
    deletePage,
    addSection,
    updateSection,
    deleteSection,
    toggleSectionVisibility,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    uploadMedia,
    deleteMedia,
    updateSiteSettings,
    saveAllChanges,
    resetAllChanges,
    
    // Utility functions
    handleError,
    handleSuccess
  };
};

export default useContentManager;
