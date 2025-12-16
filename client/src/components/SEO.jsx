import React from "react";
import { seoConfig } from "../config/seoConfig";

const SEO = ({
  title,
  description,
  keywords,
  image,
  author,
  twitterHandle,
}) => {
  // Hierarchy Logic

  // 1. Site Title (Base)
  const siteTitle = seoConfig.siteTitle;

  // 2. Page Title (Displayed in Tab)
  // If title prop exists, use template: "Page | Site"
  // If not, use siteTitle default.
  // We can also allow a full override if needed, but standard template is good.
  const pageTitle = title
    ? seoConfig.titleTemplate.replace("%s", title)
    : siteTitle;

  // 3. Description
  const metaDescription = description || seoConfig.description;

  // 4. Keywords
  const metaKeywords = keywords || seoConfig.keywords.join(", ");

  // 5. Author
  const metaAuthor = author || seoConfig.author;

  // 6. Image
  const metaImage = image || seoConfig.image;

  // 7. Twitter
  const metaTwitter = twitterHandle || seoConfig.twitterHandle;

  // 8. Canonical
  const canonicalUrl =
    typeof window !== "undefined" ? window.location.href : "";

  // 9. Robots
  const metaRobots = "index, follow";

  // React 19 Native Metadata
  // The tags below will be automatically hoisted to the <head>
  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={metaAuthor} />
      <meta name="robots" content={metaRobots} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      {metaTwitter && <meta name="twitter:creator" content={metaTwitter} />}
    </>
  );
};

export default SEO;
