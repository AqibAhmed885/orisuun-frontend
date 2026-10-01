import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import CryptoJS from 'crypto-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (process.env.NODE_ENV === 'development') {
    return `${process.env.NEXT_PUBLIC_APP_BASE_URL}${path}`;
  } else {
    return `${process.env.APP_BASE_URL}${path}`;
  }
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// This should be a long, random string. Store it securely and never expose it.
const SECRET_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-secret-key';

export const encryptData = (data: string): string => {
  const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY);
  return encrypted.toString();
};

export const decryptData = (encryptedData: string): string => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const encryptObjectToQueryParams = (
  obj: Record<string, string>
): string => {
  const jsonString = JSON.stringify(obj);
  const encrypted = encryptData(jsonString);
  return encodeURIComponent(encrypted);
};

export const decryptQueryParamsToObject = (
  queryString: string
): Record<string, string> => {
  const decrypted = decryptData(decodeURIComponent(queryString));
  return JSON.parse(decrypted);
};

export const capitalizeWords = (str: string): string => {
  return str
    ?.split(' ')
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    ?.join(' ');
};

export const getProfileTypeCategory = (
  profileType:
    | 'Expert'
    | 'Strategy Consultants'
    | 'Advocate'
    | 'Professional'
    | 'Mentor'
    | 'Black-owned Business'
    | 'partner'
    | 'Investor'
) => {
  const businessTypes = new Set([
    'Black-owned Business',
    'partner',
    'Investor',
  ]);

  return businessTypes.has(profileType) ? 'Business' : 'Individual';
};

export const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

export function formatFileSize(bytes: string): string {
  if (!bytes) {
    return 'Unknown';
  }

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const factor = 1024;

  let size = Number(bytes);
  let unitIndex = 0;

  // Determine the appropriate unit
  while (size >= factor && unitIndex < units.length - 1) {
    size /= factor;
    unitIndex++;
  }

  // Format to two decimal places for readability
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function formatFileName(str: string): string {
  try {
    if (!str) {
      return 'Unknown';
    }
    const maxLength = 15; // Define the maximum length of the visible portion
    const extension = str.split('.').pop(); // Get the file extension (e.g., "zip")
    const base = str.split('.')[0]; // Get the base string without the extension

    // Truncate the base string and add ellipsis
    const truncatedBase =
      base.length > maxLength ? base.slice(0, maxLength) + '....' : base;

    return truncatedBase + '.' + extension;
  } catch (error) {
    return 'Unknown';
  }
}

export const renderLocation = (countryOfOrigin: string, city: string) => {
  let location = '';
  if (countryOfOrigin || city) {
    if (countryOfOrigin) location = countryOfOrigin;
    if (city) location += `, ${city}`;
  } else {
    location = 'Unkown';
  }
  return location;
};
