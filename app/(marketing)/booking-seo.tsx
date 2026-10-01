import type { Metadata } from "next";

const siteUrl = "https://orisuun.com";
const ogImage = `${siteUrl}/og/homepage630.png`;
const twitterImage = `${siteUrl}/og/homepage675.png`;

type BookingSeoEntry = {
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

const professionalFaq = [
  {
    "@type": "Question",
    name: "Do I need a Zoom account?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "No, it's all built-in.",
    },
  },
  {
    "@type": "Question",
    name: "How do you handle cancellation?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Cancellations happen. We all understand. Because we value our professionals' time, we allow our professionals to determine their own cancellation policies, which will be communicated to the businesses before and after they book you. You have the option to charge up to 50% of your booking fee (capped at $250) if the cancellation occurs within your no cancellation window (no greater than 48 hours).",
    },
  },
  {
    "@type": "Question",
    name: "How do founders find me?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "They search our directory by industry, expertise, or specific challenge. If your profile fits their need, they book a slot you've marked as available. You could also be discovered through our many discovery tools, such as community chat, crowdfunding, platform activity feed, and our business development matching system.",
    },
  },
  {
    "@type": "Question",
    name: "Can I decline a booking?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Yes. You have full visibility into the owner's profile and their specific question before the session happens.",
    },
  },
  {
    "@type": "Question",
    name: "How do I set my rates?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "You have total autonomy. Set per-session rates. You also can set rates for ongoing one-on-one sessions.",
    },
  },
  {
    "@type": "Question",
    name: "Can I transition these into long-term clients?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Absolutely. The booking system is a front door. If an owner or founder needs a full audit or ongoing consultation, you handle that through your standard firm engagement.",
    },
  },
  {
    "@type": "Question",
    name: "Is the video platform secure?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Yes. Our built-in video suite uses enterprise-grade encryption to ensure your conversations remain protected.",
    },
  },
  {
    "@type": "Question",
    name: "What fees does Orisuun charge for hosting?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "We charge 3% of the booking fee.",
    },
  },
  {
    "@type": "Question",
    name: "How do I manage my firm's non-compete?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "You have total control over the industries and business sizes you consult for. Our platform allows you to screen every booking to ensure there are no professional conflicts.",
    },
  },
  {
    "@type": "Question",
    name: "What is the average ROI per session?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Our consultants set their own rates, often ranging from $100-$500 per 30-minute sprint, making it one of the highest-leverage ways to utilize your downtime.",
    },
  },
  {
    "@type": "Question",
    name: "Is my data secure?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Yes. We use enterprise-grade, encrypted video and document sharing, built specifically for the high-confidentiality requirements of management consulting.",
    },
  },
  {
    "@type": "Question",
    name: "Can I maintain my firm's confidentiality?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Yes. Many of our consultants list as Independent or under their own LLC while citing their professional history. Our secure video suite ensures your proprietary methods remain private.",
    },
  },
  {
    "@type": "Question",
    name: "Can I charge for my time?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Yes, you can set your own hourly rate or choose to donate your fees to our investment fund.",
    },
  },
  {
    "@type": "Question",
    name: "Is there a minimum time commitment?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "No. You can be available for 1 hour a month or 60. You have total control.",
    },
  },
];

function serviceStructuredData(
  serviceType: string,
  name: string,
  description: string,
  offerCatalogName: string,
  offers: Array<{ name: string; description: string }>,
  faq = professionalFaq,
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
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
      },
      {
        "@type": "FAQPage",
        mainEntity: faq,
      },
    ],
  };
}

