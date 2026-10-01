// Utility function to generate structured data for user type pages

interface UserTypeStructuredData {
  userType: string;
  displayName: string;
  description: string;
}

const userTypeConfigs: Record<string, UserTypeStructuredData> = {
  'black-owned-businesses': {
    userType: 'black-owned-businesses',
    displayName: 'Black-Owned Businesses',
    description: 'Orisuun helps Black-owned businesses get found, get funded, and grow faster by connecting them to customers, collaborators, and investors.',
  },
  'professionals': {
    userType: 'professionals',
    displayName: 'Professionals',
    description: 'Professional services providers helping Black-owned businesses grow through specialized expertise in regulated fields such as law, accounting, IT, and more.',
  },
  'experts': {
    userType: 'experts',
    displayName: 'Experts',
    description: 'Subject matter experts providing specialized knowledge and insights to Black-owned businesses within the Orisuun ecosystem.',
  },
  'mentors': {
    userType: 'mentors',
    displayName: 'Mentors',
    description: 'Experienced business mentors sharing lived experience, insight, and practical guidance to support growing Black-owned businesses.',
  },
  'strategy-consultants': {
    userType: 'strategy-consultants',
    displayName: 'Strategy Consultants',
    description: 'Strategic advisors providing expert guidance to help Black-owned businesses develop and execute growth strategies.',
  },
  'partners': {
    userType: 'partners',
    displayName: 'Partners',
    description: 'Business partners creating client relationships, offering vendor services, and collaborating with growing Black-owned businesses.',
  },
  'investors': {
    userType: 'investors',
    displayName: 'Investors',
    description: 'Investors discovering opportunities, building relationships, and cultivating exclusive deal flow with Black-owned businesses.',
  },
  'advocates': {
    userType: 'advocates',
    displayName: 'Advocates',
    description: 'Supporters of Black-owned businesses providing advocacy, patronage, and investment to help businesses grow and thrive.',
  },
};

export function generateUserTypeStructuredData(userType: string) {
  const config = userTypeConfigs[userType];
  
  if (!config) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://orisuun.com/#organization',
        name: 'Orisuun',
        url: 'https://orisuun.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://orisuun.com/logo.svg',
        },
        description:
          'Orisuun is a community-driven platform connecting Black-owned businesses with investors, mentors, clients, and professionals to fuel growth and opportunity',
        sameAs: [
          'https://www.linkedin.com/company/orisuun',
          'https://www.instagram.com/orisuun/',
          'https://www.youtube.com/@orisuun',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://orisuun.com/#website',
        url: 'https://orisuun.com',
        name: 'Orisuun',
        publisher: {
          '@id': 'https://orisuun.com/#organization',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://orisuun.com/#service',
        name: 'Orisuun Membership',
        description:
          'Membership access to the Orisuun community-driven platform and ecosystem.',
        provider: {
          '@id': 'https://orisuun.com/#organization',
        },
      },
      {
        '@type': 'Audience',
        '@id': `https://orisuun.com/${config.userType}#audience`,
        name: config.displayName,
        audienceType: config.displayName,
      },
      {
        '@type': 'WebPage',
        '@id': `https://orisuun.com/${config.userType}#webpage`,
        url: `https://orisuun.com/${config.userType}`,
        name: `Orisuun | ${config.displayName}`,
        description: config.description,
        isPartOf: {
          '@id': 'https://orisuun.com/#website',
        },
        about: {
          '@id': 'https://orisuun.com/#service',
        },
        audience: {
          '@id': `https://orisuun.com/${config.userType}#audience`,
        },
        potentialAction: {
          '@type': 'RegisterAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://orisuun.com/signup',
          },
          object: {
            '@id': 'https://orisuun.com/#service',
          },
        },
      },
    ],
  };
}

interface PublicProfileStructuredData {
  username: string;
  name: string;
  description: string;
  profileType?: string;
  image?: string;
  jobTitle?: string;
  website?: string;
  socialUrls?: string[];
}

export function generatePublicProfileStructuredData({
  username,
  name,
  description,
  profileType,
  image,
  jobTitle,
  website,
  socialUrls = [],
}: PublicProfileStructuredData) {
  const pageUrl = `https://orisuun.com/${encodeURIComponent(username)}`;
  const isBusiness = profileType?.toLowerCase().includes('business');
  const entityId = `${pageUrl}#${isBusiness ? 'organization' : 'person'}`;
  const sameAs = [website, ...socialUrls].filter(
    (url): url is string => Boolean(url && /^https?:\/\//i.test(url))
  );

  const profileEntity = isBusiness
    ? {
        '@type': 'Organization',
        '@id': entityId,
        name,
        url: pageUrl,
        description,
        ...(image && { image, logo: image }),
        ...(sameAs.length > 0 && { sameAs }),
        memberOf: { '@id': 'https://orisuun.com/#organization' },
      }
    : {
        '@type': 'Person',
        '@id': entityId,
        name,
        url: pageUrl,
        description,
        ...(jobTitle && { jobTitle }),
        ...(image && { image }),
        ...(sameAs.length > 0 && { sameAs }),
        memberOf: { '@id': 'https://orisuun.com/#organization' },
      };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://orisuun.com/#organization',
        name: 'Orisuun',
        url: 'https://orisuun.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://orisuun.com/logo.svg',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://orisuun.com/#website',
        url: 'https://orisuun.com',
        name: 'Orisuun',
        publisher: { '@id': 'https://orisuun.com/#organization' },
      },
      profileEntity,
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${name} | Orisuun Member Profile`,
        description,
        isPartOf: { '@id': 'https://orisuun.com/#website' },
        mainEntity: { '@id': entityId },
        ...(image && { primaryImageOfPage: { '@type': 'ImageObject', url: image } }),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://orisuun.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
