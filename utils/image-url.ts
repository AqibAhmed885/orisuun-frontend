const USER_PROFILE_BLOB_BASE_URL =
  'https://orisuundocumentsdev.blob.core.windows.net/user-profile';

const INVALID_IMAGE_VALUES = new Set(['null', 'undefined', '']);

/**
 * Convert the image shapes returned by the API into a valid next/image src.
 * Upload endpoints store only the Azure filename, while older records may
 * already contain an absolute URL or a public-root path.
 */
export const resolveUserProfileImageSrc = (
  value?: string | null,
  fallback: string | null = null
): string | null => {
  const source = typeof value === 'string' ? value.trim() : '';

  if (INVALID_IMAGE_VALUES.has(source.toLowerCase())) {
    return fallback;
  }

  if (/^(data:image\/|blob:)/i.test(source) || source.startsWith('/')) {
    return source;
  }

  if (source.startsWith('//')) {
    return `https:${source}`;
  }

  if (/^https?:\/\//i.test(source)) {
    try {
      return new URL(source).toString();
    } catch {
      return fallback;
    }
  }

  // Do not reinterpret malformed/unsupported schemes as Azure filenames.
  if (/^[a-z][a-z\d+.-]*:/i.test(source)) {
    return fallback;
  }

  const filename = source
    .replace(/^\/+/, '')
    .replace(/^user-profile\//i, '');

  return `${USER_PROFILE_BLOB_BASE_URL}/${encodeURI(filename).replace(/#/g, '%23')}`;
};
