/**
 * Structured Data Utility Functions
 * 
 * Use these functions to generate schema.org JSON-LD structured data
 * for different page types. Each function returns a complete @graph structure.
 */

/**
 * Base organization schema (shared across all pages)
 */
/**
 * Generate Organization schema with optional overrides
 * @param {Object} [opts]
 * @param {string} [opts.logoUrl]
 * @param {string} [opts.audioId] - e.g., "https://orisuun.com/about#pronunciation-audio"
 */
export const getOrganizationSchema = (opts = {}) => {
  const org = {
    "@type": "Organization",
    "@id": "https://orisuun.com/#organization",
    "name": "Orisuun",
    "url": "https://orisuun.com",
    "logo": {
      "@type": "ImageObject",
      "url": opts.logoUrl || "https://orisuun.com/logo.svg"
    },
    "description": "Orisuun is a community-driven platform connecting Black-owned businesses with investors, mentors, clients, and professionals to fuel growth and opportunity.",
    "sameAs": [
      "https://www.linkedin.com/company/orisuun",
      "https://www.instagram.com/orisuun/",
      "https://www.youtube.com/@orisuun"
    ]
  };
  if (opts.audioId) {
    org.audio = { "@id": opts.audioId };
  }
  return org;
};

/**
 * Base website schema (shared across all pages)
 */
export const getWebsiteSchema = () => ({
  "@type": "WebSite",
  "@id": "https://orisuun.com/#website",
  "url": "https://orisuun.com",
  "name": "Orisuun",
  "publisher": {
    "@id": "https://orisuun.com/#organization"
  }
});

/**
 * Generate Person schema (e.g., founder, team member)
 * @param {Object} config
 * @param {string} config.url - Person's profile URL
 * @param {string} config.name
 * @param {string} [config.jobTitle]
 * @param {string} [config.description]
 * @param {string[]} [config.sameAs] - Links to LinkedIn, etc.
 */
export const getPersonSchema = (config = {}) => {
  const person = {
    "@type": "Person",
    "@id": `${config.url}#person`,
    "name": config.name || "Bek Sunuu",
    "url": config.url,
  };
  if (config.jobTitle) person.jobTitle = config.jobTitle;
  if (config.description) person.description = config.description;
  person.worksFor = { "@id": "https://orisuun.com/#organization" };
  person.founderOf = { "@id": "https://orisuun.com/#organization" };
  if (config.sameAs && config.sameAs.length > 0) {
    person.sameAs = config.sameAs;
  }
  return person;
};

/**
 * Generate WebPage schema
 * @param {Object} config - Configuration object
 * @param {string} config.url - Full page URL
 * @param {string} config.name - Page title/name
 * @param {string} config.description - Page description
 * @param {string} config.pageId - Unique page identifier (for @id)
 * @returns {Object} WebPage schema
 */
export const getWebPageSchema = (config) => ({
  "@type": "WebPage",
  // Use the page URL as the base for the @id, then add the fragment
  "@id": `${config.url}#${config.pageId || 'webpage'}`,
  "url": config.url,
  "name": config.name,
  "description": config.description,
  "isPartOf": {
    "@id": "https://orisuun.com/#website"
  },
  "about": {
    "@id": "https://orisuun.com/#organization"
  }
});

/**
 * Generate AudioObject schema
 * @param {Object} config
 * @param {string} config.pageUrl - The page URL to base the @id on
 * @param {string} [config.id] - Fragment id, defaults to 'pronunciation-audio'
 * @param {string} [config.name]
 * @param {string} [config.description]
 * @param {string} config.contentUrl
 * @param {string} [config.encodingFormat]
 */
export const getAudioObjectSchema = (config = {}) => ({
  "@type": "AudioObject",
  "@id": `${config.pageUrl}#${config.id || 'pronunciation-audio'}`,
  "name": config.name || "Orisuun pronunciation",
  "description": config.description || "Audio pronunciation guide for the name Orisuun.",
  "contentUrl": config.contentUrl,
  "encodingFormat": config.encodingFormat || "audio/mpeg"
});

