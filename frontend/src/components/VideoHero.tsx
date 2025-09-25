import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoHeroProps {
  videoSrc: string;
  posterSrc?: string;
  title: string;
  subtitle: string;
  showControls?: boolean;
}

const VideoHero: React.FC<VideoHeroProps> = ({
  videoSrc,
  posterSrc,
  title,
  subtitle,
  showControls = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight drop-shadow-2xl">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed drop-shadow-lg max-w-3xl mx-auto">
          {subtitle}
        </p>
        
        {showControls && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              onClick={togglePlay}
              variant="outline"
              size="lg"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button
              onClick={toggleMute}
              variant="outline"
              size="lg"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoHero;
