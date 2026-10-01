import type { Metadata } from "next";

const siteUrl = "https://orisuun.com";
const ogImage = `${siteUrl}/og/homepage630.png`;
const twitterImage = `${siteUrl}/og/homepage675.png`;

type MatchingSeoEntry = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  path: string;
  structuredData: Record<string, unknown>;
};

const provider = {
  "@type": "Organization",
  name: "Orisuun",
  url: siteUrl,
};

function serviceStructuredData(
  serviceType: string,
  name: string,
  description: string,
  offerCatalogName: string,
  offers: Array<{ name: string; description: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType,
    provider,
    name,
    description,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: offerCatalogName,
      itemListElement: offers.map((offer) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: offer.name,
          description: offer.description,
        },
      })),
    },
  };
}

export const matchingSeo = {
  findACofounder: {
    title: "Find Your Cofounder: Professional Matchmaking | Orisuun",
    description:
      "Don't build alone. Use Orisuun's intelligent matching engine to connect with visionary Black founders and complementary technical or operational partners.",
    ogTitle: "Don't Build Alone. Build Better. | Orisuun Cofounder Matching",
    ogDescription:
      "Great companies are built on great partnerships. Discover our intelligent matching engine designed to connect visionary founders with elite tactical talent.",
    path: "/find-a-cofounder",
    structuredData: serviceStructuredData(
      "Cofounder Matching & Professional Partnership Engine",
      "Orisuun Cofounder Matching Engine",
      "An intelligent matchmaking tool that connects visionary Black entrepreneurs and solo founders with technical, operational, and strategic cofounders based on skill compatibility and algorithmic relevancy scoring.",
      "Matchmaking Capabilities",
      [
        {
          name: "Algorithmic Precision Ranking",
          description:
            "Analyzes deep profile insights and active posts to rank and connect complementary skill sets like visionaries, operators, hackers, and hustlers.",
        },
        {
          name: "Dual-Sided Discovery",
          description:
            "Proactively surfaces relevant cofounder opportunities for both solo venture creators and highly skilled professionals seeking new equity ventures.",
        },
      ],
    ),
  },
  findABoardMember: {
    title: "Executive Board Matching & Placement Tool | Orisuun",
    description:
      "High-stakes matching handled by data. Post your specific corporate boardroom gaps or find your next executive board seat based on true industry relevance.",
    ogTitle: "Precision Matching for the Modern Boardroom. | Orisuun",
    ogDescription:
      "The right board member transforms a company's trajectory. Cross-reference boardroom gaps against elite professional DNA with our data-driven matching tool.",
    path: "/find-a-board-member",
    structuredData: serviceStructuredData(
      "Executive Board Placement & Governance Matchmaking",
      "Orisuun Board Member Matching Engine",
      "A proprietary data-driven governance matching tool that cross-references business needs against deep-profile expertise to place corporate leaders into active board member seats based on relevance and shared vision.",
      "Boardroom Matching Capabilities",
      [
        {
          name: "Boardroom Gap Alignment",
          description:
            "Allows companies to post specific governance gaps like ESG, Finance, or Tech, and receive a curated, scored list of candidates ready to serve.",
        },
        {
          name: "Two-Way Boardroom Discovery",
          description:
            "Enables automatic profile surfacing for executive leaders based on their unique professional DNA while granting both businesses and individuals the power to search and filter.",
        },
      ],
    ),
  },
} satisfies Record<string, MatchingSeoEntry>;

export function getMatchingMetadata(entry: MatchingSeoEntry): Metadata {
  const url = `${siteUrl}${entry.path}`;

  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: entry.ogTitle,
      description: entry.ogDescription,
      url,
      siteName: "Orisuun",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: entry.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.ogTitle,
      description: entry.ogDescription,
      images: [twitterImage],
    },
    metadataBase: new URL(siteUrl),
  };
}

export function MatchingJsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
