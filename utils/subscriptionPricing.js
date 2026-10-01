const DEFAULT_CURRENCY = 'USD';

const normalizeCountryCode = (countryCode) =>
  typeof countryCode === 'string' ? countryCode.trim().toUpperCase() : '';

const normalizeCurrencyCode = (currencyCode) =>
  typeof currencyCode === 'string' && currencyCode.trim()
    ? currencyCode.trim().toUpperCase()
    : DEFAULT_CURRENCY;

/**
 * Reads the user's country from the Cloudflare-set cookie (synchronous, no external API).
 * Returns the ISO 3166-1 alpha-2 country code (e.g. "NG", "KE") or null if not available.
 */
export const getUserCountryFromCookie = () => {
  if (typeof document === 'undefined') return null; // SSR — no cookie access
  const match = document.cookie.match(/(?:^|;\s*)user_country=([^;]*)/);
  if (match && match[1]) {
    const code = normalizeCountryCode(decodeURIComponent(match[1]));
    return code || null;
  }
  return null;
};

/** @deprecated Use getUserCountryFromCookie() instead — avoids ipapi.co latency and failures */
export const fetchUserCountryCode = async () => {
  const response = await fetch('https://ipapi.co/json/', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Unable to determine user country');
  }

  const data = await response.json();

  return normalizeCountryCode(data?.country_code);
};

export const getLocalizedPricing = (plan, pricingList = [], userCountry) => {
  const normalizedCountry = normalizeCountryCode(userCountry);

  const matchedPricing = pricingList.find(
    (pricing) =>
      pricing?.SubscriptionPlanId === plan?.Id &&
      normalizeCountryCode(pricing?.CountryCode) === normalizedCountry
  );

  return {
    price: matchedPricing?.Price ?? plan?.Price ?? 0,
    currency: normalizeCurrencyCode(matchedPricing?.Currency),
    stripePriceId: matchedPricing?.StripePriceId ?? plan?.StripePriceId ?? '',
    trialDays: plan?.trialPeriodDays ?? plan?.trialDays ?? 0,
  };
};

export const mapSubscriptionPlansWithPricing = ({
  subscriptions = [],
  plans = [],
  pricingList = [],
  userCountry,
}) => {
  const subscriptionNameById = new Map(
    subscriptions.map((subscription) => [subscription.Id, subscription.Name])
  );

  return plans.map((plan) => {
    const localizedPricing = getLocalizedPricing(plan, pricingList, userCountry);

    return {
      ...plan,
      Price: localizedPricing.price,
      Currency: localizedPricing.currency,
      StripePriceId: localizedPricing.stripePriceId,
      trialDays: localizedPricing.trialDays,
      subscriptionName: subscriptionNameById.get(plan.SubscriptionId) || '',
      planName: plan?.Name || '',
      price: localizedPricing.price,
      currency: localizedPricing.currency,
      stripePriceId: localizedPricing.stripePriceId,
    };
  });
};

export const splitSubscriptionPlansByTier = (plans = []) => ({
  standardPlans: plans.filter((plan) => plan.SubscriptionId === 1),
  premiumPlans: plans.filter((plan) => plan.SubscriptionId === 2),
});

export const formatPriceWithCurrency = (price, currency = DEFAULT_CURRENCY) => {
  const amount = Number(price ?? 0);
  const currencyCode = normalizeCurrencyCode(currency);

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};