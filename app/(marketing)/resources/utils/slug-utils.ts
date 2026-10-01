/**
 * Utility functions for URL slug handling in the resources section.
 * 
 * This module provides:
 * - Slug generation (from names to URL-safe strings)
 * - Slug parsing (from URLs to structured data)
 * - Path generation for different navigation levels
 */

// Resource types that can be accessed directly via /resources/{type}
export const RESOURCE_TYPE_SLUGS: Record<string, number> = {
  'competitions': 1,
  'accelerators': 2,
  'grants': 3,
  'government-programs': 4,
  'school-programs': 5,
  'ngo-programs': 7,
  'specialty-financing': 8,
  'explore-by-city': 0,
};

export const RESOURCE_TYPE_NAMES: Record<number, string> = {
  1: 'Competitions',
  2: 'Accelerators',
  3: 'Grants',
  4: 'Government Programs',
  5: 'School Programs',
  7: 'NGO Programs',
  8: 'Specialty Financing',
  0: 'Explore resources by city',
};

/**
 * Converts a string to a URL-safe slug.
 * - Converts to lowercase
 * - Replaces spaces and special chars with hyphens
 * - Removes multiple consecutive hyphens
 */
export function toSlug(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Remove multiple consecutive hyphens
    .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens
}

/**
 * Converts a slug back to a display name (for matching against API data).
 * Note: This is an approximation; real matching should be done against API data.
 */
export function fromSlug(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Represents the parsed navigation state from a URL.
 */
export interface ResourcesNavigationState {
  type: 'base' | 'resource-type' | 'region' | 'country' | 'state' | 'city';
  resourceTypeSlug?: string;
  resourceTypeId?: number;
  regionSlug?: string;
  countrySlug?: string;
  stateSlug?: string;
  citySlug?: string;
  slugs: string[];
}

/**
 * Parses a URL slug array into a navigation state.
 * 
 * Routes:
 * - /resources -> base (tabs view)
 * - /resources/grants -> resource-type view
 * - /resources/asia -> region view (countries list)
 * - /resources/asia/pakistan -> country view (states/cities list)
 * - /resources/asia/pakistan/punjab -> state view (cities list)
 * - /resources/asia/pakistan/punjab/attock -> city view (resources list)
 */
export function parseResourcesSlugs(slugs: string[]): ResourcesNavigationState {
  if (!slugs || slugs.length === 0) {
    return { type: 'base', slugs: [] };
  }

  const firstSlug = slugs[0].toLowerCase();
  
  // Check if first slug is a resource type
  if (RESOURCE_TYPE_SLUGS.hasOwnProperty(firstSlug)) {
    return {
      type: 'resource-type',
      resourceTypeSlug: firstSlug,
      resourceTypeId: RESOURCE_TYPE_SLUGS[firstSlug],
      slugs,
    };
  }

  // Otherwise, it's a geographic hierarchy: region/country/state/city
  switch (slugs.length) {
    case 1:
      return {
        type: 'region',
        regionSlug: slugs[0],
        slugs,
      };
    case 2:
      return {
        type: 'country',
        regionSlug: slugs[0],
        countrySlug: slugs[1],
        slugs,
      };
    case 3:
      return {
        type: 'state',
        regionSlug: slugs[0],
        countrySlug: slugs[1],
        stateSlug: slugs[2],
        slugs,
      };
    case 4:
    default:
      return {
        type: 'city',
        regionSlug: slugs[0],
        countrySlug: slugs[1],
        stateSlug: slugs[2],
        citySlug: slugs[3],
        slugs,
      };
  }
}

/**
 * Generates a URL path for the resources section.
 */
export function generateResourcesPath(segments: string[]): string {
  const slugifiedSegments = segments.map(toSlug).filter(Boolean);
  if (slugifiedSegments.length === 0) {
    return '/resources';
  }
  return `/resources/${slugifiedSegments.join('/')}`;
}

/**
 * Generates breadcrumb items from the current navigation state.
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
}

export function generateBreadcrumbs(
  navState: ResourcesNavigationState,
  resolvedNames: {
    region?: string;
    country?: string;
    state?: string;
    city?: string;
    resourceType?: string;
  }
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Resources', href: '/resources', isCurrent: navState.type === 'base' },
  ];

  if (navState.type === 'resource-type') {
    breadcrumbs.push({
      label: resolvedNames.resourceType || fromSlug(navState.resourceTypeSlug || ''),
      href: generateResourcesPath([navState.resourceTypeSlug || '']),
      isCurrent: true,
    });
    return breadcrumbs;
  }

  // Geographic hierarchy
  if (navState.regionSlug) {
    breadcrumbs.push({
      label: resolvedNames.region || fromSlug(navState.regionSlug),
      href: generateResourcesPath([navState.regionSlug]),
      isCurrent: navState.type === 'region',
    });
  }

  if (navState.countrySlug) {
    breadcrumbs.push({
      label: resolvedNames.country || fromSlug(navState.countrySlug),
      href: generateResourcesPath([navState.regionSlug!, navState.countrySlug]),
      isCurrent: navState.type === 'country',
    });
  }

  if (navState.stateSlug) {
    breadcrumbs.push({
      label: resolvedNames.state || fromSlug(navState.stateSlug),
      href: generateResourcesPath([navState.regionSlug!, navState.countrySlug!, navState.stateSlug]),
      isCurrent: navState.type === 'state',
    });
  }

  if (navState.citySlug) {
    breadcrumbs.push({
      label: resolvedNames.city || fromSlug(navState.citySlug),
      href: generateResourcesPath([navState.regionSlug!, navState.countrySlug!, navState.stateSlug!, navState.citySlug]),
      isCurrent: navState.type === 'city',
    });
  }

  return breadcrumbs;
}

/**
 * Matches a slug against a list of API items to find the corresponding ID and name.
 */
export function matchSlugToItem<T extends { id: number; name: string }>(
  slug: string,
  items: T[]
): T | null {
  if (!slug || !items || items.length === 0) return null;
  
  const normalizedSlug = slug.toLowerCase();
  
  // First try exact slug match
  const exactMatch = items.find(item => toSlug(item.name) === normalizedSlug);
  if (exactMatch) return exactMatch;
  
  // Try partial match (for cases where API names might differ slightly)
  const partialMatch = items.find(item => {
    const itemSlug = toSlug(item.name);
    return itemSlug.includes(normalizedSlug) || normalizedSlug.includes(itemSlug);
  });
  
  return partialMatch || null;
}
