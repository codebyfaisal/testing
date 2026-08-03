import React, { useEffect } from "react";
import { siteConfig } from "@/config/siteConfig";
import { seoConfig } from "@/config/seoConfig";

const SEO = ({
  title,
  description,
  keywords,
  image,
  author,
  twitterHandle,
}) => {
  const siteTitle = seoConfig.siteTitle;
  const pageTitle = title
    ? seoConfig.titleTemplate.replace("%s", title)
    : siteTitle;
  const metaDescription = description || seoConfig.description;
  const metaKeywords = keywords || seoConfig.keywords.join(", ");
  const metaAuthor = author || seoConfig.author;
  const metaImage = image || seoConfig.image;
  const metaTwitter = twitterHandle || seoConfig.twitterHandle;
  const canonicalUrl =
    typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    // 1. Title
    document.title = pageTitle;

    // Helper to update meta tags
    const updateMeta = (name, content, attribute = "name") => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to update link tags (canonical)
    const updateLink = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Meta Tags
    updateMeta("description", metaDescription);
    updateMeta("keywords", metaKeywords);
    updateMeta("author", metaAuthor);

    // 3. Open Graph
    updateMeta("og:title", pageTitle, "property");
    updateMeta("og:description", metaDescription, "property");
    updateMeta("og:image", metaImage, "property");
    updateMeta("og:url", canonicalUrl, "property");
    updateMeta("og:type", "website", "property");

    // 4. Twitter
    updateMeta("twitter:title", pageTitle);
    updateMeta("twitter:description", metaDescription);
    updateMeta("twitter:image", metaImage);
    updateMeta("twitter:card", "summary_large_image");
    if (metaTwitter) updateMeta("twitter:creator", metaTwitter);

    // 5. Canonical
    updateLink("canonical", canonicalUrl);

    // 6. Hreflang
    const updateHreflang = (lang, href) => {
      let element = document.querySelector(
        `link[rel="alternate"][hreflang="${lang}"]`,
      );
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "alternate");
        element.setAttribute("hreflang", lang);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };
    updateHreflang("en", canonicalUrl);
  }, [
    pageTitle,
    metaDescription,
    metaKeywords,
    metaAuthor,
    metaImage,
    metaTwitter,
    canonicalUrl,
  ]);

  return null;
};

export default SEO;
