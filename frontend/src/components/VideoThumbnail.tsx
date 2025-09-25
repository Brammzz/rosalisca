import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface VideoThumbnailProps {
  thumbnailSrc: string;
  videoUrl: string; // YouTube/Vimeo URL
  title: string;
  description?: string;
  duration?: string;
  isEmbed?: boolean; // true for YouTube/Vimeo, false for direct video
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnailSrc,
  videoUrl,
  title,
  description,
  duration,
  isEmbed = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Thumbnail Image */}
      <div className="relative aspect-video bg-gray-900">
        <img
          src={thumbnailSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 hover:border-white/50 rounded-full w-16 h-16 p-0 group-hover:scale-110 transition-all"
              >
                <Play className="w-8 h-8 ml-1" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl w-full p-0">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {isEmbed ? (
                  <iframe
                    src={getEmbedUrl(videoUrl)}
                    title={title}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    className="absolute top-0 left-0 w-full h-full"
                    controls
                    autoPlay
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Duration Badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-construction-gray-900 mb-2 group-hover:text-construction-blue-600 transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-construction-gray-600 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoThumbnail;
