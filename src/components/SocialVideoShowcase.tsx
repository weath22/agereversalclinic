import { useState, useRef } from "react";
import { Play, Volume2, VolumeX, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoItem {
  id: string;
  videoUrl: string;
  handle: string;
  name?: string;
}

const SOCIAL_VIDEOS: VideoItem[] = [
  {
    id: "reel-1",
    videoUrl: "https://stream.mux.com/FRwrjceXPfw1ZMFTrAkTjj1zFXhrggl6taH01gOGTqR4/capped-1080p.mp4",
    handle: "@aideenkate",
  },
  {
    id: "reel-2",
    videoUrl: "https://stream.mux.com/1pUVNCtmVQJOB6vFpoNrjJdDOU7UQO1xPTl3J9mir9A/capped-1080p.mp4",
    handle: "@therapieclinic",
  },
  {
    id: "reel-3",
    videoUrl: "https://stream.mux.com/zorFOU7BC5Fe4sgkiVOIub6AsWVGKJ00M8Fnj5ditrH8/capped-1080p.mp4",
    handle: "@jeneil.fitness",
  },
  {
    id: "reel-4",
    videoUrl: "https://stream.mux.com/UqkgZbssTYGZgc6diOPSeqlE9B8qxb00zUVCR9EHWsz4/capped-1080p.mp4",
    handle: "@therapieclinic",
  },
];

export default function SocialVideoShowcase() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const handleOpenVideo = (item: VideoItem) => {
    setActiveVideo(item);
    setIsMuted(false);
  };

  const handleToggleMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="w-full py-0">
      <div className="w-full max-w-full mx-auto">
        <div className="css-1c2fuzs">
          <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
            {SOCIAL_VIDEOS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenVideo(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenVideo(item);
                  }
                }}
                className="group relative h-72 w-full cursor-pointer overflow-hidden bg-noir-900 md:h-[600px] select-none"
                role="button"
                tabIndex={0}
                aria-label={`Play video by ${item.handle}`}
              >
                {/* Background Video (Muted Autoplay) */}
                <div className="h-full w-full opacity-90 transition-opacity duration-300 group-hover:opacity-100">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-hidden="true"
                    className="h-full w-full object-cover object-top"
                  >
                    <source src={item.videoUrl} type="video/mp4" />
                    <track
                      kind="captions"
                      src="/assets/captions/decorative.vtt"
                      srcLang="en"
                      label="English"
                      default
                    />
                  </video>
                </div>

                {/* Light Vignette Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

                {/* Play Button Overlay and Username */}
                <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between p-4 xl:p-8 pointer-events-none">
                  {/* Center Play Icon with Reduced Black Intensity */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="rounded-full bg-black/25 p-4 sm:p-5 backdrop-blur-md border border-white/30 group-hover:scale-110 group-hover:bg-black/40 group-hover:border-white/50 transition-all duration-300 shadow-lg">
                      <Play
                        className="h-7 w-7 text-white sm:h-10 sm:w-10 fill-white translate-x-0.5"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Bottom Handle */}
                  <div className="flex items-end">
                    <p className="text-left text-base text-white lg:text-2xl font-serif font-light tracking-wide drop-shadow-md">
                      {item.handle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Video Modal Player with Audio on Click */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setActiveVideo(null)}
            />

            {/* Video Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-full max-w-sm sm:max-w-md h-[80vh] max-h-[750px] bg-black rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col border border-white/10"
            >
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
                <span className="text-white text-sm font-medium tracking-wide bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                  {activeVideo.handle}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-colors border border-white/10 cursor-pointer"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVideo(null)}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-colors border border-white/10 cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Video Player */}
              <video
                ref={modalVideoRef}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
                src={activeVideo.videoUrl}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
