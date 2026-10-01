import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Cookies from 'js-cookie';
import { add2040ToProfileDetailsId } from './utils/profile.helpers';
import { checkRoutePermission, getUserPermissions, getFirstAccessibleRoute } from './utils/middleware-permissions';
import {
  getSubscriptionTier,
  isAdminUser,
  isPremiumOnlyPath,
} from './utils/freeTierSidebar';

// List of bot user agents to block
const botUserAgents = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
  'sogou', 'exabot', 'ia_archiver', 'facebookbot', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'discordbot', 'slackbot', 'pinterestbot',
  'gptbot', 'chatgpt-user', 'ccbot', 'anthropic-ai', 'claude-web', 'cohere-ai',
  'omgilibot', 'diffbot', 'bytespider', 'imagesiftbot', 'applebot', 'amazonbot',
  'perplexitybot', 'youbot', 'google-extended', 'semrushbot', 'ahrefsbot',
  'dotbot', 'mj12bot', 'blexbot', 'dataforseobot', 'scrapy', 'python-requests',
  'curl', 'wget', 'httpclient', 'axios', 'go-http-client', 'okhttp', 'java',
  'headlesschrome', 'phantomjs', 'selenium', 'puppeteer', 'playwright',
];

// Function to detect bots
function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return botUserAgents.some(bot => ua.includes(bot));
}

// List of protected routes
const protectedRoutes = [
  '/dashboard',
  '/settings',
  '/settings/teamprofile/:teamId',
  '/add-user',
  '/chats',
  '/connections',
  '/explore',
  '/favourites',
  '/followers',
  '/my-profiles',
  '/profile',
  '/profile/new-profile',
  '/profile/:id',
  '/notifications',
  '/saved-resources',
  '/subscription-plan',
  '/new-dashboard',
  '/fundraising',
  '/business-development',
  '/business-development/create',
  '/verification',
  '/discount-portal',
  '/discount-portal/create',
  '/discount-portal/discount',
  '/post-search',
  '/business-development',
  '/cofounder-and-board-matcher',
  '/cofounder-and-board-matcher/create-new',
  '/cofounder',
  '/cofounder/create-new',
  '/profile-search',
  '/dispute-page',
  '/dispute-page/:id',
  '/transactions-and-escrow',
  '/transactions-and-escrow/:id',
  '/transactions-and-escrow/contract/new-contract',
  '/reports',
  '/post-search/search-results',
  '/profile-search/search-results',
  '/feedback-and-reviews',
  '/leaderboard',
  '/calendar-events',
  '/booking',
  '/marketing-feedback',
  '/opportunity-posts',
  '/fundraising/view-all-fundraisings',
  '/profile-verification',
  '/view-profiles',
  '/universal',
  '/resources-management',
  '/teams',
  '/communities',
  '/reward',
  '/admin-chats',
  '/admin-blogs',
  '/admin-accounts',
];

// Admin routes that need admin role (UserProfileTypeId === 10 or UserProfileTypeId === 9)
const adminOnlyRoutes = ['/admin-chats', '/admin-blogs', '/admin-accounts'];

const profileRoutes = [
  '/profile',
  '/profile/new-profile',
  '/profile/edit-profile',
];

// List of protected routes with conditions
const protectedRoutesWithConditions = [
  {
    path: '/discount-portal/create',
    condition: (currentUser: any) =>
      currentUser?.UserProfileTypeId === 5 ||
      currentUser?.UserProfileTypeId === 10 ||
      (currentUser?.UserProfileTypeId === 1 && currentUser?.isVerified === 1),
  },
  {
    path: '/discount-portal/discount',
    condition: (currentUser: any) =>
      currentUser?.UserProfileTypeId === 5 ||
      currentUser?.UserProfileTypeId === 10 ||
      (currentUser?.UserProfileTypeId === 1 && currentUser?.isVerified === 1),
  },
  {
    path: '/discount-portal',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId !== 5,
  },
  {
    path: '/dispute-page',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/reports',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/dispute-page/:id', // Added dynamic route with condition
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/business-development',
    condition: (currentUser: any) =>
      getSubscriptionTier(currentUser) === 'premium',
  },
  {
    path: '/business-development/create',
    condition: (currentUser: any) =>
      getSubscriptionTier(currentUser) === 'premium',
  },
  {
    path: '/cofounder-and-board-matcher',
    condition: (currentUser: any) =>
      getSubscriptionTier(currentUser) === 'premium',
  },
  {
    path: '/cofounder-and-board-matcher/create-new',
    condition: (currentUser: any) =>
      getSubscriptionTier(currentUser) === 'premium',
  },
  {
    path: '/cofounder',
    condition: (teamData: any) =>
      teamData?.isActive && teamData?.isPremium
  },
  {
    path: '/cofounder/create-new',
    condition: (teamData: any) =>
      teamData?.isActive && teamData?.isPremium
  },
  {
    path: '/fundraising',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId !== 10,
  },
  {
    path: '/transactions-and-escrow',
    condition: (currentUser: any) =>
      getSubscriptionTier(currentUser) === 'premium' &&
      currentUser?.UserProfileTypeId !== 4,
  },
  {
    path: '/transactions-and-escrow/:id',
    condition: (currentUser: any) =>
      getSubscriptionTier(currentUser) === 'premium' &&
      currentUser?.UserProfileTypeId !== 4,
  },
  {
    path: '/transactions-and-escrow/contract/new-contract',
    condition: (currentUser: any) =>
      getSubscriptionTier(currentUser) === 'premium' &&
      currentUser?.UserProfileTypeId !== 4,
  },
  {
    path: '/add-user',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/profile-verification',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/view-profiles',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/admin-chats',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/admin-blogs',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/admin-accounts',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/marketing-feedback',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/calendar-events',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/opportunity-posts',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/fundraising/view-all-fundraisings',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/resources-management',
    condition: (currentUser: any) => currentUser?.UserProfileTypeId === 10 || currentUser?.UserProfileTypeId === 9,
  },
  {
    path: '/booking',
    condition: (currentUser: any) =>
      getSubscriptionTier(currentUser) === 'premium' ||
      [2, 3, 6, 7, 8, 9].includes(Number(currentUser?.UserProfileTypeId)),
  }
];

