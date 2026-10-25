import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Play, Volume2, VolumeX, X, Loader2 } from "lucide-react";

interface VideoItem {
  id: string;
  playbackId: string;
  videoUrl: string;
  posterUrl: string;
  handle: string;
  name?: string;
}

const PREVIEW_DURATION_SECONDS = 5;

const SOCIAL_VIDEOS: VideoItem[] = [
  {
    id: "reel-1",
    playbackId: "FRwrjceXPfw1ZMFTrAkTjj1zFXhrggl6taH01gOGTqR4",
    videoUrl: "https://stream.mux.com/FRwrjceXPfw1ZMFTrAkTjj1zFXhrggl6taH01gOGTqR4/capped-1080p.mp4",
    posterUrl: "https://image.mux.com/FRwrjceXPfw1ZMFTrAkTjj1zFXhrggl6taH01gOGTqR4/thumbnail.webp?time=0&width=480",
    handle: "@aideenkate",
  },
  {
    id: "reel-2",
    playbackId: "1pUVNCtmVQJOB6vFpoNrjJdDOU7UQO1xPTl3J9mir9A",
    videoUrl: "https://stream.mux.com/1pUVNCtmVQJOB6vFpoNrjJdDOU7UQO1xPTl3J9mir9A/capped-1080p.mp4",
    posterUrl: "https://image.mux.com/1pUVNCtmVQJOB6vFpoNrjJdDOU7UQO1xPTl3J9mir9A/thumbnail.webp?time=0&width=480",
    handle: "@therapieclinic",
  },
  {
    id: "reel-3",
    playbackId: "zorFOU7BC5Fe4sgkiVOIub6AsWVGKJ00M8Fnj5ditrH8",
    videoUrl: "https://stream.mux.com/zorFOU7BC5Fe4sgkiVOIub6AsWVGKJ00M8Fnj5ditrH8/capped-1080p.mp4",
    posterUrl: "https://image.mux.com/zorFOU7BC5Fe4sgkiVOIub6AsWVGKJ00M8Fnj5ditrH8/thumbnail.webp?time=0&width=480",
    handle: "@jeneil.fitness",
  },
  {
    id: "reel-4",
    playbackId: "UqkgZbssTYGZgc6diOPSeqlE9B8qxb00zUVCR9EHWsz4",
    videoUrl: "https://stream.mux.com/UqkgZbssTYGZgc6diOPSeqlE9B8qxb00zUVCR9EHWsz4/capped-1080p.mp4",
    posterUrl: "https://image.mux.com/UqkgZbssTYGZgc6diOPSeqlE9B8qxb00zUVCR9EHWsz4/thumbnail.webp?time=0&width=480",
    handle: "@therapieclinic",
  },
];