export const bookingSeo = {
  bookAnExpert: {
    title: "Book Elite Business Advisors & Mentors | Orisuun",
    description:
      "Get your business questions answered in 30 minutes. Book top-tier strategy consultants, corporate lawyers, and VC investors for on-demand sprints.",
    ogTitle: "Your Most Difficult Business Question, Answered in 30 Minutes.",
    ogDescription:
      "Join 10,000+ Black business owners scaling their businesses. Stop guessing and book 1-on-1 video consultations with verified corporate experts today.",
    path: "/book-an-expert",
    structuredData: serviceStructuredData(
      "On-Demand Business Consultation & Advisory Service",
      "Orisuun Expert Booking System",
      "An on-demand advisory marketplace allowing Black-owned businesses to book 30-minute video consultation sessions directly with verified mentors, investors, corporate lawyers, and strategy consultants.",
      "On-Demand Advisory Sprints",
      [
        {
          name: "Investor Pitch Deck Audits",
          description:
            "Direct fundraising feedback and deck reviews from active venture capitalists and investors who fund businesses.",
        },
        {
          name: "Legal Protection Consultations",
          description:
            "On-demand sessions to discuss trademarking, intellectual property, and business contracts without large retainers.",
        },
        {
          name: "Strategic Scaling Support",
          description:
            "Margin optimization and business operations strategy led by consultants from global top-tier advisory firms.",
        },
      ],
      [
        {
          "@type": "Question",
          name: "Do I need a Zoom account?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, it's all built-in.",
          },
        },
        {
          "@type": "Question",
          name: "Can I record my session?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, call recordings are available and you will have a three-day window after a call to download the video for your own personal records.",
          },
        },
        {
          "@type": "Question",
          name: "What fees does Orisuun charge for hosting?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We charge 3% of the booking fee. You will also be charged an approximately 2% transactional fee from our payment processor.",
          },
        },
        {
          "@type": "Question",
          name: "What if I need to cancel?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cancellations happen. We allow our professionals to determine their own cancellation policies, which will be communicated to you before and after you book. They have the option to charge up to 50% of the booking fee (capped at $250) if you cancel within their no cancellation window (no greater than 48 hours).",
          },
        },
      ],
    ),
  },
  investorDealflow: {
    title: "Monetize Investor Mentorship & Vetted Advice | Orisuun",
    description:
      "Expertise on your terms. Sync your calendar, pre-vet founder profiles, set your own rates, and enforce hard-stop consultation timers.",
    ogTitle: "Gain Early Access to High-Potential Black-Owned Businesses.",
    ogDescription:
      "Beyond mentorship, it's strategic alpha. Set your own calendar rules, offer specialized pitch deck stress-tests, and discover investment opportunities on Orisuun.",
    path: "/investor-dealflow",
    structuredData: serviceStructuredData(
      "Venture Capital Deal Flow & Mentorship Platform",
      "Orisuun Investor Consultation & Sourcing System",
      "An automated booking and sourcing infrastructure enabling venture capitalists, angel investors, and private equity professionals to set consultation rates, screen early-stage founders, and build proprietary deal flow pipelines.",
      "Investor Engagement Features",
      [
        {
          name: "Proprietary Deal Flow Sourcing",
          description:
            "Enables early-stage screening of high-potential Black-owned businesses through 1:1 strategy sessions, pitch deck stress-tests, and cap table audits.",
        },
        {
          name: "Autonomous Calendar Control",
          description:
            "Provides full integration with Google or Outlook calendars, customizable consultation rates, rigid hard-stop session timers, and candidate screening privileges.",
        },
      ],
    ),
  },
  listYourPractice: {
    title: "Monetize Your Advisory Practice & Consulting Time | Orisuun",
    description:
      "Scale your consulting without the admin tax. Productize your legal, tax, or fractional CFO expertise into highly profitable, automated 30-minute sprints.",
    ogTitle: "Scale Your Consulting Practice Without the Admin Tax.",
    ogDescription:
      'Turn "quick questions" into paid strategy sessions. Set your own rates, sync your calendar, and secure upfront payments from a high-intent business ecosystem.',
    path: "/list-your-practice",
    structuredData: serviceStructuredData(
      "Consulting Infrastructure & Professional Lead Generation Platform",
      "Orisuun Professional Practice Booking System",
      "An automated practice management and client discovery infrastructure allowing certified lawyers, CPAs, and fractional strategy consultants to list verified services, configure autonomous billing, and execute encrypted video consultations.",
      "Professional Management Infrastructure",
      [
        {
          name: "Productized Service Sprints",
          description:
            "Enables experts to productize advisory time into structured outcomes including Legal Entity Audits, Tax Gap Scans, IP Protection Reviews, and Fractional CFO Strategy sessions.",
        },
        {
          name: "Automated Billing & Overhead Management",
          description:
            "Protects billable hours via upfront fee collection at booking, integrated secure document sharing, strict session duration control, and custom professional cancellation policies.",
        },
      ],
    ),
  },
  listYourExpertise: {
    title: "Share Executive Expertise on Your Schedule | Orisuun",
    description:
      "Mentorship reimagined. Sync your calendar, choose your own advisory topics, set your rates, and avoid administrative friction with automated tools.",
    ogTitle: "You've Reached the Top. Now Send the Elevator Back Down.",
    ogDescription:
      "Help ambitious founders bypass months of mistakes in a single 30-minute session. Control your availability with strict built-in hard-stop timers.",
    path: "/list-your-expertise",
    structuredData: serviceStructuredData(
      "Executive Mentorship Infrastructure & Impact Tracking Platform",
      "Orisuun Mentor Advisory System",
      "A secure mentorship and advisory management infrastructure allowing experienced executives and industry pioneers to offer structured advice sprints, set custom availability, and track their ecosystem impact.",
      "Mentorship Engagement Features",
      [
        {
          name: "Structured Advisory Sprints",
          description:
            "Enables mentors to list self-serve advisory sessions covering first hire frameworks, supplier diversity navigation, founder burnout audits, and scaling roadmaps.",
        },
        {
          name: "Contribution & Impact Analytics",
          description:
            "Features an interactive contribution dashboard to quantify the total hours contributed and track the collective growth metrics of mentored business owners.",
        },
      ],
    ),
  },
  yourStrategistPractice: {
    title: "Monetize Strategy Consulting & Advisory Downtime | Orisuun",
    description:
      "Scale your advisory practice on your own terms. Avoid firm conflict with advanced calendar controls, upfront pricing, and hard-stop protocol timers.",
    ogTitle: "Independent Strategy Consulting Infrastructure | Orisuun",
    ogDescription:
      "Stay sharp, stay connected, and get paid for your expertise outside the firm. Offer McKinsey-style growth stress-tests and GTM vetting on your terms.",
    path: "/your-strategist-practice",
    structuredData: serviceStructuredData(
      "Management Consulting Infrastructure & Strategic Expert Network",
      "Orisuun Strategy Consultant Booking Platform",
      "A frictionless boardroom infrastructure enabling management consultants and boutique firm alumni to list productized strategic modules, screen for corporate conflicts, and deliver secure video strategy sprints.",
      "Strategic Advisory Capabilities",
      [
        {
          name: "Productized Strategy Sprints",
          description:
            "Enables operators to offer specialized advisory outcomes including Growth Stress-Tests, Go-To-Market (GTM) Vetting, Post-Merger Integration, and Unit Economics Deep-Dives.",
        },
        {
          name: "Sovereign Consulting Infrastructure",
          description:
            "Provides autonomous risk screening, upfront retainer processing, automated session length monitoring with hard-stop protocols, and firm non-compete safety controls.",
        },
      ],
    ),
  },
} satisfies Record<string, BookingSeoEntry>;

export function getBookingMetadata(entry: BookingSeoEntry): Metadata {
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

export function BookingJsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
