const PDF_QUERY_PARAM_KEYS = ['b', 'type', 'format', 'filetype', 'contenttype', 'mime', 'ext'];

export const isPdfUrl = (url?: string | null) => {
  if (!url) return false;

  const normalized = url.trim().toLowerCase();
  if (!normalized) return false;

  if (/^data:application\/pdf[;,]/.test(normalized)) return true;
  if (normalized.includes('application/pdf')) return true;

  try {
    const parsed = new URL(url, 'https://staging.orisuun.com');
    if (parsed.pathname.toLowerCase().endsWith('.pdf')) return true;

    return PDF_QUERY_PARAM_KEYS.some((key) => {
      const value = parsed.searchParams.get(key);
      return Boolean(value && value.toLowerCase().includes('pdf'));
    });
  } catch {
    return /(\.pdf)(?:$|[?#])|(?:[?&](?:b|type|format|filetype|contenttype|mime|ext)=[^&#]*pdf)/i.test(url);
  }
};

export const buildPdfProxyUrl = (url?: string | null) => {
  if (!url) return '';

  const normalized = url.trim();
  if (!normalized) return '';

  if (/^(blob:|data:)/i.test(normalized)) {
    return normalized;
  }

  return `/api/pdf-proxy?url=${encodeURIComponent(normalized)}`;
};
