/** Extract YouTube video ID from all common URL formats */
export const extractYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/** Get the best-quality YouTube thumbnail from a video ID */
export const getYouTubeThumbnail = (videoId) =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

/** Get the YouTube embed URL for iframe use */
export const getYouTubeEmbedUrl = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

/** Extract Google Drive file ID from a share/view/edit link */
export const extractGDriveId = (url) => {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

/** Get a Google Drive embed URL for iframe preview */
export const getGDriveEmbedUrl = (fileId) =>
  `https://drive.google.com/file/d/${fileId}/preview`;

/** Derive thumbnail URL automatically based on videoType and videoUrl */
export const getAutoThumbnail = (videoType, videoUrl) => {
  if (videoType === 'youtube') {
    const id = extractYouTubeId(videoUrl);
    return id ? getYouTubeThumbnail(id) : null;
  }
  return null;
};

/** Return the URL to use for the embed iframe given videoType + videoUrl */
export const getEmbedUrl = (videoType, videoUrl) => {
  if (videoType === 'youtube') {
    const id = extractYouTubeId(videoUrl);
    return id ? getYouTubeEmbedUrl(id) : null;
  }
  if (videoType === 'gdrive') {
    const id = extractGDriveId(videoUrl);
    return id ? getGDriveEmbedUrl(id) : videoUrl;
  }
  return null;
};
