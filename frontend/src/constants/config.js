import Config from 'react-native-config';

export const BACKEND_API_URL = Config.BACKEND_API_URL || '';

// The server root (drops a trailing "/api"), used for media and other non-API URLs.
export const BACKEND_ORIGIN = BACKEND_API_URL.replace(/\/api\/?$/, '');

/**
 * Turn a stored media path ("account_photos/19.jpg") into a full URL the
 * <Image> component can load. Values that are already absolute
 * (http(s)/file/content/data) are returned unchanged.
 */
export function mediaUrl(path) {
  if (!path) return null;
  if (/^(https?|file|content|data):/i.test(path)) return path;
  const clean = String(path)
    .replace(/^\/+/, '')
    .replace(/^media\//, '');
  return `${BACKEND_ORIGIN}/media/${clean}`;
}