/** * Generate Blog schema
 * @param {Object} config
 * @param {string} config.pageUrl
 * @param {string} [config.name]
 */
export const getBlogSchema = (config = {}) => ({
  "@type": "Blog",
  "@id": `${config.pageUrl}#blog`,
  "name": config.name || "Orisuun Insights",
  "publisher": {
    "@id": "https://orisuun.com/#organization"
  }
});

/**
 * Generate CollectionPage schema (for blog index/listing pages)
 * @param {Object} config
 * @param {string} config.pageUrl
 * @param {string} config.pageTitle
 * @param {string} config.pageDescription
 */
export const getCollectionPageSchema = (config = {}) => ({
  "@type": "CollectionPage",
  "@id": `${config.pageUrl}#webpage`,
  "url": config.pageUrl,
  "name": config.pageTitle,
  "description": config.pageDescription,
  "isPartOf": {
    "@id": "https://orisuun.com/#website"
  },
  "mainEntity": {
    "@id": `${config.pageUrl}#blog`
  }
});

/**
 * Generate BlogPosting schema
 * @param {Object} config
 * @param {string} config.pageUrl
 * @param {string} config.title
 * @param {string} config.description
 * @param {string} config.datePublished - YYYY-MM-DD
 * @param {string} [config.dateModified] - YYYY-MM-DD
 * @param {string} config.authorName
 * @param {string} [config.image] - Hero image URL
 */
export const getBlogPostingSchema = (config = {}) => ({
  "@type": "BlogPosting",
  "@id": `${config.pageUrl}#blogposting`,
  "headline": config.title,
  "description": config.description,
  "datePublished": config.datePublished,
  "dateModified": config.dateModified || config.datePublished,
  "mainEntityOfPage": {
    "@id": `${config.pageUrl}#webpage`
  },
  "publisher": {
    "@id": "https://orisuun.com/#organization"
  },
  "author": {
    "@type": "Person",
    "name": config.authorName
  },
  ...(config.image && { "image": [config.image] })
});

/** * Generate FAQPage schema
 * @param {Array} faqs - Array of FAQ objects with { question, content } shape
 * @param {string} [pageUrl] - Page URL for @id (defaults to root)
 * @returns {Object} FAQPage schema
 */
export const getFAQPageSchema = (faqs = [], pageUrl = 'https://orisuun.com') => ({
  "@type": "FAQPage",
  "@id": `${pageUrl}#faq`,
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      // Remove markdown links: [text](url) → text
      // Remove newlines for cleaner schema
      "text": faq.content
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/\n/g, ' ')
        .trim()
    }
  }))
});

/**
 * @typedef {Object} VideoConfig
 * @property {string} url - Video embed/content URL
 * @property {string} [name] - Video title
 * @property {string} [description] - Video description
 * @property {string} [thumbnailUrl] - Video thumbnail URL
 * @property {string} [uploadDate] - ISO 8601 date string
 * @property {string} [duration] - ISO 8601 duration (e.g., PT3M33S)
 */

/**
 * Generate VideoObject schema
 * @param {Object} config
 * @param {string} config.pageUrl - Base page URL
 * @param {string} config.videoId - Unique video identifier (e.g., 'video-1')
 * @param {string} config.name - Video title
 * @param {string} config.description - Video description
 * @param {string} config.contentUrl - YouTube/video URL
 * @param {string} [config.embedUrl] - Embed URL
 * @param {string} [config.creatorId] - Creator @id reference
 */
export const getVideoObjectByIdSchema = (config = {}) => {
  const video = {
    "@type": "VideoObject",
    "@id": `${config.pageUrl}#${config.videoId}`,
    "name": config.name,
    "description": config.description,
    "contentUrl": config.contentUrl,
  };
  if (config.embedUrl) video.embedUrl = config.embedUrl;
  if (config.thumbnailUrl) video.thumbnailUrl = config.thumbnailUrl;
  if (config.uploadDate) video.uploadDate = config.uploadDate;
  if (config.creatorId) video.creator = { "@id": config.creatorId };
  return video;
};