export default function SocialVideoShowcase() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [readyVideos, setReadyVideos] = useState<Record<string, boolean>>({});

  const sectionRef = useRef<HTMLElement | null>(null);
  const previewVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Lazy-load the 4 preview videos when SocialVideoShowcase approaches the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setHasEnteredViewport(true);
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsInViewport(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasEnteredViewport(true);
        }
      },
      { rootMargin: "120px 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Debounce play/pause slightly on fast scroll so the browser doesn't thrash decoders mid-scroll
  useEffect(() => {
    let rafId: number | null = null;
    const timerId = window.setTimeout(() => {
      rafId = window.requestAnimationFrame(() => {
        Object.values(previewVideoRefs.current).forEach((videoEl) => {
          if (!videoEl) return;
          if (isInViewport && !activeVideo) {
            if (videoEl.paused) {
              videoEl.play().catch(() => {});
            }
          } else if (!videoEl.paused) {
            videoEl.pause();
          }
        });
      });
    }, 60);

    return () => {
      window.clearTimeout(timerId);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isInViewport, activeVideo]);

  // Close modal on Escape key
  useEffect(() => {
    if (!activeVideo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo]);

  const handlePreviewTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      if (video.currentTime >= PREVIEW_DURATION_SECONDS) {
        video.currentTime = 0;
      }
    },
    []
  );

  const handleVideoLoadedData = useCallback((id: string) => {
    setReadyVideos((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);

  const handleOpenVideo = useCallback((item: VideoItem) => {
    setIsBuffering(true);
    setActiveVideo(item);
    setIsMuted(false);
  }, []);

  const handleToggleMute = useCallback(() => {
    if (modalVideoRef.current) {
      const nextMuted = !modalVideoRef.current.muted;
      modalVideoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-0">
      <div className="w-full max-w-full mx-auto overflow-hidden">
        <div className="grid grid-cols-2 gap-1 sm:gap-1.5 md:grid-cols-4">
          {SOCIAL_VIDEOS.map((item) => {
            const previewSrc = hasEnteredViewport
              ? `${item.videoUrl}#t=0,${PREVIEW_DURATION_SECONDS}`
              : undefined;
            const isVideoReady = Boolean(readyVideos[item.id]);

            return (
              <div
                key={item.id}
                onClick={() => handleOpenVideo(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenVideo(item);
                  }
                }}
                className="group relative h-64 min-h-[240px] sm:h-80 md:h-[460px] lg:h-[600px] w-full cursor-pointer overflow-hidden bg-[#0c0c10] select-none [contain:layout_paint] transform-gpu"
                role="button"
                tabIndex={0}
                aria-label={`Play video by ${item.handle}`}
              >
                {/* Static Poster Layer (prevents black flashes or layout breaks during fast scroll on small devices) */}
                <img
                  src={item.posterUrl}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top pointer-events-none select-none"
                />

                {/* Background Video (5-Second Preview Loop, Lazy-Loaded on Scroll) */}
                {hasEnteredViewport && (
                  <video
                    ref={(node) => {
                      previewVideoRefs.current[item.id] = node;
                    }}
                    src={previewSrc}
                    poster={item.posterUrl}
                    autoPlay={isInViewport && !activeVideo}
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    disableRemotePlayback
                    preload="metadata"
                    onLoadedData={() => handleVideoLoadedData(item.id)}
                    onTimeUpdate={handlePreviewTimeUpdate}
                    aria-hidden="true"
                    className={`relative z-[1] h-full w-full object-cover object-top pointer-events-none transition-opacity duration-300 ${
                      isVideoReady ? "opacity-90 group-hover:opacity-100" : "opacity-0"
                    }`}
                  >
                    <track
                      kind="captions"
                      src="/assets/captions/decorative.vtt"
                      srcLang="en"
                      label="English"
                      default
                    />
                  </video>
                )}

                {/* Vignette Gradient Overlay */}
                <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

                {/* Play Button Overlay and Username */}
                <div className="absolute inset-0 z-[3] flex flex-col justify-between p-3 sm:p-5 xl:p-8 pointer-events-none">
                  {/* Center Simulated Frosted-Glass Play Button (Zero backdrop-filter GPU lag) */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-full border border-white/40 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.16)_45%,rgba(18,18,24,0.58)_100%)] shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.45)] transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95 transform-gpu">
                      {/* Inner Specular Rim */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-[2px] rounded-full border border-white/15 pointer-events-none"
                      />
                      <Play
                        className="h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white fill-white translate-x-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Bottom Handle */}
                  <div className="flex items-end min-w-0">
                    <p className="truncate text-left text-xs sm:text-sm md:text-base lg:text-2xl text-white font-serif font-light tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]">
                      {item.handle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Video Modal Player rendered in document.body portal so it is never masked by section bounds */}
      {activeVideo &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/85 transition-opacity"
              onClick={() => setActiveVideo(null)}
            />

            {/* Video Modal Card */}
            <div className="relative w-full max-w-[340px] sm:max-w-md h-[80vh] max-h-[750px] bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col border border-white/15 transform-gpu">
              {/* Top Controls */}
              <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between gap-2 pointer-events-auto">
                <span className="truncate max-w-[60%] text-white text-xs sm:text-sm font-medium tracking-wide px-3.5 py-1.5 rounded-full border border-white/25 bg-[linear-gradient(135deg,rgba(38,38,46,0.82)_0%,rgba(16,16,22,0.88)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                  {activeVideo.handle}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white flex items-center justify-center hover:brightness-110 transition-all border border-white/25 bg-[linear-gradient(135deg,rgba(38,38,46,0.82)_0%,rgba(16,16,22,0.88)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] cursor-pointer"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVideo(null)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white flex items-center justify-center hover:brightness-110 transition-all border border-white/25 bg-[linear-gradient(135deg,rgba(38,38,46,0.82)_0%,rgba(16,16,22,0.88)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Smooth Chunk Buffering Indicator */}
              {isBuffering && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 pointer-events-none">
                  <div className="rounded-full p-3.5 border border-white/25 bg-[radial-gradient(circle_at_30%_25%,rgba(60,60,72,0.85),rgba(16,16,22,0.92))] shadow-lg">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                </div>
              )}

              {/* Full Video Player */}
              <video
                ref={modalVideoRef}
                autoPlay
                loop
                playsInline
                preload="metadata"
                poster={activeVideo.posterUrl}
                muted={isMuted}
                onLoadStart={() => setIsBuffering(true)}
                onWaiting={() => setIsBuffering(true)}
                onCanPlay={() => setIsBuffering(false)}
                onPlaying={() => setIsBuffering(false)}
                className="w-full h-full object-cover"
                src={activeVideo.videoUrl}
              />
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

