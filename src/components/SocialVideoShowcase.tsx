import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Play, Volume2, VolumeX, X, Loader2, ExternalLink } from "lucide-react";
import { getClinicData, fetchRemoteClinicData } from "../lib/adminStore";
import { ClinicData, ClinicSocialVideoItem } from "../data/clinicInfo";
import {
  parseSocialVideoUrl,
  resolveSocialVideoMetadata,
  ParsedSocialVideo,
} from "../utils/socialVideoHelper";

interface EnrichedVideoItem extends ClinicSocialVideoItem {
  parsed: ParsedSocialVideo;
  effectivePoster: string;
  effectiveHandle: string;
}

const PREVIEW_DURATION_SECONDS = 5;

export default function SocialVideoShowcase() {
  const [clinicData, setClinicData] = useState<ClinicData>(() => getClinicData());
  const [resolvedMetaMap, setResolvedMetaMap] = useState<
    Record<string, { posterUrl?: string; videoId?: string; handle?: string; canonicalUrl?: string }>
  >({});
  const [activeVideo, setActiveVideo] = useState<EnrichedVideoItem | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [readyVideos, setReadyVideos] = useState<Record<string, boolean>>({});

  const sectionRef = useRef<HTMLElement | null>(null);
  const previewVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Sync with Clinic Master Data (Admin -> Visual Assets -> TikTok & YouTube Video Streams)
  useEffect(() => {
    setClinicData(getClinicData());
    fetchRemoteClinicData()
      .then((remote) => {
        if (remote) setClinicData(remote);
      })
      .catch(() => {});

    const handleClinicDataChanged = (e: Event) => {
      const customEvt = e as CustomEvent<ClinicData>;
      setClinicData(customEvt.detail || getClinicData());
    };

    window.addEventListener("clinic_data_changed", handleClinicDataChanged);
    window.addEventListener("storage", handleClinicDataChanged);
    return () => {
      window.removeEventListener("clinic_data_changed", handleClinicDataChanged);
      window.removeEventListener("storage", handleClinicDataChanged);
    };
  }, []);

  const rawVideos: ClinicSocialVideoItem[] = useMemo(() => {
    return Array.isArray(clinicData.socialVideos)
      ? clinicData.socialVideos.filter((v) => v && typeof v.videoUrl === "string" && v.videoUrl.trim().length > 0)
      : [];
  }, [clinicData.socialVideos]);

  // Background resolve any TikTok/YouTube video that is missing a posterUrl or videoId (e.g. short links)
  useEffect(() => {
    let isCancelled = false;
    rawVideos.forEach((item) => {
      const parsed = parseSocialVideoUrl(item.videoUrl);
      const cached = resolvedMetaMap[item.id];
      const needsResolution =
        (parsed.platform === "tiktok" && (!item.posterUrl || !parsed.videoId)) ||
        (parsed.platform === "youtube" && !item.posterUrl && !parsed.autoPosterUrl);

      if (needsResolution && !cached) {
        resolveSocialVideoMetadata(item.videoUrl)
          .then((meta) => {
            if (!isCancelled && meta.success) {
              setResolvedMetaMap((prev) => ({
                ...prev,
                [item.id]: {
                  posterUrl: meta.posterUrl,
                  videoId: meta.videoId,
                  handle: meta.handle,
                  canonicalUrl: meta.canonicalUrl,
                },
              }));
            }
          })
          .catch(() => {});
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [rawVideos, resolvedMetaMap]);

  const enrichedVideos: EnrichedVideoItem[] = useMemo(() => {
    return rawVideos.map((item, idx) => {
      const cached = resolvedMetaMap[item.id];
      const targetUrl = cached?.canonicalUrl || item.videoUrl;
      const parsed = parseSocialVideoUrl(targetUrl);
      if (cached?.videoId && !parsed.videoId && parsed.platform === "tiktok") {
        parsed.videoId = cached.videoId;
        parsed.embedPreviewUrl = `https://www.tiktok.com/player/v1/${cached.videoId}?autoplay=1&mute=1&loop=1&controls=0&music_info=0&description=0&rel=0`;
        parsed.getEmbedModalUrl = (muted: boolean) =>
          `https://www.tiktok.com/player/v1/${cached.videoId}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&controls=1&music_info=1&description=1&rel=0`;
      }
      const effectivePoster = (
        item.posterUrl ||
        cached?.posterUrl ||
        parsed.autoPosterUrl ||
        ""
      ).trim();
      const rawHandle = (
        item.handle ||
        cached?.handle ||
        parsed.autoHandle ||
        "@agereversalclinics"
      ).trim();
      const effectiveHandle = rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`;

      return {
        ...item,
        id: item.id || `social-video-${idx + 1}`,
        parsed,
        effectivePoster,
        effectiveHandle,
      };
    });
  }, [rawVideos, resolvedMetaMap]);

  // Lazy-load preview videos when SocialVideoShowcase approaches the viewport
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
  }, [enrichedVideos.length]);

  // Play/pause direct MP4 preview videos on scroll
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

  const handleOpenVideo = useCallback((item: EnrichedVideoItem) => {
    setIsBuffering(true);
    setActiveVideo(item);
    setIsMuted(false);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (modalVideoRef.current) {
        modalVideoRef.current.muted = nextMuted;
      }
      return nextMuted;
    });
  }, []);

  // Do not render third-party videos; only render when the clinic has added social videos in Visual Assets
  if (enrichedVideos.length === 0) {
    return null;
  }

  const desktopColsClass =
    enrichedVideos.length === 1
      ? "md:grid-cols-1 max-w-md mx-auto"
      : enrichedVideos.length === 2
      ? "md:grid-cols-2 max-w-4xl mx-auto"
      : enrichedVideos.length === 3
      ? "md:grid-cols-3"
      : "md:grid-cols-4";

  return (
    <section ref={sectionRef} className="w-full py-0 bg-[#070709]">
      <div className="w-full max-w-full mx-auto overflow-hidden">
        <div className={`grid grid-cols-2 gap-1 sm:gap-1.5 ${desktopColsClass}`}>
          {enrichedVideos.map((item) => {
            const { parsed, effectivePoster, effectiveHandle } = item;
            const isDirectVideo = parsed.platform === "video";
            const isYouTube = parsed.platform === "youtube";
            const isTikTok = parsed.platform === "tiktok";
            const previewSrc =
              isDirectVideo && hasEnteredViewport
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
                aria-label={`Play ${parsed.platform} video by ${effectiveHandle}`}
              >
                {/* Static Poster Layer */}
                {effectivePoster ? (
                  <img
                    src={effectivePoster}
                    alt={item.title || effectiveHandle}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-[#171721] via-[#0e0e14] to-[#08080b]" />
                )}

                {/* Direct MP4 / WebM Preview Loop */}
                {isDirectVideo && hasEnteredViewport && (
                  <video
                    ref={(node) => {
                      previewVideoRefs.current[item.id] = node;
                    }}
                    src={previewSrc}
                    poster={effectivePoster || undefined}
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
                  />
                )}

                {/* YouTube Muted Stream Preview in Card */}
                {isYouTube && hasEnteredViewport && isInViewport && !activeVideo && parsed.embedPreviewUrl && (
                  <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <iframe
                      src={parsed.embedPreviewUrl}
                      title={item.title || `YouTube video by ${effectiveHandle}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      onLoad={() => handleVideoLoadedData(item.id)}
                      className={`w-full h-full scale-[1.35] object-cover pointer-events-none border-0 transition-opacity duration-500 ${
                        isVideoReady ? "opacity-95" : "opacity-0"
                      }`}
                    />
                  </div>
                )}

                {/* TikTok Muted Stream Preview in Card */}
                {isTikTok && hasEnteredViewport && isInViewport && !activeVideo && parsed.embedPreviewUrl && (
                  <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    <iframe
                      src={parsed.embedPreviewUrl}
                      title={item.title || `TikTok video by ${effectiveHandle}`}
                      allow="autoplay; encrypted-media;"
                      onLoad={() => handleVideoLoadedData(item.id)}
                      className={`w-full h-full scale-[1.08] object-cover pointer-events-none border-0 transition-opacity duration-500 ${
                        isVideoReady ? "opacity-95" : "opacity-0"
                      }`}
                    />
                  </div>
                )}

                {/* Vignette Gradient Overlay */}
                <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

                {/* Play Button Overlay and Username */}
                <div className="absolute inset-0 z-[3] flex flex-col justify-between p-3 sm:p-5 xl:p-8 pointer-events-none">
                  {/* Top Platform Pill */}
                  <div className="flex justify-end">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-white/90 bg-black/45 border border-white/20">
                      {isTikTok ? "TikTok" : isYouTube ? "YouTube" : "Video"}
                    </span>
                  </div>

                  {/* Center Frosted-Glass Play Button */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-full border border-white/40 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.16)_45%,rgba(18,18,24,0.58)_100%)] shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.45)] transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95 transform-gpu">
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

                  {/* Bottom Handle & Title */}
                  <div className="flex flex-col items-start min-w-0">
                    <p className="truncate w-full text-left text-xs sm:text-sm md:text-base lg:text-2xl text-white font-serif font-light tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]">
                      {effectiveHandle}
                    </p>
                    {item.title && (
                      <p className="truncate w-full text-left text-[11px] sm:text-xs text-white/80 font-sans font-light mt-0.5 drop-shadow">
                        {item.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Video Modal Player rendered in document.body portal */}
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
            <div className="relative w-full max-w-[360px] sm:max-w-md h-[82vh] max-h-[760px] bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col border border-white/15 transform-gpu">
              {/* Top Controls */}
              <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between gap-2 pointer-events-auto">
                <a
                  href={activeVideo.parsed.externalWatchUrl || activeVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 truncate max-w-[62%] text-white hover:text-[#D8C2A3] text-xs sm:text-sm font-medium tracking-wide px-3.5 py-1.5 rounded-full border border-white/25 bg-[linear-gradient(135deg,rgba(38,38,46,0.85)_0%,rgba(16,16,22,0.92)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-colors"
                  title={`Open on ${activeVideo.parsed.platform === "tiktok" ? "TikTok" : activeVideo.parsed.platform === "youtube" ? "YouTube" : "new tab"}`}
                >
                  <span className="truncate">{activeVideo.effectiveHandle}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
                </a>

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

              {/* Buffering Indicator */}
              {isBuffering && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 pointer-events-none">
                  <div className="rounded-full p-3.5 border border-white/25 bg-[radial-gradient(circle_at_30%_25%,rgba(60,60,72,0.85),rgba(16,16,22,0.92))] shadow-lg">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                </div>
              )}

              {/* Modal Stream Player: YouTube, TikTok, or Direct MP4 */}
              {activeVideo.parsed.platform === "youtube" && activeVideo.parsed.videoId ? (
                <iframe
                  key={`yt-${activeVideo.parsed.videoId}-${isMuted ? "muted" : "unmuted"}`}
                  src={activeVideo.parsed.getEmbedModalUrl(isMuted)}
                  title={activeVideo.title || activeVideo.effectiveHandle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={() => setIsBuffering(false)}
                  className="w-full h-full border-0 flex-1 bg-black"
                />
              ) : activeVideo.parsed.platform === "tiktok" && activeVideo.parsed.videoId ? (
                <iframe
                  key={`tt-${activeVideo.parsed.videoId}-${isMuted ? "muted" : "unmuted"}`}
                  src={activeVideo.parsed.getEmbedModalUrl(isMuted)}
                  title={activeVideo.title || activeVideo.effectiveHandle}
                  allow="autoplay; encrypted-media; fullscreen;"
                  allowFullScreen
                  onLoad={() => setIsBuffering(false)}
                  className="w-full h-full border-0 flex-1 bg-black"
                />
              ) : activeVideo.parsed.platform === "video" ? (
                <video
                  ref={modalVideoRef}
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  poster={activeVideo.effectivePoster || undefined}
                  muted={isMuted}
                  onLoadStart={() => setIsBuffering(true)}
                  onWaiting={() => setIsBuffering(true)}
                  onCanPlay={() => setIsBuffering(false)}
                  onPlaying={() => setIsBuffering(false)}
                  className="w-full h-full object-cover flex-1"
                  src={activeVideo.videoUrl}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                  <p className="text-sm text-white/80">
                    Ready to watch on {activeVideo.parsed.platform === "tiktok" ? "TikTok" : "YouTube"}
                  </p>
                  <a
                    href={activeVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsBuffering(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D8C2A3] text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    <span>Open Video</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