/**
 * Generate VideoObject schema (legacy - for single video with thumbnailUrl)
 * @param {VideoConfig} config - Video configuration
 * @returns {Object} VideoObject schema
 */
export const getVideoObjectSchema = (config) => ({
  "@type": "VideoObject",
  "@id": "https://orisuun.com/#demo-video",
  "name": config.name || "Orisuun Intro",
  "description": config.description || "A short demo showcasing how Orisuun helps Black entrepreneurs discover business resources.",
  "thumbnailUrl": config.thumbnailUrl,
  "uploadDate": config.uploadDate,
  "duration": config.duration,
  "contentUrl": config.url,
  "embedUrl": config.url,
  "publisher": {
    "@id": "https://orisuun.com/#organization"
  }
});

/**
 * @typedef {Object} OfferConfig
 * @property {string} url
 * @property {string} name
 * @property {string} [priceCurrency]
 * @property {string|number} price
 * @property {string} [availability]
 *
 * @typedef {Object} ProductConfig
 * @property {string} url - Base page URL to anchor the product @id
 * @property {string} [name] - Product name
 * @property {string} [description] - Product description
 * @property {OfferConfig[]} [offers]
 * @property {Array<{name:string, value:string}>} [additionalProperty] - Product features/properties
 *
 * Generate Product schema with optional Offers
 * @param {ProductConfig} config - Product configuration
 * @returns {Object} Product schema
 */
export const getProductSchema = (config = {}) => {
  const product = {
    "@type": "Product",
    "@id": `${config.url}#${config.productId || 'membership'}`,
    "name": config.name || "Orisuun Membership",
    "description": config.description || "Access all resources, tools, and opportunities on Orisuun.",
  };

  if (config.brand !== false) {
    product.brand = { "@id": "https://orisuun.com/#organization" };
  }

  if (Array.isArray(config.offers) && config.offers.length > 0) {
    product.offers = config.offers.map((offer) => ({
      "@type": "Offer",
      "url": offer.url,
      "name": offer.name,
      "priceCurrency": offer.priceCurrency || "USD",
      "price": offer.price,
      "availability": offer.availability || "https://schema.org/InStock",
    }));
  }

  if (Array.isArray(config.additionalProperty) && config.additionalProperty.length > 0) {
    product.additionalProperty = config.additionalProperty.map((prop) => ({
      "@type": "PropertyValue",
      "name": prop.name,
      "value": prop.value,
    }));
  }

  return product;
};

/**
 * @typedef {Object} CatalogOfferConfig
 * @property {string} id - Unique offer ID fragment (e.g., 'standard-offer')
 * @property {string} name - Offer name (e.g., 'Standard')
 * @property {string} url - Offer detail URL
 * @property {string} [availability] - Schema.org availability URL
 * @property {string} itemOfferedId - Product @id reference
 *
 * @typedef {Object} OfferCatalogConfig
 * @property {string} pageUrl - Base page URL
 * @property {string} [name] - Catalog name
 * @property {CatalogOfferConfig[]} offers - Array of offers
 *
 * Generate OfferCatalog schema with Offer items
 * @param {OfferCatalogConfig} config - Catalog configuration
 * @returns {Object} OfferCatalog schema
 */
export const getOfferCatalogSchema = (config = {}) => ({
  "@type": "OfferCatalog",
  "@id": `${config.pageUrl}#offer-catalog`,
  "name": config.name || "Orisuun Plans",
  "itemListElement": (config.offers || []).map((offer) => ({
    "@type": "Offer",
    "@id": `${config.pageUrl}#${offer.id}`,
    "name": offer.name,
    "url": offer.url,
    "availability": offer.availability || "https://schema.org/InStock",
    "itemOffered": {
      "@id": offer.itemOfferedId
    },
    "seller": {
      "@id": "https://orisuun.com/#organization"
    }
  }))
});

