// Restrict sitemap generation strictly to marketing pages.
// All other discovered routes are excluded via transform returning null.
const marketingPages = new Set([
  '/',
  '/calendar',
  '/resources',
  '/pricing',
  '/fund',
  // Member Types
  '/black-owned-businesses',
  '/mentors',
  '/experts',
  '/investors',
  '/professionals',
  '/partners',
  '/strategy-consultants',
  '/advocates',
  // Features
  '/find-black-owned-businesses',
  '/business-discount-club',
  '/partners-discount-club',
  '/your-strategist-practice',
  '/weekly-funding',
  '/community-rooms',
  '/team-formation',
  '/find-a-cofounder',
  '/find-a-board-member',
  '/business-development-opportunities',
  '/crowdfunding',
  // Booking Marketing Pages
  '/book-an-expert',
  '/consultant-booking',
  '/professional-booking',
  '/mentor-booking',
  '/investor-booking',
  '/bob-booking',
  // Company
  '/about',
  '/founder',
  '/what-we-offer',
  '/how-you-can-help-us',
  '/feedback',
  '/contact',
  '/insights',
  // Compliance / Footer
  '/signup',
  '/signin',
  '/privacy',
  '/terms',
]);

module.exports = {
  siteUrl: 'https://orisuun.com', // remove www
  generateRobotsTxt: true,
  changefreq: 'daily',
  // Remove unnecessary XML namespaces (news, xhtml, mobile, image, video)
  additionalSitemaps: [
    'https://orisuun.com/sitemap-index.xml',
  ],
  // Disable extra XML namespaces to keep sitemap clean
  generateIndexSitemap: false,
  // Provide a broad exclude list for known non-marketing areas (defensive; transform handles the rest).
  exclude: [
    '/forgot-password',
    '/reset-password',
    '/payment',
    '/admin-blogs',
    '/admin-chats',
    '/calendar-events',
    '/fundraising',
    '/fundraising/*',
    '/marketing-feedback',
    '/opportunity-posts',
    '/profile-verification',
    '/view-profiles',
    '/settings',
    '/teams',
    '/resources-management',
    '/reports',
    '/signin',
    '/signup',
    '/communities',
    '/feedback-and-reviews',
    '/universal',
    '/professional-invite',
    '/join-the-movement',
    '/black-owned-businesses',
    '/professional',
    '/expert',
    '/mentor',
    '/strategy-consultants',
    '/partner',
    '/investor',
    '/advocate',
    '/payment',
  ],
  // Only output marketing pages.
  transform: async (config, path) => {
    // path already begins with '/'
    if (!marketingPages.has(path)) return null;
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === '/' ? 1 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },
  // Add dynamic userType routes and explicit marketing pages that may not be discovered automatically
  additionalPaths: async (config) => {
    const userTypes = [
      'black-owned-businesses',
      'professionals',
      'experts',
      'mentors',
      'strategy-consultants',
      'partners',
      'investors',
      'advocates',
    ];

    const explicitMarketing = [
      'find-black-owned-businesses',
      'find-black-owned-restaurants',
      'black-business-hub',
      'invest-in-black-innovation',
    ];
    
    const userTypePaths = userTypes.map(userType => ({
      loc: `/${userType}`,
      changefreq: config.changefreq,
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));

    const explicitPaths = explicitMarketing.map(p => ({
      loc: `/${p}`,
      changefreq: config.changefreq,
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));

    return [...userTypePaths, ...explicitPaths];
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://orisuun.com/sitemap-index.xml',
    ],
  },
};
