import { ClinicSocialVideoItem } from '../data/clinicInfo';
import { uploadAssetFile } from '../lib/adminStore';

export type SocialVideoPlatform = 'instagram' | 'tiktok' | 'youtube' | 'video';

export const PREVIEW_LOOP_DURATION_SECONDS = 5;

export interface ParsedSocialVideo {
  platform: SocialVideoPlatform;
  videoId: string;
  canonicalUrl: string;
  embedPreviewUrl: string;
  getEmbedModalUrl: (isMuted: boolean) => string;
  autoPosterUrl: string;
  autoHandle: string;
  externalWatchUrl: string;
}

/**
 * If the user pasted a raw HTML <iframe> or <blockquote> embed snippet
 * (from Instagram, YouTube, or TikTok), extract the underlying URL automatically.
 */
export function unwrapEmbedCodeOrUrl(rawInput: string): string {
  const trimmed = (rawInput || '').trim();
  if (!trimmed) return '';

  // 1. Check Instagram blockquote data-instgrm-permalink="..."
  const igPermalinkMatch = trimmed.match(/data-instgrm-permalink=["']([^"']+)["']/i);
  if (igPermalinkMatch?.[1]) {
    return igPermalinkMatch[1].trim();
  }

  // 2. Check TikTok blockquote cite="..."
  const ttCiteMatch = trimmed.match(/cite=["'](https?:\/\/[^"']*tiktok\.com[^"']*)["']/i);
  if (ttCiteMatch?.[1]) {
    return ttCiteMatch[1].trim();
  }

  // 3. Check <iframe ... src="...">
  const iframeSrcMatch = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeSrcMatch?.[1]) {
    return iframeSrcMatch[1].trim();
  }

  // 4. Fallback: if input contains HTML tags, extract the first https:// URL inside it
  if (trimmed.startsWith('<') && /https?:\/\//i.test(trimmed)) {
    const anyUrlMatch = trimmed.match(/https?:\/\/[^\s"'<>]+/i);
    if (anyUrlMatch?.[0]) {
      return anyUrlMatch[0].trim();
    }
  }

  return trimmed;
}

/**
 * Extracts an Instagram Reel / Post shortcode and optional @handle
 */
export function extractInstagramVideoInfo(
  rawInput: string
): { shortcode: string; postType: 'reel' | 'p' | 'tv'; handle?: string } | null {
  const unwrapped = unwrapEmbedCodeOrUrl(rawInput);
  if (!unwrapped || !/(?:instagram\.com|instagr\.am)/i.test(unwrapped)) return null;

  const matchWithUser = unwrapped.match(
    /(?:instagram\.com|instagr\.am)\/(?:([a-zA-Z0-9._]+)\/)?(reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/i
  );
  if (matchWithUser?.[3]) {
    const rawUser = matchWithUser[1];
    const reservedSegments = new Set(['reel', 'reels', 'p', 'tv', 'stories', 'explore', 'accounts']);
    const handle =
      rawUser && !reservedSegments.has(rawUser.toLowerCase())
        ? `@${rawUser.replace(/^@/, '')}`
        : undefined;
    const rawType = matchWithUser[2].toLowerCase();
    const postType: 'reel' | 'p' | 'tv' =
      rawType === 'p' ? 'p' : rawType === 'tv' ? 'tv' : 'reel';
    return {
      shortcode: matchWithUser[3],
      postType,
      handle,
    };
  }

  return null;
}

/**
 * Extracts a YouTube 11-character video ID from Shorts, watch?v=, youtu.be, or embed URLs
 */
export function extractYouTubeVideoId(rawInput: string): string | null {
  const trimmed = unwrapEmbedCodeOrUrl(rawInput);
  if (!trimmed) return null;

  // Match youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/(?:youtube\.com|youtu\.be)\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch?.[1]) return shortsMatch[1];

  // Match youtu.be/VIDEO_ID
  const shortLinkMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortLinkMatch?.[1]) return shortLinkMatch[1];

  // Match youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch?.[1] && /youtube\.com/i.test(trimmed)) return watchMatch[1];

  // Match youtube.com/embed/VIDEO_ID or youtube-nocookie.com/embed/VIDEO_ID or youtube.com/live/VIDEO_ID
  const embedMatch = trimmed.match(/youtube(?:-nocookie)?\.com\/(?:embed|live|v)\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch?.[1]) return embedMatch[1];

  return null;
}

/**
 * Extracts a TikTok numeric video ID and optional @username from standard or embed TikTok URLs
 */
export function extractTikTokVideoInfo(rawInput: string): { videoId: string; handle?: string } | null {
  const trimmed = unwrapEmbedCodeOrUrl(rawInput);
  if (!trimmed || !/tiktok\.com/i.test(trimmed)) return null;

  // Match tiktok.com/@username/video/1234567890123456789 (or /photo/)
  const standardMatch = trimmed.match(/tiktok\.com\/@([^/?#]+)\/(?:video|photo)\/(\d{10,25})/i);
  if (standardMatch) {
    return {
      handle: `@${standardMatch[1].replace(/^@/, '')}`,
      videoId: standardMatch[2],
    };
  }

  // Match tiktok.com/player/v1/1234567890 or tiktok.com/embed/v2/1234567890 or tiktok.com/embed/1234567890
  const embedMatch = trimmed.match(/tiktok\.com\/(?:player\/v1|embed(?:\/v2)?|v)\/(\d{10,25})/i);
  if (embedMatch?.[1]) {
    return {
      videoId: embedMatch[1],
    };
  }

  // Match item_id=1234567890123456789 in query params
  const itemParamMatch = trimmed.match(/[?&]item_id=(\d{15,25})/i);
  if (itemParamMatch?.[1]) {
    return {
      videoId: itemParamMatch[1],
    };
  }

  // Match any 15-22 digit video ID in a tiktok.com URL path
  const fallbackDigits = trimmed.match(/\/(\d{15,25})(?:[/?#]|$)/);
  if (fallbackDigits?.[1]) {
    const handleMatch = trimmed.match(/tiktok\.com\/@([^/?#]+)/i);
    return {
      videoId: fallbackDigits[1],
      handle: handleMatch?.[1] ? `@${handleMatch[1].replace(/^@/, '')}` : undefined,
    };
  }

  return null;
}

/**
 * Detects which social platform a URL belongs to (for "Watch on Instagram / TikTok / YouTube" buttons)
 */
export function getSocialPlatformLabel(url?: string, fallbackPlatform?: SocialVideoPlatform): string {
  const clean = (url || '').trim();
  if (/instagram\.com|instagr\.am/i.test(clean) || fallbackPlatform === 'instagram') {
    return 'Instagram';
  }
  if (/tiktok\.com/i.test(clean) || fallbackPlatform === 'tiktok') {
    return 'TikTok';
  }
  if (/youtube\.com|youtu\.be/i.test(clean) || fallbackPlatform === 'youtube') {
    return 'YouTube';
  }
  return 'Social Media';
}

/**
 * Parses any video URL or <iframe> embed code (Instagram Reel/Post, TikTok, YouTube Shorts/Watch, or direct MP4/WebM)
 * into structured playback and embed URLs.
 */
export function parseSocialVideoUrl(rawUrl: string): ParsedSocialVideo {
  const cleanUrl = unwrapEmbedCodeOrUrl(rawUrl).replace(/#t=[^#]*$/i, '');

  // 1. Check Instagram Reel / Post / TV
  const igInfo = extractInstagramVideoInfo(cleanUrl);
  if (igInfo?.shortcode) {
    const code = igInfo.shortcode;
    const canonical = `https://www.instagram.com/${igInfo.postType}/${code}/`;
    const embedUrl = `https://www.instagram.com/${igInfo.postType}/${code}/embed/`;
    return {
      platform: 'instagram',
      videoId: code,
      canonicalUrl: canonical,
      embedPreviewUrl: embedUrl,
      getEmbedModalUrl: () => embedUrl,
      autoPosterUrl: '',
      autoHandle: igInfo.handle || '',
      externalWatchUrl: canonical,
    };
  }

  // 2. Check YouTube
  const ytId = extractYouTubeVideoId(cleanUrl);
  if (ytId) {
    const isShorts = /\/shorts\//i.test(cleanUrl);
    return {
      platform: 'youtube',
      videoId: ytId,
      canonicalUrl: isShorts
        ? `https://www.youtube.com/shorts/${ytId}`
        : `https://www.youtube.com/watch?v=${ytId}`,
      // 5-second preview clip on card via start=0&end=5
      embedPreviewUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&start=0&end=${PREVIEW_LOOP_DURATION_SECONDS}&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3`,
      getEmbedModalUrl: (isMuted: boolean) =>
        `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${ytId}&controls=1&modestbranding=1&playsinline=1&rel=0`,
      autoPosterUrl: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      autoHandle: '',
      externalWatchUrl: isShorts
        ? `https://www.youtube.com/shorts/${ytId}`
        : `https://www.youtube.com/watch?v=${ytId}`,
    };
  }

  // 3. Check TikTok
  const ttInfo = extractTikTokVideoInfo(cleanUrl);
  if (ttInfo?.videoId) {
    const ttId = ttInfo.videoId;
    const handle = ttInfo.handle || '';
    const canonical = handle
      ? `https://www.tiktok.com/${handle}/video/${ttId}`
      : `https://www.tiktok.com/video/${ttId}`;
    return {
      platform: 'tiktok',
      videoId: ttId,
      canonicalUrl: canonical,
      embedPreviewUrl: `https://www.tiktok.com/player/v1/${ttId}?embed_from=oembed&autoplay=1&muted=1&loop=1&controls=0&music_info=0&description=0&rel=0`,
      getEmbedModalUrl: (isMuted: boolean) =>
        `https://www.tiktok.com/player/v1/${ttId}?embed_from=oembed&autoplay=1&muted=${isMuted ? 1 : 0}&loop=1&controls=1&music_info=1&description=1&rel=0`,
      autoPosterUrl: '',
      autoHandle: handle,
      externalWatchUrl: canonical,
    };
  }

  // Check if it's a short TikTok link (e.g. vm.tiktok.com or vt.tiktok.com or tiktok.com/t/) that hasn't been resolved yet
  if (/tiktok\.com/i.test(cleanUrl)) {
    const handleMatch = cleanUrl.match(/tiktok\.com\/@([^/?#]+)/i);
    return {
      platform: 'tiktok',
      videoId: '',
      canonicalUrl: cleanUrl,
      embedPreviewUrl: '',
      getEmbedModalUrl: () => '',
      autoPosterUrl: '',
      autoHandle: handleMatch?.[1] ? `@${handleMatch[1].replace(/^@/, '')}` : '',
      externalWatchUrl: cleanUrl,
    };
  }

  // 4. Direct Video File (.mp4, .webm, Cloudflare R2, etc.)
  return {
    platform: 'video',
    videoId: '',
    canonicalUrl: cleanUrl,
    embedPreviewUrl: `${cleanUrl}#t=0.05,${PREVIEW_LOOP_DURATION_SECONDS}`,
    getEmbedModalUrl: () => cleanUrl,
    autoPosterUrl: '',
    autoHandle: '',
    externalWatchUrl: cleanUrl,
  };
}

/**
 * Captures the first frame of a direct video URL (e.g. Cloudflare R2 .mp4 / .webm)
 * using an offscreen HTML5 <video> + <canvas>, and optionally uploads it as a lightweight .webp thumbnail.
 */
export async function captureVideoFirstFrameThumbnail(
  rawVideoUrl: string,
  options?: { slotId?: string; uploadToAssets?: boolean }
): Promise<string> {
  if (typeof document === 'undefined') return '';
  const cleanUrl = unwrapEmbedCodeOrUrl(rawVideoUrl).replace(/#t=[^#]*$/i, '').trim();
  if (!cleanUrl) return '';

  const tryCaptureFromSrc = (srcUrl: string): Promise<{ dataUrl: string; blob: Blob | null }> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      let settled = false;
      const finish = (result: { dataUrl: string; blob: Blob | null }) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        try {
          video.pause();
          video.removeAttribute('src');
          video.load();
        } catch {
          // ignore cleanup errors
        }
        resolve(result);
      };

      const timeoutId = window.setTimeout(() => {
        finish({ dataUrl: '', blob: null });
      }, 9000);

      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';

      const drawFrame = () => {
        try {
          const vw = video.videoWidth || 480;
          const vh = video.videoHeight || 854;
          if (!vw || !vh) {
            finish({ dataUrl: '', blob: null });
            return;
          }
          const maxHeight = 720;
          const scale = vh > maxHeight ? maxHeight / vh : 1;
          const targetW = Math.max(1, Math.round(vw * scale));
          const targetH = Math.max(1, Math.round(vh * scale));

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            finish({ dataUrl: '', blob: null });
            return;
          }
          ctx.drawImage(video, 0, 0, targetW, targetH);
          const dataUrl = canvas.toDataURL('image/webp', 0.82);
          canvas.toBlob(
            (blob) => {
              finish({ dataUrl, blob });
            },
            'image/webp',
            0.82
          );
        } catch {
          // Canvas tainted or draw error
          finish({ dataUrl: '', blob: null });
        }
      };

      video.addEventListener(
        'loadeddata',
        () => {
          try {
            // Seek slightly past 0.00s (0.15s) to avoid black fade-in frames
            const targetTime =
              Number.isFinite(video.duration) && video.duration > 0.3
                ? 0.15
                : 0.02;
            video.currentTime = targetTime;
          } catch {
            drawFrame();
          }
        },
        { once: true }
      );

      video.addEventListener(
        'seeked',
        () => {
          drawFrame();
        },
        { once: true }
      );

      video.addEventListener(
        'error',
        () => {
          finish({ dataUrl: '', blob: null });
        },
        { once: true }
      );

      video.src = srcUrl;
      video.load();
    });
  };

  // 1. Try via same-origin server proxy first so external Cloudflare R2 URLs never fail due to CORS taint
  const isRemoteHttp = /^https?:\/\//i.test(cleanUrl);
  let captured: { dataUrl: string; blob: Blob | null } = { dataUrl: '', blob: null };

  if (isRemoteHttp) {
    const proxiedUrl = `/api/social-video/video-proxy?url=${encodeURIComponent(cleanUrl)}`;
    captured = await tryCaptureFromSrc(proxiedUrl);
  }

  // 2. Fallback to direct URL if local or if proxy wasn't needed
  if (!captured.dataUrl) {
    captured = await tryCaptureFromSrc(cleanUrl);
  }

  if (!captured.dataUrl) return '';

  // 3. Optionally upload the captured WebP frame to /public/assets/ so posterUrl is a tiny static file URL
  if (options?.uploadToAssets !== false && captured.blob) {
    try {
      const file = new File([captured.blob], `social-video-frame-${Date.now()}.webp`, {
        type: 'image/webp',
      });
      const uploadRes = await uploadAssetFile(file, undefined, {
        slotId: options?.slotId,
        convertToWebp: true,
      });
      if (uploadRes.success && uploadRes.url) {
        return uploadRes.url;
      }
    } catch {
      // Fallback to dataUrl below
    }
  }

  return captured.dataUrl;
}

export interface ResolvedSocialMetadata {
  success: boolean;
  platform: SocialVideoPlatform;
  videoId?: string;
  canonicalUrl: string;
  posterUrl?: string;
  handle?: string;
  title?: string;
}

/**
 * Resolves metadata (thumbnail poster, creator @handle, title, and canonical video ID for short links)
 * via backend `/api/social-video/resolve` with client-side oEmbed + first-frame video capture fallback.
 */
export async function resolveSocialVideoMetadata(
  rawUrl: string,
  options?: { slotId?: string; uploadFirstFrameToAssets?: boolean }
): Promise<ResolvedSocialMetadata> {
  const cleanUrl = unwrapEmbedCodeOrUrl(rawUrl).replace(/#t=[^#]*$/i, '');
  const initialParsed = parseSocialVideoUrl(cleanUrl);

  if (!cleanUrl) {
    return {
      success: false,
      platform: 'video',
      canonicalUrl: '',
    };
  }

  // If it's a direct video URL (e.g. Cloudflare R2 .mp4), capture its first frame as the thumbnail automatically
  if (initialParsed.platform === 'video') {
    const firstFramePoster = await captureVideoFirstFrameThumbnail(initialParsed.canonicalUrl, {
      slotId: options?.slotId,
      uploadToAssets: options?.uploadFirstFrameToAssets ?? true,
    });
    return {
      success: true,
      platform: 'video',
      videoId: '',
      canonicalUrl: initialParsed.canonicalUrl,
      posterUrl: firstFramePoster,
      handle: initialParsed.autoHandle,
      title: '',
    };
  }

  // 1. Try server-side resolver first (handles redirects + Instagram/TikTok/YouTube metadata)
  try {
    const res = await fetch(`/api/social-video/resolve?url=${encodeURIComponent(cleanUrl)}`);
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.success) {
          return {
            success: true,
            platform: data.platform || initialParsed.platform,
            videoId: data.videoId || initialParsed.videoId,
            canonicalUrl: data.canonicalUrl || initialParsed.canonicalUrl || cleanUrl,
            posterUrl: data.posterUrl || initialParsed.autoPosterUrl || '',
            handle: data.handle || initialParsed.autoHandle || '',
            title: data.title || '',
          };
        }
      }
    }
  } catch {
    // Fall through to client-side oEmbed / regex fallback
  }

  // 2. Client-side fallback for Instagram
  if (initialParsed.platform === 'instagram') {
    return {
      success: true,
      platform: 'instagram',
      videoId: initialParsed.videoId,
      canonicalUrl: initialParsed.canonicalUrl,
      posterUrl: initialParsed.autoPosterUrl,
      handle: initialParsed.autoHandle,
      title: '',
    };
  }

  // 3. Client-side oEmbed fallback for TikTok
  if (initialParsed.platform === 'tiktok') {
    try {
      const oembedRes = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(initialParsed.canonicalUrl || cleanUrl)}`
      );
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        const authorHandle = oembed.author_unique_id
          ? `@${String(oembed.author_unique_id).replace(/^@/, '')}`
          : oembed.author_name
          ? `@${String(oembed.author_name).replace(/\s+/g, '').replace(/^@/, '')}`
          : initialParsed.autoHandle;
        const embedProductId = oembed.embed_product_id ? String(oembed.embed_product_id) : initialParsed.videoId;
        const resolvedCanonical =
          embedProductId && authorHandle
            ? `https://www.tiktok.com/${authorHandle}/video/${embedProductId}`
            : embedProductId
            ? `https://www.tiktok.com/video/${embedProductId}`
            : initialParsed.canonicalUrl || cleanUrl;
        return {
          success: true,
          platform: 'tiktok',
          videoId: embedProductId,
          canonicalUrl: resolvedCanonical,
          posterUrl: oembed.thumbnail_url || '',
          handle: authorHandle,
          title: oembed.title || '',
        };
      }
    } catch {
      // ignore
    }
  }

  // 4. Client-side oEmbed fallback for YouTube
  if (initialParsed.platform === 'youtube') {
    try {
      const ytOembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${initialParsed.videoId}`)}&format=json`
      );
      if (ytOembedRes.ok) {
        const ytOembed = await ytOembedRes.json();
        const ytHandle = ytOembed.author_name
          ? `@${String(ytOembed.author_name).replace(/\s+/g, '').replace(/^@/, '')}`
          : initialParsed.autoHandle;
        return {
          success: true,
          platform: 'youtube',
          videoId: initialParsed.videoId,
          canonicalUrl: initialParsed.canonicalUrl,
          posterUrl: ytOembed.thumbnail_url || initialParsed.autoPosterUrl,
          handle: ytHandle,
          title: ytOembed.title || '',
        };
      }
    } catch {
      // ignore
    }
    return {
      success: true,
      platform: 'youtube',
      videoId: initialParsed.videoId,
      canonicalUrl: initialParsed.canonicalUrl,
      posterUrl: initialParsed.autoPosterUrl,
      handle: initialParsed.autoHandle,
      title: '',
    };
  }

  return {
    success: true,
    platform: initialParsed.platform,
    videoId: initialParsed.videoId,
    canonicalUrl: initialParsed.canonicalUrl || cleanUrl,
    posterUrl: initialParsed.autoPosterUrl,
    handle: initialParsed.autoHandle,
  };
}

/**
 * Normalizes a ClinicSocialVideoItem so platform, posterUrl, and handle are always populated
 */
export function normalizeSocialVideoItem(
  item: Partial<ClinicSocialVideoItem>,
  index: number = 0,
  defaultHandle: string = '@agereversalclinics'
): ClinicSocialVideoItem {
  const parsed = parseSocialVideoUrl(item.videoUrl || '');
  const resolvedHandle = (item.handle || parsed.autoHandle || defaultHandle).trim();
  const formattedHandle = resolvedHandle
    ? resolvedHandle.startsWith('@')
      ? resolvedHandle
      : `@${resolvedHandle}`
    : defaultHandle;

  const cleanSocialPostUrl = (item.socialPostUrl || '').trim();

  return {
    id: item.id || `social-video-${index + 1}`,
    videoUrl: (parsed.canonicalUrl || item.videoUrl || '').trim(),
    ...(cleanSocialPostUrl ? { socialPostUrl: cleanSocialPostUrl } : {}),
    handle: formattedHandle,
    title: (item.title || '').trim(),
    posterUrl: (item.posterUrl || parsed.autoPosterUrl || '').trim(),
    platform: item.platform || parsed.platform,
  };
}