/**
 * @typedef {Object} InvestmentFundConfig
 * @property {string} pageUrl - Base page URL
 * @property {string} [name] - Fund name
 * @property {string} [description] - Fund description
 * @property {Array<{name:string, value:string}>} [additionalProperty] - Fund properties (e.g., capital deployment methods)
 *
 * Generate InvestmentFund schema
 * @param {InvestmentFundConfig} config - Fund configuration
 * @returns {Object} InvestmentFund schema
 */
export const getInvestmentFundSchema = (config = {}) => {
  const fund = {
    "@type": "InvestmentFund",
    "@id": `${config.pageUrl}#investment-fund`,
    "name": config.name || "Orisuun Black Wealth Fund",
    "description": config.description || "A fund focused on supporting Black wealth creation through grants, direct investments, and other capital deployment approaches.",
    "provider": {
      "@id": "https://orisuun.com/#organization"
    }
  };

  if (Array.isArray(config.additionalProperty) && config.additionalProperty.length > 0) {
    fund.additionalProperty = config.additionalProperty.map((prop) => ({
      "@type": "PropertyValue",
      "name": prop.name,
      "value": prop.value,
    }));
  }

  return fund;
};

/**
 * @typedef {Object} StructuredDataConfig
 * @property {string} pageId - Unique page identifier
 * @property {string} pageUrl - Full page URL
 * @property {string} pageTitle - Page title
 * @property {string} pageDescription - Page description
 * @property {{question:string, content:string}[]} [faqs] - Optional: FAQ array for FAQPage schema
 * @property {VideoConfig} [video] - Optional: Video config for VideoObject schema
 * @property {Object[]} [videos] - Optional: Array of video configs with videoId, name, description, contentUrl, embedUrl
 * @property {Omit<ProductConfig, 'url'>} [product] - Optional: Product config (url inferred from pageUrl)
 * @property {Object} [audio] - Optional: AudioObject config { id, name, description, contentUrl, encodingFormat }
 * @property {Object} [person] - Optional: Person config { name, jobTitle, description, sameAs[] }
 * @property {string} [orgLogoUrl] - Optional: override organization logo URL
 * @property {boolean} [isBlogIndex] - True if this is a blog index/collection page
 * @property {Object} [blogPost] - Optional: BlogPosting config { title, description, datePublished, dateModified, authorName, image }
 * @property {Object} [offerCatalog] - Optional: OfferCatalog config { name, offers[] }
 * @property {Object} [investmentFund] - Optional: InvestmentFund config { name, description, additionalProperty[] }
 * @property {Object} [potentialAction] - Optional: PotentialAction for WebPage (e.g., DonateAction)
 *
 * Generate complete structured data @graph for a page
 * @param {StructuredDataConfig} config - Configuration object
 * @returns {Object} Complete structured data with @graph
 */
