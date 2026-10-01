/**
 * Currency utility functions for formatting and displaying currency values
 */

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  BRL: 'R$',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  RUB: '₽',
  TRY: '₺',
  MXN: '$',
  ZAR: 'R',
  NGN: '₦',
  KES: 'KSh',
  GHS: '₵',
  EGP: 'E£',
  ARS: '$',
  CLP: 'CLP$',
  COP: 'COL$',
  KRW: '₩',
  SGD: 'S$',
  HKD: 'HK$',
  NZD: 'NZ$',
  ILS: '₪',
  SAR: '﷼',
  AED: 'د.إ',
  QAR: 'ر.ق',
  KWD: 'د.ك',
  OMR: '﷼',
  BHD: '.د.ب',
  PKR: '₨',
  PHP: '₱',
  IDR: 'Rp',
  MYR: 'RM',
  THB: '฿',
  VND: '₫',
  PLN: 'zł',
  HUF: 'Ft',
  CZK: 'Kč',
  RON: 'lei',
  HRK: 'kn',
  BGN: 'лв',
  LKR: '₨',
  TWD: 'NT$',
  MAD: 'د.م',
  TND: 'د.ت',
  DZD: 'دج',
  UAH: '₴',
  UGX: 'USh',
  RWF: 'FRw',
  MZN: 'MTn',
  ZMW: 'ZK',
  BDT: '৳',
  NPR: '₨',
  LBP: 'ل.ل',
  XOF: 'CFA',
  XAF: 'FCFA',
  XPF: 'CFPF',
  KZT: '₸',
  GEL: '₾',
  ISK: 'kr',
  BOB: 'Bs',
  PAB: 'B/.',
  PEN: 'S/',
  BMD: '$',
  BND: 'B$',
  RSD: 'Дин',
  ALL: 'L',
  HNL: 'L',
  JMD: 'J$',
  SLL: 'Le',
  GMD: 'D',
  SYP: '£S',
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  BRL: 'Brazilian Real',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  CHF: 'Swiss Franc',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
  DKK: 'Danish Krone',
  RUB: 'Russian Ruble',
  TRY: 'Turkish Lira',
  MXN: 'Mexican Peso',
  ZAR: 'South African Rand',
  NGN: 'Nigerian Naira',
  KES: 'Kenyan Shilling',
  GHS: 'Ghanaian Cedi',
  EGP: 'Egyptian Pound',
  ARS: 'Argentine Peso',
  CLP: 'Chilean Peso',
  COP: 'Colombian Peso',
  KRW: 'South Korean Won',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  NZD: 'New Zealand Dollar',
  ILS: 'Israeli Shekel',
  SAR: 'Saudi Riyal',
  AED: 'UAE Dirham',
  QAR: 'Qatari Riyal',
  KWD: 'Kuwaiti Dinar',
  OMR: 'Omani Rial',
  BHD: 'Bahraini Dinar',
  PKR: 'Pakistani Rupee',
  PHP: 'Philippine Peso',
  IDR: 'Indonesian Rupiah',
  MYR: 'Malaysian Ringgit',
  THB: 'Thai Baht',
  VND: 'Vietnamese Dong',
  PLN: 'Polish Zloty',
  HUF: 'Hungarian Forint',
  CZK: 'Czech Koruna',
  RON: 'Romanian Leu',
  HRK: 'Croatian Kuna',
  BGN: 'Bulgarian Lev',
  LKR: 'Sri Lankan Rupee',
  TWD: 'New Taiwan Dollar',
  MAD: 'Moroccan Dirham',
  TND: 'Tunisian Dinar',
  DZD: 'Algerian Dinar',
  UAH: 'Ukrainian Hryvnia',
  UGX: 'Ugandan Shilling',
  RWF: 'Rwandan Franc',
  MZN: 'Mozambican Metical',
  ZMW: 'Zambian Kwacha',
  BDT: 'Bangladeshi Taka',
  NPR: 'Nepalese Rupee',
  LBP: 'Lebanese Pound',
  XOF: 'West African CFA Franc',
  XAF: 'Central African CFA Franc',
  XPF: 'CFP Franc',
  KZT: 'Kazakhstani Tenge',
  GEL: 'Georgian Lari',
  ISK: 'Icelandic Krona',
  BOB: 'Bolivian Boliviano',
  PAB: 'Panamanian Balboa',
  PEN: 'Peruvian Sol',
  BMD: 'Bermudian Dollar',
  BND: 'Brunei Dollar',
  RSD: 'Serbian Dinar',
  ALL: 'Albanian Lek',
  HNL: 'Honduran Lempira',
  JMD: 'Jamaican Dollar',
  SLL: 'Sierra Leonean Leone',
  GMD: 'Gambian Dalasi',
  SYP: 'Syrian Pound',
};

/**
 * Get the currency symbol for a given currency code
 * @param currencyCode - Three-letter currency code (e.g., 'USD', 'GBP')
 * @returns Currency symbol or the code itself if not found
 */
export function getCurrencySymbol(currencyCode: string | undefined | null): string {
  if (!currencyCode) return '$'; // Default to USD
  return CURRENCY_SYMBOLS[currencyCode.toUpperCase()] || currencyCode;
}

/**
 * Format a currency value with the appropriate symbol
 * @param value - The numeric value to format
 * @param currencyCode - Three-letter currency code
 * @returns Formatted currency string (e.g., '$1,000' or '£500')
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currencyCode?: string | null
): string {
  if (value === null || typeof value === 'undefined' || value === '') return 'N/A';
  
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(num)) return 'N/A';
  
  const symbol = getCurrencySymbol(currencyCode || 'USD');
  return `${symbol}${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/**
 * Get currency name
 * @param currencyCode - Three-letter currency code
 * @returns Currency name or code if not found
 */
export function getCurrencyName(currencyCode: string | undefined | null): string {
  if (!currencyCode) return 'US Dollar';
  return CURRENCY_NAMES[currencyCode.toUpperCase()] || currencyCode;
}
