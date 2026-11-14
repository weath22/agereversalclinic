import { ClinicSocialVideoItem } from '../data/clinicInfo';

export type SocialVideoPlatform = 'tiktok' | 'youtube' | 'video';

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
 * Extracts a YouTube 11-character video ID from Shorts, watch?v=, youtu.be, or embed URLs
 */
export function extractYouTubeVideoId(rawUrl: string): string | null {
  const trimmed = (rawUrl || '').trim();
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

  // Match youtube.com/embed/VIDEO_ID or youtube-nocookie.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch?.[1]) return embedMatch[1];

  return null;
}

/**
 * Extracts a TikTok numeric video ID and optional @username from standard or embed TikTok URLs
 */
export function extractTikTokVideoInfo(rawUrl: string): { videoId: string; handle?: string } | null {
  const trimmed = (rawUrl || '').trim();
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

  // Match any 18-20 digit video ID in a tiktok.com URL query/path
  const fallbackDigits = trimmed.match(/\/(\d{15,22})(?:[/?#]|$)/);
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
 * Parses any video URL (TikTok, YouTube Shorts / Watch, or direct MP4/WebM)
 * into structured playback and embed URLs.
 */
export function parseSocialVideoUrl(rawUrl: string): ParsedSocialVideo {
  const cleanUrl = (rawUrl || '').trim();

  // 1. Check YouTube
  const ytId = extractYouTubeVideoId(cleanUrl);
  if (ytId) {
    const isShorts = /\/shorts\//i.test(cleanUrl);
    return {
      platform: 'youtube',
      videoId: ytId,
      canonicalUrl: isShorts
        ? `https://www.youtube.com/shorts/${ytId}`
        : `https://www.youtube.com/watch?v=${ytId}`,
      embedPreviewUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1`,
      getEmbedModalUrl: (isMuted: boolean) =>
        `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${ytId}&controls=1&modestbranding=1&playsinline=1&rel=0`,
      autoPosterUrl: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      autoHandle: '',
      externalWatchUrl: isShorts
        ? `https://www.youtube.com/shorts/${ytId}`
        : `https://www.youtube.com/watch?v=${ytId}`,
    };
  }

  // 2. Check TikTok
  const ttInfo = extractTikTokVideoInfo(cleanUrl);
  if (ttInfo?.videoId) {
    const ttId = ttInfo.videoId;
    const handle = ttInfo.handle || '';
    const canonical = handle
      ? `https://www.tiktok.com/${handle}/video/${ttId}`
      : cleanUrl;
    return {
      platform: 'tiktok',
      videoId: ttId,
      canonicalUrl: canonical,
      embedPreviewUrl: `https://www.tiktok.com/player/v1/${ttId}?autoplay=1&mute=1&loop=1&controls=0&music_info=0&description=0&rel=0`,
      getEmbedModalUrl: (isMuted: boolean) =>
        `https://www.tiktok.com/player/v1/${ttId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&controls=1&music_info=1&description=1&rel=0`,
      autoPosterUrl: '',
      autoHandle: handle,
      externalWatchUrl: canonical,
    };
  }

  // Check if it's a short TikTok link (e.g. vm.tiktok.com or tiktok.com/t/) that hasn't been resolved yet
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

  // 3. Direct Video File (.mp4, .webm, etc.)
  return {
    platform: 'video',
    videoId: '',
    canonicalUrl: cleanUrl,
    embedPreviewUrl: cleanUrl,
    getEmbedModalUrl: () => cleanUrl,
    autoPosterUrl: '',
    autoHandle: '',
    externalWatchUrl: cleanUrl,
  };
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
 * via backend `/api/social-video/resolve` with client-side oEmbed + regex fallback.
 */
export async function resolveSocialVideoMetadata(rawUrl: string): Promise<ResolvedSocialMetadata> {
  const cleanUrl = (rawUrl || '').trim();
  const initialParsed = parseSocialVideoUrl(cleanUrl);

  if (!cleanUrl) {
    return {
      success: false,
      platform: 'video',
      canonicalUrl: '',
    };
  }

  // 1. Try server-side resolver first (handles vm.tiktok.com redirects + TikTok/YouTube oEmbed)
  try {
    const res = await fetch(`/api/social-video/resolve?url=${encodeURIComponent(cleanUrl)}`);
    if (res.ok) {
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
  } catch {
    // Fall through to client-side oEmbed / regex fallback
  }

  // 2. Client-side oEmbed fallback for TikTok
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

  // 3. Client-side fallback for YouTube
  if (initialParsed.platform === 'youtube') {
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

  return {
    id: item.id || `social-video-${index + 1}`,
    videoUrl: (parsed.canonicalUrl || item.videoUrl || '').trim(),
    handle: formattedHandle,
    title: (item.title || '').trim(),
    posterUrl: (item.posterUrl || parsed.autoPosterUrl || '').trim(),
    platform: item.platform || parsed.platform,
  };
}