export const getStructuredData = (config) => {
  const graph = [];

  // Add Audio first if provided so Organization can reference it
  let audioId;
  if (config.audio && config.audio.contentUrl) {
    const audio = getAudioObjectSchema({ pageUrl: config.pageUrl, ...config.audio });
    graph.push(audio);
    audioId = audio['@id'];
  }

  // Add Person if provided so Organization can reference as founder
  let personId;
  if (config.person) {
    const person = getPersonSchema({ url: config.pageUrl, ...config.person });
    graph.push(person);
    personId = person['@id'];
  }

  // Add Organization with optional founder and audio references
  const orgOpts = { logoUrl: config.orgLogoUrl, audioId };
  const org = getOrganizationSchema(orgOpts);
  if (personId) {
    org.founder = { "@id": personId };
  }
  graph.push(org, getWebsiteSchema());

  // Add Videos if provided (new format with videoId)
  if (config.videos && Array.isArray(config.videos)) {
    config.videos.forEach((videoConfig) => {
      const video = getVideoObjectByIdSchema({
        pageUrl: config.pageUrl,
        ...videoConfig,
        creatorId: personId, // Videos created by the person if available
      });
      graph.push(video);
    });
  }

  // Add single Video if provided (legacy format)
  if (config.video && !config.videos) {
    graph.push(getVideoObjectSchema(config.video));
  }

  // Add external Product reference if provided (for cross-page references)
  if (config.externalProduct) {
    graph.push(config.externalProduct);
  }

  // Add Product if product config provided
  if (config.product) {
    graph.push(getProductSchema({ url: config.pageUrl, ...config.product }));
  }

  // Add OfferCatalog if provided
  if (config.offerCatalog) {
    graph.push(getOfferCatalogSchema({ pageUrl: config.pageUrl, ...config.offerCatalog }));
  }

  // Add InvestmentFund if provided
  if (config.investmentFund) {
    graph.push(getInvestmentFundSchema({ pageUrl: config.pageUrl, ...config.investmentFund }));
  }

  // Add FAQPage if FAQs provided
  if (config.faqs && config.faqs.length > 0) {
    graph.push(getFAQPageSchema(config.faqs, config.pageUrl));
  }

  // Add Blog schema if this is a blog index page
  if (config.isBlogIndex) {
    graph.push(getBlogSchema({ pageUrl: config.pageUrl }));
  }

  // Add BlogPosting if this is a blog post
  if (config.blogPost) {
    graph.push(getBlogPostingSchema({ pageUrl: config.pageUrl, ...config.blogPost }));
  }

  // Add WebPage or CollectionPage (should be near the end)
  let webPage;
  if (config.isBlogIndex) {
    webPage = getCollectionPageSchema({
      pageUrl: config.pageUrl,
      pageTitle: config.pageTitle,
      pageDescription: config.pageDescription
    });
  } else {
    webPage = getWebPageSchema({
      url: config.pageUrl,
      name: config.pageTitle,
      description: config.pageDescription,
      pageId: config.pageId
    });
  }

  // If page has a person (about section), update about reference
  if (personId && config.pageUrl.includes('founder')) {
    webPage.about = { "@id": personId };
  }

  // If page is about a product (what-we-offer), update about reference
  if (config.product && config.pageUrl.includes('what-we-offer')) {
    webPage.about = { "@id": `${config.pageUrl}#${config.product.productId || 'product'}` };
  }

  // If page is pricing page with external product reference, update about reference
  if (config.externalProduct && config.pageUrl.includes('pricing')) {
    webPage.about = { "@id": config.externalProduct['@id'] };
  }

  // If page is pricing page with product, update about reference
  if (config.product && config.pageUrl.includes('pricing')) {
    webPage.about = { "@id": `${config.pageUrl}#${config.product.productId || 'product'}` };
  }

  // If page has InvestmentFund, update about reference
  if (config.investmentFund) {
    webPage.about = { "@id": `${config.pageUrl}#investment-fund` };
  }

  // If page has offerCatalog, update mainEntity reference
  if (config.offerCatalog) {
    webPage.mainEntity = { "@id": `${config.pageUrl}#offer-catalog` };
  }

  // If page is a blog post, update mainEntity reference
  if (config.blogPost) {
    webPage.mainEntity = { "@id": `${config.pageUrl}#blogposting` };
  }

  // If page has potentialAction, add it to WebPage
  if (config.potentialAction) {
    webPage.potentialAction = config.potentialAction;
  }

  // If page has FAQs, add hasPart reference
  if (config.faqs && config.faqs.length > 0) {
    webPage.hasPart = { "@id": `${config.pageUrl}#faq` };
  }

  // If page has videos, add hasPart references
  if (config.videos && Array.isArray(config.videos) && config.videos.length > 0) {
    webPage.hasPart = config.videos.map((v) => ({
      "@id": `${config.pageUrl}#${v.videoId}`
    }));
  }

  graph.push(webPage);

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
};