function isAuthenticated(request: any) {
  const token = request.cookies.get('token')?.value;
  const userData = request.cookies.get('userData')?.value;
  // Also check for NextAuth session cookie (for OAuth signup flow)
  const nextAuthSession = request.cookies.get('next-auth.session-token')?.value || 
                          request.cookies.get('__Secure-next-auth.session-token')?.value;
  
  // For free tier users, they might not have a token yet but should still be authenticated
  // if they just signed up (check for userData cookie which is always set after signup)
  const isFreeUser = userData && !token;
  
  return (token && userData) || nextAuthSession || isFreeUser;
}

function isProfileComplete(request: any) {
  let userData = request.cookies.get('userData')?.value;
  userData = JSON.parse(userData);
  return userData.isProfileComplete;
}

function getCurrentUser(request: any) {
  try {
    const userData = request.cookies.get('userData')?.value;
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

function getCurrentTeam(request: any) {
  try {
    const teamData = request.cookies.get('teamData')?.value;
    return teamData ? JSON.parse(teamData) : null;
  } catch (error) {
    console.error('Error parsing team data:', error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const currentPath = url.pathname;

  const userAgent = request.headers.get('user-agent') || '';

  // Bypass middleware entirely for SEO files so they remain untouched
  const isSeoFile = /^\/sitemap(?:.*)?\.xml$/i.test(currentPath) || currentPath === '/robots.txt';
  if (isSeoFile) {
    // Let Next.js serve sitemap and robots.txt without middleware interference
    return NextResponse.next();
  }

  // Check if the current route matches any protected route (including dynamic segments)
  let isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  // Block bots and scrapers, but allow known search engine crawlers on public pages
  if (isBot(userAgent)) {
    const isSearchEngineBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|applebot/i.test(userAgent);
    if (!isSearchEngineBot || isProtectedRoute) {
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  // Add security headers to prevent scraping and indexing
  const response = NextResponse.next();

  // Detect user's country from Cloudflare header and set as cookie
  const cfCountry = request.headers.get('CF-IPCountry') || request.headers.get('cf-ipcountry');
  if (cfCountry && cfCountry !== 'XX') { // XX means Cloudflare couldn't determine the country
    response.cookies.set('user_country', cfCountry.toUpperCase(), {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
    });
  } 

  // Authenticated application pages must stay out of search results. Public
  // marketing and member-profile routes are intentionally crawlable.
  if (isProtectedRoute) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, notranslate, noimageindex');
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Prevent caching of sensitive pages
  response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  // isProtectedRoute computed earlier (bypassed here to avoid re-definition)

  // Free tier public routes should NOT require authentication
  const isFreeTierPublicRoute = currentPath.startsWith('/free/signup') ||
    currentPath.startsWith('/free/signup-thank-you') ||
    currentPath.startsWith('/free/weekly-funding') ||
    currentPath.startsWith('/free/weekly-small-business-funding') ||
    currentPath.startsWith('/free/weekly-startups-funding');

  if (isFreeTierPublicRoute) {
    // Allow public access to free tier marketing and signup pages
    return response;
  }

  if (isProtectedRoute) {
    if (!isAuthenticated(request)) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Check authorization for protected routes with conditions
    const currentUser = getCurrentUser(request);
    const currentTeam = getCurrentTeam(request);

    // Subscription permissions are enforced here as well as in the UI so a
    // free member cannot open a premium route directly by typing its URL.
    const isPremiumTeamCofounderRoute =
      (currentPath === '/cofounder' || currentPath.startsWith('/cofounder/')) &&
      currentTeam?.isActive &&
      currentTeam?.isPremium;

    if (
      !isAdminUser(currentUser) &&
      isPremiumOnlyPath(currentPath) &&
      getSubscriptionTier(currentUser) !== 'premium' &&
      !isPremiumTeamCofounderRoute
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const isProfileRoute = profileRoutes.some((route) =>
      currentPath.startsWith(route)
    );

    // Skip profile completion check for free tier users
    // Free tier users might not have complete profiles but should still access dashboard
    const isFreeUser = getSubscriptionTier(currentUser) === 'free';
    
    if (!isFreeUser &&
      !isProfileRoute &&
      currentUser?.UserProfileTypeId != 10 &&
      currentUser?.UserProfileTypeId != 9 &&
      (!currentUser.isProfileComplete || !currentUser.isBasicProfileDetailExist)
    ) {
      let redirectPath = !currentUser.isBasicProfileDetailExist
        ? '/profile/new-profile'
        : `/profile/edit-profile/${add2040ToProfileDetailsId(
          currentUser.UserProfileDetailsId
        )}`;
      return NextResponse.redirect(new URL(redirectPath, request.url));
    } else if (
      isProfileRoute &&
      currentUser.isProfileComplete &&
      currentPath.startsWith(`/profile/new-profile`)
    ) {
      return NextResponse.redirect(
        new URL(
          new URL(
            `/profile/${add2040ToProfileDetailsId(
              currentUser.UserProfileDetailsId
            )}`,
            request.url
          )
        )
      );
    }

    const matchingConditionRoute = protectedRoutesWithConditions.find(
      (route) => {
        const regex = new RegExp(
          `^${route.path.replace(/:[^\s/]+/g, '[^/]+')}$`
        );
        return regex.test(currentPath);
      }
    );

    if (matchingConditionRoute) {
      const context = (currentTeam?.isActive && (matchingConditionRoute.path.includes('cofounder') || matchingConditionRoute.path.includes('cofounder/create-new')))
        ? currentTeam
        : currentUser;

      if (!matchingConditionRoute.condition(context)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Additional permission check for admin routes (UserProfileTypeId 9 or 10)
    if (currentUser?.UserProfileTypeId === 9 || currentUser?.UserProfileTypeId === 10) {
      const userPermissions = getUserPermissions(currentUser);

      // Check if user has permission to access this route
      if (!checkRoutePermission(currentPath, currentUser)) {
        // Redirect to first accessible route or signin
        const firstRoute = getFirstAccessibleRoute(userPermissions);
        if (firstRoute && firstRoute !== currentPath) {
          return NextResponse.redirect(new URL(firstRoute, request.url));
        } else if (!firstRoute) {
          return NextResponse.redirect(new URL('/signin', request.url));
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/signup/:path*',
    '/free/signup/:path*',
    '/free/signup-thank-you/:path*',
    '/payments/:path*',
    '/dashboard/:path*',
    '/add-user/:path*',
    '/chats/:path*',
    '/connections/:path*',
    '/explore/:path*',
    '/favourites/:path*',
    '/followers/:path*',
    '/my-profiles/:path*',
    '/profile/:path*',
    '/notifications/:path*',
    '/saved-resources/:path*',
    '/subscription-plan/:path*',
    '/new-dashboard/:path*',
    '/booking',
    '/fundraising/:path*',
    '/business-development/:path*',
    '/verification/:path*',
    '/discount-portal/:path*',
    '/discount-portal/create',
    '/cofounder-and-board-matcher/create-new',
    '/cofounder-and-board-matcher/:path*',
    '/cofounder/:path*',
    '/post-search/:path*',
    '/profile-search/:path*',
    '/dispute-page/:path*',
    '/transactions-and-escrow/:path*',
    '/reports',
    '/settings',
    '/settings/teamprofile/:path*',
    '/feedback-and-reviews',
    '/leaderboard',
    '/marketing-feedback',
    '/calendar-events',
    '/booking/:path*',
    '/opportunity-posts',
    '/fundraising/view-all-fundraisings',
    '/profile-verification',
    '/view-profiles',
    '/universal',
    '/resources-management',
    '/teams',
    '/teams/:path*',
    '/communities',
    '/communities/:path*',
    '/reward/:path*',
    '/admin-chats/:path*',
    '/admin-blogs/:path*',
    '/admin-accounts/:path*',
  ],
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitForCookies = async () => {
  let retryCount = 0;
  const maxRetries = 10;

  while (retryCount < maxRetries) {
    const token = Cookies.get('token');
    const userData = Cookies.get('userData');

    if (token && userData) {
      return true; // Cookies are set
    }

    retryCount++;
    await sleep(500); // Wait for 1 second before checking again
  }

  return false; // If cookies weren't set after max retries
};
