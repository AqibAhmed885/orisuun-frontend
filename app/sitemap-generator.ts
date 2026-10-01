import type { MetadataRoute } from "next";
import { GENERATED_SITEMAP_ROUTES } from "./generated-sitemap-routes";

export const revalidate = 3600;

export type SitemapUrl = {
  url: string;
  priority: number;
};

const EXCLUDED_SITEMAP_ROUTE_PREFIXES = [
  "/signup-thank-you",
  "/free/signup",
  "/free/signup-thank-you",
  "/forgot-password",
  "/reset-password",
  "/payments",
  "/payment",
];

export function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "https://orisuun.com";

  return siteUrl.replace(/\/+$/, "");
}

export function escapeXml(unsafe: string) {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function getStaticPageRoutes() {
  return GENERATED_SITEMAP_ROUTES.filter((routePath) =>
    !EXCLUDED_SITEMAP_ROUTE_PREFIXES.some(
      (prefix) => routePath === prefix || routePath.startsWith(`${prefix}/`),
    ),
  );
}

export function getSitemapUrls(): SitemapUrl[] {
  const siteUrl = getSiteUrl();

  return getStaticPageRoutes().map((routePath) => ({
    url: routePath === "/" ? `${siteUrl}/` : `${siteUrl}${routePath}`,
    priority: routePath === "/" ? 1 : 0.7,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapUrls().map(({ url }) => ({ url }));
}
